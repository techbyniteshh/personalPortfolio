import React, { useState } from 'react';
import {
  Wrench,
  Search,
  Globe,
  Terminal,
  Database,
  Sparkles,
  Cpu,
  Shield,
  Award,
  ExternalLink,
  Eye,
  Building,
} from 'lucide-react';
import { SKILL_CATEGORIES, SKILL_CERTIFICATES } from '../config/portfolio.ts';
import { CertificateModal, type CertificateModalData } from '../components/CertificateModal.tsx';

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'skills' | 'certificates'>('skills');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCert, setSelectedCert] = useState<CertificateModalData | null>(null);

  const categoryIcons: Record<string, React.ReactNode> = {
    'IoT & Embedded Systems': <Cpu className="w-4 h-4 text-[#49C8FF]" />,
    'Frontend Development': <Globe className="w-4 h-4 text-[#FF8A24]" />,
    'Backend & APIs': <Terminal className="w-4 h-4 text-[#49C8FF]" />,
    'AI & Data Science': <Sparkles className="w-4 h-4 text-[#FF8A24]" />,
    'Databases & Storage': <Database className="w-4 h-4 text-[#49C8FF]" />,
    'Dev Tools & Security': <Shield className="w-4 h-4 text-slate-400" />,
  };

  const allCategories = ['All', ...SKILL_CATEGORIES.map((c) => c.name)];

  const filteredCategories = SKILL_CATEGORIES.filter((cat) => {
    if (selectedCategory !== 'All' && cat.name !== selectedCategory) {
      return false;
    }
    return true;
  })
    .map((cat) => {
      const matchingSkills = cat.skills.filter((skill) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          skill.name.toLowerCase().includes(q) ||
          skill.tags?.some((t) => t.toLowerCase().includes(q))
        );
      });
      return {
        ...cat,
        skills: matchingSkills,
      };
    })
    .filter((cat) => cat.skills.length > 0);

  const getLevelBadgeClass = (level: 'Core' | 'Proficient' | 'Exploring') => {
    switch (level) {
      case 'Core':
        return 'bg-[#FF8A24]/15 text-[#FF8A24] border-[#FF8A24]/30';
      case 'Proficient':
        return 'bg-[#49C8FF]/15 text-[#49C8FF] border-[#49C8FF]/30';
      case 'Exploring':
        return 'bg-slate-800 text-slate-300 border-slate-700/60';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <section id="skills" className="py-28 bg-[#07090D] text-[#F5F7FA] border-t border-white/[0.09] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1118] border border-white/[0.1] text-xs font-mono font-medium text-[#FF8A24] mb-3 backdrop-blur-md">
            <Wrench className="w-3.5 h-3.5" />
            <span>CHAPTER 02 // ARCHITECTURAL STACK</span>
          </div>
          <h2 className="font-display text-display-2 text-white">
            Technical Capability Matrix
          </h2>
          <p className="font-body mt-4 text-base text-[#A3ADBA] leading-relaxed">
            Concrete technical competencies across IoT, Python, full-stack web, and AI, validated by credentials from Google AI Studio, Udemy, Cydenium, HP LIFE, and TCS iON.
          </p>
        </div>

        {/* View Switcher: Skills vs Certifications */}
        <div data-reveal data-reveal-delay="100" className="flex justify-center mb-10">
          <div className="p-1 rounded-2xl bg-[#0D1118] border border-white/[0.09] inline-flex items-center gap-2 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'skills'
                  ? 'bg-[#FF8A24]/20 text-[#FF8A24] border border-[#FF8A24]/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-pressed={activeTab === 'skills'}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>SKILL MATRIX ({SKILL_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0)})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('certificates')}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'certificates'
                  ? 'bg-[#FF8A24]/20 text-[#FF8A24] border border-[#FF8A24]/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-pressed={activeTab === 'certificates'}
            >
              <Award className="w-3.5 h-3.5 text-[#FF8A24]" />
              <span>VERIFIED CREDENTIALS ({SKILL_CERTIFICATES.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SKILLS MATRIX */}
        {activeTab === 'skills' && (
          <div>
            {/* Filter Controls & Search */}
            <div data-reveal data-reveal-delay="150" className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#0D1118] border border-white/[0.08] w-full md:w-auto">
                {allCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        isSelected
                          ? 'bg-[#FF8A24]/20 text-[#FF8A24] font-semibold border border-[#FF8A24]/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      aria-pressed={isSelected}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter (ESP32, Python)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono bg-[#040609] border border-white/[0.09] text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8A24]/50"
                  aria-label="Filter skills by keyword"
                />
              </div>
            </div>

            {/* Skill Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredCategories.map((category) => (
                <div
                  key={category.name}
                  className="rounded-3xl p-6 bg-[#0D1118] border border-white/[0.09] flex flex-col justify-between hover:border-[#FF8A24]/30 transition-all shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#121923] border border-white/[0.08] flex items-center justify-center shrink-0">
                        {categoryIcons[category.name] || <Wrench className="w-4 h-4 text-[#FF8A24]" />}
                      </div>
                      <h3 className="font-display font-bold text-base text-white">
                        {category.name}
                      </h3>
                    </div>
                    <p className="font-body text-xs text-[#A3ADBA] mb-5">
                      {category.description}
                    </p>

                    {/* Skills Badges */}
                    <div className="space-y-2.5">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="rounded-xl p-3 bg-black/40 border border-white/[0.06] flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs sm:text-sm text-slate-200">
                                {skill.name}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getLevelBadgeClass(
                                  skill.level
                                )}`}
                              >
                                {skill.level}
                              </span>
                            </div>
                            {skill.tags && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {skill.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-1.5 py-0.5 rounded"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fast-jump banner to certificates */}
            <div className="rounded-2xl p-5 bg-[#0D1118] border border-white/[0.09] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#121923] border border-white/[0.08] flex items-center justify-center text-[#FF8A24] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">
                    Looking for proof of skills?
                  </h4>
                  <p className="font-body text-xs text-[#A3ADBA]">
                    Explore 5 verified credentials in Generative AI, Python Automation, Ethical Hacking, and Career Development.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('certificates')}
                className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-[#FF8A24] hover:text-[#FFA04D] bg-[#FF8A24]/10 border border-[#FF8A24]/30 shrink-0 transition-colors"
              >
                VIEW 5 CREDENTIALS &rarr;
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SKILL CERTIFICATIONS GALLERY */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SKILL_CERTIFICATES.map((cert) => (
                <div
                  key={cert.id}
                  className="rounded-3xl p-5 bg-[#0D1118] border border-white/[0.09] flex flex-col justify-between hover:border-[#FF8A24]/30 hover:-translate-y-1 transition-all group"
                >
                  <div>
                    {/* Thumbnail Preview with Click-to-Zoom */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedCert(cert)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedCert(cert);
                        }
                      }}
                      className="relative w-full h-48 rounded-2xl overflow-hidden bg-black/50 border border-white/[0.08] mb-4 cursor-pointer select-none group/thumb flex items-center justify-center"
                      title="Click to view full certificate"
                    >
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-mono font-semibold">
                        <Eye className="w-4 h-4 text-[#49C8FF]" />
                        <span>INSPECT CREDENTIAL</span>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 text-[10px] font-mono text-white/90 border border-white/10">
                        {cert.year}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-mono font-medium text-[#FF8A24] bg-[#FF8A24]/10 border border-[#FF8A24]/20 px-2 py-0.5 rounded">
                        {cert.category}
                      </span>
                      <span className="text-xs text-[#A3ADBA] flex items-center gap-1 font-medium">
                        <Building className="w-3 h-3 text-[#FF8A24]" />
                        {cert.issuer}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-white mb-2 leading-snug group-hover:text-[#FF8A24] transition-colors">
                      {cert.title}
                    </h3>

                    <p className="font-body text-xs text-[#A3ADBA] leading-relaxed mb-4">
                      {cert.description}
                    </p>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-300 border border-white/[0.06]"
                        >
                          #{skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="text-xs font-mono font-semibold text-[#FF8A24] hover:text-[#FFA04D] flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>INSPECT DETAILS</span>
                    </button>
                    <a
                      href={cert.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Open full image in new tab"
                      aria-label={`Open original image of ${cert.title}`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Certificate Viewer Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  );
};
