import { MantineProvider, AppShell } from '@mantine/core';
import { theme } from './theme';
import Calculator from './components/Calculator';

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppShell>
        <Calculator />
      </AppShell>
    </MantineProvider>
  );
}

export default App;
