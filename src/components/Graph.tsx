import { useState, useEffect, useRef } from 'react';
import { Box, TextInput, Button, Group, ColorInput, NumberInput, Switch, ActionIcon, Tooltip } from '@mantine/core';
import { IconZoomIn, IconZoomOut, IconGridDots, IconMath, IconTrash } from '@tabler/icons-react';
import Plot from 'react-plotly.js';
import { evaluate, derivative } from 'mathjs';
import type { GraphFunction } from '../types/calculator';
import type { Data } from 'plotly.js';

const DEFAULT_RANGE = [-10, 10] as [number, number];
const POINTS = 1000;
const ZOOM_FACTOR = 1.5;

interface Points {
  x: number[];
  y: (number | null)[];
}

interface GraphSettings {
  showGrid: boolean;
  showDerivatives: boolean;
  xRange: [number, number];
  yRange: [number, number];
  gridDensity: number;
}

export default function Graph() {
  const [functions, setFunctions] = useState<GraphFunction[]>([]);
  const [newFunction, setNewFunction] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<GraphSettings>({
    showGrid: true,
    showDerivatives: false,
    xRange: [...DEFAULT_RANGE],
    yRange: [...DEFAULT_RANGE],
    gridDensity: 10,
  });
  const functionInputRef = useRef<HTMLInputElement>(null);

  // Prevent keyboard shortcuts when input is focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === functionInputRef.current) {
        e.stopPropagation();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  const clearAll = () => {
    setFunctions([]);
    setNewFunction('');
    setError(null);
  };

  const generatePoints = (expression: string, range: [number, number] = settings.xRange): Points => {
    const points: Points = { x: [], y: [] };
    const step = (range[1] - range[0]) / POINTS;

    try {
      for (let x = range[0]; x <= range[1]; x += step) {
        try {
          const y = evaluate(expression.replace(/x/g, `(${x})`));
          points.x.push(x);
          points.y.push(typeof y === 'number' ? y : null);
        } catch {
          points.x.push(x);
          points.y.push(null);
        }
      }
    } catch (err) {
      setError('Invalid expression');
    }

    return points;
  };

  const generateDerivativePoints = (expression: string): Points => {
    try {
      const derivativeExpr = derivative(expression, 'x').toString();
      return generatePoints(derivativeExpr);
    } catch (error) {
      console.error('Failed to generate derivative:', error);
      return { x: [], y: [] };
    }
  };

  const addFunction = () => {
    if (!newFunction) return;

    try {
      // Clean up the expression
      const cleanExpression = newFunction
        .replace(/=/g, '') // Remove equals signs
        .trim();

      // Test if the expression is valid
      evaluate(cleanExpression.replace(/x/g, '(1)'));

      const newGraphFunction: GraphFunction = {
        id: Date.now().toString(),
        expression: cleanExpression,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        isVisible: true,
      };

      setFunctions(prev => [...prev, newGraphFunction]);
      setNewFunction('');
      setError(null);
    } catch (err) {
      setError('Invalid expression');
    }
  };

  const removeFunction = (id: string) => {
    setFunctions(prev => prev.filter(f => f.id !== id));
  };

  const handleZoom = (factor: number) => {
    setSettings(prev => ({
      ...prev,
      xRange: [prev.xRange[0] * factor, prev.xRange[1] * factor] as [number, number],
      yRange: [prev.yRange[0] * factor, prev.yRange[1] * factor] as [number, number],
    }));
  };

  const createPlotData = (): Data[] => {
    try {
      const functionPlots = functions.map(f => {
        const points = generatePoints(f.expression);
        return {
          x: points.x,
          y: points.y,
          type: 'scatter' as const,
          mode: 'lines' as const,
          name: f.expression,
          line: { color: f.color },
        };
      });

      if (!settings.showDerivatives) {
        return functionPlots;
      }

      const derivativePlots = functions.map(f => {
        try {
          const points = generateDerivativePoints(f.expression);
          return {
            x: points.x,
            y: points.y,
            type: 'scatter' as const,
            mode: 'lines' as const,
            name: `d/dx(${f.expression})`,
            line: { 
              color: f.color,
              dash: 'dash',
            },
          };
        } catch (error) {
          console.error('Failed to plot derivative:', error);
          return null;
        }
      }).filter(Boolean);

      return [...functionPlots, ...derivativePlots];
    } catch (error) {
      console.error('Failed to create plot data:', error);
      return [];
    }
  };

  return (
    <Box>
      <Group mb="md" align="flex-end">
        <TextInput
          placeholder="Enter a function (e.g., y = x^2 or sin(x))"
          value={newFunction}
          onChange={(e) => setNewFunction(e.currentTarget.value)}
          error={error}
          style={{ flex: 1 }}
          ref={functionInputRef}
        />
        <Button onClick={addFunction}>Add Function</Button>
        <Tooltip label="Clear All">
          <ActionIcon variant="light" onClick={() => {
            setFunctions([]);
            setNewFunction('');
            setError(null);
          }}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Group mb="md">
        <Tooltip label="Zoom In">
          <ActionIcon onClick={() => handleZoom(1/ZOOM_FACTOR)} variant="light">
            <IconZoomIn />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Zoom Out">
          <ActionIcon onClick={() => handleZoom(ZOOM_FACTOR)} variant="light">
            <IconZoomOut />
          </ActionIcon>
        </Tooltip>
        <Switch
          label="Show Grid"
          checked={settings.showGrid}
          onChange={(e) => setSettings(prev => ({ ...prev, showGrid: e.currentTarget.checked }))}
        />
        <Switch
          label="Show Derivatives"
          checked={settings.showDerivatives}
          onChange={(e) => setSettings(prev => ({ ...prev, showDerivatives: e.currentTarget.checked }))}
        />
        <NumberInput
          label="Grid Density"
          value={settings.gridDensity}
          min={5}
          max={20}
          step={1}
          onChange={(value) => setSettings(prev => ({ ...prev, gridDensity: Number(value) }))}
          style={{ width: 100 }}
        />
      </Group>

      <Box
        style={{
          height: '400px',
          backgroundColor: 'var(--mantine-color-dark-7)',
          borderRadius: 'var(--mantine-radius-md)',
          overflow: 'hidden',
        }}
      >
        <Plot
          data={createPlotData()}
          layout={{
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'transparent',
            showlegend: true,
            xaxis: {
              gridcolor: settings.showGrid ? 'rgba(255,255,255,0.1)' : 'transparent',
              zerolinecolor: 'rgba(255,255,255,0.2)',
              range: settings.xRange,
              dtick: settings.showGrid ? settings.gridDensity : undefined,
            },
            yaxis: {
              gridcolor: settings.showGrid ? 'rgba(255,255,255,0.1)' : 'transparent',
              zerolinecolor: 'rgba(255,255,255,0.2)',
              range: settings.yRange,
              dtick: settings.showGrid ? settings.gridDensity : undefined,
            },
            margin: { t: 20, b: 40, l: 40, r: 20 },
            font: { color: '#fff' },
            legend: { font: { color: '#fff' } },
          }}
          style={{ width: '100%', height: '100%' }}
          config={{
            responsive: true,
            scrollZoom: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['autoScale2d', 'select2d', 'lasso2d'],
          }}
        />
      </Box>

      {functions.map(f => (
        <Group key={f.id} mt="xs">
          <TextInput
            value={f.expression}
            readOnly
            style={{ flex: 1 }}
          />
          <ColorInput
            value={f.color}
            onChange={(color) => {
              setFunctions(prev =>
                prev.map(func =>
                  func.id === f.id ? { ...func, color } : func
                )
              );
            }}
          />
          <Button
            color="red"
            variant="subtle"
            onClick={() => removeFunction(f.id)}
          >
            Remove
          </Button>
        </Group>
      ))}
    </Box>
  );
} 