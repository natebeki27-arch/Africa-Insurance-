import React, { useState } from 'react';
import { store } from '../services/store';
import { signOutUser, getDestinationForAccount } from '../services/authService';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PWAInstallButton } from './PWAInstallButton';
import { Shield, ChevronDown, Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import { ResponsiveImage } from './ResponsiveImage';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const currentUser = store.getCurrentUser();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-18 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark & Official AIC Logo with Secret 5-Click Admin Trigger */}
        <button
          onClick={handleLogoClick}
          title="Africa Insurance Company S.C."
          className="flex items-center gap-3 text-left shrink-0 group focus:outline-none cursor-pointer"
        >
          <ResponsiveImage
            src="/assets/aic_logo.jpg"
            alt="Africa Insurance Company S.C."
            priority
            sizes="(max-width: 639px) 120px, 160px"
            pictureClassName="inline-block"
            className="h-9 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            onFallbackError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallback = target.closest('button')?.querySelector('.logo-fallback');
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
          <div className="logo-fallback hidden flex items-center gap-2">
            <span className="text-lg sm:text-xl font-black text-[#12366e] tracking-tight">AFRICA INSURANCE</span>
            <span className="text-xs font-bold text-[#c59b27] px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200">S.C.</span>
          </div>
        </button>

        {/* Zone 2: Navigation Links matching africainsurancesc.com */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          <button
            onClick={() => navigate('/about')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/about' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            {t('nav.about')}
          </button>
          <button
            onClick={() => navigate('/insurance')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute.startsWith('/insurance') ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            {t('nav.products')}
          </button>
          <button
            onClick={() => navigate('/claims')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/claims' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            {t('nav.claims')}
          </button>
          <button
            onClick={() => navigate('/media')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/media' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            {t('nav.media')}
          </button>
          <button
            onClick={() => navigate('/verify-policy')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/verify-policy' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>{t('nav.verify')}</span>
          </button>
          <button
            onClick={() => navigate('/branches')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/branches' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            {t('nav.branches')}
          </button>
          <button
            onClick={() => navigate('/contact')}
            className={`whitespace-nowrap transition-colors hover:text-[#12366e] py-1 ${
              currentRoute === '/contact' ? 'text-[#12366e] font-semibold border-b-2 border-[#c59b27]' : ''
            }`}
          >
            {t('nav.contact')}
          </button>
        </nav>

        {/* Zone 3: Language Switcher, Install App & Account Menu / Sign In */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0 relative">
          <PWAInstallButton />
          <LanguageSwitcher variant="desktop" />
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || currentUser.firstName}
                    className="w-6 h-6 rounded-full object-cover border border-slate-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-[#12366e] text-white flex items-center justify-center text-[11px] font-bold">
                    {(currentUser.firstName?.[0] || currentUser.email?.[0] || 'A').toUpperCase()}
                  </span>
                )}
                <span className="max-w-[120px] truncate">
                  {currentUser.displayName || `${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.email}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900 truncate">
                      {currentUser.displayName || `${currentUser.firstName} ${currentUser.lastName}`.trim()}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      navigate(getDestinationForAccount(currentUser));
                    }}
                    className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#12366e] font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#12366e]" />
                    <span>
                      {currentUser.onboardingStatus === 'incomplete' && currentUser.accountType === 'customer'
                        ? t('nav.completeSetup')
                        : t('nav.dashboard')}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setAccountMenuOpen(false);
                      await signOutUser();
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2.5 text-rose-700 hover:bg-rose-50 font-semibold flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('nav.signout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="bg-[#12366e]/92 hover:bg-[#0e2a58] border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>{t('nav.signin')}</span>
            </button>
          )}
        </div>

        {/* Mobile quick language & menu trigger */}
        <div className="md:hidden flex items-center gap-2 shrink-0">
          <LanguageSwitcher variant="compact" />
          <button
            type="button"
            data-compact="true"
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
          <div className="pb-2 border-b border-slate-100 space-y-2">
            <LanguageSwitcher variant="pills" />
            <PWAInstallButton compact />
          </div>

          <button
            onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            {t('nav.about')}
          </button>
          <button
            onClick={() => { navigate('/insurance'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            {t('nav.products')}
          </button>
          <button
            onClick={() => { navigate('/claims'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            {t('nav.claims')}
          </button>
          <button
            onClick={() => { navigate('/media'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            {t('nav.media')}
          </button>
          <button
            onClick={() => { navigate('/verify-policy'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            {t('nav.verify')}
          </button>
          <button
            onClick={() => { navigate('/branches'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            {t('nav.branches')}
          </button>
          <button
            onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 hover:text-[#12366e]"
          >
            {t('nav.contact')}
          </button>

          <div className="pt-3 border-t border-slate-100">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate(getDestinationForAccount(currentUser));
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#12366e] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>{t('nav.dashboard')}</span>
                </button>
                <button
                  onClick={async () => {
                    await signOutUser();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full border border-slate-200 text-rose-700 py-2 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('nav.signout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="w-full bg-[#12366e] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>{t('nav.signin')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
