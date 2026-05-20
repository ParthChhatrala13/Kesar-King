# Kesar King

This repository contains a React frontend and a FastAPI backend configured for deployment with Vercel (frontend) and Render (backend), using Neon / PostgreSQL as the database.

## Deployment Setup

### Frontend (Vercel)
- Project root: `Frontend`
- Build command: `npm run build`
- Output directory: `build`
- Environment variable: `REACT_APP_API_URL`

Example Vercel environment variable:
- `REACT_APP_API_URL=https://your-backend-url.onrender.com`

### Backend (Render)
- Service root: `Backend`
- Build command: `pip install -r app/requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment variables:
  - `DATABASE_URL`
  - `FRONTEND_URL`

### Local development

1. Copy `.env.example` to `.env`.
2. Install backend dependencies:
   ```bash
   cd Backend/app
   python -m pip install -r requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   cd Frontend
   npm install
   ```
4. Run backend:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
5. Run frontend:
   ```bash
   cd Frontend
   npm start
   ```

## Notes

- The backend uses Neon / PostgreSQL via SQLAlchemy.
- `REACT_APP_API_URL` is already supported in `Frontend/src/api/mangoApi.js`.
- The backend startup creates database tables automatically.
