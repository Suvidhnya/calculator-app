## Environment Setup Instructions

### For Windows Users

#### Step 1: Prerequisites Check
```powershell
# Open PowerShell and verify installations
node -v
npm -v
git --version
```

All should return version numbers. If not, install from:
- Node.js: nodejs.org
- Git: git-scm.com

#### Step 2: Edit System Environment Variables
1. Press `Win + X`, select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "User variables", click "New"
   - Variable name: `NODE_ENV`
   - Variable value: `development`
5. Add another variable:
   - Variable name: `PORT`
   - Variable value: `3001` (for backend)

#### Step 3: Create Project Structure
```powershell
cd d:\Suvi\calculator-app

# Verify folders exist
dir

# Should show: backend, frontend, DEPLOYMENT_GUIDE.md, README.md
```

#### Step 4: Setup Backend
```powershell
cd backend

# Create package.json manually or with command:
npm init -y

# Install dependencies
npm install express cors dotenv
npm install -D @types/node typescript ts-node

# Verify installation
npm list
```

#### Step 5: Setup Frontend
```powershell
cd ..\frontend

npm init -y
npm install react react-dom axios
npm install -D react-scripts

# Verify
npm list
```

#### Step 6: Configure Environment Files

**Create `backend\.env`:**
```
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**Create `frontend\.env`:**
```
REACT_APP_API_URL=http://localhost:3001/api/calculator
```

#### Step 7: Test Setup
```powershell
# In PowerShell 1 - Start Backend
cd d:\Suvi\calculator-app\backend
npm start

# In PowerShell 2 - Start Frontend
cd d:\Suvi\calculator-app\frontend
npm start
```

---

### For Mac Users

#### Step 1: Terminal Setup
```bash
# Open Terminal
# Check if brew is installed
brew --version

# If not, install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js via Homebrew (optional)
brew install node
```

#### Step 2: Verify Installations
```bash
node -v
npm -v
git --version
```

#### Step 3: Create Project Structure
```bash
cd ~/Suvi/calculator-app
# or wherever you stored it

# Verify folders
ls -la
```

#### Step 4: Setup Backend
```bash
cd backend

npm init -y
npm install express cors dotenv
npm install -D @types/node typescript ts-node

npm list
```

#### Step 5: Setup Frontend
```bash
cd ../frontend

npm init -y
npm install react react-dom axios
npm install -D react-scripts

npm list
```

#### Step 6: Configure Environment Files

**Create `backend/.env`:**
```bash
nano .env
# Type:
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
# Press Ctrl+X, Y, Enter to save
```

**Create `frontend/.env`:**
```bash
nano .env
# Type:
REACT_APP_API_URL=http://localhost:3001/api/calculator
# Press Ctrl+X, Y, Enter to save
```

#### Step 7: Make Scripts Executable
```bash
chmod +x setup.sh
./setup.sh
```

#### Step 8: Test Setup
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (new terminal)
cd frontend
npm start
```

---

### For Linux Users (Ubuntu/Debian)

#### Step 1: Update System
```bash
sudo apt update
sudo apt upgrade
```

#### Step 2: Install Node.js
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node -v
npm -v
```

#### Step 3: Install Git
```bash
sudo apt install git
git --version
```

#### Step 4: Create Project Structure
```bash
cd ~/Suvi/calculator-app
ls -la
```

#### Step 5: Setup Backend
```bash
cd backend

npm init -y
npm install express cors dotenv
npm install -D @types/node typescript ts-node

npm list
```

#### Step 6: Setup Frontend
```bash
cd ../frontend

npm init -y
npm install react react-dom axios
npm install -D react-scripts

npm list
```

#### Step 7: Configure Environment Files

**Backend `.env`:**
```bash
echo "NODE_ENV=development" > .env
echo "PORT=3001" >> .env
echo "CORS_ORIGIN=http://localhost:3000" >> .env
```

**Frontend `.env`:**
```bash
echo "REACT_APP_API_URL=http://localhost:3001/api/calculator" > .env
```

#### Step 8: Make Scripts Executable
```bash
chmod +x setup.sh
./setup.sh
```

#### Step 9: Test Setup
```bash
# Terminal 1
cd backend
npm start

# Terminal 2 (new terminal)
cd frontend
npm start
```

---

## Common Environment Variables Reference

| Variable | Backend | Frontend | Value |
|----------|---------|----------|-------|
| NODE_ENV | ✓ | - | development / production |
| PORT | ✓ | - | 3001 (backend) |
| CORS_ORIGIN | ✓ | - | http://localhost:3000 |
| REACT_APP_API_URL | - | ✓ | http://localhost:3001/api/calculator |
| DATABASE_URL | ✓ | - | MongoDB/PostgreSQL URI |
| JWT_SECRET | ✓ | - | Your secret key |

---

## Troubleshooting Environment Setup

### Issue: npm: command not found
**Solution:**
```bash
# Reinstall Node.js
# Windows: Download from nodejs.org
# Mac: brew install node
# Linux: sudo apt install nodejs npm
```

### Issue: PORT 3001 already in use
**Solution:**
```bash
# Windows - Find process
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux - Find process
lsof -i :3001
kill -9 <PID>

# Or use different port
NODE_ENV=development
PORT=3002  # Change port in .env
```

### Issue: Module not found
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS errors
**Solution:**
Update `CORS_ORIGIN` in backend `.env`:
```
CORS_ORIGIN=http://localhost:3000,https://your-frontend-url.vercel.app
```

### Issue: .env file not being read
**Solution:**
```bash
# Ensure .env file exists in correct directory
ls -la  # Should show .env file

# Install dotenv package
npm install dotenv

# In your code, add at top:
require('dotenv').config()
```

---

## Next Steps

1. ✅ All environment variables set
2. ✅ Dependencies installed
3. Run: `npm start` in both backend and frontend
4. Open http://localhost:3000 in browser
5. Test calculator operations
6. Follow DEPLOYMENT_GUIDE.md for production

Good luck! 🚀
