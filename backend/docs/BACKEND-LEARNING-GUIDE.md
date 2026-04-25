# 🎓 NestJS Backend: Complete Learning Guide
## Calculator App Backend Explained

**Date:** April 19, 2026  
**Level:** Beginner to Intermediate  
**Goal:** Understand each file and why it exists

---

## 📚 Table of Contents

1. [Project Structure](#project-structure)
2. [File-by-File Explanation](#file-by-file-explanation)
3. [How Requests Flow](#how-requests-flow)
4. [Concepts Explained](#concepts-explained)
5. [Common Mistakes & Solutions](#common-mistakes--solutions)

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.ts                         ← Application entry point
│   ├── app.module.ts                   ← Root module (combines everything)
│   └── calculator/                     ← Feature module
│       ├── calculator.controller.ts    ← Handles HTTP requests
│       ├── calculator.service.ts       ← Business logic
│       ├── calculator.module.ts        ← Calculator feature module
│       └── calculator.dto.ts           ← Data validation (create this!)
├── package.json                        ← Dependencies
├── tsconfig.json                       ← TypeScript config
├── .env                                ← Environment variables
└── nest-cli.json                       ← NestJS config
```

**Why this structure?**
- **Separation of Concerns:** Each file has one responsibility
- **Scalability:** Easy to add new features
- **Testability:** Each piece can be tested independently
- **Maintainability:** Clear organization

---

## 📖 File-by-File Explanation

### 1️⃣ main.ts (Application Entry Point)

**What it does:** Starts your entire application

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  // Create NestJS application
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS (allow frontend to call this API)
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Start listening on port
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`✅ Calculator API running on: http://localhost:${port}`);
}

// Run the function
bootstrap();
```

**Explanation:**
- `NestFactory.create(AppModule)` - Creates the app with AppModule as root
- `enableCors()` - Allows requests from frontend (React on port 3000)
- `app.listen()` - Starts server on specified port

**Why async?** Network operations take time. `async/await` prevents blocking.

---

### 2️⃣ app.module.ts (Root Module)

**What it does:** Combines all modules into one application

```typescript
import { Module } from '@nestjs/common';
import { CalculatorModule } from './calculator/calculator.module';

@Module({
  imports: [CalculatorModule],  // Import calculator feature
})
export class AppModule {}
```

