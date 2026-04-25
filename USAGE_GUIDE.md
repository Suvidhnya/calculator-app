# 📊 Calculator Usage Guide

## Frontend Calculator UI

Your calculator now looks like a **real iPhone/Android calculator** with a grid layout!

### Layout

```
┌─────────────────────────┐
│  🧮 Calculator          │
│  React + NestJS Full..  │
├─────────────────────────┤
│ Display: 5 + 3 + 2      │
│ Result:  = 10           │
├─────────────────────────┤
│ [AC]  [DEL] [^]   [÷]   │
│ [7]   [8]   [9]   [×]   │
│ [4]   [5]   [6]   [-]   │
│ [1]   [2]   [3]   [+]   │
│ [    0    ] [.]  [√] [=]│
└─────────────────────────┘
```

### Button Guide

| Button | Function | Example |
|--------|----------|---------|
| **Numbers** (0-9) | Input digits | Click 5 → Display: `5` |
| **.** (Decimal) | Add decimal point | Click 3.14 → Display: `3.14` |
| **+** (Add) | Add numbers | 5 + 3 + 2 = 10 |
| **-** (Subtract) | Subtract in order | 100 - 25 - 10 = 65 |
| **×** (Multiply) | Multiply chain | 2 × 3 × 4 = 24 |
| **÷** (Divide) | Divide in order | 100 ÷ 5 ÷ 2 = 10 |
| **^** (Power) | Power (2 numbers only) | 2 ^ 8 = 256 |
| **√** (Sqrt) | Square root (1 number only) | √256 = 16 |
| **=** (Equals) | Calculate result | Shows: `= 18` |
| **AC** (All Clear) | Clear everything | Reset to `0` |
| **DEL** (Delete) | Remove last digit | 123 → DEL → 12 |

---

## Step-by-Step Examples

### Example 1: Simple Addition (5 + 3)
```
Step 1: Click [5]
        Display: 5

Step 2: Click [+]
        Operator stored: +
        Display: (cleared)

Step 3: Click [3]
        Display: 3

Step 4: Click [=]
        Calculation: 5 + 3
        Result: = 8
        Display: = 8
```

### Example 2: Multiple Numbers (5 + 3 + 2)
```
Step 1: Click [5]
        Display: 5

Step 2: Click [+]
        Display clears, operator stored

Step 3: Click [3]
        Display: 3

Step 4: Click [+]
        Display updates: 5 + 3 +
        (stores 5 as first number)
        (ready for new number)

Step 5: Click [2]
        Display: 2

Step 6: Click [=]
        Expression: 5 + 3 + 2
        Result: = 10
```

### Example 3: Subtraction Chain (100 - 25 - 10)
```
[1] [0] [0]
Display: 100

[-]
Display clears

[2] [5]
Display: 25

[-]
Display: 100 - 25 -

[1] [0]
Display: 10

[=]
Result: = 65
```

### Example 4: Decimal Numbers (3.14 + 2.86)
```
[3] [.] [1] [4]
Display: 3.14

[+]
Display clears

[2] [.] [8] [6]
Display: 2.86

[=]
Result: = 6
```

### Example 5: Power Operation (2^8)
```
[2]
Display: 2

[^]
Display clears

[8]
Display: 8

[=]
Result: = 256
(Note: Power only works with 2 numbers)
```

### Example 6: Square Root (√256)
```
[2] [5] [6]
Display: 256

[√]
Display clears? No, keeps number

[=]
Result: = 16
(Note: Sqrt only works with 1 number)
```

### Example 7: Using Delete Button
```
[1] [2] [3]
Display: 123

[DEL]
Display: 12

[DEL]
Display: 1

[DEL]
Display: (empty)
```

### Example 8: Using AC Button
```
[5] [+] [3] [+] [2]
Display: 5 + 3 + 2

[AC]
Display: 0
Operator: cleared
All numbers: cleared
```

---

## Real Calculation Examples

### Shopping Calculator
**You buy 3 items for $5 each, 2 items for $10 each, discount of $3**
```
[5] [+] [5] [+] [5]
Display: 5 + 5 + 5

[+]
Display: 5 + 5 + 5 +

[1] [0] [+] [1] [0]
Display: 5 + 5 + 5 + 10 + 10

[=]
Result: = 35
```

### Area Calculation
**Calculate area: 12 × 15**
```
[1] [2]
Display: 12

[×]
[1] [5]
Display: 15

[=]
Result: = 180
```

### Power Calculation
**Calculate 3^4 = 81**
```
[3]
Display: 3

[^]
[4]
Display: 4

[=]
Result: = 81
```

---

## Tips & Tricks

### ✅ Do's
- ✅ Add multiple numbers with same operator: `5 + 3 + 2 + 1`
- ✅ Use decimals: `3.14 + 2.86`
- ✅ Use backspace (DEL) to fix mistakes
- ✅ Use AC to start fresh
- ✅ Check the expression display before pressing =

### ❌ Don'ts
- ❌ Don't use Power with 3+ numbers (only for 2 numbers)
- ❌ Don't use Sqrt with 2+ numbers (only for 1 number)
- ❌ Don't divide by zero (will show error)
- ❌ Don't try to mix operators (use one operator per calculation)

---

## Visual Expression Display

The calculator shows what you're typing in real-time!

```
Expression Display (comes first):
5 + 3 - 2

Result Display (shows after =):
= 6
```

This means:
- LEFT SIDE: What you're calculating
- RIGHT SIDE: The final answer

---

## Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| "Incomplete calculation" | Pressed = without second number | Enter a number before = |
| "Cannot divide by zero" | Tried to divide by 0 | Enter non-zero divisor |
| "Power requires exactly 2 numbers" | Used ^ with 1 or 3+ numbers | Use only with 2 numbers |
| "Sqrt requires exactly 1 number" | Used √ with 2+ numbers | Use only with 1 number |
| "Please enter a number first" | Clicked operator with no number | Enter a number first |

---

## Keyboard Support (Coming Soon!)

Future update will allow:
```
1-9    : Number buttons
0      : Zero
.      : Decimal
+      : Plus
-      : Minus
*      : Multiply
/      : Divide
^      : Power
Enter  : Equals
Delete : Clear last digit
Escape : AC (clear all)
```

---

## Backend API Reference

### Single Request Format
```json
POST /api/calculator/calculate
Content-Type: application/json

{
  "operator": "+",
  "numbers": [10, 5, 3]
}
```

### Response Format
```json
{
  "operator": "+",
  "numbers": [10, 5, 3],
  "result": 18
}
```

### Operators Supported
| Operator | Symbol | Example | Result |
|----------|--------|---------|--------|
| Addition | + | [5, 3, 2] | 10 |
| Subtraction | - | [100, 25, 10] | 65 |
| Multiplication | * | [2, 3, 4] | 24 |
| Division | / | [100, 5, 2] | 10 |
| Power | ^ | [2, 8] | 256 |
| Square Root | sqrt | [256] | 16 |

---

## Keyboard Shortcuts (Future)

Once keyboard support is added:

| Key | Action |
|-----|--------|
| 0-9 | Input number |
| . | Decimal point |
| + | Addition |
| - | Subtraction |
| * | Multiplication |
| / | Division |
| ^ | Power |
| = | Calculate |
| Enter | Calculate |
| Backspace | Delete last digit |
| Delete | AC (clear all) |
| Escape | AC (clear all) |

---

## Calculator Types Supported

### ✅ Basic Calculator
- Addition, Subtraction, Multiplication, Division
- Multiple numbers: `5 + 3 + 2 + 1`

### ✅ Scientific Calculator
- Power: `2^8 = 256`
- Square Root: `√256 = 16`

### 🔄 Future Support
- Modulo: `10 % 3`
- Percentage: `20% of 100`
- History of calculations
- Dark mode
- Keyboard input

---

## Common Error Scenarios

### Scenario 1: Forgot to Enter Second Number
```
Click: [5] [+] [=]
Error: "Incomplete calculation"
Fix: Click a number before =
```

### Scenario 2: Tried to Divide by Zero
```
Click: [10] [÷] [0] [=]
Error: "Cannot divide by zero"
Fix: Click a non-zero number
```

### Scenario 3: Sqrt with 2 Numbers
```
Click: [1] [6] [√] [=]
Error: "Sqrt requires exactly 1 number"
Fix: Use √ immediately after one number, then =
```

---

## Performance Tips

1. **Regular Calculations**: Fast ⚡
2. **Long Chains**: 5 + 5 + 5 + 5... = Still fast ⚡
3. **Decimal Numbers**: No performance impact ⚡
4. **API Calls**: Minimal - only on = press ⚡

---

## Summary

Your calculator is now a **fully functional real-world calculator** that:
- ✅ Displays expressions with operators
- ✅ Supports unlimited numbers (same operator)
- ✅ Works with all basic and advanced operations
- ✅ Shows errors clearly
- ✅ Has an intuitive grid interface
- ✅ Responds instantly to user input

**Start calculating!** 🎉
