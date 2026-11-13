import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X, Check } from 'lucide-react';

export interface TourStep {
  id: string;
  title: string;
  description: string;
  tabTarget?: 'dashboard' | 'services' | 'applications' | 'policies' | 'claims';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'overview',
    title: 'Overview & Policy Summary',
    description:
      'Track your active policies, pending quote applications, and upcoming 30-day renewals right from your home dashboard.',
    tabTarget: 'dashboard'
  },
  {
    id: 'services',
    title: 'Services & Products Catalog',
    description:
      'Explore every AIC insurance line, view complete policy schedules, exclusions, and wordings, or apply straight from any policy page.',
    tabTarget: 'services'
  },
  {
    id: 'apply',
    title: 'Apply & Buy in Sandbox Mode',
    description:
      'Start a policy application anytime, use Quick-Fill Test Data for instant ETB pricing, and complete mock purchases with Chapa Sandbox.',
    tabTarget: 'applications'
  },
  {
    id: 'policies',
    title: 'E-Policy Registry & Certificates',
    description:
      'Open official e-policy certificates after purchase and test SHA-256 verification codes live on the public policy verifier.',
    tabTarget: 'policies'
  },
  {
    id: 'claims',
    title: 'Claims Center',
    description:
      'Submit test incident claims against any active policy and follow real-time status updates across your workspace.',
    tabTarget: 'claims'
  }
];

interface DashboardGuidedTourProps {
  userId: string;
  isOpen: boolean;
  onClose: (markCompleted: boolean) => void;
  onNavigateTab?: (tab: 'dashboard' | 'services' | 'applications' | 'policies' | 'claims') => void;
}

export const getTourStorageKey = (userId: string) =>
  `aic_dashboard_tour_done_${userId || 'guest'}`;

export const DashboardGuidedTour: React.FC<DashboardGuidedTourProps> = ({
  userId,
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
    }
  }, [isOpen]);

  const currentStep = TOUR_STEPS[stepIndex] || TOUR_STEPS[0];

  const handleFinish = (completed: boolean) => {
    if (userId && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(getTourStorageKey(userId), '1');
      } catch {
        // Ignore private storage quota errors
      }
    }
    onClose(completed);
  };

  if (!isOpen) return null;

  const progressPct = Math.round(((stepIndex + 1) / TOUR_STEPS.length) * 100);
  const isLast = stepIndex === TOUR_STEPS.length - 1;

  return (
    <aside
      role="dialog"
      aria-label="Getting started dashboard tour"
      className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 w-[calc(100%-1.5rem)] max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 sm:p-5 space-y-3"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#12366e] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#12366e]">
              Getting Started · Step {stepIndex + 1} of {TOUR_STEPS.length}
            </div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {currentStep.title}
            </h3>
          </div>
        </div>

        <button
          type="button"
          data-compact="true"
          aria-label="Dismiss tour"
          onClick={() => handleFinish(false)}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <p className="text-xs text-slate-600 leading-relaxed">
        {currentStep.description}
      </p>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#12366e] transition-all duration-150 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-compact="true"
            onClick={() => handleFinish(false)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-1.5 py-1 cursor-pointer"
          >
            Skip
          </button>
          {onNavigateTab && currentStep.tabTarget && stepIndex > 0 && (
            <button
              type="button"
              data-compact="true"
              onClick={() => {
                onNavigateTab(currentStep.tabTarget!);
                handleFinish(true);
              }}
              className="text-[11px] font-semibold text-[#12366e] hover:underline px-1.5 py-1 cursor-pointer"
            >
              Open section
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {stepIndex > 0 && (
            <button
              type="button"
              data-compact="true"
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </button>
          )}
          <button
            type="button"
            data-compact="true"
            onClick={() => {
              if (isLast) {
                handleFinish(true);
              } else {
                setStepIndex((i) => Math.min(TOUR_STEPS.length - 1, i + 1));
              }
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#12366e] hover:bg-[#0e2a58] text-white text-xs font-semibold cursor-pointer shadow-sm"
          >
            <span>{isLast ? 'Start Testing' : 'Next'}</span>
            {isLast ? (
              <Check className="w-3 h-3" />
            ) : (
              <ArrowRight className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
