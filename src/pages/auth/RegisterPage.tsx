import React, { useState, useEffect } from 'react';
import {
  signInWithGoogle,
  registerWithEmail,
  getDestinationForAccount
} from '../../services/authService';
import { store } from '../../services/store';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

interface RegisterPageProps {
  navigate: (route: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const currentUser = store.getCurrentUser();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      navigate(getDestinationForAccount(currentUser));
    }
  }, [currentUser, navigate]);

  const isBusy = isGoogleLoading || isEmailLoading;

  const handleGoogleSignUp = async () => {
    if (isBusy) return;
    setErrorMessage(null);
    setIsGoogleLoading(true);

    const res = await signInWithGoogle();
    if (res.redirectInitiated) return;

    setIsGoogleLoading(false);
    if (res.success && res.destination) {
      navigate(res.destination);
    } else {
      setErrorMessage(res.errorMessage || 'Google sign-up could not be completed.');
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsEmailLoading(true);
    const res = await registerWithEmail(email, password, fullName);
    setIsEmailLoading(false);

    if (res.success && res.destination) {
      navigate(res.destination);
    } else {
      setErrorMessage(res.errorMessage || 'Account creation failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white border border-slate-200 rounded-2xl p-5 sm:p-10 shadow-sm space-y-4 sm:space-y-6">
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="flex justify-center">
            <img
              src="/assets/aic_logo.jpg"
              alt="Africa Insurance Company S.C."
              className="h-10 sm:h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="space-y-1 sm:space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#12366e] tracking-tight">
              {t('auth.createTitle')}
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              {t('auth.createSubtitle')}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Continue with Google */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isBusy}
          aria-label="Continue with Google"
          className="w-full bg-white hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#12366e] focus-visible:ring-offset-2 border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#12366e]" />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{isGoogleLoading ? t('auth.connectingGoogle') : t('auth.continueGoogle')}</span>
        </button>

        {/* OR Divider */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-white px-3 text-slate-400 font-semibold">{t('auth.or')}</span>
          </div>
        </div>

        <form onSubmit={handleEmailRegister} className="space-y-3.5 sm:space-y-4 text-xs">
          <div>
            <label htmlFor="reg-name" className="block font-semibold text-slate-700 mb-1.5">
              {t('auth.fullName')}
            </label>
            <input
              id="reg-name"
              type="text"
              required
              autoComplete="name"
              placeholder="e.g. Abebe Tadesse"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="block font-semibold text-slate-700 mb-1.5">
              {t('auth.email')}
            </label>
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="block font-semibold text-slate-700 mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isBusy}
            className="w-full bg-[#12366e] hover:bg-[#0e2a58] text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
          >
            {isEmailLoading && <Loader2 className="w-4 h-4 animate-spin text-[#c59b27]" />}
            <span>{isEmailLoading ? t('auth.creatingAccount', 'Creating account...') : t('auth.createBtn')}</span>
            {!isEmailLoading && <ArrowRight className="w-4 h-4 text-[#c59b27]" />}
          </button>
        </form>

        <div className="space-y-3 pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
          <p>
            {t('auth.alreadyHave')}{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-[#12366e] hover:underline cursor-pointer"
            >
              {t('auth.signInBtn')}
            </button>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Customer accounts are provisioned securely via Firebase Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
};
