# 🎯 Step-by-Step Backend Setup & Testing Guide

**Goal:** Understand how to set up, run, test, and debug your backend

---

## 📋 Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js
node -v
# Should show: v16.x or higher

# Check npm
npm -v
# Should show: 8.x or higher

# Check TypeScript (optional)
npx tsc -v
# Should show: 4.x or higher
```

If any are missing, install Node.js from nodejs.org

---

## 🚀 Step 1: Install Dependencies

```bash
cd d:\Suvi\calculator-app\backend
npm install
```

**What it does:**
- Reads `package.json`
- Downloads all packages (NestJS, TypeScript, etc.)
- Creates `node_modules` folder
- Creates `package-lock.json` (locks specific versions)

**How long:** 3-5 minutes  
**Expected output:** `added XXX packages`

---

## 🔧 Step 2: Understand Your Folder Structure

```
backend/
├── src/                           ← Source code (TypeScript)
│   ├── main.ts                    ← Entry point (starts app)
│   ├── app.module.ts              ← Root module
│   └── calculator/
│       ├── calculator.controller.ts    ← Handles /api/calculator routes
│       ├── calculator.service.ts       ← Calculation logic
│       ├── calculator.module.ts        ← Connects controller & service
│       └── calculator.dto.ts           ← Data validation (NEW!)
├── dist/                          ← Compiled JavaScript (created after build)
├── node_modules/                  ← All packages installed
├── package.json                   ← Project metadata & dependencies
├── tsconfig.json                  ← TypeScript settings
├── nest-cli.json                  ← NestJS settings
└── .env                           ← Environment variables
```

**Key files for learning:**
1. **main.ts** - How app starts
2. **app.module.ts** - How app structure
3. **calculator.controller.ts** - How requests handled
4. **calculator.service.ts** - How logic works

---

## ▶️ Step 3: Start the Backend

```bash
npm run start:dev
```

**What it does:**
1. Compiles TypeScript to JavaScript
2. Starts NestJS server
3. Watches for file changes
4. Auto-restarts when you save files

**Expected output:**
```
[Nest] 12345  - 04/19/2026, 10:30:30 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 04/19/2026, 10:30:31 AM     LOG [InstanceLoader] CalculatorModule dependencies initialized
...
✅ Calculator API running on: http://localhost:3001
```

**Keep this terminal open!** It shows logs when requests come in.

---

## 🧪 Step 4: Test Endpoints (Method 1: Browser)

