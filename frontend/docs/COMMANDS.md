# Command Reference Guide for Calculator App

## Quick Command Reference

### Setup & Installation
```bash
# Clone repository (if you have it on GitHub)
git clone https://github.com/yourusername/calculator-app.git
cd calculator-app

# Windows setup
.\setup.bat

# Linux/Mac setup
chmod +x setup.sh
./setup.sh

# Manual installation
npm install -g @nestjs/cli
cd backend && npm install
cd ../frontend && npm install
```

### Development - Running Locally

#### Terminal 1: Backend
```bash
cd backend
npm run start:dev
# Backend runs on: http://localhost:3001
```

#### Terminal 2: Frontend
```bash
cd frontend
npm start
# Frontend runs on: http://localhost:3000
```

#### Terminal 3: Optional - Monitor Git Changes
```bash
git status
git diff
```

### Testing the Application

#### Using Postman (Test API)
```bash
# Open Postman and test these endpoints:
POST http://localhost:3001/api/calculator/add
Body: { "a": 10, "b": 5 }

POST http://localhost:3001/api/calculator/subtract
Body: { "a": 10, "b": 5 }

POST http://localhost:3001/api/calculator/multiply
Body: { "a": 10, "b": 5 }

POST http://localhost:3001/api/calculator/divide
Body: { "a": 10, "b": 5 }

POST http://localhost:3001/api/calculator/power
Body: { "a": 2, "b": 3 }

POST http://localhost:3001/api/calculator/sqrt
Body: { "a": 16 }
```

#### Using cURL (Alternative to Postman)
```bash
# Add operation
curl -X POST http://localhost:3001/api/calculator/add \
  -H "Content-Type: application/json" \
  -d '{"a":10,"b":5}'

# Subtract operation
curl -X POST http://localhost:3001/api/calculator/subtract \
  -H "Content-Type: application/json" \
  -d '{"a":10,"b":5}'

# Multiply operation
curl -X POST http://localhost:3001/api/calculator/multiply \
  -H "Content-Type: application/json" \
  -d '{"a":10,"b":5}'

# Divide operation
curl -X POST http://localhost:3001/api/calculator/divide \
  -H "Content-Type: application/json" \
  -d '{"a":10,"b":5}'

# Power operation
curl -X POST http://localhost:3001/api/calculator/power \
  -H "Content-Type: application/json" \
  -d '{"a":2,"b":3}'

# Square root operation
curl -X POST http://localhost:3001/api/calculator/sqrt \
  -H "Content-Type: application/json" \
  -d '{"a":16}'
```

### Build for Production

#### Backend Build
```bash
cd backend
npm run build
# Creates: dist/ folder with compiled code
```

#### Frontend Build
```bash
cd frontend
npm run build
# Creates: build/ folder with optimized code
```

#### Test Production Build Locally
```bash
cd frontend
npm run build
npx serve -s build
# Runs on: http://localhost:3000 (production-like)
```

### Git & GitHub Workflow

#### Initial Setup
```bash
# Create GitHub repository first (on github.com)
# Then in your project folder:

git init
git add .
git commit -m "Initial commit: Calculator app with NestJS and React"
git remote add origin https://github.com/yourusername/calculator-app.git
git branch -M main
git push -u origin main
```

#### Regular Development Workflow
```bash
# Check status
git status

# See changes
git diff

# Stage changes
git add .
git add src/  # Or specific files

# Commit
git commit -m "Feature: Add square root operation"

# Push to GitHub
git push origin main

# Check logs
git log --oneline -5
```

#### Create Feature Branch (Optional)
```bash
git checkout -b feature/add-history
# Make changes
git add .
git commit -m "Add calculator history"
git push origin feature/add-history
# Create pull request on GitHub
```

### Deployment Commands

#### Deploy Backend to Render

**One-time setup:**
1. Sign up at render.com
2. Connect GitHub
3. Create Web Service
4. Configure:
   - Root Directory: `backend`
   - Build: `npm install && npm run build`
   - Start: `node dist/main.js`

**Auto-deploy:** Every push to main triggers automatic deployment

#### Deploy Frontend to Vercel

**One-time setup:**
1. Sign up at vercel.com
2. Connect GitHub
3. Import project
4. Configure:
   - Root Directory: `frontend`
   - Build: `npm run build`
   - Output: `build`

**Environment Variable (Critical):**
```
REACT_APP_API_URL=https://your-backend.onrender.com/api/calculator
```

**Auto-deploy:** Every push to main triggers automatic deployment

### Debugging & Troubleshooting

#### Backend Debugging
```bash
# Check if port 3001 is in use (Windows PowerShell)
Get-NetTcpConnection -LocalPort 3001

# Kill process using port
# Find PID first, then:
Stop-Process -Id <PID> -Force

# Check logs
npm run start:dev
# Look for error messages in terminal
```

#### Frontend Debugging
```bash
# Check if port 3000 is in use
# Kill process or change port:
PORT=3002 npm start

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm start
```

#### CORS Error Fix
```bash
# In backend/src/main.ts, update:
app.enableCors({
  origin: ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
});

# Then deploy
git add .
git commit -m "Fix: Update CORS for production URL"
git push origin main
```

#### Network Request Debugging
```bash
# Open browser DevTools (F12)
# Go to Network tab
# Make a calculation request
# Check if API call is successful
# Look for:
# - Status code should be 200
# - Response should show result
# - Check CORS headers
```

### Environment Variables Setup

#### Backend (.env)
```
NODE_ENV=production
PORT=3001
LOG_LEVEL=debug
```

#### Frontend (.env.development)
```
REACT_APP_API_URL=http://localhost:3001/api/calculator
```

#### Frontend (.env.production)
```
REACT_APP_API_URL=https://calculator-backend.onrender.com/api/calculator
```

### Useful Package Management Commands

#### Backend
```bash
cd backend

# Install a new package
npm install cors

# Install dev dependency
npm install --save-dev @types/node

# Update packages
npm update

# Check outdated packages
npm outdated

# Audit for vulnerabilities
npm audit
npm audit fix
```

#### Frontend
```bash
cd frontend

# Install a new package
npm install axios

# Install dev dependency
npm install --save-dev eslint

# Update packages
npm update

# Check outdated packages
npm outdated

# Audit for vulnerabilities
npm audit
npm audit fix
```

### Database (Optional - For Future Enhancement)

#### If Adding MongoDB
```bash
# Backend: Install mongoose
cd backend
npm install mongoose

# Set connection string in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/calculator

# Connect in main.ts
import { connect } from 'mongoose';
await connect(process.env.MONGODB_URI);
```

#### If Adding PostgreSQL
```bash
# Backend: Install TypeORM
cd backend
npm install typeorm pg

# Configure database connection
# Create ormconfig.json
```

### Performance Optimization

#### Frontend Build Size
```bash
# Analyze bundle size
npm install --save-dev source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*'

# This shows which libraries take most space
```

#### Backend Optimization
```bash
# Generate production build
npm run build

# Check built file size
dir dist/

# This creates optimized, minified code
```

### Continuous Integration (Optional)

#### GitHub Actions (Auto-test on push)
Create `.github/workflows/test.yml`:
```yaml
name: Test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
```

### Monitoring & Logs (After Deployment)

#### Render Logs
```bash
# View in dashboard: Renderoom.com → Your Service → Logs
# Or use CLI (if installed):
# render logs --service-id=YOUR_SERVICE_ID
```

#### Vercel Logs
```bash
# View in dashboard: Vercel.com → Project → Deployments → View
# Or use CLI:
vercel logs
```

### Final Checklist Before Deploying

- [ ] Code committed to GitHub
- [ ] Backend builds: `npm run build` (in backend folder)
- [ ] Frontend builds: `npm run build` (in frontend folder)
- [ ] No console errors locally
- [ ] .env files configured correctly
- [ ] CORS properly configured in backend
- [ ] Database connection (if needed) tested
- [ ] Environment variables set in deployment platform
- [ ] Tested API endpoints manually
- [ ] README.md updated
- [ ] Deployed successfully
- [ ] Test deployed URLs in browser

---

## Getting Help

1. **NestJS Issues:** https://docs.nestjs.com/support
2. **React Issues:** https://react.dev/community
3. **Deployment Issues:** Contact Render/Vercel support
4. **Git Issues:** https://stackoverflow.com (tag: git)
5. **API Issues:** Test with Postman, check logs

Good luck! 🚀
