import React from 'react';
import { Newspaper, Clock, ArrowUpRight } from 'lucide-react';
import { ARTICLES_DATA } from '../config/portfolio.ts';

export const ArticlesSection: React.FC = () => {
  return (
    <section id="articles" className="py-28 bg-[#07090D] text-[#F5F7FA] border-t border-white/[0.09] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1118] border border-white/[0.1] text-xs font-mono font-medium text-[#FF8A24] mb-3 backdrop-blur-md">
            <Newspaper className="w-3.5 h-3.5" />
            <span>CHAPTER 07 // TECHNICAL LOGS</span>
          </div>
          <h2 className="font-display text-display-2 text-white">
            Field Notes & Explorations
          </h2>
          <p className="font-body mt-4 text-base text-[#A3ADBA] leading-relaxed">
            Documenting engineering challenges, architectural trade-offs, and hardware experimentation notes.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES_DATA.map((article) => (
            <div
              key={article.id}
              className="rounded-3xl p-6 bg-[#0D1118] border border-white/[0.09] hover:border-[#FF8A24]/35 hover:-translate-y-1.5 transition-all shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span className="font-mono text-[11px] text-[#FF8A24] bg-[#FF8A24]/10 border border-[#FF8A24]/20 px-2 py-0.5 rounded font-medium">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[11px] text-[#A3ADBA]">
                    <Clock className="w-3 h-3 text-[#49C8FF]" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2 leading-snug group-hover:text-[#FF8A24] transition-colors">
                  {article.title}
                </h3>

                <p className="font-body text-xs sm:text-sm text-[#A3ADBA] leading-relaxed mb-4">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">{article.date}</span>
                <a
                  href="#contact"
                  className="text-xs font-mono font-semibold text-[#FF8A24] hover:text-[#FFA04D] flex items-center gap-1 transition-colors"
                >
                  <span>DISCUSS NOTE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
