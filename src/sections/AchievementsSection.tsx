import React, { useState } from 'react';
import {
  Trophy,
  Award,
  ExternalLink,
  Eye,
  Calendar,
  Building,
  RotateCw,
  Sparkles,
  ShieldCheck,
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
    <section id="achievements" className="py-20 bg-[#F4EFEA] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-semibold text-orange-700 mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Hackathon Milestones & Competitions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2228] tracking-tight">
            Achievements & Hackathon Certifications
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#4A5565] leading-relaxed">
            Verified competitive hackathon participation certificates from Smart India Hackathon (SIH), Stampers National Hackathon, and Vesdiam Technologies.
          </p>
        </div>

        {/* Hackathon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl mx-auto">
          {ACHIEVEMENTS_DATA.map((item) => (
            <div
              key={item.id}
              className="neu-raised rounded-3xl p-6 bg-[#FAF7F2] border border-white/80 hover:-translate-y-1 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Certificate Image Thumbnail with Rotation if Needed */}
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
                    className="relative w-full h-52 rounded-2xl overflow-hidden bg-[#20242A] border border-[#DDD5C9] mb-4 cursor-pointer select-none group/thumb flex items-center justify-center p-2"
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
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                      <Eye className="w-4 h-4" />
                      <span>Inspect Certificate</span>
                    </div>

                    {/* Rotation indicator badge if rotated */}
                    {item.rotate === 90 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-orange-600/90 text-[10px] font-mono text-white flex items-center gap-1">
                        <RotateCw className="w-3 h-3" />
                        <span>Landscape View</span>
                      </span>
                    )}

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-[#1C2228]/85 text-[10px] font-mono text-white/90">
                      {item.year}
                    </span>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                    {item.badgeType}
                  </span>
                  <span className="text-xs font-mono text-[#6B7787] flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    {item.year}
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-[#1C2228] mb-1.5 leading-snug group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs font-semibold text-orange-700 mb-3 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.issuer}</span>
                </p>

                <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#E5DDD2] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenCertificate(item)}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 focus:outline-none"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Certificate</span>
                </button>
                {item.imageUrl && (
                  <a
                    href={item.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neu-btn p-1.5 rounded-lg text-[#55606E] hover:text-[#1C2228]"
                    title="Open raw image in new tab"
                    aria-label={`Open original image of ${item.title}`}
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
