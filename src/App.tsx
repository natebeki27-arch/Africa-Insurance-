import React, { useState, useEffect, Suspense, lazy } from 'react';
import { store } from './services/store';
import { subscribeToAuthSession, completeRedirectSignIn } from './services/authService';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Primary Landing Page (eagerly loaded for instant first paint)
import { HomePage } from './pages/public/HomePage';

// Lazy-Loaded Public & Auth Pages
const ProductsPage = lazy(() => import('./pages/public/ProductsPage').then(m => ({ default: m.ProductsPage })));
const VerifyPolicyPage = lazy(() => import('./pages/public/VerifyPolicyPage').then(m => ({ default: m.VerifyPolicyPage })));
const AboutPage = lazy(() => import('./pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then(m => ({ default: m.ContactPage })));
const ClaimsPage = lazy(() => import('./pages/public/ClaimsPage').then(m => ({ default: m.ClaimsPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const OnboardingPage = lazy(() => import('./pages/auth/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const AccountStatusPage = lazy(() => import('./pages/auth/AccountStatusPage').then(m => ({ default: m.AccountStatusPage })));
const SecretAdminAuthPage = lazy(() => import('./pages/auth/SecretAdminAuthPage').then(m => ({ default: m.SecretAdminAuthPage })));

// Lazy-Loaded Heavy Pages & Workspaces
const ProductDetailPage = lazy(() => import('./pages/public/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const BranchesPage = lazy(() => import('./pages/public/BranchesPage').then(m => ({ default: m.BranchesPage })));
const MediaPage = lazy(() => import('./pages/public/MediaPage').then(m => ({ default: m.MediaPage })));
const LeadershipPage = lazy(() => import('./pages/public/LeadershipPage').then(m => ({ default: m.LeadershipPage })));
const CustomerPortal = lazy(() => import('./pages/customer/CustomerPortal').then(m => ({ default: m.CustomerPortal })));
const OperatorPortal = lazy(() => import('./pages/operator/OperatorPortal').then(m => ({ default: m.OperatorPortal })));
const StaffWorkspace = lazy(() => import('./pages/staff/StaffWorkspace').then(m => ({ default: m.StaffWorkspace })));
const AdminControlCentre = lazy(() => import('./pages/admin/AdminControlCentre').then(m => ({ default: m.AdminControlCentre })));

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
    completeRedirectSignIn().then((res) => {
      if (mounted && res?.success && res.destination) {
        navigate(res.destination);
      }
    });
    const unsubscribe = subscribeToAuthSession(() => {
      if (mounted) {
        setAuthReady(true);
      }
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
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
        if (!authReady) {
          return (
            <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
              Verifying your AIC session...
            </div>
          );
        }
        const rawRedirect = queryParams.get('redirect');
        const resolvedRedirect = rawRedirect
          ? rawRedirect.startsWith('/')
            ? rawRedirect
            : `/${rawRedirect}`
          : undefined;
        return <LoginPage navigate={navigate} redirectRoute={resolvedRedirect} />;
      }
      case '/register':
        if (!authReady) {
          return (
            <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
              Verifying your AIC session...
            </div>
          );
        }
        return <RegisterPage navigate={navigate} />;
      case '/onboarding':
        return <OnboardingPage navigate={navigate} redirectRoute={queryParams.get('redirect') || undefined} />;
      case '/account-status':
        return <AccountStatusPage navigate={navigate} mode="status" />;
      case '/admin-auth':
      case '/admin-login':
        return <SecretAdminAuthPage navigate={navigate} />;

      // 3. Workspaces (Protected by auth state & role checks)
      case '/portal': {
        if (!authReady) {
          return (
            <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
              Loading your AIC policyholder workspace...
            </div>
          );
        }
        const user = store.getCurrentUser();
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
        if (user.accountType !== 'admin') {
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
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      {/* Rapid Role Switcher Banner ONLY shown inside authorized internal workspaces */}
      {isInternalWorkspace && <RoleSwitcher />}

      {/* Top Navbar */}
      <Navbar currentRoute={currentRoute} navigate={navigate} />

      {/* Page Body */}
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
              Loading AIC workspace...
            </div>
          }
        >
          {renderContent()}
        </Suspense>
      </div>

      {/* Footer on public views (hidden in dense workspaces for optimal desktop screen economy) */}
      {!isWorkspace && <Footer navigate={navigate} />}
    </div>
  );
}
