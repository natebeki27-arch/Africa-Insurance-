import React from 'react';
import { store } from '../../services/store';
import { signOutUser } from '../../services/authService';
import { ShieldAlert, Clock, LogOut, ArrowLeft, Phone } from 'lucide-react';

interface AccountStatusPageProps {
  navigate: (route: string) => void;
  mode?: 'status' | 'access_denied';
}

export const AccountStatusPage: React.FC<AccountStatusPageProps> = ({ navigate, mode = 'status' }) => {
  const currentUser = store.getCurrentUser();
  const status = currentUser?.accountStatus || 'pending_verification';

  const isAccessDenied = mode === 'access_denied';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-5 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center">
          {status === 'pending_verification' && !isAccessDenied ? (
            <Clock className="w-6 h-6" />
          ) : (
            <ShieldAlert className="w-6 h-6 text-rose-600" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900">
            {isAccessDenied
              ? 'Access Restricted'
              : status === 'pending_verification'
              ? 'Account Verification Pending'
              : 'Account Access Suspended'}
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isAccessDenied
              ? 'Your current AIC account does not have authorization to access this internal workspace.'
              : status === 'pending_verification'
              ? 'Your account is currently undergoing identity verification by Africa Insurance Company (S.C.). You will receive an email once approved.'
              : 'Your AIC account has been temporarily suspended or deactivated. Please contact our Bole Road Head Office Compliance Desk for assistance.'}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 flex items-center justify-center gap-2">
          <Phone className="w-3.5 h-3.5 text-[#12366e]" />
          <span>Support Desk: +251 11 663 7716</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={() => navigate('/')}
            className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </button>
          {currentUser && (
            <button
              onClick={async () => {
                await signOutUser();
                navigate('/login');
              }}
              className="flex-1 bg-[#12366e] hover:bg-[#0e2a58] text-white py-2.5 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
