import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Coffee, Mail, ArrowUpRight } from 'lucide-react';
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
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#achievements' },
    { name: 'Articles', href: '#articles' },
    { name: 'Fuel Creativity', href: '#fuel' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F4EFEA]/95 py-3 shadow-[0_4px_20px_rgba(184,172,158,0.25)] border-b border-[#E8E1D5]'
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
            <div className="w-10 h-10 rounded-xl neu-raised flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-[#1C2228] block leading-tight">
                {PORTFOLIO_CONFIG.profile.name}
              </span>
              <span className="text-[11px] font-mono text-orange-600 font-semibold block">
                {PORTFOLIO_CONFIG.profile.logoSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full neu-inset text-xs font-medium text-[#4A5565]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'neu-raised text-orange-600 font-semibold shadow-sm'
                      : 'hover:text-[#1C2228]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
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
              className="neu-btn p-2 rounded-xl text-[#2D3748] focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-4 top-20 bg-[#F4EFEA] border border-white/80 rounded-2xl neu-raised-lg p-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'neu-inset text-orange-600 font-semibold'
                      : 'text-[#4A5565] hover:text-[#1C2228] hover:bg-[#EBE5DC]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <div className="pt-3 border-t border-[#E2DACF] mt-2 flex flex-col gap-2">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="neu-btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 text-center"
              >
                <Mail className="w-4 h-4" />
                <span>Let's Talk</span>
              </a>
              <a
                href="#fuel"
                onClick={() => setMobileMenuOpen(false)}
                className="neu-btn px-4 py-2.5 rounded-xl text-sm font-medium text-orange-700 flex items-center justify-center gap-2 text-center"
              >
                <Coffee className="w-4 h-4" />
                <span>Fuel My Creativity ☕</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
