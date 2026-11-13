import React, { useState, useEffect } from 'react';
import {
  signInWithGoogle,
  signInWithEmail,
  sendResetPasswordEmail,
  linkGoogleAccountToCurrentUser,
  getDestinationForAccount,
  isPermissionDeniedError,
  refreshAuthSessionToken,
  AuthHandshakeStage
} from '../../services/authService';
import { AuthHandshakeTracker } from '../../components/AuthHandshakeTracker';
import { ResponsiveImage } from '../../components/ResponsiveImage';
import { store } from '../../services/store';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Shield,
  Lock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';

interface LoginPageProps {
  navigate: (route: string) => void;
  redirectRoute?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate, redirectRoute }) => {
  const currentUser = store.getCurrentUser();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [conflictEmail, setConflictEmail] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);

  // Legal modal state
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const [isAutoRetrying, setIsAutoRetrying] = useState(false);
  const [handshakeStage, setHandshakeStage] = useState<AuthHandshakeStage>('idle');
  const [handshakeProvider, setHandshakeProvider] = useState<'google' | 'email'>('google');
  const [isTimeoutWarning, setIsTimeoutWarning] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate(getDestinationForAccount(currentUser, redirectRoute));
    }
  }, [currentUser, redirectRoute, navigate]);

  const isBusy = isGoogleLoading || isEmailLoading || isResetLoading || isAutoRetrying;

  const resetHandshakeState = () => {
    setIsGoogleLoading(false);
    setIsEmailLoading(false);
    setIsAutoRetrying(false);
    setHandshakeStage('idle');
    setIsTimeoutWarning(false);
  };

  const isPermissionIssue = (code?: string | null, message?: string | null) =>
    code === 'permission-denied' ||
    code === 'auth/permission-denied' ||
    /missing or insufficient permissions/i.test(message || '');

  const handleGoogleSignIn = async (isAutoRetry = false) => {
    if (isBusy && !isAutoRetry) return;
    setErrorMessage(null);
    setErrorCode(null);
    if (!isAutoRetry) setSuccessMessage(null);
    setHandshakeProvider('google');
    setIsTimeoutWarning(false);
    setHandshakeStage('opening_provider');
    setIsGoogleLoading(true);

    try {
      const result = await signInWithGoogle(redirectRoute, (stage, timedOut) => {
        setHandshakeStage(stage);
        if (timedOut) setIsTimeoutWarning(true);
      });
      if (result.redirectInitiated) {
        return;
      }

      if (result.success && result.destination) {
        setIsAutoRetrying(false);
        setIsGoogleLoading(false);
        setHandshakeStage('ready');
        setIsTimeoutWarning(false);
        setSuccessMessage('Signed in successfully. Redirecting to your AIC workspace...');
        navigate(result.destination);
        return;
      }

      if (!isAutoRetry && isPermissionIssue(result.errorCode, result.errorMessage)) {
        setIsAutoRetrying(true);
        setHandshakeStage('refreshing_token');
        setSuccessMessage('Missing or insufficient permissions detected — refreshing session and retrying automatically...');
        await refreshAuthSessionToken();
        await new Promise((r) => setTimeout(r, 700));
        await handleGoogleSignIn(true);
        return;
      }

      resetHandshakeState();
      setErrorCode(
        isPermissionIssue(result.errorCode, result.errorMessage)
          ? 'permission-denied'
          : result.errorCode || null
      );
      setErrorMessage(
        isPermissionIssue(result.errorCode, result.errorMessage)
          ? 'Missing or insufficient permissions. If the domain configuration or security rules were recently updated in Firebase, please re-authenticate with your Google account below.'
          : result.errorMessage || 'Unable to complete Google sign-in.'
      );
      if (result.conflictEmail) {
        setConflictEmail(result.conflictEmail);
        setEmail(result.conflictEmail);
      }
    } catch (err: any) {
      if (!isAutoRetry && isPermissionDeniedError(err)) {
        setIsAutoRetrying(true);
        setHandshakeStage('refreshing_token');
        setSuccessMessage('Missing or insufficient permissions detected — refreshing session and retrying automatically...');
        await refreshAuthSessionToken();
        await new Promise((r) => setTimeout(r, 700));
        await handleGoogleSignIn(true);
        return;
      }
      resetHandshakeState();
      const permErr = isPermissionDeniedError(err);
      setErrorCode(permErr ? 'permission-denied' : err?.code || 'auth/unknown');
      setErrorMessage(
        permErr
          ? 'Missing or insufficient permissions. If the domain configuration or security rules were recently updated in Firebase, please re-authenticate below.'
          : err?.message || 'Unable to complete Google sign-in.'
      );
    }
  };

  const runEmailSignInWithRetry = async (isAutoRetry = false) => {
    if (!isAutoRetry) {
      setErrorMessage(null);
      setErrorCode(null);
      setSuccessMessage(null);
    }
    setHandshakeProvider('email');
    setIsTimeoutWarning(false);
    setHandshakeStage('verifying_credentials');
    setIsEmailLoading(true);

    try {
      const result = await signInWithEmail(email, password, redirectRoute, (stage, timedOut) => {
        setHandshakeStage(stage);
        if (timedOut) setIsTimeoutWarning(true);
      });

      if (result.success && result.destination) {
        if (conflictEmail && result.userAccount && !result.userAccount.authProviders?.includes('google.com')) {
          const linkRes = await linkGoogleAccountToCurrentUser();
          if (linkRes.success) {
            setIsAutoRetrying(false);
            setIsEmailLoading(false);
            setHandshakeStage('ready');
            setIsTimeoutWarning(false);
            setSuccessMessage('Signed in and linked your Google account securely.');
            navigate(linkRes.destination || result.destination);
            return;
          }
        }
        setIsAutoRetrying(false);
        setIsEmailLoading(false);
        setHandshakeStage('ready');
        setIsTimeoutWarning(false);
        setSuccessMessage('Signed in successfully. Opening your AIC account...');
        navigate(result.destination);
        return;
      }

      if (!isAutoRetry && isPermissionIssue(result.errorCode, result.errorMessage)) {
        setIsAutoRetrying(true);
        setHandshakeStage('refreshing_token');
        setSuccessMessage('Missing or insufficient permissions detected — refreshing session and retrying automatically...');
        await refreshAuthSessionToken();
        await new Promise((r) => setTimeout(r, 700));
        await runEmailSignInWithRetry(true);
        return;
      }

      resetHandshakeState();
      setErrorCode(
        isPermissionIssue(result.errorCode, result.errorMessage)
          ? 'permission-denied'
          : result.errorCode || null
      );
      setErrorMessage(
        isPermissionIssue(result.errorCode, result.errorMessage)
          ? 'Missing or insufficient permissions. If the domain configuration was recently updated in Firebase, please re-authenticate below.'
          : result.errorMessage || 'Invalid email or password.'
      );
    } catch (err: any) {
      if (!isAutoRetry && isPermissionDeniedError(err)) {
        setIsAutoRetrying(true);
        setHandshakeStage('refreshing_token');
        setSuccessMessage('Missing or insufficient permissions detected — refreshing session and retrying automatically...');
        await refreshAuthSessionToken();
        await new Promise((r) => setTimeout(r, 700));
        await runEmailSignInWithRetry(true);
        return;
      }
      resetHandshakeState();
      const permErr = isPermissionDeniedError(err);
      setErrorCode(permErr ? 'permission-denied' : err?.code || 'auth/unknown');
      setErrorMessage(
        permErr
          ? 'Missing or insufficient permissions. If the domain configuration was recently updated in Firebase, please re-authenticate below.'
          : err?.message || 'Sign-in failed. Please try again.'
      );
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    await runEmailSignInWithRetry(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setIsResetLoading(true);
    setErrorMessage(null);
    const res = await sendResetPasswordEmail(resetEmail);
    setIsResetLoading(false);
    if (res.success) {
      setSuccessMessage(res.message);
      setShowForgotPassword(false);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white border border-slate-200 rounded-2xl p-5 sm:p-10 shadow-sm space-y-4 sm:space-y-6">
        {/* AIC Logo & Identity */}
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="flex justify-center">
            <ResponsiveImage
              src="/assets/aic_logo.jpg"
              alt="Africa Insurance Company S.C."
              priority
              sizes="160px"
              pictureClassName="inline-block"
              className="h-10 sm:h-12 w-auto object-contain"
              onFallbackError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="space-y-1 sm:space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#12366e] tracking-tight">
              {t('auth.welcomeTitle')}
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              {t('auth.welcomeSubtitle')}
            </p>
          </div>
        </div>

        {/* Feedback Banners */}
        {errorMessage && (
          <div
            role="alert"
            className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <p className="leading-relaxed font-medium">{errorMessage}</p>
              {(errorCode === 'auth/network-request-failed' ||
                errorCode === 'auth/popup-closed-by-user' ||
                errorCode === 'permission-denied') && (
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn(false)}
                  className="inline-flex items-center gap-1.5 bg-rose-900 hover:bg-rose-800 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>
                    {errorCode === 'permission-denied' ? 'Re-Authenticate Now' : 'Try again'}
                  </span>
                </button>
              )}
              {errorCode === 'auth/unauthorized-domain' &&
                typeof window !== 'undefined' &&
                window.location.hostname.endsWith('.vercel.app') &&
                window.location.hostname !== 'africa-insurance.vercel.app' && (
                  <a
                    href="https://africa-insurance.vercel.app/#/login"
                    className="inline-flex items-center gap-1.5 bg-[#12366e] hover:bg-[#0e2a58] text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
                  >
                    <span>Open Authorized Domain (africa-insurance.vercel.app)</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                )}
            </div>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-medium">{successMessage}</p>
          </div>
        )}

        <AuthHandshakeTracker
          stage={handshakeStage}
          isTimeoutWarning={isTimeoutWarning}
          isAutoRetrying={isAutoRetrying}
          providerLabel={handshakeProvider}
          onDismissTimeout={resetHandshakeState}
        />

        {!showForgotPassword ? (
          <>
            {/* Official Google Sign-In Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleGoogleSignIn(false)}
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
            </div>

            {/* OR Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider">
                <span className="bg-white px-3 text-slate-400 font-semibold">{t('auth.or')}</span>
              </div>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-3.5 sm:space-y-4 text-xs">
              <div>
                <label htmlFor="login-email" className="block font-semibold text-slate-700 mb-1.5">
                  {t('auth.email')}
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#12366e]/20 focus:border-[#12366e]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="block font-semibold text-slate-700">
                    {t('auth.password')}
                  </label>
                  <button
                    type="button"
                    data-compact="true"
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgotPassword(true);
                      setErrorMessage(null);
                    }}
                    className="text-xs font-semibold text-[#12366e] hover:underline cursor-pointer"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-10 text-base sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#12366e]/20 focus:border-[#12366e]"
                  />
                  <button
                    type="button"
                    data-compact="true"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="w-full bg-[#12366e] hover:bg-[#0e2a58] text-white py-3 rounded-xl text-base sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isEmailLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#c59b27]" />
                ) : (
                  <Lock className="w-4 h-4 text-[#c59b27]" />
                )}
                <span>{isEmailLoading ? t('auth.signingInBtn') : t('auth.signInBtn')}</span>
              </button>
            </form>
          </>
        ) : (
          /* Password Reset View */
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs">
            <button
              type="button"
              data-compact="true"
              onClick={() => setShowForgotPassword(false)}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#12366e] font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-900">Reset your password</h2>
              <p className="text-slate-600 mt-1">
                Enter the email address associated with your AIC account and we will send a secure password reset link.
              </p>
            </div>
            <div>
              <label htmlFor="reset-email" className="block font-semibold text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                required
                placeholder="name@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              />
            </div>
            <button
              type="submit"
              disabled={isResetLoading}
              className="w-full bg-[#12366e] hover:bg-[#0e2a58] text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isResetLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Send reset link</span>
            </button>
          </form>
        )}

        {/* Create Account & Legal Links */}
        <div className="space-y-3 sm:space-y-4 pt-3 border-t border-slate-100 text-center text-xs">
          <p className="text-slate-600">
            {t('auth.newToAic')}{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-semibold text-[#12366e] hover:underline cursor-pointer"
            >
              {t('auth.createAccount')}
            </button>
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-[#12366e] underline cursor-pointer"
            >
              {t('auth.privacy')}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-[#12366e] underline cursor-pointer"
            >
              {t('auth.terms')}
            </button>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Protected by Africa Insurance Company S.C. &amp; NBE Security Standards</span>
          </div>
        </div>
      </div>

      {/* Privacy / Terms Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#12366e]">
                {legalModal === 'privacy' ? 'AIC Privacy Policy & Data Protection' : 'AIC Digital Platform Terms of Service'}
              </h3>
              <button
                onClick={() => setLegalModal(null)}
                aria-label="Close modal"
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-80 overflow-y-auto">
              {legalModal === 'privacy' ? (
                <>
                  <p>
                    Africa Insurance Company (S.C.) collects and processes only the identity, contact, and underwriting data strictly required to issue, administer, and settle insurance policies under National Bank of Ethiopia (NBE) directives.
                  </p>
                  <p>
                    When you sign in with Google, AIC receives only your verified name, email address, and profile photo. AIC never accesses your Google password, Gmail messages, or unrelated Google account data.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    By accessing the AIC Digital Customer Portal, you agree to provide accurate policyholder information for underwriting and claims administration in accordance with Ethiopian Commercial and Insurance law.
                  </p>
                  <p>
                    Your account credentials and linked authentication providers must be kept confidential. Policy issuance and claims records are retained in accordance with NBE statutory retention requirements.
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setLegalModal(null)}
                className="bg-[#12366e] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
