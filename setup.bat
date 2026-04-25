@echo off
REM Windows Setup Script for Calculator App

echo.
echo =========================================
echo Calculator App - Setup Script
echo =========================================
echo.

REM Check Node.js
echo Checking Node.js...
node -v
if errorlevel 1 (
    echo Error: Node.js not found. Install from nodejs.org
    exit /b 1
)

REM Check npm
echo Checking npm...
npm -v
if errorlevel 1 (
    echo Error: npm not found.
    exit /b 1
)

REM Check NestJS CLI
echo Checking NestJS CLI...
nest --version
if errorlevel 1 (
    echo Installing NestJS CLI...
    npm install -g @nestjs/cli
)

REM Initialize Git
echo.
echo Initializing Git repository...
git init
git add .
git commit -m "Initial commit: Calculator app structure"

echo.
echo =========================================
echo Setup Complete!
echo.
echo Next steps:
echo 1. Navigate to backend: cd backend
echo 2. Run: npm run start:dev
echo 3. In another terminal, navigate to frontend: cd frontend
echo 4. Run: npm start
echo.
echo For deployment, follow: DEPLOYMENT_GUIDE.md
echo =========================================
