import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Calculator.css';
import {
  parseExpression,
  expressionTreeToString,
  evaluateExpressionTree,
} from './mathExpression';


function Calculator() {
  const [expression, setExpression] = useState(''); // Full expression being built
  const [currentInput, setCurrentInput] = useState(''); // Current number being typed
  const [result, setResult] = useState(''); // Result after pressing =
  const [error, setError] = useState('');
  const [displayExpression, setDisplayExpression] = useState(''); // Expression with brackets
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addHistoryEntry = (entry) => {
    setHistory((prevHistory) => {
      const updatedHistory = [entry, ...prevHistory].slice(0, 20);
      localStorage.setItem('calculatorHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  };

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/calculator';

  const operatorSymbols = {
    '+': '+',
    '-': '-',
    '*': '×',
    '/': '÷',
    '^': '^',
    'sqrt': '√',
  };

  const handleNumberClick = (num) => {
    // If result is showing, start fresh
    if (result !== '') {
      setCurrentInput(num);
      setExpression('');
      setDisplayExpression('');
      setResult('');
    } else {
      // Continue building current number
      setCurrentInput(currentInput + num);
    }
    setError('');
  };

  const handleDecimal = () => {
    if (result !== '') {
      setResult('');
      setCurrentInput('0.');
      setExpression('');
      setDisplayExpression('');
    } else if (!currentInput.includes('.')) {
      setCurrentInput(currentInput + '.');
    }
  };

  const handleOperator = (op) => {
    if (result !== '') {
      // Continue calculation from previous result
      setExpression(String(result) + ' ' + operatorSymbols[op]);
      setCurrentInput('');
      setResult('');
      setDisplayExpression('');
    } else if (currentInput === '' && expression === '') {
      setError('Please enter a number first');
      return;
    } else if (currentInput === '' && expression !== '') {
      // We have an expression but no current input
      // Check if expression ends with an operator - if so, REPLACE it
      const trimmedExpr = expression.trim();
      const lastSpaceIdx = trimmedExpr.lastIndexOf(' ');
      
      if (lastSpaceIdx > 0) {
        const lastToken = trimmedExpr.substring(lastSpaceIdx + 1).trim();
        
        // Check if last token is an operator
        if (lastToken.match(/[\+\-\×\÷\^\√]/)) {
          // Replace the last operator with the new one
          const exprWithoutLastOp = trimmedExpr.substring(0, lastSpaceIdx);
          setExpression(exprWithoutLastOp + ' ' + operatorSymbols[op]);
          setError('');
          return;
        }
      }
      
      // If no operator found, just append
      setExpression(expression + ' ' + operatorSymbols[op]);
      setError('');
      return;
    } else if (currentInput === '') {
      // Just change the operator if no new number entered
      setError('');
      return;
    } else {
      // Build new expression: expression + currentInput + new operator
      // Example: "5 +" + "3" + "-" = "5 + 3 -"
      let newExpr = expression + ' ' + currentInput + ' ' + operatorSymbols[op];

      // Try to parse to get display with proper brackets
      const tree = parseExpression(newExpr);
      let displayStr = newExpr;
      
      if (tree) {
        displayStr = expressionTreeToString(tree);
      }

      setExpression(newExpr);
      setDisplayExpression(displayStr);
      setCurrentInput('');
    }
    setError('');
  };

  const handleEquals = async () => {
    try {
      setError('');
      
      // Build complete expression with current input
      let finalExpr = expression;
      
      if (!finalExpr && !currentInput) {
        setError('Nothing to calculate');
        return;
      }

      if (currentInput) {
        if (finalExpr) {
          // Check if expression already ends with an operator
          const trimmedExpr = finalExpr.trim();
          const lastChar = trimmedExpr[trimmedExpr.length - 1];
          
          // If not an operator, we need to add current input to expression
          if (!/[\+\-\×\÷\^\√]/.test(lastChar)) {
            finalExpr = trimmedExpr + ' + ' + currentInput;
          } else {
            finalExpr = trimmedExpr + ' ' + currentInput;
          }
        } else {
          // Just a single number
          setResult(parseFloat(currentInput));
          setExpression('');
          setCurrentInput('');
          setDisplayExpression(currentInput);
          return;
        }
      } else if (!finalExpr) {
        setError('Incomplete expression');
        return;
      }

      // Parse and evaluate the expression tree
      const tree = parseExpression(finalExpr);
      if (!tree) {
        setError('Invalid expression');
        return;
      }

      // Generate display with brackets based on precedence (same logic as displayCalcExpression)
      const PREC = { '+': 1, '-': 1, '×': 2, '*': 2, '÷': 2, '/': 2, '^': 3, '√': 4 };
      const tokens = finalExpr.trim().split(/\s+/);
      let displayTokens = [...tokens];
      let offset = 0;
      
      for (let i = 1; i < tokens.length - 2; i += 2) {
        const prevOp = tokens[i];
        const nextOp = tokens[i + 2];
        
        if (PREC[prevOp] !== undefined && PREC[nextOp] !== undefined) {
          if (PREC[nextOp] > PREC[prevOp]) {
            const openPos = i + 1 + offset;
            const closePos = i + 5 + offset;
            
            displayTokens.splice(openPos, 0, '(');
            offset += 1;
            displayTokens.splice(closePos, 0, ')');
            offset += 1;
          }
        }
      }

      const displayStr = displayTokens.join(' ')
        .replace(/\(\s+/g, '(')
        .replace(/\s+\)/g, ')');

      // Evaluate locally to show result
      const calculatedResult = evaluateExpressionTree(tree);
      
      if (calculatedResult === null || isNaN(calculatedResult)) {
        setError('Calculation error');
        return;
      }

      setResult(calculatedResult);
      setDisplayExpression(displayStr);
      addHistoryEntry({
        expression: displayStr,
        result: calculatedResult,
        timestamp: new Date().toISOString(),
      });
      setExpression('');
      setCurrentInput('');
    } catch (err) {
      setError('Error: ' + err.message);
      console.error('Error:', err);
    }
  };

  const handleClear = () => {
    setExpression('');
    setCurrentInput('');
    setResult('');
    setError('');
    setDisplayExpression('');
  };

  const handleDelete = () => {
    if (currentInput !== '') {
      // Delete digit from current input
      setCurrentInput(currentInput.slice(0, -1));
    } else if (expression !== '') {
      // Delete last character (operator and space) from expression
      const newExpr = expression.trimEnd();
      const lastSpaceIdx = newExpr.lastIndexOf(' ');
      
      if (lastSpaceIdx > 0) {
        // Remove the last operator
        const exprWithoutOp = newExpr.substring(0, lastSpaceIdx);
        const tree = parseExpression(exprWithoutOp);
        const displayStr = tree ? expressionTreeToString(tree) : exprWithoutOp;
        
        setExpression(exprWithoutOp);
        setDisplayExpression(displayStr);
      } else {
        // Just clear if no space found
        setExpression('');
        setDisplayExpression('');
      }
    }
    setError('');
  };

  const handleOpenBracket = () => {
    // If we have a result, start fresh with bracket
    if (result !== '') {
      setExpression('(');
      setCurrentInput('');
      setResult('');
      setDisplayExpression('');
      setError('');
      return;
    }

    // If we have current input and expression, add operator then bracket
    if (currentInput !== '' && expression !== '') {
      setExpression(expression + ' ' + currentInput + ' (');
      setCurrentInput('');
    } else if (currentInput !== '') {
      // Just current input, start bracketed expression
      setExpression(currentInput + ' (');
      setCurrentInput('');
    } else if (expression !== '') {
      // Check if expression ends with operator
      if (expression.trim().match(/[\s\+\-\×\÷\^\√]\s*$/)) {
        setExpression(expression + ' (');
      } else {
        // Expression doesn't end with operator, probably invalid state
        setExpression(expression + ' (');
      }
    } else {
      // Start new expression with bracket
      setExpression('(');
    }
    setError('');
  };

  const handleCloseBracket = () => {
    if (currentInput === '' && expression === '') {
      setError('Nothing to close');
      return;
    }

    // If we have current input, add it to expression first, then close bracket
    if (currentInput !== '') {
      setExpression(expression + ' ' + currentInput + ' )');
      setCurrentInput('');
    } else {
      // Just close bracket if expression ends with operator or number
      setExpression(expression + ' )');
    }
    setError('');
  };

  const displayCalcExpression = () => {
    // If result is showing, display it with brackets
    if (result !== '') {
      return displayExpression || '0';
    }
    
    // Operator precedence
    const PREC = { '+': 1, '-': 1, '×': 2, '*': 2, '÷': 2, '/': 2, '^': 3, '√': 4 };
    
    // Build full expression with current input
    let fullExpr = expression;
    if (currentInput) {
      fullExpr = expression + ' ' + currentInput;
    }

    if (!fullExpr.trim()) {
      return currentInput || '0';
    }

    // Parse tokens from expression
    const tokens = fullExpr.trim().split(/\s+/);
    let displayTokens = [...tokens];
    
    // Check if expression ends with an operator (incomplete)
    const isIncomplete = fullExpr.trim().match(/[\s\+\-\×\÷\^\√]\s*$/);
    
    // Find ALL pairs of operators where next has higher precedence and add brackets
    if (tokens.length >= 5) {
      // We need to track adjustments as we add brackets
      let offset = 0;
      
      for (let i = 1; i < tokens.length - 2; i += 2) {
        const prevOp = tokens[i];
        const nextOp = tokens[i + 2];
        
        if (PREC[prevOp] !== undefined && PREC[nextOp] !== undefined) {
          // If next operator has higher precedence, add brackets around it
          if (PREC[nextOp] > PREC[prevOp]) {
            // Adjusted positions with offset
            const openPos = i + 1 + offset;
            const closePos = i + 5 + offset;
            
            // Insert opening bracket
            displayTokens.splice(openPos, 0, '(');
            offset += 1;
            
            // If expression is complete, close the bracket after the operand
            if (!isIncomplete) {
              displayTokens.splice(closePos, 0, ')');
              offset += 1;
            }
          }
        }
      }
    }

    return displayTokens.join(' ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      || currentInput || '0';
  };

  return (
    <div className="calculator-container">
      <h1>🧮 Calculator</h1>
      <p className="subtitle">React + NestJS Full Stack</p>

      <div className="calculator-body">
        {/* Display */}
        <div className="display-group">
          <div className="expression-display">
            {displayCalcExpression() || '0'}
          </div>
          {error && <div className="error-display">{error}</div>}
          {result !== '' && <div className="result-display">= {result}</div>}
        </div>

        <div className="history-panel">
          <div className="history-header">
            <h2>History</h2>
            <button className="btn btn-function btn-clear-history" onClick={handleClearHistory}>
              Clear
            </button>
          </div>
          {history.length === 0 ? (
            <div className="history-empty">No history yet</div>
          ) : (
            <ul className="history-list">
              {history.map((entry, index) => (
                <li key={`${entry.timestamp}-${index}`} className="history-item">
                  <span className="history-expression">{entry.expression}</span>
                  <span className="history-result">= {entry.result}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Buttons Grid */}
        <div className="buttons-grid">
          {/* Row 1 - Functions */}
          <button className="btn btn-function" onClick={handleClear}>
            AC
          </button>
          <button className="btn btn-function" onClick={handleDelete}>
            DEL
          </button>
          <button className="btn btn-function" onClick={handleOpenBracket}>
            (
          </button>
          <button className="btn btn-function" onClick={handleCloseBracket}>
            )
          </button>

          {/* Row 2 - Numbers 7-9 and Division */}
          <button className="btn btn-number" onClick={() => handleNumberClick('7')}>
            7
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick('8')}>
            8
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick('9')}>
            9
          </button>
          <button className="btn btn-operator" onClick={() => handleOperator('/')}>
            ÷
          </button>

          {/* Row 3 - Numbers 4-6 and Multiply */}
          <button className="btn btn-number" onClick={() => handleNumberClick('4')}>
            4
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick('5')}>
            5
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick('6')}>
            6
          </button>
          <button className="btn btn-operator" onClick={() => handleOperator('*')}>
            ×
          </button>

          {/* Row 4 - Numbers 1-3 and Minus */}
          <button className="btn btn-number" onClick={() => handleNumberClick('1')}>
            1
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick('2')}>
            2
          </button>
          <button className="btn btn-number" onClick={() => handleNumberClick('3')}>
            3
          </button>
          <button className="btn btn-operator" onClick={() => handleOperator('-')}>
            -
          </button>

          {/* Row 5 - Number 0, Decimal, Plus and Equals */}
          <button
            className="btn btn-number btn-zero"
            onClick={() => handleNumberClick('0')}
          >
            0
          </button>
          <button className="btn btn-number" onClick={handleDecimal}>
            .
          </button>
          <button className="btn btn-operator" onClick={() => handleOperator('+')}>
            +
          </button>
          <button className="btn btn-equals" onClick={handleEquals}>
            =
          </button>

          {/* Row 6 - Additional operators (Power and Square Root) */}
          <button className="btn btn-operator" onClick={() => handleOperator('^')}>
            ^
          </button>
          <button className="btn btn-operator" onClick={() => handleOperator('sqrt')}>
            √
          </button>
          <button className="btn btn-function" style={{ visibility: 'hidden' }}>
            
          </button>
          <button className="btn btn-function" style={{ visibility: 'hidden' }}>
            
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
