import { useState, useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import Calculator from './components/Calculator';
import LoadingScreen from './components/LoadingScreen';
import { theme } from './theme';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time to prevent flash
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Calculator />
      )}
    </MantineProvider>
  );
}
