import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Mail, Sparkles } from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.ts';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '01 3D Arduino', href: '#arduino-experience' },
    { name: '02 About', href: '#about' },
    { name: '03 Skills', href: '#skills' },
    { name: '04 Projects', href: '#projects' },
    { name: '05 Education', href: '#education' },
    { name: '06 Certs', href: '#achievements' },
    { name: '07 Notes', href: '#articles' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#07090D]/90 backdrop-blur-md py-3 border-b border-white/[0.08] shadow-2xl shadow-black/60'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Mark */}
          <a
            href="#hero"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A24] rounded-xl p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0D1118] border border-white/[0.12] flex items-center justify-center text-[#FF8A24] group-hover:border-[#FF8A24]/50 group-hover:scale-105 transition-all shadow-sm">
              <Terminal className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white block leading-tight">
                {PORTFOLIO_CONFIG.profile.name}
              </span>
              <span className="text-[11px] font-mono text-[#FF8A24] font-medium block tracking-wider">
                {PORTFOLIO_CONFIG.profile.logoSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#0D1118]/80 border border-white/[0.08] backdrop-blur-md text-xs font-medium text-slate-300 shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-[#FF8A24]/15 text-[#FF8A24] font-semibold border border-[#FF8A24]/30 shadow-sm'
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
              className="btn-primary-orange px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
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
              className="p-2 rounded-xl text-slate-300 bg-[#0D1118] border border-white/[0.1] hover:text-white focus:outline-none"
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
        <div className="lg:hidden bg-[#07090D]/95 border-b border-white/[0.09] backdrop-blur-xl px-4 pt-4 pb-6 space-y-2 animate-in fade-in duration-200">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl font-mono text-xs tracking-wider ${
                  isActive
                    ? 'text-[#FF8A24] bg-[#FF8A24]/10 font-semibold border border-[#FF8A24]/20'
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
              className="btn-primary-orange block w-full text-center py-2.5 rounded-xl text-sm font-semibold"
            >
              Contact Me
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
