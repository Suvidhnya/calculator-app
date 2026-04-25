#!/bin/bash

# Linux/Mac Setup Script for Calculator App

echo ""
echo "========================================="
echo "Calculator App - Setup Script"
echo "========================================="
echo ""

# Check Node.js
echo "Checking Node.js..."
node -v || { echo "Error: Node.js not found. Install from nodejs.org"; exit 1; }

# Check npm
echo "Checking npm..."
npm -v || { echo "Error: npm not found."; exit 1; }

# Check NestJS CLI
echo "Checking NestJS CLI..."
nest --version || {
    echo "Installing NestJS CLI..."
    npm install -g @nestjs/cli
}

# Initialize Git
echo ""
echo "Initializing Git repository..."
git init
git add .
git commit -m "Initial commit: Calculator app structure"

echo ""
echo "========================================="
echo "Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Navigate to backend: cd backend"
echo "2. Run: npm run start:dev"
echo "3. In another terminal, navigate to frontend: cd frontend"
echo "4. Run: npm start"
echo ""
echo "For deployment, follow: DEPLOYMENT_GUIDE.md"
echo "========================================="
