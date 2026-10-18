/**
 * First-Principles Double-Dabble (Shift-and-Add-3) Decimal Converter Module
 * Transforms 8-bit binary to 3 decimal BCD digits without division or modulus.
 * Features 7-Segment Mechanical Decoder and boolean gate equations.
 */

import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, 
  RotateCcw, 
  Play, 
  Pause, 
  StepForward, 
  Calculator, 
  Cpu, 
  CheckCircle, 
  Layers
} from 'lucide-react';
import { runDoubleDabble8, decodeBcdTo7Segment } from '../engine/doubleDabble';
import { decimalTo8Bits } from '../engine/mechanicalAlu';

interface DoubleDabbleViewProps {
  initialValue?: number;
}

export const DoubleDabbleView: React.FC<DoubleDabbleViewProps> = ({ initialValue = 187 }) => {
  const [inputValue, setInputValue] = useState<number>(initialValue);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  const bits8 = useMemo(() => decimalTo8Bits(inputValue), [inputValue]);
  const ddResult = useMemo(() => runDoubleDabble8(bits8), [bits8]);

  const activeStep = ddResult.steps[Math.min(currentStepIdx, ddResult.steps.length - 1)];

  // Decode 7 segments for each BCD digit
  const segHundreds = useMemo(() => decodeBcdTo7Segment(activeStep.hundreds), [activeStep.hundreds]);
  const segTens = useMemo(() => decodeBcdTo7Segment(activeStep.tens), [activeStep.tens]);
  const segOnes = useMemo(() => decodeBcdTo7Segment(activeStep.ones), [activeStep.ones]);

  // Autoplay timer
  React.useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentStepIdx((idx) => {
        if (idx >= ddResult.steps.length - 1) {
          setAutoPlay(false);
          return idx;
        }
        return idx + 1;
      });
    }, 700);
    return () => clearInterval(timer);
  }, [autoPlay, ddResult.steps.length]);

  // 7-segment visual component
  const renderSevenSegment = (digitVal: number, segs: ReturnType<typeof decodeBcdTo7Segment>, label: string) => {
    return (
      <div className="flex flex-col items-center">
        <span className="text-[11px] font-mono text-slate-400 mb-1">{label}</span>
        {/* Retro LED Bubble Bezel */}
        <div className="w-24 h-36 bg-[#180404] rounded-lg border-2 border-[#450a0a] p-3 relative flex items-center justify-center shadow-inner">
          <svg viewBox="0 0 100 160" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,40,40,0.8)]">
            {/* Segment a (top) */}
            <path
              d="M 22 15 L 78 15 L 70 25 L 30 25 Z"
              fill={segs.a ? '#ff2b2b' : '#3d0a0a'}
            />
            {/* Segment b (top right) */}
            <path
              d="M 80 18 L 88 26 L 82 74 L 72 68 L 78 26 Z"
              fill={segs.b ? '#ff2b2b' : '#3d0a0a'}
            />
            {/* Segment c (bottom right) */}
            <path
              d="M 82 86 L 88 134 L 80 142 L 72 134 L 78 92 Z"
              fill={segs.c ? '#ff2b2b' : '#3d0a0a'}
            />
            {/* Segment d (bottom) */}
            <path
              d="M 30 135 L 70 135 L 78 145 L 22 145 Z"
              fill={segs.d ? '#ff2b2b' : '#3d0a0a'}
            />
            {/* Segment e (bottom left) */}
            <path
              d="M 12 86 L 18 92 L 24 134 L 16 142 L 8 134 Z"
              fill={segs.e ? '#ff2b2b' : '#3d0a0a'}
            />
            {/* Segment f (top left) */}
            <path
              d="M 16 18 L 24 26 L 18 68 L 12 74 L 8 26 Z"
              fill={segs.f ? '#ff2b2b' : '#3d0a0a'}
            />
            {/* Segment g (center) */}
            <path
              d="M 24 75 L 76 75 L 82 80 L 76 85 L 24 85 L 18 80 Z"
              fill={segs.g ? '#ff2b2b' : '#3d0a0a'}
            />
          </svg>
        </div>
        <div className="mt-2 text-center font-mono">
          <span className="text-xl font-bold text-red-500">{digitVal}</span>
          <span className="text-[10px] text-slate-500 block">BCD: {segs ? 'VALID' : ''}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#181a20] rounded-xl border border-slate-700/70 p-5 shadow-xl">
      {/* Module Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-mono text-base font-bold text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-500" />
              DOUBLE-DABBLE (SHIFT-AND-ADD-3) DECIMAL CONVERTER
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-mono border border-amber-800">
              Binary &rarr; BCD Conversion
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Converts 8-bit binary to 3 decimal digits purely via 8 shift steps and discrete Add-3 corrections.
          </p>
        </div>

        {/* Input Value Slider / Number Box */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">TEST VALUE:</span>
          <input
            type="number"
            min="0"
            max="255"
            value={inputValue}
            onChange={(e) => {
              const val = Math.max(0, Math.min(255, parseInt(e.target.value, 10) || 0));
              setInputValue(val);
              setCurrentStepIdx(0);
            }}
            className="w-16 px-2 py-1 rounded bg-[#232630] border border-slate-600 text-amber-300 font-bold text-center"
          />
          <span className="text-slate-500 text-[11px]">
            ({bits8.join('')}₂)
          </span>
        </div>
      </div>

      {/* Main Double-Dabble Registers & Hardware Pipeline */}
      <div className="bg-[#121316] rounded-xl p-5 border border-slate-700/70 mb-5 shadow-inner font-mono">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs">
          <span className="text-slate-400">
            MICRO-STEP: <strong className="text-amber-400">{currentStepIdx + 1}</strong> / {ddResult.steps.length}
          </span>
          <span className="text-slate-400">
            SHIFT COUNT: <strong className="text-cyan-400">{activeStep.shiftCount}</strong> / 8
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            activeStep.actionType === 'ADD3'
              ? 'bg-red-950 text-red-300 border border-red-800'
              : activeStep.actionType === 'SHIFT'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }`}>
            ACTION: {activeStep.actionType}
          </span>
        </div>

        {/* Register Cells Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-center">
          {/* Hundreds Column (4 bits) */}
          <div className={`p-3 rounded-lg border-2 transition-all ${
            activeStep.correctedUnits?.includes('hundreds')
              ? 'bg-red-950/40 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
              : 'bg-[#1c1e24] border-slate-700'
          }`}>
            <span className="text-[10px] text-slate-400 block mb-1">HUNDREDS BCD (4-Bit)</span>
            <div className="flex justify-center gap-1 my-1.5">
              {activeStep.hundreds.map((bit, i) => (
                <span
                  key={`h-${i}`}
                  className={`w-6 h-7 rounded flex items-center justify-center font-bold text-sm ${
                    bit ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {bit}
                </span>
              ))}
            </div>
            <span className="text-xs text-amber-300 font-bold">
              Digit = {(activeStep.hundreds[0] << 3) | (activeStep.hundreds[1] << 2) | (activeStep.hundreds[2] << 1) | activeStep.hundreds[3]}
            </span>
          </div>

          {/* Tens Column (4 bits) */}
          <div className={`p-3 rounded-lg border-2 transition-all ${
            activeStep.correctedUnits?.includes('tens')
              ? 'bg-red-950/40 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
              : 'bg-[#1c1e24] border-slate-700'
          }`}>
            <span className="text-[10px] text-slate-400 block mb-1">TENS BCD (4-Bit)</span>
            <div className="flex justify-center gap-1 my-1.5">
              {activeStep.tens.map((bit, i) => (
                <span
                  key={`t-${i}`}
                  className={`w-6 h-7 rounded flex items-center justify-center font-bold text-sm ${
                    bit ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {bit}
                </span>
              ))}
            </div>
            <span className="text-xs text-cyan-300 font-bold">
              Digit = {(activeStep.tens[0] << 3) | (activeStep.tens[1] << 2) | (activeStep.tens[2] << 1) | activeStep.tens[3]}
            </span>
          </div>

          {/* Ones Column (4 bits) */}
          <div className={`p-3 rounded-lg border-2 transition-all ${
            activeStep.correctedUnits?.includes('ones')
              ? 'bg-red-950/40 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
              : 'bg-[#1c1e24] border-slate-700'
          }`}>
            <span className="text-[10px] text-slate-400 block mb-1">ONES BCD (4-Bit)</span>
            <div className="flex justify-center gap-1 my-1.5">
              {activeStep.ones.map((bit, i) => (
                <span
                  key={`o-${i}`}
                  className={`w-6 h-7 rounded flex items-center justify-center font-bold text-sm ${
                    bit ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {bit}
                </span>
              ))}
            </div>
            <span className="text-xs text-emerald-300 font-bold">
              Digit = {(activeStep.ones[0] << 3) | (activeStep.ones[1] << 2) | (activeStep.ones[2] << 1) | activeStep.ones[3]}
            </span>
          </div>

          {/* Binary Remaining (8 bits) */}
          <div className="p-3 rounded-lg bg-[#1c1e24] border-2 border-slate-700">
            <span className="text-[10px] text-slate-400 block mb-1">REMAINING BINARY</span>
            <div className="flex justify-center gap-0.5 my-1.5 overflow-x-auto">
              {activeStep.binaryRemaining.map((bit, i) => (
                <span
                  key={`bin-${i}`}
                  className={`w-5 h-7 rounded text-xs flex items-center justify-center font-mono ${
                    i < 8 - activeStep.shiftCount
                      ? (bit ? 'bg-amber-600 text-white font-bold' : 'bg-slate-700 text-slate-400')
                      : 'bg-slate-900 text-slate-600'
                  }`}
                >
                  {bit}
                </span>
              ))}
            </div>
            <span className="text-xs text-slate-400">
              Shifted: {activeStep.shiftCount} bits
            </span>
          </div>
        </div>

        {/* Step Description Banner */}
        <div className="p-3 rounded-lg bg-[#18191f] border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
          <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{activeStep.description}</span>
        </div>
      </div>

      {/* Stepper Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 font-mono text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold shadow ${
              autoPlay ? 'bg-amber-600 text-white' : 'bg-emerald-700 text-white'
            }`}
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoPlay ? 'PAUSE' : 'AUTOPLAY'}</span>
          </button>

          <button
            onClick={() => {
              setAutoPlay(false);
              setCurrentStepIdx((idx) => Math.min(idx + 1, ddResult.steps.length - 1));
            }}
            disabled={currentStepIdx >= ddResult.steps.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#2a2d36] hover:bg-[#383c48] disabled:opacity-40 text-slate-200 border border-slate-600"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>NEXT STEP</span>
          </button>

          <button
            onClick={() => { setAutoPlay(false); setCurrentStepIdx(0); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#2a2d36] hover:bg-[#383c48] text-slate-400 hover:text-slate-200 border border-slate-600"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>

        <div className="text-slate-400">
          Conversion Result: <strong className="text-emerald-400 text-sm">{ddResult.decimalString}</strong>₁₀
        </div>
      </div>

      {/* Retro 7-Segment Mechanical Decoder Section */}
      <div className="bg-[#121316] rounded-xl p-5 border border-slate-700/70 shadow-inner">
        <div className="border-b border-slate-800 pb-3 mb-4">
          <h3 className="font-mono text-sm font-bold text-slate-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-red-500" />
            VINTAGE 7-SEGMENT MECHANICAL OPTICAL DECODER
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Illuminated via exact Boolean sum-of-products from 4-bit BCD signals (a..g)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-items-center mb-5">
          {renderSevenSegment(ddResult.hundredsDigit, segHundreds, 'HUNDREDS DIGIT')}
          {renderSevenSegment(ddResult.tensDigit, segTens, 'TENS DIGIT')}
          {renderSevenSegment(ddResult.onesDigit, segOnes, 'ONES DIGIT')}
        </div>

        {/* Boolean Logic Equations Reference */}
        <div className="bg-[#18191f] p-4 rounded-lg border border-slate-800 font-mono text-xs text-slate-400">
          <span className="text-amber-400 font-bold block mb-2">
            7-Segment Discrete Logic Equations (Karnaugh Map Minimization):
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            <div>&bull; Segment a: <code className="text-slate-200">D ∨ B ∨ (C ∧ A) ∨ (¬C ∧ ¬A)</code></div>
            <div>&bull; Segment b: <code className="text-slate-200">¬B ∨ (¬C ∧ ¬A) ∨ (C ∧ A)</code></div>
            <div>&bull; Segment c: <code className="text-slate-200">C ∨ ¬B ∨ A</code></div>
            <div>&bull; Segment d: <code className="text-slate-200">D ∨ (¬C ∧ ¬A) ∨ (B ∧ ¬A) ∨ (C ∧ ¬B ∧ A)</code></div>
            <div>&bull; Segment e: <code className="text-slate-200">(¬C ∧ ¬A) ∨ (B ∧ ¬A)</code></div>
            <div>&bull; Segment f: <code className="text-slate-200">D ∨ (¬B ∧ ¬A) ∨ (C ∧ ¬B) ∨ (C ∧ ¬A)</code></div>
            <div className="md:col-span-2">&bull; Segment g: <code className="text-slate-200">D ∨ (C ∧ ¬B) ∨ (¬C ∧ B) ∨ (B ∧ ¬A)</code></div>
          </div>
        </div>
      </div>
    </div>
  );
};
