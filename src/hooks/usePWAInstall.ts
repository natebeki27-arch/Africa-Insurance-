import { useCallback, useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __aicDeferredInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export type PWAInstallOutcome = 'accepted' | 'dismissed' | 'unavailable';

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://')
    );
  } catch {
    return false;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.__aicDeferredInstallPrompt) {
      return window.__aicDeferredInstallPrompt;
    }
    return null;
  });
  const [isInstalled, setIsInstalled] = useState<boolean>(() => checkIsStandalone());
  const [isIOS, setIsIOS] = useState(false);
  const [isIOSInAppBrowser, setIsIOSInAppBrowser] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsInstalled(checkIsStandalone());

    const ua = window.navigator.userAgent || '';
    const lowerUA = ua.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(lowerUA) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // Detect iOS non-Safari browsers or social/messaging WebViews (Chrome/Edge/Firefox/Instagram/WhatsApp)
    const iosOtherBrowser =
      isIOSDevice &&
      (/crios|fxios|edgios|opios|fban|fbav|instagram|line|micromessenger|snapchat/i.test(ua) ||
        !/safari/i.test(ua));
    setIsIOSInAppBrowser(iosOtherBrowser);

    setIsAndroid(/android/i.test(ua));

    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }

    if (window.__aicDeferredInstallPrompt) {
      setDeferredPrompt(window.__aicDeferredInstallPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__aicDeferredInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handlePromptReady = () => {
      if (window.__aicDeferredInstallPrompt) {
        setDeferredPrompt(window.__aicDeferredInstallPrompt);
      }
    };

    const handleAppInstalled = () => {
      window.__aicDeferredInstallPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        setDeferredPrompt(null);
        window.__aicDeferredInstallPrompt = null;
      } else {
        setIsInstalled(checkIsStandalone());
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('aic-pwa-prompt-ready', handlePromptReady);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('aic-pwa-installed', handleAppInstalled);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    } else if (typeof (mediaQuery as unknown as { addListener?: (cb: (e: MediaQueryListEvent) => void) => void }).addListener === 'function') {
      (mediaQuery as unknown as { addListener: (cb: (e: MediaQueryListEvent) => void) => void }).addListener(handleDisplayModeChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('aic-pwa-prompt-ready', handlePromptReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('aic-pwa-installed', handleAppInstalled);
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      } else if (typeof (mediaQuery as unknown as { removeListener?: (cb: (e: MediaQueryListEvent) => void) => void }).removeListener === 'function') {
        (mediaQuery as unknown as { removeListener: (cb: (e: MediaQueryListEvent) => void) => void }).removeListener(handleDisplayModeChange);
      }
    };
  }, []);

  const install = useCallback(async (): Promise<PWAInstallOutcome> => {
    const activePrompt =
      deferredPrompt || (typeof window !== 'undefined' ? window.__aicDeferredInstallPrompt : null);
    if (!activePrompt) return 'unavailable';

    try {
      await activePrompt.prompt();
      const { outcome } = await activePrompt.userChoice;
      // A BeforeInstallPromptEvent can only be prompted once; clear immediately after use
      window.__aicDeferredInstallPrompt = null;
      setDeferredPrompt(null);

      if (outcome === 'accepted') {
        setIsInstalled(true);
        return 'accepted';
      }
      return 'dismissed';
    } catch {
      window.__aicDeferredInstallPrompt = null;
      setDeferredPrompt(null);
      return 'unavailable';
    }
  }, [deferredPrompt]);

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    isIOSInAppBrowser,
    isAndroid,
    isInIframe,
    install
  };
}
