export type CalculatorMode = 'standard' | 'scientific' | 'graphing';

export interface CalculationHistoryItem {
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorState {
  display: string;
  expression: string;
  history: CalculationHistoryItem[];
  mode: CalculatorMode;
  error: string | null;
  isShiftActive: boolean;
  isDegreeMode: boolean;
}

export type GraphFunction = {
  id: string;
  expression: string;
  color: string;
  isVisible: boolean;
};

export interface GraphState {
  functions: GraphFunction[];
  xRange: [number, number];
  yRange: [number, number];
  gridLines: boolean;
  showIntersections: boolean;
}

export type ButtonType = 
  | 'number' 
  | 'operator' 
  | 'function' 
  | 'control' 
  | 'memory'
  | 'constant';

export interface CalculatorButton {
  label: string;
  value: string;
  type: ButtonType;
  gridArea?: string;
  shiftLabel?: string;
  shiftValue?: string;
  color?: string;
} 