// Type definitions for the Commodore 110 Cellular Automata Mechanical Calculator

export type OperationType = 'ADD' | 'SUB' | 'MUL' | 'DIV' | 'AND' | 'OR' | 'XOR' | 'NOT';

export type DisplayMode = 'vintage-led' | 'cyan-vfd' | 'amber-phosphor';

export type StageMode = 'spacetime' | 'heatmap' | 'signals';

export type LogicTab = 'circuits' | 'decision-tables' | 'tutorial' | 'overview' | 'gliders';

export type ViewTab = 
  | 'calculator'       // Vintage Commodore Handheld console
  | 'canvas-stage'     // 2D Rule 110 Spacetime Canvas & Heatmap
  | 'signal-history'   // Digital Logic Analyzer & Signal Waveforms
  | 'sheets-matrix'    // Google Sheets live spreadsheet matrix with exact formulas
  | 'logic-tutorial'   // Interactive First-Principles Logic Tutorial
  | 'circuit-diagrams' // Interactive Gate & Adder Circuit Diagrams
  | 'decision-tables'  // Decision Tables & Karnaugh Minimization
  | 'ca-overview'      // Wolfram 4 Classes & CA Overview
  | 'glider-gates'     // Matthew Cook's Glider Catalog & Collision Lab
  | 'double-dabble'    // First-principles BCD decimal conversion module
  | 'prospectus'       // Academic research paper & commercialization report
  | 'blueprint-studio' // Gemini 3 Pro high-res diagram generator (1K, 2K, 4K)
;

export interface AluStepRecord {
  step: number;
  phase: string;
  description: string;
  regA: number[];
  regB: number[];
  accumulator: number[];
  carryOut: number;
  remainder?: number[];
  quotient?: number[];
  activeBitIndex?: number;
  isComplete: boolean;
}

export interface AluExecutionResult {
  operation: OperationType;
  operandA: number; // 0-255
  operandB: number; // 0-255
  bitsA: number[]; // 8 bits [MSB...LSB]
  bitsB: number[]; // 8 bits [MSB...LSB]
  resultBits: number[]; // 8 bits or 16 bits for product
  resultValue: number;
  carryOut: number;
  overflow: boolean;
  zero: boolean;
  negative: boolean;
  remainderBits?: number[];
  remainderValue?: number;
  quotientBits?: number[];
  quotientValue?: number;
  steps: AluStepRecord[];
  totalClockTicks: number;
  sheetsFormulaSummary: string;
}

export interface DoubleDabbleStep {
  stepIndex: number;
  description: string;
  shiftCount: number;
  hundreds: number[]; // 4-bit BCD
  tens: number[];     // 4-bit BCD
  ones: number[];     // 4-bit BCD
  binaryRemaining: number[]; // remaining binary bits
  actionType: 'SHIFT' | 'ADD3' | 'INIT' | 'DONE';
  correctedUnits?: ('hundreds' | 'tens' | 'ones')[];
}

export interface GliderStructure {
  id: string;
  name: string;
  speed: string; // e.g., "4/15 c", "-2/3 c"
  period: number;
  pattern: string; // binary pattern representation
  matrix: number[][];
  description: string;
  logicalRole: string;
}

export interface GateSimulation {
  name: string;
  inputs: { name: string; value: number }[];
  output: number;
  intermediateSteps: string[];
  rule110Spacetime: number[][];
  formulaGoogleSheets: string;
}
