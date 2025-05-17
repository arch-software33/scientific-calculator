import { Grid, Button, Tooltip } from '@mantine/core';
import { motion } from 'framer-motion';
import type { CalculatorState, CalculatorMode } from '../types/calculator';
import { CalculatorService } from '../services/calculator';
import { CALCULATOR_CONSTANTS } from '../theme';

interface KeypadProps {
  mode: CalculatorMode;
  state: CalculatorState;
  setState: React.Dispatch<React.SetStateAction<CalculatorState>>;
}

const standardButtons = [
  { label: 'C', value: 'clear', type: 'control', shortcut: 'Esc' },
  { label: '⌫', value: 'backspace', type: 'control', shortcut: 'Backspace' },
  { label: '%', value: 'percent', type: 'operator', shortcut: '%' },
  { label: '÷', value: '/', type: 'operator', shortcut: '/' },
  { label: '7', value: '7', type: 'number', shortcut: '7' },
  { label: '8', value: '8', type: 'number', shortcut: '8' },
  { label: '9', value: '9', type: 'number', shortcut: '9' },
  { label: '×', value: '*', type: 'operator', shortcut: '*' },
  { label: '4', value: '4', type: 'number', shortcut: '4' },
  { label: '5', value: '5', type: 'number', shortcut: '5' },
  { label: '6', value: '6', type: 'number', shortcut: '6' },
  { label: '-', value: '-', type: 'operator', shortcut: '-' },
  { label: '1', value: '1', type: 'number', shortcut: '1' },
  { label: '2', value: '2', type: 'number', shortcut: '2' },
  { label: '3', value: '3', type: 'number', shortcut: '3' },
  { label: '+', value: '+', type: 'operator', shortcut: '+' },
  { label: '±', value: 'negate', type: 'operator', shortcut: 'n' },
  { label: '0', value: '0', type: 'number', shortcut: '0' },
  { label: '.', value: '.', type: 'number', shortcut: '.' },
  { label: '=', value: 'equals', type: 'equals', shortcut: 'Enter' },
];

const scientificButtons = [
  // Row 1: Inverse and Hyperbolic Functions
  { label: 'sin⁻¹', value: 'asin(', type: 'function', shortcut: 'Shift+S' },
  { label: 'cos⁻¹', value: 'acos(', type: 'function', shortcut: 'Shift+C' },
  { label: 'tan⁻¹', value: 'atan(', type: 'function', shortcut: 'Shift+T' },
  { label: 'sinh', value: 'sinh(', type: 'function', shortcut: 'Alt+S' },
  { label: 'cosh', value: 'cosh(', type: 'function', shortcut: 'Alt+C' },
  { label: 'tanh', value: 'tanh(', type: 'function', shortcut: 'Alt+T' },
  
  // Row 2: Basic Trig and Constants
  { label: 'sin', value: 'sin(', type: 'function', shortcut: 's' },
  { label: 'cos', value: 'cos(', type: 'function', shortcut: 'c' },
  { label: 'tan', value: 'tan(', type: 'function', shortcut: 't' },
  { label: 'π', value: 'pi', type: 'constant', shortcut: 'p' },
  { label: 'e', value: 'e', type: 'constant', shortcut: 'e' },
  { label: 'φ', value: '1.618033988749895', type: 'constant', shortcut: 'g' },

  // Row 3: Advanced Functions
  { label: 'log', value: 'log10(', type: 'function', shortcut: 'l' },
  { label: 'ln', value: 'log(', type: 'function', shortcut: 'n' },
  { label: '√', value: 'sqrt(', type: 'function', shortcut: 'q' },
  { label: 'x²', value: '^2', type: 'operator', shortcut: '@' },
  { label: 'x³', value: '^3', type: 'operator', shortcut: '#' },
  { label: 'xʸ', value: '^', type: 'operator', shortcut: '^' },

  // Row 4: Memory and Special Functions
  { label: '(', value: '(', type: 'operator', shortcut: '(' },
  { label: ')', value: ')', type: 'operator', shortcut: ')' },
  { label: '!', value: '!', type: 'operator', shortcut: '!' },
  { label: 'M+', value: 'memoryAdd', type: 'memory', shortcut: 'Shift+M' },
  { label: 'M-', value: 'memorySub', type: 'memory', shortcut: 'Shift+N' },
  { label: 'MR', value: 'memoryRecall', type: 'memory', shortcut: 'm' },
];

const MotionButton = motion(Button);

export default function Keypad({ mode, state, setState }: KeypadProps) {
  const handleButtonClick = (value: string, type: string) => {
    setState(prev => CalculatorService.handleButtonPress(value, type, prev));
  };

  const buttons = mode === 'standard' ? standardButtons : [...scientificButtons, ...standardButtons];

  return (
    <Grid gutter="xs">
      {buttons.map((button, index) => (
        <Grid.Col span={mode === 'standard' ? 3 : 2} key={button.label}>
          <Tooltip label={`Shortcut: ${button.shortcut}`} position="top">
            <MotionButton
              fullWidth
              size="xl"
              variant={button.type === 'operator' ? 'light' : 'filled'}
              onClick={() => handleButtonClick(button.value, button.type)}
              whileHover={{ scale: CALCULATOR_CONSTANTS.HOVER_BRIGHTNESS }}
              whileTap={{ scale: CALCULATOR_CONSTANTS.ACTIVE_SCALE }}
              style={{
                height: `${CALCULATOR_CONSTANTS.BUTTON_SIZE}px`,
              }}
            >
              {button.label}
            </MotionButton>
          </Tooltip>
        </Grid.Col>
      ))}
    </Grid>
  );
} 