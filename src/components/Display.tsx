import { Paper, Text, Stack } from '@mantine/core';
import { motion } from 'framer-motion';

interface DisplayProps {
  value: string;
  expression: string;
  error: string | null;
}

const MotionText = motion(Text);

export default function Display({ value, expression, error }: DisplayProps) {
  return (
    <Paper
      p="md"
      style={(theme) => ({
        backgroundColor: theme.colors.dark[8],
        marginBottom: theme.spacing.md,
        minHeight: '120px',
      })}
    >
      <Stack spacing="xs" align="flex-end">
        <Text
          size="sm"
          c="dimmed"
          style={{
            minHeight: '20px',
            fontFamily: 'monospace',
          }}
        >
          {expression}
        </Text>
        
        <MotionText
          size="xl"
          style={{
            fontSize: '2.5rem',
            fontFamily: 'monospace',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={value}
        >
          {error ? (
            <Text c="red">{error}</Text>
          ) : (
            value
          )}
        </MotionText>
      </Stack>
    </Paper>
  );
} 