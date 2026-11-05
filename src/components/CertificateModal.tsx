import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Award,
  CheckCircle,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-[#F4EFEA] border border-white/80 neu-raised-lg rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2DACF] flex items-center justify-between bg-[#F8F5F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-orange-600 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded">
                  {certificate.category || 'Verified Credential'}
                </span>
                <span className="text-xs font-mono text-[#6B7787] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {certificate.year}
                </span>
              </div>
              <h3 id="cert-modal-title" className="font-extrabold text-base sm:text-lg text-[#1C2228] leading-tight mt-0.5">
                {certificate.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="neu-btn p-2 rounded-xl text-[#55606E] hover:text-red-500 focus:outline-none"
              aria-label="Close certificate viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="relative flex-1 bg-[#23272D] overflow-auto flex items-center justify-center p-4 sm:p-6 min-h-[300px] sm:min-h-[420px]">
          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#1C2228]/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
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
            <a
              href={certificate.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-white/90 hover:text-orange-400 hover:bg-white/10 rounded-lg transition-colors"
              title="Open Raw Image in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Certificate Image with Dynamic CSS Rotation and Scale */}
          <div
            className="transition-transform duration-300 ease-out flex items-center justify-center max-w-full max-h-full"
            style={{
              transform: `rotate(${currentRotation}deg) scale(${scale})`,
            }}
          >
            <img
              src={certificate.imageUrl}
              alt={certificate.title}
              className="max-h-[55vh] sm:max-h-[60vh] max-w-full w-auto object-contain rounded-lg shadow-2xl border border-white/10"
              loading="lazy"
            />
          </div>
        </div>

        {/* Footer Meta & Description */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E2DACF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1C2228]">
              <Building className="w-3.5 h-3.5 text-orange-600" />
              <span>Issued by: {certificate.issuer}</span>
            </div>
            <p className="text-xs text-[#4A5565] leading-relaxed">
              {certificate.description}
            </p>
            {certificate.skills && certificate.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {certificate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EBE5DC] text-[#333E4C] border border-[#DDD5C9]"
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <a
              href={certificate.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <span>View Original</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="neu-btn px-3.5 py-2 rounded-xl text-xs font-medium text-[#4A5565]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
