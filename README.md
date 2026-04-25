# Calculator App - React Frontend + NestJS Backend

A full-stack calculator application with React frontend and NestJS backend.

## Features
- ✅ Basic operations: Add, Subtract, Multiply, Divide
- ✅ Advanced operations: Power, Square Root
- ✅ Error handling
- ✅ Responsive UI
- ✅ Production-ready deployment

## Project Structure
```
calculator-app/
├── backend/            # NestJS backend
│   ├── src/
│   │   ├── calculator/
│   │   │   ├── calculator.controller.ts
│   │   │   ├── calculator.service.ts
│   │   │   └── calculator.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── Dockerfile
├── frontend/           # React frontend
│   ├── src/
│   │   ├── Calculator.js
│   │   ├── Calculator.css
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
├── DEPLOYMENT_GUIDE.md # Step-by-step deployment
├── setup.bat          # Windows setup script
├── setup.sh           # Linux/Mac setup script
└── README.md          # This file
```

## Quick Start

### Windows
```bash
.\setup.bat
```

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

#### Backend Setup
```bash
cd backend
nest new calculator-backend --package-manager npm
cd calculator-backend
npm install
npm run start:dev
```

#### Frontend Setup
```bash
cd frontend
npx create-react-app calculator-frontend
cd calculator-frontend
npm install axios
npm start
```

## Local Testing

### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```
Backend runs on: `http://localhost:3001`

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

### Test
1. Open `http://localhost:3000` in browser
2. Enter two numbers
3. Click any operation button
4. See result displayed

## API Documentation

### Base URL
- Local: `http://localhost:3001/api/calculator`
- Production: `https://calculated-backend.onrender.com/api/calculator`

### Endpoints

#### Add
```bash
POST /add
Body: { "a": 10, "b": 5 }
Response: { "result": 15 }
```

#### Subtract
```bash
POST /subtract
Body: { "a": 10, "b": 5 }
Response: { "result": 5 }
```

#### Multiply
```bash
POST /multiply
Body: { "a": 10, "b": 5 }
Response: { "result": 50 }
```

#### Divide
```bash
POST /divide
Body: { "a": 10, "b": 5 }
Response: { "result": 2 }
```

#### Power
```bash
POST /power
Body: { "a": 2, "b": 3 }
Response: { "result": 8 }
```

#### Square Root
```bash
POST /sqrt
Body: { "a": 16 }
Response: { "result": 4 }
```

## Deployment

Follow **DEPLOYMENT_GUIDE.md** for detailed step-by-step instructions for deploying to:
- **Backend:** Render.com
- **Frontend:** Vercel.com

### Quick Deploy Commands

#### Build
```bash
cd backend && npm run build && cd ../frontend && npm run build
```

#### Test Production Build
```bash
cd frontend && npm run build && npx serve -s build
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=3001
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001/api/calculator
```

### Frontend Production (.env.production)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api/calculator
```

## Tech Stack
- **Frontend:** React 18, Axios, CSS3
- **Backend:** NestJS, TypeScript, Express
- **Deployment:** Render (Backend), Vercel (Frontend)
- **Version Control:** Git & GitHub

## Troubleshooting

### CORS Error
Update `src/main.ts` in backend:
```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'https://your-frontend-url'],
});
```

### API Connection Failed
1. Check backend is running: `npm run start:dev`
2. Verify REACT_APP_API_URL in frontend .env
3. Check firewall/ports are open

### Build Failed
```bash
# Clean and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Git Workflow

```bash
# Initial setup
git init
git add .
git commit -m "Initial: Calculator app"
git remote add origin https://github.com/yourusername/calculator-app.git
git push -u origin main

# Regular updates
git add .
git commit -m "Feature: Add new operation"
git push origin main
```

## Next Steps
1. Deploy to production (see DEPLOYMENT_GUIDE.md)
2. Share URLs on LinkedIn
3. Enhance: Add history, keyboard support, dark mode
4. Optimize: Add database for user operations history
5. Scale: Build mobile version with React Native

## Support
- NestJS Docs: https://docs.nestjs.com
- React Docs: https://react.dev
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs

## Author
Created by: Suvidnya  
Date: April 2026  
Purpose: Career transition - Build full-stack projects for development role

---

Good luck with your deployment! 🚀
