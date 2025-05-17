import { Box, Text } from '@mantine/core';
import { motion } from 'framer-motion';

const digitVariants = {
  animate: {
    opacity: [0.2, 1, 0.2],
    scale: [0.8, 1.2, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LoadingScreen() {
  const digits = ['1', '0', '1'];

  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--mantine-color-dark-7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
      }}
    >
      <motion.div
        variants={containerVariants}
        animate="animate"
        style={{
          display: 'flex',
          gap: '1rem',
        }}
      >
        {digits.map((digit, index) => (
          <motion.div
            key={index}
            variants={digitVariants}
            style={{
              fontSize: '4rem',
              fontFamily: 'monospace',
              color: 'var(--mantine-color-blue-4)',
              fontWeight: 'bold',
            }}
          >
            {digit}
          </motion.div>
        ))}
      </motion.div>
      <Text 
        c="dimmed"
        style={{
          fontFamily: 'monospace',
          fontSize: '1.2rem',
        }}
      >
        Initializing Calculator...
      </Text>
    </Box>
  );
} 