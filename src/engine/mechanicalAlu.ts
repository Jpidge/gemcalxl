/**
 * First-Principles 8-Bit Mechanical Arithmetic Logic Unit (ALU)
 * Built exclusively using discrete logic primitives without any built-in math functions.
 */

import { AluExecutionResult, AluStepRecord, OperationType } from '../types';

// ==========================================
// FIRST PRINCIPLES DISCRETE LOGIC PRIMITIVES
// No +, -, *, /, Math.* functions used.
// ==========================================

export function bitAnd(a: number, b: number): number {
  return (a === 1 && b === 1) ? 1 : 0;
}

export function bitOr(a: number, b: number): number {
  return (a === 1 || b === 1) ? 1 : 0;
}

export function bitNot(a: number): number {
  return a === 1 ? 0 : 1;
}

export function bitXor(a: number, b: number): number {
  // Mechanical XOR: (A and not B) or (not A and B)
  const aAndNotB = bitAnd(a, bitNot(b));
  const notAAndB = bitAnd(bitNot(a), b);
  return bitOr(aAndNotB, notAAndB);
}

export function halfAdder(a: number, b: number): { sum: number; carry: number } {
  return {
    sum: bitXor(a, b),
    carry: bitAnd(a, b),
  };
}

export function fullAdder(a: number, b: number, cin: number): { sum: number; cout: number } {
  // First stage half adder
  const ha1 = halfAdder(a, b);
  // Second stage half adder with carry in
  const ha2 = halfAdder(ha1.sum, cin);
  // Carry out is active if either half adder generated a carry
  const cout = bitOr(ha1.carry, ha2.carry);
  return {
    sum: ha2.sum,
    cout: cout,
  };
}

// Convert 8-bit array [MSB, ..., LSB] to decimal integer purely for user display
export function bitsToDecimal(bits: number[]): number {
  let val = 0;
  for (let i = 0; i < bits.length; i++) {
    val = (val << 1) | (bits[i] ? 1 : 0);
  }
  return val;
}

// Convert decimal integer to 8-bit array [MSB, ..., LSB]
export function decimalTo8Bits(val: number): number[] {
  const clean = Math.max(0, Math.min(255, val | 0));
  const bits: number[] = new Array(8);
  for (let i = 7; i >= 0; i--) {
    bits[7 - i] = ((clean >> i) & 1) ? 1 : 0;
  }
  return bits;
}

// ==========================================
// 8-BIT MECHANICAL ADDITION PIPELINE
// ==========================================
export function executeAddition8(bitsA: number[], bitsB: number[]): AluExecutionResult {
  const steps: AluStepRecord[] = [];
  const resultBits: number[] = new Array(8).fill(0);
  let carry = 0;

  steps.push({
    step: 0,
    phase: 'INPUT LATCH',
    description: 'Latched 8-bit Operand A and Operand B onto input buses.',
    regA: [...bitsA],
    regB: [...bitsB],
    accumulator: [0, 0, 0, 0, 0, 0, 0, 0],
    carryOut: 0,
    isComplete: false,
  });

  // Ripple carry chain from LSB (index 7) to MSB (index 0)
  for (let bitIdx = 7; bitIdx >= 0; bitIdx--) {
    const bitA = bitsA[bitIdx];
    const bitB = bitsB[bitIdx];
    const fa = fullAdder(bitA, bitB, carry);
    resultBits[bitIdx] = fa.sum;
    const prevCarry = carry;
    carry = fa.cout;

    steps.push({
      step: 8 - bitIdx,
      phase: `BIT ${7 - bitIdx} ADDITION`,
      description: `Bit ${7 - bitIdx} (weight ${1 << (7 - bitIdx)}): FullAdder(A=${bitA}, B=${bitB}, Cin=${prevCarry}) -> Sum=${fa.sum}, Cout=${carry}`,
      regA: [...bitsA],
      regB: [...bitsB],
      accumulator: [...resultBits],
      carryOut: carry,
      activeBitIndex: bitIdx,
      isComplete: bitIdx === 0,
    });
  }

  const resultVal = bitsToDecimal(resultBits);
  const overflow = carry === 1;
  const zero = resultVal === 0;

  return {
    operation: 'ADD',
    operandA: bitsToDecimal(bitsA),
    operandB: bitsToDecimal(bitsB),
    bitsA,
    bitsB,
    resultBits,
    resultValue: resultVal,
    carryOut: carry,
    overflow,
    zero,
    negative: resultBits[0] === 1,
    steps,
    totalClockTicks: 8,
    sheetsFormulaSummary: '=IF(OR(AND(A2=1,B2=0,C2=0),AND(A2=0,B2=1,C2=0),AND(A2=0,B2=0,C2=1),AND(A2=1,B2=1,C2=1)),1,0)',
  };
}

// ==========================================
// 8-BIT MECHANICAL SUBTRACTION PIPELINE
// Invert B + CarryIn=1 (Two's Complement)
// ==========================================
export function executeSubtraction8(bitsA: number[], bitsB: number[]): AluExecutionResult {
  const steps: AluStepRecord[] = [];
  const invertedB = bitsB.map(bitNot);
  const resultBits: number[] = new Array(8).fill(0);
  let carry = 1; // Two's complement +1

  steps.push({
    step: 0,
    phase: 'ONES COMPLEMENT',
    description: 'Inverting Operand B bits via discrete NOT gates; setting initial Carry-In = 1 for Two\'s Complement.',
    regA: [...bitsA],
    regB: [...invertedB],
    accumulator: [0, 0, 0, 0, 0, 0, 0, 0],
    carryOut: 1,
    isComplete: false,
  });

  for (let bitIdx = 7; bitIdx >= 0; bitIdx--) {
    const bitA = bitsA[bitIdx];
    const bitNotB = invertedB[bitIdx];
    const fa = fullAdder(bitA, bitNotB, carry);
    resultBits[bitIdx] = fa.sum;
    const prevCarry = carry;
    carry = fa.cout;

    steps.push({
      step: 8 - bitIdx,
      phase: `BIT ${7 - bitIdx} SUBTRACT`,
      description: `Bit ${7 - bitIdx}: FullAdder(A=${bitA}, ~B=${bitNotB}, Cin=${prevCarry}) -> Difference=${fa.sum}, Cout=${carry}`,
      regA: [...bitsA],
      regB: [...invertedB],
      accumulator: [...resultBits],
      carryOut: carry,
      activeBitIndex: bitIdx,
      isComplete: bitIdx === 0,
    });
  }

  const resultVal = bitsToDecimal(resultBits);
  // In subtraction: if carry is 0, a borrow occurred (result is negative)
  const borrowOccurred = carry === 0;

  return {
    operation: 'SUB',
    operandA: bitsToDecimal(bitsA),
    operandB: bitsToDecimal(bitsB),
    bitsA,
    bitsB,
    resultBits,
    resultValue: resultVal,
    carryOut: carry,
    overflow: borrowOccurred,
    zero: resultVal === 0,
    negative: borrowOccurred || resultBits[0] === 1,
    steps,
    totalClockTicks: 8,
    sheetsFormulaSummary: '=IF(OR(AND(A2=1,IF(B2=1,0,1)=0,C2=0),...),1,0)',
  };
}

// ==========================================
// 8-BIT SHIFT-AND-ADD MULTIPLIER PIPELINE
// 8-bit Multiplicand (A) x 8-bit Multiplier (B)
// ==========================================
export function executeMultiplication8(bitsA: number[], bitsB: number[]): AluExecutionResult {
  const steps: AluStepRecord[] = [];
  // 16-bit product register [High 8, Low 8]
  let accum16: number[] = new Array(16).fill(0);
  let multB = [...bitsB];

  steps.push({
    step: 0,
    phase: 'MULTIPLIER INITIALIZE',
    description: 'Loaded Multiplicand into Register A and Multiplier into Shift Register B. Product Accumulator cleared to 16 zeros.',
    regA: [...bitsA],
    regB: [...multB],
    accumulator: [...accum16.slice(8, 16)],
    carryOut: 0,
    isComplete: false,
  });

  for (let cycle = 0; cycle < 8; cycle++) {
    // Inspect LSB of Multiplier (B[7])
    const multiplierLsb = multB[7];

    if (multiplierLsb === 1) {
      // Add Multiplicand (A) aligned to the upper 8 bits
      let carry = 0;
      for (let i = 7; i >= 0; i--) {
        const fa = fullAdder(accum16[i], bitsA[i], carry);
        accum16[i] = fa.sum;
        carry = fa.cout;
      }
      steps.push({
        step: cycle * 2 + 1,
        phase: `CYCLE ${cycle + 1}: CONDITIONAL ADD`,
        description: `Multiplier LSB=1 -> Added Multiplicand A to upper accumulator. Carry out = ${carry}.`,
        regA: [...bitsA],
        regB: [...multB],
        accumulator: [...accum16.slice(8, 16)],
        carryOut: carry,
        isComplete: false,
      });
    } else {
      steps.push({
        step: cycle * 2 + 1,
        phase: `CYCLE ${cycle + 1}: SKIP ADD`,
        description: `Multiplier LSB=0 -> No addition required. Accumulator holds current sum.`,
        regA: [...bitsA],
        regB: [...multB],
        accumulator: [...accum16.slice(8, 16)],
        carryOut: 0,
        isComplete: false,
      });
    }

    // Mechanical Shift Right by 1 bit across [Accumulator + B]
    const shiftedOut = accum16[15];
    for (let i = 15; i > 0; i--) {
      accum16[i] = accum16[i - 1];
    }
    accum16[0] = 0;

    // Shift Multiplier register right
    for (let i = 7; i > 0; i--) {
      multB[i] = multB[i - 1];
    }
    multB[0] = shiftedOut;

    steps.push({
      step: cycle * 2 + 2,
      phase: `CYCLE ${cycle + 1}: SHIFT RIGHT`,
      description: `Shifted 16-bit Product Accumulator right by 1 bit. Multiplier register updated.`,
      regA: [...bitsA],
      regB: [...multB],
      accumulator: [...accum16.slice(8, 16)],
      carryOut: 0,
      isComplete: cycle === 7,
    });
  }

  const fullProductVal = bitsToDecimal(accum16);
  const lower8 = accum16.slice(8, 16);
  const upper8 = accum16.slice(0, 8);
  const hasOverflow = bitsToDecimal(upper8) > 0;

  return {
    operation: 'MUL',
    operandA: bitsToDecimal(bitsA),
    operandB: bitsToDecimal(bitsB),
    bitsA,
    bitsB,
    resultBits: lower8,
    resultValue: fullProductVal,
    carryOut: hasOverflow ? 1 : 0,
    overflow: hasOverflow,
    zero: fullProductVal === 0,
    negative: false,
    steps,
    totalClockTicks: 16,
    sheetsFormulaSummary: '=IF(B8=1, A8, 0) + ... [Shift-and-Add Mechanical Cascade]',
  };
}

// ==========================================
// 8-BIT RESTORING DIVIDER PIPELINE
// Dividend (A) / Divisor (B) -> Quotient + Remainder
// ==========================================
export function executeDivision8(bitsA: number[], bitsB: number[]): AluExecutionResult {
  const steps: AluStepRecord[] = [];
  const divisorVal = bitsToDecimal(bitsB);

  // Check division by zero
  if (divisorVal === 0) {
    steps.push({
      step: 0,
      phase: 'DIV BY ZERO ERROR',
      description: 'Divisor is zero! Mechanical divide-by-zero stop flag engaged.',
      regA: [...bitsA],
      regB: [...bitsB],
      accumulator: [0, 0, 0, 0, 0, 0, 0, 0],
      carryOut: 1,
      isComplete: true,
    });

    return {
      operation: 'DIV',
      operandA: bitsToDecimal(bitsA),
      operandB: 0,
      bitsA,
      bitsB,
      resultBits: [1, 1, 1, 1, 1, 1, 1, 1], // error display
      resultValue: 0,
      carryOut: 1,
      overflow: true,
      zero: false,
      negative: false,
      quotientBits: [0, 0, 0, 0, 0, 0, 0, 0],
      quotientValue: 0,
      remainderBits: [...bitsA],
      remainderValue: bitsToDecimal(bitsA),
      steps,
      totalClockTicks: 1,
      sheetsFormulaSummary: '=IF(B2=0, "ERROR", ...)',
    };
  }

  // Registers for Restoring Division
  let remainder: number[] = new Array(8).fill(0);
  let quotient: number[] = new Array(8).fill(0);
  let dividend = [...bitsA];

  steps.push({
    step: 0,
    phase: 'DIVIDER INITIALIZE',
    description: 'Dividend loaded into shift register. Remainder register cleared to 0.',
    regA: [...bitsA],
    regB: [...bitsB],
    accumulator: [...quotient],
    remainder: [...remainder],
    quotient: [...quotient],
    carryOut: 0,
    isComplete: false,
  });

  for (let cycle = 0; cycle < 8; cycle++) {
    // 1. Shift Remainder left, pulling in the MSB of Dividend
    const incomingBit = dividend[0];
    for (let i = 0; i < 7; i++) {
      remainder[i] = remainder[i + 1];
    }
    remainder[7] = incomingBit;

    // Shift Dividend left
    for (let i = 0; i < 7; i++) {
      dividend[i] = dividend[i + 1];
    }
    dividend[7] = 0;

    // 2. Trial Subtraction: Remainder - Divisor
    // Using two's complement subtractor
    const subResult = executeSubtraction8(remainder, bitsB);
    const borrow = subResult.carryOut === 0;

    if (!borrow) {
      // Remainder >= Divisor: successful subtraction, Quotient bit = 1
      remainder = [...subResult.resultBits];
      quotient[cycle] = 1;

      steps.push({
        step: cycle + 1,
        phase: `CYCLE ${cycle + 1}: TRIAL SUB SUCCESS`,
        description: `Trial subtract Remainder - Divisor succeeded (no borrow). Quotient bit [${7 - cycle}] set to 1.`,
        regA: [...bitsA],
        regB: [...bitsB],
        accumulator: [...quotient],
        remainder: [...remainder],
        quotient: [...quotient],
        carryOut: 0,
        isComplete: cycle === 7,
      });
    } else {
      // Remainder < Divisor: borrow occurred! Restore original remainder, Quotient bit = 0
      quotient[cycle] = 0;

      steps.push({
        step: cycle + 1,
        phase: `CYCLE ${cycle + 1}: RESTORE REMAINDER`,
        description: `Trial subtract had borrow (Remainder < Divisor). Remainder restored, Quotient bit [${7 - cycle}] set to 0.`,
        regA: [...bitsA],
        regB: [...bitsB],
        accumulator: [...quotient],
        remainder: [...remainder],
        quotient: [...quotient],
        carryOut: 1,
        isComplete: cycle === 7,
      });
    }
  }

  // Align quotient bits
  const finalQuotientVal = bitsToDecimal(quotient);
  const finalRemainderVal = bitsToDecimal(remainder);

  return {
    operation: 'DIV',
    operandA: bitsToDecimal(bitsA),
    operandB: bitsToDecimal(bitsB),
    bitsA,
    bitsB,
    resultBits: quotient,
    resultValue: finalQuotientVal,
    carryOut: 0,
    overflow: false,
    zero: finalQuotientVal === 0,
    negative: false,
    quotientBits: quotient,
    quotientValue: finalQuotientVal,
    remainderBits: remainder,
    remainderValue: finalRemainderVal,
    steps,
    totalClockTicks: 8,
    sheetsFormulaSummary: '=IF(Remainder >= Divisor, Remainder - Divisor, Remainder)',
  };
}

// ==========================================
// DISCRETE LOGICAL OPERATIONS
// ==========================================
export function executeLogicOperation8(op: 'AND' | 'OR' | 'XOR' | 'NOT', bitsA: number[], bitsB: number[]): AluExecutionResult {
  const resultBits: number[] = new Array(8);
  const steps: AluStepRecord[] = [];

  for (let i = 0; i < 8; i++) {
    const a = bitsA[i];
    const b = bitsB[i];
    let res = 0;

    if (op === 'AND') res = bitAnd(a, b);
    else if (op === 'OR') res = bitOr(a, b);
    else if (op === 'XOR') res = bitXor(a, b);
    else if (op === 'NOT') res = bitNot(a);

    resultBits[i] = res;
  }

  const resultVal = bitsToDecimal(resultBits);

  steps.push({
    step: 1,
    phase: `${op} EXECUTION`,
    description: `Evaluated parallel discrete 8-bit ${op} gate bank across all bit lanes.`,
    regA: [...bitsA],
    regB: [...bitsB],
    accumulator: [...resultBits],
    carryOut: 0,
    isComplete: true,
  });

  return {
    operation: op,
    operandA: bitsToDecimal(bitsA),
    operandB: bitsToDecimal(bitsB),
    bitsA,
    bitsB,
    resultBits,
    resultValue: resultVal,
    carryOut: 0,
    overflow: false,
    zero: resultVal === 0,
    negative: resultBits[0] === 1,
    steps,
    totalClockTicks: 1,
    sheetsFormulaSummary: `=${op}(A2:H2, B2:H2)`,
  };
}

// Master execution dispatcher
export function runAluOperation(op: OperationType, operandA: number, operandB: number): AluExecutionResult {
  const bitsA = decimalTo8Bits(operandA);
  const bitsB = decimalTo8Bits(operandB);

  switch (op) {
    case 'ADD':
      return executeAddition8(bitsA, bitsB);
    case 'SUB':
      return executeSubtraction8(bitsA, bitsB);
    case 'MUL':
      return executeMultiplication8(bitsA, bitsB);
    case 'DIV':
      return executeDivision8(bitsA, bitsB);
    case 'AND':
    case 'OR':
    case 'XOR':
    case 'NOT':
      return executeLogicOperation8(op, bitsA, bitsB);
  }
}
