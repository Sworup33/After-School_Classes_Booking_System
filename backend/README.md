# Backend (Express + MongoDB)

## Setup
```bash
cd backend
npm install
copy .env.example .env  # set values
```

## Scripts
- `npm start` – start server
- `npm run dev` – start with nodemon
- `npm run seed` – import sample data

## Env Vars
- `MONGODB_URI` – MongoDB Atlas connection string
- `DB_NAME` – database name (default: `afterschool`)
- `PORT` – port (default: 3000)

## Endpoints
- `GET /` – health
- `GET /health` – health (alt)
- `GET /lessons` – list lessons
- `GET /lessons/:id` – lesson by id
- `GET /search?query=` – search lessons
- `GET /orders` – list orders
- `POST /order` – create order
- `PUT /lessons/:id` – update lesson (spaces)

## Notes
- CORS enabled
- Static images under `/images`
