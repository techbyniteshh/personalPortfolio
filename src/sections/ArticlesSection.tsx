import React from 'react';
import { Newspaper, Clock, ArrowUpRight } from 'lucide-react';
import { ARTICLES_DATA } from '../config/portfolio.ts';

export const ArticlesSection: React.FC = () => {
  return (
    <section id="articles" className="py-24 bg-[#080B10] text-[#F0F4F8] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-orange-400 mb-3 backdrop-blur-sm">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Technical Writing & Notes</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Technical Content & Explorations
          </h2>
          <p className="font-body mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Documenting engineering challenges, architectural trade-offs, and hardware experimentation notes.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES_DATA.map((article) => (
            <div
              key={article.id}
              className="rounded-3xl p-6 bg-[#0D111A] border border-white/[0.08] hover:border-orange-500/35 hover:-translate-y-1 transition-all shadow-lg flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded font-medium">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-400">
                    <Clock className="w-3 h-3 text-orange-400" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base sm:text-lg text-white mb-2 leading-snug group-hover:text-orange-400 transition-colors">
                  {article.title}
                </h3>

                <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">{article.date}</span>
                <a
                  href="#contact"
                  className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                >
                  <span>Discuss Note</span>
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
