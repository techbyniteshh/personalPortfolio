import React from 'react';
import { Terminal, Github, Linkedin, Twitter, Youtube, Mail } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.ts';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05070B] border-t border-white/[0.06] pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-orange-400">
              <Terminal className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-white block leading-tight">
                {PORTFOLIO_CONFIG.profile.name}
              </span>
              <span className="font-body text-xs text-slate-400">
                <span className="font-mono text-orange-400 font-semibold">{PORTFOLIO_CONFIG.profile.logoSubtitle}</span> &bull; B.VOC in IoT &bull; Full-Stack &bull; Python
              </span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href={PORTFOLIO_CONFIG.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-orange-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PORTFOLIO_CONFIG.profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-orange-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={PORTFOLIO_CONFIG.profile.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-orange-400 transition-colors"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={PORTFOLIO_CONFIG.profile.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-orange-400 transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${PORTFOLIO_CONFIG.profile.email}`}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-orange-400 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Legal & Motto */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-body text-center sm:text-left">
            Designed with curiosity, built with code, and fueled by coffee. ☕
          </p>
          <p className="font-mono text-center sm:text-right">
            &copy; {currentYear} {PORTFOLIO_CONFIG.profile.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
