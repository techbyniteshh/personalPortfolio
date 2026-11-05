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
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react';
import { SKILL_CATEGORIES, SKILL_CERTIFICATES } from '../config/portfolio.ts';
import { CertificateModal, type CertificateModalData } from '../components/CertificateModal.tsx';
import type { CertificateItem } from '../types/portfolio.ts';

export const SkillsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'skills' | 'certificates'>('skills');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCert, setSelectedCert] = useState<CertificateModalData | null>(null);

  const categoryIcons: Record<string, React.ReactNode> = {
    'IoT & Embedded Systems': <Cpu className="w-4 h-4 text-orange-600" />,
    'Frontend Development': <Globe className="w-4 h-4 text-amber-600" />,
    'Backend & APIs': <Terminal className="w-4 h-4 text-orange-500" />,
    'AI & Data Science': <Sparkles className="w-4 h-4 text-orange-600" />,
    'Databases & Storage': <Database className="w-4 h-4 text-amber-700" />,
    'Dev Tools & Security': <Shield className="w-4 h-4 text-stone-700" />,
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
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Proficient':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Exploring':
        return 'bg-stone-100 text-stone-700 border-stone-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <section id="skills" className="py-20 bg-[#F4EFEA] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neu-inset text-xs font-semibold text-orange-700 mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>Technical Capabilities & Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2228] tracking-tight">
            Skills & Verified Certifications
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#4A5565] leading-relaxed">
            Hands-on technical competencies across IoT, Python, full-stack web, and AI, validated by credentials from Google AI Studio, Udemy, Cydenium, HP LIFE, and TCS iON.
          </p>
        </div>

        {/* View Switcher: Skills vs Certifications */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 rounded-2xl neu-inset inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'skills'
                  ? 'neu-raised text-orange-600 shadow-sm'
                  : 'text-[#4A5565] hover:text-[#1C2228]'
              }`}
              aria-pressed={activeTab === 'skills'}
            >
              <Wrench className="w-4 h-4" />
              <span>Skill Matrix ({SKILL_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0)})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('certificates')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'certificates'
                  ? 'neu-raised text-orange-600 shadow-sm'
                  : 'text-[#4A5565] hover:text-[#1C2228]'
              }`}
              aria-pressed={activeTab === 'certificates'}
            >
              <Award className="w-4 h-4 text-orange-600" />
              <span>Skill Certifications ({SKILL_CERTIFICATES.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SKILLS MATRIX */}
        {activeTab === 'skills' && (
          <div>
            {/* Filter Controls & Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl neu-inset w-full md:w-auto">
                {allCategories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'neu-raised text-orange-600 font-semibold'
                          : 'text-[#4A5565] hover:text-[#1C2228]'
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
                <Search className="w-4 h-4 text-[#8C9BAE] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search skill (e.g. ESP32, Python)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="neu-input w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium placeholder-[#8C9BAE]"
                  aria-label="Filter skills by keyword"
                />
              </div>
            </div>

            {/* Skill Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredCategories.map((category) => (
                <div
                  key={category.name}
                  className="neu-raised rounded-3xl p-6 bg-[#F4EFEA] border border-white/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-xl neu-inset flex items-center justify-center shrink-0">
                        {categoryIcons[category.name] || <Wrench className="w-4 h-4 text-orange-600" />}
                      </div>
                      <h3 className="font-bold text-base text-[#1C2228]">
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#55606E] mb-5">
                      {category.description}
                    </p>

                    {/* Skills Badges */}
                    <div className="space-y-3">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="neu-raised-sm rounded-xl p-3 bg-[#FAF7F2] border border-white/60 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs sm:text-sm text-[#1C2228]">
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
                                    className="text-[10px] text-[#6B7787] bg-[#ECE5DC] px-1.5 py-0.5 rounded"
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
            <div className="neu-raised-sm rounded-2xl p-5 bg-[#FAF7F2] border border-white/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-orange-600 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1C2228]">
                    Looking for proof of skills?
                  </h4>
                  <p className="text-xs text-[#55606E]">
                    Explore 5 verified credentials in Generative AI, Python Automation, Ethical Hacking, and Career Development.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('certificates')}
                className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-orange-600 hover:text-orange-700 shrink-0"
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
                  className="neu-raised rounded-3xl p-5 bg-[#F4EFEA] border border-white/80 flex flex-col justify-between hover:-translate-y-1 transition-all group"
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
                      className="relative w-full h-48 rounded-2xl overflow-hidden bg-[#22272E] border border-[#DDD5C9] mb-4 cursor-pointer select-none group/thumb flex items-center justify-center"
                      title="Click to view full certificate"
                    >
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                        <Eye className="w-4 h-4" />
                        <span>Inspect Certificate</span>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-[#1C2228]/80 text-[10px] font-mono text-white/90">
                        {cert.year}
                      </span>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                        {cert.category}
                      </span>
                      <span className="text-xs text-[#6B7787] flex items-center gap-1 font-medium">
                        <Building className="w-3 h-3 text-orange-600" />
                        {cert.issuer}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#1C2228] mb-2 leading-snug group-hover:text-orange-600 transition-colors">
                      {cert.title}
                    </h3>

                    <p className="text-xs text-[#55606E] leading-relaxed mb-4">
                      {cert.description}
                    </p>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cert.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] text-[#3A4555] border border-[#E2DACF]"
                        >
                          #{skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#E5DDD2] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Credential</span>
                    </button>
                    <a
                      href={cert.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-btn p-1.5 rounded-lg text-[#55606E] hover:text-[#1C2228]"
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
