import React from 'react';
import { Newspaper, Clock, Calendar, ArrowUpRight, Github, Linkedin, Twitter, Youtube, Mail } from 'lucide-react';
import { ARTICLES_DATA, PORTFOLIO_CONFIG } from '../config/portfolio.ts';

export const ArticlesSection: React.FC = () => {
  return (
    <section id="articles" className="py-20 bg-[#F4EFEA] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-semibold text-orange-700 mb-3">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Technical Writing & Notes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2228] tracking-tight">
            Technical Content & Explorations
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#4A5565] leading-relaxed">
            Documenting engineering challenges, architectural trade-offs, and hardware experimentation notes.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {ARTICLES_DATA.map((article) => (
            <div
              key={article.id}
              className="neu-raised rounded-3xl p-6 bg-[#FAF7F2] border border-white/80 hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#6B7787] mb-3">
                  <span className="font-mono text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded font-medium">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-orange-600" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-[#1C2228] mb-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed mb-4">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5DDD2] flex items-center justify-between">
                <span className="text-xs font-mono text-[#8C9BAE]">{article.date}</span>
                <a
                  href="#contact"
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <span>Discuss Note</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Connect & Social Hub */}
        <div className="neu-raised rounded-3xl p-8 bg-[#F4EFEA] border border-white/80 max-w-4xl mx-auto text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1C2228] mb-2">
            Connect Across Developer Platforms
          </h3>
          <p className="text-xs sm:text-sm text-[#55606E] mb-6 max-w-lg mx-auto">
            I'm always active sharing code snippets, discussing project architectures, and learning in public.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={PORTFOLIO_CONFIG.profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1C2228] flex items-center gap-2 hover:text-orange-600"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href={PORTFOLIO_CONFIG.profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1C2228] flex items-center gap-2 hover:text-orange-600"
            >
              <Linkedin className="w-4 h-4 text-blue-600" />
              <span>LinkedIn</span>
            </a>
            <a
              href={PORTFOLIO_CONFIG.profile.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1C2228] flex items-center gap-2 hover:text-orange-600"
            >
              <Twitter className="w-4 h-4 text-sky-500" />
              <span>X (Twitter)</span>
            </a>
            <a
              href={PORTFOLIO_CONFIG.profile.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1C2228] flex items-center gap-2 hover:text-orange-600"
            >
              <Youtube className="w-4 h-4 text-red-600" />
              <span>YouTube</span>
            </a>
            <a
              href={`mailto:${PORTFOLIO_CONFIG.profile.email}`}
              className="neu-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-[#1C2228] flex items-center gap-2 hover:text-orange-600"
            >
              <Mail className="w-4 h-4 text-orange-600" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
