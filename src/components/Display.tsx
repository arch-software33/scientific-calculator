import { useEffect, useRef, useState } from 'react';
import { Box, TextInput } from '@mantine/core';
import { motion } from 'framer-motion';

interface DisplayProps {
  value: string;
  error: string | null;
  expression: string;
  onExpressionChange?: (expression: string) => void;
  onEnter?: () => void;
}

const MotionBox = motion(Box);

export default function Display({ value, error, expression, onExpressionChange, onEnter }: DisplayProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!onExpressionChange || document.activeElement?.tagName === 'INPUT') return;

      if (e.key === 'Enter' && onEnter) {
        e.preventDefault();
        e.stopPropagation();
        onEnter();
        return;
      }

      // Allow letters for variables and all valid operators
      if (e.key.match(/^[0-9a-zA-Z+\-*/().^!%=]$/) || 
          e.key === 'Backspace' || 
          e.key === 'Delete' || 
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight' ||
          e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();

        if (e.key === 'Backspace') {
          onExpressionChange(expression.slice(0, -1));
        } else if (e.key === 'Delete' || e.key === 'Escape') {
          onExpressionChange('');
        } else if (!e.key.match(/^Arrow/)) {
          onExpressionChange(expression + e.key);
        }
      }
    };

    if (!isFocused) {
      window.addEventListener('keydown', handleKeyDown, true);
      return () => window.removeEventListener('keydown', handleKeyDown, true);
    }
  }, [expression, onExpressionChange, onEnter, isFocused]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--mantine-color-dark-6)',
        padding: '1rem',
        borderRadius: 'var(--mantine-radius-md)',
        marginBottom: '1rem',
        minHeight: '100px',
      }}
    >
      <TextInput
        ref={inputRef}
        value={error || expression || value || '0'}
        onChange={(e) => onExpressionChange?.(e.currentTarget.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) {
            e.preventDefault();
            onEnter();
          }
        }}
        error={!!error}
        size="xl"
        styles={{
          input: {
            fontFamily: 'monospace',
            fontSize: '2rem',
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'text',
            '&:focus': {
              outline: 'none',
              border: 'none',
            },
          },
          error: {
            fontSize: '1rem',
          },
        }}
      />
    </MotionBox>
  );
} 