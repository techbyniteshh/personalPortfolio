import React from 'react';
import { X, ExternalLink, Github, CheckCircle } from 'lucide-react';
import type { Project } from '../types/portfolio.ts';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-[#0D111A] border border-white/[0.1] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#080B10]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                {project.category}
              </span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                {project.status}
              </span>
            </div>
            <h3 id="project-modal-title" className="font-heading font-extrabold text-xl sm:text-2xl text-white">
              {project.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-700/60 transition-colors focus:outline-none"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold mb-1">
              Problem & Solution Overview
            </h4>
            <p className="font-body text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.fullDetails && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold mb-3">
                Engineering Highlights & Architecture
              </h4>
              <ul className="space-y-2.5">
                {project.fullDetails.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <span className="font-body">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Technologies & Frameworks
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.08] text-xs font-mono text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.highlightMetric && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Key Impact: {project.highlightMetric}</span>
            </div>
          )}
        </div>

        {/* Footer with External Links */}
        <div className="p-5 border-t border-white/[0.08] bg-[#080B10] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/60 hover:text-white flex items-center gap-2 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
