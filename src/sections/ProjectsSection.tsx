import React, { useState } from 'react';
import {
  FolderGit2,
  Github,
  BookOpen,
  ShoppingBag,
  ShieldCheck,
  Cpu,
  Layers,
  Search,
  ArrowUpRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { PROJECTS_DATA } from '../config/portfolio.ts';
import { filterProjects } from '../utils/portfolio-logic.ts';
import { ProjectModal } from '../components/ProjectModal.tsx';
import type { Project } from '../types/portfolio.ts';

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = ['All', 'Full-Stack', 'AI & Python', 'IoT & Hardware'];

  const filteredProjects = filterProjects(PROJECTS_DATA, selectedCategory, searchQuery);

  const getProjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'book-open':
        return <BookOpen className="w-5 h-5 text-[#FF8A24]" />;
      case 'shopping-bag':
        return <ShoppingBag className="w-5 h-5 text-[#49C8FF]" />;
      case 'shield-check':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-[#FF8A24]" />;
      default:
        return <Layers className="w-5 h-5 text-[#FF8A24]" />;
    }
  };

  return (
    <section id="projects" className="py-28 bg-[#07090D] text-[#F5F7FA] border-t border-white/[0.09] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1118] border border-white/[0.1] text-xs font-mono font-medium text-[#FF8A24] mb-3 backdrop-blur-md">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>CHAPTER 03 // VERIFIED ENGINEERING</span>
          </div>
          <h2 className="font-display text-display-2 text-white">
            Featured Case Studies
          </h2>
          <p className="font-body mt-4 text-base text-[#A3ADBA] leading-relaxed">
            Real systems built to solve authentic problems across web infrastructure, sensor hardware, and developer automation.
          </p>
        </div>

        {/* Filter Bar */}
        <div data-reveal data-reveal-delay="100" className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#0D1118] border border-white/[0.08] w-full sm:w-auto">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs transition-all ${
                    isSelected
                      ? 'bg-[#FF8A24]/20 text-[#FF8A24] font-semibold border border-[#FF8A24]/30 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  aria-pressed={isSelected}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono bg-[#040609] border border-white/[0.09] text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8A24]/50"
              aria-label="Filter projects by title or tech"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              className="rounded-3xl p-7 bg-[#0D1118] border border-white/[0.09] flex flex-col justify-between hover:border-[#FF8A24]/35 hover:-translate-y-1.5 transition-all duration-300 shadow-xl group relative overflow-hidden"
            >
              <div>
                {/* Card Top Meta */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#121923] border border-white/[0.08] flex items-center justify-center shrink-0">
                      {getProjectIcon(project.iconName)}
                    </div>
                    <span className="font-mono text-xs text-slate-500 tracking-wider">
                      // 0{idx + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-[#121923] text-slate-300 border border-white/[0.06]">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Title & Tagline */}
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-1.5 group-hover:text-[#FF8A24] transition-colors">
                  {project.name}
                </h3>
                <p className="font-mono text-xs text-[#FF8A24] mb-3">
                  {project.tagline}
                </p>

                {/* Description */}
                <p className="font-body text-xs sm:text-sm text-[#A3ADBA] leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.06] text-[11px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions & Details Trigger */}
              <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalProject(project)}
                  className="text-xs font-mono font-medium text-slate-300 hover:text-[#FF8A24] flex items-center gap-1.5 focus:outline-none transition-colors"
                  aria-label={`View architecture details for ${project.name}`}
                >
                  <Info className="w-3.5 h-3.5 text-[#FF8A24]" />
                  <span>ARCHITECTURE & SPECS</span>
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-300 bg-[#121923] border border-white/[0.08] hover:text-[#FF8A24] transition-colors"
                      title="View GitHub Repository"
                      aria-label={`View GitHub repository for ${project.name}`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary-orange px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
                      aria-label={`Launch live demo for ${project.name}`}
                    >
                      <span>Live Demo</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="rounded-3xl p-10 text-center max-w-md mx-auto my-8 bg-[#0D1118] border border-white/[0.08]">
            <FolderGit2 className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h4 className="font-display font-bold text-base text-white mb-1">No projects matched</h4>
            <p className="font-body text-xs text-[#A3ADBA] mb-4">
              Try adjusting your search query or selecting another category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-[#FF8A24] bg-[#FF8A24]/10 border border-[#FF8A24]/30"
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
