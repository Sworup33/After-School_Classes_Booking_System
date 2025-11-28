const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb+srv://subedisworup23_db_user:Gsas%402025hub@cluster0.j7zvbeo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'afterschool';

async function importData() {
    const client = new MongoClient(uri);
    
    try {
        console.log('Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('✅ Connected successfully!');
        
        const db = client.db(dbName);
        
        // Import lessons
        const lessonsPath = path.join(__dirname, '..', 'mongodb', 'lessons.json');
        const lessonsData = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
        
        // Convert $oid format to ObjectId
        const { ObjectId } = require('mongodb');
        const lessons = lessonsData.map(lesson => ({
            ...lesson,
            _id: new ObjectId(lesson._id.$oid)
        }));
        
        // Clear existing data
        await db.collection('lessons').deleteMany({});
        console.log('Cleared existing lessons...');
        
        // Insert lessons
        const result1 = await db.collection('lessons').insertMany(lessons);
        console.log(`✅ Imported ${result1.insertedCount} lessons`);
        
        // Import orders
        const ordersPath = path.join(__dirname, '..', 'mongodb', 'orders.json');
        const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
        
        const orders = ordersData.map(order => ({
            ...order,
            _id: new ObjectId(order._id.$oid),
            orderDate: new Date(order.orderDate.$date)
        }));
        
        // Clear existing data
        await db.collection('orders').deleteMany({});
        console.log('Cleared existing orders...');
        
        // Insert orders
        const result2 = await db.collection('orders').insertMany(orders);
        console.log(`✅ Imported ${result2.insertedCount} orders`);
        
        console.log('\n🎉 Data import complete!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('Connection closed.');
    }
}

importData();
