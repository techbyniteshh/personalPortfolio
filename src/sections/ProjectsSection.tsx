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
        return <BookOpen className="w-5 h-5 text-orange-400" />;
      case 'shopping-bag':
        return <ShoppingBag className="w-5 h-5 text-amber-400" />;
      case 'shield-check':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-orange-400" />;
      default:
        return <Layers className="w-5 h-5 text-orange-400" />;
    }
  };

  return (
    <section id="projects" className="py-24 bg-[#080B10] text-[#F0F4F8] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-orange-400 mb-3 backdrop-blur-sm">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Featured Work</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Projects
          </h2>
          <p className="font-body mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Hands-on software and embedded systems built to solve genuine problems. Real code, functional repositories, and verified architectures.
          </p>
        </div>

        {/* Filter Bar */}
        <div data-reveal data-reveal-delay="100" className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-white/[0.06] w-full sm:w-auto">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30'
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
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-[#0B0F18] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
              aria-label="Filter projects by title or tech"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl p-6 sm:p-7 bg-[#0D111A] border border-white/[0.08] flex flex-col justify-between hover:border-orange-500/35 hover:-translate-y-1 transition-all duration-200 shadow-lg group"
            >
              <div>
                {/* Card Top Meta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                    {getProjectIcon(project.iconName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Title & Tagline */}
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-1.5 group-hover:text-orange-400 transition-colors">
                  {project.name}
                </h3>
                <p className="font-body text-xs font-medium text-orange-400 mb-3">
                  {project.tagline}
                </p>

                {/* Description */}
                <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
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
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalProject(project)}
                  className="text-xs font-semibold text-slate-300 hover:text-orange-400 flex items-center gap-1.5 focus:outline-none transition-colors"
                  aria-label={`View architecture details for ${project.name}`}
                >
                  <Info className="w-3.5 h-3.5 text-orange-400" />
                  <span>Architecture & Details</span>
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-300 bg-slate-900/80 border border-slate-700/60 hover:text-orange-400 transition-colors"
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
                      className="neu-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
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
          <div className="rounded-3xl p-10 text-center max-w-md mx-auto my-8 bg-[#0D111A] border border-white/[0.08]">
            <FolderGit2 className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h4 className="font-heading font-bold text-base text-white mb-1">No projects matched</h4>
            <p className="font-body text-xs text-slate-400 mb-4">
              Try adjusting your search query or selecting another category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30"
            >
              Reset Filters
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
