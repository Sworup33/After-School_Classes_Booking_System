# Frontend (Vue.js)

## Run Locally
```bash
cd frontend
python -m http.server 8080
```
Open: http://localhost:8080

## Configure API URL
The API base URL is defined in `main.js` via `apiUrl`.
- Local: `http://localhost:3000`
- Production: `https://after-school-classes-booking-system.onrender.com`

## Features
- Browse lessons, sort & search
- Add to cart, remove items
- Validate name (letters) & phone (digits)
- Responsive layout via Bootstrap