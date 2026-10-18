/**
 * Google Sheets Spreadsheet Formula Generator for Mechanical Cellular Automata & ALU
 * Generates exact copyable spreadsheet formulas without built-in mathematical shortcuts.
 */

export interface SpreadsheetCell {
  col: string; // 'A', 'B', etc.
  colIdx: number;
  row: number; // 1-indexed
  value: number | string;
  formula?: string;
  label?: string;
  isHeader?: boolean;
  isActive?: boolean;
}

export interface SpreadsheetGridData {
  title: string;
  description: string;
  headers: string[];
  rows: SpreadsheetCell[][];
  explanation: string;
}

/**
 * Convert 0-indexed column number to Google Sheets column letters ('A', 'B', ..., 'Z', 'AA', etc.)
 */
export function indexToColLetter(colIdx: number): string {
  let letter = '';
  let temp = colIdx;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/**
 * Generates Rule 110 Spreadsheet formula for cell at (colLetter, rowNumber)
 * using its three parents from previous row: left, center, right.
 */
export function getRule110Formula(
  leftCol: string,
  centerCol: string,
  rightCol: string,
  prevRow: number,
  style: 'choose' | 'boolean' = 'choose'
): string {
  const l = `${leftCol}${prevRow}`;
  const c = `${centerCol}${prevRow}`;
  const r = `${rightCol}${prevRow}`;

  if (style === 'choose') {
    // Standard cell index formula:
    // (4*L + 2*C + R + 1) generates 1 to 8 index into Rule 110 output table [0,1,1,1,0,1,1,0]
    return `=CHOOSE(4*${l} + 2*${c} + ${r} + 1, 0, 1, 1, 1, 0, 1, 1, 0)`;
  } else {
    // Pure Boolean mechanical disjunction (absolutely no arithmetic multiplication)
    return `=IF(OR(AND(${l}=1,${c}=1,${r}=0), AND(${l}=1,${c}=0,${r}=1), AND(${l}=0,${c}=1,${r}=1), AND(${l}=0,${c}=1,${r}=0), AND(${l}=0,${c}=0,${r}=1)), 1, 0)`;
  }
}

/**
 * Builds a complete Rule 110 spacetime grid data structure for the spreadsheet matrix view
 */
export function generateRule110SpreadsheetGrid(
  initialRow: number[],
  numSteps: number = 24
): SpreadsheetGridData {
  const width = initialRow.length;
  const headers = Array.from({ length: width }, (_, i) => `Cell ${i}`);
  const rows: SpreadsheetCell[][] = [];

  // Row 1: Initial state
  const firstRowCells: SpreadsheetCell[] = initialRow.map((val, cIdx) => ({
    col: indexToColLetter(cIdx),
    colIdx: cIdx,
    row: 1,
    value: val,
    label: `t=0, x=${cIdx}`,
  }));
  rows.push(firstRowCells);

  // Subsequent rows: Time evolution t=1 to numSteps
  let prevRowValues = [...initialRow];
  for (let t = 1; t < numSteps; t++) {
    const rowNum = t + 1;
    const currentCells: SpreadsheetCell[] = [];
    const nextRowValues = new Array(width);

    for (let cIdx = 0; cIdx < width; cIdx++) {
      const leftIdx = cIdx === 0 ? width - 1 : cIdx - 1;
      const rightIdx = cIdx === width - 1 ? 0 : cIdx + 1;

      const leftCol = indexToColLetter(leftIdx);
      const centerCol = indexToColLetter(cIdx);
      const rightCol = indexToColLetter(rightIdx);

      const lVal = prevRowValues[leftIdx];
      const cVal = prevRowValues[cIdx];
      const rVal = prevRowValues[rightIdx];

      // Next state according to Rule 110:
      const code = (lVal << 2) | (cVal << 1) | rVal;
      const nextVal = (110 >> code) & 1;
      nextRowValues[cIdx] = nextVal;

      currentCells.push({
        col: centerCol,
        colIdx: cIdx,
        row: rowNum,
        value: nextVal,
        formula: getRule110Formula(leftCol, centerCol, rightCol, rowNum - 1, 'choose'),
        label: `t=${t}, x=${cIdx}`,
        isActive: nextVal === 1,
      });
    }

    rows.push(currentCells);
    prevRowValues = nextRowValues;
  }

  return {
    title: 'Rule 110 Cellular Automaton Spacetime Sheet',
    description: 'Each cell formula determines the next discrete time step based on the Wolfram Rule 110 neighborhood.',
    headers,
    rows,
    explanation: 'Cell formulas utilize =CHOOSE(4*Left + 2*Center + Right + 1, 0,1,1,1,0,1,1,0) to compute next states without built-in math.',
  };
}

/**
 * Builds an 8-bit Full-Adder Spreadsheet Grid showing row-by-row carry propagation
 */
export function generateAdderSpreadsheetGrid(bitsA: number[], bitsB: number[]): SpreadsheetGridData {
  const headers = ['Bit Pos', 'Weight', 'A (In)', 'B (In)', 'Cin', 'Sum Bit', 'Cout', 'Full-Adder Formula (Sum)', 'Full-Adder Formula (Cout)'];
  const rows: SpreadsheetCell[][] = [];

  let carry = 0;
  for (let i = 7; i >= 0; i--) {
    const bitPos = 7 - i;
    const weight = 1 << bitPos;
    const a = bitsA[i];
    const b = bitsB[i];
    const cin = carry;

    // Full adder logic
    const sum = (a ^ b ^ cin) & 1;
    const cout = ((a & b) | (a & cin) | (b & cin)) & 1;
    carry = cout;

    const rowNum = (8 - i) + 1; // Row 2 to 9
    const cellRow: SpreadsheetCell[] = [
      { col: 'A', colIdx: 0, row: rowNum, value: `Bit ${bitPos}` },
      { col: 'B', colIdx: 1, row: rowNum, value: weight },
      { col: 'C', colIdx: 2, row: rowNum, value: a },
      { col: 'D', colIdx: 3, row: rowNum, value: b },
      { col: 'E', colIdx: 4, row: rowNum, value: cin },
      { col: 'F', colIdx: 5, row: rowNum, value: sum, formula: `=IF(OR(AND(C${rowNum}=1,D${rowNum}=0,E${rowNum}=0),AND(C${rowNum}=0,D${rowNum}=1,E${rowNum}=0),AND(C${rowNum}=0,D${rowNum}=0,E${rowNum}=1),AND(C${rowNum}=1,D${rowNum}=1,E${rowNum}=1)),1,0)` },
      { col: 'G', colIdx: 6, row: rowNum, value: cout, formula: `=IF(OR(AND(C${rowNum}=1,D${rowNum}=1),AND(C${rowNum}=1,E${rowNum}=1),AND(D${rowNum}=1,E${rowNum}=1)),1,0)` },
      { col: 'H', colIdx: 7, row: rowNum, value: `=XOR(C${rowNum}, D${rowNum}, E${rowNum})` },
      { col: 'I', colIdx: 8, row: rowNum, value: `=OR(AND(C${rowNum},D${rowNum}),AND(C${rowNum},E${rowNum}),AND(D${rowNum},E${rowNum}))` },
    ];
    rows.push(cellRow);
  }

  return {
    title: '8-Bit Ripple-Carry Adder Mechanical Spreadsheet',
    description: 'First-principles Full-Adder slice cascade propagating sum and carry using pure Boolean disjunctions.',
    headers,
    rows,
    explanation: 'Sum = IF(OR(AND(A,notB,notC), AND(notA,B,notC), AND(notA,notB,C), AND(A,B,C)), 1, 0)',
  };
}

/**
 * Generate CSV text ready for downloading and opening directly in Google Sheets
 */
export function exportToGoogleSheetsCsv(grid: SpreadsheetGridData): string {
  const lines: string[] = [];
  lines.push(grid.headers.map(h => `"${h}"`).join(','));

  for (const row of grid.rows) {
    const rowValues = row.map(cell => {
      if (cell.formula) {
        return `"${cell.formula.replace(/"/g, '""')}"`;
      }
      return `"${cell.value}"`;
    });
    lines.push(rowValues.join(','));
  }

  return lines.join('\n');
}

/**
 * Generates Google Apps Script code to create a dynamic cellular automaton sheet in Google Drive
 */
export function generateGoogleAppsScriptCode(): string {
  return `/**
 * Google Apps Script: Creates a 8-Bit Rule 110 Cellular Automaton Calculator Sheet
 * Instructions:
 * 1. Open Google Sheets (sheets.new)
 * 2. Go to Extensions > Apps Script
 * 3. Paste this code and click Run > createCommodore110Sheet
 */
function createCommodore110Sheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Rule110_Calculator");
  if (sheet) {
    sheet.clear();
  } else {
    sheet = ss.insertSheet("Rule110_Calculator");
  }

  const width = 64;
  const timeSteps = 64;

  // Title & Headers
  sheet.getRange(1, 1).setValue("Commodore 110: Rule 110 Cellular Automata Mechanical Logic Substrate");
  sheet.getRange(1, 1).setFontSize(14).setFontWeight("bold");

  // Initial Seed in Row 3
  const seed = new Array(width).fill(0);
  seed[Math.floor(width / 2)] = 1; // Center impulse
  seed[Math.floor(width / 2) + 1] = 1;
  sheet.getRange(3, 1, 1, width).setValues([seed]);

  // Apply Rule 110 Formula down through time steps
  for (let t = 4; t <= timeSteps + 3; t++) {
    const formulas = [];
    const prevRow = t - 1;
    for (let c = 1; c <= width; c++) {
      const leftCol = c === 1 ? getColLetter(width) : getColLetter(c - 1);
      const centerCol = getColLetter(c);
      const rightCol = c === width ? getColLetter(1) : getColLetter(c + 1);
      formulas.push("=CHOOSE(4*" + leftCol + prevRow + " + 2*" + centerCol + prevRow + " + " + rightCol + prevRow + " + 1, 0, 1, 1, 1, 0, 1, 1, 0)");
    }
    sheet.getRange(t, 1, 1, width).setFormulas([formulas]);
  }

  // Format colors: Live cells bright amber, dead cells dark
  const rule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberEqualTo(1)
    .setBackground("#F59E0B")
    .setFontColor("#78350F")
    .setRanges([sheet.getRange(3, 1, timeSteps + 1, width)])
    .build();
  sheet.setConditionalFormatRules([rule]);
  SpreadsheetApp.flush();
}

function getColLetter(col) {
  let temp, letter = '';
  while (col > 0) {
    temp = (col - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    col = (col - temp - 1) / 26;
  }
  return letter;
}`;
}
