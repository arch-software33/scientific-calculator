import { useState, useEffect } from 'react';
import { Box, Paper, ActionIcon, Tooltip, Tabs } from '@mantine/core';
import { IconKeyboard } from '@tabler/icons-react';
import type { MantineTheme } from '@mantine/core';
import type { CalculatorMode, CalculatorState } from '../types/calculator';
import { CalculatorService } from '../services/calculator';
import Display from './Display';
import Keypad from './Keypad';
import Graph from './Graph';
import History from './History';
import ShortcutsDialog from './ShortcutsDialog';

const initialState: CalculatorState = {
  display: '0',
  expression: '',
  history: [],
  mode: 'standard',
  error: null,
  isShiftActive: false,
  isDegreeMode: true,
};

const keyboardMap: Record<string, { value: string; type: string }> = {
  '0': { value: '0', type: 'number' },
  '1': { value: '1', type: 'number' },
  '2': { value: '2', type: 'number' },
  '3': { value: '3', type: 'number' },
  '4': { value: '4', type: 'number' },
  '5': { value: '5', type: 'number' },
  '6': { value: '6', type: 'number' },
  '7': { value: '7', type: 'number' },
  '8': { value: '8', type: 'number' },
  '9': { value: '9', type: 'number' },
  '.': { value: '.', type: 'number' },
  '+': { value: '+', type: 'operator' },
  '-': { value: '-', type: 'operator' },
  '*': { value: '*', type: 'operator' },
  '/': { value: '/', type: 'operator' },
  'Enter': { value: 'equals', type: 'equals' },
  'Escape': { value: 'clear', type: 'control' },
  'Backspace': { value: 'backspace', type: 'control' },
  's': { value: 'sin(', type: 'function' },
  'c': { value: 'cos(', type: 'function' },
  't': { value: 'tan(', type: 'function' },
  'p': { value: 'pi', type: 'constant' },
  'e': { value: 'e', type: 'constant' },
  'g': { value: '1.618033988749895', type: 'constant' },
  'l': { value: 'log10(', type: 'function' },
  'n': { value: 'log(', type: 'function' },
  'q': { value: 'sqrt(', type: 'function' },
  '@': { value: '^2', type: 'operator' },
  '#': { value: '^3', type: 'operator' },
  '^': { value: '^', type: 'operator' },
  '(': { value: '(', type: 'operator' },
  ')': { value: ')', type: 'operator' },
  '!': { value: '!', type: 'operator' },
  'm': { value: 'memoryRecall', type: 'memory' },
};

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [shortcutsOpened, setShortcutsOpened] = useState(false);

  const handleModeChange = (mode: CalculatorMode) => {
    setState(prev => ({ ...prev, mode }));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Shift + key combinations
      if (event.shiftKey) {
        switch (event.key.toLowerCase()) {
          case 's':
            event.preventDefault();
            setState(prev => CalculatorService.handleButtonPress('asin(', 'function', prev));
            return;
          case 'c':
            event.preventDefault();
            setState(prev => CalculatorService.handleButtonPress('acos(', 'function', prev));
            return;
          case 't':
            event.preventDefault();
            setState(prev => CalculatorService.handleButtonPress('atan(', 'function', prev));
            return;
          case 'm':
            event.preventDefault();
            setState(prev => CalculatorService.handleButtonPress('memoryAdd', 'memory', prev));
            return;
          case 'n':
            event.preventDefault();
            setState(prev => CalculatorService.handleButtonPress('memorySub', 'memory', prev));
            return;
        }
      }

      // Handle Alt + key combinations
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 's':
            event.preventDefault();
            setState(prev => CalculatorService.handleButtonPress('sinh(', 'function', prev));
            return;
          case 'c':
            event.preventDefault();
            setState(prev => CalculatorService.handleButtonPress('cosh(', 'function', prev));
            return;
          case 't':
            event.preventDefault();
            setState(prev => CalculatorService.handleButtonPress('tanh(', 'function', prev));
            return;
        }
      }

      // Handle regular keys
      const key = event.key;
      const mapping = keyboardMap[key];
      if (mapping) {
        event.preventDefault();
        setState(prev => CalculatorService.handleButtonPress(mapping.value, mapping.type, prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Box
      style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '1rem',
      }}
    >
      <Paper
        shadow="xl"
        p="md"
        style={(theme: MantineTheme) => ({
          backgroundColor: theme.colors.dark[7],
          borderRadius: theme.radius.lg,
        })}
      >
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Box style={{ flex: 1 }}>
            <Tabs 
              value={state.mode} 
              onChange={(value: string | null) => value && handleModeChange(value as CalculatorMode)}
            >
              <Tabs.List>
                <Tabs.Tab value="standard">Standard</Tabs.Tab>
                <Tabs.Tab value="scientific">Scientific</Tabs.Tab>
                <Tabs.Tab value="graphing">Graphing</Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Box>
          <Tooltip label="Keyboard Shortcuts">
            <ActionIcon
              variant="subtle"
              onClick={() => setShortcutsOpened(true)}
              size="lg"
            >
              <IconKeyboard />
            </ActionIcon>
          </Tooltip>
        </Box>

        <Display value={state.display} error={state.error} expression={state.expression} />

        {state.mode === 'standard' && (
          <Keypad mode="standard" state={state} setState={setState} />
        )}

        {state.mode === 'scientific' && (
          <Keypad mode="scientific" state={state} setState={setState} />
        )}

        {state.mode === 'graphing' && (
          <Graph />
        )}

        <History history={state.history} />
      </Paper>

      <ShortcutsDialog
        opened={shortcutsOpened}
        onClose={() => setShortcutsOpened(false)}
      />
    </Box>
  );
} 