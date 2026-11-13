import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { saveOnboardingProgress, signOutUser } from '../../services/authService';
import { useLanguage, AppLanguage } from '../../i18n/LanguageContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  LogOut,
  Save
} from 'lucide-react';

interface OnboardingPageProps {
  navigate: (route: string) => void;
  redirectRoute?: string;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ navigate, redirectRoute }) => {
  const currentUser = store.getCurrentUser();
  const { language, setLanguage, t } = useLanguage();
  const existingCustomer = currentUser
    ? store.getCustomers().find((c) => c.authUid === currentUser.uid)
    : undefined;

  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(
    currentUser?.phone || existingCustomer?.contactInformation.primaryPhone || ''
  );
  const [preferredLanguage, setPreferredLanguage] = useState<AppLanguage>(
    existingCustomer?.contactInformation.preferredLanguage || language || 'english'
  );
  const [city, setCity] = useState(existingCustomer?.address.city || 'Addis Ababa');
  const [subcity, setSubcity] = useState(existingCustomer?.address.subcityOrZone || 'Bole');
  const [idType, setIdType] = useState<'national_id' | 'passport' | 'kebele_id' | 'business_license'>(
    existingCustomer?.personalInformation.idType || 'national_id'
  );
  const [idNumber, setIdNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(Boolean(currentUser?.consentRecords?.termsAccepted));
  const [privacyAccepted, setPrivacyAccepted] = useState(Boolean(currentUser?.consentRecords?.dataProcessingAccepted));
  const [marketingConsent, setMarketingConsent] = useState(Boolean(currentUser?.consentRecords?.marketingConsent));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.onboardingStatus === 'complete') {
      navigate(redirectRoute || '/portal');
      return;
    }
    if (!firstName && currentUser.firstName) setFirstName(currentUser.firstName);
    if (!lastName && currentUser.lastName) setLastName(currentUser.lastName);
    if (!phone && currentUser.phone) setPhone(currentUser.phone);
  }, [currentUser, redirectRoute, navigate]);

  if (!currentUser) return null;

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter your full legal first and last name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please provide your Ethiopian or primary contact phone number.');
      return;
    }
    if (!termsAccepted || !privacyAccepted) {
      setErrorMessage('You must accept the AIC Terms of Service and Privacy & Data Processing Notice to activate your policyholder account.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveOnboardingProgress(
        currentUser.uid,
        {
          firstName,
          lastName,
          phone,
          preferredLanguage,
          city,
          subcity,
          idType,
          idNumber: idNumber.trim() || undefined,
          termsAccepted,
          privacyAccepted,
          marketingConsent
        },
        true
      );
      navigate(redirectRoute || '/portal');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to save your onboarding details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveForLater = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await saveOnboardingProgress(
        currentUser.uid,
        {
          firstName,
          lastName,
          phone,
          preferredLanguage,
          city,
          subcity,
          idType,
          idNumber: idNumber.trim() || undefined,
          termsAccepted,
          privacyAccepted,
          marketingConsent
        },
        false
      );
      setSavedNotice('Progress saved. You can resume completing your AIC account anytime.');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not save draft progress.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingSteps = [
    !firstName.trim() || !lastName.trim() ? 'Full legal name' : null,
    !phone.trim() ? 'Phone number' : null,
    !termsAccepted || !privacyAccepted ? 'Privacy & terms consent' : null
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-5 sm:p-10 shadow-sm space-y-5 sm:space-y-6">
        {/* Header with Google/Auth Profile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 sm:pb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Profile'}
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#c59b27]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#12366e] text-white flex items-center justify-center font-bold text-base sm:text-lg">
                {(currentUser.firstName?.[0] || 'A').toUpperCase()}
              </div>
            )}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#12366e]">
                AIC Customer Onboarding
              </span>
              <h1 className="text-lg sm:text-2xl font-bold text-slate-900">
                {t('onb.title')}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <span>Signed in as</span>
                <strong className="text-slate-800">{currentUser.email}</strong>
                {currentUser.emailVerified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await signOutUser();
              navigate('/login');
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 self-start sm:self-center cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('nav.signout')}</span>
          </button>
        </div>

        {/* Remaining Steps Indicator */}
        {remainingSteps.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#12366e] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">
                {remainingSteps.length} step{remainingSteps.length > 1 ? 's' : ''} remaining to activate your AIC customer profile:
              </strong>
              <span className="text-slate-600">{remainingSteps.join(' · ')}</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div role="alert" className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {savedNotice && (
          <div role="status" className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{savedNotice}</span>
          </div>
        )}

        <form onSubmit={handleComplete} className="space-y-4 sm:space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label htmlFor="onb-first" className="block font-semibold text-slate-700 mb-1.5">
                {t('onb.firstName')}
              </label>
              <input
                id="onb-first"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              />
            </div>
            <div>
              <label htmlFor="onb-last" className="block font-semibold text-slate-700 mb-1.5">
                {t('onb.lastName')}
              </label>
              <input
                id="onb-last"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label htmlFor="onb-phone" className="block font-semibold text-slate-700 mb-1.5">
                {t('onb.phone')}
              </label>
              <input
                id="onb-phone"
                type="tel"
                required
                placeholder="+251 91 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              />
            </div>
            <div>
              <label htmlFor="onb-lang" className="block font-semibold text-slate-700 mb-1.5">
                {t('onb.language')}
              </label>
              <select
                id="onb-lang"
                value={preferredLanguage}
                onChange={(e) => {
                  const nextLang = e.target.value as AppLanguage;
                  setPreferredLanguage(nextLang);
                  setLanguage(nextLang);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              >
                <option value="english">English</option>
                <option value="amharic">Amharic (አማርኛ)</option>
                <option value="oromo">Afaan Oromoo</option>
                <option value="tigrinya">Tigrinya (ትግርኛ)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label htmlFor="onb-city" className="block font-semibold text-slate-700 mb-1.5">
                {t('onb.city')}
              </label>
              <select
                id="onb-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              >
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Adama">Adama</option>
                <option value="Hawassa">Hawassa</option>
                <option value="Bahir Dar">Bahir Dar</option>
                <option value="Dire Dawa">Dire Dawa</option>
                <option value="Mekelle">Mekelle</option>
              </select>
            </div>
            <div>
              <label htmlFor="onb-subcity" className="block font-semibold text-slate-700 mb-1.5">
                {t('onb.subcity')}
              </label>
              <input
                id="onb-subcity"
                type="text"
                placeholder="e.g. Bole, Kirkos, Yeka"
                value={subcity}
                onChange={(e) => setSubcity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div>
              <span className="font-semibold text-slate-800 block">
                Identification Details (Optional now — required when issuing a policy)
              </span>
              <span className="text-[11px] text-slate-500">
                You may supply your National ID / Kebele ID / Passport now or later during policy underwriting.
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
              >
                <option value="national_id">Ethiopian National ID (Fayda)</option>
                <option value="passport">Passport</option>
                <option value="kebele_id">Kebele ID</option>
                <option value="business_license">Commercial Registration / TIN</option>
              </select>
              <input
                type="text"
                placeholder="ID Number (optional)"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-3 pt-3 border-t border-slate-100 text-slate-700">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#12366e]"
              />
              <span className="leading-relaxed">
                I accept the <strong>Africa Insurance Company (S.C.) Terms of Service</strong> and confirm my registration details are accurate. *
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#12366e]"
              />
              <span className="leading-relaxed">
                I acknowledge the <strong>AIC Privacy Notice</strong> and consent to processing my account data for policy administration under National Bank of Ethiopia regulations. *
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-[#12366e]"
              />
              <span className="leading-relaxed text-slate-500">
                Send me policy renewal reminders and important corporate service updates.
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={handleSaveForLater}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t('onb.saveLater')}</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#12366e] hover:bg-[#0e2a58] text-white px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-[#c59b27]" />}
              <span>{t('onb.completeBtn')}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4 text-[#c59b27]" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
