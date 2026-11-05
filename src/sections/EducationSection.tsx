import React from 'react';
import {
  GraduationCap,
  Calendar,
  MapPin,
  CheckCircle2,
  Cpu,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { EDUCATION_DATA } from '../config/portfolio.ts';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-20 bg-[#F4EFEA] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-semibold text-orange-700 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2228] tracking-tight">
            Education & Academic Journey
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#4A5565] leading-relaxed">
            Hands-on technical vocational degree in Internet of Things combined with strong CBSE senior secondary foundations.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:-translate-x-px before:h-full before:w-0.5 before:bg-[#DDD5C9]">
          {EDUCATION_DATA.map((item, index) => {
            const isEven = index % 2 === 0;
            const isCurrent = item.period.toLowerCase().includes('present');

            return (
              <div
                key={item.id}
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? 'sm:flex-row-reverse' : ''
                } gap-6 group`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full neu-raised bg-[#FAF7F2] border-2 border-orange-500 flex items-center justify-center text-orange-600 z-10 group-hover:scale-110 transition-transform">
                  {item.field.includes('IoT') || item.degree.includes('B.VOC') ? (
                    <Cpu className="w-4 h-4" />
                  ) : (
                    <GraduationCap className="w-4 h-4" />
                  )}
                </div>

                {/* Content Box */}
                <div className="w-full sm:w-[calc(50%-2rem)] pl-12 sm:pl-0">
                  <div className="neu-raised rounded-3xl p-6 sm:p-7 bg-[#FAF7F2] border border-white/80 hover:-translate-y-1 transition-all">
                    {/* Top Tag & Status */}
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-md">
                          {item.period}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Currently Pursuing
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#6B7787] flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-orange-600" />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    {/* Degree & Field */}
                    <h3 className="font-extrabold text-lg text-[#1C2228] mb-1 leading-snug">
                      {item.degree}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-orange-700 mb-2">
                      {item.field} &bull; {item.institution}
                    </p>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed mb-4">
                      {item.description}
                    </p>

                    {/* Highlights */}
                    {item.keyHighlights && (
                      <div className="space-y-2 pt-3 border-t border-[#E8E1D5]">
                        {item.keyHighlights.map((highlight, hIdx) => (
                          <div
                            key={hIdx}
                            className="flex items-start gap-2 text-xs text-[#55606E] leading-relaxed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                            <span>{highlight}</span>
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
