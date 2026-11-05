import React from 'react';
import {
  ChevronRight,
  Mail,
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.ts';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="hero-section relative min-h-[85vh] sm:min-h-[90vh] flex items-center pt-28 pb-20 sm:pt-36 sm:pb-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Focused, Minimal Identity & Actions (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            
            {/* Small Availability Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-medium text-slate-200 mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{PORTFOLIO_CONFIG.profile.availabilityStatus}</span>
              <span className="text-slate-500">&bull;</span>
              <span className="font-mono text-[11px] text-orange-400 font-semibold">2026</span>
            </div>

            {/* Name & Professional Identity */}
            <div className="mb-4">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-orange-400 font-semibold block mb-1">
                {PORTFOLIO_CONFIG.profile.name}
              </span>
              <p className="text-sm sm:text-base text-slate-300 font-medium">
                {PORTFOLIO_CONFIG.profile.role}
              </p>
            </div>

            {/* Strong Concise Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5">
              Building Ideas Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                Real-World
              </span>{' '}
              Digital Experiences.
            </h1>

            {/* Concise 2-3 Line Introduction */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mb-8">
              {PORTFOLIO_CONFIG.profile.subheadline}
            </p>

            {/* Two Primary Buttons Only */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <a
                href="#projects"
                className="neu-btn-primary px-7 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform w-full sm:w-auto"
              >
                <span>View Projects</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="px-7 py-3.5 rounded-2xl text-sm font-semibold text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center gap-2 hover:text-orange-400 hover:border-orange-500/40 backdrop-blur-sm transition-all shadow-sm w-full sm:w-auto"
              >
                <Mail className="w-4 h-4 text-orange-400" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Minimal Social Links Row */}
            <div className="pt-6 border-t border-slate-800/80 w-full max-w-md flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium mr-1">Find me on:</span>
              <a
                href={PORTFOLIO_CONFIG.profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-slate-300 bg-slate-900/70 hover:bg-slate-800 border border-slate-700/60 hover:text-orange-400 transition-all"
                aria-label="GitHub Profile"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_CONFIG.profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-slate-300 bg-slate-900/70 hover:bg-slate-800 border border-slate-700/60 hover:text-orange-400 transition-all"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_CONFIG.profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-slate-300 bg-slate-900/70 hover:bg-slate-800 border border-slate-700/60 hover:text-orange-400 transition-all"
                aria-label="X / Twitter"
                title="X / Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${PORTFOLIO_CONFIG.profile.email}`}
                className="p-2 rounded-xl text-slate-300 bg-slate-900/70 hover:bg-slate-800 border border-slate-700/60 hover:text-orange-400 transition-all"
                aria-label="Direct Email"
                title="Direct Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Right Column: Intentionally Spacious Negative Space (5 Cols) */}
          {/* Preserves visual balance while showcasing the cinematic atmospheric lighting */}
          <div className="lg:col-span-5 hidden lg:flex flex-col items-end justify-center pointer-events-none select-none">
            {/* Minimal subtle badge anchoring the negative space */}
            <div className="p-4 rounded-2xl bg-slate-900/30 border border-white/5 backdrop-blur-xs text-right max-w-xs">
              <span className="text-[11px] font-mono text-orange-400 font-semibold block mb-0.5">
                Hardware &bull; Code &bull; Cloud
              </span>
              <p className="text-xs text-slate-400/80 leading-relaxed">
                Exploring physical computing and modern full-stack web applications.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Smooth bottom transition blending hero into the dark Arduino showcase */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070C15] to-transparent pointer-events-none z-10" />
    </section>
  );
};
