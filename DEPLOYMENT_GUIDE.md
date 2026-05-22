# Deployment Guide

This guide explains how to deploy the calculator app with:
- **Backend:** Render.com
- **Frontend:** Vercel.com

## 1) Prerequisites

- GitHub repository connected to your Render and Vercel accounts
- Node.js installed locally for build verification
- `calculator-app/backend` and `calculator-app/frontend` already working locally
- `.env` files are ignored by Git (`.gitignore` already covers them)

## 2) Local environment files

Create these local sample files for development only.

### Backend: `calculator-app/backend/.env`
```env
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Frontend: `calculator-app/frontend/.env`
```env
REACT_APP_API_URL=http://localhost:3001/api/calculator
```

The project also includes example files:
- `backend/.env.example`
- `frontend/.env.example`

## 3) Verify local app before deployment

### Backend
```bash
cd calculator-app/backend
npm install
npm run build
npm start
```

### Frontend
```bash
cd calculator-app/frontend
npm install
npm run build
npm start
```

Open `http://localhost:3000` and confirm the calculator can call the backend.

## 4) Deploy backend on Render.com

### 4.1 Create a new Web Service

- Platform: Render
- Repository: your GitHub repo
- Root directory: `calculator-app/backend`
- Environment: `Node`

### 4.2 Render settings

- Build Command: `npm install && npm run build`
- Start Command: `npm run start:prod`
- Publish Directory: (Render auto-detects for Node web services)

### 4.3 Add Render environment variables

In Render Dashboard > Environment > Environment Variables, add:

- `PORT` = `3001` (optional; Render usually provides one)
- `CORS_ORIGIN` = `https://<your-vercel-app>.vercel.app`

If you want multiple allowed origins, separate them with commas, for example:
```text
https://<your-vercel-app>.vercel.app,http://localhost:3000
```

### 4.4 Deploy

- Deploy the Render service
- Copy the Render URL after deploy, for example `https://calculator-backend.onrender.com`

## 5) Deploy frontend on Vercel.com

### 5.1 Create a new Vercel project

- Platform: Vercel
- Repository: your GitHub repo
- Root directory: `calculator-app/frontend`

### 5.2 Vercel settings

- Framework Preset: Create React App
- Build Command: `npm install && npm run build`
- Output Directory: `build`

### 5.3 Add Vercel environment variable

In Vercel Dashboard > Environment Variables, add:

- `REACT_APP_API_URL` = `https://<your-render-backend>.onrender.com/api/calculator`

Deploy to both `Production` and, optionally, `Preview`.

## 6) Required code behavior

### Backend
The backend uses `process.env.PORT` and `process.env.CORS_ORIGIN` in `backend/src/main.ts`.
It loads local env values via `dotenv/config` for development.

### Frontend
The frontend uses `process.env.REACT_APP_API_URL` in `frontend/src/Calculator.js`.
During the Vercel build, this value is injected from Vercel environment variables.

## 7) Production validation

1. Open your Vercel URL.
2. Use the calculator UI.
3. Confirm network requests go to the Render backend URL.
4. If you see CORS errors, update `CORS_ORIGIN` on Render to include the Vercel domain.

## 8) GitHub push checklist

- Commit changes to code and docs
- Do not commit `.env` files
- Commit `backend/.env.example` and `frontend/.env.example`
- Commit `DEPLOYMENT_GUIDE.md`

## 9) Example env values for production

### Render Dashboard
- `CORS_ORIGIN=https://<your-vercel-app>.vercel.app`

### Vercel Dashboard
- `REACT_APP_API_URL=https://<your-render-backend>.onrender.com/api/calculator`

---

If you want, I can also add a short `Deployment` section to `README.md` linking directly to this guide.