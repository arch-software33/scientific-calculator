import { evaluate } from 'mathjs';
import * as algebrite from 'algebrite';
import type { CalculatorState } from '../types/calculator';

export class CalculatorService {
  private static memory: number = 0;

  private static formatNumber(num: number): string {
    if (Number.isInteger(num)) {
      return num.toString();
    }
    return num.toFixed(8).replace(/\.?0+$/, '');
  }

  private static handleAlgebraOperation(operation: string, expression: string): string {
    try {
      let result: string;
      switch (operation) {
        case 'factor(':
          result = algebrite.factor(expression).toString();
          break;
        case 'expand(':
          result = algebrite.expand(expression).toString();
          break;
        case 'gcd(':
          result = algebrite.gcd(expression).toString();
          break;
        case 'lcm(':
          result = algebrite.lcm(expression).toString();
          break;
        default:
          return 'Error: Unknown operation';
      }
      // Clean up the output
      return result
        .replace(/\*\*/g, '^')  // Replace ** with ^
        .replace(/\*/g, '×')    // Replace * with ×
        .replace(/ /g, '')      // Remove spaces
        .replace(/\+\-/g, '-'); // Clean up signs
    } catch (error) {
      return 'Error: Invalid expression';
    }
  }

  static evaluateExpression(expression: string, isDegreeMode: boolean): string {
    try {
      if (!expression) return '0';

      // Check if it's an algebra operation
      if (expression.startsWith('factor(') || 
          expression.startsWith('expand(') ||
          expression.startsWith('gcd(') ||
          expression.startsWith('lcm(')) {
        const operation = expression.substring(0, expression.indexOf('(') + 1);
        const innerExpression = expression.substring(expression.indexOf('(') + 1, expression.lastIndexOf(')'));
        return this.handleAlgebraOperation(operation, innerExpression);
      }

      // Convert degrees to radians for trigonometric functions if in degree mode
      let processedExpression = expression;
      if (isDegreeMode) {
        const trigFunctions = [
          'sin', 'cos', 'tan',
          'asin', 'acos', 'atan',
          'sinh', 'cosh', 'tanh'
        ];
        trigFunctions.forEach(func => {
          const regex = new RegExp(`${func}\\((.*?)\\)`, 'g');
          processedExpression = processedExpression.replace(regex, (match, p1) => {
            // Only convert regular trig functions, not hyperbolic
            if (!func.includes('h')) {
              return `${func}((${p1}) * pi / 180)`;
            }
            return match;
          });
        });
      }

      const result = evaluate(processedExpression);
      return this.formatNumber(result);
    } catch (error) {
      return 'Error';
    }
  }

  private static handleMemoryOperation(operation: string, currentValue: string): string {
    try {
      const value = evaluate(currentValue);
      switch (operation) {
        case 'memoryAdd':
          this.memory += value;
          return currentValue;
        case 'memorySub':
          this.memory -= value;
          return currentValue;
        case 'memoryRecall':
          return this.formatNumber(this.memory);
        case 'memoryClear':
          this.memory = 0;
          return currentValue;
        default:
          return currentValue;
      }
    } catch {
      return 'Error';
    }
  }

  static handleButtonPress(
    value: string,
    type: string,
    state: CalculatorState
  ): CalculatorState {
    const { expression, display } = state;

    switch (type) {
      case 'number':
      case 'operator':
      case 'constant':
        return {
          ...state,
          expression: expression + value,
          display: display === '0' ? value : display + value,
          error: null,
        };

      case 'function':
        return {
          ...state,
          expression: expression + value,
          display: display + value,
          error: null,
        };

      case 'memory': {
        const memoryResult = this.handleMemoryOperation(value, expression || display);
        return {
          ...state,
          display: memoryResult,
          expression: memoryResult === 'Error' ? '' : memoryResult,
          error: memoryResult === 'Error' ? 'Invalid operation' : null,
        };
      }

      case 'control':
        switch (value) {
          case 'clear':
            return {
              ...state,
              expression: '',
              display: '0',
              error: null,
            };
          case 'backspace':
            return {
              ...state,
              expression: expression.slice(0, -1),
              display: display.slice(0, -1) || '0',
              error: null,
            };
          default:
            return state;
        }

      case 'equals':
        try {
          const result = this.evaluateExpression(expression, state.isDegreeMode);
          return {
            ...state,
            display: result,
            expression: result,
            history: [
              {
                expression,
                result,
                timestamp: Date.now(),
              },
              ...state.history,
            ].slice(0, 100), // Keep only last 100 entries
            error: null,
          };
        } catch (error) {
          return {
            ...state,
            error: 'Invalid expression',
          };
        }

      default:
        return state;
    }
  }
} 