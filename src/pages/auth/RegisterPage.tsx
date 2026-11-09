import React, { useState } from 'react';
import { store } from '../../services/store';
import { Shield, ArrowRight, UserCheck } from 'lucide-react';
import { CustomerProfile, UserAccount } from '../../types/insurance';

interface RegisterPageProps {
  navigate: (route: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: 'Addis Ababa',
    subcity: 'Bole',
    idType: 'national_id' as const,
    idNumber: '',
    termsConsent: false,
    privacyConsent: false
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsConsent || !formData.privacyConsent) {
      setError('You must accept the terms and data processing consent to proceed.');
      return;
    }

    const newUid = `usr-cust-${Date.now()}`;
    const newCustId = `CUST-${Math.floor(100 + Math.random() * 900)}`;
    const custNumber = `AIC-CUST-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: UserAccount = {
      uid: newUid,
      accountType: 'customer',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      emailVerified: true,
      phone: formData.phone,
      phoneVerified: true,
      accountStatus: 'active',
      registrationChannel: 'self_service',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      consentRecords: {
        termsAccepted: true,
        dataProcessingAccepted: true,
        marketingConsent: true,
        timestamp: new Date().toISOString()
      }
    };

    const newCustomer: CustomerProfile = {
      customerId: newCustId,
      authUid: newUid,
      customerNumber: custNumber,
      customerType: 'individual',
      personalInformation: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        idType: formData.idType,
        idNumberMasked: `ETH-****-${formData.idNumber.slice(-4) || '9912'}`
      },
      contactInformation: {
        primaryPhone: formData.phone,
        email: formData.email,
        preferredLanguage: 'amharic'
      },
      address: {
        city: formData.city,
        subcityOrZone: formData.subcity,
        region: 'Addis Ababa'
      },
      identityVerificationStatus: 'pending',
      accountStatus: 'active',
      registrationChannel: 'self_service',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.saveCustomer(newCustomer);
    store.setCurrentUser(newUser);

    store.logAudit({
      actorUid: newUid,
      actorName: `${formData.firstName} ${formData.lastName}`,
      actorRole: 'customer',
      action: 'CUSTOMER_SELF_REGISTERED',
      resourceType: 'customer',
      resourceId: newCustId,
      reason: 'Self-registration completed with verified consent',
      correlationId: `REG-${Date.now()}`
    });

    navigate('/portal');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#12366e] text-[#c59b27] rounded-xl mx-auto flex items-center justify-center mb-1">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#12366e] tracking-tight">
            Create Policyholder Account
          </h2>
          <p className="text-xs text-slate-500">
            Direct digital customer registration with Africa Insurance Company S.C.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Abebe"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Father's Name (Last Name)</label>
              <input
                type="text"
                required
                placeholder="e.g. Tadesse"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Telephone Number</label>
              <input
                type="tel"
                required
                placeholder="+251 91 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.et"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              >
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Hawassa">Hawassa</option>
                <option value="Dire Dawa">Dire Dawa</option>
                <option value="Bahir Dar">Bahir Dar</option>
                <option value="Mekelle">Mekelle</option>
                <option value="Adama">Adama</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sub-City / Zone</label>
              <input
                type="text"
                required
                placeholder="e.g. Bole, Kirkos, Arada"
                value={formData.subcity}
                onChange={(e) => setFormData({ ...formData, subcity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">National ID / Passport Number</label>
            <input
              type="text"
              required
              placeholder="e.g. ETH-9281-4819 or Passport EP..."
              value={formData.idNumber}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
            />
          </div>

          {/* Consent Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-slate-100 text-slate-700">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsConsent}
                onChange={(e) => setFormData({ ...formData, termsConsent: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-[#12366e] focus:ring-[#12366e]"
              />
              <span className="leading-tight">
                I accept the Africa Insurance Company terms of service and certify that information supplied is accurate.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.privacyConsent}
                onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                className="mt-0.5 rounded border-slate-300 text-[#12366e] focus:ring-[#12366e]"
              />
              <span className="leading-tight">
                I consent to the collection and processing of my KYC documents for underwriting, policy administration, and regulatory reporting under National Bank of Ethiopia directives.
              </span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#12366e] hover:bg-[#0e2a58] text-white py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Complete Registration</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c59b27]" />
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
          <span>Already registered? </span>
          <button
            onClick={() => navigate('/login')}
            className="font-semibold text-[#12366e] hover:underline"
          >
            Sign In here
          </button>
        </div>
      </div>
    </div>
  );
};
