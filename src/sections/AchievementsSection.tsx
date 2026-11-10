import React, { useState } from 'react';
import {
  Trophy,
  Award,
  ExternalLink,
  Eye,
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
    <section id="achievements" className="py-28 bg-[#07090D] text-[#F5F7FA] border-t border-white/[0.09] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1118] border border-white/[0.1] text-xs font-mono font-medium text-[#FF8A24] mb-3 backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5" />
            <span>CHAPTER 05 // COMPETITIVE MILESTONES</span>
          </div>
          <h2 className="font-display text-display-2 text-white">
            Hackathon Honors
          </h2>
          <p className="font-body mt-4 text-base text-[#A3ADBA] leading-relaxed">
            Verified competitive hackathon participation certificates from Smart India Hackathon (SIH), Stampers National Hackathon, and Vesdiam Technologies.
          </p>
        </div>

        {/* Hackathon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl mx-auto">
          {ACHIEVEMENTS_DATA.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl p-6 bg-[#0D1118] border border-white/[0.09] hover:border-[#FF8A24]/35 hover:-translate-y-1 transition-all shadow-xl flex flex-col justify-between group"
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
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-mono font-semibold">
                      <Eye className="w-4 h-4 text-[#49C8FF]" />
                      <span>INSPECT CERTIFICATE</span>
                    </div>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 text-[10px] font-mono text-white/90 border border-white/10">
                      {item.year}
                    </span>
                  </div>
                )}

                {/* Badge Category & Issuer */}
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <span className="text-[11px] font-mono font-medium text-[#FF8A24] bg-[#FF8A24]/10 border border-[#FF8A24]/20 px-2.5 py-0.5 rounded">
                    {item.badgeType}
                  </span>
                  <span className="text-xs font-mono text-[#A3ADBA] flex items-center gap-1 font-medium">
                    <Building className="w-3.5 h-3.5 text-[#FF8A24]" />
                    <span>{item.issuer}</span>
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2 leading-snug group-hover:text-[#FF8A24] transition-colors">
                  {item.title}
                </h3>

                <p className="font-body text-xs sm:text-sm text-[#A3ADBA] leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                {item.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => handleOpenCertificate(item)}
                    className="text-xs font-mono font-semibold text-[#FF8A24] hover:text-[#FFA04D] flex items-center gap-1.5 focus:outline-none transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>VIEW CERTIFICATE</span>
                  </button>
                ) : (
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#FF8A24]" />
                    <span>OFFICIAL RECORD</span>
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
