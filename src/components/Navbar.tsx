import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Certs', href: '#achievements' },
    { name: 'Notes', href: '#articles' },
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
          {/* Brand Mark: Exclusive Logo Image */}
          <a
            href="#hero"
            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A24] rounded-full transition-transform hover:scale-105"
            aria-label="TechByNiteshh Homepage"
          >
            <img
              src="/channels4_profile.jpg"
              alt="TechByNiteshh Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-white/[0.15] shadow-md group-hover:border-[#FF8A24]/60 transition-all"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-[#0D1118]/80 border border-white/[0.08] backdrop-blur-md text-xs font-medium text-slate-300 shadow-inner">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full font-button text-[11px] tracking-wide transition-all duration-200 ${
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
                className={`block px-3.5 py-2.5 rounded-xl font-button text-xs tracking-wider ${
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
