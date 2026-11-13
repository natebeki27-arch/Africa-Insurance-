import React from 'react';
import { CheckCircle2, Loader2, WifiOff, AlertTriangle } from 'lucide-react';
import { AuthHandshakeStage } from '../services/authService';

interface AuthHandshakeTrackerProps {
  stage: AuthHandshakeStage;
  isTimeoutWarning: boolean;
  isAutoRetrying?: boolean;
  providerLabel?: 'google' | 'email';
  onDismissTimeout?: () => void;
}

export const AuthHandshakeTracker: React.FC<AuthHandshakeTrackerProps> = ({
  stage,
  isTimeoutWarning,
  isAutoRetrying = false,
  providerLabel = 'google',
  onDismissTimeout
}) => {
  if (stage === 'idle') return null;

  const steps = [
    {
      id: 'identity',
      label: providerLabel === 'google' ? 'Google OAuth Handshake' : 'Credential Verification',
      activeStages: ['opening_provider', 'verifying_credentials'] as AuthHandshakeStage[],
      doneStages: ['refreshing_token', 'provisioning_profile', 'syncing_workspace', 'ready'] as AuthHandshakeStage[]
    },
    {
      id: 'token',
      label: 'Firebase Security Token',
      activeStages: ['refreshing_token'] as AuthHandshakeStage[],
      doneStages: ['provisioning_profile', 'syncing_workspace', 'ready'] as AuthHandshakeStage[]
    },
    {
      id: 'profile',
      label: 'AIC Profile & Firestore Sync',
      activeStages: ['provisioning_profile', 'syncing_workspace'] as AuthHandshakeStage[],
      doneStages: ['ready'] as AuthHandshakeStage[]
    }
  ];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-xl border p-3.5 text-xs space-y-2.5 transition-colors ${
        isTimeoutWarning
          ? 'bg-amber-50 border-amber-300 text-amber-950'
          : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold text-[#12366e]">
          {isTimeoutWarning ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          ) : (
            <Loader2 className="w-4 h-4 animate-spin text-[#12366e] shrink-0" />
          )}
          <span>
            {isAutoRetrying
              ? 'Refreshing permissions & retrying automatically...'
              : isTimeoutWarning
                ? 'Connection is taking longer than usual'
                : 'Securing your AIC authentication session...'}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 pl-0.5">
        {steps.map((step, index) => {
          const isDone = step.doneStages.includes(stage);
          const isActive = step.activeStages.includes(stage);
          return (
            <div key={step.id} className="flex items-center gap-2 text-[11px] sm:text-xs">
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : isActive ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#12366e] shrink-0" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-slate-300 bg-white text-[9px] font-bold text-slate-400 flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
              )}
              <span
                className={
                  isDone
                    ? 'text-emerald-800 font-medium'
                    : isActive
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-400'
                }
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {isTimeoutWarning && (
        <div className="pt-2 border-t border-amber-200/80 text-[11px] text-amber-900 space-y-1.5 leading-relaxed">
          <p className="flex items-start gap-1.5">
            <WifiOff className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
            <span>
              Your network or browser popup appears slow. Check for a Google sign-in window or popup blocker, or reset to retry.
            </span>
          </p>
          {onDismissTimeout && (
            <button
              type="button"
              data-compact="true"
              onClick={onDismissTimeout}
              className="inline-flex items-center gap-1.5 bg-amber-900 hover:bg-amber-800 text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer"
            >
              Reset &amp; Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
};
