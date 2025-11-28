const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();

const path = require("path");
   app.use("/images", express.static(path.join(__dirname, "images"), {
       setHeaders: (res) => {
           res.set('Access-Control-Allow-Origin', '*');
       }
   }));
const PORT = process.env.PORT || 3000;

// MongoDB Connection
let db;
const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'afterschool';

// Connect to MongoDB using native driver
MongoClient.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(client => {
    console.log('✅ Connected to MongoDB Atlas');
    db = client.db(dbName);
})
.catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
});

// Middleware

// Logger Middleware - logs all requests
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    console.log('Request Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', req.body);
    }
    next();
});

// CORS Middleware
   app.use(cors({
       origin: [
           'https://sworup33.github.io',
           'https://sworup33.github.io/After-School_Classes_Booking_System-Frontend/'
       ],
       credentials: true
   }));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Middleware - serve lesson images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Alternative static route
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'After-School Classes Booking System API',
        version: '1.0.0',
        endpoints: {
            lessons: 'GET /lessons - Get all lessons',
            lessonById: 'GET /lessons/:id - Get lesson by ID',
            createOrder: 'POST /order - Create new order',
            updateLesson: 'PUT /lessons/:id - Update lesson spaces',
            search: 'GET /search?query=term - Search lessons'
        }
    });
});

// GET /lessons - Get all lessons
app.get('/lessons', async (req, res) => {
    try {
        const lessons = await db.collection('lessons').find({}).toArray();
        // Rewrite image paths to full Render URL
        const baseImageUrl = 'https://after-school-classes-booking-system.onrender.com';
        lessons.forEach(lesson => {
            if (lesson.image && lesson.image.startsWith('/images/')) {
                lesson.image = baseImageUrl + lesson.image;
            }
        });
        res.json(lessons);
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ 
            error: 'Failed to fetch lessons',
            message: error.message 
        });
    }
});

// GET /lessons/:id - Get lesson by ID
app.get('/lessons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ 
                error: 'Invalid lesson ID format' 
            });
        }
        
        const lesson = await db.collection('lessons').findOne({ 
            _id: new ObjectId(id) 
        });
        
        if (!lesson) {
            return res.status(404).json({ 
                error: 'Lesson not found' 
            });
        }
        
        res.json(lesson);
    } catch (error) {
        console.error('Error fetching lesson:', error);
        res.status(500).json({ 
            error: 'Failed to fetch lesson',
            message: error.message 
        });
    }
});

// POST /order - Create new order
app.post('/order', async (req, res) => {
    try {
        const { name, phone, lessons, totalPrice } = req.body;
        
        // Validation
        if (!name || !phone || !lessons || !Array.isArray(lessons) || lessons.length === 0) {
            return res.status(400).json({ 
                error: 'Invalid order data. Required: name, phone, lessons (array)' 
            });
        }
        
        // Validate name (letters and spaces only)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ 
                error: 'Name must contain only letters and spaces' 
            });
        }
        
        // Validate phone (digits only)
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ 
                error: 'Phone must contain only digits' 
            });
        }
        
        // Create order document
        const order = {
            name,
            phone,
            lessons,
            totalPrice: totalPrice || lessons.reduce((sum, l) => sum + (l.price || 0), 0),
            orderDate: new Date(),
            status: 'pending'
        };
        
        // Insert order into database
        const result = await db.collection('orders').insertOne(order);
        
        res.status(201).json({
            message: 'Order created successfully',
            orderId: result.insertedId,
            order: {
                ...order,
                _id: result.insertedId
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            error: 'Failed to create order',
            message: error.message 
        });
    }
});

// PUT /lessons/:id - Update lesson (typically to update spaces)
app.put('/lessons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ 
                error: 'Invalid lesson ID format' 
            });
        }
        
        // Validate that spaces is a number if provided
        if (updateData.spaces !== undefined) {
            const spaces = parseInt(updateData.spaces);
            if (isNaN(spaces) || spaces < 0) {
                return res.status(400).json({ 
                    error: 'Spaces must be a non-negative number' 
                });
            }
            updateData.spaces = spaces;
        }
        
        // Update the lesson
        const result = await db.collection('lessons').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        );
        
        if (!result.value) {
            return res.status(404).json({ 
                error: 'Lesson not found' 
            });
        }
        
        res.json({
            message: 'Lesson updated successfully',
            lesson: result.value
        });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ 
            error: 'Failed to update lesson',
            message: error.message 
        });
    }
});

// GET /search?query= - Search lessons (Optional)
app.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ 
                error: 'Search query is required' 
            });
        }
        
        // Search in subject and location fields (case-insensitive)
        const searchRegex = new RegExp(query, 'i');
        
        const lessons = await db.collection('lessons').find({
            $or: [
                { subject: searchRegex },
                { location: searchRegex }
            ]
        }).toArray();
        
        res.json(lessons);
    } catch (error) {
        console.error('Error searching lessons:', error);
        res.status(500).json({ 
            error: 'Failed to search lessons',
            message: error.message 
        });
    }
});

// GET /orders - Get all orders (bonus endpoint)
app.get('/orders', async (req, res) => {
    try {
        const orders = await db.collection('orders').find({}).toArray();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            error: 'Failed to fetch orders',
            message: error.message 
        });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.url 
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
    console.log('\n⏳ Shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
