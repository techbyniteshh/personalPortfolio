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
    <section id="fuel" className="py-24 bg-[#080B10] text-[#F0F4F8] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-orange-400 mb-3 backdrop-blur-sm">
            <Coffee className="w-3.5 h-3.5" />
            <span>Voluntary Support</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {PORTFOLIO_CONFIG.donation.heading}
          </h2>
          <p className="font-body mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            {PORTFOLIO_CONFIG.donation.subheading}
          </p>
        </div>

        {/* Main Donation Card */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl p-6 sm:p-10 bg-[#0D111A] border border-white/[0.08] shadow-xl">
            {hasInitiatedPayment ? (
              /* Thank You / Initiated State */
              <div className="text-center py-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mx-auto mb-4">
                  <Heart className="w-8 h-8 fill-orange-500 text-orange-400" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-2">
                  Thanks for the support! ☕❤️
                </h3>
                <p className="font-body text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
                  You're helping keep the ideas flowing and fueling open-source student development.
                </p>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] max-w-md mx-auto text-xs text-slate-400 mb-6">
                  <p>
                    <strong>Note:</strong> Direct peer-to-peer UPI transfers do not require intermediate payment gateway fees or automatic receipts. Your contribution goes straight to hardware sensors, hosting, and learning materials.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setHasInitiatedPayment(false)}
                  className="neu-btn px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 mx-auto hover:text-orange-400"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Back to Amount Selection</span>
                </button>
              </div>
            ) : (
              /* Interactive Amount Selector & UPI Trigger */
              <div>
                <p className="font-body text-sm text-slate-300 leading-relaxed mb-6">
                  {PORTFOLIO_CONFIG.donation.description}
                </p>

                {/* Amount Selection Buttons */}
                <div className="mb-6">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-3 font-semibold">
                    Select Contribution Amount (INR):
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
                          className={`py-3 px-4 rounded-2xl text-sm font-bold transition-all ${
                            isSelected
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                              : 'bg-[#0B0F18] border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20'
                          }`}
                        >
                          ₹{amt}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setIsCustom(true)}
                      className={`py-3 px-4 rounded-2xl text-sm font-bold transition-all ${
                        isCustom
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                          : 'bg-[#0B0F18] border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20'
                      }`}
                    >
                      Custom ₹
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
                        className="w-48 px-3.5 py-2 rounded-xl text-sm font-bold bg-[#0B0F18] border border-white/[0.08] text-white focus:outline-none focus:border-orange-500/50"
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
                    className="neu-btn-primary w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
                  >
                    <Coffee className="w-4 h-4" />
                    <span>
                      Buy Me a Coffee {effectiveAmount > 0 ? `(₹${effectiveAmount})` : ''} ☕
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowQrCode(!showQrCode)}
                    className="neu-btn w-full sm:w-auto px-5 py-3.5 rounded-2xl text-xs font-semibold text-white flex items-center justify-center gap-2 hover:text-orange-400"
                    aria-expanded={showQrCode}
                  >
                    <QrCode className="w-4 h-4 text-orange-400" />
                    <span>{showQrCode ? 'Hide QR Code' : 'Scan UPI QR Code'}</span>
                  </button>
                </div>

                {/* QR Code Presentation Box */}
                {showQrCode && (
                  <div className="p-6 rounded-3xl mb-6 bg-black/40 border border-white/[0.06] flex flex-col items-center justify-center animate-in fade-in duration-200">
                    <div className="p-3 bg-white rounded-2xl shadow-md">
                      <UpiQrCode value={upiDeepLink} size={190} />
                    </div>
                    <p className="mt-3 text-xs text-slate-400 text-center max-w-sm">
                      Scan with Google Pay, PhonePe, Paytm, or any BHIM UPI compliant app to contribute {effectiveAmount > 0 ? `₹${effectiveAmount}` : 'voluntarily'}.
                    </p>
                  </div>
                )}

                {/* Copy UPI ID Bar */}
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/[0.06] flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">VPA / UPI ID:</span>
                    <code className="font-mono font-bold text-orange-400 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.08]">
                      {PORTFOLIO_CONFIG.donation.upiId}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="neu-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 hover:text-orange-400"
                    aria-label="Copy UPI ID to clipboard"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="mt-5 text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
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
