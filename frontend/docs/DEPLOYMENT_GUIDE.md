# Calculator App: React + NestJS - Complete Deployment Guide

**Date:** April 19, 2026  
**Project:** Full-Stack Calculator with React Frontend & NestJS Backend  
**Deployment Target:** Heroku or Render (Free Tier)

---

## Phase 1: Installation & Setup (Days 1-2)

### Step 1.1: Install Required Tools
   - **Node.js & npm:** Already installed (verified in earlier lessons).
   - **NestJS CLI:** `npm install -g @nestjs/cli`
   - **Git:** Already configured.
   - Verify all: `nest --version`, `node -v`, `npm -v`, `git --version`.

### Step 1.2: Initialize Backend (NestJS)
   - **Location:** `d:\Suvi\calculator-app\backend`
   - **Command:** `nest new calculator-backend --package-manager npm`
   - **Remove git:** If asked, choose "No" for git initialization (we'll do it manually).
   - **Navigate:** `cd calculator-backend`
   - **Install Dependencies:** `npm install`
   - **Test:** `npm run start:dev` - Should run on `http://localhost:3000`.

### Step 1.3: Initialize Frontend (React)
   - **Location:** `d:\Suvi\calculator-app\frontend`
   - **Command:** `npx create-react-app calculator-frontend`
   - **Navigate:** `cd calculator-frontend`
   - **Install Dependencies:** `npm install axios` (for API calls).
   - **Test:** `npm start` - Should open on `http://localhost:3000`.

### Step 1.4: Set Up Git Repository
   - **Initialize:** From `d:\Suvi\calculator-app`, run `git init`.
   - **Create .gitignore:** Copy from Node.js templates. Add:
     ```
     node_modules/
     .env
     dist/
     build/
     ```
   - **First Commit:** 
     ```
     git add .
     git commit -m "Initial setup: NestJS backend and React frontend"
     git remote add origin https://github.com/yourusername/calculator-app.git
     git branch -M main
     git push -u origin main
     ```

---

## Phase 2: Backend Development (Days 3-5)

### Step 2.1: Create Calculator Module in NestJS
   - **Generate Module:** `nest generate module calculator`
   - **Generate Service:** `nest generate service calculator`
   - **Generate Controller:** `nest generate controller calculator`
   - Files created: `src/calculator/calculator.module.ts`, `.service.ts`, `.controller.ts`.

### Step 2.2: Build Calculator Service (`src/calculator/calculator.service.ts`)
   ```typescript
   import { Injectable } from '@nestjs/common';

   @Injectable()
   export class CalculatorService {
     add(a: number, b: number): number {
       return a + b;
     }

     subtract(a: number, b: number): number {
       return a - b;
     }

     multiply(a: number, b: number): number {
       return a * b;
     }

     divide(a: number, b: number): number {
       if (b === 0) throw new Error('Cannot divide by zero');
       return a / b;
     }

     power(a: number, b: number): number {
       return Math.pow(a, b);
     }

     sqrt(a: number): number {
       if (a < 0) throw new Error('Cannot calculate square root of negative number');
       return Math.sqrt(a);
     }
   }
   ```

### Step 2.3: Build Calculator Controller (`src/calculator/calculator.controller.ts`)
   ```typescript
   import { Controller, Post, Body } from '@nestjs/common';
   import { CalculatorService } from './calculator.service';

   @Controller('api/calculator')
   export class CalculatorController {
     constructor(private readonly calculatorService: CalculatorService) {}

     @Post('add')
     add(@Body() { a, b }: { a: number; b: number }) {
       return { result: this.calculatorService.add(a, b) };
     }

     @Post('subtract')
     subtract(@Body() { a, b }: { a: number; b: number }) {
       return { result: this.calculatorService.subtract(a, b) };
     }

     @Post('multiply')
     multiply(@Body() { a, b }: { a: number; b: number }) {
       return { result: this.calculatorService.multiply(a, b) };
     }

     @Post('divide')
     divide(@Body() { a, b }: { a: number; b: number }) {
       try {
         return { result: this.calculatorService.divide(a, b) };
       } catch (error) {
         return { error: error.message };
       }
     }

     @Post('power')
     power(@Body() { a, b }: { a: number; b: number }) {
       return { result: this.calculatorService.power(a, b) };
     }

     @Post('sqrt')
     sqrt(@Body() { a }: { a: number }) {
       try {
         return { result: this.calculatorService.sqrt(a) };
       } catch (error) {
         return { error: error.message };
       }
     }
   }
   ```

### Step 2.4: Enable CORS in Main App (`src/main.ts`)
   ```typescript
   import { NestFactory } from '@nestjs/core';
   import { AppModule } from './app.module';

   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     app.enableCors(); // Enable CORS for frontend
     await app.listen(process.env.PORT || 3001);
   }
   bootstrap();
   ```

### Step 2.5: Test Backend
   - **Run:** `npm run start:dev`
   - **Test with Postman:** POST to `http://localhost:3001/api/calculator/add` with body:
     ```json
     { "a": 10, "b": 5 }
     ```
   - Expected response: `{ "result": 15 }`

### Step 2.6: Commit
   ```
   git add backend/
   git commit -m "Backend: Add calculator module with CRUD operations"
   git push origin main
   ```

---

## Phase 3: Frontend Development (Days 5-7)

### Step 3.1: Create Calculator Component (`src/Calculator.js`)
   ```javascript
   import React, { useState } from 'react';
   import axios from 'axios';
   import './Calculator.css';

   function Calculator() {
     const [num1, setNum1] = useState('');
     const [num2, setNum2] = useState('');
     const [result, setResult] = useState('');
     const [error, setError] = useState('');

     const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/calculator';

     const handleOperation = async (operation) => {
       try {
         setError('');
         const a = parseFloat(num1);
         const b = parseFloat(num2);

         if (isNaN(a) || (operation !== 'sqrt' && isNaN(b))) {
           setError('Please enter valid numbers');
           return;
         }

         let response;
         if (operation === 'sqrt') {
           response = await axios.post(`${API_URL}/sqrt`, { a });
         } else {
           response = await axios.post(`${API_URL}/${operation}`, { a, b });
         }

         if (response.data.error) {
           setError(response.data.error);
         } else {
           setResult(response.data.result);
         }
       } catch (err) {
         setError(err.response?.data?.message || 'Error calling API');
       }
     };

     const handleClear = () => {
       setNum1('');
       setNum2('');
       setResult('');
       setError('');
     };

     return (
       <div className="calculator-container">
         <h1>Calculator App</h1>
         <div className="input-group">
           <input
             type="number"
             placeholder="Enter first number"
             value={num1}
             onChange={(e) => setNum1(e.target.value)}
           />
           <input
             type="number"
             placeholder="Enter second number"
             value={num2}
             onChange={(e) => setNum2(e.target.value)}
           />
         </div>

         <div className="button-group">
           <button onClick={() => handleOperation('add')}>+ Add</button>
           <button onClick={() => handleOperation('subtract')}>- Subtract</button>
           <button onClick={() => handleOperation('multiply')}>× Multiply</button>
           <button onClick={() => handleOperation('divide')}>÷ Divide</button>
           <button onClick={() => handleOperation('power')}>^ Power</button>
           <button onClick={() => handleOperation('sqrt')}>√ Square Root</button>
           <button onClick={handleClear} className="clear-btn">Clear</button>
         </div>

         {result !== '' && (
           <div className="result">
             <h2>Result: {result}</h2>
           </div>
         )}

         {error && (
           <div className="error">
             <p>{error}</p>
           </div>
         )}
       </div>
     );
   }

   export default Calculator;
   ```

### Step 3.2: Update App.js
   ```javascript
   import React from 'react';
   import Calculator from './Calculator';
   import './App.css';

   function App() {
     return (
       <div className="App">
         <Calculator />
       </div>
     );
   }

   export default App;
   ```

### Step 3.3: Style Calculator (`src/Calculator.css`)
   ```css
   .calculator-container {
     max-width: 500px;
     margin: 50px auto;
     padding: 30px;
     background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     border-radius: 10px;
     box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
     color: white;
     font-family: Arial, sans-serif;
   }

   .calculator-container h1 {
     text-align: center;
     margin-bottom: 20px;
   }

   .input-group {
     display: flex;
     flex-direction: column;
     gap: 10px;
     margin-bottom: 20px;
   }

   .input-group input {
     padding: 12px;
     border: none;
     border-radius: 5px;
     font-size: 16px;
   }

   .button-group {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 10px;
     margin-bottom: 20px;
   }

   .button-group button {
     padding: 12px;
     border: none;
     border-radius: 5px;
     background-color: rgba(255, 255, 255, 0.2);
     color: white;
     font-size: 16px;
     cursor: pointer;
     transition: 0.3s;
   }

   .button-group button:hover {
     background-color: rgba(255, 255, 255, 0.4);
   }

   .clear-btn {
     grid-column: 1 / -1;
     background-color: rgba(255, 0, 0, 0.3);
   }

   .result {
     background-color: rgba(0, 0, 0, 0.2);
     padding: 15px;
     border-radius: 5px;
     text-align: center;
     margin-bottom: 10px;
   }

   .error {
     background-color: rgba(255, 0, 0, 0.3);
     padding: 10px;
     border-radius: 5px;
     text-align: center;
     color: #ffcccc;
   }
   ```

### Step 3.4: Setup Environment Variables
   - **Create `.env`:** In `frontend/` folder:
     ```
     REACT_APP_API_URL=http://localhost:3001/api/calculator
     ```
   - For production, update to deployed backend URL.

### Step 3.5: Test Frontend
   - **Run:** `npm start`
   - Test all operations locally.
   - Verify API calls work.

### Step 3.6: Build for Production
   ```
   npm run build
   ```
   - Creates `build/` folder with optimized files.

### Step 3.7: Commit
   ```
   git add frontend/
   git commit -m "Frontend: Add React calculator UI with API integration"
   git push origin main
   ```

---

## Phase 4: Prepare for Deployment (Day 8)

### Step 4.1: Create Production Env Files
   - **Backend `.env`:** In `calculator-app/backend/`:
     ```
     NODE_ENV=production
     PORT=3001
     ```
   - **Frontend `.env.production`:** In `calculator-app/frontend/`:
     ```
     REACT_APP_API_URL=https://your-backend-url.onrender.com/api/calculator
     ```

### Step 4.2: Update Backend Configuration
   - **Ensure CORS is set correctly in `src/main.ts`:**
     ```typescript
     app.enableCors({
       origin: ['https://your-frontend-url.vercel.app', 'http://localhost:3000'],
     });
     ```

### Step 4.3: Create Docker Files (Optional, for Advanced Deployment)
   - **`backend/Dockerfile`:**
     ```dockerfile
     FROM node:18
     WORKDIR /app
     COPY package*.json ./
     RUN npm install
     COPY . .
     RUN npm run build
     EXPOSE 3001
     CMD ["node", "dist/main.js"]
     ```

   - **`frontend/Dockerfile`:**
     ```dockerfile
     FROM node:18 AS build
     WORKDIR /app
     COPY package*.json ./
     RUN npm install
     COPY . .
     RUN npm run build

     FROM nginx:alpine
     COPY --from=build /app/build /usr/share/nginx/html
     EXPOSE 80
     CMD ["nginx", "-g", "daemon off;"]
     ```

### Step 4.4: Commit
   ```
   git add .env.production Dockerfile
   git commit -m "Add production configs and Docker files"
   git push origin main
   ```

---

## Phase 5: Deploy Backend to Render (Day 9)

### Step 5.1: Prepare GitHub Repository
   - Ensure all code is pushed to GitHub main branch.
   - Backend folder structure: `calculator-app/backend/`.

### Step 5.2: Create Render Account
   - Go to render.com
   - Sign up with GitHub.
   - Grant access to your repositories.

### Step 5.3: Deploy Backend
   - **New Service:** Click "New +" → "Web Service"
   - **Connect Repository:** Select your calculator-app repo.
   - **Configure:**
     - Name: `calculator-backend`
     - Root Directory: `calculator-app/backend`
     - Build Command: `npm install && npm run build`
     - Start Command: `node dist/main.js`
     - Environment: Add `NODE_ENV=production`
   - **Deploy:** Click "Deploy"
   - **Wait:** Render builds and deploys (5-10 minutes).
   - **Get URL:** Copy the deployed URL (e.g., `https://calculator-backend.onrender.com`).

### Step 5.4: Test Backend
   - **Test API:** Use Postman to POST to:
     ```
     https://calculator-backend.onrender.com/api/calculator/add
     ```
     with body `{ "a": 5, "b": 3 }`.
   - Expected: `{ "result": 8 }`

### Step 5.5: Update CORS
   - **Modify `backend/src/main.ts`:**
     ```typescript
     app.enableCors({
       origin: ['https://your-frontend-url.vercel.app', 'https://calculator-backend.onrender.com'],
     });
     ```
   - **Push to GitHub:** Will auto-redeploy.

---

## Phase 6: Deploy Frontend to Vercel (Day 9)

### Step 6.1: Create Vercel Account
   - Go to vercel.com
   - Sign up with GitHub.
   - Grant access to repositories.

### Step 6.2: Deploy Frontend
   - **Import Project:** Click "Add New..." → "Project"
   - **Select Repository:** Choose calculator-app.
   - **Configure:**
     - Framework: React.
     - Root Directory: `calculator-app/frontend`
     - Build Command: `npm run build`
     - Output Directory: `build`
   - **Environment Variables:**
     - Name: `REACT_APP_API_URL`
     - Value: `https://calculator-backend.onrender.com/api/calculator`
   - **Deploy:** Click "Deploy"
   - **Wait:** Vercel builds and deploys (2-5 minutes).
   - **Get URL:** Copy the frontend URL (e.g., `https://calculator-app.vercel.app`).

### Step 6.3: Test Full App
   - Visit frontend URL.
   - Test all calculator operations.
   - Verify API calls to backend work.

### Step 6.4: Update Backend CORS Again (If Needed)
   - **Modify `backend/src/main.ts`:**
     ```typescript
     app.enableCors({
       origin: ['https://your-vercel-url.vercel.app'],
     });
     ```
   - Push and auto-redeploy.

---

## Phase 7: Post-Deployment (Day 10)

### Step 7.1: Monitor Logs
   - **Render Backend Logs:** Dashboard → Service → Logs
   - **Vercel Frontend Logs:** Dashboard → Project → Deployments → Logs
   - Check for errors.

### Step 7.2: Set Up Custom Domain (Optional)
   - Add domain in Render/Vercel settings.
   - Update DNS records.

### Step 7.3: Enable Auto-Deployments
   - Both Render and Vercel auto-deploy on GitHub pushes.
   - Test: Make a small code change, push, and verify deployment.

### Step 7.4: Final Commit & Documentation
   ```
   git add .
   git commit -m "Production deployment: Backend on Render, Frontend on Vercel"
   git push origin main
   ```
   - Create README.md with:
     - Project overview.
     - Deployed URLs.
     - How to run locally.
     - API documentation.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Update `enableCors()` in `main.ts` with correct frontend URL. |
| API Not Found | Ensure backend base path is `/api/calculator`. Check Render logs. |
| Build Failed | Check Node version consistency. Run `npm install && npm run build` locally. |
| Blank Frontend | Check REACT_APP_API_URL env variable in Vercel. Rebuild. |
| Port Already in Use | Kill process: `lsof -i :3001` and `kill <PID>`. |

---

## Key Endpoints

- **Backend:** `https://calculator-backend.onrender.com`
- **Frontend:** `https://calculator-app.vercel.app`
- **API:** `POST /api/calculator/{operation}` (add, subtract, multiply, divide, power, sqrt)

---

## Next Steps

1. Share deployed URLs on LinkedIn & GitHub.
2. Enhance: Add history, advanced math, dark mode.
3. Optimize: Database for user history, authentication.
4. Deploy: Add mobile app (React Native).

Good luck! 🚀
