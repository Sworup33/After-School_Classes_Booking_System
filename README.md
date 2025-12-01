# After-School Classes Booking System

**Middlesex University - CST3144 Full Stack Web Development Coursework**

A complete full-stack booking system for after-school classes built with Vue.js, Express.js, and MongoDB Atlas.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- Python 3 (for frontend server)
- MongoDB Atlas account

### 1. Clone Repository
```bash
git clone https://github.com/Sworup33/After-School_Classes_Booking_System.git
cd After-School_Classes_Booking_System
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=afterschool
PORT=3000
```

Import data to MongoDB:
```bash
npm run seed
```

Start backend:
```bash
npm start
```
Backend runs at: `https://after-school-classes-booking-system.onrender.com`

### 3. Frontend Setup
```bash
cd frontend
python -m http.server 8080
```
Frontend runs at: `https://sworup33.github.io/After-School_Classes_Booking_System-Frontend/`

---

## 📁 Project Structure

```
After-School_Classes_Booking_System/
├── frontend/                # Vue.js Frontend
│   ├── index.html          # Main HTML
│   ├── main.js             # Vue app
│   ├── styles.css          # Styles
│   └── images/             # Lesson images
├── backend/                 # Express.js Backend
│   ├── server.js           # Main server
│   ├── package.json        # Dependencies
│   ├── .env               # Config (create this)
│   ├── import-data.js      # Data import script
│   └── public/images/      # Static images
├── mongodb/                 # MongoDB Data
│   ├── lessons.json        # 10 lessons
│   └── orders.json         # Sample orders
└── postman/                 # API Testing
    └── *.postman_collection.json
```

---

## ✅ Features

### Frontend (Vue.js)
- ✅ Display 10 after-school classes
- ✅ Sort by Subject/Location/Price/Spaces (Ascending/Descending)
- ✅ Real-time search
- ✅ Add to cart with space tracking
- ✅ Shopping cart with remove functionality
- ✅ Form validation (Name: letters only, Phone: digits only)
- ✅ Toggle between Lessons ↔ Cart view
- ✅ Responsive Bootstrap design

### Backend (Express.js + MongoDB)
- ✅ RESTful API with Express.js
- ✅ MongoDB Atlas integration (Native driver, NO Mongoose)
- ✅ CORS enabled
- ✅ Logger middleware
- ✅ Static file serving
- ✅ **Endpoints:**
  - `GET /lessons` - Get all lessons
  - `POST /order` - Create order
  - `PUT /lessons/:id` - Update lesson
  - `GET /search?query=` - Search lessons

---

## 🌐 Deployment

### Deploy Backend (Render.com)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Render.com Setup**
- Go to [render.com](https://render.com)
- New Web Service → Connect GitHub repo
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

3. **Environment Variables** (in Render dashboard)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=afterschool
NODE_ENV=production
```

4. **Deploy** - Render will auto-deploy
- Your API: `https://after-school-classes-booking-system.onrender.com`

### Deploy Frontend (GitHub Pages)

1. **GitHub Pages Setup**
- Repository Settings → Pages
- Source: `main` branch
- Folder: `/frontend` or `/ (root)`
- Save

2. **Update API URL** in `frontend/main.js`:
```javascript
apiUrl: 'https://after-school-classes-booking-system.onrender.com'
```

3. **Push changes**
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

Your site: `https://sworup33.github.io/After-School_Classes_Booking_System-Frontend/`
Project repo: https://github.com/Sworup33/After-School_Classes_Booking_System.git
Frontend repo: https://github.com/Sworup33/After-School_Classes_Booking_System-Frontend.git

---

## 🧪 Testing

### Test with Postman
1. Import `postman/After-School-Classes-API.postman_collection.json`
2. Set `baseUrl` variable to `http://localhost:3000`
3. Run all requests

### Manual Testing
- ✅ View all lessons
- ✅ Sort by different fields
- ✅ Search functionality
- ✅ Add to cart (spaces reduce)
- ✅ Remove from cart (spaces restore)
- ✅ Form validation
- ✅ Submit order

---

## 📊 API Documentation

### GET /lessons
```bash
curl http://localhost:3000/lessons
```

### POST /order
```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "1234567890",
    "lessons": [{"lessonId": "...", "subject": "Math", "price": 25}],
    "totalPrice": 25
  }'
```

### PUT /lessons/:id
```bash
curl -X PUT http://localhost:3000/lessons/{id} \
  -H "Content-Type: application/json" \
  -d '{"spaces": 4}'
```

### GET /search
```bash
curl http://localhost:3000/search?query=math
```

---

## 🛠️ Technologies

**Frontend:**
- Vue.js 3 (CDN)
- Bootstrap 5
- Fetch API
- Vanilla JavaScript ES6+

**Backend:**
- Node.js
- Express.js
- MongoDB Native Driver (NO Mongoose)
- CORS
- dotenv

**Database:**
- MongoDB Atlas

**Tools:**
- Postman
- Git/GitHub

---

## 📝 CST3144 Compliance

### Frontend ✅
- Vue.js (CDN) ✅
- fetch() with promises (NO axios) ✅
- v-for, v-on, v-model directives ✅
- Bootstrap styling ✅
- 10+ lessons ✅
- Sorting (4 attributes × 2 orders) ✅
- Add to Cart ✅
- Cart with remove ✅
- Form validation (name/phone) ✅
- Toggle views ✅
- Search feature ✅

### Backend ✅
- Node.js + Express.js ✅
- MongoDB Atlas ✅
- Native driver (NO Mongoose) ✅
- CORS enabled ✅
- process.env.PORT ✅
- GET /lessons ✅
- POST /order ✅
- PUT /lessons/:id ✅
- Logger middleware ✅
- Static middleware ✅
- GET /search (optional) ✅

### Database ✅
- lessons collection (10 items) ✅
- orders collection (samples) ✅
- JSON exports ✅

### Postman ✅
- Complete collection ✅
- All endpoints ✅

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check `.env` file exists with correct MongoDB URI
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)

**Frontend can't connect:**
- Check `apiUrl` in `main.js`
- Ensure backend is running on port 3000

**MongoDB connection error:**
- Verify connection string format
- URL-encode special characters in password (@ becomes %40)
- Check network access in MongoDB Atlas

**Port already in use:**
```powershell
# Windows
taskkill /F /IM node.exe
```

---

## 📧 Support

For issues or questions regarding this coursework project, please refer to the code comments and documentation.

---

## 📄 License

This project is created for educational purposes as part of CST3144 coursework at Middlesex University.

---

**Project Status:** ✅ Complete and ready for submission

**Created:** November 2025  
**Course:** CST3144 Full Stack Web Development  
**Institution:** Middlesex University
