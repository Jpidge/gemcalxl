/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, 
  Cpu, 
  Grid, 
  BookOpen, 
  Sparkles, 
  Layers, 
  Binary, 
  RefreshCw,
  ExternalLink,
  Flame,
  Activity,
  GitFork,
  Table,
  Tv,
  Compass,
  Download
} from 'lucide-react';
import { OperationType, DisplayMode, ViewTab, AluExecutionResult } from './types';
import { runAluOperation } from './engine/mechanicalAlu';
import { VintageCalculatorConsole } from './components/VintageCalculatorConsole';
import { AluStage } from './components/AluStage';
import { SpreadsheetMatrixView } from './components/SpreadsheetMatrixView';
import { DoubleDabbleView } from './components/DoubleDabbleView';
import { GliderGallery } from './components/GliderGallery';
import { AcademicProspectus } from './components/AcademicProspectus';
import { BlueprintStudio } from './components/BlueprintStudio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('calculator');
  const [operandA, setOperandA] = useState<number>(42);
  const [operandB, setOperandB] = useState<number>(27);
  const [operation, setOperation] = useState<OperationType>('ADD');
  const [clockStep, setClockStep] = useState<number>(8);
  const [isClockRunning, setIsClockRunning] = useState<boolean>(false);
  const [clockHz, setClockHz] = useState<number>(4);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('vintage-led');
  const [isGlobalCrt, setIsGlobalCrt] = useState<boolean>(true);

  // Compute ALU Result reactively from first principles
  const aluResult: AluExecutionResult = useMemo(() => {
    return runAluOperation(operation, operandA, operandB);
  }, [operation, operandA, operandB]);

  // Adjust clock step if out of bounds for the current operation
  useEffect(() => {
    setClockStep(aluResult.totalClockTicks);
  }, [aluResult.totalClockTicks, operation, operandA, operandB]);

  // Clock Sequencer Loop
  useEffect(() => {
    if (!isClockRunning) return;

    const intervalMs = Math.max(50, Math.floor(1000 / clockHz));
    const timer = setInterval(() => {
      setClockStep((prev) => {
        if (prev >= aluResult.totalClockTicks) {
          setIsClockRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isClockRunning, clockHz, aluResult.totalClockTicks]);

  const handleToggleClock = useCallback(() => {
    if (clockStep >= aluResult.totalClockTicks) {
      setClockStep(0);
      setIsClockRunning(true);
    } else {
      setIsClockRunning((r) => !r);
    }
  }, [clockStep, aluResult.totalClockTicks]);

  const handleStepClock = useCallback(() => {
    setClockStep((prev) => Math.min(prev + 1, aluResult.totalClockTicks));
  }, [aluResult.totalClockTicks]);

  const handleResetClock = useCallback(() => {
    setIsClockRunning(false);
    setClockStep(0);
  }, []);

  return (
    <div className={`min-h-screen bg-[#111317] text-slate-100 flex flex-col font-sans selection:bg-amber-600/30 selection:text-amber-200 ${
      isGlobalCrt ? 'app-crt-mode' : ''
    }`}>
      {/* Universal Top Bar Contract: 3 Zones (Wordmark, Nav Links, Primary Actions) */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-[#16181f]/95 backdrop-blur sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setCurrentTab('calculator')} 
            className="font-mono font-black text-xl tracking-tight text-slate-100 flex items-center gap-1.5 cursor-pointer text-left"
          >
            <span className="text-red-500 font-serif">C=</span> COMMODORE 110
          </button>
          <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
            &bull; Rule 110 First-Principles ALU
          </span>
        </div>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-mono font-medium text-slate-400">
          <button
            onClick={() => setCurrentTab('calculator')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'calculator' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            Console
          </button>
          <button
            onClick={() => setCurrentTab('canvas-stage')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'canvas-stage' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            Spacetime & Heatmap
          </button>
          <button
            onClick={() => setCurrentTab('signal-history')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'signal-history' ? 'text-cyan-400 font-bold border-b-2 border-cyan-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            Signal History
          </button>
          <button
            onClick={() => setCurrentTab('logic-tutorial')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'logic-tutorial' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            Logic Tutorial
          </button>
          <button
            onClick={() => setCurrentTab('circuit-diagrams')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'circuit-diagrams' ? 'text-cyan-400 font-bold border-b-2 border-cyan-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            Circuits
          </button>
          <button
            onClick={() => setCurrentTab('decision-tables')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'decision-tables' ? 'text-emerald-400 font-bold border-b-2 border-emerald-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            Decision Tables
          </button>
          <button
            onClick={() => setCurrentTab('ca-overview')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'ca-overview' ? 'text-rose-400 font-bold border-b-2 border-rose-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            CA Overview
          </button>
          <button
            onClick={() => setCurrentTab('sheets-matrix')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'sheets-matrix' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            Sheets Matrix
          </button>
          <button
            onClick={() => setCurrentTab('double-dabble')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'double-dabble' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            Decimal BCD
          </button>
          <button
            onClick={() => setCurrentTab('prospectus')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'prospectus' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            Prospectus
          </button>
          <button
            onClick={() => setCurrentTab('blueprint-studio')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'blueprint-studio' ? 'text-amber-400 font-bold border-b-2 border-amber-500 pb-0.5' : 'hover:text-slate-200'
            }`}
          >
            Blueprints
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Download ZIP + CRT Toggle + Reset) */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {/* Direct Project ZIP Download Button */}
          <a
            href="/api/download-zip"
            download="commodore-110-cellular-calculator.zip"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)] border border-amber-400/50 cursor-pointer"
            title="Download full project source code archive as a ZIP file"
          >
            <Download className="w-3.5 h-3.5 text-white animate-bounce" />
            <span className="hidden sm:inline">PROJECT ZIP</span>
            <span className="sm:hidden">ZIP</span>
          </a>

          <button
            onClick={() => setIsGlobalCrt((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
              isGlobalCrt
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                : 'bg-[#22252e] border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle full-screen vintage CRT scanlines & phosphor monitor curvature"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>CRT: {isGlobalCrt ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => {
              setOperandA(42);
              setOperandB(27);
              setOperation('ADD');
              setClockStep(8);
              setIsClockRunning(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-[#22252e] hover:bg-[#2e323e] border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Reset to default operands"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </header>

      {/* Responsive Secondary Navigation Bar */}
      <div className="xl:hidden flex items-center gap-1 p-2 bg-[#16181f] border-b border-slate-800 overflow-x-auto text-xs font-mono">
        {(
          [
            ['calculator', 'Console'],
            ['canvas-stage', 'Spacetime & Heatmap'],
            ['signal-history', 'Signals'],
            ['logic-tutorial', 'Tutorial'],
            ['circuit-diagrams', 'Circuits'],
            ['decision-tables', 'Decision Tables'],
            ['ca-overview', 'CA Overview'],
            ['sheets-matrix', 'Sheets Matrix'],
            ['double-dabble', 'Decimal BCD'],
            ['prospectus', 'Prospectus'],
            ['blueprint-studio', 'Blueprints'],
          ] as const
        ).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab as ViewTab)}
            className={`px-3 py-1 rounded whitespace-nowrap transition-colors ${
              currentTab === tab ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {currentTab === 'calculator' && (
          <VintageCalculatorConsole
            operandA={operandA}
            operandB={operandB}
            operation={operation}
            aluResult={aluResult}
            clockStep={clockStep}
            isClockRunning={isClockRunning}
            clockHz={clockHz}
            displayMode={displayMode}
            onSetOperandA={setOperandA}
            onSetOperandB={setOperandB}
            onSetOperation={setOperation}
            onToggleClock={handleToggleClock}
            onStepClock={handleStepClock}
            onResetClock={handleResetClock}
            onSetClockHz={setClockHz}
            onSetDisplayMode={setDisplayMode}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'canvas-stage' && (
          <AluStage
            aluResult={aluResult}
            clockStep={clockStep}
            isClockRunning={isClockRunning}
            onToggleClock={handleToggleClock}
            onStepClock={handleStepClock}
            onResetClock={handleResetClock}
            initialMode="spacetime"
          />
        )}

        {currentTab === 'signal-history' && (
          <AluStage
            aluResult={aluResult}
            clockStep={clockStep}
            isClockRunning={isClockRunning}
            onToggleClock={handleToggleClock}
            onStepClock={handleStepClock}
            onResetClock={handleResetClock}
            initialMode="signals"
          />
        )}

        {currentTab === 'logic-tutorial' && (
          <GliderGallery initialTab="tutorial" />
        )}

        {currentTab === 'circuit-diagrams' && (
          <GliderGallery initialTab="circuits" />
        )}

        {currentTab === 'decision-tables' && (
          <GliderGallery initialTab="decision-tables" />
        )}

        {currentTab === 'ca-overview' && (
          <GliderGallery initialTab="overview" />
        )}

        {currentTab === 'glider-gates' && (
          <GliderGallery initialTab="gliders" />
        )}

        {currentTab === 'sheets-matrix' && (
          <SpreadsheetMatrixView aluResult={aluResult} />
        )}

        {currentTab === 'double-dabble' && (
          <DoubleDabbleView initialValue={aluResult.resultValue} />
        )}

        {currentTab === 'prospectus' && (
          <AcademicProspectus />
        )}

        {currentTab === 'blueprint-studio' && (
          <BlueprintStudio />
        )}
      </main>

      {/* Quiet Vintage Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs font-mono text-slate-500 bg-[#0e1014] flex flex-wrap items-center justify-between gap-3">
        <span>Commodore 110 &bull; Wolfram Rule 110 Cellular Automata Substrate &bull; Zero Built-In Mathematical Functions</span>
        <a 
          href="/api/download-zip" 
          download="commodore-110-cellular-calculator.zip"
          className="text-amber-400 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Project Source ZIP (.zip)</span>
        </a>
      </footer>
    </div>
  );
}
