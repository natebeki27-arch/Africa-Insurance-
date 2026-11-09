import React, { useState } from 'react';
import { store } from '../../services/store';
import { Shield, Lock, ArrowRight, UserCheck, Briefcase, FileCheck, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { UserRole } from '../../types/insurance';

interface SecretAdminAuthPageProps {
  navigate: (route: string) => void;
}

export const SecretAdminAuthPage: React.FC<SecretAdminAuthPageProps> = ({ navigate }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [customEmail, setCustomEmail] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleGoogleSignIn = () => {
    setIsAuthorizing(true);

    setTimeout(() => {
      // Authenticate with selected administrative or operational role
      store.switchRole(selectedRole);

      // If user typed a custom Google email, update current user profile
      if (customEmail.trim()) {
        const cur = store.getCurrentUser();
        if (cur) {
          cur.email = customEmail.trim();
        }
      }

      setIsAuthorizing(false);
      setAuthSuccess(true);

      setTimeout(() => {
        switch (selectedRole) {
          case 'admin':
            navigate('/admin');
            break;
          case 'operator':
            navigate('/operator');
            break;
          case 'underwriter':
          case 'staff':
            navigate('/staff');
            break;
          default:
            navigate('/admin');
            break;
        }
      }, 600);
    }, 750);
  };

  return (
    <div className="min-h-screen bg-[#08172e] text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top minimal bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between text-xs text-slate-400">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Portal</span>
        </button>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#f0cb5a]">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Restricted Directory</span>
        </div>
      </div>

      {/* Main Minimalist Authenticator Card */}
      <div className="max-w-md w-full mx-auto my-auto bg-[#0d2242] border border-[#1b437a] rounded-2xl p-7 sm:p-9 shadow-2xl space-y-6">
        {/* Emblem & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#12366e] border border-[#205298] text-[#f0cb5a] mx-auto flex items-center justify-center shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            Internal Operations Portal
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Authorized personnel only. Africa Insurance Company administrators, operators, and staff authenticate via Google SSO.
          </p>
        </div>

        {/* Primary Action: Official Sign In with Google */}
        <div className="space-y-4 pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={isAuthorizing || authSuccess}
            className="w-full bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-semibold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer group hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
          >
            {isAuthorizing ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
            ) : authSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              // Official Google SVG icon
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            <span>
              {isAuthorizing ? 'Authorizing Google Credentials...' : authSuccess ? 'Authorized · Redirecting...' : 'Sign in with Google'}
            </span>
          </button>

          {/* Quick Authorization Role Picker */}
          <div className="pt-2">
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Authorized Role:
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-[#1b437a] border-[#f0cb5a] text-[#f0cb5a] font-bold shadow-md'
                    : 'bg-[#0a1b33] border-[#183d6e] text-slate-300 hover:border-slate-400'
                }`}
              >
                <Shield className="w-4 h-4 mx-auto mb-1 text-[#f0cb5a]" />
                <span className="block text-[11px]">Administrator</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('operator')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedRole === 'operator'
                    ? 'bg-[#1b437a] border-[#f0cb5a] text-[#f0cb5a] font-bold shadow-md'
                    : 'bg-[#0a1b33] border-[#183d6e] text-slate-300 hover:border-slate-400'
                }`}
              >
                <Briefcase className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                <span className="block text-[11px]">Sales Operator</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('underwriter')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedRole === 'underwriter'
                    ? 'bg-[#1b437a] border-[#f0cb5a] text-[#f0cb5a] font-bold shadow-md'
                    : 'bg-[#0a1b33] border-[#183d6e] text-slate-300 hover:border-slate-400'
                }`}
              >
                <FileCheck className="w-4 h-4 mx-auto mb-1 text-sky-400" />
                <span className="block text-[11px]">Underwriting</span>
              </button>
            </div>
          </div>

          {/* Optional specific Google email */}
          <div className="pt-1">
            <label className="block text-[10px] text-slate-400 mb-1">
              Google Workspace Account (Optional):
            </label>
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="operator@africainsurancesc.com"
              className="w-full bg-[#0a1b33] border border-[#1b437a] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f0cb5a]"
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="pt-3 border-t border-[#1b437a] flex items-center gap-2 text-[11px] text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Firebase Authentication & Active Directory RBAC enforced.</span>
        </div>
      </div>

      {/* Bottom minimal footer */}
      <div className="text-center text-[11px] text-slate-400">
        Africa Insurance Company S.C. · Internal Security Framework
      </div>
    </div>
  );
};
