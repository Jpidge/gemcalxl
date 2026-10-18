/**
 * Vintage Commodore Handheld Calculator Console
 * Authentic 1970s Commodore aesthetic with red bubble LED displays,
 * chunky mechanical dual-tone keys, discrete 8-bit toggle switches,
 * horizontally aligned LED decals, CSV trace export, and tactile mechanical feedback.
 */

import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  Sparkles, 
  Cpu, 
  Binary, 
  Grid, 
  FileText,
  Volume2,
  VolumeX,
  Download,
  Check,
  Table,
  BookOpen,
  GitFork,
  Activity,
  Flame,
  Tv
} from 'lucide-react';
import { AluExecutionResult, DisplayMode, OperationType, ViewTab } from '../types';
import { playKeyClick } from '../utils/audio';

interface VintageCalculatorConsoleProps {
  operandA: number;
  operandB: number;
  operation: OperationType;
  aluResult: AluExecutionResult;
  clockStep: number;
  isClockRunning: boolean;
  clockHz: number;
  displayMode: DisplayMode;
  onSetOperandA: (val: number) => void;
  onSetOperandB: (val: number) => void;
  onSetOperation: (op: OperationType) => void;
  onToggleClock: () => void;
  onStepClock: () => void;
  onResetClock: () => void;
  onSetClockHz: (hz: number) => void;
  onSetDisplayMode: (mode: DisplayMode) => void;
  onNavigateTab: (tab: ViewTab) => void;
}

export const VintageCalculatorConsole: React.FC<VintageCalculatorConsoleProps> = ({
  operandA,
  operandB,
  operation,
  aluResult,
  clockStep,
  isClockRunning,
  clockHz,
  displayMode,
  onSetOperandA,
  onSetOperandB,
  onSetOperation,
  onToggleClock,
  onStepClock,
  onResetClock,
  onSetClockHz,
  onSetDisplayMode,
  onNavigateTab,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeInputReg, setActiveInputReg] = useState<'A' | 'B'>('A');
  const [keypadBuffer, setKeypadBuffer] = useState<string>('');
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [exportedTraceCsv, setExportedTraceCsv] = useState<boolean>(false);

  const clickSound = (type: 'num' | 'op' | 'switch' | 'clock' = 'num') => {
    if (soundEnabled) {
      playKeyClick(type);
    }
  };

  const handleKeypadPress = (digit: string) => {
    clickSound('num');
    const newBuf = (keypadBuffer + digit).slice(-3);
    const parsed = parseInt(newBuf, 10);
    if (!isNaN(parsed) && parsed <= 255) {
      setKeypadBuffer(newBuf);
      if (activeInputReg === 'A') {
        onSetOperandA(parsed);
      } else {
        onSetOperandB(parsed);
      }
    }
  };

  const handleKeypadClear = () => {
    clickSound('op');
    setKeypadBuffer('');
    if (activeInputReg === 'A') {
      onSetOperandA(0);
    } else {
      onSetOperandB(0);
    }
  };

  const handleToggleBit = (reg: 'A' | 'B', bitIndex: number) => {
    clickSound('switch');
    const currentVal = reg === 'A' ? operandA : operandB;
    const mask = 1 << (7 - bitIndex);
    const nextVal = currentVal ^ mask;
    if (reg === 'A') {
      onSetOperandA(nextVal);
    } else {
      onSetOperandB(nextVal);
    }
    setKeypadBuffer(String(nextVal));
  };

  const handleExportTraceCsv = () => {
    clickSound('op');
    const headers = [
      'Clock_Tick',
      'Phase',
      'Description',
      'Opcode',
      'Operand_A_Dec',
      'Operand_A_Bin',
      'Operand_B_Dec',
      'Operand_B_Bin',
      'Accumulator_Bin',
      'CarryOut',
      'ActiveBit',
      'IsComplete'
    ];

    const rows = aluResult.steps.map((s) => [
      s.step,
      `"${s.phase.replace(/"/g, '""')}"`,
      `"${s.description.replace(/"/g, '""')}"`,
      aluResult.operation,
      aluResult.operandA,
      `"${aluResult.bitsA.join('')}"`,
      aluResult.operandB,
      `"${aluResult.bitsB.join('')}"`,
      `"${s.accumulator.join('')}"`,
      s.carryOut,
      s.activeBitIndex !== undefined ? s.activeBitIndex : '',
      s.isComplete ? 'TRUE' : 'FALSE'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Commodore110_ALU_Trace_${aluResult.operation}_${aluResult.operandA}_${aluResult.operandB}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportedTraceCsv(true);
    setTimeout(() => setExportedTraceCsv(false), 2500);
  };

  const currentStepRecord = aluResult.steps[Math.min(clockStep, aluResult.steps.length - 1)];

  // LED Display formatting
  const resultDisplayStr = aluResult.resultValue.toString().padStart(3, ' ');
  const operandADisplay = operandA.toString().padStart(3, ' ');
  const operandBDisplay = operandB.toString().padStart(3, ' ');

  // Get color styles based on display mode
  const getDisplayColors = () => {
    switch (displayMode) {
      case 'vintage-led':
        return {
          bg: 'bg-[#210505]',
          border: 'border-[#4a0e0e]',
          text: 'text-[#ff2b2b]',
          glow: 'drop-shadow-[0_0_8px_rgba(255,43,43,0.8)]',
          dim: 'text-[#420d0d]',
        };
      case 'cyan-vfd':
        return {
          bg: 'bg-[#031c1a]',
          border: 'border-[#0a443f]',
          text: 'text-[#38efdf]',
          glow: 'drop-shadow-[0_0_8px_rgba(56,239,223,0.8)]',
          dim: 'text-[#0a3935]',
        };
      case 'amber-phosphor':
        return {
          bg: 'bg-[#1e1302]',
          border: 'border-[#4d3206]',
          text: 'text-[#f59e0b]',
          glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]',
          dim: 'text-[#422904]',
        };
    }
  };

  const colors = getDisplayColors();

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Outer Commodore Chassis */}
      <div className="relative rounded-2xl bg-[#26282e] p-6 shadow-2xl border-4 border-[#3a3d46] text-slate-100">
        {/* Vintage Top Faceplate with Brushed Metal Finish & Commodore Badge */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[#1c1d22] pb-4 mb-5 gap-3">
          <div className="flex items-center gap-3">
            {/* Iconic Vintage C= Logo */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-200 via-slate-100 to-slate-400 p-1 flex items-center justify-center shadow-inner border border-slate-400">
              <span className="font-mono font-black text-2xl tracking-tighter text-blue-900 select-none">
                C<span className="text-red-600">=</span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono font-bold text-xl tracking-wider uppercase text-slate-100">
                  COMMODORE 110
                </h1>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  CELLULAR ALU
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                First-Principles 8-Bit Discrete Automata Calculator
              </p>
            </div>
          </div>

          {/* Quick Hardware Controls & Switches */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            {/* CRT Monitor Effect Toggle */}
            <button
              onClick={() => {
                setCrtEnabled(!crtEnabled);
                clickSound('switch');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all border font-bold cursor-pointer ${
                crtEnabled 
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                  : 'bg-[#1e2025] border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle vintage CRT phosphor scanlines & screen curvature"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>CRT: {crtEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* CSV Trace Export Button */}
            <button
              onClick={handleExportTraceCsv}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all border font-bold cursor-pointer ${
                exportedTraceCsv
                  ? 'bg-emerald-800 text-white border-emerald-500'
                  : 'bg-[#1e2025] hover:bg-[#32363f] text-slate-300 border-slate-700'
              }`}
              title="Export step-by-step ALU microcode trace as CSV file"
            >
              {exportedTraceCsv ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5 text-amber-400" />}
              <span>{exportedTraceCsv ? 'EXPORTED!' : 'EXPORT CSV'}</span>
            </button>

            {/* Download Full Project ZIP */}
            <a
              href="/api/download-zip"
              download="commodore-110-cellular-calculator.zip"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600/90 hover:bg-amber-500 text-white font-bold transition-all shadow-[0_0_8px_rgba(245,158,11,0.3)] border border-amber-400/50 cursor-pointer"
              title="Download entire project repository source code archive (.zip)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SOURCE .ZIP</span>
            </a>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                clickSound('switch');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1e2025] hover:bg-[#32363f] text-slate-300 transition-colors border border-slate-700 cursor-pointer"
              title="Toggle tactile mechanical click sounds"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span>{soundEnabled ? 'CLICK ON' : 'MUTE'}</span>
            </button>

            {/* Display Phosphor Filter Switch */}
            <div className="flex items-center gap-1 bg-[#1e2025] p-1 rounded border border-slate-700">
              <span className="text-slate-400 px-1 text-[10px]">FILTER:</span>
              <button
                onClick={() => { onSetDisplayMode('vintage-led'); clickSound('switch'); }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${displayMode === 'vintage-led' ? 'bg-red-900/60 text-red-200 border border-red-700' : 'text-slate-400 hover:text-slate-200'}`}
              >
                LED
              </button>
              <button
                onClick={() => { onSetDisplayMode('cyan-vfd'); clickSound('switch'); }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${displayMode === 'cyan-vfd' ? 'bg-teal-900/60 text-teal-200 border border-teal-700' : 'text-slate-400 hover:text-slate-200'}`}
              >
                VFD
              </button>
              <button
                onClick={() => { onSetDisplayMode('amber-phosphor'); clickSound('switch'); }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${displayMode === 'amber-phosphor' ? 'bg-amber-900/60 text-amber-200 border border-amber-700' : 'text-slate-400 hover:text-slate-200'}`}
              >
                AMBER
              </button>
            </div>
          </div>
        </div>

        {/* Vintage Recessed Optical Filter Screen (The Bubble LED Display Window) */}
        <div className={`relative rounded-xl p-4 mb-6 border-4 border-[#141518] shadow-2xl bg-gradient-to-b from-[#18191d] to-[#0d0e10] ${
          crtEnabled ? 'crt-screen' : ''
        }`}>
          {/* Subtle curved acrylic lens reflection effect */}
          <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-b from-white/5 via-transparent to-black/20" />

          {/* ========================================================= */}
          {/* HORIZONTALLY ALIGNED STATUS ANNUNCIATOR DECALS RIBBON     */}
          {/* ========================================================= */}
          <div className="bg-[#120606] px-3 py-2 rounded-t-lg border-b border-red-950/80 mb-2 flex items-center justify-between overflow-x-auto gap-2 text-[10px] font-mono select-none">
            <span className="text-slate-400 uppercase tracking-widest text-[9px] shrink-0 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
              STATUS DECALS:
            </span>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Power */}
              <div className="flex flex-row items-center gap-1.5 bg-[#1a0808] px-2 py-0.5 rounded border border-red-950">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span className="text-slate-300 font-bold">PWR</span>
              </div>
              {/* Run */}
              <div className="flex flex-row items-center gap-1.5 bg-[#1a0808] px-2 py-0.5 rounded border border-red-950">
                <span className={`w-2.5 h-2.5 rounded-full ${isClockRunning ? 'bg-amber-400 animate-pulse shadow-[0_0_6px_rgba(245,158,11,0.8)]' : 'bg-slate-700'}`} />
                <span className={isClockRunning ? 'text-amber-300 font-bold' : 'text-slate-500'}>RUN</span>
              </div>
              {/* Carry */}
              <div className="flex flex-row items-center gap-1.5 bg-[#1a0808] px-2 py-0.5 rounded border border-red-950">
                <span className={`w-2.5 h-2.5 rounded-full ${aluResult.carryOut ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)] animate-pulse' : 'bg-slate-700'}`} />
                <span className={aluResult.carryOut ? 'text-red-300 font-bold' : 'text-slate-500'}>CARRY</span>
              </div>
              {/* Overflow */}
              <div className="flex flex-row items-center gap-1.5 bg-[#1a0808] px-2 py-0.5 rounded border border-red-950">
                <span className={`w-2.5 h-2.5 rounded-full ${aluResult.overflow ? 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]' : 'bg-slate-700'}`} />
                <span className={aluResult.overflow ? 'text-amber-300 font-bold' : 'text-slate-500'}>OVERFLOW</span>
              </div>
              {/* Zero */}
              <div className="flex flex-row items-center gap-1.5 bg-[#1a0808] px-2 py-0.5 rounded border border-red-950">
                <span className={`w-2.5 h-2.5 rounded-full ${aluResult.zero ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-slate-700'}`} />
                <span className={aluResult.zero ? 'text-emerald-300 font-bold' : 'text-slate-500'}>ZERO</span>
              </div>
              {/* Negative */}
              <div className="flex flex-row items-center gap-1.5 bg-[#1a0808] px-2 py-0.5 rounded border border-red-950">
                <span className={`w-2.5 h-2.5 rounded-full ${aluResult.negative ? 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]' : 'bg-slate-700'}`} />
                <span className={aluResult.negative ? 'text-rose-300 font-bold' : 'text-slate-500'}>NEG</span>
              </div>
              {/* Div Zero Err */}
              <div className="flex flex-row items-center gap-1.5 bg-[#1a0808] px-2 py-0.5 rounded border border-red-950">
                <span className={`w-2.5 h-2.5 rounded-full ${aluResult.operation === 'DIV' && aluResult.operandB === 0 ? 'bg-red-500 animate-ping' : 'bg-slate-700'}`} />
                <span className={aluResult.operation === 'DIV' && aluResult.operandB === 0 ? 'text-red-400 font-bold' : 'text-slate-500'}>DIV-ERR</span>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-4 font-mono ${colors.bg} border-2 ${colors.border} shadow-2xl relative overflow-hidden`}>
            {/* Fine horizontal cathode scanlines when CRT is enabled */}
            <div className="absolute inset-0 pointer-events-none opacity-25 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000_3px)]" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Left Sub-Panel: Operands & Operation Status */}
              <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-red-950/60 pb-3 md:pb-0 md:pr-4">
                <div className="flex justify-between items-center text-xs">
                  <span className={colors.dim}>REG A:</span>
                  <span className={`text-base font-bold tracking-wider ${colors.text} ${colors.glow}`}>
                    {operandADisplay} <span className="text-[10px] text-slate-400 font-normal">({aluResult.bitsA.join('')})</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className={colors.dim}>REG B:</span>
                  <span className={`text-base font-bold tracking-wider ${colors.text} ${colors.glow}`}>
                    {operandBDisplay} <span className="text-[10px] text-slate-400 font-normal">({aluResult.bitsB.join('')})</span>
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-red-950/40">
                  <span className={colors.dim}>OPCODE:</span>
                  <span className={`font-black tracking-widest ${colors.text} ${colors.glow}`}>
                    {operation}
                  </span>
                </div>
              </div>

              {/* Center Main Stage: 9-Digit Bubble LED Style Result Display */}
              <div className="text-center py-1">
                <span className={`text-[10px] uppercase tracking-widest block ${colors.dim}`}>
                  ACCUMULATOR / RESULT
                </span>
                <div className={`text-4xl md:text-5xl font-mono font-black tracking-wider my-1 ${colors.text} ${colors.glow}`}>
                  {resultDisplayStr}
                </div>
                <div className="flex items-center justify-center gap-1 text-[11px] font-mono tracking-widest">
                  <span className={colors.dim}>BINARY:</span>
                  <span className={`${colors.text} font-bold`}>
                    {aluResult.resultBits.join('')}
                  </span>
                </div>
              </div>

              {/* Right Sub-Panel: Hardware Status Flags & Clock Phase */}
              <div className="flex flex-col gap-1.5 border-t md:border-t-0 md:border-l border-red-950/60 pt-3 md:pt-0 md:pl-4 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className={colors.dim}>CLOCK STEP:</span>
                  <span className={`${colors.text} font-bold`}>
                    {clockStep} / {aluResult.totalClockTicks}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={colors.dim}>PHASE:</span>
                  <span className="text-slate-300 text-[11px] truncate max-w-[120px]" title={currentStepRecord?.phase}>
                    {currentStepRecord?.phase || 'IDLE'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-red-950/40 text-[10px]">
                  <span className={colors.dim}>CRT FILTER:</span>
                  <span className="text-emerald-400 font-bold">{crtEnabled ? 'ACTIVE (75Hz)' : 'OFF'}</span>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* HORIZONTALLY ALIGNED 8-BIT OUTPUT BUS DECALS RIBBON       */}
            {/* ========================================================= */}
            <div className="mt-4 pt-3 border-t border-red-950/80">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 px-1">
                <span className="font-bold tracking-wider uppercase text-[9px] text-red-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  HORIZONTAL 8-BIT OUTPUT BUS DECALS:
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  b7 (MSB) &rarr; b0 (LSB)
                </span>
              </div>

              {/* Continuous horizontal strip where LED jewel + label + value are lined up horizontally */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-1.5 bg-[#080202] p-2 rounded-lg border border-red-950/80 shadow-inner">
                {aluResult.resultBits.map((bit, idx) => {
                  const weight = 1 << (7 - idx);
                  return (
                    <div 
                      key={`out-decal-${idx}`} 
                      className={`flex flex-row items-center justify-between px-2 py-1.5 rounded transition-all border ${
                        bit === 1 
                          ? 'bg-[#200505] border-red-700/80 shadow-[0_0_8px_rgba(239,68,68,0.3)]' 
                          : 'bg-[#100303] border-red-950/60'
                      }`}
                    >
                      {/* Left: Jewel Lens */}
                      <span className={`w-3 h-3 rounded-full shrink-0 transition-all ${
                        bit === 1 
                          ? 'bg-red-500 shadow-[0_0_8px_rgba(255,40,40,1)] scale-110' 
                          : 'bg-[#350a0a] shadow-inner'
                      }`} />

                      {/* Middle: Decal Label */}
                      <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-tight mx-1">
                        b{7 - idx}
                      </span>

                      {/* Right: State Value */}
                      <span className={`text-xs font-mono font-black ${bit === 1 ? 'text-red-300' : 'text-slate-600'}`}>
                        {bit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Mechanical Switchboards & Keyboard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Discrete 8-Bit Toggle Levers for Register A & B */}
          <div className="lg:col-span-7 bg-[#1c1d22] p-5 rounded-xl border border-slate-700/60 shadow-inner flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-2">
                <h3 className="font-mono text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Binary className="w-4 h-4 text-amber-500" />
                  DISCRETE 8-BIT INPUT LEVER SWITCHES
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  MSB (Bit 7) &rarr; LSB (Bit 0)
                </span>
              </div>

              {/* Register A Switch Row with Horizontal Indicator Decals */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    OPERAND A (Value: {operandA})
                  </span>
                  <button 
                    onClick={() => { setActiveInputReg('A'); clickSound('op'); }}
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${activeInputReg === 'A' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-700 text-slate-300'}`}
                  >
                    KEYPAD FOCUS
                  </button>
                </div>

                {/* Horizontal Decals Ribbon for Reg A */}
                <div className="flex items-center justify-between bg-[#121418] px-2 py-1 rounded border border-slate-800 mb-1.5 text-[9px] font-mono text-slate-400">
                  <span className="text-amber-400 font-bold uppercase">REG A LEDS:</span>
                  <div className="flex items-center gap-2">
                    {aluResult.bitsA.map((bit, idx) => (
                      <span key={`decal-a-${idx}`} className="flex items-center gap-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${bit === 1 ? 'bg-amber-400 shadow-[0_0_4px_#f59e0b]' : 'bg-slate-700'}`} />
                        <span className={bit === 1 ? 'text-amber-300 font-bold' : 'text-slate-600'}>b{7-idx}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-2">
                  {aluResult.bitsA.map((bit, idx) => (
                    <button
                      key={`rega-${idx}`}
                      onClick={() => handleToggleBit('A', idx)}
                      className={`flex flex-col items-center justify-between p-2 rounded-lg border-2 transition-all cursor-pointer ${
                        bit === 1
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                          : 'bg-[#26282e] border-slate-700 text-slate-500 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-slate-400">b{7 - idx}</span>
                      {/* Realistic mechanical toggle knob */}
                      <div className={`w-3.5 h-6 rounded-sm my-1 flex items-center justify-center p-0.5 transition-all ${
                        bit === 1 ? 'bg-amber-500 shadow-md translate-y-[-2px]' : 'bg-slate-600 translate-y-[2px]'
                      }`}>
                        <div className="w-full h-1 bg-black/40 rounded-xs" />
                      </div>
                      <span className="text-xs font-bold font-mono">{bit}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Register B Switch Row with Horizontal Indicator Decals */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    OPERAND B (Value: {operandB})
                  </span>
                  <button 
                    onClick={() => { setActiveInputReg('B'); clickSound('op'); }}
                    className={`text-[10px] px-2 py-0.5 rounded font-mono ${activeInputReg === 'B' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-700 text-slate-300'}`}
                  >
                    KEYPAD FOCUS
                  </button>
                </div>

                {/* Horizontal Decals Ribbon for Reg B */}
                <div className="flex items-center justify-between bg-[#121418] px-2 py-1 rounded border border-slate-800 mb-1.5 text-[9px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-bold uppercase">REG B LEDS:</span>
                  <div className="flex items-center gap-2">
                    {aluResult.bitsB.map((bit, idx) => (
                      <span key={`decal-b-${idx}`} className="flex items-center gap-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${bit === 1 ? 'bg-cyan-400 shadow-[0_0_4px_#06b6d4]' : 'bg-slate-700'}`} />
                        <span className={bit === 1 ? 'text-cyan-300 font-bold' : 'text-slate-600'}>b{7-idx}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-2">
                  {aluResult.bitsB.map((bit, idx) => (
                    <button
                      key={`regb-${idx}`}
                      onClick={() => handleToggleBit('B', idx)}
                      className={`flex flex-col items-center justify-between p-2 rounded-lg border-2 transition-all cursor-pointer ${
                        bit === 1
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                          : 'bg-[#26282e] border-slate-700 text-slate-500 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-slate-400">b{7 - idx}</span>
                      <div className={`w-3.5 h-6 rounded-sm my-1 flex items-center justify-center p-0.5 transition-all ${
                        bit === 1 ? 'bg-cyan-500 shadow-md translate-y-[-2px]' : 'bg-slate-600 translate-y-[2px]'
                      }`}>
                        <div className="w-full h-1 bg-black/40 rounded-xs" />
                      </div>
                      <span className="text-xs font-bold font-mono">{bit}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Clock Sequencer Control Bar */}
            <div className="pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { onToggleClock(); clickSound('switch'); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold shadow-md transition-all cursor-pointer ${
                    isClockRunning
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {isClockRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isClockRunning ? 'HALT CLK' : 'RUN CLK'}</span>
                </button>

                <button
                  onClick={() => { onStepClock(); clickSound('clock'); }}
                  disabled={isClockRunning}
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#2b2d35] hover:bg-[#3d404b] disabled:opacity-40 text-slate-200 border border-slate-600 cursor-pointer"
                >
                  <StepForward className="w-3.5 h-3.5" />
                  <span>STEP (+1)</span>
                </button>

                <button
                  onClick={() => { onResetClock(); clickSound('op'); }}
                  className="p-1.5 rounded bg-[#2b2d35] hover:bg-[#3d404b] text-slate-400 hover:text-slate-200 border border-slate-600 cursor-pointer"
                  title="Reset Clock State"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clock frequency slider */}
              <div className="flex items-center gap-2 text-slate-400">
                <span>FREQ:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={clockHz}
                  onChange={(e) => onSetClockHz(Number(e.target.value))}
                  className="w-20 accent-amber-500"
                />
                <span className="text-amber-400 w-8">{clockHz}Hz</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Vintage Keypad & Operation Matrix */}
          <div className="lg:col-span-5 bg-[#1c1d22] p-5 rounded-xl border border-slate-700/60 shadow-inner flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-2">
                <h3 className="font-mono text-sm font-bold text-slate-200">
                  ALU OPERATIONS & KEYPAD
                </h3>
                <span className="text-[10px] text-amber-400 font-mono">
                  TARGET: REG {activeInputReg}
                </span>
              </div>

              {/* ALU Operation Function Keys */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {(['ADD', 'SUB', 'MUL', 'DIV'] as OperationType[]).map((op) => (
                  <button
                    key={op}
                    onClick={() => { onSetOperation(op); clickSound('op'); }}
                    className={`py-2 px-1 rounded-md font-mono text-xs font-black shadow-md border-b-2 transition-all cursor-pointer ${
                      operation === op
                        ? 'bg-amber-600 text-white border-amber-800 translate-y-[1px]'
                        : 'bg-[#323640] hover:bg-[#3c414d] text-slate-200 border-[#202228]'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>

              {/* Discrete Logic Gate Operation Keys */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {(['AND', 'OR', 'XOR', 'NOT'] as OperationType[]).map((op) => (
                  <button
                    key={op}
                    onClick={() => { onSetOperation(op); clickSound('op'); }}
                    className={`py-1.5 px-1 rounded-md font-mono text-[11px] font-bold shadow border-b-2 transition-all cursor-pointer ${
                      operation === op
                        ? 'bg-cyan-600 text-white border-cyan-800 translate-y-[1px]'
                        : 'bg-[#292c34] hover:bg-[#353942] text-slate-300 border-[#1c1e23]'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>

              {/* Chunky Dual-Tone Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2">
                {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeypadPress(digit)}
                    className="py-2.5 rounded-lg bg-[#ded7c8] hover:bg-[#eae3d5] text-slate-900 font-mono font-bold text-sm shadow-[0_3px_0_#9c9586] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}
                {/* Clear Entry (C/CE) */}
                <button
                  onClick={handleKeypadClear}
                  className="py-2.5 rounded-lg bg-red-700 hover:bg-red-600 text-white font-mono font-bold text-xs shadow-[0_3px_0_#4a0e0e] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                >
                  C/CE
                </button>
                {/* Switch Target Register */}
                <button
                  onClick={() => {
                    setActiveInputReg(activeInputReg === 'A' ? 'B' : 'A');
                    clickSound('switch');
                  }}
                  className="py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-mono font-bold text-xs shadow-[0_3px_0_#1e2025] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                >
                  REG {activeInputReg === 'A' ? 'B' : 'A'}
                </button>
              </div>
            </div>

            {/* Direct Navigation to Mechanics & Visualizers */}
            <div className="pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => onNavigateTab('canvas-stage')}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#2a2d36] hover:bg-[#383c48] text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span>SPACETIME & HEATMAP</span>
              </button>
              <button
                onClick={() => onNavigateTab('signal-history')}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#2a2d36] hover:bg-[#383c48] text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>SIGNAL HISTORY</span>
              </button>
            </div>
          </div>
        </div>

        {/* Current State Change Explanation Box */}
        <div className="mt-5 p-3.5 rounded-lg bg-[#18191d] border border-slate-700/70 font-mono text-xs text-slate-300 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 animate-pulse shrink-0" />
          <div className="flex-1">
            <span className="text-amber-400 font-bold uppercase tracking-wider block mb-0.5">
              Current Micro-Step: {currentStepRecord?.phase || 'INITIAL'}
            </span>
            <p className="text-slate-300 leading-relaxed">
              {currentStepRecord?.description || 'System primed. Adjust operands, select arithmetic operation, and engage clock pulse.'}
            </p>
          </div>
          {aluResult.operation === 'DIV' && aluResult.remainderValue !== undefined && (
            <div className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-right shrink-0">
              <span className="text-[10px] text-slate-400 block">QUOTIENT / REM</span>
              <span className="text-amber-300 font-bold">
                Q={aluResult.quotientValue} · R={aluResult.remainderValue}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Access Hardware Exploration Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <button
          onClick={() => onNavigateTab('logic-tutorial')}
          className="p-3 rounded-xl bg-[#1b1d24] hover:bg-[#252832] border border-slate-800 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>LOGIC TUTORIAL</span>
          </div>
          <span className="text-[11px] text-slate-400">From Gliders to Arithmetic</span>
        </button>

        <button
          onClick={() => onNavigateTab('circuit-diagrams')}
          className="p-3 rounded-xl bg-[#1b1d24] hover:bg-[#252832] border border-slate-800 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-0.5">
            <GitFork className="w-3.5 h-3.5" />
            <span>CIRCUITS DIAGRAMS</span>
          </div>
          <span className="text-[11px] text-slate-400">Live Wired Full-Adder & ALU</span>
        </button>

        <button
          onClick={() => onNavigateTab('decision-tables')}
          className="p-3 rounded-xl bg-[#1b1d24] hover:bg-[#252832] border border-slate-800 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-0.5">
            <Table className="w-3.5 h-3.5" />
            <span>DECISION TABLES</span>
          </div>
          <span className="text-[11px] text-slate-400">K-Maps & Microcode Matrix</span>
        </button>

        <button
          onClick={() => onNavigateTab('ca-overview')}
          className="p-3 rounded-xl bg-[#1b1d24] hover:bg-[#252832] border border-slate-800 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-rose-400 font-bold mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CA OVERVIEW</span>
          </div>
          <span className="text-[11px] text-slate-400">Wolfram Classes & Universality</span>
        </button>
      </div>
    </div>
  );
};
