import { Modal, Table, Text, Group } from '@mantine/core';

interface ShortcutsDialogProps {
  opened: boolean;
  onClose: () => void;
}

interface ShortcutCategory {
  title: string;
  shortcuts: { key: string; description: string }[];
}

const shortcutCategories: ShortcutCategory[] = [
  {
    title: 'Basic Operations',
    shortcuts: [
      { key: '0-9', description: 'Number input' },
      { key: '+, -, *, /', description: 'Basic arithmetic' },
      { key: 'Enter', description: 'Calculate result' },
      { key: 'Esc', description: 'Clear all' },
      { key: 'Backspace', description: 'Delete last character' },
    ],
  },
  {
    title: 'Trigonometric Functions',
    shortcuts: [
      { key: 's, c, t', description: 'sin, cos, tan' },
      { key: 'Shift + S/C/T', description: 'arcsin, arccos, arctan' },
      { key: 'Alt + S/C/T', description: 'sinh, cosh, tanh' },
    ],
  },
  {
    title: 'Advanced Functions',
    shortcuts: [
      { key: 'l', description: 'log (base 10)' },
      { key: 'n', description: 'natural log' },
      { key: 'q', description: 'square root' },
      { key: '@', description: 'square' },
      { key: '#', description: 'cube' },
      { key: '^', description: 'power' },
    ],
  },
  {
    title: 'Constants',
    shortcuts: [
      { key: 'p', description: 'π (pi)' },
      { key: 'e', description: 'e (euler\'s number)' },
      { key: 'g', description: 'φ (golden ratio)' },
    ],
  },
  {
    title: 'Memory Operations',
    shortcuts: [
      { key: 'Shift + M', description: 'Memory Add (M+)' },
      { key: 'Shift + N', description: 'Memory Subtract (M-)' },
      { key: 'm', description: 'Memory Recall (MR)' },
    ],
  },
];

export default function ShortcutsDialog({ opened, onClose }: ShortcutsDialogProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Keyboard Shortcuts"
      size="lg"
      centered
    >
      {shortcutCategories.map((category) => (
        <div key={category.title}>
          <Text size="lg" fw={500} mt="md" mb="xs">
            {category.title}
          </Text>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Key</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {category.shortcuts.map((shortcut) => (
                <Table.Tr key={shortcut.key}>
                  <Table.Td>
                    {shortcut.key.split('/').map((key, index) => (
                      <Group gap={4} display="inline-flex" key={key}>
                        {index > 0 && <span>/</span>}
                        <Text span c="blue" fw={500}>
                          {key.trim()}
                        </Text>
                      </Group>
                    ))}
                  </Table.Td>
                  <Table.Td>{shortcut.description}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      ))}
    </Modal>
  );
} 