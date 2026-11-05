import React from 'react';
import { X, ExternalLink, Github, CheckCircle, Tag, Layers } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-[#F4EFEA] border border-white/80 neu-raised-lg rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E2DACF] flex items-center justify-between bg-[#F8F5F0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-wider">
                {project.category}
              </span>
              <span className="text-gray-400">&bull;</span>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                {project.status}
              </span>
            </div>
            <h3 id="project-modal-title" className="font-extrabold text-xl text-[#1C2228]">
              {project.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="neu-btn p-2 rounded-xl text-[#55606E] hover:text-red-500"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#4A5565]">
          <div className="neu-inset-sm p-4 rounded-2xl bg-[#ECE5DC]">
            <h4 className="text-xs font-bold text-[#1C2228] uppercase tracking-wider mb-1">
              Problem & Solution Overview
            </h4>
            <p className="text-xs sm:text-sm text-[#2D3748] leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.fullDetails && (
            <div>
              <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">
                Engineering Highlights & Architecture
              </h4>
              <ul className="space-y-2">
                {project.fullDetails.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#3A4555]">
                    <CheckCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-[#1C2228] uppercase tracking-wider mb-2">
              Technologies & Frameworks
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E0D7CB] text-xs font-medium text-[#1C2228]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.highlightMetric && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>Key Impact: {project.highlightMetric}</span>
            </div>
          )}
        </div>

        {/* Footer with External Links */}
        <div className="p-5 border-t border-[#E2DACF] bg-[#FAF7F2] flex items-center justify-between flex-wrap gap-3">
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
                className="neu-btn px-4 py-2 rounded-xl text-xs font-medium text-[#1C2228] flex items-center gap-2 hover:text-orange-600"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="neu-btn px-4 py-2 rounded-xl text-xs font-medium text-[#55606E]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
