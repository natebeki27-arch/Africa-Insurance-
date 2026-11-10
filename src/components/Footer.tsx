import React, { useState } from 'react';
import { store } from '../services/store';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { t } = useLanguage();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail.trim() || !emailPattern.test(newsletterEmail.trim())) {
      setFeedback({ type: 'error', message: 'Please provide a valid corporate or personal email address.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = store.addSubscriber(newsletterEmail, newsletterName, 'weekly', 'footer_signup');
      setIsSubmitting(false);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setNewsletterEmail('');
        setNewsletterName('');
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
      setTimeout(() => setFeedback(null), 6000);
    }, 400);
  };

  return (
    <footer className="bg-gradient-to-b from-[#112d5a] to-[#15386f] text-slate-300 border-t border-[#1e4d94]/50 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        
        {/* TOP ROW: NEWSLETTER SIGNUP BANNER */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#f0cb5a] uppercase tracking-wider">
                  {t('footer.stayInformed')}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f0cb5a]" />
                <span className="text-xs text-slate-300">{t('footer.gazette')}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {t('footer.newsletterTitle')}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t('footer.newsletterDesc')}
              </p>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newsletterName}
                    onChange={(e) => setNewsletterName(e.target.value)}
                    placeholder="Full Name (optional)"
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f0cb5a] focus:bg-white/15 transition-all w-full sm:w-1/3"
                  />
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email address (e.g. name@company.et)"
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f0cb5a] focus:bg-white/15 transition-all flex-1"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#f0cb5a] hover:bg-[#e0bb4a] text-[#0c2550] px-6 py-2.5 rounded-xl font-bold text-xs tracking-tight transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? t('footer.subscribing') : t('footer.subscribe')}</span>
                    <Send className="w-3.5 h-3.5 text-[#0c2550]" />
                  </button>
                </div>

                {feedback && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
                    feedback.type === 'success' 
                      ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300' 
                      : 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
                  }`}>
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{feedback.message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: 4 COLUMN DIRECTORY */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Corporate Profile & Verified Social Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">Africa Insurance Company S.C.</span>
            </div>
            <p className="text-xs text-[#f0cb5a] font-medium italic">
              "Committed to Excellence and Quality Services"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Established on December 8, 1994, Africa Insurance Company S.C. is one of Ethiopia's premier private composite insurers, licensed under NBE Proclamation No. 86/1994 with over ETB 603 million in paid-up capital.
            </p>

            {/* Social Media Section */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                {t('footer.connect')}
              </span>
              <div className="flex items-center gap-2.5">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/africa-insurance-company-s-c"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Africa Insurance Company S.C. on LinkedIn"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#0077b5] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent group shadow-sm hover:scale-105 cursor-pointer"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com/AfricaInsurEth"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Africa Insurance Company S.C. on Twitter (X)"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-black text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent group shadow-sm hover:scale-105 cursor-pointer"
                  aria-label="Twitter (X)"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/AfricaInsuranceCompany"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Africa Insurance Company S.C. on Facebook"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#1877f2] text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10 hover:border-transparent group shadow-sm hover:scale-105 cursor-pointer"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Public Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">{t('footer.publicServices')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors cursor-pointer text-left">
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/insurance')} className="hover:text-white transition-colors cursor-pointer text-left">
                  {t('nav.products')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/claims')} className="hover:text-white transition-colors cursor-pointer text-left">
                  {t('nav.claims')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/media')} className="hover:text-white transition-colors cursor-pointer text-left">
                  {t('nav.media')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/verify-policy')} className="hover:text-white transition-colors cursor-pointer text-left">
                  {t('nav.verify')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/branches')} className="hover:text-white transition-colors cursor-pointer text-left">
                  {t('nav.branches')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                  {t('nav.contact')}
                </button>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed select-none">
                  Careers
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Leadership & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">{t('footer.leadership')}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/board-of-directors')} className="hover:text-white text-[#f0cb5a] hover:underline transition-colors cursor-pointer text-left font-medium">
                  Board of Directors (10 Members)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/executive-managers')} className="hover:text-white text-[#f0cb5a] hover:underline transition-colors cursor-pointer text-left font-medium">
                  Executive Management Team
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/organizational-structure')} className="hover:text-white text-[#f0cb5a] hover:underline transition-colors cursor-pointer text-left font-medium">
                  Organizational Structure Chart
                </button>
              </li>
              <li className="pt-2 border-t border-slate-700/60">
                <span className="text-[11px] text-slate-400 font-semibold block uppercase tracking-wider">Internal Portals:</span>
              </li>
              <li>
                <button onClick={() => navigate('/portal')} className="hover:text-white text-slate-400 transition-colors text-left">
                  Customer Self-Service Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/operator')} className="hover:text-white text-slate-400 transition-colors text-left">
                  Direct-Sales Operator Academy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/staff')} className="hover:text-white text-slate-400 transition-colors text-left">
                  Underwriting & Risk Review
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate Headquarters */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">{t('footer.headquarters')}</h4>
            <div className="flex items-start gap-2.5 text-slate-400">
              <MapPin className="w-4 h-4 text-[#c59b27] shrink-0 mt-0.5" />
              <span>Africa Avenue (Bole Road), Head Office Building, P.O. Box: 12941, Addis Ababa, Ethiopia</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Phone className="w-4 h-4 text-[#c59b27] shrink-0" />
              <span>+251 11 663 7716 / 17 / 18 / 19</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Mail className="w-4 h-4 text-[#c59b27] shrink-0" />
              <span>md@africainsurancesc.com</span>
            </div>
            <div className="pt-2 border-t border-slate-700/50 flex items-center gap-1.5 text-[11px] text-[#f0cb5a]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('footer.licensed')}</span>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Africa Insurance Company S.C. (Ethiopia). All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
