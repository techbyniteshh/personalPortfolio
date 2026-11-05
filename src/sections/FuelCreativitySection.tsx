import React, { useState } from 'react';
import {
  Coffee,
  QrCode,
  Copy,
  Check,
  Heart,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.ts';
import { buildUpiPaymentUri } from '../utils/portfolio-logic.ts';
import { UpiQrCode } from '../components/UpiQrCode.tsx';

export const FuelCreativitySection: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(
    PORTFOLIO_CONFIG.donation.defaultAmount
  );
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [hasInitiatedPayment, setHasInitiatedPayment] = useState<boolean>(false);

  const effectiveAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;

  const upiDeepLink = buildUpiPaymentUri({
    upiId: PORTFOLIO_CONFIG.donation.upiId,
    payeeName: PORTFOLIO_CONFIG.donation.payeeName,
    amount: effectiveAmount > 0 ? effectiveAmount : undefined,
    note: 'Fuel Nitesh Creativity & Tech Projects',
  });

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(PORTFOLIO_CONFIG.donation.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleInitiatePayment = () => {
    window.location.href = upiDeepLink;
    setHasInitiatedPayment(true);
  };

  return (
    <section id="fuel" className="py-24 bg-[#07090D] text-[#F5F7FA] border-t border-white/[0.09] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1118] border border-white/[0.1] text-xs font-mono font-medium text-[#FF8A24] mb-3 backdrop-blur-md">
            <Coffee className="w-3.5 h-3.5" />
            <span>COMMUNITY // VOLUNTARY BACKING</span>
          </div>
          <h2 className="font-display text-display-2 text-white">
            {PORTFOLIO_CONFIG.donation.heading}
          </h2>
          <p className="font-body mt-4 text-base text-[#A3ADBA] leading-relaxed">
            {PORTFOLIO_CONFIG.donation.subheading}
          </p>
        </div>

        {/* Main Donation Card */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-10 bg-[#0D1118] border border-white/[0.09] shadow-2xl">
            {hasInitiatedPayment ? (
              /* Thank You / Initiated State */
              <div className="text-center py-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF8A24] mx-auto mb-4">
                  <Heart className="w-8 h-8 fill-[#FF8A24] text-[#FF8A24]" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  Thanks for the support! ☕❤️
                </h3>
                <p className="font-body text-sm text-[#A3ADBA] max-w-md mx-auto mb-6 leading-relaxed">
                  You're helping keep the ideas flowing and fueling open-source student development.
                </p>

                <div className="p-4 rounded-2xl bg-[#040609] border border-white/[0.06] max-w-md mx-auto text-xs font-mono text-slate-400 mb-6">
                  <p>
                    <strong>Direct Transfer:</strong> Direct peer-to-peer UPI transfers bypass intermediary payment gateway fees. Contributions go straight to sensor modules, prototypes, and open-source hosting.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setHasInitiatedPayment(false)}
                  className="btn-ghost-dark px-5 py-2.5 rounded-xl text-xs font-mono font-medium text-white flex items-center gap-2 mx-auto hover:text-[#FF8A24]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>BACK TO AMOUNT SELECTION</span>
                </button>
              </div>
            ) : (
              /* Interactive Amount Selector & UPI Trigger */
              <div>
                <p className="font-body text-sm text-[#A3ADBA] leading-relaxed mb-6">
                  {PORTFOLIO_CONFIG.donation.description}
                </p>

                {/* Amount Selection Buttons */}
                <div className="mb-6">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-3 font-semibold">
                    SELECT CONTRIBUTION AMOUNT (INR):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PORTFOLIO_CONFIG.donation.presetAmounts.map((amt) => {
                      const isSelected = !isCustom && selectedAmount === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt);
                            setIsCustom(false);
                          }}
                          className={`py-3 px-4 rounded-2xl text-sm font-mono font-bold transition-all ${
                            isSelected
                              ? 'bg-[#FF8A24]/20 text-[#FF8A24] border border-[#FF8A24]/50 shadow-md shadow-[#FF8A24]/10'
                              : 'bg-[#040609] border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setIsCustom(true)}
                      className={`py-3 px-4 rounded-2xl text-sm font-mono font-bold transition-all ${
                        isCustom
                          ? 'bg-[#FF8A24]/20 text-[#FF8A24] border border-[#FF8A24]/50 shadow-md shadow-[#FF8A24]/10'
                          : 'bg-[#040609] border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20'
                      }`}
                    >
                      CUSTOM ₹
                    </button>
                  </div>

                  {/* Custom Input */}
                  {isCustom && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-base font-bold text-white">₹</span>
                      <input
                        type="number"
                        min="10"
                        max="10000"
                        placeholder="Enter amount (e.g. 150)"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-48 px-3.5 py-2 rounded-xl text-sm font-mono font-bold bg-[#040609] border border-white/[0.09] text-white focus:outline-none focus:border-[#FF8A24]/50"
                        aria-label="Custom voluntary contribution amount"
                      />
                    </div>
                  )}
                </div>

                {/* Actions: Primary UPI Button & QR Toggle */}
                <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-6">
                  <button
                    type="button"
                    onClick={handleInitiatePayment}
                    className="btn-primary-orange w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01]"
                  >
                    <Coffee className="w-4 h-4" />
                    <span>
                      Fuel Creativity {effectiveAmount > 0 ? `(₹${effectiveAmount})` : ''} ☕
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQrCode(!showQrCode)}
                    className="btn-ghost-dark w-full sm:w-auto px-5 py-3.5 rounded-2xl text-xs font-mono font-semibold text-white flex items-center justify-center gap-2 hover:text-[#FF8A24]"
                    aria-expanded={showQrCode}
                  >
                    <QrCode className="w-4 h-4 text-[#FF8A24]" />
                    <span>{showQrCode ? 'HIDE QR CODE' : 'SCAN UPI QR CODE'}</span>
                  </button>
                </div>

                {/* QR Code Presentation Box */}
                {showQrCode && (
                  <div className="p-6 rounded-3xl mb-6 bg-[#040609] border border-white/[0.08] flex flex-col items-center justify-center animate-in fade-in duration-200">
                    <div className="p-3 bg-white rounded-2xl shadow-md">
                      <UpiQrCode value={upiDeepLink} size={190} />
                    </div>
                    <p className="mt-3 text-xs font-mono text-[#A3ADBA] text-center max-w-sm">
                      Scan with Google Pay, PhonePe, Paytm, or BHIM app to contribute {effectiveAmount > 0 ? `₹${effectiveAmount}` : 'voluntarily'}.
                    </p>
                  </div>
                )}

                {/* Copy UPI ID Bar */}
                <div className="p-3.5 rounded-2xl bg-[#040609] border border-white/[0.08] flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-[11px]">VPA / UPI ID:</span>
                    <code className="font-mono font-bold text-[#FF8A24] bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.08]">
                      {PORTFOLIO_CONFIG.donation.upiId}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="btn-ghost-dark px-3 py-1.5 rounded-lg text-xs font-mono font-semibold text-white flex items-center gap-1.5 hover:text-[#FF8A24]"
                    aria-label="Copy UPI ID to clipboard"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>COPY ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="mt-5 text-[11px] font-mono text-slate-500 leading-relaxed flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#FF8A24] shrink-0 mt-0.5" />
                  <span>{PORTFOLIO_CONFIG.donation.disclaimer}</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
