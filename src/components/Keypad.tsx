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
  // Group 1: Basic Controls and Memory
  { label: 'C', value: 'clear', type: 'control', shortcut: 'Esc', group: 'control' },
  { label: '⌫', value: 'backspace', type: 'control', shortcut: 'Backspace', group: 'control' },
  { label: 'M+', value: 'memoryAdd', type: 'memory', shortcut: 'Shift+M', group: 'memory' },
  { label: 'M-', value: 'memorySub', type: 'memory', shortcut: 'Shift+N', group: 'memory' },
  { label: 'MR', value: 'memoryRecall', type: 'memory', shortcut: 'm', group: 'memory' },
  { label: 'MC', value: 'memoryClear', type: 'memory', shortcut: 'Shift+C', group: 'memory' },

  // Group 2: Constants and Special Numbers
  { label: 'π', value: 'pi', type: 'constant', shortcut: 'p', group: 'constant' },
  { label: 'e', value: 'e', type: 'constant', shortcut: 'e', group: 'constant' },
  { label: 'φ', value: '1.618033988749895', type: 'constant', shortcut: 'g', group: 'constant' },
  { label: '∞', value: 'Infinity', type: 'constant', shortcut: 'i', group: 'constant' },

  // Group 3: Advanced Functions
  { label: <SuperscriptButton base="x" exponent="2" />, value: '^2', type: 'operator', shortcut: '@', group: 'power' },
  { label: <SuperscriptButton base="x" exponent="3" />, value: '^3', type: 'operator', shortcut: '#', group: 'power' },
  { label: <SuperscriptButton base="x" exponent="n" />, value: '^', type: 'operator', shortcut: '^', group: 'power' },
  { label: '√', value: 'sqrt(', type: 'function', shortcut: 'q', group: 'power' },
  { label: '∛', value: 'cbrt(', type: 'function', shortcut: 'Shift+Q', group: 'power' },
  { label: 'ⁿ√', value: 'nthRoot(', type: 'function', shortcut: 'Shift+R', group: 'power' },

  // Group 4: Logarithmic Functions
  { label: 'log', value: 'log10(', type: 'function', shortcut: 'l', group: 'log' },
  { label: 'ln', value: 'log(', type: 'function', shortcut: 'n', group: 'log' },
  { label: 'logₐ', value: 'log(', type: 'function', shortcut: 'Shift+L', group: 'log' },
  { label: 'eˣ', value: 'exp(', type: 'function', shortcut: 'Shift+E', group: 'log' },

  // Group 5: Trigonometric Functions
  { label: 'sin', value: 'sin(', type: 'function', shortcut: 's', group: 'trig' },
  { label: 'cos', value: 'cos(', type: 'function', shortcut: 'c', group: 'trig' },
  { label: 'tan', value: 'tan(', type: 'function', shortcut: 't', group: 'trig' },
  { label: 'sin⁻¹', value: 'asin(', type: 'function', shortcut: 'Shift+S', group: 'trig' },
  { label: 'cos⁻¹', value: 'acos(', type: 'function', shortcut: 'Shift+C', group: 'trig' },
  { label: 'tan⁻¹', value: 'atan(', type: 'function', shortcut: 'Shift+T', group: 'trig' },

  // Group 6: Hyperbolic Functions
  { label: 'sinh', value: 'sinh(', type: 'function', shortcut: 'Alt+S', group: 'hyp' },
  { label: 'cosh', value: 'cosh(', type: 'function', shortcut: 'Alt+C', group: 'hyp' },
  { label: 'tanh', value: 'tanh(', type: 'function', shortcut: 'Alt+T', group: 'hyp' },
  { label: 'sinh⁻¹', value: 'asinh(', type: 'function', shortcut: 'Alt+Shift+S', group: 'hyp' },
  { label: 'cosh⁻¹', value: 'acosh(', type: 'function', shortcut: 'Alt+Shift+C', group: 'hyp' },
  { label: 'tanh⁻¹', value: 'atanh(', type: 'function', shortcut: 'Alt+Shift+T', group: 'hyp' },

  // Group 7: Algebra and Analysis
  { label: 'factor', value: 'factor(', type: 'function', shortcut: 'f', group: 'algebra' },
  { label: 'expand', value: 'expand(', type: 'function', shortcut: 'x', group: 'algebra' },
  { label: 'gcd', value: 'gcd(', type: 'function', shortcut: 'Shift+G', group: 'algebra' },
  { label: 'lcm', value: 'lcm(', type: 'function', shortcut: 'Shift+H', group: 'algebra' },
  { label: 'mod', value: 'mod(', type: 'function', shortcut: 'Shift+M', group: 'algebra' },
  { label: '|x|', value: 'abs(', type: 'function', shortcut: 'a', group: 'algebra' },

  // Group 8: Basic Operators and Parentheses
  { label: '(', value: '(', type: 'operator', shortcut: '(', group: 'operator' },
  { label: ')', value: ')', type: 'operator', shortcut: ')', group: 'operator' },
  { label: '!', value: '!', type: 'operator', shortcut: '!', group: 'operator' },
  { label: '%', value: 'percent', type: 'operator', shortcut: '%', group: 'operator' },
];

const MotionButton = motion(Button);

const SuperscriptButton = ({ base, exponent, onClick }: { base: string; exponent: string; onClick: () => void }) => (
  <MotionButton
    fullWidth
    size="xl"
    variant="light"
    onClick={onClick}
    whileHover={{ scale: CALCULATOR_CONSTANTS.HOVER_BRIGHTNESS }}
    whileTap={{ scale: CALCULATOR_CONSTANTS.ACTIVE_SCALE }}
    style={{
      height: `${CALCULATOR_CONSTANTS.BUTTON_SIZE}px`,
      position: 'relative',
      fontFamily: 'monospace',
    }}
  >
    {base}
    <span style={{
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      fontSize: '0.8em',
      lineHeight: 1,
    }}>
      {exponent}
    </span>
  </MotionButton>
);

export default function Keypad({ mode, state, setState }: KeypadProps) {
  const handleButtonClick = (value: string, type: string) => {
    setState(prev => CalculatorService.handleButtonPress(value, type, prev));
  };

  const renderButtons = () => {
    if (mode === 'standard') {
      return standardButtons.map((button, index) => (
        <Grid.Col span={3} key={button.label}>
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
      ));
    }

    // Group buttons by their group property
    const groupedButtons = scientificButtons.reduce((acc, button) => {
      const group = button.group || 'other';
      if (!acc[group]) acc[group] = [];
      acc[group].push(button);
      return acc;
    }, {} as Record<string, typeof scientificButtons>);

    // Render buttons by group
    return Object.entries(groupedButtons).map(([groupName, buttons]) => (
      <Grid.Col span={12} key={groupName}>
        <Grid>
          {buttons.map((button) => (
            <Grid.Col span={2} key={button.label}>
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
      </Grid.Col>
    ));
  };

  return (
    <Grid gutter="xs">
      {renderButtons()}
    </Grid>
  );
} 