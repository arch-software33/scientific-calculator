import { useEffect, useRef } from 'react';
import { Box, Text } from '@mantine/core';
import { motion } from 'framer-motion';

interface DisplayProps {
  value: string;
  error: string | null;
  expression: string;
  onExpressionChange?: (expression: string) => void;
}

const MotionText = motion(Text);

export default function Display({ value, error, expression, onExpressionChange }: DisplayProps) {
  const displayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!onExpressionChange || document.activeElement?.tagName === 'INPUT') return;

      // Allow only numbers, operators, and control keys
      if (e.key.match(/^[0-9+\-*/().^!%]$/) || 
          e.key === 'Backspace' || 
          e.key === 'Delete' || 
          e.key === 'Enter' ||
          e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();

        if (e.key === 'Backspace') {
          onExpressionChange(expression.slice(0, -1));
        } else if (e.key === 'Delete' || e.key === 'Escape') {
          onExpressionChange('');
        } else if (e.key === 'Enter') {
          // Handle enter in parent component
        } else {
          onExpressionChange(expression + e.key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [expression, onExpressionChange]);

  return (
    <Box
      ref={displayRef}
      style={{
        backgroundColor: 'var(--mantine-color-dark-6)',
        padding: '1rem',
        borderRadius: 'var(--mantine-radius-md)',
        marginBottom: '1rem',
        minHeight: '100px',
        cursor: 'text',
      }}
      tabIndex={0}
    >
      <MotionText
        size="xl"
        style={{
          fontFamily: 'monospace',
          wordBreak: 'break-all',
          color: error ? 'var(--mantine-color-red-6)' : undefined,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        key={value}
      >
        {error || expression || value || '0'}
      </MotionText>
    </Box>
  );
} 