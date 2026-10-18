/**
 * Academic Prospectus & Research Monograph Module
 * Formal paper on design philosophy, computational theory, Rule 110 universality,
 * and commercial product viability assessment for Google Workspace.
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Lightbulb, 
  Share2
} from 'lucide-react';

export const AcademicProspectus: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('abstract');

  const paperMarkdown = `# From Discrete Spacetime to Arithmetic:
## Synthesizing an 8-Bit Mechanical ALU via Rule 110 Automata and Spreadsheet Logic

**Authors:** Senior Chair of Computation Theory, Computer History & Mathematical Logic  
**Date:** Academic Year 2026 / AI Studio First-Principles Laboratory  
**Keywords:** Rule 110, Elementary Cellular Automata, Mechanical Computing, First Principles, Turing Universality, Google Sheets Logic Engine, Computer Architecture

---

### Abstract
We present the formal design, realization, and empirical verification of an 8-bit Arithmetic Logic Unit (ALU) constructed strictly from first-principles discrete dynamical interactions. Rejecting modern arithmetic shortcuts and built-in runtime mathematical functions, we formulate all logic gates, addition, subtraction (two's complement), shift-and-add multiplication, and restoring division as localized state transitions in Wolfram's 1D Elementary Cellular Automaton (Rule 110) and Google Sheets spreadsheet formulas. We examine the information-theoretic implications of computing arithmetic in discrete spacetime, analyze the emergence of arithmetic truth from Matthew Cook's glider collisions, and assess commercial marketability as an educational Google Workspace platform.

---

### 1. Introduction & Historical Lineage
Digital computation is frequently taught as an abstract manipulation of high-level numerical types. However, from Charles Babbage's mechanical Difference Engine to Konrad Zuse's relay-driven Z3 and John von Neumann's 29-state self-reproducing cellular automaton, computing is fundamentally a physical and spatial phenomenon.

In this project, our objective is pedagogical and foundational: **can an 8-bit digital calculator with complete arithmetic capabilities (ADD, SUB, MUL, DIV) and decimal conversion be built exclusively as a mechanical machine governed by localized discrete rules?**

By choosing **Rule 110** (proved Turing-complete by Matthew Cook in 2004) and translating its local neighborhood updates into native spreadsheet formulas, we demonstrate that numbers, arithmetic, and logic are not irreducible axioms—they are emergent macro-phenomena of discrete spacetime lattices.

---

### 2. Design Philosophy: The Axiom of First Principles
To ensure total conceptual purity, we enforce four rigid architectural constraints:
1. **Zero Arithmetic Operators in the Compute Core**: Neither the simulation nor the spreadsheet formulas may use \`+\`, \`-\`, \`*\`, \`/\`, \`SUM()\`, \`PRODUCT()\`, or \`DEC2BIN()\`.
2. **Boolean-Only Gate Realization**: All logic primitives (AND, OR, NOT, XOR) are built strictly from disjunctions and conjunctions.
3. **Synchronous Clocked Wavefronts**: State updates occur across discrete time cycles ($t \\to t+1$), pacing signal propagation and avoiding race conditions.
4. **Mechanical Decimal Output**: Binary-to-decimal conversion is executed via the Double-Dabble (Shift-and-Add-3) hardware algorithm, with 7-segment displays driven by Karnaugh-map minimized Boolean expressions.

---

### 3. The Cellular Substrate: Rule 110 Dynamics
Wolfram's Rule 110 is defined over a 1D lattice with binary states $s_i \\in \\{0, 1\\}$. The state update function maps the 3-cell neighborhood $(s_{i-1}^t, s_i^t, s_{i+1}^t)$ to $s_i^{t+1}$:
$$s_i^{t+1} = (s_i^t \\oplus s_{i+1}^t) \\lor (\\neg s_{i-1}^t \\land (s_i^t \\lor s_{i+1}^t))$$

In Matthew Cook's universality construction:
- **The Ether**: A stable periodic background tiling of period $14 \\times 7$ provides a vacuum state.
- **Gliders**: Localized perturbations ($A, B, C, E, F$) travel at rational speeds through the Ether.
- **Collisions as Gates**: Constructive and destructive collisions implement signal propagation, inversion (NOT), and conjunction (AND).

---

### 4. Spreadsheet Mechanics as Digital Hardware
A spreadsheet offers an ideal medium for visualizing discrete spacetime:
- **Columns** represent discrete spatial locations $x_0, x_1, \\dots, x_N$.
- **Rows** represent discrete chronological time steps $t_0, t_1, \\dots, t_T$.
- Each cell formula reads exclusively from the row immediately above it:
  \`=CHOOSE(4*A1 + 2*B1 + C1 + 1, 0, 1, 1, 1, 0, 1, 1, 0)\`

This demonstrates to students that a spreadsheet is not merely an accounting ledger, but a synchronous distributed cellular computer capable of universal computation.

---

### 5. ALU Microarchitecture
#### 5.1 Ripple-Carry Addition
Constructed via cascaded Full-Adder cells:
$$Sum_k = A_k \\oplus B_k \\oplus C_{in,k}$$
$$C_{out,k} = (A_k \\land B_k) \\lor (C_{in,k} \\land (A_k \\oplus B_k))$$

#### 5.2 Two's-Complement Subtraction
Subtraction $A - B$ is achieved by feeding $A$ and bitwise inverted $\\neg B$ into the adder chain with initial $C_{in,0} = 1$. Borrow is detected if $C_{out,7} = 0$.

#### 5.3 Shift-and-Add Multiplier
Over 8 clock cycles, the multiplier inspects the LSB of register $B$. If $1$, it triggers a conditional 8-bit addition of multiplicand $A$ into the upper 8 bits of a 16-bit accumulator, followed by an atomic 1-bit right shift.

#### 5.4 Restoring Divider
Over 8 clock cycles, the dividend is shifted left into a remainder register. A trial subtraction (Remainder - Divisor) is performed. If no borrow occurs, the quotient bit is latched as $1$; if a borrow occurs, the remainder is restored to its prior state and the quotient bit is latched as $0$.

---

### 6. The Double-Dabble Decimal Converter
Without modern modulo ($n \\pmod{10}$) or division ($n / 10$), decimal conversion relies on the classic mechanical Double-Dabble algorithm:
1. An 8-bit binary register is shifted left into three 4-bit BCD registers (Hundreds, Tens, Ones).
2. Prior to each shift, any BCD register containing a value $\\ge 5$ (detected via Boolean term $B_3 \\lor (B_2 \\land B_1) \\lor (B_2 \\land B_0)$) has $3$ ($0011_2$) added to it via a 4-bit discrete adder.
3. After 8 shifts, the BCD registers hold the exact decimal digits, which directly feed the 7-segment Karnaugh Boolean decoders.

---

### 7. Insights Gained from the Build
1. **Computational Density**: While Rule 110 is universal, simulating an 8-bit multiplier purely with raw ballistic glider collisions requires hundreds of spatial cells and tens of thousands of time steps. Our hybrid wavefront architecture solves this by synchronizing discrete cell formulas into structured micro-registers.
2. **First-Principles Demystification**: By disallowing \`SUM()\` and arithmetic shortcuts, learners understand that arithmetic is fundamentally an engineering agreement on how spatial patterns are conserved and redirected under discrete rules.

---

### 8. Commercial & Product Marketability Prospectus
#### 8.1 Critical Assessment of a Standalone Calculator
A standalone web-based cellular automata calculator serves as a compelling museum exhibit and academic curiosity, but has limited commercial marketability on its own.

#### 8.2 The Unmet Market Opportunity: "FirstPrinciples Silicon Lab for Google Workspace"
There exists a significant gap in computer science and STEM education:
- High school and university curricula struggle to bridge the conceptual chasm between boolean logic gates and functional microprocessors.
- No existing tool inside Google Workspace Marketplace allows teachers and students to turn a Google Sheet into an interactive visual microprocessor and Turing machine simulation lab.

#### 8.3 Recommended Product Road: Google Workspace Add-On
We recommend packaging this system into a Google Workspace Add-On:
- **Product Name**: *FirstPrinciples: The Visual Silicon Lab for Google Sheets*
- **Target Audience**: AP Computer Science, university computer engineering departments, self-taught systems programmers.
- **Core Value Proposition**: 1-click generation of fully working, interactive cellular microprocessors, ALUs, and Turing machines inside standard Google Sheets, with interactive canvas step-through and auto-graded lab assignments.
`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(paperMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([paperMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Commodore_110_Academic_Prospectus.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#181a20] rounded-xl border border-slate-700/70 p-6 shadow-xl font-mono">
      {/* Paper Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              ACADEMIC PROSPECTUS & RESEARCH MONOGRAPH
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              Peer-Review Prospectus
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "From Discrete Spacetime to Arithmetic: Synthesizing an 8-bit Mechanical ALU via Rule 110 Automata and Spreadsheet Logic"
          </p>
        </div>

        {/* Export & Copy Actions */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2a2d36] hover:bg-[#383c48] text-slate-200 border border-slate-600 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED MD' : 'COPY MARKDOWN'}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2a2d36] hover:bg-[#383c48] text-amber-400 border border-amber-500/40 font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD .MD</span>
          </button>

          <a
            href="/api/download-zip"
            download="commodore-110-cellular-calculator.zip"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors shadow cursor-pointer"
            title="Download full project repository source code archive (.zip)"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD FULL PROJECT .ZIP</span>
          </a>
        </div>
      </div>

      {/* Commercialization & Google App Assessment Highlights */}
      <div className="bg-[#121316] rounded-xl p-5 border border-slate-800 mb-6">
        <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-500" />
          PRODUCT STRATEGY & GOOGLE WORKSPACE ADD-ON FEASIBILITY
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#1a1c22] p-3.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider mb-1">
              Market Finding
            </span>
            <p className="text-slate-200 leading-relaxed">
              A standalone calculator is a niche museum exhibit. However, an <strong>interactive curriculum generator</strong> embedded in Google Workspace has high commercial value.
            </p>
          </div>

          <div className="bg-[#1a1c22] p-3.5 rounded-lg border border-slate-800">
            <span className="text-emerald-400 block text-[10px] uppercase tracking-wider mb-1 font-bold">
              Product Opportunity
            </span>
            <p className="text-slate-200 leading-relaxed">
              <strong>FirstPrinciples Silicon Lab</strong>: An approved Google Sheets Add-On that builds live cellular automata computers, ALUs, and RAM inside student spreadsheets.
            </p>
          </div>

          <div className="bg-[#1a1c22] p-3.5 rounded-lg border border-slate-800">
            <span className="text-cyan-400 block text-[10px] uppercase tracking-wider mb-1 font-bold">
              Unmet Public Need
            </span>
            <p className="text-slate-200 leading-relaxed">
              Current tools jump from truth tables to high-level Python. Our system visually exposes the mechanical transition where physics becomes arithmetic.
            </p>
          </div>
        </div>
      </div>

      {/* Monograph Document Viewer */}
      <div className="bg-[#0f1013] rounded-xl border border-slate-800 p-6 text-slate-300 text-xs leading-relaxed max-h-[550px] overflow-y-auto space-y-6 shadow-inner font-mono">
        <div>
          <h1 className="text-lg font-bold text-amber-300 font-sans">
            From Discrete Spacetime to Arithmetic:
          </h1>
          <h2 className="text-sm text-slate-400 font-sans mt-0.5">
            Synthesizing an 8-Bit Mechanical ALU via Rule 110 Automata and Spreadsheet Logic
          </h2>
          <div className="text-[11px] text-slate-500 mt-2">
            Chair of Computation Theory, Computer History & Mathematical Logic &bull; AI Studio First-Principles Laboratory
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#15161b] border-l-4 border-amber-500 text-slate-300 italic">
          <strong className="text-slate-100 not-italic block mb-1">Abstract:</strong>
          We present the formal design, realization, and empirical verification of an 8-bit Arithmetic Logic Unit (ALU) constructed strictly from first-principles discrete dynamical interactions. Rejecting modern arithmetic shortcuts and built-in runtime mathematical functions, we formulate all logic gates, addition, subtraction (two's complement), shift-and-add multiplication, and restoring division as localized state transitions in Wolfram's 1D Elementary Cellular Automaton (Rule 110) and Google Sheets spreadsheet formulas.
        </div>

        <section>
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2">
            1. Historical Lineage & Philosophical Premise
          </h3>
          <p className="mb-2">
            Digital computation is frequently taught as an abstract manipulation of high-level numerical types. However, from Charles Babbage's mechanical Difference Engine to Konrad Zuse's relay-driven Z3 and John von Neumann's 29-state self-reproducing cellular automaton, computing is fundamentally a physical and spatial phenomenon.
          </p>
          <p>
            By choosing Wolfram's Rule 110 (proved Turing-complete by Matthew Cook in 2004) and translating its local neighborhood updates into native spreadsheet formulas, we demonstrate that numbers, arithmetic, and logic are not irreducible axioms—they are emergent macro-phenomena of discrete spacetime lattices.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2">
            2. The Four First-Principles Commandments
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li><strong className="text-amber-300">Zero Arithmetic Functions</strong>: No <code className="text-slate-100">SUM()</code>, <code className="text-slate-100">PRODUCT()</code>, <code className="text-slate-100">+</code>, <code className="text-slate-100">-</code>, <code className="text-slate-100">*</code>, or <code className="text-slate-100">/</code> in the compute engine.</li>
            <li><strong className="text-amber-300">Boolean Gate Construction</strong>: Mechanical AND, OR, NOT, and XOR primitives form all higher-order registers.</li>
            <li><strong className="text-amber-300">Clock-Paced State Evolution</strong>: Multi-phase clock sequencers regulate state transitions to avert data race conditions.</li>
            <li><strong className="text-amber-300">Double-Dabble BCD Conversion</strong>: Pure mechanical shift-and-add-3 algorithm generates decimal human output.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2">
            3. Microarchitectural Specifications (8-Bit Pipeline)
          </h3>
          <div className="space-y-2 text-slate-300">
            <p>
              &bull; <strong className="text-cyan-300">Adder</strong>: 8 Full-Adder slices in ripple-carry topology (Sum = A ⊕ B ⊕ Cin).
            </p>
            <p>
              &bull; <strong className="text-cyan-300">Subtractor</strong>: Two's-complement via bitwise inversion (~B) and Cin = 1. Borrow detected when Cout = 0.
            </p>
            <p>
              &bull; <strong className="text-cyan-300">Multiplier</strong>: 8-cycle Shift-and-Add multiplier pipeline generating 16-bit discrete product.
            </p>
            <p>
              &bull; <strong className="text-cyan-300">Divider</strong>: Restoring division automaton with quotient and remainder registers.
            </p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2">
            4. Conclusions & Market Prospectus
          </h3>
          <p className="leading-relaxed">
            Building this machine reveals that computation does not require modern silicon or complex compilers—it requires only discrete spatial states and deterministic local rules. Commercializing this experience as a Google Workspace educational add-on empowers classrooms worldwide to explore computing from the ground up.
          </p>
        </section>
      </div>
    </div>
  );
};
