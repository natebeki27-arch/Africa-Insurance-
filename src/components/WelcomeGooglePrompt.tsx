import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../services/authService';
import { store } from '../services/store';

interface WelcomeGooglePromptProps {
  navigate: (route: string) => void;
}

const SESSION_DISMISS_KEY = 'aic_welcome_google_prompt_dismissed';

function isWelcomePromptEnabledInCms(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = localStorage.getItem('aic_site_cms_config');
    if (!raw) return true;
    const parsed = JSON.parse(raw);
    return parsed?.enableWelcomeGooglePrompt !== false;
  } catch {
    return true;
  }
}

export const WelcomeGooglePrompt: React.FC<WelcomeGooglePromptProps> = ({ navigate }) => {
  const [currentUser, setCurrentUser] = useState(() => store.getCurrentUser());
  const [cmsEnabled, setCmsEnabled] = useState(() => isWelcomePromptEnabledInCms());
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const syncAuth = () => setCurrentUser(store.getCurrentUser());
    const unsubscribe = store.subscribe(syncAuth);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'aic_site_cms_config' || event.key === null) {
        setCmsEnabled(isWelcomePromptEnabledInCms());
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (currentUser || !cmsEnabled) {
      setVisible(false);
      return;
    }

    try {
      if (sessionStorage.getItem(SESSION_DISMISS_KEY) === '1') {
        return;
      }
    } catch {
      // Ignore storage restriction
    }

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, 320);

    return () => window.clearTimeout(timer);
  }, [currentUser, cmsEnabled]);

  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    setErrorMessage(null);
    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
    } catch {
      // Ignore storage restriction
    }
  };

  const handleContinueWithGoogle = async () => {
    if (isLoading) return;
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await signInWithGoogle(undefined);
      if (result.redirectInitiated) {
        return;
      }
      if (result.success && result.destination) {
        setVisible(false);
        navigate(result.destination);
        return;
      }
      setIsLoading(false);
      setErrorMessage(result.errorMessage || 'Unable to complete Google sign-in. Please try again.');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Google sign-in could not be completed.');
    }
  };

  if (currentUser || !visible) {
    return null;
  }

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="welcome-google-heading"
      className="fixed z-40 bottom-3 left-3 right-3 sm:bottom-auto sm:top-[76px] sm:left-auto sm:right-6 sm:w-[360px] pointer-events-auto aic-view-transition"
    >
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-[0_18px_42px_-12px_rgba(15,23,42,0.24),0_4px_14px_-4px_rgba(15,23,42,0.08)] overflow-hidden">
        {/* Top Chrome-inspired header row */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
            <h2
              id="welcome-google-heading"
              className="text-[13px] font-semibold text-slate-800 truncate"
            >
              Continue to AIC with Google
            </h2>
          </div>

          <button
            type="button"
            data-compact="true"
            onClick={handleClose}
            aria-label="Close Google sign-in prompt"
            className="w-8 h-8 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Use your Google account to securely access or create your AIC account.
          </p>

          {errorMessage && (
            <div
              role="alert"
              className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-2.5 text-[11px] flex items-start gap-2"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleContinueWithGoogle}
            disabled={isLoading}
            className="w-full bg-[#1a73e8] hover:bg-[#1662c4] border border-white/25 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
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
              </span>
            )}
            <span className="whitespace-nowrap">
              {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </span>
          </button>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <button
              type="button"
              data-compact="true"
              onClick={() => {
                handleClose();
                navigate('/login');
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-[#12366e] font-semibold py-2 px-3 rounded-xl text-xs text-center transition-colors cursor-pointer"
            >
              Sign in using another method
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
