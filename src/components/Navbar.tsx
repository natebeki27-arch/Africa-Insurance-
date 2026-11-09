import React, { useState } from 'react';
import { store } from '../services/store';
import { Shield, ChevronDown, CheckCircle2, UserCheck, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const currentUser = store.getCurrentUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Secret trigger: clicking the logo 5 times within 2.5 seconds navigates to secret admin auth
  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 2200) {
      const nextCount = logoClicks + 1;
      if (nextCount >= 5) {
        setLogoClicks(0);
        navigate('/admin-auth');
        return;
      }
      setLogoClicks(nextCount);
    } else {
      setLogoClicks(1);
    }
    setLastClickTime(now);
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark & Official AIC Logo with Secret 5-Click Admin Trigger */}
        <button
          onClick={handleLogoClick}
          title="Africa Insurance Company S.C."
          className="flex items-center gap-3 text-left shrink-0 group focus:outline-none cursor-pointer"
        >
          <img
            src="/assets/aic_logo.jpg"
            alt="Africa Insurance Company S.C."
            className="h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.parentElement?.querySelector('.logo-fallback');
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <div className="logo-fallback hidden flex items-center gap-2">
            <span className="text-xl font-black text-[#12366e] tracking-tight">AFRICA INSURANCE</span>
            <span className="text-xs font-bold text-[#c59b27] px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200">S.C.</span>
          </div>
        </button>

        {/* Zone 2: Navigation Links matching africainsurancesc.com */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => navigate('/about')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/about' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => navigate('/insurance')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute.startsWith('/insurance') ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            Services & Products
          </button>
          <button
            onClick={() => navigate('/claims')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/claims' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            Claims
          </button>
          <button
            onClick={() => navigate('/media')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/media' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            Media & Reports
          </button>
          <button
            onClick={() => navigate('/verify-policy')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/verify-policy' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Verify Policy</span>
          </button>
          <button
            onClick={() => navigate('/branches')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/branches' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            Branches
          </button>
          <button
            onClick={() => navigate('/contact')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/contact' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 text-sm font-medium">
          <button
            onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            About Us
          </button>
          <button
            onClick={() => { navigate('/insurance'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            Services & Products
          </button>
          <button
            onClick={() => { navigate('/claims'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            Claims Service & Notification
          </button>
          <button
            onClick={() => { navigate('/media'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            Media & Annual Reports
          </button>
          <button
            onClick={() => { navigate('/verify-policy'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            Verify Policy Code
          </button>
          <button
            onClick={() => { navigate('/branches'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            Branch Directory
          </button>
          <button
            onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
};
