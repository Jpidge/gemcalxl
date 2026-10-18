/**
 * Live Google Sheets Matrix View
 * Displays exact row-by-row spreadsheet table with authentic Google Sheets formula bar,
 * cell coordinate inspector, and 1-click export to CSV & Google Apps Script.
 */

import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Grid, 
  Code, 
  HelpCircle, 
  Table, 
  FileSpreadsheet,
  Terminal
} from 'lucide-react';
import { AluExecutionResult } from '../types';
import { 
  generateRule110SpreadsheetGrid, 
  generateAdderSpreadsheetGrid, 
  exportToGoogleSheetsCsv,
  generateGoogleAppsScriptCode,
  SpreadsheetCell 
} from '../engine/sheetsFormulas';

interface SpreadsheetMatrixViewProps {
  aluResult: AluExecutionResult;
}

export const SpreadsheetMatrixView: React.FC<SpreadsheetMatrixViewProps> = ({ aluResult }) => {
  const [activeSheetMode, setActiveSheetMode] = useState<'rule110' | 'adder'>('rule110');
  const [selectedCell, setSelectedCell] = useState<SpreadsheetCell | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState(false);
  const [showAppsScriptModal, setShowAppsScriptModal] = useState(false);

  // Generate seed row from operands
  const initialRow = useMemo(() => {
    const width = 32; // 32 columns for readable spreadsheet grid
    const row = new Array(width).fill(0);
    // Center impulses based on operands
    row[Math.floor(width / 2)] = 1;
    row[Math.floor(width / 2) + 1] = aluResult.bitsA[0];
    row[Math.floor(width / 2) - 1] = aluResult.bitsB[0];
    return row;
  }, [aluResult.bitsA, aluResult.bitsB]);

  // Active grid data
  const gridData = useMemo(() => {
    if (activeSheetMode === 'rule110') {
      return generateRule110SpreadsheetGrid(initialRow, 24);
    } else {
      return generateAdderSpreadsheetGrid(aluResult.bitsA, aluResult.bitsB);
    }
  }, [activeSheetMode, initialRow, aluResult.bitsA, aluResult.bitsB]);

  // Set default selected cell
  const currentCell = selectedCell || (gridData.rows[1]?.[1] || null);

  const [exportedCsv, setExportedCsv] = useState(false);

  const handleDownloadCsv = () => {
    const csvContent = exportToGoogleSheetsCsv(gridData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeSheetMode === 'rule110' ? 'Rule110_Automata' : 'Commodore_ALU'}_GoogleSheets.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportedCsv(true);
    setTimeout(() => setExportedCsv(false), 2000);
  };

  const handleCopyFormula = () => {
    if (currentCell?.formula) {
      navigator.clipboard.writeText(currentCell.formula);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 2000);
    }
  };

  const handleCopyAppsScript = () => {
    const script = generateGoogleAppsScriptCode();
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="bg-[#181a20] rounded-xl border border-slate-700/70 p-5 shadow-xl">
      {/* Top Controls: Mode Switcher & Export Affordances */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-base font-bold text-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              GOOGLE SHEETS DISCRETE AUTOMATA MATRIX
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800">
              No Math Functions
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {gridData.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Sheet Selector */}
          <div className="flex items-center gap-1 bg-[#232630] p-1 rounded border border-slate-700 mr-2">
            <button
              onClick={() => { setActiveSheetMode('rule110'); setSelectedCell(null); }}
              className={`px-2.5 py-1 rounded font-bold transition-colors ${
                activeSheetMode === 'rule110'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RULE 110 SHEET
            </button>
            <button
              onClick={() => { setActiveSheetMode('adder'); setSelectedCell(null); }}
              className={`px-2.5 py-1 rounded font-bold transition-colors ${
                activeSheetMode === 'adder'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              8-BIT ADDER SHEET
            </button>
          </div>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2a2d36] hover:bg-[#393d4a] text-emerald-400 border border-emerald-500/30 font-bold transition-colors cursor-pointer"
            title="Download CSV for Google Sheets or Excel"
          >
            {exportedCsv ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{exportedCsv ? 'EXPORTED' : 'EXPORT CSV'}</span>
          </button>

          <button
            onClick={() => setShowAppsScriptModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2a2d36] hover:bg-[#393d4a] text-cyan-400 border border-cyan-500/30 font-bold transition-colors cursor-pointer"
            title="Generate live interactive sheet via Google Apps Script"
          >
            <Code className="w-3.5 h-3.5" />
            <span>APPS SCRIPT</span>
          </button>
        </div>
      </div>

      {/* Google Sheets Authentic Formula Bar */}
      <div className="bg-[#121316] rounded-lg border border-slate-700/80 p-2 mb-4 font-mono text-xs flex items-center gap-3 shadow-inner">
        {/* Cell Name Box */}
        <div className="px-2.5 py-1 rounded bg-[#26282f] text-amber-400 font-black border border-slate-600 min-w-[50px] text-center">
          {currentCell ? `${currentCell.col}${currentCell.row}` : 'A1'}
        </div>
        {/* Function symbol (fx) */}
        <span className="text-slate-500 font-serif italic text-sm">fx</span>
        {/* Live Formula Display */}
        <div className="flex-1 bg-[#1c1d22] px-3 py-1 rounded border border-slate-700/60 text-slate-200 truncate select-all">
          {currentCell?.formula || currentCell?.value || 'Select any cell to inspect its first-principles formula'}
        </div>
        {currentCell?.formula && (
          <button
            onClick={handleCopyFormula}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#2b2d36] hover:bg-[#393d49] text-slate-300 text-[11px] border border-slate-600 cursor-pointer"
            title="Copy formula text"
          >
            {copiedFormula ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFormula ? 'COPIED' : 'COPY'}</span>
          </button>
        )}
      </div>

      {/* Spreadsheet Virtual Table Grid */}
      <div className="rounded-lg border-2 border-[#121316] bg-[#0c0d10] overflow-x-auto max-h-[460px] shadow-inner font-mono text-xs">
        <table className="w-full border-collapse select-none">
          <thead>
            <tr className="bg-[#1e2026] text-slate-400 border-b border-slate-700 sticky top-0 z-10">
              <th className="w-12 py-2 px-2 border-r border-slate-700 text-center font-bold text-slate-500">
                #
              </th>
              {gridData.headers.map((hdr, hIdx) => (
                <th
                  key={`th-${hIdx}`}
                  className="py-2 px-3 border-r border-slate-700 text-center font-bold text-slate-300 min-w-[64px]"
                >
                  {gridData.rows[0]?.[hIdx]?.col || hdr}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gridData.rows.map((row, rIdx) => {
              const rowNum = rIdx + 1;
              return (
                <tr key={`tr-${rIdx}`} className="border-b border-slate-800/80 hover:bg-slate-800/30 transition-colors">
                  {/* Row Number Column */}
                  <td className="py-1 px-2 bg-[#191a20] border-r border-slate-700 text-center text-slate-500 font-bold sticky left-0 z-5">
                    {rowNum}
                  </td>
                  {/* Data Cells */}
                  {row.map((cell, cIdx) => {
                    const isSelected = currentCell?.col === cell.col && currentCell?.row === cell.row;
                    const isLive = cell.value === 1 || cell.value === '1';

                    return (
                      <td
                        key={`td-${rIdx}-${cIdx}`}
                        onClick={() => setSelectedCell(cell)}
                        className={`py-1.5 px-3 border-r border-slate-800 text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-950/80 border-2 border-emerald-400 text-emerald-200 font-black shadow-md'
                            : isLive
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : 'text-slate-400'
                        }`}
                      >
                        <span className="tabular-nums">{cell.value}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Formula Dissection Callout Box */}
      <div className="mt-4 p-4 rounded-lg bg-[#141519] border border-slate-700 font-mono text-xs text-slate-300">
        <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          FIRST-PRINCIPLES FORMULA DECONSTRUCTION
        </div>
        {activeSheetMode === 'rule110' ? (
          <div className="space-y-1 text-slate-300 leading-relaxed">
            <p>
              <strong className="text-emerald-400 font-mono">=CHOOSE(4*Left + 2*Center + Right + 1, 0, 1, 1, 1, 0, 1, 1, 0)</strong>
            </p>
            <p className="text-slate-400 text-[11px]">
              &bull; <strong className="text-slate-200">Neighborhood Weighting</strong>: The 3 neighborhood cells form an 8-state index (0 to 7) + 1 offset into the CHOOSE parameter list.
            </p>
            <p className="text-slate-400 text-[11px]">
              &bull; <strong className="text-slate-200">Zero Math Shortcuts</strong>: No floating point, modulo, or trigonometric functions are required. In pure Boolean form, it simplifies to:
              <span className="text-amber-300 block my-1">
                =IF(OR(AND(L=1,C=1,R=0), AND(L=1,C=0,R=1), AND(L=0,C=1,R=1), AND(L=0,C=1,R=0), AND(L=0,C=0,R=1)), 1, 0)
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-1 text-slate-300 leading-relaxed">
            <p>
              <strong className="text-emerald-400 font-mono">Full-Adder Sum: =IF(OR(AND(A,notB,notC), AND(notA,B,notC), AND(notA,notB,C), AND(A,B,C)), 1, 0)</strong>
            </p>
            <p>
              <strong className="text-cyan-400 font-mono">Full-Adder Cout: =IF(OR(AND(A,B), AND(A,Cin), AND(B,Cin)), 1, 0)</strong>
            </p>
            <p className="text-slate-400 text-[11px]">
              Carry bits propagate mechanically down from Row 2 to Row 9, realizing a full 8-bit ripple carry adder inside a spreadsheet without using the <code className="text-amber-300">SUM()</code> function.
            </p>
          </div>
        )}
      </div>

      {/* Google Apps Script Modal */}
      {showAppsScriptModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1d24] border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-slate-100">
                  Google Apps Script: One-Click Spreadsheet Generator
                </h3>
              </div>
              <button
                onClick={() => setShowAppsScriptModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-slate-300 mb-3 leading-relaxed">
              Copy this code, go to <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-cyan-400 underline">sheets.new</a>, navigate to <strong>Extensions &gt; Apps Script</strong>, paste it, and run <code className="text-amber-300">createCommodore110Sheet()</code>. It automatically builds this exact cellular automaton grid with live dynamic formulas!
            </p>

            <pre className="bg-[#111215] p-3 rounded-lg border border-slate-800 text-slate-300 max-h-60 overflow-y-auto mb-4 text-[11px] leading-relaxed">
              {generateGoogleAppsScriptCode()}
            </pre>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAppsScriptModal(false)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Close
              </button>
              <button
                onClick={handleCopyAppsScript}
                className="flex items-center gap-1.5 px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript ? 'Copied Code!' : 'Copy Apps Script'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
