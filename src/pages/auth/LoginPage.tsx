import React, { useState } from 'react';
import { store } from '../../services/store';
import { Shield, Lock, ArrowRight, UserCheck, Briefcase, FileCheck, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../types/insurance';

interface LoginPageProps {
  navigate: (route: string) => void;
  redirectRoute?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate, redirectRoute }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const handleQuickLogin = (role: UserRole) => {
    store.switchRole(role);
    if (redirectRoute) {
      navigate(redirectRoute);
    } else {
      switch (role) {
        case 'admin': navigate('/admin'); break;
        case 'underwriter':
        case 'staff': navigate('/staff'); break;
        case 'operator': navigate('/operator'); break;
        case 'customer':
        default: navigate('/portal'); break;
      }
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuickLogin(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#12366e] text-[#c59b27] rounded-xl mx-auto flex items-center justify-center mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#12366e] tracking-tight">
            Sign In to AIC Platform
          </h2>
          <p className="text-xs text-slate-500">
            Secure multi-role access for customers, direct-sales operators, underwriters, and administrators.
          </p>
        </div>

        {/* Sign In with Google for Public Users */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('customer')}
            className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-3 cursor-pointer hover:border-slate-400 active:scale-[0.99]"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>Continue with Google</span>
          </button>

          <div className="pt-2">
            <span className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Quick Customer Demo Login:
            </span>
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="w-full p-3 border border-slate-200 rounded-lg hover:border-[#12366e] hover:bg-slate-50 text-left transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <UserCheck className="w-4 h-4 text-[#12366e]" />
                <span>Demo Policyholder</span>
              </div>
              <span className="text-[11px] text-slate-500">Abebe Tadesse</span>
            </button>
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">Or Manual Credentials</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email / Phone</label>
            <input
              type="text"
              required
              placeholder="e.g. name@example.et or +251 9..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Account Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
            >
              <option value="customer">Policyholder / Customer</option>
              <option value="operator">Direct-Sales Operator</option>
              <option value="underwriter">Underwriting & Claims Officer</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#12366e] hover:bg-[#0e2a58] text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-[#c59b27]" />
              <span>Authenticate Session</span>
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          <span>New customer? </span>
          <button
            onClick={() => navigate('/register')}
            className="font-semibold text-[#12366e] hover:underline"
          >
            Create self-service account
          </button>
        </div>
      </div>
    </div>
  );
};
