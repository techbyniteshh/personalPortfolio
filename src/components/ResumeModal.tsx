import React, { useState } from 'react';
import {
  FileText,
  X,
  Download,
  ExternalLink,
  GraduationCap,
  Code2,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { PORTFOLIO_CONFIG, SKILL_CATEGORIES } from '../config/portfolio.ts';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-[#F4EFEA] border border-white/80 neu-raised-lg rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E2DACF] flex items-center justify-between bg-[#F8F5F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-orange-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 id="resume-title" className="font-bold text-lg text-[#1C2228]">
                Resume & Academic Profile
              </h3>
              <p className="text-xs text-[#55606E]">
                {PORTFOLIO_CONFIG.profile.name} &bull; {PORTFOLIO_CONFIG.profile.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="neu-btn px-3 py-1.5 rounded-xl text-xs font-medium text-[#2D3748] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="neu-btn p-2 rounded-xl text-[#55606E] hover:text-red-500"
              aria-label="Close resume preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#1C2228] text-sm">
          {/* Summary */}
          <div className="neu-inset-sm p-4 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
              Career Objective & Statement
            </h4>
            <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed">
              {PORTFOLIO_CONFIG.profile.subheadline} {PORTFOLIO_CONFIG.profile.statement}
            </p>
          </div>

          {/* Education */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Education</span>
            </h4>
            <div className="space-y-3">
              <div className="neu-raised-sm p-4 rounded-xl bg-[#FAF7F2]">
                <div className="flex justify-between items-baseline flex-wrap">
                  <h5 className="font-bold text-[#1C2228]">
                    Bachelor of Vocation (B.VOC) in Internet of Things
                  </h5>
                  <span className="text-xs font-mono font-semibold text-orange-600">2025 — Present</span>
                </div>
                <p className="text-xs text-[#55606E] mt-1">
                  Focus: Microcontrollers (ESP32/Arduino), Sensor Telemetry, MQTT Protocols, IoT Systems & Cloud Dashboards.
                </p>
              </div>
              <div className="neu-raised-sm p-4 rounded-xl bg-[#FAF7F2]">
                <div className="flex justify-between items-baseline flex-wrap">
                  <h5 className="font-bold text-[#1C2228]">
                    Higher Secondary Education (10+2) — CBSE
                  </h5>
                  <span className="text-xs font-mono text-[#55606E]">2021 — 2025</span>
                </div>
                <p className="text-xs text-[#55606E] mt-1">
                  Central Board of Secondary Education. Focus: Physics, Mathematics, Analytical Reasoning & Computer Science.
                </p>
              </div>
            </div>
          </div>

          {/* Key Competencies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>Technical Strengths</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="neu-inset-sm p-3 rounded-xl">
                <span className="font-semibold block text-[#1C2228] mb-1">Languages:</span>
                <span className="text-[#55606E]">Python, TypeScript, JavaScript, C++, SQL</span>
              </div>
              <div className="neu-inset-sm p-3 rounded-xl">
                <span className="font-semibold block text-[#1C2228] mb-1">Web & Backend:</span>
                <span className="text-[#55606E]">React, Next.js, Node.js, Express, FastAPI, Tailwind CSS</span>
              </div>
              <div className="neu-inset-sm p-3 rounded-xl">
                <span className="font-semibold block text-[#1C2228] mb-1">Databases & Cloud:</span>
                <span className="text-[#55606E]">PostgreSQL, MongoDB, SQLite, Redis, REST APIs</span>
              </div>
              <div className="neu-inset-sm p-3 rounded-xl">
                <span className="font-semibold block text-[#1C2228] mb-1">Hardware & AI:</span>
                <span className="text-[#55606E]">ESP32, MicroPython, MQTT Telemetry, Gemini API</span>
              </div>
            </div>
          </div>

          {/* Verification Note */}
          <div className="p-3 border border-[#E2DACF] rounded-xl flex items-center justify-between text-xs text-[#6B7787]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Curated Student Developer Portfolio Resume</span>
            </span>
            <a
              href={`mailto:${PORTFOLIO_CONFIG.profile.email}`}
              className="text-orange-600 font-semibold hover:underline"
            >
              Request Official Transcript &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
