# Mechanical Cellular Automata 8-Bit Calculator & ALU (Rule 110 Substrate)

A first-principles, discrete-dynamical computing machine and pedagogical laboratory implementing an 8-bit Arithmetic Logic Unit (ALU) using Elementary Cellular Automata (Rule 110) and Google Sheets spreadsheet formulas. The system demonstrates how universal computation, arithmetic, and digital logic emerge purely from mechanical spatial interactions without modern shortcuts or built-in mathematical functions.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural directions have been synthesized from your answers and foundational computing theory:
> - **Substrate Rule**: 1D Elementary Cellular Automaton (Rule 110) with Matthew Cook's glider-collision and cyclic tag logic, paired with direct localized transition formulas.
> - **Dual Simulation Interface**: High-speed interactive 2D Canvas simulator coupled with a real-time editable Google Sheets matrix viewer and formula exporter.
> - **Pedagogical Output**: Interactive laboratory paired with an academic prospectus and research paper export on discrete dynamical logic, compute density, and educational impact.
> - **Visual & Media Integration**: Architecture diagrams and mechanical computer blueprint visualizations powered by `gemini-3-pro-image-preview` with user-selectable resolutions (1K, 2K, 4K).

---

## 1. Overview & Core Concept

### What It Does
The application models a fully discrete, mechanical 8-bit digital computer from elementary axioms:
1. **Cellular Automaton Substrate**: Each bit of data and logic operation is realized through one-dimensional cellular space evolving over discrete time steps $t \to t+1$. The local transition rule is Wolfram's Rule 110:
   $$s_i^{t+1} = f(s_{i-1}^t, s_i^t, s_{i+1}^t)$$
   where the 8 local neighborhood states $(111, 110, 101, 100, 011, 010, 001, 000)$ map to binary outputs $(0, 1, 1, 0, 1, 1, 1, 0)$ (decimal 110).
2. **First-Principles Google Sheets Formulas**: The state updates are modeled as spreadsheet cell formulas without using `SUM`, `PRODUCT`, `DEC2BIN`, or arithmetic operators. Cells calculate the next row using bitwise lookup formulas:
   ```text
   =CHOOSE(4*A1 + 2*B1 + C1 + 1, 0, 1, 1, 1, 0, 1, 1, 0)
   ```
   or Boolean-only mechanical disjunctions and conjunctions.
3. **8-Bit ALU Execution Pipeline**:
   - **Adder**: Ripple-carry chain constructed from Rule 110 glider collisions (half-adders and full-adders).
   - **Subtractor**: Two's-complement arithmetic through bitwise NOT gates and carry-in propagation.
   - **Multiplier**: Sequential shift-and-add mechanical shift register pipeline.
   - **Divider**: Restoring division automaton generating 8-bit quotient and remainder.
4. **Clock & Sequencer**: A multi-phase cyclic clock that paces signal propagation, prevents race conditions, and visualizes data wavefronts traversing the grid.
5. **Double-Dabble Decimal Converter**: Mechanical shift-and-add-3 binary-to-BCD automaton converting 8-bit binary ($0\text{--}255$) into three decimal digits, driving a virtual mechanical 7-segment display.
6. **Academic Prospectus & Publication Module**: Formats a formal monograph/prospectus titled *"From Discrete Spacetime to Arithmetic: Synthesizing an 8-bit Mechanical ALU via Rule 110 Automata and Spreadsheet Logic"*, ready for PDF/LaTeX or Markdown export.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Interactive ALU Workbench**:
   - User inputs Operand A and Operand B (via 8-bit mechanical toggle levers or decimal inputs $0\text{--}255$).
   - User selects Operation: `ADD`, `SUBTRACT`, `MULTIPLY`, `DIVIDE`, or Elementary Logic (`AND`, `OR`, `XOR`, `NOT`).
   - Clock Controls: **Play**, **Step Forward (+1 Clock / +1 Row)**, **Scrub Time**, and **Clock Speed (Hz)**.
2. **Dual-Mode Stage (Canvas & Live Spreadsheet)**:
   - **Canvas View**: Real-time rendering of cell states, signal wavefronts, glider trajectories, and wire conduits with crisp mechanical aesthetics.
   - **Spreadsheet Matrix View**: Live Google Sheets grid showing row-by-row evolution, formula inspector for any active cell, and a 1-click **Export to Google Sheets (.csv / .gs formulas)** button.
3. **Mechanical Logic Decomposition & Glider Gallery**:
   - Interactive zoom into individual gate primitives: Half-Adder, Full-Adder, Inverter, Glider Gun, and Signal Wire.
   - Step-by-step breakdown of how Rule 110 gliders (structures $A, B, C, E, F$) collide to cancel, reflect, or produce output signals.
4. **First-Principles BCD Decimal Display**:
   - Visualizing the mechanical Double-Dabble algorithm shifting 8 bits through hundreds, tens, and ones BCD registers with $>4 \to +3$ correction cells.
5. **Academic Prospectus & Product Strategy Studio**:
   - Comprehensive scholarly paper explorer analyzing compute density, Turing universality, historical precedents (Babbage, Zuse, Von Neumann, Wolfram, Cook), and commercial potential as an educational Google Workspace Add-on or interactive CS curriculum tool.
6. **High-Fidelity Architectural Blueprint Studio**:
   - Generate custom high-resolution architectural schematics and mechanical computing visualizations using `gemini-3-pro-image-preview` with resolution control (1K, 2K, 4K).

### Visual Identity & Theme
- **Aesthetic Direction**: *Instrument Precision & Mathematical Manuscript*. Clean slate laboratory aesthetic inspired by Babbage's Difference Engine blueprints, Wolfram's *A New Kind of Science*, and classic Bell Labs technical manuals.
- **Palette (60-30-10 Rule)**:
  - **60% Dominant Stage**: Deep Slate Obsidian (`#0B0F17`) and Off-Grid Ink (`#111827`) for high-contrast cellular rendering.
  - **30% Structural Panels**: Hairline borders (`#1F2937`), muted gridlines (`#1E2638`), crisp parchment paper mode option (`#F9FAFB` with dark indigo ink).
  - **10% Semantic Focal Accents**:
    - Active High Bit / Rule 110 Live Cell: Radiant Amber Gold (`#F59E0B`)
    - Clock Pulse / Signal Front: Electric Cyan (`#06B6D4`)
    - Carry / Overflow / Remainder: Coral Red (`#EF4444`)
    - Resting Quiescent Cell: Deep Charcoal (`#1E222D`)
- **Typography**:
  - Display: `Fraunces` / `Plus Jakarta Sans` for clean, professorial headers.
  - Body: `Plus Jakarta Sans` for readable educational prose and theoretical descriptions.
  - Formula & Grid: `JetBrains Mono` / `tabular-nums` for cell coordinate references, binary registers, and spreadsheet formulas.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Alternatives Considered |
| :--- | :--- | :--- |
| **Logic Substrate** | Rule 110 Elementary Cellular Automaton | User confirmed Rule 110. Proves Turing universality in the minimal 1D 2-state setting (Cook's Theorem). We complement raw glider collision physics with an equivalent spatial cell formula matrix to guarantee deterministic 8-bit ALU execution. |
| **Spreadsheet Engine** | Native In-App Formula Evaluator + Formula Export | Evaluates authentic Google Sheets formula syntax in-memory (`=CHOOSE`, `=IF`, `=MOD`, `=VLOOKUP`) while offering ready-to-paste spreadsheet formulas for real Google Sheets workbooks. |
| **Dual-Mode Canvas** | High-performance HTML5 2D Canvas + Virtualized Spreadsheet Grid | Renders thousands of cellular generations smoothly at 60 FPS while enabling cell-by-cell inspection and formula debugging without DOM sluggishness. |
| **High-Quality Imagery** | `gemini-3-pro-image-preview` (1K, 2K, 4K) | Fulfills requirement for high-resolution generation of historical computing blueprints, glider collision maps, and educational diagrams. |

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       First-Principles Calculator UI                        │
├──────────────────────────────┬──────────────────────────────────────────────┤
│ 8-Bit Operand Controls (A,B) │ Op Selector (ADD, SUB, MUL, DIV, LOGIC)      │
│ Clock Generator & Stepper    │ Mode: [2D Canvas Stage] | [Spreadsheet View] │
└──────────────┬───────────────┴──────────────────────┬───────────────────────┘
               │                                      │
               ▼                                      ▼
┌──────────────────────────────┐       ┌──────────────────────────────────────┐
│  Automaton & Clock Pipeline  │       │  Live Google Sheets Simulation Engine│
├──────────────────────────────┤       ├──────────────────────────────────────┤
│ • 8-Bit Ripple Adder Module  │       │ • Exact Cell Formulas (CHOOSE/IF)    │
│ • Two's Complement Subtract  │       │ • Row-by-Row Discrete Time Steps    │
│ • Shift-and-Add Multiplier   │       │ • Spatial Bit Wavefront Propagation  │
│ • Restoring Divider (Q, R)   │       │ • Formula Inspector & Syntax Tree    │
│ • Double-Dabble BCD Decoder  │       │ • CSV / Sheets Export Generator      │
└──────────────┬───────────────┘       └──────────────────┬───────────────────┘
               │                                          │
               ▼                                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Interactive Canvas & Data Visualizer                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ • 60 FPS 2D Canvas Cellular Renderer with Glider Trails & Heatmaps          │
│ • Mechanical 7-Segment Decimal Output & 8-Bit Binary LED Register           │
│ • Academic Prospectus Reader & Markdown/Paper Exporter                      │
│ • Gemini 3 Pro Blueprint Image Studio (1K, 2K, 4K Resolutions)              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy
- `App.tsx`: Top bar, mode selection, primary state coordination.
- `src/components/calculator/`:
  - `AluStage.tsx`: Canvas renderer for Rule 110 cellular automata spacetime evolution.
  - `SpreadsheetMatrixView.tsx`: Live spreadsheet table showing column/row coordinates and real Google Sheets formulas.
  - `RegisterControls.tsx`: 8-bit input switches (levers, hex, decimal), operation dispatcher.
  - `ClockSequencer.tsx`: Clock frequency, single-step pulse, phase indicator.
  - `DecimalConverterView.tsx`: Double-Dabble shift-and-add-3 visualizer.
  - `GateGliderGallery.tsx`: Interactive library of Rule 110 logic gates (AND, OR, NOT, XOR, Half-Adder, Full-Adder).
  - `AcademicProspectus.tsx`: Scholarly paper, architectural proof, and commercialization review.
  - `BlueprintStudio.tsx`: High-resolution Gemini 3 Pro image generation with 1K, 2K, 4K affordances.
- `src/engine/`:
  - `rule110.ts`: Discrete 1D CA engine, neighborhood transition rules, glider definitions.
  - `mechanicalAlu.ts`: 8-bit first-principles adder, subtractor, multiplier, divider without math functions.
  - `sheetsFormulas.ts`: Pure Google Sheets formula generator for cellular logic grids.
  - `doubleDabble.ts`: Discrete BCD binary-to-decimal conversion algorithm.

---

## 5. Verification Plan
1. **Arithmetic Correctness**: Verify all 8-bit operations against standard truth tables across edge cases ($0+0$, $255+1$ overflow, $0-1$ borrow, $15\times 15$, $255/1$, $100/0$ division-by-zero flag).
2. **Formula Integrity**: Validate all generated spreadsheet formulas in standard Google Sheets syntax without prohibited arithmetic shortcuts.
3. **Canvas Performance**: Ensure responsive 60 FPS animation with zoom, pan, and scrubbing across 256 time steps.
4. **Build & Lint**: Verify with `compile_applet` and `lint_applet` before delivery.
