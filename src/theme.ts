import { createTheme } from '@mantine/core';

export const CALCULATOR_CONSTANTS = {
  BUTTON_SIZE: 48,
  HOVER_BRIGHTNESS: 1.2,
  ACTIVE_SCALE: 0.95,
};

export const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
    blue: [
      '#DBE4FF',
      '#B4C6FF',
      '#8DA8FF',
      '#658AFF',
      '#3D6CFF',
      '#154EFF',
      '#0039F5',
      '#002CBD',
      '#001F85',
      '#00124D',
    ],
  },
  shadows: {
    md: '0 2px 4px rgba(0, 0, 0, 0.2)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.25)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.3)',
  },
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        root: {
          transition: 'all 0.2s ease',
        },
      },
    },
    TextInput: {
      styles: {
        input: {
          backgroundColor: 'var(--mantine-color-dark-6)',
          color: 'var(--mantine-color-white)',
          '&::placeholder': {
            color: 'var(--mantine-color-dark-2)',
          },
        },
      },
    },
  },
}); 