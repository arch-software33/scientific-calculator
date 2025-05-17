import { evaluate } from 'mathjs';
import type { CalculatorState } from '../types/calculator';

export class CalculatorService {
  private static memory: number = 0;

  private static formatNumber(num: number): string {
    if (Number.isInteger(num)) {
      return num.toString();
    }
    return num.toFixed(8).replace(/\.?0+$/, '');
  }

  static evaluateExpression(expression: string, isDegreeMode: boolean): string {
    try {
      if (!expression) return '0';

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