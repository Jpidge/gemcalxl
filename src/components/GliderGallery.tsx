/**
 * Rule 110 Glider & Gate Logic Suite
 * Features:
 * 1. Cellular Automata (CA) Overview & Wolfram Rule 110 Foundations.
 * 2. Interactive Logic Gate Tutorial (From Gliders to Arithmetic).
 * 3. Interactive Gate Circuit Diagrams with live clickable signal toggles.
 * 4. Logic Decision Tables & Karnaugh Minimization Maps.
 * 5. Matthew Cook's Glider Catalog (A, B, C, E, F).
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Compass, 
  CheckCircle, 
  HelpCircle, 
  Table, 
  BookOpen, 
  GitFork, 
  Grid,
  Zap,
  ArrowRight,
  Download,
  Check
} from 'lucide-react';
import { RULE_110_GLIDERS, ETHER_PATTERN } from '../engine/rule110';
import { GliderStructure } from '../types';

interface GliderGalleryProps {
  initialTab?: 'circuits' | 'decision-tables' | 'tutorial' | 'overview' | 'gliders';
}

export const GliderGallery: React.FC<GliderGalleryProps> = ({ initialTab = 'circuits' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tutorial' | 'circuits' | 'decision-tables' | 'gliders'>(initialTab);
  const [selectedGlider, setSelectedGlider] = useState<GliderStructure>(RULE_110_GLIDERS[0]);
  const [selectedGate, setSelectedGate] = useState<'NOT' | 'AND' | 'OR' | 'XOR' | 'HALF_ADDER' | 'FULL_ADDER'>('FULL_ADDER');
  const [exportedCsv, setExportedCsv] = useState(false);

  // Interactive Live Circuit Inputs
  const [circuitInA, setCircuitInA] = useState<number>(1);
  const [circuitInB, setCircuitInB] = useState<number>(1);
  const [circuitInCin, setCircuitInCin] = useState<number>(0);

  // Compute live circuit outputs
  const liveNotOut = circuitInA === 1 ? 0 : 1;
  const liveAndOut = (circuitInA === 1 && circuitInB === 1) ? 1 : 0;
  const liveOrOut = (circuitInA === 1 || circuitInB === 1) ? 1 : 0;
  const liveXorOut = ((circuitInA === 1 && circuitInB === 0) || (circuitInA === 0 && circuitInB === 1)) ? 1 : 0;
  const liveHaSum = liveXorOut;
  const liveHaCarry = liveAndOut;
  const liveFaSum = (circuitInA ^ circuitInB ^ circuitInCin) & 1;
  const liveFaCout = ((circuitInA & circuitInB) | (circuitInA & circuitInCin) | (circuitInB & circuitInCin)) & 1;

  const gateDescriptions = {
    NOT: {
      title: 'Inverter (NOT Gate)',
      collisionMechanism: 'A signal glider (e.g. Glider B) collides with a periodic stationary barrier (Glider C/F). If an input pulse is present, it annihilates the barrier, blocking transmission. If absent, the barrier reflects a regular clock pulse forward.',
      truthTable: [
        { in: '0', out: '1', note: 'Clock pulse passes unhindered' },
        { in: '1', out: '0', note: 'Input glider destroys carrier pulse' },
      ],
      sheetsFormula: '=IF(A2=1, 0, 1)',
    },
    AND: {
      title: 'Conjunction (AND Gate)',
      collisionMechanism: 'Two glider streams (Trajectory A and Trajectory B) intersect at a precise spatial coordinate. A third resultant glider (Glider E) is generated only when both reactant gliders collide at the exact phase.',
      truthTable: [
        { in: '0, 0', out: '0', note: 'No collision occurs' },
        { in: '0, 1', out: '0', note: 'Single pulse passes or dissipates' },
        { in: '1, 0', out: '0', note: 'Single pulse passes or dissipates' },
        { in: '1, 1', out: '1', note: 'Constructive collision spawns output glider' },
      ],
      sheetsFormula: '=IF(AND(A2=1, B2=1), 1, 0)',
    },
    OR: {
      title: 'Disjunction (OR Gate)',
      collisionMechanism: 'Two parallel signal conduits merge into a common routing channel. Either glider pulse propagates forward to excite the downstream lane.',
      truthTable: [
        { in: '0, 0', out: '0', note: 'Channel remains quiescent Ether' },
        { in: '0, 1', out: '1', note: 'Pulse from Input B propagates' },
        { in: '1, 0', out: '1', note: 'Pulse from Input A propagates' },
        { in: '1, 1', out: '1', note: 'Coincident pulses merge' },
      ],
      sheetsFormula: '=IF(OR(A2=1, B2=1), 1, 0)',
    },
    XOR: {
      title: 'Exclusive OR (XOR Gate)',
      collisionMechanism: 'Glider collision where equal coincident pulses destructively interfere, but an isolated single pulse reflects cleanly into the output channel. This forms the foundation of the binary sum.',
      truthTable: [
        { in: '0, 0', out: '0', note: 'Quiescent Ether' },
        { in: '0, 1', out: '1', note: 'B pulse reflects through' },
        { in: '1, 0', out: '1', note: 'A pulse reflects through' },
        { in: '1, 1', out: '0', note: 'Destructive collision annihilates both' },
      ],
      sheetsFormula: '=IF(OR(AND(A2=1,B2=0), AND(A2=0,B2=1)), 1, 0)',
    },
    HALF_ADDER: {
      title: 'Half-Adder (Sum + Carry)',
      collisionMechanism: 'A dual-trajectory collision junction that concurrently yields: (1) an XOR output stream representing the bit Sum (A ⊕ B), and (2) an AND output stream representing the Carry (A ∧ B).',
      truthTable: [
        { in: '0, 0', out: 'Sum=0, Carry=0', note: 'No pulses' },
        { in: '0, 1', out: 'Sum=1, Carry=0', note: 'B pulse transmitted to Sum' },
        { in: '1, 0', out: 'Sum=1, Carry=0', note: 'A pulse transmitted to Sum' },
        { in: '1, 1', out: 'Sum=0, Carry=1', note: 'Collision annihilates Sum and spawns Carry' },
      ],
      sheetsFormula: 'Sum: =XOR(A2, B2) · Carry: =AND(A2, B2)',
    },
    FULL_ADDER: {
      title: 'Full-Adder (Sum + Carry Propagation)',
      collisionMechanism: 'Two cascaded half-adder collision stages with an OR-merge junction for carry-out (Cout = (A ∧ B) ∨ (Cin ∧ (A ⊕ B))). Allows arbitrary bit chaining.',
      truthTable: [
        { in: '0, 0, 0', out: 'Sum=0, Cout=0', note: 'Quiescent' },
        { in: '1, 0, 0', out: 'Sum=1, Cout=0', note: 'Single pulse' },
        { in: '1, 1, 0', out: 'Sum=0, Cout=1', note: 'First stage carry' },
        { in: '1, 1, 1', out: 'Sum=1, Cout=1', note: 'Both sum and carry generated' },
      ],
      sheetsFormula: 'Sum: =XOR(A2, B2, Cin) · Cout: =OR(AND(A2,B2), AND(A2,Cin), AND(B2,Cin))',
    },
  };

  const activeGateInfo = gateDescriptions[selectedGate];

  const handleExportDecisionTablesCsv = () => {
    const lines = [
      '# SECTION 1: RULE 110 NEIGHBORHOOD TRANSITION DECISION TABLE',
      'Left_Neighbor,Center_Cell,Right_Neighbor,Next_Center_State,Binary_Code,Formula_Behavior',
      '1,1,1,0,7,Annihilates (quiescent)',
      '1,1,0,1,6,Propagates active left flank',
      '1,0,1,1,5,Constructive collision wave',
      '1,0,0,0,4,Quiescent Ether background',
      '0,1,1,1,3,Propagates active right flank',
      '0,1,0,1,2,Sustains periodic oscillator pulse',
      '0,0,1,1,1,Spawns leading wavefront edge',
      '0,0,0,0,0,Quiescent vacuum / no energy',
      '',
      '# SECTION 2: ALU CONTROL DECODER DECISION MATRIX',
      'Opcode,Mnemonic,Invert_B,Initial_Cin,Shift_Active,Clock_Ticks,Micro_Action',
      '000,ADD,0,0,0,8,Ripple carry addition across 8 bit lanes',
      '001,SUB,1,1,0,8,Two complement: Bitwise NOT(B) + Cin=1',
      '010,MUL,0,0,1,16,8 cycles of conditional add + right shift',
      '011,DIV,Trial,Trial,1,8,Restoring division: Trial subtract + restore',
      '100,AND,0,0,0,1,Single cycle parallel bitwise AND',
      '101,OR,0,0,0,1,Single cycle parallel bitwise OR',
      '110,XOR,0,0,0,1,Single cycle parallel bitwise XOR',
      '111,NOT,1,0,0,1,Bitwise 1s complement inversion of Operand A',
      '',
      '# SECTION 3: FULL ADDER TRUTH & DECISION TABLE',
      'A,B,Cin,Sum,Cout,Karnaugh_Sum_Term,Karnaugh_Cout_Term',
      '0,0,0,0,0,0,0',
      '0,0,1,1,0,Cin,0',
      '0,1,0,1,0,B,0',
      '0,1,1,0,1,0,B AND Cin',
      '1,0,0,1,0,A,0',
      '1,0,1,0,1,0,A AND Cin',
      '1,1,0,0,1,0,A AND B',
      '1,1,1,1,1,A AND B AND Cin,Majority Gate True',
      '',
      '# SECTION 4: 7-SEGMENT BCD DECODER DECISION TABLE',
      'Digit,BCD_b3,BCD_b2,BCD_b1,BCD_b0,Seg_A,Seg_B,Seg_C,Seg_D,Seg_E,Seg_F,Seg_G',
      '0,0,0,0,0,1,1,1,1,1,1,0',
      '1,0,0,0,1,0,1,1,0,0,0,0',
      '2,0,0,1,0,1,1,0,1,1,0,1',
      '3,0,0,1,1,1,1,1,1,0,0,1',
      '4,0,1,0,0,0,1,1,0,0,1,1',
      '5,0,1,0,1,1,0,1,1,0,1,1',
      '6,0,1,1,0,1,0,1,1,1,1,1',
      '7,0,1,1,1,1,1,1,0,0,0,0',
      '8,1,0,0,0,1,1,1,1,1,1,1',
      '9,1,0,0,1,1,1,1,1,0,1,1',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Commodore110_Logic_Decision_Tables.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportedCsv(true);
    setTimeout(() => setExportedCsv(false), 2500);
  };

  return (
    <div className="bg-[#181a20] rounded-xl border border-slate-700/70 p-5 shadow-xl font-mono">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              LOGIC GATE TUTORIAL, CA OVERVIEW & CIRCUITS
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              Interactive Hardware Lab
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Discover how discrete cellular interactions evolve into logic gates, circuit schematics, and an 8-bit mechanical ALU.
          </p>
        </div>

        {/* Primary Tab Selector */}
        <div className="flex flex-wrap items-center gap-1 bg-[#232630] p-1 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('circuits')}
            className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
              activeTab === 'circuits' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CIRCUITS
          </button>
          <button
            onClick={() => setActiveTab('decision-tables')}
            className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
              activeTab === 'decision-tables' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DECISION TABLES
          </button>
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
              activeTab === 'tutorial' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            TUTORIAL
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
              activeTab === 'overview' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CA OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab('gliders')}
            className={`px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
              activeTab === 'gliders' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            COOK GLIDERS
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: INTERACTIVE GATE CIRCUIT DIAGRAMS                        */}
      {/* ============================================================== */}
      {activeTab === 'circuits' && (
        <div className="space-y-6">
          {/* Interactive Test Bench Controls */}
          <div className="bg-[#121316] p-4 rounded-xl border border-slate-700/70 flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              LIVE LOGIC INPUT BENCH (Click to toggle input lines):
            </span>
            <div className="flex items-center gap-4">
              {/* Input A */}
              <button
                onClick={() => setCircuitInA(circuitInA === 1 ? 0 : 1)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-bold cursor-pointer transition-all ${
                  circuitInA === 1 
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)]' 
                    : 'bg-[#1e2026] border-slate-700 text-slate-500'
                }`}
              >
                <span>INPUT A:</span>
                <span className="text-sm font-black">{circuitInA}</span>
              </button>

              {/* Input B */}
              <button
                onClick={() => setCircuitInB(circuitInB === 1 ? 0 : 1)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-bold cursor-pointer transition-all ${
                  circuitInB === 1 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                    : 'bg-[#1e2026] border-slate-700 text-slate-500'
                }`}
              >
                <span>INPUT B:</span>
                <span className="text-sm font-black">{circuitInB}</span>
              </button>

              {/* Carry In */}
              <button
                onClick={() => setCircuitInCin(circuitInCin === 1 ? 0 : 1)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-bold cursor-pointer transition-all ${
                  circuitInCin === 1 
                    ? 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_8px_rgba(239,68,68,0.4)]' 
                    : 'bg-[#1e2026] border-slate-700 text-slate-500'
                }`}
              >
                <span>CARRY IN (Cin):</span>
                <span className="text-sm font-black">{circuitInCin}</span>
              </button>
            </div>
          </div>

          {/* Interactive Circuit Schematic SVG */}
          <div className="bg-[#0b0f17] p-6 rounded-xl border border-slate-800 shadow-inner">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
              <span>1-BIT FULL-ADDER DISCRETE SCHEMATIC (LIVE WIRED)</span>
              <span className="text-xs text-amber-400 font-normal">
                Sum = A ⊕ B ⊕ Cin &middot; Cout = (A ∧ B) ∨ (Cin ∧ (A ⊕ B))
              </span>
            </h3>

            <div className="w-full overflow-x-auto">
              <svg viewBox="0 0 800 280" className="w-full h-auto min-w-[700px]">
                {/* Wire lines */}
                {/* A Bus */}
                <line x1="60" y1="60" x2="220" y2="60" stroke={circuitInA ? '#f59e0b' : '#334155'} strokeWidth="3"/>
                <line x1="120" y1="60" x2="120" y2="200" stroke={circuitInA ? '#f59e0b' : '#334155'} strokeWidth="3"/>
                <line x1="120" y1="200" x2="220" y2="200" stroke={circuitInA ? '#f59e0b' : '#334155'} strokeWidth="3"/>

                {/* B Bus */}
                <line x1="60" y1="100" x2="220" y2="100" stroke={circuitInB ? '#06b6d4' : '#334155'} strokeWidth="3"/>
                <line x1="140" y1="100" x2="140" y2="230" stroke={circuitInB ? '#06b6d4' : '#334155'} strokeWidth="3"/>
                <line x1="140" y1="230" x2="220" y2="230" stroke={circuitInB ? '#06b6d4' : '#334155'} strokeWidth="3"/>

                {/* Stage 1 XOR Gate */}
                <rect x="220" y="50" width="80" height="60" rx="6" fill="#1e293b" stroke="#60a5fa" strokeWidth="2"/>
                <text x="260" y="85" fill="#e2e8f0" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">XOR 1</text>
                
                {/* XOR 1 output wire */}
                <line x1="300" y1="80" x2="420" y2="80" stroke={liveXorOut ? '#10b981' : '#334155'} strokeWidth="3"/>
                <line x1="360" y1="80" x2="360" y2="150" stroke={liveXorOut ? '#10b981' : '#334155'} strokeWidth="3"/>
                <line x1="360" y1="150" x2="420" y2="150" stroke={liveXorOut ? '#10b981' : '#334155'} strokeWidth="3"/>

                {/* Cin wire */}
                <line x1="60" y1="120" x2="420" y2="120" stroke={circuitInCin ? '#ef4444' : '#334155'} strokeWidth="3"/>
                <line x1="390" y1="120" x2="390" y2="170" stroke={circuitInCin ? '#ef4444' : '#334155'} strokeWidth="3"/>
                <line x1="390" y1="170" x2="420" y2="170" stroke={circuitInCin ? '#ef4444' : '#334155'} strokeWidth="3"/>

                {/* Stage 2 XOR Gate (Sum Output) */}
                <rect x="420" y="70" width="80" height="60" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="2"/>
                <text x="460" y="105" fill="#e2e8f0" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">XOR 2</text>
                <line x1="500" y1="100" x2="680" y2="100" stroke={liveFaSum ? '#10b981' : '#334155'} strokeWidth="4"/>
                <circle cx="680" cy="100" r="14" fill={liveFaSum ? '#10b981' : '#1e293b'} stroke="#6ee7b7" strokeWidth="2"/>
                <text x="680" y="105" fill="#022c22" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">{liveFaSum}</text>
                <text x="710" y="105" fill="#10b981" font-family="monospace" font-size="13" font-weight="bold">SUM OUT</text>

                {/* Stage 1 AND Gate (A & B) */}
                <rect x="220" y="190" width="80" height="55" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2"/>
                <text x="260" y="222" fill="#e2e8f0" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">AND 1</text>
                <line x1="300" y1="217" x2="560" y2="217" stroke={liveAndOut ? '#f59e0b' : '#334155'} strokeWidth="3"/>

                {/* Stage 2 AND Gate (Cin & (A ⊕ B)) */}
                <rect x="420" y="140" width="80" height="55" rx="6" fill="#1e293b" stroke="#ef4444" strokeWidth="2"/>
                <text x="460" y="172" fill="#e2e8f0" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">AND 2</text>
                <line x1="500" y1="167" x2="560" y2="167" stroke={(circuitInCin && liveXorOut) ? '#ef4444' : '#334155'} strokeWidth="3"/>

                {/* Final OR Gate for Cout */}
                <rect x="560" y="160" width="80" height="70" rx="6" fill="#1e293b" stroke="#ef4444" strokeWidth="2"/>
                <text x="600" y="200" fill="#e2e8f0" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle">OR</text>
                <line x1="640" y1="195" x2="680" y2="195" stroke={liveFaCout ? '#ef4444' : '#334155'} strokeWidth="4"/>
                <circle cx="680" cy="195" r="14" fill={liveFaCout ? '#ef4444' : '#1e293b'} stroke="#fca5a5" strokeWidth="2"/>
                <text x="680" y="200" fill="#450a0a" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">{liveFaCout}</text>
                <text x="710" y="200" fill="#ef4444" font-family="monospace" font-size="13" font-weight="bold">COUT</text>

                {/* Input labels on left */}
                <text x="20" y="65" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold">A={circuitInA}</text>
                <text x="20" y="105" fill="#06b6d4" font-family="monospace" font-size="12" font-weight="bold">B={circuitInB}</text>
                <text x="10" y="125" fill="#ef4444" font-family="monospace" font-size="11" font-weight="bold">Cin={circuitInCin}</text>
              </svg>
            </div>
          </div>

          {/* 8-Bit Ripple Carry Chain Architecture Box */}
          <div className="bg-[#121316] p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              8-BIT RIPPLE-CARRY FULL-ADDER PIPELINE (8 Cascaded Slices):
            </h4>
            <div className="grid grid-cols-8 gap-2 text-center text-xs">
              {[7, 6, 5, 4, 3, 2, 1, 0].map((bit, idx) => (
                <div key={bit} className="p-2 rounded bg-[#1b1d24] border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">SLICE {bit}</span>
                  <span className="text-xs font-bold text-cyan-400 block my-1">FA-{bit}</span>
                  <span className="text-[9px] text-slate-500 block">
                    {idx < 7 ? `C${bit} &rarr; C${bit+1}` : 'Cout (Overflow)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: DECISION TABLES & KARNAUGH MINIMIZATION                 */}
      {/* ============================================================== */}
      {activeTab === 'decision-tables' && (
        <div className="space-y-6">
          {/* Top Banner with CSV Export */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121316] p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Table className="w-4 h-4 text-amber-500" />
                LOGICAL DECISION TABLES & MICROCODE MATRICES
              </h3>
              <p className="text-xs text-slate-400">
                Deterministic truth tables, Karnaugh maps, and state transition matrices powering our first-principles ALU.
              </p>
            </div>
            <button
              onClick={handleExportDecisionTablesCsv}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all border cursor-pointer ${
                exportedCsv 
                  ? 'bg-emerald-800 text-white border-emerald-500' 
                  : 'bg-[#222530] hover:bg-[#2d3140] text-emerald-400 border-emerald-500/40'
              }`}
              title="Download all 4 decision tables as structured CSV"
            >
              {exportedCsv ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{exportedCsv ? 'EXPORTED CSV!' : 'EXPORT TABLES CSV'}</span>
            </button>
          </div>

          {/* Table 0: Rule 110 Neighborhood Transition Decision Table */}
          <div className="bg-[#121316] p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
              <Grid className="w-4 h-4 text-cyan-500" />
              RULE 110 LOCAL 3-CELL NEIGHBORHOOD DECISION TABLE
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              The fundamental universal cellular automaton law: maps all 8 three-cell neighborhoods [p, q, r] to the next central state q'.
              Decimal 110 = Binary <strong>01101110</strong>.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#1e2026] text-slate-300 border-b border-slate-700">
                    <th className="py-2 px-3">Neighborhood (p,q,r)</th>
                    <th className="py-2 px-3">Bit Code</th>
                    <th className="py-2 px-3">Triad Pattern</th>
                    <th className="py-2 px-3 text-amber-400 font-bold">Next State (q')</th>
                    <th className="py-2 px-3">Qualitative Micro-Dynamical Role</th>
                    <th className="py-2 px-3">Google Sheets Logic Formula</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {[
                    ['1, 1, 1', '7', '■ ■ ■', '0', 'Destructive collision / annihilates dense clusters', '=IF(AND(A=1,B=1,C=1),0,...)'],
                    ['1, 1, 0', '6', '■ ■ □', '1', 'Propagates active left flank wavefront', '=IF(AND(A=1,B=1,C=0),1,...)'],
                    ['1, 0, 1', '5', '■ □ ■', '1', 'Constructive collision between separated gliders', '=IF(AND(A=1,B=0,C=1),1,...)'],
                    ['1, 0, 0', '4', '■ □ □', '0', 'Quiescent Ether background space', '=IF(AND(A=1,B=0,C=0),0,...)'],
                    ['0, 1, 1', '3', '□ ■ ■', '1', 'Propagates active right flank wavefront', '=IF(AND(A=0,B=1,C=1),1,...)'],
                    ['0, 1, 0', '2', '□ ■ □', '1', 'Sustains periodic localized particle core', '=IF(AND(A=0,B=1,C=0),1,...)'],
                    ['0, 0, 1', '1', '□ □ ■', '1', 'Spawns leading edge of rightward glider', '=IF(AND(A=0,B=0,C=1),1,...)'],
                    ['0, 0, 0', '0', '□ □ □', '0', 'Quiescent vacuum / no energy', '=IF(AND(A=0,B=0,C=0),0,...)'],
                  ].map(([neigh, code, triad, next, role, formula], idx) => (
                    <tr key={code} className={`hover:bg-slate-800/40 ${next === '1' ? 'bg-amber-500/5' : ''}`}>
                      <td className="py-2 px-3 font-bold text-slate-200">[{neigh}]</td>
                      <td className="py-2 px-3 text-cyan-400">{code}</td>
                      <td className="py-2 px-3 tracking-widest text-slate-300">{triad}</td>
                      <td className={`py-2 px-3 font-black text-sm ${next === '1' ? 'text-amber-400' : 'text-slate-600'}`}>{next}</td>
                      <td className="py-2 px-3 text-slate-300 font-sans text-[11px]">{role}</td>
                      <td className="py-2 px-3 text-slate-500 text-[10px]">{formula}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 1: ALU Opcode Decoder Decision Table */}
          <div className="bg-[#121316] p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
              <Table className="w-4 h-4 text-amber-500" />
              ALU OPCODE DECODER DECISION TABLE
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Maps high-level arithmetic operations to discrete mechanical control lines without mathematical functions.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#1e2026] text-slate-300 border-b border-slate-700">
                    <th className="py-2 px-3 font-bold">Opcode</th>
                    <th className="py-2 px-3 font-bold">Mnemonic</th>
                    <th className="py-2 px-3 font-bold">Invert B</th>
                    <th className="py-2 px-3 font-bold">Initial Cin</th>
                    <th className="py-2 px-3 font-bold">Shift Active</th>
                    <th className="py-2 px-3 font-bold">Clock Ticks</th>
                    <th className="py-2 px-3 font-bold">Micro-Action Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-cyan-400 font-bold">000</td>
                    <td className="py-2 px-3 font-bold text-slate-200">ADD</td>
                    <td className="py-2 px-3 text-slate-400">0</td>
                    <td className="py-2 px-3 text-slate-400">0</td>
                    <td className="py-2 px-3 text-slate-400">0</td>
                    <td className="py-2 px-3 text-amber-300 font-bold">8</td>
                    <td className="py-2 px-3 text-slate-300">Ripple carry adder across all 8 bit lanes</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-cyan-400 font-bold">001</td>
                    <td className="py-2 px-3 font-bold text-slate-200">SUB</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">1</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">1</td>
                    <td className="py-2 px-3 text-slate-400">0</td>
                    <td className="py-2 px-3 text-amber-300 font-bold">8</td>
                    <td className="py-2 px-3 text-slate-300">Two's complement: Bitwise NOT(B) + Cin=1</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-cyan-400 font-bold">010</td>
                    <td className="py-2 px-3 font-bold text-slate-200">MUL</td>
                    <td className="py-2 px-3 text-slate-400">0</td>
                    <td className="py-2 px-3 text-slate-400">0</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">1</td>
                    <td className="py-2 px-3 text-amber-300 font-bold">16</td>
                    <td className="py-2 px-3 text-slate-300">8 cycles of conditional add + 1-bit right shift</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-cyan-400 font-bold">011</td>
                    <td className="py-2 px-3 font-bold text-slate-200">DIV</td>
                    <td className="py-2 px-3 text-slate-400">Trial</td>
                    <td className="py-2 px-3 text-slate-400">Trial</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">1</td>
                    <td className="py-2 px-3 text-amber-300 font-bold">8</td>
                    <td className="py-2 px-3 text-slate-300">Restoring division: Trial subtract + restore if borrow</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 text-cyan-400 font-bold">100</td>
                    <td className="py-2 px-3 font-bold text-slate-200">AND / OR / XOR</td>
                    <td className="py-2 px-3 text-slate-400">0</td>
                    <td className="py-2 px-3 text-slate-400">0</td>
                    <td className="py-2 px-3 text-slate-400">0</td>
                    <td className="py-2 px-3 text-amber-300 font-bold">1</td>
                    <td className="py-2 px-3 text-slate-300">Single-cycle parallel discrete bitwise logic bank</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Full-Adder Karnaugh Decision Matrix */}
          <div className="bg-[#121316] p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-cyan-400 mb-2 flex items-center gap-2">
              <Grid className="w-4 h-4 text-cyan-500" />
              FULL-ADDER TRUTH TABLE & KARNAUGH MINIMIZATION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#1e2026] text-slate-300 border-b border-slate-700">
                      <th className="py-1.5 px-2">A</th>
                      <th className="py-1.5 px-2">B</th>
                      <th className="py-1.5 px-2">Cin</th>
                      <th className="py-1.5 px-2 text-emerald-400">Sum</th>
                      <th className="py-1.5 px-2 text-red-400">Cout</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {[
                      [0,0,0, 0,0],
                      [0,0,1, 1,0],
                      [0,1,0, 1,0],
                      [0,1,1, 0,1],
                      [1,0,0, 1,0],
                      [1,0,1, 0,1],
                      [1,1,0, 0,1],
                      [1,1,1, 1,1],
                    ].map(([a,b,c,s,co], i) => (
                      <tr key={i} className="hover:bg-slate-800/30">
                        <td className="py-1 px-2">{a}</td>
                        <td className="py-1 px-2">{b}</td>
                        <td className="py-1 px-2">{c}</td>
                        <td className="py-1 px-2 font-bold text-emerald-400">{s}</td>
                        <td className="py-1 px-2 font-bold text-red-400">{co}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Karnaugh Equations */}
              <div className="bg-[#181a22] p-4 rounded-lg border border-slate-700 space-y-3">
                <div>
                  <span className="font-bold text-emerald-400 block mb-1">Sum Minimization (Odd Parity):</span>
                  <code className="text-slate-200 block text-[11px] bg-slate-900 p-2 rounded">
                    Sum = A ⊕ B ⊕ Cin
                  </code>
                </div>
                <div>
                  <span className="font-bold text-red-400 block mb-1">Carry Minimization (Majority Gate):</span>
                  <code className="text-slate-200 block text-[11px] bg-slate-900 p-2 rounded">
                    Cout = (A ∧ B) ∨ (A ∧ Cin) ∨ (B ∧ Cin)
                  </code>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Both boolean equations translate 1:1 into Google Sheets formulas without math functions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LOGIC GATE TUTORIAL (FIRST PRINCIPLES)                  */}
      {/* ============================================================== */}
      {activeTab === 'tutorial' && (
        <div className="space-y-4">
          <div className="bg-[#121316] p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-500" />
              INTERACTIVE FIRST-PRINCIPLES LOGIC TUTORIAL
            </h3>
            
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-lg bg-[#181a20] border-l-4 border-amber-500">
                <h4 className="font-bold text-slate-100 text-sm mb-1">Step 1: The Discarding of Modern Mathematical Shortcuts</h4>
                <p>
                  Modern computers treat arithmetic as instant primitive operations (e.g. <code className="text-amber-300">ADD R1, R2</code>). But at the physical level, silicon has no concept of the number 5 or the concept of addition. It has only discrete spatial states (high voltage / low voltage, or active / dead cells) that evolve over discrete clock ticks.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#181a20] border-l-4 border-cyan-500">
                <h4 className="font-bold text-slate-100 text-sm mb-1">Step 2: Synthesizing Logical Operations from Collision Mechanics</h4>
                <p>
                  In Rule 110, gliders act like localized physical particles moving across the periodic 14-cell Ether background.
                  When two gliders collide:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                  <li><strong className="text-slate-200">Constructive Collision (AND Gate)</strong>: A new glider is spawned only when both input gliders arrive simultaneously.</li>
                  <li><strong className="text-slate-200">Destructive Interference (XOR Gate)</strong>: Equal coincident pulses cancel each other out, while an isolated single pulse transmits cleanly.</li>
                  <li><strong className="text-slate-200">Barrier Interception (NOT Gate)</strong>: An input glider annihilates a stationary barrier, preventing clock carrier transmission.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-[#181a20] border-l-4 border-emerald-500">
                <h4 className="font-bold text-slate-100 text-sm mb-1">Step 3: Chaining Full-Adders into an 8-Bit Ripple Bus</h4>
                <p>
                  By taking the XOR output (Sum) and the AND output (Carry), we form a Half-Adder. Chaining two Half-Adders with an OR gate forms a Full-Adder capable of receiving a Carry-In.
                  Cascading 8 Full-Adders creates our 8-bit adder, which computes any sum from 0 to 255 within 8 clock cycles!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: CELLULAR AUTOMATA OVERVIEW (WOLFRAM & COOK)             */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-[#121316] p-5 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-500" />
              WOLFRAM'S 4 COMPLEXITY CLASSES & RULE 110 UNIVERSALITY
            </h3>
            
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              In 1983, Stephen Wolfram classified all 256 one-dimensional elementary cellular automata into 4 fundamental behavioral classes:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
              <div className="p-3 rounded-lg bg-[#181a22] border border-slate-800">
                <span className="font-bold text-slate-400 block mb-1">CLASS 1: Quiescent / Homogeneous</span>
                <p className="text-slate-400 text-[11px]">Evolves rapidly to a uniform state (all 0s or all 1s). Analogous to physical thermal death.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#181a22] border border-slate-800">
                <span className="font-bold text-slate-400 block mb-1">CLASS 2: Simple Periodic</span>
                <p className="text-slate-400 text-[11px]">Evolves into simple separated periodic structures or stripes. Analogous to crystal lattice formation.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#181a22] border border-slate-800">
                <span className="font-bold text-slate-400 block mb-1">CLASS 3: Chaotic / Pseudo-Random</span>
                <p className="text-slate-400 text-[11px]">Yields aperiodic chaotic patterns (e.g. Rule 30). Used as random number generators.</p>
              </div>
              <div className="p-3 rounded-lg bg-[#181a22] border-2 border-amber-500/60 shadow">
                <span className="font-bold text-amber-300 block mb-1">CLASS 4: Complex / Universal (RULE 110)</span>
                <p className="text-amber-200/90 text-[11px]">Generates localized propagating structures (gliders) that interact in complex ways capable of universal Turing computation.</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#151720] border border-slate-700 text-xs text-slate-300 leading-relaxed">
              <strong className="text-slate-100 block mb-1">Matthew Cook's Universality Proof (2004):</strong>
              Cook proved that Rule 110 is Turing-complete by showing how its glider structures can simulate any Cyclic Tag System, which in turn can simulate a 2-tag system, Turing machine, and modern microprocessor.
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: MATTHEW COOK'S CANONICAL GLIDERS CATALOG                */}
      {/* ============================================================== */}
      {activeTab === 'gliders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            {RULE_110_GLIDERS.map((glider) => (
              <button
                key={glider.id}
                onClick={() => setSelectedGlider(glider)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedGlider.id === glider.id
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                    : 'bg-[#181920] border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <span className="text-xs font-bold text-slate-200 block">{glider.name}</span>
                <span className="text-[10px] text-cyan-400 block mt-0.5">Speed: {glider.speed}</span>
                <span className="text-[10px] text-slate-500 block">Period: {glider.period}</span>
              </button>
            ))}
          </div>

          <div className="bg-[#181920] p-4 rounded-lg border border-slate-800 flex flex-col md:flex-row gap-5 items-start">
            <div className="p-3 bg-[#0d0e12] rounded border border-slate-800 shrink-0">
              <span className="text-[10px] text-slate-400 block mb-2">Spacetime Footprint:</span>
              <div className="flex flex-col gap-1">
                {selectedGlider.matrix.map((row: number[], rIdx: number) => (
                  <div key={rIdx} className="flex gap-1">
                    {row.map((val: number, cIdx: number) => (
                      <span
                        key={cIdx}
                        className={`w-3.5 h-3.5 rounded-xs ${
                          val ? 'bg-cyan-400 shadow-[0_0_4px_rgba(6,182,212,0.8)]' : 'bg-slate-800/40'
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 text-xs">
              <h4 className="text-sm font-bold text-cyan-300 mb-1">
                {selectedGlider.name} &bull; <span className="text-slate-400 font-normal">Binary: {selectedGlider.pattern}</span>
              </h4>
              <p className="text-slate-300 leading-relaxed mb-3">
                {selectedGlider.description}
              </p>
              <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] text-amber-300">
                <strong>Architectural Role in ALU</strong>: {selectedGlider.logicalRole}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
