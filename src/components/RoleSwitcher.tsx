import React from 'react';
import { store } from '../services/store';
import { UserRole } from '../types/insurance';
import { ShieldCheck, User, Briefcase, FileCheck, CreditCard } from 'lucide-react';

interface RoleSwitcherProps {
  navigate?: (path: string) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ navigate }) => {
  const currentUser = store.getCurrentUser();
  const currentRole = currentUser?.accountType || 'admin';

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string; route: string }[] = [
    { role: 'admin', label: 'Administrator', icon: <ShieldCheck className="w-3.5 h-3.5" />, desc: 'Full Control, Onboarding & Audits', route: '/admin' },
    { role: 'operator', label: 'Operator', icon: <Briefcase className="w-3.5 h-3.5" />, desc: 'Full Edit Access (No Employee Onboarding)', route: '/admin' },
    { role: 'finance', label: 'Finance', icon: <CreditCard className="w-3.5 h-3.5" />, desc: 'Paid Transactions, Filter & Export (Read-Only Policies)', route: '/admin' },
    { role: 'underwriter', label: 'Underwriter / Staff', icon: <FileCheck className="w-3.5 h-3.5" />, desc: 'Review, Quotations & Issuance', route: '/staff' },
    { role: 'customer', label: 'Customer', icon: <User className="w-3.5 h-3.5" />, desc: 'My Policies, Applications & Pay', route: '/portal' }
  ];

  return (
    <div className="bg-[#0c2550] text-white border-b border-[#184486]/50 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[#f0cb5a] uppercase tracking-wider text-[11px]">System Environment:</span>
        <span className="text-slate-200">Africa Insurance Company (AIC) Digital Platform</span>
        <span className="text-slate-400">·</span>
        <span className="text-[#f0cb5a] font-mono text-[11px]">Enterprise Operations</span>
      </div>

      <div className="flex items-center gap-1.5 bg-[#091a38]/80 p-0.5 rounded-lg border border-[#1b488c]/60">
        <span className="text-[11px] text-slate-300 px-2">Switch Workspace:</span>
        {roles.map((item) => {
          const isActive = currentRole === item.role;
          return (
            <button
              key={item.role}
              onClick={() => {
                store.switchRole(item.role);
                if (navigate) {
                  navigate(item.route);
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-[#c59b27] text-[#0c2550] font-semibold shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-[#12366e]/70'
              }`}
              title={item.desc}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
