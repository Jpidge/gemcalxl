/**
 * First-Principles Double-Dabble (Shift-and-Add-3) Engine
 * Converts 8-Bit Binary to 3 Decimal BCD Digits without Division or Modulo.
 * Includes Discrete Boolean 7-Segment Display Decoder.
 */

import { DoubleDabbleStep } from '../types';
import { bitAnd, bitOr, bitNot, bitXor, fullAdder } from './mechanicalAlu';

/**
 * 4-Bit Discrete Adder: Adds two 4-bit words without math functions
 */
function add4Bits(a: number[], b: number[]): { sum: number[]; cout: number } {
  const sum = new Array(4);
  let carry = 0;
  for (let i = 3; i >= 0; i--) {
    const fa = fullAdder(a[i], b[i], carry);
    sum[i] = fa.sum;
    carry = fa.cout;
  }
  return { sum, cout: carry };
}

/**
 * Checks if a 4-bit BCD nibble is greater than or equal to 5 (binary 0101).
 * In pure Boolean logic:
 * GreaterEqual5 = B3 OR (B2 AND B1) OR (B2 AND B0)
 * Where bits are [B3, B2, B1, B0]
 */
export function isNibbleGte5(nibble: number[]): boolean {
  const b3 = nibble[0];
  const b2 = nibble[1];
  const b1 = nibble[2];
  const b0 = nibble[3];

  const term1 = b3; // If bit 3 is 1 (8 or 9)
  const term2 = bitAnd(b2, b1); // If bits 2 and 1 are 1 (6 or 7)
  const term3 = bitAnd(b2, b0); // If bits 2 and 0 are 1 (5 or 7)

  return bitOr(term1, bitOr(term2, term3)) === 1;
}

/**
 * Adds 3 (binary 0011) to a 4-bit nibble using the 4-bit discrete adder
 */
export function add3ToNibble(nibble: number[]): number[] {
  const three = [0, 0, 1, 1];
  return add4Bits(nibble, three).sum;
}

/**
 * Convert 4-bit BCD nibble to decimal digit value (0-9)
 */
export function bcdToDecimalDigit(nibble: number[]): number {
  return (nibble[0] << 3) | (nibble[1] << 2) | (nibble[2] << 1) | nibble[3];
}

/**
 * Executes complete Double-Dabble algorithm on an 8-bit binary input.
 * Records every mechanical state transition for visualization.
 */
export function runDoubleDabble8(bits8: number[]): {
  steps: DoubleDabbleStep[];
  hundredsDigit: number;
  tensDigit: number;
  onesDigit: number;
  decimalString: string;
} {
  const steps: DoubleDabbleStep[] = [];
  
  let hundreds = [0, 0, 0, 0];
  let tens = [0, 0, 0, 0];
  let ones = [0, 0, 0, 0];
  let binary = [...bits8];

  steps.push({
    stepIndex: 0,
    description: 'Initialized BCD registers (Hundreds=0, Tens=0, Ones=0) and loaded 8-bit binary.',
    shiftCount: 0,
    hundreds: [...hundreds],
    tens: [...tens],
    ones: [...ones],
    binaryRemaining: [...binary],
    actionType: 'INIT',
  });

  for (let shift = 1; shift <= 8; shift++) {
    // Phase A: Check if any BCD column >= 5; if so, add 3
    const correctHundreds = isNibbleGte5(hundreds);
    const correctTens = isNibbleGte5(tens);
    const correctOnes = isNibbleGte5(ones);

    const correctedUnits: ('hundreds' | 'tens' | 'ones')[] = [];
    if (correctHundreds) {
      hundreds = add3ToNibble(hundreds);
      correctedUnits.push('hundreds');
    }
    if (correctTens) {
      tens = add3ToNibble(tens);
      correctedUnits.push('tens');
    }
    if (correctOnes) {
      ones = add3ToNibble(ones);
      correctedUnits.push('ones');
    }

    if (correctedUnits.length > 0) {
      steps.push({
        stepIndex: steps.length,
        description: `Condition (value >= 5) detected on ${correctedUnits.join(', ')}. Applied mechanical Add-3 correction.`,
        shiftCount: shift - 1,
        hundreds: [...hundreds],
        tens: [...tens],
        ones: [...ones],
        binaryRemaining: [...binary],
        actionType: 'ADD3',
        correctedUnits,
      });
    }

    // Phase B: Shift Left by 1 bit across [Hundreds:Tens:Ones:Binary]
    // 1. Shift hundreds left, pull in MSB of tens
    const msbTens = tens[0];
    hundreds = [hundreds[1], hundreds[2], hundreds[3], msbTens];

    // 2. Shift tens left, pull in MSB of ones
    const msbOnes = ones[0];
    tens = [tens[1], tens[2], tens[3], msbOnes];

    // 3. Shift ones left, pull in MSB of binary
    const msbBin = binary[0];
    ones = [ones[1], ones[2], ones[3], msbBin];

    // 4. Shift binary left
    binary = [binary[1], binary[2], binary[3], binary[4], binary[5], binary[6], binary[7], 0];

    steps.push({
      stepIndex: steps.length,
      description: `Shift #${shift}: Propagated 1 bit left across all mechanical BCD registers. Shifted bit was ${msbBin}.`,
      shiftCount: shift,
      hundreds: [...hundreds],
      tens: [...tens],
      ones: [...ones],
      binaryRemaining: [...binary],
      actionType: 'SHIFT',
    });
  }

  const hDigit = bcdToDecimalDigit(hundreds);
  const tDigit = bcdToDecimalDigit(tens);
  const oDigit = bcdToDecimalDigit(ones);
  const decimalString = `${hDigit}${tDigit}${oDigit}`;

  steps.push({
    stepIndex: steps.length,
    description: `Double-Dabble algorithm complete. BCD Result: [${hDigit}] [${tDigit}] [${oDigit}] = ${hDigit * 100 + tDigit * 10 + oDigit}.`,
    shiftCount: 8,
    hundreds: [...hundreds],
    tens: [...tens],
    ones: [...ones],
    binaryRemaining: [...binary],
    actionType: 'DONE',
  });

  return {
    steps,
    hundredsDigit: hDigit,
    tensDigit: tDigit,
    onesDigit: oDigit,
    decimalString,
  };
}

/**
 * 7-Segment Mechanical Decoder
 * Decodes 4-bit BCD (D, C, B, A where D is MSB) into 7 LED segments (a, b, c, d, e, f, g).
 * Standard segment layout:
 *      -- a --
 *     |       |
 *     f       b
 *     |       |
 *      -- g --
 *     |       |
 *     e       c
 *     |       |
 *      -- d --
 */
export interface SevenSegmentSignals {
  a: boolean;
  b: boolean;
  c: boolean;
  d: boolean;
  e: boolean;
  f: boolean;
  g: boolean;
}

export function decodeBcdTo7Segment(nibble: number[]): SevenSegmentSignals {
  // Let D = nibble[0], C = nibble[1], B = nibble[2], A = nibble[3]
  const d = nibble[0] === 1;
  const c = nibble[1] === 1;
  const b = nibble[2] === 1;
  const a = nibble[3] === 1;

  const notD = !d;
  const notC = !c;
  const notB = !b;
  const notA = !a;

  // Exact Karnaugh-map minimal boolean sum-of-products:
  const segA = d || b || (c && a) || (notC && notA);
  const segB = notC || (notB && notA) || (b && a);
  const segC = c || notB || a;
  const segD = d || (notC && notA) || (b && notA) || (c && notB && a) || (notC && b);
  const segE = (notC && notA) || (b && notA);
  const segF = d || (notB && notA) || (c && notB) || (c && notA);
  const segG = d || (c && notB) || (notC && b) || (b && notA);

  return {
    a: segA,
    b: segB,
    c: segC,
    d: segD,
    e: segE,
    f: segF,
    g: segG,
  };
}
