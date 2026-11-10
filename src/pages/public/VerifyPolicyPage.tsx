import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { useLanguage } from '../../i18n/LanguageContext';
import { Shield, Search, CheckCircle2, AlertOctagon, Clock, XCircle, QrCode } from 'lucide-react';
import { PolicyVerificationLog, InsurancePolicy } from '../../types/insurance';

interface VerifyPolicyPageProps {
  initialCode?: string;
}

export const VerifyPolicyPage: React.FC<VerifyPolicyPageProps> = ({ initialCode = '' }) => {
  const { t } = useLanguage();
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<{
    outcome: PolicyVerificationLog['verificationOutcome'];
    policy?: InsurancePolicy;
    timestamp: string;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleVerify(initialCode);
    }
  }, [initialCode]);

  const handleVerify = (inputCode: string) => {
    const trimmed = inputCode.trim();
    if (!trimmed) return;
    setIsSearching(true);
    setTimeout(() => {
      const res = store.verifyPolicyCode(trimmed, 'public_portal');
      setResult(res);
      setIsSearching(false);
    }, 400);
  };

  const getStatusBadge = (outcome: PolicyVerificationLog['verificationOutcome']) => {
    switch (outcome) {
      case 'verified_active':
        return (
          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>AUTHENTIC & ACTIVE POLICY</span>
          </div>
        );
      case 'verified_expired':
        return (
          <div className="flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>VERIFIED — EXPIRED COVERAGE</span>
          </div>
        );
      case 'verified_cancelled':
        return (
          <div className="flex items-center gap-2 text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>VERIFIED — CANCELLED / REVOKED</span>
          </div>
        );
      case 'verified_suspended':
        return (
          <div className="flex items-center gap-2 text-purple-800 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <AlertOctagon className="w-4 h-4 text-purple-600" />
            <span>VERIFIED — TEMPORARILY SUSPENDED</span>
          </div>
        );
      case 'not_found':
      default:
        return (
          <div className="flex items-center gap-2 text-slate-800 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <XCircle className="w-4 h-4 text-slate-600" />
            <span>NOT VERIFIED — NO RECORD FOUND</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#12366e] text-[#c59b27] shadow-sm mb-2">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
            <span>{t('nav.verify')}</span>
            <span aria-hidden="true">·</span>
            <span>Ethiopian Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#12366e] tracking-tight">
            {t('pages.verifyTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Enter the unique verification code printed on your official Africa Insurance Company (AIC) policy schedule or certificate to validate its live status against our registry.
          </p>
        </div>

        {/* Verification Input Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify(code);
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="verifyCode" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Policy Verification Code
              </label>
              <div className="relative">
                <input
                  id="verifyCode"
                  type="text"
                  placeholder="e.g. AIC-VRF-8924-K92X"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3.5 text-sm font-mono tracking-wider uppercase text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e] focus:ring-1 focus:ring-[#12366e]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                Sample test codes: <button type="button" onClick={() => { setCode('AIC-VRF-8924-K92X'); handleVerify('AIC-VRF-8924-K92X'); }} className="text-[#12366e] font-mono hover:underline">AIC-VRF-8924-K92X</button> (Active) · <button type="button" onClick={() => { setCode('AIC-VRF-1092-EXP7'); handleVerify('AIC-VRF-1092-EXP7'); }} className="text-[#12366e] font-mono hover:underline">AIC-VRF-1092-EXP7</button> (Expired)
              </span>

              <button
                type="submit"
                disabled={isSearching}
                className="bg-[#12366e] hover:bg-[#0e2a58] text-white px-6 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5 text-[#c59b27]" />
                <span>{isSearching ? 'Querying...' : 'Verify Code'}</span>
              </button>
            </div>
          </form>

          {/* Result Presentation */}
          {result && (
            <div className="mt-6 pt-6 border-t border-slate-200 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Verification Response
                </h3>
                {getStatusBadge(result.outcome)}
              </div>

              {result.outcome.startsWith('verified_') && result.policy ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500">Insuring Company:</span>
                    <strong className="text-slate-900">Africa Insurance Company S.C. (Ethiopia)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500">Policy Number:</span>
                    <span className="font-mono font-semibold text-slate-900">{result.policy.policyNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500">Masked Insured Party:</span>
                    <span className="font-mono font-semibold text-slate-900">{result.policy.maskedInsuredName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500">Insurance Product:</span>
                    <span className="text-slate-900 font-medium">{result.policy.productName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500">Insured Subject:</span>
                    <span className="text-slate-800">{result.policy.insuredSubject}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/80">
                    <span className="text-slate-500">Effective Period:</span>
                    <span className="font-mono text-slate-900">
                      {result.policy.startDate} to {result.policy.expiryDate}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Verified Timestamp:</span>
                    <span className="font-mono text-slate-600">{result.timestamp}</span>
                  </div>

                  <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-500 leading-relaxed">
                    <strong>Privacy Note:</strong> In compliance with data protection principles, private identity documents, complete personal addresses, and detailed financial statements are withheld from the public verification response.
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-xs text-rose-900 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-rose-800">
                    <AlertOctagon className="w-4 h-4" />
                    <span>No Matching Record Found in Authoritative Registry</span>
                  </div>
                  <p className="leading-relaxed">
                    The code <code className="font-mono font-bold">{code}</code> does not match any issued policy in our system. If you believe this is an error, please verify the characters carefully or contact the AIC Headquarters Customer Support helpline at <strong className="text-slate-900">+251 11 551 7075</strong>.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Security and Integrity Notice */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-xs text-slate-600 space-y-2">
          <h4 className="font-semibold text-slate-900">Cryptographic Policy Security</h4>
          <p className="leading-relaxed">
            Every Africa Insurance Company e-policy is assigned an unguessable verification code with an authoritative SHA-256 digital signature recorded in our Cloud Firestore registry. Any printed or digital document lacking valid verification in this registry is not recognized as authentic insurance coverage.
          </p>
        </div>
      </div>
    </div>
  );
};
