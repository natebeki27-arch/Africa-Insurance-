import React, { useState, useEffect, Suspense, lazy } from 'react';
import { store } from './services/store';
import { subscribeToAuthSession, completeRedirectSignIn } from './services/authService';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import {
  TopProgressBar,
  startGlobalProgress,
  doneGlobalProgress,
  pulseGlobalProgress
} from './components/TopProgressBar';
import { OfflineIndicator } from './components/OfflineIndicator';

const RouteLoadingFallback: React.FC<{ message?: string }> = ({ message = 'Loading AIC workspace...' }) => {
  useEffect(() => {
    startGlobalProgress();
    return () => doneGlobalProgress();
  }, []);
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
      {message}
    </div>
  );
};

function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      return await factory();
    } catch (err) {
      // Retry once after brief delay for flaky mobile networks or post-deploy chunk updates
      await new Promise((r) => setTimeout(r, 350));
      return factory();
    }
  });
}

// Primary Landing Page (eagerly loaded for instant first paint)
import { HomePage } from './pages/public/HomePage';

// Lazy-Loaded Public & Auth Pages
const ProductsPage = lazyWithRetry(() => import('./pages/public/ProductsPage').then(m => ({ default: m.ProductsPage })));
const VerifyPolicyPage = lazyWithRetry(() => import('./pages/public/VerifyPolicyPage').then(m => ({ default: m.VerifyPolicyPage })));
const AboutPage = lazyWithRetry(() => import('./pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazyWithRetry(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const ClaimsPage = lazyWithRetry(() => import('./pages/public/ClaimsPage').then(m => ({ default: m.ClaimsPage })));
const LoginPage = lazyWithRetry(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazyWithRetry(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const OnboardingPage = lazyWithRetry(() => import('./pages/auth/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const AccountStatusPage = lazyWithRetry(() => import('./pages/auth/AccountStatusPage').then(m => ({ default: m.AccountStatusPage })));
const SecretAdminAuthPage = lazyWithRetry(() => import('./pages/auth/SecretAdminAuthPage').then(m => ({ default: m.SecretAdminAuthPage })));

// Lazy-Loaded Heavy Pages & Workspaces
const ProductDetailPage = lazyWithRetry(() => import('./pages/public/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const BranchesPage = lazyWithRetry(() => import('./pages/public/BranchesPage').then(m => ({ default: m.BranchesPage })));
const MediaPage = lazyWithRetry(() => import('./pages/public/MediaPage').then(m => ({ default: m.MediaPage })));
const LeadershipPage = lazyWithRetry(() => import('./pages/public/LeadershipPage').then(m => ({ default: m.LeadershipPage })));
const CustomerPortal = lazyWithRetry(() => import('./pages/customer/CustomerPortal').then(m => ({ default: m.CustomerPortal })));
const OperatorPortal = lazyWithRetry(() => import('./pages/operator/OperatorPortal').then(m => ({ default: m.OperatorPortal })));
const StaffWorkspace = lazyWithRetry(() => import('./pages/staff/StaffWorkspace').then(m => ({ default: m.StaffWorkspace })));
const AdminControlCentre = lazyWithRetry(() => import('./pages/admin/AdminControlCentre').then(m => ({ default: m.AdminControlCentre })));

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      return hash || window.location.pathname || '/';
    }
    return '/';
  });

  const [queryParams, setQueryParams] = useState<URLSearchParams>(() => {
    if (typeof window !== 'undefined') {
      const queryIdx = window.location.hash.indexOf('?');
      if (queryIdx >= 0) {
        return new URLSearchParams(window.location.hash.substring(queryIdx));
      }
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  const [authReady, setAuthReady] = useState(false);

  // Re-render when store updates
  const [, setTick] = useState(0);
  useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
  }, []);

  // Firebase Authentication State Listener & Redirect Result Handler
  useEffect(() => {
    let mounted = true;
    // Ensure UI never hangs waiting on Firebase Auth listener on slow or restricted networks
    const safetyTimer = setTimeout(() => {
      if (mounted) setAuthReady(true);
    }, 500);

    // Prefetch primary route bundles immediately after first paint for instant transitions
    const prefetchChunks = () => {
      void Promise.allSettled([
        import('./pages/public/ProductsPage'),
        import('./pages/public/ProductDetailPage'),
        import('./pages/public/VerifyPolicyPage'),
        import('./pages/public/ClaimsPage'),
        import('./pages/public/AboutPage'),
        import('./pages/public/BranchesPage'),
        import('./pages/public/MediaPage'),
        import('./pages/public/ContactPage'),
        import('./pages/auth/LoginPage'),
        import('./pages/customer/CustomerPortal')
      ]);
    };

    let idleHandle: number | undefined;
    let idleTimeout: ReturnType<typeof setTimeout> | undefined;
    if (typeof window !== 'undefined') {
      if (store.getCurrentUser()) {
        void import('./pages/customer/CustomerPortal').catch(() => {});
      }
      if ('requestIdleCallback' in window) {
        idleHandle = (window as any).requestIdleCallback(prefetchChunks, { timeout: 500 });
      } else {
        idleTimeout = setTimeout(prefetchChunks, 150);
      }
    }

    completeRedirectSignIn().then((res) => {
      if (mounted && res?.success && res.destination) {
        navigate(res.destination);
      }
    }).catch(() => {});

    const unsubscribe = subscribeToAuthSession(() => {
      if (mounted) {
        clearTimeout(safetyTimer);
        setAuthReady(true);
      }
    });
    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      if (idleTimeout) clearTimeout(idleTimeout);
      if (idleHandle && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleHandle);
      }
      unsubscribe();
    };
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      pulseGlobalProgress(150);
      window.location.hash = path;
      const cleanPath = path.split('?')[0];
      const queryIdx = path.indexOf('?');
      if (queryIdx >= 0) {
        setQueryParams(new URLSearchParams(path.substring(queryIdx)));
      } else {
        setQueryParams(new URLSearchParams());
      }
      setCurrentRoute(cleanPath);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      pulseGlobalProgress(140);
      const hash = window.location.hash.replace(/^#/, '') || '/';
      const cleanPath = hash.split('?')[0];
      const queryIdx = hash.indexOf('?');
      if (queryIdx >= 0) {
        setQueryParams(new URLSearchParams(hash.substring(queryIdx)));
      } else {
        setQueryParams(new URLSearchParams());
      }
      setCurrentRoute(cleanPath);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Determine which page component to render
  const renderContent = () => {
    // 1. Individual Product Detail: /insurance/:slug
    if (currentRoute.startsWith('/insurance/')) {
      const slug = currentRoute.replace('/insurance/', '');
      return <ProductDetailPage slug={slug} navigate={navigate} />;
    }

    // 2. Public Pages
    switch (currentRoute) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/insurance':
        return <ProductsPage navigate={navigate} />;
      case '/verify-policy':
        return <VerifyPolicyPage initialCode={queryParams.get('code') || ''} />;
      case '/branches':
        return <BranchesPage />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/leadership':
        return <LeadershipPage navigate={navigate} initialTab="board" />;
      case '/board-of-directors':
        return <LeadershipPage navigate={navigate} initialTab="board" />;
      case '/executive-managers':
      case '/executive-management':
        return <LeadershipPage navigate={navigate} initialTab="executives" />;
      case '/organizational-structure':
      case '/company-profile':
        return <LeadershipPage navigate={navigate} initialTab="structure" />;
      case '/claims':
        return <ClaimsPage navigate={navigate} />;
      case '/media':
      case '/announcements':
        return <MediaPage navigate={navigate} />;
      case '/contact':
        return <ContactPage />;
      case '/login': {
        const rawRedirect = queryParams.get('redirect');
        const resolvedRedirect = rawRedirect
          ? rawRedirect.startsWith('/')
            ? rawRedirect
            : `/${rawRedirect}`
          : undefined;
        return <LoginPage navigate={navigate} redirectRoute={resolvedRedirect} />;
      }
      case '/register':
        return <RegisterPage navigate={navigate} />;
      case '/onboarding':
        if (!authReady && !store.getCurrentUser()) {
          return <RouteLoadingFallback message="Preparing your AIC onboarding profile..." />;
        }
        return <OnboardingPage navigate={navigate} redirectRoute={queryParams.get('redirect') || undefined} />;
      case '/account-status':
        return <AccountStatusPage navigate={navigate} mode="status" />;
      case '/admin-auth':
      case '/admin-login':
        return <SecretAdminAuthPage navigate={navigate} />;

      // 3. Workspaces (Protected by auth state & role checks)
      case '/portal': {
        const user = store.getCurrentUser();
        if (!authReady && !user) {
          return (
            <RouteLoadingFallback message="Loading your AIC policyholder workspace..." />
          );
        }
        if (!user) {
          return <LoginPage navigate={navigate} redirectRoute="/portal" />;
        }
        if (user.accountStatus !== 'active') {
          return <AccountStatusPage navigate={navigate} mode="status" />;
        }
        if (user.accountType === 'customer' && user.onboardingStatus === 'incomplete') {
          return <OnboardingPage navigate={navigate} redirectRoute="/portal" />;
        }
        return (
          <CustomerPortal
            navigate={navigate}
            initialAction={queryParams.get('action') || undefined}
            initialProductId={queryParams.get('productId') || undefined}
          />
        );
      }
      case '/operator': {
        const user = store.getCurrentUser();
        if (!user) return <LoginPage navigate={navigate} redirectRoute="/operator" />;
        if (!['operator', 'admin'].includes(user.accountType)) {
          return <AccountStatusPage navigate={navigate} mode="access_denied" />;
        }
        return (
          <OperatorPortal
            navigate={navigate}
            initialAction={queryParams.get('action') || undefined}
            initialProductId={queryParams.get('productId') || undefined}
          />
        );
      }
      case '/staff': {
        const user = store.getCurrentUser();
        if (!user) return <LoginPage navigate={navigate} redirectRoute="/staff" />;
        if (!['staff', 'underwriter', 'admin'].includes(user.accountType)) {
          return <AccountStatusPage navigate={navigate} mode="access_denied" />;
        }
        return <StaffWorkspace navigate={navigate} />;
      }
      case '/admin': {
        const user = store.getCurrentUser();
        if (!user) return <SecretAdminAuthPage navigate={navigate} />;
        if (!['admin', 'operator', 'finance'].includes(user.accountType)) {
          return <AccountStatusPage navigate={navigate} mode="access_denied" />;
        }
        return <AdminControlCentre navigate={navigate} />;
      }

      default:
        return <HomePage navigate={navigate} />;
    }
  };

  const isAuthSecret = ['/admin-auth', '/admin-login'].includes(currentRoute);
  const isInternalWorkspace = ['/admin', '/operator', '/staff'].includes(currentRoute);
  const isWorkspace = ['/portal', '/operator', '/staff', '/admin'].includes(currentRoute);

  if (isAuthSecret) {
    return (
      <div className="min-h-screen font-sans text-slate-100 bg-[#08172e]">
        <TopProgressBar />
        <div key={currentRoute} className="aic-view-transition">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <TopProgressBar />
      <OfflineIndicator />

      {/* Rapid Role Switcher Banner ONLY shown inside authorized internal workspaces */}
      {isInternalWorkspace && <RoleSwitcher navigate={navigate} />}

      {/* Top Navbar */}
      <Navbar currentRoute={currentRoute} navigate={navigate} />

      {/* Page Body */}
      <div className="flex-1">
        <Suspense fallback={<RouteLoadingFallback />}>
          <div key={currentRoute} className="aic-view-transition">
            {renderContent()}
          </div>
        </Suspense>
      </div>

      {/* Footer on public views (hidden in dense workspaces for optimal desktop screen economy) */}
      {!isWorkspace && <Footer navigate={navigate} />}
    </div>
  );
}
