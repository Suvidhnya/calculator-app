/**
 * Math Expression Parser using Shunting Yard Algorithm
 * Handles operator precedence, associativity, and bracket insertion
 */

// Operator definitions with precedence and associativity
const OPERATORS = {
  '+': { precedence: 1, associativity: 'left' },
  '-': { precedence: 1, associativity: 'left' },
  '*': { precedence: 2, associativity: 'left' },
  '/': { precedence: 2, associativity: 'left' },
  '^': { precedence: 3, associativity: 'right' },
  'sqrt': { precedence: 4, associativity: 'right' }, // Unary operator
};

/**
 * Expression Tree Node
 */
class ExprNode {
  constructor(value, type = 'number', left = null, right = null) {
    this.value = value; // operator or number
    this.type = type; // 'number' or 'operator'
    this.left = left;
    this.right = right;
  }

  toString(parentPrecedence = 0) {
    if (this.type === 'number') {
      return String(this.value);
    }

    const operator = this.value;
    const opDef = OPERATORS[operator];
    
    if (!opDef) {
      return '';
    }
    
    const currentPrecedence = opDef.precedence;

    let result = '';

    // Handle unary operators (like sqrt)
    if (operator === 'sqrt') {
      if (!this.left) return '';
      result = `√(${this.left.toString(currentPrecedence)})`;
    } else {
      // Binary operators
      if (!this.left || !this.right) return '';
      
      const leftStr = this.left.toString(currentPrecedence);
      const rightStr = this.right.toString(
        operator === '^' ? currentPrecedence - 1 : currentPrecedence
      );

      result = `${leftStr} ${operator} ${rightStr}`;
    }

    // Add brackets if current operator has lower precedence than parent
    if (currentPrecedence < parentPrecedence) {
      result = `(${result})`;
    }

    return result;
  }
}

/**
 * Tokenize an expression string
 */
function tokenize(expression) {
  const tokens = [];
  let currentNumber = '';

  const operatorSymbols = {
    '+': '+',
    '-': '-',
    '×': '*',
    '÷': '/',
    '^': '^',
    '√': 'sqrt',
  };

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char === ' ') {
      if (
        currentNumber &&
        currentNumber !== '-' &&
        currentNumber !== '+'
      ) {
        tokens.push({ type: 'number', value: parseFloat(currentNumber) });
        currentNumber = '';
      }
    } else if (char === '(' || char === ')') {
      if (
        currentNumber &&
        currentNumber !== '-' &&
        currentNumber !== '+'
      ) {
        tokens.push({ type: 'number', value: parseFloat(currentNumber) });
        currentNumber = '';
      }
      tokens.push({ type: char === '(' ? 'lparen' : 'rparen', value: char });
    } else if (char === '+' || char === '-') {
      const isUnary =
        currentNumber === '' &&
        (tokens.length === 0 ||
          tokens[tokens.length - 1].type === 'operator' ||
          tokens[tokens.length - 1].type === 'lparen');

      if (isUnary) {
        currentNumber = char;
        continue;
      }

      if (
        currentNumber &&
        currentNumber !== '-' &&
        currentNumber !== '+'
      ) {
        tokens.push({ type: 'number', value: parseFloat(currentNumber) });
        currentNumber = '';
      }

      tokens.push({
        type: 'operator',
        value: operatorSymbols[char],
      });
    } else if (operatorSymbols[char]) {
      if (
        currentNumber &&
        currentNumber !== '-' &&
        currentNumber !== '+'
      ) {
        tokens.push({ type: 'number', value: parseFloat(currentNumber) });
        currentNumber = '';
      }
      tokens.push({
        type: 'operator',
        value: operatorSymbols[char],
      });
    } else if (/\d|\./.test(char)) {
      currentNumber += char;
    }
  }

  if (currentNumber) {
    tokens.push({ type: 'number', value: parseFloat(currentNumber) });
  }

  return tokens;
}

/**
 * Shunting Yard Algorithm - converts infix to postfix notation
 */
function shuntingYard(tokens) {
  const output = [];
  const operatorStack = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
    } else if (token.type === 'operator') {
      const op = token.value;
      const opDef = OPERATORS[op];

      while (operatorStack.length > 0) {
        const topOp = operatorStack[operatorStack.length - 1];

        if (topOp.value === 'lparen') break;

        const topOpDef = OPERATORS[topOp.value];
        const shouldPop =
          topOpDef.precedence > opDef.precedence ||
          (topOpDef.precedence === opDef.precedence &&
            opDef.associativity === 'left');

        if (shouldPop) {
          output.push(operatorStack.pop());
        } else {
          break;
        }
      }

      operatorStack.push(token);
    } else if (token.type === 'lparen') {
      operatorStack.push(token);
    } else if (token.type === 'rparen') {
      while (operatorStack.length > 0) {
        const top = operatorStack.pop();
        if (top.value === 'lparen') break;
        output.push(top);
      }
    }
  }

  while (operatorStack.length > 0) {
    output.push(operatorStack.pop());
  }

  return output;
}

/**
 * Build expression tree from postfix tokens
 */
function buildExpressionTree(postfixTokens) {
  const stack = [];

  for (const token of postfixTokens) {
    if (token.type === 'number') {
      stack.push(new ExprNode(token.value, 'number'));
    } else if (token.type === 'operator') {
      const op = token.value;

      if (op === 'sqrt') {
        // Unary operator
        const operand = stack.pop();
        if (!operand) return null; // Not enough operands
        stack.push(new ExprNode(op, 'operator', operand, null));
      } else {
        // Binary operator
        const right = stack.pop();
        const left = stack.pop();
        
        if (!right || !left) return null; // Not enough operands
        
        stack.push(new ExprNode(op, 'operator', left, right));
      }
    }
  }

  return stack.length === 1 ? stack[0] : null;
}

/**
 * Parse an expression string and return the expression tree
 */
export function parseExpression(expression) {
  if (!expression || expression.trim() === '') {
    return null;
  }

  try {
    const tokens = tokenize(expression);
    if (tokens.length === 0) return null;

    const postfixTokens = shuntingYard(tokens);
    const tree = buildExpressionTree(postfixTokens);

    return tree;
  } catch (error) {
    console.error('Error parsing expression:', error);
    return null;
  }
}

/**
 * Convert expression tree to string with proper brackets
 */
export function expressionTreeToString(tree) {
  if (!tree) return '';
  return tree.toString();
}

/**
 * Build expression string with proper precedence/bracketing
 * Called when user adds numbers and operators
 */
export function buildExpressionWithPrecedence(
  previousExpression,
  newOperator,
  newNumber
) {
  if (!previousExpression || previousExpression.trim() === '') {
    return newNumber ? String(newNumber) : '';
  }

  // Parse the previous expression
  const tree = parseExpression(previousExpression);

  if (!tree) {
    return newNumber ? String(newNumber) : previousExpression;
  }

  const treePrecedence = tree.type === 'operator' ? OPERATORS[tree.value].precedence : Infinity;
  const newOpPrecedence = OPERATORS[newOperator].precedence;

  // If new operator has higher precedence, wrap previous expression in brackets
  let baseExpression = previousExpression;
  if (newOpPrecedence > treePrecedence) {
    baseExpression = `(${previousExpression})`;
  }

  if (newNumber === undefined || newNumber === null || newNumber === '') {
    return `${baseExpression} ${newOperator}`;
  }

  return `${baseExpression} ${newOperator} ${newNumber}`;
}

/**
 * Evaluate an expression tree
 */
export function evaluateExpressionTree(tree) {
  if (!tree) return null;

  if (tree.type === 'number') {
    return tree.value;
  }

  const op = tree.value;
  const left = evaluateExpressionTree(tree.left);
  const right = tree.right ? evaluateExpressionTree(tree.right) : null;

  if (left === null) return null;

  switch (op) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      return right !== 0 ? left / right : null;
    case '^':
      return Math.pow(left, right);
    case 'sqrt':
      return Math.sqrt(left);
    default:
      return null;
  }
}
