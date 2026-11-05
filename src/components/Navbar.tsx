import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Mail } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.ts';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '3D Arduino', href: '#arduino-experience' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#achievements' },
    { name: 'Articles', href: '#articles' },
    { name: 'Fuel', href: '#fuel' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080B10]/90 backdrop-blur-md py-3 border-b border-white/[0.08] shadow-lg shadow-black/50'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform backdrop-blur-sm shadow-sm">
              <Terminal className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-white block leading-tight">
                {PORTFOLIO_CONFIG.profile.name}
              </span>
              <span className="text-[11px] font-mono text-orange-400 font-medium block">
                {PORTFOLIO_CONFIG.profile.logoSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-950/70 border border-white/[0.08] backdrop-blur-md text-xs font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-orange-500/15 text-orange-400 font-semibold border border-orange-500/30'
                      : 'hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#contact"
              className="neu-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Let's Talk</span>
            </a>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 bg-slate-900/80 border border-slate-700/60 hover:text-white focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0E17]/95 border-b border-white/[0.08] backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-200">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'text-orange-400 bg-orange-500/10 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </a>
            );
          })}
          <div className="pt-3 border-t border-white/[0.08]">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="neu-btn-primary block w-full text-center py-2.5 rounded-xl text-sm font-semibold"
            >
              Contact Me
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
