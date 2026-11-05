import React, { useState } from 'react';
import {
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Award,
  Calendar,
  Building,
} from 'lucide-react';

export interface CertificateModalData {
  title: string;
  issuer: string;
  year: string;
  category?: string;
  imageUrl: string;
  rotate?: number;
  description: string;
  skills?: string[];
  credentialUrl?: string;
}

interface CertificateModalProps {
  certificate: CertificateModalData | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
}) => {
  if (!certificate) return null;

  const [currentRotation, setCurrentRotation] = useState<number>(
    certificate.rotate || 0
  );
  const [scale, setScale] = useState<number>(1);

  const handleRotate = () => {
    setCurrentRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.75));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-[#0D111A] border border-white/[0.1] rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-[#080B10]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-orange-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-medium text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                  {certificate.category || 'Verified Credential'}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {certificate.year}
                </span>
              </div>
              <h3 id="cert-modal-title" className="font-heading font-extrabold text-base sm:text-lg text-white leading-tight mt-0.5">
                {certificate.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-700/60 transition-colors focus:outline-none"
              aria-label="Close certificate viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="relative flex-1 bg-[#06080D] overflow-auto flex items-center justify-center p-4 sm:p-6 min-h-[300px] sm:min-h-[420px]">
          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
            <button
              type="button"
              onClick={handleRotate}
              className="p-1.5 text-white/90 hover:text-orange-400 hover:bg-white/10 rounded-lg text-xs flex items-center gap-1 transition-colors"
              title="Rotate 90° Right"
            >
              <RotateCw className="w-4 h-4" />
              <span className="text-[11px] font-mono hidden sm:inline">{currentRotation}°</span>
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-white/90 hover:text-orange-400 hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-white/90 hover:text-orange-400 hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div
            style={{
              transform: `rotate(${currentRotation}deg) scale(${scale})`,
              transition: 'transform 0.25s ease-out',
            }}
            className="max-h-[60vh] max-w-full flex items-center justify-center"
          >
            <img
              src={certificate.imageUrl}
              alt={certificate.title}
              className="max-h-[55vh] max-w-full object-contain rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Description & Verification Footer */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#080B10] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-orange-400" />
                <span>Issued by {certificate.issuer}</span>
              </span>
            </div>
            <p className="font-body text-slate-300 max-w-2xl leading-relaxed">
              {certificate.description}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Done Viewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
