import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProductsPage } from './pages/public/ProductsPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { VerifyPolicyPage } from './pages/public/VerifyPolicyPage';
import { BranchesPage } from './pages/public/BranchesPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { ClaimsPage } from './pages/public/ClaimsPage';
import { MediaPage } from './pages/public/MediaPage';
import { LeadershipPage } from './pages/public/LeadershipPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { SecretAdminAuthPage } from './pages/auth/SecretAdminAuthPage';

// Workspaces
import { CustomerPortal } from './pages/customer/CustomerPortal';
import { OperatorPortal } from './pages/operator/OperatorPortal';
import { StaffWorkspace } from './pages/staff/StaffWorkspace';
import { AdminControlCentre } from './pages/admin/AdminControlCentre';

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

  // Re-render when store updates
  const [, setTick] = useState(0);
  useEffect(() => {
    return store.subscribe(() => setTick((t) => t + 1));
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
      case '/login':
        return <LoginPage navigate={navigate} redirectRoute={queryParams.get('redirect') ? `/${queryParams.get('redirect')}` : undefined} />;
      case '/register':
        return <RegisterPage navigate={navigate} />;
      case '/admin-auth':
      case '/admin-login':
        return <SecretAdminAuthPage navigate={navigate} />;

      // 3. Workspaces
      case '/portal':
        return (
          <CustomerPortal
            navigate={navigate}
            initialAction={queryParams.get('action') || undefined}
            initialProductId={queryParams.get('productId') || undefined}
          />
        );
      case '/operator':
        return (
          <OperatorPortal
            navigate={navigate}
            initialAction={queryParams.get('action') || undefined}
            initialProductId={queryParams.get('productId') || undefined}
          />
        );
      case '/staff':
        return <StaffWorkspace navigate={navigate} />;
      case '/admin':
        return <AdminControlCentre navigate={navigate} />;

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
        {renderContent()}
      </div>

      {/* Footer on public views (hidden in dense workspaces for optimal desktop screen economy) */}
      {!isWorkspace && <Footer navigate={navigate} />}
    </div>
  );
}
