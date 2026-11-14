import React from 'react';
import { store } from '../../services/store';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  Shield, 
  Award, 
  Users, 
  Building, 
  Target, 
  Compass, 
  Sparkles,
  MapPin,
  ExternalLink,
  Newspaper,
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#12366e] uppercase tracking-wider">
            <span>{t('nav.about')}</span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-bold text-[#12366e] tracking-tight leading-tight">
            {t('home.whyTitle')}
          </h1>
          <p className="text-sm text-[#c59b27] font-semibold italic">
            የላቀና ጥራት ያለው አገልግሎት መስጠት ቃል ኪዳናችን ነው !
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Africa Insurance Company (S.C.) was established as a premier privately owned composite insurer on December 8, 1994, in accordance with the Insurance Business Proclamation No. 86/1994 and the Commercial Code of Ethiopia. For over three decades, AIC has safeguarded Ethiopian families, enterprises, national infrastructure, and commercial transport corridors.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate(store.getCurrentUser() ? '/portal' : '/login')}
              className="bg-[#12366e] hover:bg-[#0e2a58] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>{t('hero.getStarted')}</span>
              <ArrowRight className="w-4 h-4 text-[#f0cb5a] transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/insurance')}
              className="bg-white hover:bg-slate-100 text-[#12366e] border border-slate-300 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              {t('nav.products')}
            </button>
          </div>
        </div>

        {/* Vision, Mission, and Core Values Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-[#12366e] text-[#f0cb5a] flex items-center justify-center shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
            <p className="text-sm text-slate-700 font-semibold italic">
              "Providing Safety and Assurance to Our Customers"
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              To shine as the most preferred, accessible, and market leader insurance company in the nation as measured by our customers, employees, and shareholders.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-[#12366e] text-[#f0cb5a] flex items-center justify-center shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              "To Provide the Most Reliable Insurance Products and Services to Our Existing and Potential Customers by Deploying Highly Competent and Motivated Employees and Up-to-Date Technologies."
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-[#12366e] text-[#f0cb5a] flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Core Corporate Values</h3>
            <ul className="text-xs text-slate-600 space-y-2 pt-1">
              <li>
                <strong className="text-slate-900">Adaptability</strong> — Swift response to market and customer needs
              </li>
              <li>
                <strong className="text-slate-900">Integrity</strong> — Ethical prudence &amp; unwavering transparency
              </li>
              <li>
                <strong className="text-slate-900">Customer Centric</strong> — Prioritizing client protection &amp; trust
              </li>
              <li>
                <strong className="text-slate-900">Employee Focused</strong> — Developing competent professional talent
              </li>
              <li>
                <strong className="text-slate-900">Team Work</strong> — Collective dedication toward excellence
              </li>
            </ul>
          </div>
        </div>

        {/* Financial Strength & Solvency Milestone */}
        <div className="bg-gradient-to-br from-[#12366e] via-[#164284] to-[#1c53a3] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#f0cb5a]">Actuarial Solvency & Growth</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Paid-Up Capital Reaching ETB 603+ Million, Scaling to ETB 2 Billion
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Africa Insurance Company began operations with a subscribed capital of ETB 30 million and paid-up capital of ETB 15 million. As of June 30, 2025, registered paid-up capital has grown to over ETB 603 million. With continued expansion across Addis Ababa and key economic corridors, AIC continually reinforces national underwriting reserves to safeguard customers nationwide.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/20">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#f0cb5a]">1994</div>
              <div className="text-xs text-slate-300 mt-1">Founded Dec 8, 1994</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#f0cb5a]">ETB 603M+</div>
              <div className="text-xs text-slate-300 mt-1">Paid-Up Capital (June 2025)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#f0cb5a]">100% Ethiopian</div>
              <div className="text-xs text-slate-300 mt-1">National Underwriter</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#f0cb5a]">30+ Years</div>
              <div className="text-xs text-slate-300 mt-1">Continuous Solvency</div>
            </div>
          </div>
        </div>

        {/* Corporate News & Recent Press Announcements */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-slate-200">
            <div>
              <div className="text-xs font-semibold text-[#12366e] uppercase tracking-wider">
                Corporate Disclosures & Press
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                Company News & Announcements
              </h2>
            </div>
            <button
              onClick={() => navigate('/media')}
              className="text-xs font-semibold text-[#12366e] hover:text-[#184486] flex items-center gap-1 group cursor-pointer"
            >
              <span>View All Reports & Press</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-[#12366e]">
                  Head Office Operations
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Africa Insurance Expands Headquarters & Central Assessment Hub on Bole Road
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To accelerate claims settlement and direct enterprise service, Africa Insurance Company S.C. has expanded its flagship Head Office operations and digital assessment hub along Bole Road in Addis Ababa.
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-100">
                January 2026 · Addis Ababa
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Corporate Milestone
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Africa Insurance Company Celebrates 30 Years of Unbroken Solvency & Excellence
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Marking three decades since founding on December 8, 1994, AIC commemorated its journey as one of Ethiopia’s pioneering private insurers with special awards to longstanding corporate policyholders.
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-100">
                December 2024 · Addis Ababa
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Digital Issuance
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Launch of Authoritative E-Policy Issuance & Instant Verification Ledger
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Under supervisory guidance from the National Bank of Ethiopia, AIC deployed its digitized policy issuance engine, allowing policyholders and enforcement authorities to verify certificates using secure SHA-256 validation.
                </p>
              </div>
              <div className="text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-100">
                January 2026 · Official Release
              </div>
            </div>
          </div>
        </div>

        {/* Head Office Location Section with Clean Google Map */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Africa Insurance Head Office Building
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Africa Avenue (Bole Road), Kirkos Sub-City, P.O. Box 12941, Addis Ababa, Ethiopia
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Africa+Insurance+Company+Head+Office+Bole+Road+Addis+Ababa"
                target="_blank"
                rel="noreferrer"
                className="bg-[#12366e] hover:bg-[#184486] text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner h-[380px] sm:h-[440px] relative">
            <iframe
              title="Africa Insurance Company Head Office Google Map"
              src="https://maps.google.com/maps?q=Africa%20Insurance%20Company%20Head%20Office%2C%20Africa%20Avenue%20Bole%20Road%20Addis%20Ababa&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};
