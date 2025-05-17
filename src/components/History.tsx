import { Paper, Text, Stack, ScrollArea } from '@mantine/core';
import { motion } from 'framer-motion';
import type { CalculationHistoryItem } from '../types/calculator';

interface HistoryProps {
  history: CalculationHistoryItem[];
}

const MotionPaper = motion(Paper);

export default function History({ history }: HistoryProps) {
  return (
    <Paper
      mt="md"
      p="md"
      style={(theme) => ({
        backgroundColor: theme.colors.dark[8],
        maxHeight: '200px',
      })}
    >
      <Text size="sm" c="dimmed" mb="xs">History</Text>
      <ScrollArea>
        <Stack>
          {history.map((item, index) => (
            <MotionPaper
              key={item.timestamp}
              p="xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={(theme) => ({
                backgroundColor: theme.colors.dark[7],
              })}
            >
              <Text size="sm" c="dimmed">{item.expression}</Text>
              <Text size="md">{item.result}</Text>
              <Text size="xs" c="dimmed">
                {new Date(item.timestamp).toLocaleTimeString()}
              </Text>
            </MotionPaper>
          ))}
        </Stack>
      </ScrollArea>
    </Paper>
  );
} 