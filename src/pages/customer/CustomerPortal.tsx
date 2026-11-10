import React, { useState } from 'react';
import { store } from '../../services/store';
import { chapaService } from '../../services/chapa';
import {
  linkGoogleAccountToCurrentUser,
  sendResetPasswordEmail,
  signOutUser
} from '../../services/authService';
import {
  Shield,
  ShieldCheck,
  FileText,
  FileCheck,
  CreditCard,
  AlertCircle,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Upload,
  User,
  LogOut,
  Calendar,
  ExternalLink,
  ChevronRight,
  Building,
  Car
} from 'lucide-react';
import {
  InsurancePolicy,
  InsuranceApplication,
  InsuranceProduct,
  InsuranceClaim
} from '../../types/insurance';

interface CustomerPortalProps {
  navigate: (route: string) => void;
  initialAction?: string;
  initialProductId?: string;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  navigate,
  initialAction,
  initialProductId
}) => {
  const currentUser = store.getCurrentUser();
  const customerId = currentUser?.uid || '';
  const allPolicies = store.getPolicies().filter((p) => p.customerId === customerId);
  const allApplications = store.getApplications().filter((a) => a.customerId === customerId);
  const products = store.getPublishedProducts();
  const [securityFeedback, setSecurityFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isNewAppAction = initialAction === 'new_app' || initialAction === 'new-application';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications' | 'policies' | 'payments' | 'claims' | 'profile'>(
    isNewAppAction ? 'applications' : 'dashboard'
  );

  // New Application Wizard State
  const [isCreatingApp, setIsCreatingApp] = useState(isNewAppAction);
  const [selectedProductId, setSelectedProductId] = useState(initialProductId || products[0]?.productId || '');
  const [appFormAnswers, setAppFormAnswers] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number; code: string }[]>([]);
  const [appSuccess, setAppSuccess] = useState<string | null>(null);

  // Certificate / Policy Modal State
  const [viewingPolicy, setViewingPolicy] = useState<InsurancePolicy | null>(null);

  // Payment Checkout Modal State
  const [checkoutTarget, setCheckoutTarget] = useState<{
    applicationId: string;
    productName: string;
    amountETB: number;
    quotationId: string;
  } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Claim form state
  const [isFilingClaim, setIsFilingClaim] = useState(false);
  const [claimPolicyId, setClaimPolicyId] = useState(allPolicies[0]?.policyId || '');
  const [claimDesc, setClaimDesc] = useState('');
  const [claimDate, setClaimDate] = useState('');
  const [claimLossETB, setClaimLossETB] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  const selectedProduct = products.find((p) => p.productId === selectedProductId) || products[0];

  const handleFileUpload = (code: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles((prev) => [
        ...prev.filter((f) => f.code !== code),
        { name: file.name, size: file.size, code }
      ]);
    }
  };

  const handleSaveDraft = () => {
    const newAppId = `APP-${Date.now()}`;
    const newApp: InsuranceApplication = {
      applicationId: newAppId,
      applicationNumber: `AIC-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId,
      customerName: `${currentUser?.firstName || 'Abebe'} ${currentUser?.lastName || 'Tadesse'}`,
      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      productVersion: selectedProduct.version,
      applicantInformation: {
        fullName: `${currentUser?.firstName || 'Abebe'} ${currentUser?.lastName || 'Tadesse'}`,
        phone: currentUser?.phone || '+251 91 123 4567',
        email: currentUser?.email || 'abebe.tadesse@example.et',
        address: 'Bole Sub-City, Addis Ababa'
      },
      applicationAnswers: appFormAnswers,
      uploadedDocumentIds: uploadedFiles.map((f) => `DOC-${f.code}`),
      applicationStatus: 'draft',
      branchId: 'BR-BOLE',
      registrationChannel: 'self_service',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.saveApplication(newApp);
    setAppSuccess('Draft application saved successfully. You can resume anytime.');
    setTimeout(() => {
      setIsCreatingApp(false);
      setAppSuccess(null);
    }, 1500);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppId = `APP-${Date.now()}`;
    const appNumber = `AIC-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: InsuranceApplication = {
      applicationId: newAppId,
      applicationNumber: appNumber,
      customerId,
      customerName: `${currentUser?.firstName || 'Abebe'} ${currentUser?.lastName || 'Tadesse'}`,
      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      productVersion: selectedProduct.version,
      applicantInformation: {
        fullName: `${currentUser?.firstName || 'Abebe'} ${currentUser?.lastName || 'Tadesse'}`,
        phone: currentUser?.phone || '+251 91 123 4567',
        email: currentUser?.email || 'abebe.tadesse@example.et',
        address: 'Bole Sub-City, Addis Ababa'
      },
      applicationAnswers: appFormAnswers,
      uploadedDocumentIds: uploadedFiles.map((f) => `DOC-${f.code}`),
      applicationStatus: 'submitted',
      branchId: 'BR-BOLE',
      registrationChannel: 'self_service',
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.saveApplication(newApp);
    store.logAudit({
      actorUid: currentUser?.uid || 'CUST',
      actorName: `${currentUser?.firstName || 'Abebe'} ${currentUser?.lastName || 'Tadesse'}`,
      actorRole: 'customer',
      action: 'APPLICATION_SUBMITTED',
      resourceType: 'application',
      resourceId: newAppId,
      reason: `Application ${appNumber} submitted for ${selectedProduct.productName}`,
      correlationId: `APP-SUBMIT-${Date.now()}`
    });

    setAppSuccess(`Application ${appNumber} submitted! Our underwriting team will review your application.`);
    setTimeout(() => {
      setIsCreatingApp(false);
      setAppSuccess(null);
    }, 2000);
  };

  const handleSimulatePayment = async () => {
    if (!checkoutTarget) return;
    setIsProcessingPayment(true);

    const payAttemptId = `PAY-${Date.now()}`;
    const txRef = `AIC-CHAPA-2026-${Date.now().toString().slice(-5)}`;
    // Record payment attempt
    store.createPaymentAttempt({
      paymentAttemptId: payAttemptId,
      customerId,
      applicationId: checkoutTarget.applicationId,
      quotationId: checkoutTarget.quotationId,
      provider: 'chapa_v2',
      merchantReference: txRef,
      amountETB: checkoutTarget.amountETB,
      currency: 'ETB',
      paymentStatus: 'pending',
      idempotencyKey: `IDEMP-${txRef}`,
      verificationStatus: 'unverified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Simulate Chapa server-to-server independent verification
    const verifyRes = await chapaService.verifyPayment(txRef, checkoutTarget.amountETB);

    if (verifyRes.verified) {
      store.verifyPaymentAttempt(payAttemptId, true);
      setPaymentDone(true);
      setIsProcessingPayment(false);

      // Auto-issue demonstration policy upon verified payment
      const vCode = `AIC-VRF-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const polNumber = `AIC/${selectedProduct.productCategory.slice(0, 3).toUpperCase()}/2026/${Math.floor(100000 + Math.random() * 900000)}`;

      const newPolicy: InsurancePolicy = {
        policyId: `POL-${Date.now()}`,
        policyNumber: polNumber,
        verificationCode: vCode,
        verificationCodeHash: 'sha256_placeholder_token',
        customerId,
        customerName: `${currentUser?.firstName || 'Abebe'} ${currentUser?.lastName || 'Tadesse'}`,
        customerPhone: currentUser?.phone || '+251 91 123 4567',
        maskedInsuredName: 'A*** T*** K***',
        productId: selectedProduct.productId,
        productName: checkoutTarget.productName,
        productVersion: selectedProduct.version,
        applicationId: checkoutTarget.applicationId,
        quotationId: checkoutTarget.quotationId,
        paymentReference: verifyRes.providerReference,
        insuredSubject: 'Private Vehicle / Property Schedule',
        coverageSummary: selectedProduct.benefits,
        exclusionsSummary: selectedProduct.exclusions.slice(0, 2),
        totalPremiumETB: checkoutTarget.amountETB,
        currency: 'ETB',
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
        policyStatus: 'active',
        policyDocumentId: `DOC-POL-${Date.now()}`,
        certificateDocumentId: `DOC-CERT-${Date.now()}`,
        preparedBy: 'STAFF-UW-01',
        reviewedBy: 'STAFF-UW-01',
        approvedBy: 'STAFF-ADM-01',
        digitalSignatureRef: `AIC-SIG-SHA256-${Date.now()}`,
        issuedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      store.issuePolicy(newPolicy);
    }
  };

  const handleFileClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const pol = allPolicies.find((p) => p.policyId === claimPolicyId) || allPolicies[0];
    const newClaim: InsuranceClaim = {
      claimId: `CLM-${Date.now()}`,
      claimNumber: `AIC-CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
      policyId: pol.policyId,
      policyNumber: pol.policyNumber,
      customerId,
      customerName: pol.customerName,
      incidentDate: claimDate || new Date().toISOString().split('T')[0],
      incidentLocation: 'Addis Ababa',
      description: claimDesc,
      estimatedLossETB: Number(claimLossETB) || 25000,
      uploadedEvidenceIds: ['DOC-EVID-01'],
      claimStatus: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.logAudit({
      actorUid: customerId,
      actorName: pol.customerName,
      actorRole: 'customer',
      action: 'CLAIM_SUBMITTED',
      resourceType: 'policy',
      resourceId: pol.policyId,
      reason: `Claim filed for ${pol.policyNumber} (Est: ${newClaim.estimatedLossETB} ETB)`,
      correlationId: `CLM-${Date.now()}`
    });

    setClaimSuccess(true);
    setTimeout(() => {
      setIsFilingClaim(false);
      setClaimSuccess(false);
      setClaimDesc('');
      setClaimLossETB('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Persistent Left Sidebar (Loom / Antigravity Workspace Architecture) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Workspace Title */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#12366e] text-[#c59b27] flex items-center justify-center font-bold text-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#12366e] leading-tight">Customer Portal</h2>
              <span className="text-[11px] text-slate-500 font-mono">ID: {customerId}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-medium">
            <button
              onClick={() => { setActiveTab('dashboard'); setIsCreatingApp(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'dashboard' && !isCreatingApp ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4 text-[#c59b27]" />
              <span>Overview & Policies</span>
            </button>

            <button
              onClick={() => { setActiveTab('applications'); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'applications' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-[#c59b27]" />
              <span>Applications ({allApplications.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('policies'); setIsCreatingApp(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'policies' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileCheck className="w-4 h-4 text-[#c59b27]" />
              <span>E-Policy Registry ({allPolicies.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('payments'); setIsCreatingApp(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'payments' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#c59b27]" />
              <span>Payments & Receipts</span>
            </button>

            <button
              onClick={() => { setActiveTab('claims'); setIsCreatingApp(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'claims' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-[#c59b27]" />
              <span>Claims Center</span>
            </button>

            <button
              onClick={() => { setActiveTab('profile'); setIsCreatingApp(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'profile' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4 text-[#c59b27]" />
              <span>Profile & Security</span>
            </button>
          </nav>
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-slate-100 text-xs space-y-3">
          <div className="flex items-center gap-3">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || currentUser.firstName}
                className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
                {(currentUser?.firstName?.[0] || 'A').toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="font-semibold text-slate-900 truncate">
                {currentUser?.displayName || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim()}
              </div>
              <div className="text-[11px] text-slate-500 truncate">{currentUser?.email}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              await signOutUser();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-slate-200 rounded-lg text-rose-700 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-6 sm:space-y-8 overflow-y-auto">
        {/* Mobile Navigation Bar */}
        <div className="md:hidden -mx-4 px-4 pb-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Overview' },
            { id: 'applications', label: `Applications (${allApplications.length})` },
            { id: 'policies', label: `Policies (${allPolicies.length})` },
            { id: 'payments', label: 'Payments' },
            { id: 'claims', label: 'Claims' },
            { id: 'profile', label: 'Profile & Security' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id as any);
                setIsCreatingApp(false);
              }}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === item.id && !isCreatingApp
                  ? 'bg-[#12366e] text-white'
                  : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
              <span>Policyholder Account</span>
              <span aria-hidden="true">·</span>
              <span>Africa Insurance Company S.C.</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Welcome back, {currentUser?.firstName || 'Abebe'}
            </h1>
          </div>

          <button
            onClick={() => {
              setIsCreatingApp(true);
              setActiveTab('applications');
            }}
            className="bg-[#12366e] hover:bg-[#1a4b8c] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#c59b27]" />
            <span>Apply for New Policy</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && !isCreatingApp && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-xs font-medium text-slate-500">Active Policies</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {allPolicies.filter((p) => p.policyStatus === 'active').length}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Fully protected</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-xs font-medium text-slate-500">Pending Applications</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {allApplications.filter((a) => a.applicationStatus !== 'approved').length}
                </div>
                <span className="text-[11px] text-amber-600 font-medium">In underwriting pipeline</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-xs font-medium text-slate-500">Upcoming Renewals</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {allPolicies.filter((p) => p.policyStatus === 'active').length}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">30d reminder active</span>
              </div>
            </div>

            {/* Active Policies Table / Cards */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                  My Active Insurance Policies
                </h3>
                <span className="text-xs text-slate-500">Authoritative SHA-256 Registry</span>
              </div>

              {allPolicies.length > 0 ? (
                <div className="space-y-3">
                  {allPolicies.map((pol) => (
                    <div
                      key={pol.policyId}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{pol.productName}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                            pol.policyStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {pol.policyStatus}
                          </span>
                        </div>
                        <div className="text-slate-600 font-mono">
                          Policy No: <span className="text-slate-900 font-semibold">{pol.policyNumber}</span> · Code: <span className="text-[#12366e] font-semibold">{pol.verificationCode}</span>
                        </div>
                        <div className="text-slate-500">
                          Coverage: {pol.startDate} to {pol.expiryDate} · Insured: {pol.insuredSubject}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setViewingPolicy(pol)}
                          className="bg-[#12366e] hover:bg-[#1a4b8c] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View Certificate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  No active insurance policies yet. Click "Apply for New Policy" to begin.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATIONS & DYNAMIC FORM INTAKE */}
        {activeTab === 'applications' && isCreatingApp && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#12366e]">New Insurance Policy Application</h2>
                <p className="text-xs text-slate-500">Complete the product-specific questions and upload mandatory documents.</p>
              </div>
              <button
                onClick={() => setIsCreatingApp(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

            {appSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{appSuccess}</span>
              </div>
            )}

            {/* Product Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Insurance Policy Offering
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setAppFormAnswers({});
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
              >
                {products.map((p) => (
                  <option key={p.productId} value={p.productId}>
                    {p.productName} ({p.productCategory})
                  </option>
                ))}
              </select>
            </div>

            {/* Product Policy Banner */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 text-xs text-[#12366e] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#12366e] shrink-0" />
              <span className="font-medium">{selectedProduct.disclaimer}</span>
            </div>

            {/* Dynamic Application Form Schema Questions */}
            <form onSubmit={handleSubmitApplication} className="space-y-6">
              {selectedProduct.applicationSchema.map((step, sIdx) => (
                <div key={sIdx} className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-[#12366e] uppercase tracking-wider border-b border-slate-100 pb-2">
                    {step.stepTitle}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {step.fields.map((field) => (
                      <div key={field.id} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                        <label className="block font-semibold text-slate-700 mb-1">
                          {field.label} {field.required && <span className="text-amber-700">*</span>}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            required={field.required}
                            value={appFormAnswers[field.id] || ''}
                            onChange={(e) => setAppFormAnswers({ ...appFormAnswers, [field.id]: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                          >
                            <option value="">-- Select option --</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'boolean' ? (
                          <label className="flex items-center gap-2 cursor-pointer mt-2">
                            <input
                              type="checkbox"
                              checked={Boolean(appFormAnswers[field.id])}
                              onChange={(e) => setAppFormAnswers({ ...appFormAnswers, [field.id]: e.target.checked })}
                              className="rounded border-slate-300 text-[#12366e]"
                            />
                            <span className="text-slate-700">Yes / Affirmative confirmation</span>
                          </label>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            required={field.required}
                            placeholder={field.placeholder}
                            value={appFormAnswers[field.id] || ''}
                            onChange={(e) => setAppFormAnswers({ ...appFormAnswers, [field.id]: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                          />
                        ) : (
                          <input
                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                            required={field.required}
                            placeholder={field.placeholder}
                            value={appFormAnswers[field.id] || ''}
                            onChange={(e) => setAppFormAnswers({ ...appFormAnswers, [field.id]: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Document Uploads Vault */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-[#12366e] uppercase tracking-wider">
                  Required Document Uploads (Private Vault)
                </h4>
                <p className="text-xs text-slate-500">
                  Files are stored privately in Firebase Storage with automated malware scan verification. Max 10MB per file (PDF, JPG, PNG).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {selectedProduct.requiredDocuments.map((doc) => {
                    const uploaded = uploadedFiles.find((f) => f.code === doc.code);
                    return (
                      <div key={doc.code} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{doc.title}</span>
                          {doc.mandatory && <span className="text-[10px] text-amber-700 font-semibold">Mandatory</span>}
                        </div>
                        <p className="text-[11px] text-slate-500">{doc.description}</p>

                        <div className="pt-1">
                          {uploaded ? (
                            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-emerald-800 text-[11px]">
                              <span className="truncate max-w-[180px]">{uploaded.name}</span>
                              <span className="font-semibold shrink-0">Scanned Clean</span>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:border-[#12366e] text-slate-700 px-3 py-1.5 rounded-lg cursor-pointer transition-colors text-xs font-medium">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Select File</span>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={(e) => handleFileUpload(doc.code, e)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  Save Draft
                </button>

                <button
                  type="submit"
                  className="bg-[#12366e] hover:bg-[#0e2a58] text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Submit Application to Underwriting</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c59b27]" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: APPLICATIONS LIST */}
        {activeTab === 'applications' && !isCreatingApp && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                Submitted & Draft Applications
              </h3>
              <button
                onClick={() => setIsCreatingApp(true)}
                className="text-xs font-semibold text-[#12366e] hover:underline"
              >
                + New Application
              </button>
            </div>

            {allApplications.length > 0 ? (
              <div className="space-y-3">
                {allApplications.map((app) => (
                  <div
                    key={app.applicationId}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{app.productName}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {app.applicationStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-slate-600 font-mono">
                        Ref: {app.applicationNumber} · Submitted: {app.submittedAt ? app.submittedAt.split('T')[0] : 'Draft'}
                      </div>
                      {app.assignedOfficerName && (
                        <div className="text-slate-500">Assigned Underwriter: {app.assignedOfficerName}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {app.applicationStatus === 'quoted' && (
                        <button
                          onClick={() => {
                            setCheckoutTarget({
                              applicationId: app.applicationId,
                              productName: app.productName,
                              amountETB: 85275,
                              quotationId: app.quotationId || 'QUO-DEMO'
                            });
                          }}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Review & Pay via Chapa</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No insurance applications filed yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: POLICIES REGISTRY */}
        {activeTab === 'policies' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
              E-Policy Documents & Certificates
            </h3>
            <p className="text-xs text-slate-500">
              Authoritative issued insurance policies. Every issued policy is immutably registered with an unguessable verification code.
            </p>

            <div className="space-y-3 pt-2">
              {allPolicies.map((pol) => (
                <div
                  key={pol.policyId}
                  className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{pol.productName}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded uppercase">
                        {pol.policyStatus}
                      </span>
                    </div>
                    <div className="font-mono text-slate-700">
                      Policy: <strong className="text-slate-900">{pol.policyNumber}</strong>
                    </div>
                    <div className="text-slate-600">
                      Secure Verification Code: <strong className="font-mono text-[#12366e] bg-slate-200 px-1.5 py-0.5 rounded">{pol.verificationCode}</strong>
                    </div>
                    <div className="text-slate-500">
                      Total Premium: <span className="font-mono font-semibold text-slate-900">{pol.totalPremiumETB.toLocaleString()} ETB</span> · Issued: {pol.issuedAt?.split('T')[0]}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingPolicy(pol)}
                      className="bg-[#12366e] hover:bg-[#1a4b8c] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View & Download Certificate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENTS VIA CHAPA */}
        {activeTab === 'payments' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                Payment History & Chapa V2 Transactions
              </h3>
              <p className="text-xs text-slate-500">
                All digital transactions are settled in Ethiopian Birr (ETB) through Chapa V2 with independent server-to-server verification.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Amount (ETB)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {store.getPaymentAttempts().map((p) => (
                    <tr key={p.paymentAttemptId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-semibold text-slate-900">{p.merchantReference}</td>
                      <td className="p-3">Chapa V2 (Hosted)</td>
                      <td className="p-3 font-mono font-semibold tabular-nums">{p.amountETB.toLocaleString()} ETB</td>
                      <td className="p-3">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded uppercase">
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{p.createdAt.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CLAIMS CENTER */}
        {activeTab === 'claims' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                  Claims Adjudication Center
                </h3>
                <p className="text-xs text-slate-500">Notify AIC of an insured loss or track existing claim adjudication.</p>
              </div>
              <button
                onClick={() => setIsFilingClaim(!isFilingClaim)}
                className="bg-[#12366e] text-white text-xs font-semibold px-3.5 py-2 rounded-lg"
              >
                {isFilingClaim ? 'Cancel' : '+ File New Claim'}
              </button>
            </div>

            {claimSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Claim notification registered! An AIC surveyor has been assigned to investigate.</span>
              </div>
            )}

            {isFilingClaim && (
              <form onSubmit={handleFileClaim} className="space-y-4 text-xs bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">Incident Notification Details</h4>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Active Policy</label>
                  <select
                    value={claimPolicyId}
                    onChange={(e) => setClaimPolicyId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  >
                    {allPolicies.map((pol) => (
                      <option key={pol.policyId} value={pol.policyId}>
                        {pol.productName} ({pol.policyNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date of Incident</label>
                    <input
                      type="date"
                      required
                      value={claimDate}
                      onChange={(e) => setClaimDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Estimated Loss Amount (ETB)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 35000"
                      value={claimLossETB}
                      onChange={(e) => setClaimLossETB(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description of Loss or Accident</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide details regarding the circumstances, damage sustained, and third parties involved..."
                    value={claimDesc}
                    onChange={(e) => setClaimDesc(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#12366e] text-white text-xs font-semibold px-5 py-2.5 rounded-lg"
                >
                  Submit Formal Claim
                </button>
              </form>
            )}

            <div className="text-xs text-slate-600 space-y-2">
              <h4 className="font-semibold text-slate-900">Emergency Support Contact</h4>
              <p>For urgent on-site roadside accident response or severe fire/marine loss, call our 24/7 hotline directly at <strong className="text-slate-900">+251 11 551 7075</strong>.</p>
            </div>
          </div>
        )}

        {/* TAB 6: PROFILE & CONSENT */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 text-xs">
            <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
              Customer Identity & Consent Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Customer Full Name</span>
                <strong className="text-slate-900 mt-1 block">{currentUser?.firstName} {currentUser?.lastName}</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Primary Telephone</span>
                <strong className="text-slate-900 mt-1 block font-mono">{currentUser?.phone}</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Electronic Mail</span>
                <strong className="text-slate-900 mt-1 block font-mono">{currentUser?.email}</strong>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-400 block text-[11px]">Assigned Servicing Branch</span>
                <strong className="text-slate-900 mt-1 block">Bole Commercial Branch (Addis Ababa)</strong>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="font-semibold text-slate-900">Linked Authentication &amp; Account Security</h4>
              {securityFeedback && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium ${
                    securityFeedback.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {securityFeedback.text}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {!currentUser?.authProviders?.includes('google.com') ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await linkGoogleAccountToCurrentUser();
                      if (res.success) {
                        setSecurityFeedback({ type: 'success', text: 'Your Google account has been securely linked.' });
                      } else {
                        setSecurityFeedback({ type: 'error', text: res.errorMessage || 'Could not link Google account.' });
                      }
                    }}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer"
                  >
                    Link Google Account
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Google Account Linked</span>
                  </span>
                )}

                {currentUser?.email && (
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await sendResetPasswordEmail(currentUser.email);
                      setSecurityFeedback({
                        type: res.success ? 'success' : 'error',
                        text: res.message
                      });
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer"
                  >
                    Send Password Reset Email
                  </button>
                )}

                <button
                  type="button"
                  onClick={async () => {
                    await signOutUser();
                    navigate('/login');
                  }}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer"
                >
                  Sign Out of Session
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h4 className="font-semibold text-slate-900">Email & Communication Preferences</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked disabled className="rounded text-[#12366e]" />
                <span>Mandatory transactional notices & policy schedule confirmations (Always enabled)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#12366e]" />
                <span>Four-month renewal and policy health updates</span>
              </label>
            </div>
          </div>
        )}
      </main>

      {/* POLICY CERTIFICATE / SCHEDULE MODAL */}
      {viewingPolicy && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#12366e] text-[#c59b27] flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#12366e]">Official Insurance Certificate</h3>
                  <span className="text-xs text-slate-500 font-mono">{viewingPolicy.policyNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingPolicy(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Certificate Schedule Sheet */}
            <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 space-y-4 text-xs">
              <div className="text-center pb-2 border-b border-slate-200">
                <h2 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                  Africa Insurance Company S.C.
                </h2>
                <span className="text-[11px] text-slate-500">P.O. Box 12941, Addis Ababa, Ethiopia · Licensed by NBE</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-500 block">Policyholder Name:</span>
                  <strong className="text-slate-900">{viewingPolicy.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Insured Subject:</span>
                  <strong className="text-slate-900">{viewingPolicy.insuredSubject}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Commencement Date:</span>
                  <strong className="text-slate-900 font-mono">{viewingPolicy.startDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Expiry Date:</span>
                  <strong className="text-slate-900 font-mono">{viewingPolicy.expiryDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Gross Premium (ETB):</span>
                  <strong className="text-slate-900 font-mono">{viewingPolicy.totalPremiumETB.toLocaleString()} ETB</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Payment Reference:</span>
                  <strong className="font-mono text-slate-900">{viewingPolicy.paymentReference}</strong>
                </div>
              </div>

              {/* Public Verification Box inside Certificate */}
              <div className="bg-white border border-slate-300 rounded-lg p-4 flex items-center justify-between gap-4 mt-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Authoritative Verification Code
                  </span>
                  <div className="text-base font-mono font-bold text-[#12366e] tracking-wider">
                    {viewingPolicy.verificationCode}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Verify anytime at <span className="underline font-mono">africainsurance.et/verify-policy</span>
                  </div>
                </div>

                {/* SVG Visual Representation of QR Code */}
                <div className="w-16 h-16 bg-slate-900 text-white rounded p-1.5 flex flex-col justify-between shrink-0">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-white" />
                    <div className="w-4 h-4 bg-white" />
                  </div>
                  <div className="flex justify-center text-[7px] font-mono tracking-tighter">AIC·SEC</div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-white" />
                    <div className="w-2 h-2 bg-[#c59b27]" />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200 flex justify-between items-center">
                <span>Authorized Digital Stamp: {viewingPolicy.digitalSignatureRef}</span>
                <span>Approved by Underwriting Directorate</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setViewingPolicy(null)}
                className="bg-[#12366e] text-white px-5 py-2 rounded-lg text-xs font-semibold"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAPA PAYMENT CHECKOUT MODAL */}
      {checkoutTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#12366e]" />
                <h3 className="text-base font-bold text-[#12366e]">Chapa V2 Hosted Checkout</h3>
              </div>
              {!isProcessingPayment && (
                <button onClick={() => setCheckoutTarget(null)} className="text-slate-400 font-bold">✕</button>
              )}
            </div>

            {paymentDone ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Payment Verified!</h4>
                <p className="text-xs text-slate-600">
                  Chapa server-to-server independent verification successful. Your official E-Policy has been generated and issued into the registry!
                </p>
                <button
                  onClick={() => {
                    setCheckoutTarget(null);
                    setPaymentDone(false);
                    setActiveTab('policies');
                  }}
                  className="mt-2 bg-[#12366e] text-white px-5 py-2 rounded-lg text-xs font-semibold"
                >
                  View Issued Policy
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Product:</span>
                    <strong className="text-slate-900">{checkoutTarget.productName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Premium Payable:</span>
                    <strong className="font-mono text-base text-slate-900 tabular-nums">
                      {checkoutTarget.amountETB.toLocaleString()} ETB
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Provider:</span>
                    <span className="text-slate-700">Chapa (V2 Sandbox)</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-relaxed">
                  <strong>Sandbox Integration:</strong> In accordance with project rules, real payment secrets are not exposed to the browser. Click below to execute independent server verification.
                </div>

                <button
                  onClick={handleSimulatePayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-[#12366e] hover:bg-[#0e2a58] text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 text-[#c59b27]" />
                  <span>{isProcessingPayment ? 'Verifying with Chapa Gateway...' : `Pay ${checkoutTarget.amountETB.toLocaleString()} ETB Now`}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
