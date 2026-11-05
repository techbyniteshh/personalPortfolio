import React, { useState } from 'react';
import {
  ArrowDown,
  Mail,
  FileText,
  Github,
  Linkedin,
  Sparkles,
  Cpu,
  Layers,
  Code2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.ts';
import { ThreeHeroScene } from '../components/ThreeHeroScene.tsx';
import { ResumeModal } from '../components/ResumeModal.tsx';

export const HeroSection: React.FC = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(PORTFOLIO_CONFIG.profile.isAvailable);

  const techBadges = [
    { label: 'Full-Stack React', icon: '⚛️' },
    { label: 'Python & FastAPI', icon: '🐍' },
    { label: 'IoT & ESP32', icon: '📡' },
    { label: 'TypeScript', icon: '🔷' },
    { label: 'AI & Gemini API', icon: '✨' },
  ];

  return (
    <section
      id="hero"
      className="hero-section relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Bio & Core Actions (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Owner Availability Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/60 text-xs font-medium text-slate-200 mb-6 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span>{PORTFOLIO_CONFIG.profile.availabilityStatus}</span>
              <span className="text-slate-500">&bull;</span>
              <span className="font-mono text-[11px] text-orange-400 font-semibold">2026</span>
            </div>

            {/* Profile Avatar Card + Name Header */}
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900/70 border border-white/20 flex items-center justify-center p-1 shrink-0 backdrop-blur-md shadow-lg group"
                title="Nitesh Chaurasiya — Student Developer"
              >
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center font-bold font-mono border border-white/10">
                  <span className="text-xl sm:text-2xl text-orange-400 font-extrabold">NC</span>
                  <span className="text-[9px] text-slate-300 uppercase tracking-wider font-sans">Student</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {PORTFOLIO_CONFIG.profile.name}
                </h2>
                <p className="text-sm font-medium text-slate-300">
                  {PORTFOLIO_CONFIG.profile.role} &bull; {PORTFOLIO_CONFIG.profile.location}
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5 drop-shadow-sm">
              Building Ideas Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                Real-World
              </span>{' '}
              Digital Experiences.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
              {PORTFOLIO_CONFIG.profile.subheadline}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8 w-full sm:w-auto">
              <a
                href="#projects"
                className="neu-btn-primary px-6 py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 w-full sm:w-auto"
              >
                <span>View My Projects</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="px-6 py-3.5 rounded-2xl text-sm font-semibold text-white bg-slate-900/70 hover:bg-slate-800/80 border border-slate-700/80 flex items-center justify-center gap-2 hover:text-orange-400 hover:border-orange-500/40 backdrop-blur-md transition-all shadow-sm w-full sm:w-auto"
              >
                <Mail className="w-4 h-4 text-orange-400" />
                <span>Let's Talk</span>
              </a>

              <button
                type="button"
                onClick={() => setIsResumeOpen(true)}
                className="px-5 py-3.5 rounded-2xl text-sm font-medium text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/70 flex items-center justify-center gap-2 hover:text-white hover:border-slate-600 backdrop-blur-md transition-all shadow-sm w-full sm:w-auto"
                aria-label="View and download student developer resume"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Resume / CV</span>
              </button>
            </div>

            {/* Social Links & Tech Quick Badges */}
            <div className="pt-6 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <a
                  href={PORTFOLIO_CONFIG.profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl text-slate-300 bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 hover:text-orange-400 hover:border-orange-500/40 backdrop-blur-md transition-all"
                  aria-label="GitHub Profile"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={PORTFOLIO_CONFIG.profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl text-slate-300 bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 hover:text-orange-400 hover:border-orange-500/40 backdrop-blur-md transition-all"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${PORTFOLIO_CONFIG.profile.email}`}
                  className="p-2.5 rounded-xl text-slate-300 bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 hover:text-orange-400 hover:border-orange-500/40 backdrop-blur-md transition-all"
                  aria-label="Direct Email"
                  title="Direct Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {techBadges.map((badge) => (
                  <span
                    key={badge.label}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-700/60 text-[11px] font-medium text-slate-300 backdrop-blur-md flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Three.js Interactive 3D Model (5 Cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center z-10">
            <div className="w-full max-w-[500px] rounded-3xl p-3 border border-white/20 bg-slate-950/40 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <ThreeHeroScene />
            </div>
          </div>

        </div>
      </div>

      {/* Smooth bottom transition to blend hero into the light neumorphic page */}
      <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-[#F4EFEA] via-[#F4EFEA]/70 to-transparent pointer-events-none z-10" />

      {/* Resume Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </section>
  );
};
