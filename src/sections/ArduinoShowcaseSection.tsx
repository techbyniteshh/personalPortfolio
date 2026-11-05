import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import {
  Cpu,
  Layers,
  RotateCcw,
  Play,
  Pause,
  Zap,
  Info,
  X,
  Maximize2,
  Sliders,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import {
  ARDUINO_COMPONENTS,
  CAMERA_PRESETS,
  getComponentById,
  type ArduinoComponentSpec,
} from '../arduino/data/arduinoSpecs.ts';
import { ArduinoViewport } from '../arduino/components/ArduinoViewport.tsx';

export const ArduinoShowcaseSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
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
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
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
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <section
      ref={sectionRef}
      id="arduino-experience"
      className="py-20 bg-[#070C15] text-[#E2E8F0] border-t border-slate-800/80 relative overflow-hidden"
    >
      {/* Background glow ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-orange-400 mb-3 backdrop-blur-sm">
            <Cpu className="w-3.5 h-3.5 text-orange-400" />
            <span>Interactive 3D Hardware Digital Twin</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400 font-mono text-[11px]">Local GPU</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Interactive Arduino Experience
          </h2>
          <p className="font-body text-sm sm:text-base text-slate-300 leading-relaxed">
            Procedural 3D model of the Arduino Uno R3. Drag to inspect components, separate architectural PCB layers, and simulate on-board power telemetry directly in your browser.
          </p>
        </div>

        {/* Main Showcase Container */}
        <div className="w-full rounded-3xl border border-slate-800 bg-[#0B111E] overflow-hidden shadow-2xl relative">
          
          {/* Top Bar: Camera Presets & Reset */}
          <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Camera Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-medium text-[11px] mr-1 hidden sm:inline">
                Camera:
              </span>
              {CAMERA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setActivePresetId(preset.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all text-xs ${
                    activePresetId === preset.id
                      ? 'bg-orange-500 text-white font-semibold shadow-sm shadow-orange-500/30'
                      : 'bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPowerSim(!powerSim)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  powerSim
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
                title={powerSim ? 'Turn off LED power simulation' : 'Simulate 5V power and blinking LED indicators'}
              >
                <Zap className={`w-3.5 h-3.5 ${powerSim ? 'fill-emerald-400' : ''}`} />
                <span>{powerSim ? 'Power: ON' : 'Power: OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAutoSpin(!autoSpin)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  autoSpin
                    ? 'bg-orange-950/60 border-orange-500/50 text-orange-400'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle continuous auto-rotation"
              >
                {autoSpin ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>Auto-Spin</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-white transition-all"
                title="Reset camera and state"
                aria-label="Reset 3D view"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3D Canvas Viewport Area */}
          <div className="relative w-full h-[480px] sm:h-[560px] lg:h-[600px] bg-[#090E17]">
            {!hasWebGL ? (
              /* Fallback State when WebGL is unavailable */
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950/90 text-slate-300">
                <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Hardware Acceleration Required</h3>
                <p className="max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  WebGL 3D graphics are not available on this browser or have been disabled. You can still inspect the full hardware specification below.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg text-left text-xs">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-slate-500 block text-[10px] font-mono">Microcontroller</span>
                    <strong className="text-white">ATmega328P</strong>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-slate-500 block text-[10px] font-mono">Clock Speed</span>
                    <strong className="text-white">16 MHz</strong>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-slate-500 block text-[10px] font-mono">Operating Voltage</span>
                    <strong className="text-white">5V DC</strong>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-slate-500 block text-[10px] font-mono">Digital I/O</span>
                    <strong className="text-white">14 Pins (6 PWM)</strong>
                  </div>
                </div>
              </div>
            ) : !isVisible ? (
              /* Loading / Idle placeholder before user scrolls into view */
              <div className="w-full h-full flex items-center justify-center bg-[#090E17] text-slate-500 text-xs">
                <span>Loading 3D Engine on Scroll...</span>
              </div>
            ) : (
              /* Active Client-Side 3D Canvas */
              <ArduinoViewport
                activePresetId={activePresetId}
                explodeTarget={explodeFactor}
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
                autoSpin={autoSpin}
                powerSim={powerSim}
                theme="dark"
                resetTrigger={resetTrigger}
              />
            )}

            {/* Interactive Component Inspection Card (Slides in when user clicks a board component) */}
            {selectedSpec && (
              <div className="absolute top-4 left-4 z-20 max-w-xs sm:max-w-sm w-full bg-slate-900/95 border border-slate-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-left-4 duration-200">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/30">
                      {selectedSpec.designator} &bull; {selectedSpec.category.toUpperCase()}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      {selectedSpec.name}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedComponentId(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Close component details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {selectedSpec.description}
                </p>

                {selectedSpec.specs && Object.keys(selectedSpec.specs).length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
                    {Object.entries(selectedSpec.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center text-slate-400">
                        <span className="capitalize">{key}:</span>
                        <span className="text-slate-200 font-mono font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Instruction Callout on Canvas */}
            <div className="pointer-events-none absolute top-4 right-4 z-10 hidden sm:block">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-1.5 text-[11px] font-mono text-slate-400 flex items-center gap-2 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span>Click chips or headers to inspect specs &bull; Drag to rotate</span>
              </div>
            </div>
          </div>

          {/* Bottom Dock: Explode View Slider & Hardware Quick Spec Bar */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/70 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            {/* Exploded View Slider */}
            <div className="flex items-center gap-3 w-full sm:w-80">
              <div className="flex items-center gap-1.5 text-slate-300 shrink-0 font-medium">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>Layer Explode:</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={explodeFactor}
                onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                aria-label="Explode 3D Arduino components"
              />
              <span className="text-slate-400 font-mono text-[11px] shrink-0 w-8">
                {Math.round(explodeFactor * 100)}%
              </span>
            </div>

            {/* Technical Highlights / Specs */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
              <div>
                <span className="text-slate-500">Core: </span>
                <span className="text-slate-200 font-mono">ATmega328P @ 16MHz</span>
              </div>
              <div className="hidden sm:inline text-slate-700">&bull;</div>
              <div>
                <span className="text-slate-500">Operating Voltage: </span>
                <span className="text-slate-200 font-mono">5V (7–12V Input)</span>
              </div>
              <div className="hidden sm:inline text-slate-700">&bull;</div>
              <div>
                <span className="text-slate-500">Telemetry: </span>
                <span className="text-emerald-400 font-mono">UART / I2C / SPI</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

