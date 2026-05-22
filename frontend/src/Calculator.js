import React, { useState, useEffect } from 'react';
import './Calculator.css';
import {
  parseExpression,
  expressionTreeToString,
  evaluateExpressionTree,
} from './mathExpression';

function Calculator() {
  const [expression, setExpression] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [displayExpression, setDisplayExpression] = useState('');
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

      localStorage.setItem(
        'calculatorHistory',
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  };

  const operatorSymbols = {
    '+': '+',
    '-': '-',
    '*': '×',
    '/': '÷',
    '^': '^',
    sqrt: '√',
  };

  const handleNumberClick = (num) => {
    if (result !== '') {
      setCurrentInput(num);
      setExpression('');
      setDisplayExpression('');
      setResult('');
    } else {
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
      setExpression(String(result) + ' ' + operatorSymbols[op]);
      setCurrentInput('');
      setResult('');
      setDisplayExpression('');
    } else if (currentInput === '' && expression === '') {
      setError('Please enter a number first');
      return;
    } else if (currentInput === '' && expression !== '') {
      const trimmedExpr = expression.trim();
      const lastSpaceIdx = trimmedExpr.lastIndexOf(' ');

      if (lastSpaceIdx > 0) {
        const lastToken = trimmedExpr
          .substring(lastSpaceIdx + 1)
          .trim();

        // FIXED REGEX
        if (lastToken.match(/[+\-×÷^√]/)) {
          const exprWithoutLastOp = trimmedExpr.substring(
            0,
            lastSpaceIdx
          );

          setExpression(
            exprWithoutLastOp + ' ' + operatorSymbols[op]
          );

          setError('');
          return;
        }
      }

      setExpression(expression + ' ' + operatorSymbols[op]);
      setError('');
      return;
    } else if (currentInput === '') {
      setError('');
      return;
    } else {
      let newExpr =
        expression +
        ' ' +
        currentInput +
        ' ' +
        operatorSymbols[op];

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

      let finalExpr = expression;

      if (!finalExpr && !currentInput) {
        setError('Nothing to calculate');
        return;
      }

      if (currentInput) {
        if (finalExpr) {
          const trimmedExpr = finalExpr.trim();
          const lastChar =
            trimmedExpr[trimmedExpr.length - 1];

          // FIXED REGEX
          if (!/[+\-×÷^√]/.test(lastChar)) {
            finalExpr =
              trimmedExpr + ' + ' + currentInput;
          } else {
            finalExpr =
              trimmedExpr + ' ' + currentInput;
          }
        } else {
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

      const tree = parseExpression(finalExpr);

      if (!tree) {
        setError('Invalid expression');
        return;
      }

      const PREC = {
        '+': 1,
        '-': 1,
        '×': 2,
        '*': 2,
        '÷': 2,
        '/': 2,
        '^': 3,
        '√': 4,
      };

      const tokens = finalExpr.trim().split(/\s+/);

      let displayTokens = [...tokens];
      let offset = 0;

      for (let i = 1; i < tokens.length - 2; i += 2) {
        const prevOp = tokens[i];
        const nextOp = tokens[i + 2];

        if (
          PREC[prevOp] !== undefined &&
          PREC[nextOp] !== undefined
        ) {
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

      const displayStr = displayTokens
        .join(' ')
        .replace(/\(\s+/g, '(')
        .replace(/\s+\)/g, ')');

      const calculatedResult =
        evaluateExpressionTree(tree);

      if (
        calculatedResult === null ||
        isNaN(calculatedResult)
      ) {
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
      setCurrentInput(currentInput.slice(0, -1));
    } else if (expression !== '') {
      const newExpr = expression.trimEnd();
      const lastSpaceIdx = newExpr.lastIndexOf(' ');

      if (lastSpaceIdx > 0) {
        const exprWithoutOp = newExpr.substring(
          0,
          lastSpaceIdx
        );

        const tree = parseExpression(exprWithoutOp);

        const displayStr = tree
          ? expressionTreeToString(tree)
          : exprWithoutOp;

        setExpression(exprWithoutOp);
        setDisplayExpression(displayStr);
      } else {
        setExpression('');
        setDisplayExpression('');
      }
    }

    setError('');
  };

  const handleOpenBracket = () => {
    if (result !== '') {
      setExpression('(');
      setCurrentInput('');
      setResult('');
      setDisplayExpression('');
      setError('');
      return;
    }

    if (currentInput !== '' && expression !== '') {
      setExpression(
        expression + ' ' + currentInput + ' ('
      );

      setCurrentInput('');
    } else if (currentInput !== '') {
      setExpression(currentInput + ' (');
      setCurrentInput('');
    } else if (expression !== '') {
      // FIXED REGEX
      if (
        expression
          .trim()
          .match(/[\s+\-×÷^√]\s*$/)
      ) {
        setExpression(expression + ' (');
      } else {
        setExpression(expression + ' (');
      }
    } else {
      setExpression('(');
    }

    setError('');
  };

  const handleCloseBracket = () => {
    if (currentInput === '' && expression === '') {
      setError('Nothing to close');
      return;
    }

    if (currentInput !== '') {
      setExpression(
        expression + ' ' + currentInput + ' )'
      );

      setCurrentInput('');
    } else {
      setExpression(expression + ' )');
    }

    setError('');
  };

  const displayCalcExpression = () => {
    if (result !== '') {
      return displayExpression || '0';
    }

    const PREC = {
      '+': 1,
      '-': 1,
      '×': 2,
      '*': 2,
      '÷': 2,
      '/': 2,
      '^': 3,
      '√': 4,
    };

    let fullExpr = expression;

    if (currentInput) {
      fullExpr = expression + ' ' + currentInput;
    }

    if (!fullExpr.trim()) {
      return currentInput || '0';
    }

    const tokens = fullExpr.trim().split(/\s+/);

    let displayTokens = [...tokens];

    // FIXED REGEX
    const isIncomplete = fullExpr
      .trim()
      .match(/[\s+\-×÷^√]\s*$/);

    if (tokens.length >= 5) {
      let offset = 0;

      for (
        let i = 1;
        i < tokens.length - 2;
        i += 2
      ) {
        const prevOp = tokens[i];
        const nextOp = tokens[i + 2];

        if (
          PREC[prevOp] !== undefined &&
          PREC[nextOp] !== undefined
        ) {
          if (PREC[nextOp] > PREC[prevOp]) {
            const openPos = i + 1 + offset;
            const closePos = i + 5 + offset;

            displayTokens.splice(openPos, 0, '(');
            offset += 1;

            if (!isIncomplete) {
              displayTokens.splice(closePos, 0, ')');
              offset += 1;
            }
          }
        }
      }
    }

    return (
      displayTokens
        .join(' ')
        .replace(/\(\s+/g, '(')
        .replace(/\s+\)/g, ')') ||
      currentInput ||
      '0'
    );
  };

  return (
    <div className="calculator-container">
      <h1>🧮 Calculator</h1>

      <p className="subtitle">
        React + NestJS Full Stack
      </p>

      <div className="calculator-body">
        <div className="display-group">
          <div className="expression-display">
            {displayCalcExpression() || '0'}
          </div>

          {error && (
            <div className="error-display">
              {error}
            </div>
          )}

          {result !== '' && (
            <div className="result-display">
              = {result}
            </div>
          )}
        </div>

        <div className="history-panel">
          <div className="history-header">
            <h2>History</h2>

            <button
              className="btn btn-function btn-clear-history"
              onClick={handleClearHistory}
            >
              Clear
            </button>
          </div>

          {history.length === 0 ? (
            <div className="history-empty">
              No history yet
            </div>
          ) : (
            <ul className="history-list">
              {history.map((entry, index) => (
                <li
                  key={`${entry.timestamp}-${index}`}
                  className="history-item"
                >
                  <span className="history-expression">
                    {entry.expression}
                  </span>

                  <span className="history-result">
                    = {entry.result}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="buttons-grid">
          <button
            className="btn btn-function"
            onClick={handleClear}
          >
            AC
          </button>

          <button
            className="btn btn-function"
            onClick={handleDelete}
          >
            DEL
          </button>

          <button
            className="btn btn-function"
            onClick={handleOpenBracket}
          >
            (
          </button>

          <button
            className="btn btn-function"
            onClick={handleCloseBracket}
          >
            )
          </button>

          <button
            className="btn btn-number"
            onClick={() =>
              handleNumberClick('7')
            }
          >
            7
          </button>

          <button
            className="btn btn-number"
            onClick={() =>
              handleNumberClick('8')
            }
          >
            8
          </button>

          <button
            className="btn btn-number"
            onClick={() =>
              handleNumberClick('9')
            }
          >
            9
          </button>

          <button
            className="btn btn-operator"
            onClick={() =>
              handleOperator('/')
            }
          >
            ÷
          </button>

          <button
            className="btn btn-number"
            onClick={() =>
              handleNumberClick('4')
            }
          >
            4
          </button>

          <button
            className="btn btn-number"
            onClick={() =>
              handleNumberClick('5')
            }
          >
            5
          </button>

          <button
            className="btn btn-number"
            onClick={() =>
              handleNumberClick('6')
            }
          >
            6
          </button>

          <button
            className="btn btn-operator"
            onClick={() =>
              handleOperator('*')
            }
          >
            ×
          </button>

          <button
            className="btn btn-number"
            onClick={() =>
              handleNumberClick('1')
            }
          >
            1
          </button>

          <button
            className="btn btn-number"
            onClick={() =>
              handleNumberClick('2')
            }
          >
            2
          </button>

          <button
            className="btn btn-number"
            onClick={() =>
              handleNumberClick('3')
            }
          >
            3
          </button>

          <button
            className="btn btn-operator"
            onClick={() =>
              handleOperator('-')
            }
          >
            -
          </button>

          <button
            className="btn btn-number btn-zero"
            onClick={() =>
              handleNumberClick('0')
            }
          >
            0
          </button>

          <button
            className="btn btn-number"
            onClick={handleDecimal}
          >
            .
          </button>

          <button
            className="btn btn-operator"
            onClick={() =>
              handleOperator('+')
            }
          >
            +
          </button>

          <button
            className="btn btn-equals"
            onClick={handleEquals}
          >
            =
          </button>

          <button
            className="btn btn-operator"
            onClick={() =>
              handleOperator('^')
            }
          >
            ^
          </button>

          <button
            className="btn btn-operator"
            onClick={() =>
              handleOperator('sqrt')
            }
          >
            √
          </button>

          <button
            className="btn btn-function"
            style={{ visibility: 'hidden' }}
          />

          <button
            className="btn btn-function"
            style={{ visibility: 'hidden' }}
          />
        </div>
      </div>
    </div>
  );
}

export default Calculator;