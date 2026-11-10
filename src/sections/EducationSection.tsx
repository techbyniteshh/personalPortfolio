import React from 'react';
import {
  GraduationCap,
  MapPin,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { EDUCATION_DATA } from '../config/portfolio.ts';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-28 bg-[#07090D] text-[#F5F7FA] border-t border-white/[0.09] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1118] border border-white/[0.1] text-xs font-mono font-medium text-[#FF8A24] mb-3 backdrop-blur-md">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>CHAPTER 04 // ACADEMIC FOUNDATIONS</span>
          </div>
          <h2 className="font-display text-display-2 text-white">
            Academic Milestones
          </h2>
          <p className="font-body mt-4 text-base text-[#A3ADBA] leading-relaxed">
            Hands-on technical vocational degree in Internet of Things combined with strong CBSE senior secondary foundations.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:-translate-x-px before:h-full before:w-0.5 before:bg-white/[0.08]">
          {EDUCATION_DATA.map((item, index) => {
            const isEven = index % 2 === 0;
            const isCurrent = item.period.toLowerCase().includes('present');

            return (
              <div
                key={item.id}
                data-reveal
                data-reveal-delay={(index * 150).toString()}
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? 'sm:flex-row-reverse' : ''
                } gap-6 group`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0D1118] border-2 border-[#FF8A24] flex items-center justify-center text-[#FF8A24] z-10 group-hover:scale-110 transition-transform shadow-lg shadow-[#FF8A24]/20">
                  {item.field.includes('IoT') || item.degree.includes('B.VOC') ? (
                    <Cpu className="w-4 h-4" />
                  ) : (
                    <GraduationCap className="w-4 h-4" />
                  )}
                </div>

                {/* Content Box */}
                <div className="w-full sm:w-[calc(50%-2rem)] pl-12 sm:pl-0">
                  <div className="rounded-3xl p-6 sm:p-7 bg-[#0D1118] border border-white/[0.09] hover:border-[#FF8A24]/35 hover:-translate-y-1 transition-all shadow-xl">
                    {/* Top Tag & Status */}
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-[#FF8A24] bg-[#FF8A24]/10 border border-[#FF8A24]/20 px-2.5 py-0.5 rounded-md">
                          {item.period}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            CURRENTLY ENROLLED
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-[#A3ADBA] flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#FF8A24]" />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    {/* Degree & Field */}
                    <h3 className="font-display font-extrabold text-lg text-white mb-1 leading-snug">
                      {item.degree}
                    </h3>
                    <p className="font-mono text-xs text-[#FF8A24] mb-3">
                      {item.field} &bull; <span className="text-slate-300 font-sans">{item.institution}</span>
                    </p>

                    {/* Description */}
                    <p className="font-body text-xs sm:text-sm text-[#A3ADBA] leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Highlights */}
                    {item.keyHighlights && (
                      <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                        {item.keyHighlights.map((highlight, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF8A24] shrink-0 mt-0.5" />
                            <span className="font-body text-xs text-slate-300">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
