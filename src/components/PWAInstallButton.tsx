import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        title="Install AIC Portal App"
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#c59b27]/40 bg-amber-50 hover:bg-amber-100 text-[#12366e] font-semibold transition-colors cursor-pointer ${
          compact ? 'px-2.5 py-1.5 text-[11px] w-full' : 'px-3 py-1.5 text-xs'
        }`}
      >
        <Download className="w-3.5 h-3.5 text-[#c59b27] shrink-0" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold transition-colors cursor-pointer ${
            compact ? 'px-2.5 py-1.5 text-[11px] w-full' : 'px-3 py-1.5 text-xs'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#12366e] shrink-0" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#12366e]">Install AIC on iPhone / iPad</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Close guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal pl-4 leading-relaxed">
                <li>
                  Tap the <strong className="text-slate-900">Share</strong> button in your Safari toolbar.
                </li>
                <li>
                  Scroll down and tap <strong className="text-slate-900">Add to Home Screen</strong>.
                </li>
                <li>
                  Tap <strong className="text-slate-900">Add</strong> to launch AIC offline anytime.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-[#12366e] py-2.5 text-xs font-semibold text-white hover:bg-[#0e2a58] transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
