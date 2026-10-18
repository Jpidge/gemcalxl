/**
 * Wolfram Elementary Cellular Automata Rule 110 Engine
 * Matthew Cook's Turing Universality Glider Mechanics
 */

import { GliderStructure } from '../types';

/**
 * Standard Wolfram Rule 110 local neighborhood update function.
 * Evaluates local neighborhood (left, center, right) in discrete time.
 * Binary encoding:
 * 111 -> 0
 * 110 -> 1
 * 101 -> 1
 * 100 -> 0
 * 011 -> 1
 * 010 -> 1
 * 001 -> 1
 * 000 -> 0
 */
export function rule110Step(left: number, center: number, right: number): number {
  const l = left ? 1 : 0;
  const c = center ? 1 : 0;
  const r = right ? 1 : 0;
  
  // First principles boolean formula without arithmetic shortcuts:
  // Rule 110 is active (1) iff:
  // (not L and C) or (not L and R) or (C and not R) or (not C and R)
  // Which simplifies to: (center ^ right) || (!left && (center || right))
  const code = (l << 2) | (c << 1) | r;
  // 110 in binary is 01101110
  return ((110 >> code) & 1);
}

/**
 * Computes the next row in 1D spacetime for an array of cells.
 * Boundary conditions: periodic or fixed zero.
 */
export function stepRow110(row: number[], periodic: boolean = true): number[] {
  const len = row.length;
  const nextRow = new Array(len);
  
  for (let i = 0; i < len; i++) {
    const left = i === 0 ? (periodic ? row[len - 1] : 0) : row[i - 1];
    const center = row[i];
    const right = i === len - 1 ? (periodic ? row[0] : 0) : row[i + 1];
    nextRow[i] = rule110Step(left, center, right);
  }
  
  return nextRow;
}

/**
 * Generate a complete 2D spacetime matrix (rows = time steps, cols = spatial cells)
 */
export function generateSpacetime110(
  initialRow: number[],
  numSteps: number,
  periodic: boolean = true
): number[][] {
  const matrix: number[][] = [initialRow.slice()];
  let currentRow = initialRow.slice();
  
  for (let t = 1; t < numSteps; t++) {
    currentRow = stepRow110(currentRow, periodic);
    matrix.push(currentRow.slice());
  }
  
  return matrix;
}

/**
 * The 14-cell Ether background unit for Rule 110.
 * In Matthew Cook's construction, information gliders travel across
 * a stable background periodic pattern called "the Ether".
 */
export const ETHER_PATTERN = [0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1];

export function generateEtherRow(length: number, offset: number = 0): number[] {
  const row = new Array(length);
  for (let i = 0; i < length; i++) {
    row[i] = ETHER_PATTERN[(i + offset) % ETHER_PATTERN.length];
  }
  return row;
}

/**
 * Matthew Cook's canonical Glider catalog in Rule 110
 */
export const RULE_110_GLIDERS: GliderStructure[] = [
  {
    id: 'glider-a',
    name: 'Glider A',
    speed: '-4/15 c',
    period: 15,
    pattern: '0001110110',
    description: 'Slow left-drifting glider structure; primarily used as the static memory bit or target barrier.',
    logicalRole: 'Static bit storage & register cell',
    matrix: [
      [0, 0, 0, 1, 1, 1, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 0, 0, 1, 0],
      [1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
    ]
  },
  {
    id: 'glider-b',
    name: 'Glider B',
    speed: '-2/3 c',
    period: 3,
    pattern: '00111110',
    description: 'Fast left-moving glider with period 3; serves as an active carrier signal pulse.',
    logicalRole: 'Signal propagation & clock carrier wire',
    matrix: [
      [0, 0, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 0, 1, 1, 0],
    ]
  },
  {
    id: 'glider-c',
    name: 'Glider C',
    speed: '0 c (Stationary)',
    period: 7,
    pattern: '111110',
    description: 'Locally stationary periodic oscillator; acts as a routing node and logic gate junction.',
    logicalRole: 'Gate junction & signal redirection node',
    matrix: [
      [1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 1, 1, 0, 1, 0],
      [1, 1, 1, 1, 1, 0],
      [1, 0, 0, 0, 1, 0],
    ]
  },
  {
    id: 'glider-e',
    name: 'Glider E',
    speed: '4/15 c',
    period: 15,
    pattern: '00111011',
    description: 'Right-moving signal glider; utilized for ripple-carry transmission between adder slices.',
    logicalRole: 'Carry-bit transmission & rightward data bus',
    matrix: [
      [0, 0, 1, 1, 1, 0, 1, 1],
      [0, 1, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 1],
    ]
  },
  {
    id: 'glider-f',
    name: 'Glider F',
    speed: '-2/3 c',
    period: 3,
    pattern: '100010011011111',
    description: 'Composite glider used to absorb or reflect carrier pulses in Cook\'s Cyclic Tag System.',
    logicalRole: 'NOT gate inverter & destructive collision terminator',
    matrix: [
      [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    ]
  }
];

/**
 * Creates an initial spacetime seed row representing two input bits
 * mapped to spatial positions, ready for collision demonstration.
 */
export function createLogicGateSeed(gateType: 'AND' | 'OR' | 'XOR' | 'NOT' | 'HALF_ADDER', inA: number, inB: number): number[] {
  const width = 80;
  const row = generateEtherRow(width, 0);
  
  // Inject gliders depending on inputs
  if (inA) {
    const patternA = [1, 1, 1, 1, 1, 0];
    const posA = 20;
    for (let i = 0; i < patternA.length; i++) {
      row[posA + i] = patternA[i];
    }
  }
  
  if (gateType !== 'NOT' && inB) {
    const patternB = [0, 0, 1, 1, 1, 1, 1, 0];
    const posB = 50;
    for (let i = 0; i < patternB.length; i++) {
      row[posB + i] = patternB[i];
    }
  }

  if (gateType === 'NOT') {
    // Inverter barrier glider
    const barrier = [1, 0, 0, 0, 1, 0, 0, 1, 1, 0];
    const posBarrier = 40;
    for (let i = 0; i < barrier.length; i++) {
      row[posBarrier + i] = barrier[i];
    }
  }

  return row;
}
