import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Layers,
  RotateCcw,
  Play,
  Pause,
  Zap,
  X,
  AlertTriangle,
  Camera,
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
  const [isVisible, setIsVisible] = useState<boolean>(true);
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

  // IntersectionObserver: keep active or pause RAF execution when deeply out of view
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
        rootMargin: '300px 0px 300px 0px',
        threshold: 0.02,
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
      className="py-8 sm:py-12 lg:py-14 bg-[#07090D] text-[#F5F7FA] border-t border-white/[0.09] relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#49C8FF]/[0.06] rounded-full blur-[120px] pointer-events-none" />

      {/* Full-width container maximizing available viewport */}
      <div className="w-full max-w-[96vw] xl:max-w-[98vw] mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        
        {/* Sleek, Compact Section Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1118] border border-white/[0.1] text-xs font-mono font-medium text-[#FF8A24] mb-2 backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5 text-[#FF8A24]" />
            <span>CHAPTER 01 // PHYSICAL COMPUTING</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-[#49C8FF] font-mono text-[11px]">CLIENT GPU</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            ATmega328P Digital Twin
          </h2>
          <p className="font-body text-xs sm:text-sm text-[#A3ADBA] leading-relaxed max-w-2xl mx-auto">
            Interactive 3D twin of the Arduino Uno R3 running on your device GPU. Orbit to inspect microcomponents, explode PCB layers, and simulate live 5V telemetry.
          </p>
        </div>

        {/* Immersive Main Showcase Card */}
        <div className="w-full rounded-3xl border border-white/[0.1] bg-[#0A0D14] overflow-hidden shadow-2xl relative">
          
          {/* Integrated Modern Glass Control Deck */}
          <div className="p-2.5 sm:p-3.5 border-b border-white/[0.08] bg-[#0A0E15]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
            
            {/* Left Controls: Camera Presets Dropdown & PCB Explode */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Modern Camera Presets Dropdown */}
              <div className="flex items-center gap-2 bg-[#121923] border border-white/[0.1] rounded-xl px-3 py-1.5 focus-within:border-[#FF8A24]/60 transition-colors">
                <Camera className="w-3.5 h-3.5 text-[#FF8A24]" />
                <label htmlFor="camera-presets-select" className="text-slate-400 font-mono text-[11px] hidden md:inline">
                  CAMERA:
                </label>
                <select
                  id="camera-presets-select"
                  value={activePresetId}
                  onChange={(e) => setActivePresetId(e.target.value)}
                  className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer pr-2"
                  aria-label="Select Camera View Preset"
                >
                  {CAMERA_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id} className="bg-[#0D1118] text-white">
                      {preset.label || preset.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modernized PCB Explode Slider Control */}
              <div className="flex items-center gap-2.5 bg-[#121923] border border-white/[0.1] px-3 py-1.5 rounded-xl">
                <Layers className="w-3.5 h-3.5 text-[#FF8A24]" />
                <label htmlFor="pcb-explode-range" className="text-slate-400 font-mono text-[11px] hidden md:inline">
                  EXPLODE:
                </label>
                <input
                  id="pcb-explode-range"
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={explodeFactor}
                  onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
                  className="w-20 sm:w-28 accent-[#FF8A24] cursor-pointer h-1.5 rounded-lg bg-slate-800"
                  aria-label="Explode 3D Arduino components"
                />
                <span className="text-[#FF8A24] font-mono text-xs font-semibold w-9 text-right">
                  {Math.round(explodeFactor * 100)}%
                </span>
              </div>
            </div>

            {/* Right Controls: Modern Power & Auto-Orbit Toggles + Reset */}
            <div className="flex items-center gap-2">
              {/* Power 5V Simulation Toggle */}
              <button
                type="button"
                onClick={() => setPowerSim(!powerSim)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border flex items-center gap-2 transition-all ${
                  powerSim
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
                    : 'bg-[#121923] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:border-white/[0.18]'
                }`}
                title={powerSim ? 'Deactivate 5V LED power simulation' : 'Activate 5V LED power simulation'}
              >
                <span className={`w-2 h-2 rounded-full ${powerSim ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                <Zap className={`w-3.5 h-3.5 ${powerSim ? 'text-emerald-400 fill-emerald-400' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{powerSim ? 'POWER: 5V ON' : 'POWER: OFF'}</span>
                <span className="sm:hidden">{powerSim ? '5V ON' : 'OFF'}</span>
              </button>

              {/* Auto-Orbit Rotation Toggle */}
              <button
                type="button"
                onClick={() => setAutoSpin(!autoSpin)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border flex items-center gap-2 transition-all ${
                  autoSpin
                    ? 'bg-[#FF8A24]/15 border-[#FF8A24]/50 text-[#FF8A24] shadow-sm shadow-[#FF8A24]/20'
                    : 'bg-[#121923] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:border-white/[0.18]'
                }`}
                title="Toggle continuous auto-rotation"
              >
                <span className={`w-2 h-2 rounded-full ${autoSpin ? 'bg-[#FF8A24] animate-pulse' : 'bg-slate-600'}`} />
                {autoSpin ? <Pause className="w-3.5 h-3.5 text-[#FF8A24]" /> : <Play className="w-3.5 h-3.5 text-slate-400" />}
                <span className="hidden sm:inline">{autoSpin ? 'ORBITING' : 'AUTO-ORBIT'}</span>
                <span className="sm:hidden">{autoSpin ? 'ORBIT' : 'ORBIT'}</span>
              </button>

              {/* Reset View Button */}
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-xl bg-[#121923] border border-white/[0.08] text-slate-400 hover:text-white hover:border-[#FF8A24]/40 transition-all"
                title="Reset camera and states"
                aria-label="Reset 3D view"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Substantially Enlarged 3D Canvas Viewport (Near Full-Screen on Desktop) */}
          <div className="relative w-full h-[72vh] sm:h-[78vh] lg:h-[84vh] min-h-[580px] bg-[#07090D]">
            {!hasWebGL || Boolean(webglError) ? (
              /* Fallback State when WebGL is unavailable or failed */
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#07090D] text-slate-300">
                <AlertTriangle className="w-12 h-12 text-[#FF8A24] mb-3" />
                <h3 className="font-display text-xl font-bold text-white mb-2">Hardware Telemetry View</h3>
                <p className="max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {webglError
                    ? `GPU 3D canvas reported: ${webglError}. System specifications remain accessible.`
                    : 'WebGL acceleration is unavailable in this environment. System specifications remain accessible.'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg text-left text-xs mb-6">
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
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-primary-orange px-5 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Retry 3D Initializer
                </button>
              </div>
            ) : !isVisible ? (
              /* Idle placeholder before mount / scroll */
              <div className="w-full h-full flex items-center justify-center bg-[#07090D] text-slate-500 text-xs font-mono">
                <span>// Initializing Client GPU Viewport...</span>
              </div>
            ) : (
              /* Active Client-Side 3D Canvas with Graceful Error Boundary */
              <ErrorBoundary
                name="Arduino3D"
                fallback={(error, reset) => (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#07090D] text-slate-300">
                    <AlertTriangle className="w-12 h-12 text-[#FF8A24] mb-3" />
                    <h3 className="font-display text-xl font-bold text-white mb-2">3D Renderer Diagnostics</h3>
                    <p className="max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                      {error?.message || 'A non-fatal rendering exception occurred.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        reset();
                        handleReset();
                      }}
                      className="btn-primary-orange px-5 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      Reload 3D Module
                    </button>
                  </div>
                )}
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
              <div className="absolute top-4 left-4 z-20 max-w-xs sm:max-w-sm rounded-2xl p-4 bg-[#0D1118]/95 border border-white/[0.14] backdrop-blur-xl shadow-2xl animate-in fade-in duration-200">
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
          </div>

        </div>
      </div>
    </section>
  );
};
