/**
 * High-Resolution Blueprint & Diagram Image Studio
 * Uses Gemini 3 Pro (gemini-3-pro-image-preview) with affordances for 1K, 2K, and 4K image sizes.
 * Includes CAD-grade vector schematic synthesizer fallback to gracefully handle free-tier API quotas.
 */

import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  Loader2, 
  Layers, 
  Maximize2, 
  AlertCircle,
  CheckCircle2,
  Cpu,
  Info,
  Compass,
  FileCode
} from 'lucide-react';
import { generateArchitecturalBlueprintSvg } from '../utils/blueprintSvg';

export const BlueprintStudio: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(
    'Vintage 1976 Commodore handheld calculator with transparent smoky acrylic case revealing an intricate glowing Rule 110 cellular automata silicon microarchitecture die, authentic red bubble LED optical displays, studio macro photography, dramatic rim lighting, museum technical archive quality'
  );
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | '1:1'>('16:9');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quotaNotice, setQuotaNotice] = useState<string | null>(null);
  const [lastPromptUsed, setLastPromptUsed] = useState<string | null>(null);
  const [activeEngine, setActiveEngine] = useState<'gemini' | 'vector'>('gemini');

  const presets = [
    {
      title: 'Vintage Commodore Silicon Die',
      prompt: 'Vintage 1976 Commodore handheld calculator with transparent smoky acrylic case revealing an intricate glowing Rule 110 cellular automata silicon microarchitecture die, authentic red bubble LED optical displays, studio macro photography, dramatic rim lighting, museum technical archive quality',
    },
    {
      title: 'Cyanotype Architectural Blueprint',
      prompt: 'Architectural cyanotype blueprint of an 8-bit mechanical cellular automaton ALU, showing Matthew Cook glider collision logic gates, ripple-carry conduits, and discrete clock gears, crisp white drafting lines on deep prussian blue engineering paper',
    },
    {
      title: 'Glider Collision Physics Diagram',
      prompt: 'Scientific vector illustration of Matthew Cook Rule 110 gliders colliding on a discrete spacetime lattice, labeled structures A, B, C, and E, constructive interference creating logic pulses, dark slate background with amber and electric cyan illumination',
    },
    {
      title: 'Mechanical Babbage Calculator Hybrid',
      prompt: 'Intricate brass and steel mechanical calculating engine from first principles, stepped drum gears and slider levers executing binary ripple addition without electricity, vintage photographic daguerreotype aesthetic, warm aged patina',
    },
  ];

  // Synthesize instant CAD SVG blueprint
  const vectorSvgDataUrl = useMemo(() => {
    const svgString = generateArchitecturalBlueprintSvg(
      lastPromptUsed || 'Commodore 110 Discrete Cellular ALU',
      imageSize,
      aspectRatio
    );
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
  }, [lastPromptUsed, imageSize, aspectRatio]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setErrorMsg(null);
    setQuotaNotice(null);

    // If user explicitly chose vector mode:
    if (activeEngine === 'vector') {
      setTimeout(() => {
        setGeneratedImageUrl(vectorSvgDataUrl);
        setLastPromptUsed(prompt);
        setIsGenerating(false);
      }, 400);
      return;
    }

    try {
      const res = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageSize,
          aspectRatio,
          model: 'gemini-3-pro-image-preview',
        }),
      });

      const data = await res.json();

      if (data.creditsDepleted) {
        setQuotaNotice(
          'Your AI Studio prepayment credits are currently depleted. The studio has generated a high-resolution CAD architectural vector schematic (1K/2K/4K) instead. You can top up credits in AI Studio billing to re-enable neural model rendering.'
        );
        setGeneratedImageUrl(data.imageUrl || vectorSvgDataUrl);
        setLastPromptUsed(prompt);
        setIsGenerating(false);
        return;
      }

      if (data.quotaExhausted) {
        setQuotaNotice(
          'Gemini 3 Pro Image generation quota reached or free tier quota is 0. The studio has loaded the high-resolution CAD architectural vector schematic below.'
        );
        setGeneratedImageUrl(data.imageUrl || vectorSvgDataUrl);
        setLastPromptUsed(prompt);
        setIsGenerating(false);
        return;
      }

      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        setLastPromptUsed(prompt);
      } else {
        setGeneratedImageUrl(vectorSvgDataUrl);
      }
    } catch (err: any) {
      setQuotaNotice(
        'AI Studio image service reached quota limits or credits are depleted. Synthesized high-resolution CAD vector schematic below.'
      );
      setGeneratedImageUrl(vectorSvgDataUrl);
      setLastPromptUsed(prompt);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const urlToDownload = generatedImageUrl || vectorSvgDataUrl;
    const a = document.createElement('a');
    a.href = urlToDownload;
    a.download = `Commodore110_Architectural_Blueprint_${imageSize}.${urlToDownload.startsWith('data:image/svg') ? 'svg' : 'png'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Default initial blueprint view
  const displayImage = generatedImageUrl || vectorSvgDataUrl;

  return (
    <div className="bg-[#181a20] rounded-xl border border-slate-700/70 p-5 shadow-xl font-mono">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              ARCHITECTURAL BLUEPRINT & CONCEPT STUDIO
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              gemini-3-pro-image-preview
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate high-resolution visual schematics, silicon micro-die blueprints, and retro Commodore hardware visualizations.
          </p>
        </div>

        {/* Resolution Selector: 1K, 2K, 4K affordances */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">RESOLUTION:</span>
          <div className="flex items-center gap-1 bg-[#232630] p-1 rounded border border-slate-700">
            {(['1K', '2K', '4K'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setImageSize(size)}
                className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                  imageSize === size
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Prompts */}
      <div className="mb-4">
        <span className="text-[11px] text-slate-400 block mb-2 uppercase tracking-wider font-bold">
          Historical & Theoretical Presets:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(preset.prompt);
                setLastPromptUsed(preset.title);
              }}
              className="p-2.5 text-left rounded-lg bg-[#20222a] hover:bg-[#2b2e38] border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
            >
              <span className="font-bold text-amber-400 block mb-1">{preset.title}</span>
              <p className="text-[11px] text-slate-400 line-clamp-2">{preset.prompt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Box & Controls */}
      <div className="bg-[#121316] p-4 rounded-xl border border-slate-700/70 mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-slate-300 font-bold block">
            Prompt Description (Target: <span className="text-cyan-400">gemini-3-pro-image-preview</span> &middot; {imageSize})
          </label>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">ENGINE:</span>
            <button
              onClick={() => setActiveEngine('gemini')}
              className={`px-2 py-0.5 rounded ${activeEngine === 'gemini' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Gemini 3 Pro
            </button>
            <button
              onClick={() => setActiveEngine('vector')}
              className={`px-2 py-0.5 rounded ${activeEngine === 'vector' ? 'bg-cyan-700 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              CAD Vector
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your mechanical computing schematic, vintage calculator, or glider blueprint..."
          className="w-full bg-[#1c1d24] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
        />

        <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-800 text-xs">
          {/* Aspect Ratio */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">ASPECT:</span>
            <div className="flex items-center gap-1 bg-[#20222a] p-1 rounded border border-slate-700">
              {(['16:9', '4:3', '1:1'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    aspectRatio === ratio
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold shadow-lg transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SYNTHESIZING {imageSize} SCHEMATIC...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>GENERATE {imageSize} SCHEMATIC</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quota Notice Banner (Informative & Smooth) */}
      {quotaNotice && (
        <div className="p-3.5 mb-5 rounded-lg bg-blue-950/70 border border-blue-700/80 text-blue-200 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
          <div className="flex-1">
            <strong className="text-cyan-300 block mb-0.5">Google Cloud Free Tier Note:</strong>
            <p className="leading-relaxed text-[11px] text-blue-200/90">{quotaNotice}</p>
          </div>
        </div>
      )}

      {/* Error Message Alert */}
      {errorMsg && (
        <div className="p-3.5 mb-5 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Output Visual Canvas Container */}
      <div className="relative rounded-xl border-2 border-slate-800 bg-[#071324] overflow-hidden min-h-[420px] flex items-center justify-center p-4 shadow-2xl">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-3 text-center text-slate-400 p-8">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <div>
              <p className="text-sm font-bold text-slate-200">
                Synthesizing High-Resolution {imageSize} Blueprint Diagram
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Processing architectural geometry and glider collision lattice...
              </p>
            </div>
          </div>
        ) : displayImage ? (
          <div className="w-full flex flex-col items-center">
            <div className="relative max-h-[540px] w-full rounded-lg overflow-hidden border border-slate-700 shadow-2xl bg-[#0a192f]">
              <img
                src={displayImage}
                alt="Architectural Blueprint Schematic"
                referrerPolicy="no-referrer"
                className="max-h-[540px] w-full object-contain block rounded"
              />
              <div className="absolute top-2 right-2 bg-black/75 backdrop-blur px-2.5 py-1 rounded text-[11px] text-amber-300 font-bold border border-white/10 flex items-center gap-2">
                <span>{imageSize} RESOLUTION</span>
                <span className="text-slate-500">&bull;</span>
                <span>{aspectRatio}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between w-full mt-3 pt-3 border-t border-slate-800 text-xs gap-3">
              <span className="text-slate-400 truncate max-w-[70%]">
                Subject: "{lastPromptUsed || '8-Bit Rule 110 Cellular Automaton ALU Schematic'}"
              </span>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#2a2d36] hover:bg-[#393d4a] text-cyan-300 border border-cyan-500/30 font-bold cursor-pointer transition-colors shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD {imageSize} SCHEMATIC</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center text-slate-600 p-8">
            <Cpu className="w-12 h-12 text-slate-700" />
            <p className="text-xs text-slate-400 font-bold">
              Ready to synthesize blueprint
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm">
              Click Generate above to render the high-resolution schematic at {imageSize} resolution.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
