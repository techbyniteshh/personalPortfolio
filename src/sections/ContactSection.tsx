import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Lock,
  ArrowRight,
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

    // Clear individual error as user types
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

    // 1. Client-side authoritative validation
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
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
        // Reset form upon true success
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
    <section id="contact" className="py-20 bg-[#F4EFEA] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full neu-inset text-xs font-semibold text-orange-700 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C2228] tracking-tight">
            {PORTFOLIO_CONFIG.contact.heading}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#4A5565] leading-relaxed">
            {PORTFOLIO_CONFIG.contact.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start">
          {/* Left Side: Contact Information & Guarantees (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="neu-raised rounded-3xl p-6 sm:p-8 bg-[#FAF7F2] border border-white/80">
              <h3 className="font-bold text-xl text-[#1C2228] mb-4">
                Let's Build Something Meaningful
              </h3>
              <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed mb-6">
                Whether you're looking for an enthusiastic student intern, wanting to collaborate on an open-source tool, or discussing hardware & IoT solutions, I respond promptly.
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl neu-inset flex items-center justify-center text-orange-600 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#6B7787] block font-medium">Direct Inbox</span>
                    <a
                      href={`mailto:${PORTFOLIO_CONFIG.contact.ownerEmail}`}
                      className="font-semibold text-[#1C2228] hover:text-orange-600 transition-colors"
                    >
                      {PORTFOLIO_CONFIG.contact.ownerEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl neu-inset flex items-center justify-center text-orange-600 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#6B7787] block font-medium">Response Guarantee</span>
                    <span className="font-semibold text-[#1C2228]">Within 24–48 Business Hours</span>
                  </div>
                </div>
              </div>

              {/* Backend Service Status Badge */}
              {backendStatus && (
                <div className="mt-6 pt-5 border-t border-[#E8E1D5] flex items-center justify-between text-[11px] text-[#55606E]">
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-emerald-600" />
                    <span>API: {backendStatus.provider}</span>
                  </div>
                  <span className="font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Online
                  </span>
                </div>
              )}
            </div>

            {/* Email Flow Transparency Note */}
            <div className="neu-inset-sm rounded-2xl p-4 bg-[#EBE5DC] text-xs text-[#55606E] space-y-2">
              <span className="font-bold text-[#1C2228] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-orange-600" />
                <span>What happens when you submit?</span>
              </span>
              <p className="leading-relaxed">
                1. Your input is validated & sanitized on the server.<br />
                2. A secure notification is dispatched to Nitesh.<br />
                3. You receive an automatic confirmation receipt at your email address.
              </p>
            </div>
          </div>

          {/* Right Side: Working Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="neu-raised rounded-3xl p-6 sm:p-8 bg-[#F4EFEA] border border-white/80">
              {submitResult && submitResult.success ? (
                /* Success State */
                <div className="text-center py-8 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-2xl neu-inset flex items-center justify-center text-emerald-600 mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1C2228] mb-2">
                    Message Dispatched!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4A5565] leading-relaxed max-w-md mx-auto mb-6">
                    {submitResult.message}
                  </p>

                  <div className="neu-inset-sm p-4 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-[#6B7787]">Owner Notification:</span>
                      <span className="text-emerald-700 font-medium font-mono">Dispatched</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7787]">Visitor Confirmation Email:</span>
                      <span className="text-emerald-700 font-medium font-mono">Sent to your inbox</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="neu-btn px-5 py-2.5 rounded-xl text-xs font-semibold text-[#1C2228] hover:text-orange-600"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* Interactive Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Honeypot Spam Protection Field (invisible to normal users) */}
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
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Delivery Warning</strong>
                        <span>{submitResult.message}</span>
                        <div className="mt-2">
                          <a
                            href={`mailto:${PORTFOLIO_CONFIG.contact.ownerEmail}?subject=Direct Inquiry via Portfolio&body=${encodeURIComponent(
                              formData.message
                            )}`}
                            className="underline font-semibold text-red-900"
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
                      <label htmlFor="fullName" className="block text-xs font-semibold text-[#2D3748] mb-1">
                        Full Name <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        placeholder="e.g. Maya Sharma"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`neu-input w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium ${
                          formErrors.fullName ? 'border-red-400 bg-red-50/50' : ''
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="mt-1 text-[11px] text-red-600">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-[#2D3748] mb-1">
                        Email Address <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="e.g. maya@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`neu-input w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium ${
                          formErrors.email ? 'border-red-400 bg-red-50/50' : ''
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-[11px] text-red-600">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Category and Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="category" className="block text-xs font-semibold text-[#2D3748] mb-1">
                        Inquiry Category <span className="text-orange-600">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="neu-input w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium"
                      >
                        {PORTFOLIO_CONFIG.contact.categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-xs font-semibold text-[#2D3748] mb-1">
                        Subject Line <span className="text-orange-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        placeholder="e.g. Collaboration on Open-Source Web Tool"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`neu-input w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium ${
                          formErrors.subject ? 'border-red-400 bg-red-50/50' : ''
                        }`}
                      />
                      {formErrors.subject && (
                        <p className="mt-1 text-[11px] text-red-600">{formErrors.subject}</p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="message" className="block text-xs font-semibold text-[#2D3748]">
                        Message Details <span className="text-orange-600">*</span>
                      </label>
                      <span className="text-[11px] font-mono text-[#8C9BAE]">
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
                      className={`neu-input w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium resize-none ${
                        formErrors.message ? 'border-red-400 bg-red-50/50' : ''
                      }`}
                    />
                    {formErrors.message && (
                      <p className="mt-1 text-[11px] text-red-600">{formErrors.message}</p>
                    )}
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label htmlFor="preferredContact" className="block text-xs font-semibold text-[#2D3748] mb-1">
                      Preferred Reply Method (Optional)
                    </label>
                    <input
                      type="text"
                      id="preferredContact"
                      name="preferredContact"
                      placeholder="e.g. Email / LinkedIn / Discord"
                      value={formData.preferredContact}
                      onChange={handleChange}
                      className="neu-input w-full px-3.5 py-2 rounded-xl text-xs font-medium"
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
                        className="mt-0.5 accent-orange-600 rounded"
                      />
                      <span className="text-xs text-[#55606E]">
                        I consent to Nitesh Chaurasiya processing my name and email solely for replying to this message. No marketing, no spam.
                      </span>
                    </label>
                    {formErrors.consent && (
                      <p className="mt-1 text-[11px] text-red-600">{formErrors.consent}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="neu-btn-primary w-full py-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Delivering Message & Sending Confirmation...</span>
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
