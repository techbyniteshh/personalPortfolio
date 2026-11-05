import React, { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
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
        return <BookOpen className="w-5 h-5 text-orange-600" />;
      case 'shopping-bag':
        return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      case 'shield-check':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-orange-600" />;
      default:
        return <Layers className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <section id="projects" className="py-20 bg-[#F4EFEA] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-semibold text-orange-700 mb-3">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Featured Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2228] tracking-tight">
            Featured Projects
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#4A5565] leading-relaxed">
            Hands-on software and embedded systems built to solve genuine problems. Real code, functional repositories, and verified architectures.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl neu-inset w-full sm:w-auto">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'neu-raised text-orange-600 font-semibold'
                      : 'text-[#4A5565] hover:text-[#1C2228]'
                  }`}
                  aria-pressed={isSelected}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#8C9BAE] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neu-input w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium placeholder-[#8C9BAE]"
              aria-label="Filter projects by title or tech"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="neu-raised rounded-3xl p-6 sm:p-7 bg-[#F4EFEA] border border-white/80 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 group"
            >
              <div>
                {/* Card Top Meta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center shrink-0">
                    {getProjectIcon(project.iconName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#EAE2D7] text-[#4A5565]">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Title & Tagline */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#1C2228] mb-1.5 group-hover:text-orange-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs font-medium text-orange-700 mb-3">
                  {project.tagline}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed mb-5">
                  {project.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E2D9CD] text-[11px] font-medium text-[#2D3748]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions & Details Trigger */}
              <div className="pt-4 border-t border-[#E5DDD2] flex items-center justify-between flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModalProject(project)}
                  className="text-xs font-semibold text-[#1C2228] hover:text-orange-600 flex items-center gap-1.5 focus:outline-none"
                  aria-label={`View architecture details for ${project.name}`}
                >
                  <Info className="w-3.5 h-3.5 text-orange-600" />
                  <span>Architecture & Details</span>
                </button>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-btn p-2 rounded-xl text-[#2D3748] hover:text-orange-600"
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
                      className="neu-btn-primary px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
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
          <div className="neu-inset rounded-3xl p-10 text-center max-w-md mx-auto my-8">
            <FolderGit2 className="w-8 h-8 text-[#8C9BAE] mx-auto mb-3" />
            <h4 className="font-bold text-base text-[#1C2228] mb-1">No projects matched</h4>
            <p className="text-xs text-[#55606E] mb-4">
              Try adjusting your search query or selecting another category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-orange-600"
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
