import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
  ShieldCheck,
  Server,
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio.ts';
import { validateContactForm } from '../utils/portfolio-logic.ts';
import type { ContactFormData, ContactApiResponse } from '../types/portfolio.ts';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    subject: '',
    category: 'Collaboration',
    message: '',
    preferredContact: 'Email',
    consent: false,
    websiteHoneypot: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<ContactApiResponse | null>(null);
  const [backendStatus, setBackendStatus] = useState<{
    emailServiceConfigured: boolean;
    provider: string;
    ownerEmailConfigured: boolean;
  } | null>(null);

  // Check backend service status on mount
  useEffect(() => {
    fetch('/api/contact/status')
      .then((res) => res.json())
      .then((data) => setBackendStatus(data))
      .catch((err) => console.log('Backend status check:', err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ContactApiResponse = await response.json();

      if (response.ok && data.success) {
        setSubmitResult(data);
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          category: 'Collaboration',
          message: '',
          preferredContact: 'Email',
          consent: false,
          websiteHoneypot: '',
        });
      } else {
        setSubmitResult(data);
        if (data.details) {
          setFormErrors(data.details);
        }
      }
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: 'Could not connect to the backend server. Please check your internet connection or email directly.',
        error: 'NETWORK_ERROR',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitResult(null);
    setFormErrors({});
  };

  return (
    <section id="contact" className="py-28 bg-[#07090D] text-[#F5F7FA] border-t border-white/[0.09] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF8A24]/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div data-reveal className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1118] border border-white/[0.1] text-xs font-mono font-medium text-[#FF8A24] mb-3 backdrop-blur-md">
            <Mail className="w-3.5 h-3.5" />
            <span>FINALE // DIRECT TRANSMISSION</span>
          </div>
          <h2 className="font-display text-display-2 text-white">
            Have a Project in Mind? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A24] via-[#FDBA74] to-[#49C8FF]">
              Let's Build It.
            </span>
          </h2>
          <p className="font-body mt-4 text-base text-[#A3ADBA] leading-relaxed">
            {PORTFOLIO_CONFIG.contact.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start">
          
          {/* Left Side: Contact Information & Guarantees (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl p-6 sm:p-8 bg-[#0D1118] border border-white/[0.09] shadow-xl">
              <h3 className="font-display font-bold text-xl text-white mb-4">
                Let's Build Something Meaningful
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#A3ADBA] leading-relaxed mb-6">
                Whether you're looking for an enthusiastic student developer, collaborating on open-source software, or discussing hardware IoT prototypes, I respond promptly.
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#121923] border border-white/[0.08] flex items-center justify-center text-[#FF8A24] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block">DIRECT INBOX</span>
                    <a
                      href={`mailto:${PORTFOLIO_CONFIG.contact.ownerEmail}`}
                      className="font-mono font-medium text-white hover:text-[#FF8A24] transition-colors"
                    >
                      {PORTFOLIO_CONFIG.contact.ownerEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#121923] border border-white/[0.08] flex items-center justify-center text-[#49C8FF] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block">RESPONSE GUARANTEE</span>
                    <span className="font-mono text-slate-200">Within 24–48 Business Hours</span>
                  </div>
                </div>
              </div>

              {/* Backend Service Status Badge */}
              {backendStatus && (
                <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#A3ADBA]">
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    <span>API: {backendStatus.provider}</span>
                  </div>
                  <span className="font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                    ONLINE
                  </span>
                </div>
              )}
            </div>

            {/* Email Flow Transparency Note */}
            <div className="rounded-2xl p-4 bg-[#040609] border border-white/[0.06] text-xs font-mono text-[#A3ADBA] space-y-2">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#FF8A24]" />
                <span>WHAT HAPPENS ON SUBMISSION?</span>
              </span>
              <p className="font-body text-xs text-slate-400 leading-relaxed">
                1. Your inquiry is validated and sanitized on the API gateway.<br />
                2. A secure notification is dispatched to Nitesh.<br />
                3. You receive an automatic confirmation receipt at your email address.
              </p>
            </div>
          </div>

          {/* Right Side: Working Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-8 bg-[#0D1118] border border-white/[0.09] shadow-xl">
              {submitResult && submitResult.success ? (
                /* Success State */
                <div className="text-center py-8 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Message Dispatched!
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-[#A3ADBA] leading-relaxed max-w-md mx-auto mb-6">
                    {submitResult.message}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#040609] border border-white/[0.06] max-w-md mx-auto text-left text-xs font-mono space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Owner Alert:</span>
                      <span className="text-emerald-400 font-medium">Dispatched</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Visitor Receipt:</span>
                      <span className="text-emerald-400 font-medium">Sent to your inbox</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-ghost-dark px-5 py-2.5 rounded-xl text-xs font-mono font-medium text-white hover:text-[#FF8A24]"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                /* Interactive Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Honeypot Spam Protection Field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="websiteHoneypot">Leave this blank</label>
                    <input
                      type="text"
                      id="websiteHoneypot"
                      name="websiteHoneypot"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.websiteHoneypot}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submission Error Banner */}
                  {submitResult && !submitResult.success && (
                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Delivery Warning</strong>
                        <span>{submitResult.message}</span>
                        <div className="mt-2">
                          <a
                            href={`mailto:${PORTFOLIO_CONFIG.contact.ownerEmail}?subject=Direct Inquiry via Portfolio&body=${encodeURIComponent(
                              formData.message
                            )}`}
                            className="underline font-mono text-[#FF8A24]"
                          >
                            Click here to email directly via your mail client &rarr;
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-mono font-medium text-slate-300 mb-1">
                        FULL NAME <span className="text-[#FF8A24]">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        placeholder="e.g. Maya Sharma"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#040609] border ${
                          formErrors.fullName ? 'border-red-500 bg-red-950/20' : 'border-white/[0.09]'
                        } text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8A24]/50`}
                      />
                      {formErrors.fullName && (
                        <p className="mt-1 text-[11px] font-mono text-red-400">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-mono font-medium text-slate-300 mb-1">
                        EMAIL ADDRESS <span className="text-[#FF8A24]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="e.g. maya@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#040609] border ${
                          formErrors.email ? 'border-red-500 bg-red-950/20' : 'border-white/[0.09]'
                        } text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8A24]/50`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-[11px] font-mono text-red-400">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Category and Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-xs font-mono font-medium text-slate-300 mb-1">
                        INQUIRY CATEGORY <span className="text-[#FF8A24]">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#040609] border border-white/[0.09] text-white focus:outline-none focus:border-[#FF8A24]/50"
                      >
                        {PORTFOLIO_CONFIG.contact.categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-[#0D1118] text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-xs font-mono font-medium text-slate-300 mb-1">
                        SUBJECT LINE <span className="text-[#FF8A24]">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        placeholder="e.g. Collaboration on Embedded IoT System"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#040609] border ${
                          formErrors.subject ? 'border-red-500 bg-red-950/20' : 'border-white/[0.09]'
                        } text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8A24]/50`}
                      />
                      {formErrors.subject && (
                        <p className="mt-1 text-[11px] font-mono text-red-400">{formErrors.subject}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="message" className="block text-xs font-mono font-medium text-slate-300">
                        MESSAGE DETAILS <span className="text-[#FF8A24]">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-slate-500">
                        {formData.message.length}/3000
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      placeholder="Hi Nitesh, I came across your portfolio and wanted to discuss..."
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-[#040609] border ${
                        formErrors.message ? 'border-red-500 bg-red-950/20' : 'border-white/[0.09]'
                      } text-white placeholder-slate-500 resize-none focus:outline-none focus:border-[#FF8A24]/50`}
                    />
                    {formErrors.message && (
                      <p className="mt-1 text-[11px] font-mono text-red-400">{formErrors.message}</p>
                    )}
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label htmlFor="preferredContact" className="block text-xs font-mono font-medium text-slate-300 mb-1">
                      PREFERRED REPLY CHANNEL (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      id="preferredContact"
                      name="preferredContact"
                      placeholder="e.g. Email / LinkedIn / Discord"
                      value={formData.preferredContact}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 rounded-xl text-xs font-medium bg-[#040609] border border-white/[0.09] text-white placeholder-slate-500 focus:outline-none focus:border-[#FF8A24]/50"
                    />
                  </div>

                  {/* Privacy Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className="mt-0.5 accent-[#FF8A24] rounded"
                      />
                      <span className="text-xs text-[#A3ADBA]">
                        I consent to Nitesh Chaurasiya processing my name and email solely for replying to this message. Zero spam.
                      </span>
                    </label>
                    {formErrors.consent && (
                      <p className="mt-1 text-[11px] font-mono text-red-400">{formErrors.consent}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary-orange w-full py-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Dispatching Transmission & Generating Receipt...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
