import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculatorService {
  calculate(operator: string, numbers: number[]): number {
    if (!numbers || numbers.length === 0) {
      throw new Error('At least one number is required');
    }

    if (
      numbers.length < 2 &&
      operator !== 'sqrt'
    ) {
      throw new Error(`${operator} operation requires at least 2 numbers`);
    }

    let result: number;

    switch (operator) {
      case '+':
        result = numbers.reduce((a, b) => a + b, 0);
        break;

      case '-':
        result = numbers.reduce((a, b) => a - b);
        break;

      case '*':
        result = numbers.reduce((a, b) => a * b, 1);
        break;

      case '/':
        if (numbers.some((n) => n === 0)) {
          throw new Error('Cannot divide by zero');
        }
        result = numbers.reduce((a, b) => a / b);
        break;

      case '^':
        if (numbers.length !== 2) {
          throw new Error('Power operation requires exactly 2 numbers');
        }
        result = Math.pow(numbers[0], numbers[1]);
        break;

      case 'sqrt':
        if (numbers.length !== 1) {
          throw new Error('Square root requires exactly 1 number');
        }
        if (numbers[0] < 0) {
          throw new Error('Cannot calculate square root of negative number');
        }
        result = Math.sqrt(numbers[0]);
        break;

      default:
        throw new Error(
          `Unknown operator: ${operator}. Use +, -, *, /, ^, or sqrt`,
        );
    }

    return result;
  }
}
