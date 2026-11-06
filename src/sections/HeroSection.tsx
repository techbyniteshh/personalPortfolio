import React from 'react';
import {
  ChevronRight,
  Mail,
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.ts';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="hero-section relative min-h-[88vh] lg:min-h-screen flex items-center pt-32 pb-24 sm:pt-40 sm:pb-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Focused Identity & Editorial Headline (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col items-start z-10">
            
            {/* Architectural Headline with Playfair Display */}
            <h1
              data-reveal
              className="text-display-1 text-white mb-10 max-w-3xl font-bold tracking-tight leading-[1.12]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Building Ideas Into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A24] via-[#FDBA74] to-[#49C8FF]">
                Real-World
              </span>{' '}
              Digital Experiences.
            </h1>

            {/* Primary Action Buttons */}
            <div
              data-reveal
              data-reveal-delay="150"
              className="flex flex-wrap items-center gap-4 mb-12 w-full sm:w-auto"
            >
              <a
                href="#projects"
                className="btn-primary-orange px-8 py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform w-full sm:w-auto"
              >
                <span>View Projects</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="btn-ghost-dark px-8 py-4 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:border-[#FF8A24]/40 hover:text-[#FF8A24] backdrop-blur-md transition-all w-full sm:w-auto"
              >
                <Mail className="w-4 h-4 text-[#FF8A24]" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Minimal Social Links Row */}
            <div
              data-reveal
              data-reveal-delay="200"
              className="pt-6 border-t border-white/[0.08] w-full max-w-md flex items-center gap-3"
            >
              <span className="text-xs font-mono text-slate-400 mr-1">FIND ME ON:</span>
              <a
                href={PORTFOLIO_CONFIG.profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-slate-300 bg-[#0D1118]/80 border border-white/[0.08] hover:border-[#FF8A24]/40 hover:text-[#FF8A24] transition-all"
                aria-label="GitHub Profile"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_CONFIG.profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-slate-300 bg-[#0D1118]/80 border border-white/[0.08] hover:border-[#FF8A24]/40 hover:text-[#FF8A24] transition-all"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={PORTFOLIO_CONFIG.profile.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-slate-300 bg-[#0D1118]/80 border border-white/[0.08] hover:border-[#FF8A24]/40 hover:text-[#FF8A24] transition-all"
                aria-label="X / Twitter"
                title="X / Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${PORTFOLIO_CONFIG.profile.email}`}
                className="p-2.5 rounded-xl text-slate-300 bg-[#0D1118]/80 border border-white/[0.08] hover:border-[#FF8A24]/40 hover:text-[#FF8A24] transition-all"
                aria-label="Direct Email"
                title="Direct Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Right Column: Clean, Spacious Negative Space letting Cinematic Backdrop breathe */}
          <div className="lg:col-span-4 hidden lg:block pointer-events-none select-none" aria-hidden="true" />

        </div>
      </div>

      {/* Atmospheric Transition Mask to Next Chapter */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07090D] via-[#07090D]/60 to-transparent pointer-events-none z-10" />
    </section>
  );
};
