import React, { useState } from 'react';
import {
  Coffee,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Heart,
  ArrowRight,
  ShieldAlert,
  Sparkles,
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
    // Open UPI protocol link
    window.location.href = upiDeepLink;
    setHasInitiatedPayment(true);
  };

  return (
    <section id="fuel" className="py-20 bg-[#F4EFEA] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-semibold text-orange-700 mb-3">
            <Coffee className="w-3.5 h-3.5" />
            <span>Voluntary Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2228] tracking-tight">
            {PORTFOLIO_CONFIG.donation.heading}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#4A5565] leading-relaxed">
            {PORTFOLIO_CONFIG.donation.subheading}
          </p>
        </div>

        {/* Main Donation Card */}
        <div className="max-w-3xl mx-auto">
          <div className="neu-raised rounded-3xl p-6 sm:p-10 bg-[#FAF7F2] border border-white/80">
            {hasInitiatedPayment ? (
              /* Thank You / Initiated State */
              <div className="text-center py-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl neu-inset flex items-center justify-center text-orange-600 mx-auto mb-4">
                  <Heart className="w-8 h-8 fill-orange-500 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#1C2228] mb-2">
                  Thanks for the support! ☕❤️
                </h3>
                <p className="text-sm text-[#4A5565] max-w-md mx-auto mb-6 leading-relaxed">
                  You're helping keep the ideas flowing and fueling open-source student development.
                </p>

                <div className="neu-inset-sm p-4 rounded-2xl max-w-md mx-auto text-xs text-[#55606E] mb-6">
                  <p>
                    <strong>Note:</strong> Direct peer-to-peer UPI transfers do not require intermediate payment gateway fees or automatic receipts. Your contribution goes straight to hardware sensors, hosting, and learning materials.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setHasInitiatedPayment(false)}
                  className="neu-btn px-5 py-2.5 rounded-xl text-xs font-semibold text-[#1C2228] flex items-center gap-2 mx-auto hover:text-orange-600"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Back to Amount Selection</span>
                </button>
              </div>
            ) : (
              /* Interactive Amount Selector & UPI Trigger */
              <div>
                <p className="text-sm text-[#4A5565] leading-relaxed mb-6">
                  {PORTFOLIO_CONFIG.donation.description}
                </p>

                {/* Amount Selection Buttons */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1C2228] mb-3">
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
                              ? 'neu-inset text-orange-600 border border-orange-300 font-extrabold'
                              : 'neu-btn text-[#2D3748] hover:text-orange-600'
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
                          ? 'neu-inset text-orange-600 border border-orange-300 font-extrabold'
                          : 'neu-btn text-[#2D3748] hover:text-orange-600'
                      }`}
                    >
                      Custom ₹
                    </button>
                  </div>

                  {/* Custom Input */}
                  {isCustom && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-base font-bold text-[#1C2228]">₹</span>
                      <input
                        type="number"
                        min="10"
                        max="10000"
                        placeholder="Enter amount (e.g. 150)"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="neu-input w-48 px-3.5 py-2 rounded-xl text-sm font-bold"
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
                    className="neu-btn w-full sm:w-auto px-5 py-3.5 rounded-2xl text-xs font-semibold text-[#1C2228] flex items-center justify-center gap-2 hover:text-orange-600"
                    aria-expanded={showQrCode}
                  >
                    <QrCode className="w-4 h-4 text-orange-600" />
                    <span>{showQrCode ? 'Hide QR Code' : 'Scan UPI QR Code'}</span>
                  </button>
                </div>

                {/* QR Code Presentation Box */}
                {showQrCode && (
                  <div className="neu-inset-sm p-6 rounded-3xl mb-6 flex flex-col items-center justify-center animate-in fade-in duration-200">
                    <UpiQrCode value={upiDeepLink} size={190} />
                    <p className="mt-3 text-xs text-[#55606E] text-center max-w-sm">
                      Scan with Google Pay, PhonePe, Paytm, or any BHIM UPI compliant app to contribute {effectiveAmount > 0 ? `₹${effectiveAmount}` : 'voluntarily'}.
                    </p>
                  </div>
                )}

                {/* Copy UPI ID Bar */}
                <div className="p-3.5 rounded-2xl bg-[#EBE5DC] border border-[#DDD5C9] flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B7787] font-medium">VPA / UPI ID:</span>
                    <code className="font-mono font-bold text-[#1C2228] bg-white/70 px-2 py-0.5 rounded border border-[#DDD5C9]">
                      {PORTFOLIO_CONFIG.donation.upiId}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="neu-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1C2228] flex items-center gap-1.5 hover:text-orange-600"
                    aria-label="Copy UPI ID to clipboard"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#55606E]" />
                        <span>Copy UPI ID</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="mt-5 text-[11px] text-[#6B7787] leading-relaxed flex items-start gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
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
