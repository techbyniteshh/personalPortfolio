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
    'IoT & Embedded Systems': <Cpu className="w-4 h-4 text-orange-400" />,
    'Frontend Development': <Globe className="w-4 h-4 text-amber-400" />,
    'Backend & APIs': <Terminal className="w-4 h-4 text-orange-400" />,
    'AI & Data Science': <Sparkles className="w-4 h-4 text-amber-400" />,
    'Databases & Storage': <Database className="w-4 h-4 text-orange-500" />,
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
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'Proficient':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Exploring':
        return 'bg-slate-800 text-slate-300 border-slate-700/60';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <section id="skills" className="py-24 bg-[#080B10] text-[#F0F4F8] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div data-reveal className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-orange-400 mb-3 backdrop-blur-sm">
            <Wrench className="w-3.5 h-3.5" />
            <span>Technical Capabilities & Credentials</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Skills & Verified Certifications
          </h2>
          <p className="font-body mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Hands-on technical competencies across IoT, Python, full-stack web, and AI, validated by credentials from Google AI Studio, Udemy, Cydenium, HP LIFE, and TCS iON.
          </p>
        </div>

        {/* View Switcher: Skills vs Certifications */}
        <div data-reveal data-reveal-delay="100" className="flex justify-center mb-10">
          <div className="p-1 rounded-2xl bg-slate-950/80 border border-white/[0.08] inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'skills'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-pressed={activeTab === 'skills'}
            >
              <Wrench className="w-4 h-4" />
              <span>Skill Matrix ({SKILL_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0)})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('certificates')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'certificates'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-pressed={activeTab === 'certificates'}
            >
              <Award className="w-4 h-4 text-orange-400" />
              <span>Skill Certifications ({SKILL_CERTIFICATES.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SKILLS MATRIX */}
        {activeTab === 'skills' && (
          <div>
            {/* Filter Controls & Search */}
            <div data-reveal data-reveal-delay="150" className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-white/[0.06] w-full md:w-auto">
                {allCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30'
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
                  placeholder="Search skill (e.g. ESP32, Python)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-[#0B0F18] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                  aria-label="Filter skills by keyword"
                />
              </div>
            </div>

            {/* Skill Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredCategories.map((category) => (
                <div
                  key={category.name}
                  className="rounded-3xl p-6 bg-[#0D111A] border border-white/[0.08] flex flex-col justify-between hover:border-orange-500/30 transition-all shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                        {categoryIcons[category.name] || <Wrench className="w-4 h-4 text-orange-400" />}
                      </div>
                      <h3 className="font-heading font-bold text-base text-white">
                        {category.name}
                      </h3>
                    </div>
                    <p className="font-body text-xs text-slate-400 mb-5">
                      {category.description}
                    </p>

                    {/* Skills Badges */}
                    <div className="space-y-2.5">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="rounded-xl p-3 bg-black/30 border border-white/[0.05] flex items-center justify-between"
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
            <div className="rounded-2xl p-5 bg-[#0D111A] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-orange-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white">
                    Looking for proof of skills?
                  </h4>
                  <p className="font-body text-xs text-slate-400">
                    Explore 5 verified credentials in Generative AI, Python Automation, Ethical Hacking, and Career Development.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('certificates')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-orange-400 hover:text-orange-300 bg-orange-500/10 border border-orange-500/30 shrink-0 transition-colors"
              >
                View 5 Certificates &rarr;
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
                  className="rounded-3xl p-5 bg-[#0D111A] border border-white/[0.08] flex flex-col justify-between hover:border-orange-500/30 hover:-translate-y-1 transition-all group"
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
                      className="relative w-full h-48 rounded-2xl overflow-hidden bg-black/40 border border-white/[0.08] mb-4 cursor-pointer select-none group/thumb flex items-center justify-center"
                      title="Click to view full certificate"
                    >
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                        <Eye className="w-4 h-4" />
                        <span>Inspect Certificate</span>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white/90 border border-white/10">
                        {cert.year}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-mono font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                        {cert.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Building className="w-3 h-3 text-orange-400" />
                        {cert.issuer}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-white mb-2 leading-snug group-hover:text-orange-400 transition-colors">
                      {cert.title}
                    </h3>

                    <p className="font-body text-xs text-slate-400 leading-relaxed mb-4">
                      {cert.description}
                    </p>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 text-slate-300 border border-white/[0.06]"
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
                      className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Credential</span>
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
