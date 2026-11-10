import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldAlert, ExternalLink, Navigation } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        <div className="max-w-3xl space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#12366e] uppercase tracking-wider">
            <span>{t('nav.contact')}</span>
            <span aria-hidden="true">·</span>
            <span>Emergency Claims Support</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#12366e] tracking-tight">
            {t('pages.contactTitle')}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our corporate headquarters and regional branches are ready to assist with policy issuance, claims notification, policy verification, and operator partnerships.
          </p>
        </div>

        {/* Emergency Claims Callout */}
        <div className="bg-gradient-to-br from-[#0e2a58] via-[#12366e] to-[#184486] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">Emergency 24/7 Hotline</span>
              <h3 className="text-lg font-bold text-white mt-0.5">Accident & Urgent Loss Reporting</h3>
              <p className="text-xs text-slate-200 mt-1">For immediate traffic accident response or major property incidents in Addis Ababa or highway corridors.</p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <a
              href="tel:+251116637716"
              className="bg-[#c59b27] hover:bg-[#d4af37] text-[#0c2550] text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 font-mono whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span>+251 11 663 7716</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-sm text-xs">
              <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                Headquarters Office
              </h3>

              <div className="space-y-4 text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#12366e] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Africa Insurance Head Office Building</strong>
                    <span>Africa Avenue (Bole Road), P.O. Box 12941, Addis Ababa, Ethiopia</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#12366e] shrink-0" />
                  <div>
                    <strong className="text-slate-900 block">Switchboard Lines</strong>
                    <span className="font-mono">+251 11 663 7716 / 17 / 18 / 19</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#12366e] shrink-0" />
                  <div>
                    <strong className="text-slate-900 block">Managing Director Office</strong>
                    <span className="font-mono">+251 11 663 8094</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#12366e] shrink-0" />
                  <div>
                    <strong className="text-slate-900 block">Official Inquiries</strong>
                    <span className="font-mono">md@africainsurancesc.com / contact@africainsurancesc.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <Clock className="w-4 h-4 text-[#12366e] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Standard Working Hours</strong>
                    <span>Monday – Friday: 8:00 AM – 5:00 PM</span>
                    <span className="block mt-0.5">Saturday: 8:00 AM – 12:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-base font-bold text-[#12366e] mb-1">Send a Message</h3>
              <p className="text-xs text-slate-500 mb-6">Our corporate team will respond within 24 operational hours.</p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">Inquiry Received</h4>
                  <p className="text-xs text-emerald-700">Thank you. Your message has been routed to our corporate relations department.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                        placeholder="e.g. Dawit Wolde"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Telephone Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                        placeholder="+251 9..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                        placeholder="name@example.com"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Subject Area</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                      >
                        <option value="General Inquiry">General Corporate Inquiry</option>
                        <option value="Claims Status">Claims Status Follow-up</option>
                        <option value="Underwriting Quotation">Commercial Policy Quotation</option>
                        <option value="Operator Partnership">Direct-Sales Operator Program</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Message Details</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                      placeholder="Please describe your inquiry or policy requirements..."
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-[#12366e] hover:bg-[#0e2a58] text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5 text-[#c59b27]" />
                      <span>Transmit Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Location Section for Head Office */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#c59b27]" />
                <span>Verified Google Location</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
                Africa Insurance Head Office Building (Bole Road)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Africa Avenue (Bole Road), Kirkos Sub-City, P.O. Box: 12941, Addis Ababa, Ethiopia
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Africa+Insurance+Company+Head+Office+Bole+Road+Addis+Ababa"
                target="_blank"
                rel="noreferrer"
                className="bg-[#12366e] hover:bg-[#184486] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner h-[320px] sm:h-[380px] relative">
            <iframe
              title="Africa Insurance Company Head Office Google Map"
              src="https://maps.google.com/maps?q=Africa%20Insurance%20Company%20Head%20Office%2C%20Africa%20Avenue%20Bole%20Road%20Addis%20Ababa&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900 block font-semibold">GPS Coordinates</strong>
              <span className="font-mono text-slate-700">9.0018° N, 38.7845° E</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900 block font-semibold">Corridor Landmarks</strong>
              <span>Africa Avenue commercial boulevard, adjacent to Bole international axis</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <strong className="text-slate-900 block font-semibold">Direct Switchboards</strong>
              <span className="font-mono text-slate-700">+251 11 663 7716 / 17 / 18 / 19</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
