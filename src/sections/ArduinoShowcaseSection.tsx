import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Layers,
  RotateCcw,
  Play,
  Pause,
  Zap,
  Info,
  X,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import {
  CAMERA_PRESETS,
  getComponentById,
  type ArduinoComponentSpec,
} from '../arduino/data/arduinoSpecs.ts';
import { ArduinoViewport } from '../arduino/components/ArduinoViewport.tsx';
import { ErrorBoundary } from '../components/ErrorBoundary.tsx';

export const ArduinoShowcaseSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>('reference');
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [autoSpin, setAutoSpin] = useState<boolean>(false);
  const [powerSim, setPowerSim] = useState<boolean>(true);
  const [resetTrigger, setResetTrigger] = useState<number>(0);

  // Check WebGL availability client-side
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // IntersectionObserver: initialize 3D canvas only when visitor approaches this section
  // and pause GPU execution when out of view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '250px 0px 250px 0px',
        threshold: 0.05,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const selectedSpec: ArduinoComponentSpec | undefined =
    getComponentById(selectedComponentId);

  const handleReset = () => {
    setActivePresetId('reference');
    setExplodeFactor(0);
    setSelectedComponentId(null);
    setAutoSpin(false);
    setPowerSim(true);
    setWebglError(null);
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <section
      ref={sectionRef}
      id="arduino-experience"
      className="py-24 bg-[#07090D] text-[#F5F7FA] border-t border-white/[0.09] relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#49C8FF]/[0.07] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1118] border border-white/[0.1] text-xs font-mono font-medium text-[#FF8A24] mb-3 backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5 text-[#FF8A24]" />
            <span>CHAPTER 01 // PHYSICAL COMPUTING</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-[#49C8FF] font-mono text-[11px]">LOCAL GPU</span>
          </div>

          <h2 className="font-display text-display-2 text-white mb-3">
            ATmega328P Digital Twin
          </h2>
          <p className="font-body text-sm sm:text-base text-[#A3ADBA] leading-relaxed">
            Procedural 3D digital twin of the Arduino Uno R3. Drag to inspect components, separate architectural PCB layers, and simulate on-board power telemetry directly in your browser.
          </p>
        </div>

        {/* Main Showcase Container */}
        <div className="w-full rounded-3xl border border-white/[0.1] bg-[#0D1118] overflow-hidden shadow-2xl relative">
          
          {/* Top Bar: Camera Presets & Reset */}
          <div className="p-3 sm:p-4 border-b border-white/[0.08] bg-[#0A0E15]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Camera Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-mono text-[11px] mr-1 hidden sm:inline">
                PRESETS:
              </span>
              {CAMERA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setActivePresetId(preset.id)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
                    activePresetId === preset.id
                      ? 'bg-[#FF8A24] text-white font-semibold shadow-md shadow-[#FF8A24]/30'
                      : 'bg-[#121923] text-slate-300 border border-white/[0.08] hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {preset.label || preset.id}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPowerSim(!powerSim)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border flex items-center gap-1.5 transition-all ${
                  powerSim
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                    : 'bg-[#121923] border-white/[0.08] text-slate-400 hover:text-slate-200'
                }`}
                title={powerSim ? 'Turn off LED power simulation' : 'Simulate 5V power and blinking LED indicators'}
              >
                <Zap className={`w-3.5 h-3.5 ${powerSim ? 'fill-emerald-400' : ''}`} />
                <span>{powerSim ? 'POWER: 5V ON' : 'POWER: OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAutoSpin(!autoSpin)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border flex items-center gap-1.5 transition-all ${
                  autoSpin
                    ? 'bg-orange-950/60 border-orange-500/50 text-[#FF8A24]'
                    : 'bg-[#121923] border-white/[0.08] text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle continuous auto-rotation"
              >
                {autoSpin ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>AUTO-ORBIT</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-xl bg-[#121923] border border-white/[0.08] text-slate-400 hover:text-white transition-all"
                title="Reset camera and state"
                aria-label="Reset 3D view"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3D Canvas Viewport Area */}
          <div className="relative w-full h-[480px] sm:h-[560px] lg:h-[620px] bg-[#07090D]">
            {!hasWebGL || Boolean(webglError) ? (
              /* Fallback State when WebGL is unavailable or failed */
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#07090D] text-slate-300">
                <AlertTriangle className="w-12 h-12 text-[#FF8A24] mb-3" />
                <h3 className="font-display text-xl font-bold text-white mb-2">Hardware Specification Mode</h3>
                <p className="max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {webglError
                    ? `3D acceleration encountered an issue: ${webglError}. Hardware telemetry and specifications remain available below.`
                    : 'WebGL 3D graphics are not available on this browser or display server. You can inspect the full hardware specification below.'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg text-left text-xs">
                  <div className="p-3 bg-[#0D1118] border border-white/[0.08] rounded-xl">
                    <span className="text-slate-500 block text-[10px] font-mono">Microcontroller</span>
                    <strong className="text-white">ATmega328P</strong>
                  </div>
                  <div className="p-3 bg-[#0D1118] border border-white/[0.08] rounded-xl">
                    <span className="text-slate-500 block text-[10px] font-mono">Clock Speed</span>
                    <strong className="text-white">16 MHz</strong>
                  </div>
                  <div className="p-3 bg-[#0D1118] border border-white/[0.08] rounded-xl">
                    <span className="text-slate-500 block text-[10px] font-mono">Operating Voltage</span>
                    <strong className="text-white">5V DC</strong>
                  </div>
                  <div className="p-3 bg-[#0D1118] border border-white/[0.08] rounded-xl">
                    <span className="text-slate-500 block text-[10px] font-mono">Digital I/O</span>
                    <strong className="text-white">14 Pins (6 PWM)</strong>
                  </div>
                </div>
              </div>
            ) : !isVisible ? (
              /* Loading / Idle placeholder before user scrolls into view */
              <div className="w-full h-full flex items-center justify-center bg-[#07090D] text-slate-500 text-xs font-mono">
                <span>// Loading 3D Canvas on scroll view...</span>
              </div>
            ) : (
              /* Active Client-Side 3D Canvas with Graceful Error Boundary */
              <ErrorBoundary
                name="Arduino3D"
                fallback={
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#07090D] text-slate-300">
                    <AlertTriangle className="w-12 h-12 text-[#FF8A24] mb-3" />
                    <h3 className="font-display text-xl font-bold text-white mb-2">3D Renderer Suspended</h3>
                    <p className="max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                      The WebGL canvas encountered an execution issue. The rest of the site is functioning normally.
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 rounded-xl text-xs font-mono bg-[#121923] border border-white/[0.1] text-white hover:border-[#FF8A24]/40"
                    >
                      Reload 3D Module
                    </button>
                  </div>
                }
              >
                <ArduinoViewport
                  activePresetId={activePresetId}
                  explodeTarget={explodeFactor}
                  selectedComponentId={selectedComponentId}
                  onSelectComponent={setSelectedComponentId}
                  autoSpin={autoSpin}
                  powerSim={powerSim}
                  theme="dark"
                  onError={(err) => setWebglError(err.message)}
                  key={resetTrigger}
                />
              </ErrorBoundary>
            )}

            {/* In-Canvas Component Spec Drawer (when a component is clicked) */}
            {selectedSpec && (
              <div className="absolute top-4 left-4 z-20 max-w-xs sm:max-w-sm rounded-2xl p-4 bg-[#0D1118]/90 border border-white/[0.12] backdrop-blur-xl shadow-2xl animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#49C8FF] uppercase tracking-wider block">
                        {selectedSpec.category}
                      </span>
                      {selectedSpec.packageType && (
                        <span className="text-[10px] font-mono text-slate-500">
                          [{selectedSpec.packageType}]
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-sm text-white">
                      {selectedSpec.name}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedComponentId(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white bg-white/[0.05]"
                    aria-label="Close component details"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="font-body text-xs text-[#A3ADBA] leading-relaxed mb-3">
                  {selectedSpec.summary}
                </p>
                {selectedSpec.specs && Object.keys(selectedSpec.specs).length > 0 && (
                  <div className="space-y-1 text-[11px] font-mono bg-black/40 border border-white/[0.06] p-2.5 rounded-lg text-slate-300">
                    {Object.entries(selectedSpec.specs).slice(0, 4).map(([key, val]) => (
                      <div key={key} className="flex justify-between gap-2">
                        <span className="text-slate-400">{key}:</span>
                        <span className="text-[#FF8A24] text-right font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Instruction Overlay Pill */}
            <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1118]/80 border border-white/[0.08] backdrop-blur-md text-[11px] font-mono text-slate-400">
              <Sliders className="w-3 h-3 text-[#49C8FF]" />
              <span>Drag to Orbit &bull; Scroll to Zoom &bull; Click to Inspect</span>
            </div>
          </div>

          {/* Bottom Dock: Explode View Slider & Hardware Quick Spec Bar */}
          <div className="p-4 border-t border-white/[0.08] bg-[#0A0E15]/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            {/* Exploded View Slider */}
            <div className="flex items-center gap-3 w-full sm:w-80">
              <div className="flex items-center gap-1.5 text-slate-300 shrink-0 font-mono text-[11px]">
                <Layers className="w-4 h-4 text-[#FF8A24]" />
                <span>PCB EXPLODE:</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={explodeFactor}
                onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
                className="w-full accent-[#FF8A24] cursor-pointer h-1.5 rounded-lg bg-slate-800"
                aria-label="Explode 3D Arduino components"
              />
              <span className="text-[#FF8A24] font-mono text-[11px] shrink-0 w-8">
                {Math.round(explodeFactor * 100)}%
              </span>
            </div>

            {/* Technical Highlights / Specs */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400">
              <div>
                <span className="text-slate-500">CORE: </span>
                <span className="text-slate-200 font-mono">ATmega328P @ 16MHz</span>
              </div>
              <div className="hidden sm:inline text-slate-700">&bull;</div>
              <div>
                <span className="text-slate-500">LOGIC: </span>
                <span className="text-slate-200 font-mono">5V (7–12V VIN)</span>
              </div>
              <div className="hidden sm:inline text-slate-700">&bull;</div>
              <div>
                <span className="text-slate-500">I/O BUS: </span>
                <span className="text-[#49C8FF] font-mono">UART / I2C / SPI</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
