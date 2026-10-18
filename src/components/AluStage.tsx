/**
 * Rule 110 Cellular Automata Spacetime Canvas Simulator
 * Features:
 * 1. Spacetime Discrete Lattice view with glider wavefronts.
 * 2. Cellular Heatmap & Computational Energy Dissipation density map.
 * 3. Digital Logic Signal History (Oscilloscope-style timing diagram).
 * 4. Signal History CSV Export.
 * 5. Vintage CRT screen curvature and scanlines toggle.
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Info, 
  Layers, 
  Sparkles,
  Flame,
  Activity,
  Download,
  Check
} from 'lucide-react';
import { AluExecutionResult, StageMode } from '../types';
import { generateSpacetime110, rule110Step, ETHER_PATTERN } from '../engine/rule110';
import { bitsToDecimal } from '../engine/mechanicalAlu';

interface AluStageProps {
  aluResult: AluExecutionResult;
  clockStep: number;
  isClockRunning: boolean;
  onToggleClock: () => void;
  onStepClock: () => void;
  onResetClock: () => void;
  initialMode?: StageMode;
}

export const AluStage: React.FC<AluStageProps> = ({
  aluResult,
  clockStep,
  isClockRunning,
  onToggleClock,
  onStepClock,
  onResetClock,
  initialMode = 'spacetime',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stageMode, setStageMode] = useState<StageMode>(initialMode);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCell, setHoverCell] = useState<{ x: number; t: number; val: number; l: number; c: number; r: number; energy?: number } | null>(null);
  const [palette, setPalette] = useState<'amber' | 'cyan' | 'ruby' | 'monochrome'>('amber');
  const [showGrid, setShowGrid] = useState(true);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [copiedCsv, setCopiedCsv] = useState(false);
  const [csvDownloadType, setCsvDownloadType] = useState<'signals' | 'spacetime' | 'heatmap'>('signals');

  const gridWidth = 96; // 96 spatial cells wide
  const totalRows = 96; // 96 time steps deep

  // Build the initial row encoding Register A, Register B, and carrier background
  const initialRow = useMemo(() => {
    const row = new Array(gridWidth).fill(0);
    // Fill with Ether background periodic pattern
    for (let i = 0; i < gridWidth; i++) {
      row[i] = ETHER_PATTERN[i % ETHER_PATTERN.length];
    }

    // Embed Register A bits across channels (cols 12..35)
    for (let bit = 0; bit < 8; bit++) {
      const bitVal = aluResult.bitsA[bit];
      const colStart = 12 + bit * 3;
      if (bitVal === 1) {
        row[colStart] = 1;
        row[colStart + 1] = 1;
      }
    }

    // Embed Register B bits across channels (cols 48..71)
    for (let bit = 0; bit < 8; bit++) {
      const bitVal = aluResult.bitsB[bit];
      const colStart = 48 + bit * 3;
      if (bitVal === 1) {
        row[colStart] = 1;
        row[colStart + 1] = 1;
      }
    }

    // Embed Carry / Operation carrier seed
    if (aluResult.operation === 'ADD' || aluResult.operation === 'SUB') {
      row[40] = 1;
      row[41] = 1;
      row[42] = 0;
      row[43] = 1;
    }

    return row;
  }, [aluResult.bitsA, aluResult.bitsB, aluResult.operation]);

  // Generate full spacetime matrix
  const spacetime = useMemo(() => {
    return generateSpacetime110(initialRow, totalRows, true);
  }, [initialRow]);

  // Compute Heatmap / Energy Dissipation Density Matrix
  const heatmapMatrix = useMemo(() => {
    const heat: number[][] = [];
    for (let t = 0; t < totalRows; t++) {
      const rowHeat = new Array(gridWidth).fill(0);
      for (let x = 0; x < gridWidth; x++) {
        // State transition energy: did this cell flip from previous time step?
        const curr = spacetime[t][x];
        const prev = t > 0 ? spacetime[t - 1][x] : curr;
        let score = curr !== prev ? 1.0 : 0.1;

        // Local neighborhood activity
        const left = x > 0 ? spacetime[t][x - 1] : spacetime[t][gridWidth - 1];
        const right = x < gridWidth - 1 ? spacetime[t][x + 1] : spacetime[t][0];
        if (left && right) score += 0.5;

        // Cumulative smoothing
        const prevHeat = t > 0 ? heat[t - 1][x] * 0.4 : 0;
        rowHeat[x] = Math.min(1.0, score * 0.6 + prevHeat);
      }
      heat.push(rowHeat);
    }
    return heat;
  }, [spacetime, gridWidth, totalRows]);

  // Current active time step bounded by clock step
  const activeTimeRow = Math.min(clockStep * 6, totalRows - 1);

  // Palette colors for standard spacetime
  const getPaletteColors = useCallback(() => {
    switch (palette) {
      case 'amber':
        return {
          live: '#F59E0B',
          dead: '#11141C',
          wavefront: '#EF4444',
          glow: 'rgba(245, 158, 11, 0.4)',
          gridLine: '#1E2433',
        };
      case 'cyan':
        return {
          live: '#06B6D4',
          dead: '#09151F',
          wavefront: '#F43F5E',
          glow: 'rgba(6, 182, 212, 0.4)',
          gridLine: '#142938',
        };
      case 'ruby':
        return {
          live: '#F43F5E',
          dead: '#180B10',
          wavefront: '#F59E0B',
          glow: 'rgba(244, 63, 94, 0.4)',
          gridLine: '#2E1520',
        };
      case 'monochrome':
        return {
          live: '#E2E8F0',
          dead: '#0F172A',
          wavefront: '#38BDF8',
          glow: 'rgba(226, 232, 240, 0.3)',
          gridLine: '#1E293B',
        };
    }
  }, [palette]);

  // Heatmap color generator
  const getHeatmapColor = useCallback((intensity: number) => {
    if (intensity < 0.15) return '#090b10';
    if (intensity < 0.35) return '#2e1065'; // violet
    if (intensity < 0.55) return '#991b1b'; // deep crimson
    if (intensity < 0.75) return '#ea580c'; // amber flame
    if (intensity < 0.90) return '#f59e0b'; // golden radiant
    return '#fef08a'; // white hot peak
  }, []);

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    const baseCellSize = Math.min(width / gridWidth, height / totalRows);
    const cellSize = baseCellSize;
    const colors = getPaletteColors();

    if (stageMode === 'spacetime') {
      // Render standard cellular spacetime
      for (let t = 0; t < totalRows; t++) {
        const isPastOrCurrent = t <= activeTimeRow;
        const isWavefront = t === activeTimeRow;

        for (let x = 0; x < gridWidth; x++) {
          const val = spacetime[t][x];
          const cellX = x * cellSize;
          const cellY = t * cellSize;

          if (val === 1) {
            ctx.fillStyle = isWavefront ? colors.wavefront : (isPastOrCurrent ? colors.live : '#4B5563');
            ctx.fillRect(cellX, cellY, cellSize, cellSize);
          } else {
            ctx.fillStyle = colors.dead;
            ctx.fillRect(cellX, cellY, cellSize, cellSize);
          }

          if (showGrid && cellSize >= 6) {
            ctx.strokeStyle = colors.gridLine;
            ctx.lineWidth = 0.5;
            ctx.strokeRect(cellX, cellY, cellSize, cellSize);
          }
        }

        if (isWavefront) {
          ctx.strokeStyle = colors.wavefront;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, t * cellSize + cellSize / 2);
          ctx.lineTo(gridWidth * cellSize, t * cellSize + cellSize / 2);
          ctx.stroke();
        }
      }
    } else if (stageMode === 'heatmap') {
      // Render Cellular Energy Dissipation Heatmap
      for (let t = 0; t < totalRows; t++) {
        for (let x = 0; x < gridWidth; x++) {
          const intensity = heatmapMatrix[t][x];
          const cellX = x * cellSize;
          const cellY = t * cellSize;
          ctx.fillStyle = getHeatmapColor(intensity);
          ctx.fillRect(cellX, cellY, cellSize, cellSize);

          if (showGrid && cellSize >= 6) {
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(cellX, cellY, cellSize, cellSize);
          }
        }
      }

      // Draw wavefront on heatmap
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, activeTimeRow * cellSize + cellSize / 2);
      ctx.lineTo(gridWidth * cellSize, activeTimeRow * cellSize + cellSize / 2);
      ctx.stroke();
    } else if (stageMode === 'signals') {
      // Digital Logic Analyzer Oscilloscope view rendered on canvas
      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = '#1a2234';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const totalSteps = aluResult.steps.length;
      const stepWidth = Math.max(45, (width - 140) / Math.max(1, totalSteps));

      // Channels to plot
      const channels = [
        { label: 'CLK PULSE', color: '#f59e0b', getVal: (step: number) => (step % 2 === 1 ? 1 : 0) },
        { label: 'CARRY / BORROW', color: '#ef4444', getVal: (step: number) => aluResult.steps[step]?.carryOut || 0 },
        { label: 'REG A [MSB b7]', color: '#f59e0b', getVal: () => aluResult.bitsA[0] },
        { label: 'REG B [MSB b7]', color: '#06b6d4', getVal: () => aluResult.bitsB[0] },
        { label: 'ACC [MSB b7]', color: '#10b981', getVal: (step: number) => aluResult.steps[step]?.accumulator[0] || 0 },
        { label: 'ACC [LSB b0]', color: '#38bdf8', getVal: (step: number) => aluResult.steps[step]?.accumulator[7] || 0 },
      ];

      channels.forEach((ch, chIdx) => {
        const baseY = 50 + chIdx * 65;
        const highY = baseY - 24;
        const lowY = baseY;

        // Channel label
        ctx.fillStyle = ch.color;
        ctx.font = '10px monospace';
        ctx.fillText(ch.label, 15, baseY - 8);

        // Reference low line
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(120, lowY);
        ctx.lineTo(width - 20, lowY);
        ctx.stroke();

        // Waveform trace
        ctx.strokeStyle = ch.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        let prevVal = ch.getVal(0);
        let currX = 120;
        ctx.moveTo(currX, prevVal === 1 ? highY : lowY);

        for (let s = 0; s < totalSteps; s++) {
          const val = ch.getVal(s);
          const y = val === 1 ? highY : lowY;

          // Vertical edge if transition occurred
          if (val !== prevVal) {
            ctx.lineTo(currX, y);
          }
          // Horizontal level
          currX += stepWidth;
          ctx.lineTo(currX, y);
          prevVal = val;
        }
        ctx.stroke();

        // Active clock step cursor
        const cursorX = 120 + clockStep * stepWidth;
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cursorX, 20);
        ctx.lineTo(cursorX, height - 20);
        ctx.stroke();
      });
    }

    // Top channel headers when in 2D lattice mode
    if (stageMode !== 'signals') {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '8px monospace';
      ctx.fillText('REG A (Bits 7..0)', 12 * cellSize, -4);
      ctx.fillText('REG B (Bits 7..0)', 48 * cellSize, -4);
      ctx.fillText('LOGIC JCT', 40 * cellSize, -4);
    }

    ctx.restore();
  }, [
    spacetime, 
    heatmapMatrix, 
    stageMode, 
    activeTimeRow, 
    clockStep, 
    aluResult, 
    zoom, 
    pan, 
    palette, 
    showGrid, 
    getPaletteColors, 
    getHeatmapColor, 
    gridWidth, 
    totalRows
  ]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }

    const canvas = canvasRef.current;
    if (!canvas || stageMode === 'signals') return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    const baseCellSize = Math.min(canvas.width / gridWidth, canvas.height / totalRows);
    const x = Math.floor(mouseX / baseCellSize);
    const t = Math.floor(mouseY / baseCellSize);

    if (x >= 0 && x < gridWidth && t >= 0 && t < totalRows) {
      const val = spacetime[t][x];
      const energy = heatmapMatrix[t][x];
      const prevT = t > 0 ? t - 1 : 0;
      const l = x > 0 ? spacetime[prevT][x - 1] : spacetime[prevT][gridWidth - 1];
      const c = spacetime[prevT][x];
      const r = x < gridWidth - 1 ? spacetime[prevT][x + 1] : spacetime[prevT][0];
      setHoverCell({ x, t, val, l, c, r, energy });
    } else {
      setHoverCell(null);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const downloadBlob = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Signal History, Heatmap, and Spacetime Matrix Export
  const handleExportCsv = () => {
    if (stageMode === 'signals') {
      const headers = [
        'Clock_Step',
        'Phase',
        'Operation',
        'RegA_Dec',
        'RegA_Bin',
        'RegB_Dec',
        'RegB_Bin',
        'Acc_Dec',
        'Acc_Bin',
        'Carry_Out',
        'Overflow',
        'MicroStep_Description'
      ];

      const rows = aluResult.steps.map((s) => {
        const aVal = aluResult.operandA;
        const bVal = aluResult.operandB;
        const accVal = bitsToDecimal(s.accumulator);
        const accBin = s.accumulator.join('');
        return [
          s.step,
          `"${s.phase}"`,
          aluResult.operation,
          aVal,
          `"${aluResult.bitsA.join('')}"`,
          bVal,
          `"${aluResult.bitsB.join('')}"`,
          accVal,
          `"${accBin}"`,
          s.carryOut,
          aluResult.overflow ? 1 : 0,
          `"${s.description.replace(/"/g, '""')}"`
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\n');
      downloadBlob(csvContent, `Commodore110_${aluResult.operation}_Signal_History.csv`);
    } else if (stageMode === 'heatmap') {
      const colHeaders = ['TimeStep_T', ...Array.from({ length: gridWidth }, (_, i) => `Cell_${i}`)];
      const rows = heatmapMatrix.map((row, t) => [t, ...row.map(v => v.toFixed(3))].join(','));
      const csvContent = [colHeaders.join(','), ...rows].join('\n');
      downloadBlob(csvContent, `Commodore110_Rule110_Heatmap_Density.csv`);
    } else {
      const colHeaders = ['TimeStep_T', ...Array.from({ length: gridWidth }, (_, i) => `Cell_${i}`)];
      const rows = spacetime.map((row, t) => [t, ...row].join(','));
      const csvContent = [colHeaders.join(','), ...rows].join('\n');
      downloadBlob(csvContent, `Commodore110_Rule110_Spacetime_Lattice.csv`);
    }
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  return (
    <div className="bg-[#181a20] rounded-xl border border-slate-700/70 p-5 shadow-xl font-mono">
      {/* Stage Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              RULE 110 COMPUTATIONAL LAB & LOGIC ANALYZER
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Spacetime &middot; Heatmap &middot; Timing Waveforms
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Watch discrete information wavefronts, cellular thermodynamic dissipation, and real-time digital logic signals.
          </p>
        </div>

        {/* View Mode Tabs: Spacetime, Heatmap, Signals */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-[#232630] p-1 rounded border border-slate-700">
            <button
              onClick={() => setStageMode('spacetime')}
              className={`flex items-center gap-1 px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                stageMode === 'spacetime' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>SPACETIME</span>
            </button>

            <button
              onClick={() => setStageMode('heatmap')}
              className={`flex items-center gap-1 px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                stageMode === 'heatmap' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>HEATMAP</span>
            </button>

            <button
              onClick={() => setStageMode('signals')}
              className={`flex items-center gap-1 px-3 py-1 rounded font-bold cursor-pointer transition-colors ${
                stageMode === 'signals' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-300" />
              <span>SIGNAL HISTORY</span>
            </button>
          </div>

          {/* CRT Screen Toggle */}
          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            className={`px-2.5 py-1 rounded border text-xs font-bold cursor-pointer ${
              crtEnabled ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' : 'bg-[#232630] border-slate-700 text-slate-400'
            }`}
          >
            CRT: {crtEnabled ? 'ON' : 'OFF'}
          </button>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#2a2d36] hover:bg-[#393d4a] text-emerald-400 border border-emerald-500/30 font-bold transition-colors cursor-pointer"
            title="Download full clock micro-step execution trace as CSV"
          >
            {copiedCsv ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            <span>{copiedCsv ? 'EXPORTED' : 'CSV EXPORT'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Viewport */}
      <div className={`relative rounded-xl overflow-hidden border-2 border-[#121316] bg-[#07090e] shadow-2xl mb-4 ${
        crtEnabled ? 'crt-screen' : ''
      }`}>
        <canvas
          ref={canvasRef}
          width={880}
          height={480}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-[480px] cursor-crosshair block"
        />

        {/* Viewport Zoom & Pan Overlay Toolbar (Only for 2D Spacetime / Heatmap) */}
        {stageMode !== 'signals' && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#1a1c22]/90 backdrop-blur p-1 rounded-md border border-slate-700 shadow-lg text-xs">
            <button
              onClick={() => setZoom((z) => Math.min(z * 1.25, 4))}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z / 1.25, 0.5))}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Active Stage Indicator Badge */}
        <div className="absolute top-3 left-3 bg-[#1a1c22]/90 backdrop-blur px-3 py-1.5 rounded-md border border-slate-700 text-xs shadow-md flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            {stageMode === 'spacetime' && `WAVEFRONT: T = ${activeTimeRow} / ${totalRows - 1}`}
            {stageMode === 'heatmap' && `THERMAL PEAK: ${activeTimeRow} / ${totalRows - 1}`}
            {stageMode === 'signals' && `LOGIC ANALYZER: STEP ${clockStep} / ${aluResult.totalClockTicks}`}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">
            OP: <strong className="text-cyan-400">{aluResult.operation}</strong> ({aluResult.operandA} & {aluResult.operandB})
          </span>
        </div>

        {/* Heatmap Legend */}
        {stageMode === 'heatmap' && (
          <div className="absolute bottom-3 left-3 bg-[#1a1c22]/90 backdrop-blur px-3 py-1.5 rounded-md border border-slate-700 text-[10px] flex items-center gap-2">
            <span className="text-slate-400">ENERGY DISSIPATION:</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-2 rounded-xs bg-[#090b10]" />
              <span className="w-3 h-2 rounded-xs bg-[#2e1065]" />
              <span className="w-3 h-2 rounded-xs bg-[#991b1b]" />
              <span className="w-3 h-2 rounded-xs bg-[#ea580c]" />
              <span className="w-3 h-2 rounded-xs bg-[#fef08a]" />
            </div>
            <span className="text-amber-300 font-bold">HOT (Landauer Flips)</span>
          </div>
        )}
      </div>

      {/* Control Strip & Inspector Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Playback Controls */}
        <div className="md:col-span-6 flex items-center gap-2 text-xs">
          <button
            onClick={onToggleClock}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-all shadow cursor-pointer ${
              isClockRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
          >
            {isClockRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isClockRunning ? 'PAUSE CLOCK' : 'START CLOCK'}</span>
          </button>

          <button
            onClick={onStepClock}
            disabled={isClockRunning}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#2b2d35] hover:bg-[#383b46] disabled:opacity-40 text-slate-200 border border-slate-600 cursor-pointer"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>STEP (+1)</span>
          </button>

          <button
            onClick={onResetClock}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#2b2d35] hover:bg-[#383b46] text-slate-400 hover:text-slate-200 border border-slate-600 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>
        </div>

        {/* Hovered Cell Inspector */}
        <div className="md:col-span-6 bg-[#131418] p-2.5 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
          {hoverCell && stageMode !== 'signals' ? (
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-bold">
                CELL ({hoverCell.x}, {hoverCell.t}) = {hoverCell.val}
              </span>
              <span className="text-slate-400">
                LCR: [{hoverCell.l},{hoverCell.c},{hoverCell.r}]
              </span>
              {hoverCell.energy !== undefined && (
                <span className="text-orange-300 text-[10px]">
                  Energy: {(hoverCell.energy * 100).toFixed(0)}%
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-500 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              {stageMode === 'signals' 
                ? 'Oscilloscope view tracking digital clock edges, carry propagation, and bus lines.'
                : 'Hover cursor over any cell in the spacetime matrix to inspect state & transition energy.'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
