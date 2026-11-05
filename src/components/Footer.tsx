import React from 'react';
import { Terminal, Github, Linkedin, Twitter, Youtube, Mail, Heart, ArrowUp } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.ts';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#ECE6DE] border-t border-[#DFD7CC] pt-16 pb-12 text-[#2D3748]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-[#D8CEBF]">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl neu-raised flex items-center justify-center text-orange-600">
              <Terminal className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-lg text-[#1C2228] block leading-tight">
                {PORTFOLIO_CONFIG.profile.name}
              </span>
              <span className="text-xs text-[#55606E]">
                <span className="font-mono text-orange-600 font-semibold">{PORTFOLIO_CONFIG.profile.logoSubtitle}</span> &bull; B.VOC in IoT &bull; Full-Stack &bull; Python
              </span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href={PORTFOLIO_CONFIG.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn p-2.5 rounded-xl text-[#2D3748] hover:text-orange-600"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={PORTFOLIO_CONFIG.profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn p-2.5 rounded-xl text-[#2D3748] hover:text-orange-600"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={PORTFOLIO_CONFIG.profile.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn p-2.5 rounded-xl text-[#2D3748] hover:text-orange-600"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={PORTFOLIO_CONFIG.profile.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn p-2.5 rounded-xl text-[#2D3748] hover:text-orange-600"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${PORTFOLIO_CONFIG.profile.email}`}
              className="neu-btn p-2.5 rounded-xl text-[#2D3748] hover:text-orange-600"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Legal & Motto */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#55606E]">
          <p className="font-medium text-center sm:text-left">
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
