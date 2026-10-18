/**
 * High-Resolution Architectural Blueprint Vector Synthesizer
 * Generates CAD-grade cyanotype blueprints for the Commodore 110 ALU,
 * Matthew Cook's Rule 110 glider collisions, and discrete mechanical registers.
 * Serves as an instant, zero-quota high-fidelity visual asset (1K, 2K, 4K).
 */

export function generateArchitecturalBlueprintSvg(
  presetTitle: string,
  imageSize: '1K' | '2K' | '4K' = '2K',
  aspectRatio: '16:9' | '4:3' | '1:1' = '16:9'
): string {
  const dim = {
    '1K': { w: 1280, h: aspectRatio === '16:9' ? 720 : aspectRatio === '4:3' ? 960 : 1280 },
    '2K': { w: 1920, h: aspectRatio === '16:9' ? 1080 : aspectRatio === '4:3' ? 1440 : 1920 },
    '4K': { w: 3840, h: aspectRatio === '16:9' ? 2160 : aspectRatio === '4:3' ? 2880 : 3840 },
  }[imageSize];

  const w = dim.w;
  const h = dim.h;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <!-- Cyanotype Blueprint Blueprint Grids -->
    <pattern id="fineGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1d4ed8" stroke-width="0.5" stroke-opacity="0.35"/>
    </pattern>
    <pattern id="coarseGrid" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="url(#fineGrid)"/>
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#3b82f6" stroke-width="1.2" stroke-opacity="0.6"/>
    </pattern>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Deep Cyanotype Blueprint Blueprint Background -->
  <rect width="${w}" height="${h}" fill="#0a192f"/>
  <rect width="${w}" height="${h}" fill="url(#coarseGrid)"/>

  <!-- Technical Border & Outer Frame -->
  <rect x="30" y="30" width="${w - 60}" height="${h - 60}" fill="none" stroke="#60a5fa" stroke-width="2.5" opacity="0.8"/>
  <rect x="38" y="38" width="${w - 76}" height="${h - 76}" fill="none" stroke="#3b82f6" stroke-width="1" opacity="0.5"/>

  <!-- Technical Title Block (Bottom Right) -->
  <g transform="translate(${w - 480}, ${h - 180})">
    <rect width="430" height="130" fill="#071324" stroke="#60a5fa" stroke-width="2" opacity="0.95"/>
    <line x1="0" y1="35" x2="430" y2="35" stroke="#3b82f6" stroke-width="1.5"/>
    <line x1="0" y1="75" x2="430" y2="75" stroke="#3b82f6" stroke-width="1.5"/>
    <line x1="240" y1="35" x2="240" y2="130" stroke="#3b82f6" stroke-width="1.5"/>
    
    <text x="15" y="24" font-family="monospace" font-size="14" font-weight="bold" fill="#93c5fd" letter-spacing="1">
      COMMODORE 110 ARCHITECTURAL BLUEPRINT
    </text>
    <text x="15" y="55" font-family="monospace" font-size="11" fill="#60a5fa">
      SUBJECT: ${presetTitle.slice(0, 32)}
    </text>
    <text x="15" y="70" font-family="monospace" font-size="10" fill="#94a3b8">
      SUBSTRATE: RULE 110 DISCRETE AUTOMATON
    </text>
    <text x="15" y="95" font-family="monospace" font-size="10" fill="#60a5fa">
      SCALE: 1:1 DISCRETE LATTICE
    </text>
    <text x="15" y="115" font-family="monospace" font-size="10" fill="#93c5fd">
      RESOLUTION: ${imageSize} (${w}x${h})
    </text>
    <text x="255" y="55" font-family="monospace" font-size="10" fill="#60a5fa">
      DWG NO: C110-ALU-08
    </text>
    <text x="255" y="75" font-family="monospace" font-size="10" fill="#93c5fd">
      REV: 1.0 (VERIFIED)
    </text>
    <text x="255" y="105" font-family="monospace" font-size="10" fill="#38bdf8">
      TURING UNIVERSAL (COOK '04)
    </text>
  </g>

  <!-- Header Title (Top Left) -->
  <g transform="translate(60, 80)">
    <text x="0" y="0" font-family="monospace" font-size="24" font-weight="900" fill="#e0f2fe" letter-spacing="2">
      COMMODORE 110 // 8-BIT CELLULAR ALU DIE TOPOLOGY
    </text>
    <text x="0" y="26" font-family="monospace" font-size="13" fill="#93c5fd" letter-spacing="1">
      FIRST-PRINCIPLES DISCRETE AUTOMATA &middot; ZERO BUILT-IN MATHEMATICAL FUNCTIONS
    </text>
    <line x1="0" y1="38" x2="700" y2="38" stroke="#38bdf8" stroke-width="2"/>
  </g>

  <!-- Section 1: 8-Bit Ripple Carry Adder Slice Cascade -->
  <g transform="translate(70, 160)">
    <text x="0" y="0" font-family="monospace" font-size="14" font-weight="bold" fill="#38bdf8">
      SECTION A: 8-STAGE FULL-ADDER DISCRETE SLICE CASCADE
    </text>
    
    <!-- 8 Full Adder Blocks -->
    ${[7, 6, 5, 4, 3, 2, 1, 0].map((bit, idx) => {
      const bx = idx * 110;
      return `
      <g transform="translate(${bx}, 25)">
        <rect width="90" height="130" fill="#0c2340" stroke="#60a5fa" stroke-width="1.8" rx="4"/>
        <text x="45" y="22" font-family="monospace" font-size="11" font-weight="bold" fill="#e0f2fe" text-anchor="middle">FA-${bit}</text>
        <text x="45" y="38" font-family="monospace" font-size="9" fill="#93c5fd" text-anchor="middle">BIT ${bit}</text>
        
        <!-- Input Ports -->
        <circle cx="20" cy="55" r="4" fill="#f59e0b"/>
        <text x="28" y="58" font-family="monospace" font-size="8" fill="#fcd34d">A[${bit}]</text>
        
        <circle cx="20" cy="75" r="4" fill="#06b6d4"/>
        <text x="28" y="78" font-family="monospace" font-size="8" fill="#67e8f9">B[${bit}]</text>

        <circle cx="10" cy="100" r="3.5" fill="#ef4444"/>
        <text x="16" y="103" font-family="monospace" font-size="7" fill="#fca5a5">Cin</text>

        <!-- Output Ports -->
        <circle cx="70" cy="70" r="4" fill="#10b981"/>
        <text x="50" y="73" font-family="monospace" font-size="8" fill="#6ee7b7">S[${bit}]</text>

        <circle cx="80" cy="100" r="3.5" fill="#ef4444"/>
        <text x="55" y="103" font-family="monospace" font-size="7" fill="#fca5a5">Cout</text>

        <!-- Carry Propagation Bus Arrow -->
        ${idx < 7 ? `<path d="M 80 100 L 110 100" stroke="#f87171" stroke-width="2" stroke-dasharray="3,2"/>` : ''}
      </g>`;
    }).join('')}
  </g>

  <!-- Section 2: Matthew Cook's Rule 110 Glider Trajectory Mechanics -->
  <g transform="translate(70, 360)">
    <text x="0" y="0" font-family="monospace" font-size="14" font-weight="bold" fill="#38bdf8">
      SECTION B: RULE 110 GLIDER COLLISION DYNAMICS (COOK 2004)
    </text>

    <!-- Glider Diagram Grid -->
    <g transform="translate(0, 25)">
      <!-- Ether Background Pattern -->
      <rect width="450" height="200" fill="#081b33" stroke="#3b82f6" stroke-width="1.5" rx="4"/>
      <text x="15" y="24" font-family="monospace" font-size="11" fill="#93c5fd">ETHER PERIODIC LATTICE (Period 14x7)</text>

      <!-- Trajectory Rays -->
      <line x1="40" y1="40" x2="220" y2="150" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6,3"/>
      <text x="45" y="60" font-family="monospace" font-size="10" fill="#fcd34d">GLIDER A (Data 0)</text>

      <line x1="380" y1="40" x2="220" y2="150" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="6,3"/>
      <text x="270" y="60" font-family="monospace" font-size="10" fill="#67e8f9">GLIDER B (Carrier Pulse)</text>

      <!-- Collision Junction -->
      <circle cx="220" cy="150" r="10" fill="#ef4444" opacity="0.8" filter="url(#glow)"/>
      <text x="240" y="155" font-family="monospace" font-size="11" font-weight="bold" fill="#fca5a5">COLLISION GATE</text>

      <!-- Resultant Output Glider E -->
      <line x1="220" y1="150" x2="320" y2="190" stroke="#10b981" stroke-width="3"/>
      <text x="330" y="193" font-family="monospace" font-size="10" fill="#6ee7b7">GLIDER E (Constructive Bit)</text>
    </g>

    <!-- Formula Box Adjacent -->
    <g transform="translate(480, 25)">
      <rect width="400" height="200" fill="#081b33" stroke="#3b82f6" stroke-width="1.5" rx="4"/>
      <text x="20" y="30" font-family="monospace" font-size="12" font-weight="bold" fill="#e0f2fe">
        SPATIAL DISCRETE TRANSITION LAWS
      </text>
      <text x="20" y="60" font-family="monospace" font-size="10" fill="#93c5fd">
        Local Rule: s_i^(t+1) = f(s_{i-1}^t, s_i^t, s_{i+1}^t)
      </text>
      <text x="20" y="85" font-family="monospace" font-size="10" fill="#38bdf8">
        Rule 110 Wolfram Code: 01101110_2
      </text>
      <text x="20" y="115" font-family="monospace" font-size="10" fill="#fcd34d">
        Google Sheets Equation:
      </text>
      <text x="20" y="135" font-family="monospace" font-size="9" fill="#fef08a">
        =CHOOSE(4*L + 2*C + R + 1, 0,1,1,1,0,1,1,0)
      </text>
      <text x="20" y="165" font-family="monospace" font-size="9" fill="#94a3b8">
        Proven Equivalent to Cyclic Tag System (Cook, 2004)
      </text>
      <text x="20" y="180" font-family="monospace" font-size="9" fill="#10b981">
        Universality Class IV &middot; Zero Float/Math Functions
      </text>
    </g>
  </g>

  <!-- Technical Watermark / Compass Rose -->
  <g transform="translate(${w - 180}, 120)">
    <circle cx="50" cy="50" r="40" fill="none" stroke="#1d4ed8" stroke-width="1"/>
    <circle cx="50" cy="50" r="28" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4,4"/>
    <line x1="50" y1="5" x2="50" y2="95" stroke="#60a5fa" stroke-width="1.5"/>
    <line x1="5" y1="50" x2="95" y2="50" stroke="#60a5fa" stroke-width="1.5"/>
    <text x="50" y="0" font-family="monospace" font-size="10" fill="#93c5fd" text-anchor="middle">TIME &darr;</text>
    <text x="105" y="53" font-family="monospace" font-size="10" fill="#93c5fd">SPACE &rarr;</text>
  </g>
</svg>`;
}
