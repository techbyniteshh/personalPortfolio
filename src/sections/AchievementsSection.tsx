import React, { useState } from 'react';
import {
  Trophy,
  Award,
  ExternalLink,
  Eye,
  Calendar,
  Building,
} from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '../config/portfolio.ts';
import { CertificateModal, type CertificateModalData } from '../components/CertificateModal.tsx';
import type { AchievementItem } from '../types/portfolio.ts';

export const AchievementsSection: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<CertificateModalData | null>(null);

  const handleOpenCertificate = (item: AchievementItem) => {
    if (!item.imageUrl) return;
    setSelectedCert({
      title: item.title,
      issuer: item.issuer,
      year: item.year,
      category: item.badgeType,
      imageUrl: item.imageUrl,
      rotate: item.rotate || 0,
      description: item.description,
    });
  };

  return (
    <section id="achievements" className="py-24 bg-[#080B10] text-[#F0F4F8] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-orange-400 mb-3 backdrop-blur-sm">
            <Trophy className="w-3.5 h-3.5" />
            <span>Hackathon Milestones & Competitions</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Achievements & Hackathon Certifications
          </h2>
          <p className="font-body mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Verified competitive hackathon participation certificates from Smart India Hackathon (SIH), Stampers National Hackathon, and Vesdiam Technologies.
          </p>
        </div>

        {/* Hackathon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl mx-auto">
          {ACHIEVEMENTS_DATA.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl p-6 bg-[#0D111A] border border-white/[0.08] hover:border-orange-500/35 hover:-translate-y-1 transition-all shadow-lg flex flex-col justify-between group"
            >
              <div>
                {/* Certificate Image Thumbnail */}
                {item.imageUrl && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleOpenCertificate(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleOpenCertificate(item);
                      }
                    }}
                    className="relative w-full h-52 rounded-2xl overflow-hidden bg-black/50 border border-white/[0.08] mb-4 cursor-pointer select-none group/thumb flex items-center justify-center p-2"
                    title="Click to view full certificate"
                  >
                    <div
                      className={`w-full h-full flex items-center justify-center transition-transform duration-300 ${
                        item.rotate === 90 ? 'rotate-90 scale-[1.3]' : 'group-hover/thumb:scale-105'
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="max-h-full max-w-full object-contain rounded"
                        loading="lazy"
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                      <Eye className="w-4 h-4" />
                      <span>Inspect Certificate</span>
                    </div>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white/90 border border-white/10">
                      {item.year}
                    </span>
                  </div>
                )}

                {/* Badge Category & Issuer */}
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <span className="text-[11px] font-mono font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded">
                    {item.badgeType}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Building className="w-3.5 h-3.5 text-orange-400" />
                    <span>{item.issuer}</span>
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base sm:text-lg text-white mb-2 leading-snug group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>

                <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                {item.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => handleOpenCertificate(item)}
                    className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1.5 focus:outline-none transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-orange-400" />
                    <span>Official Record</span>
                  </span>
                )}

                {item.verificationUrl && (
                  <a
                    href={item.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="External Verification"
                    aria-label={`Verify ${item.title}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Certificate Viewer Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  );
};
