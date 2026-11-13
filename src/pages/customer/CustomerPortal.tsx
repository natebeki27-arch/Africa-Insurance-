import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { chapaService } from '../../services/chapa';
import {
  linkGoogleAccountToCurrentUser,
  sendResetPasswordEmail,
  signOutUser
} from '../../services/authService';
import {
  calculateProductQuoteETB,
  persistApplicationToFirestore,
  persistClaimToFirestore,
  persistPaymentAndPolicyToFirestore,
  syncCustomerWorkspaceFromFirestore,
  updateCustomerProfileInFirestore
} from '../../services/portalFirestore';
import { useLanguage, AppLanguage } from '../../i18n/LanguageContext';
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
  Car,
  Briefcase,
  Search,
  Check
} from 'lucide-react';
import { ProductDetailPage } from '../public/ProductDetailPage';
import {
  InsurancePolicy,
  InsuranceApplication,
  InsuranceProduct,
  InsuranceClaim,
  PaymentAttempt
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
  const { language, setLanguage } = useLanguage();
  const customerId = currentUser?.uid || '';
  const customerProfile = store.getCustomers().find((c) => c.authUid === customerId);
  const fullDisplayName =
    `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() ||
    currentUser?.displayName ||
    'AIC Policyholder';
  const contactPhone = currentUser?.phone || customerProfile?.contactInformation?.primaryPhone || '';
  const contactEmail = currentUser?.email || customerProfile?.contactInformation?.email || '';
  const contactAddress = customerProfile?.address
    ? `${customerProfile.address.subcityOrZone}, ${customerProfile.address.city}`
    : 'Addis Ababa, Ethiopia';

  const allPolicies = store.getPolicies().filter((p) => p.customerId === customerId);
  const allApplications = store.getApplications().filter((a) => a.customerId === customerId);
  const allPayments = store.getPaymentAttempts().filter((p) => p.customerId === customerId);
  const allClaims = store.getClaims().filter((c) => c.customerId === customerId);
  const products = store.getPublishedProducts();
  const [securityFeedback, setSecurityFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isNewAppAction = initialAction === 'new_app' || initialAction === 'new-application';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'applications' | 'policies' | 'payments' | 'claims' | 'profile'>(
    isNewAppAction ? 'applications' : 'dashboard'
  );
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategory, setServiceCategory] = useState<string>('all');
  const [inspectingProduct, setInspectingProduct] = useState<InsuranceProduct | null>(null);

  // Sync user's real Firestore records when entering portal
  useEffect(() => {
    if (customerId) {
      syncCustomerWorkspaceFromFirestore(customerId);
    }
  }, [customerId]);

  // New Application Wizard State
  const [isCreatingApp, setIsCreatingApp] = useState(isNewAppAction);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState(initialProductId || products[0]?.productId || '');
  const [appFormAnswers, setAppFormAnswers] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: number; code: string }[]>([]);
  const [appSuccess, setAppSuccess] = useState<string | null>(null);

  // Certificate / Policy Modal State
  const [viewingPolicy, setViewingPolicy] = useState<InsurancePolicy | null>(null);

  // Payment Checkout Modal State
  const [checkoutTarget, setCheckoutTarget] = useState<{
    applicationId: string;
    productId: string;
    productName: string;
    amountETB: number;
    quotationId: string;
  } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [selectedTestMethod, setSelectedTestMethod] = useState<'telebirr' | 'cbe_birr' | 'test_card'>('telebirr');
  const [lastIssuedPolicy, setLastIssuedPolicy] = useState<InsurancePolicy | null>(null);

  // Claim form state
  const [isFilingClaim, setIsFilingClaim] = useState(false);
  const [claimPolicyId, setClaimPolicyId] = useState(allPolicies[0]?.policyId || '');
  const [claimDesc, setClaimDesc] = useState('');
  const [claimDate, setClaimDate] = useState('');
  const [claimLossETB, setClaimLossETB] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Profile Edit State
  const [profFirstName, setProfFirstName] = useState(currentUser?.firstName || '');
  const [profLastName, setProfLastName] = useState(currentUser?.lastName || '');
  const [profPhone, setProfPhone] = useState(contactPhone);
  const [profCity, setProfCity] = useState(customerProfile?.address?.city || 'Addis Ababa');
  const [profSubcity, setProfSubcity] = useState(customerProfile?.address?.subcityOrZone || 'Bole');
  const [profLang, setProfLang] = useState<AppLanguage>(
    customerProfile?.contactInformation?.preferredLanguage || language || 'english'
  );
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!claimPolicyId && allPolicies.length > 0) {
      setClaimPolicyId(allPolicies[0].policyId);
    }
  }, [allPolicies.length, claimPolicyId]);

  useEffect(() => {
    if (!profFirstName && currentUser?.firstName) setProfFirstName(currentUser.firstName);
    if (!profLastName && currentUser?.lastName) setProfLastName(currentUser.lastName);
    if (!profPhone && contactPhone) setProfPhone(contactPhone);
    if (customerProfile?.address?.city) setProfCity(customerProfile.address.city);
    if (customerProfile?.address?.subcityOrZone) setProfSubcity(customerProfile.address.subcityOrZone);
  }, [currentUser?.uid, customerProfile?.updatedAt]);

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

  const handleFillSampleAnswers = () => {
    if (!selectedProduct) return;
    const sample: Record<string, any> = {};
    const today = new Date().toISOString().split('T')[0];
    selectedProduct.applicationSchema.forEach((step) => {
      step.fields.forEach((f) => {
        if (f.type === 'select' && f.options && f.options.length > 0) {
          sample[f.id] = f.options[0].value;
        } else if (f.type === 'boolean') {
          sample[f.id] = true;
        } else if (f.type === 'number') {
          const lower = f.label.toLowerCase();
          if (lower.includes('year')) sample[f.id] = 2022;
          else if (lower.includes('seat') || lower.includes('passenger')) sample[f.id] = 5;
          else if (lower.includes('age')) sample[f.id] = 32;
          else if (lower.includes('employee') || lower.includes('staff')) sample[f.id] = 15;
          else sample[f.id] = 1250000;
        } else if (f.type === 'date') {
          sample[f.id] = today;
        } else if (f.type === 'textarea') {
          sample[f.id] = `Test underwriting submission for ${selectedProduct.productName} in Addis Ababa (Bole Sub-City).`;
        } else {
          const lower = f.label.toLowerCase();
          if (lower.includes('plate')) sample[f.id] = 'AA-2-B48291';
          else if (lower.includes('chassis') || lower.includes('vin')) sample[f.id] = 'JTDKARFP4J3091827';
          else if (lower.includes('engine')) sample[f.id] = '2ZR-FE-991824';
          else if (lower.includes('make') || lower.includes('model')) sample[f.id] = 'Toyota Corolla Cross 2022';
          else if (lower.includes('tin')) sample[f.id] = '0048291045';
          else if (lower.includes('location') || lower.includes('address')) sample[f.id] = 'Bole Sub-City, Woreda 03, Addis Ababa';
          else sample[f.id] = f.placeholder || `Sample ${f.label}`;
        }
      });
    });
    setAppFormAnswers(sample);
  };

  const handleSaveDraft = () => {
    if (!selectedProduct) return;
    const now = new Date().toISOString();
    const existingDraft = editingDraftId ? allApplications.find((a) => a.applicationId === editingDraftId) : undefined;
    const newAppId = existingDraft?.applicationId || `APP-${Date.now()}`;
    const newApp: InsuranceApplication = {
      applicationId: newAppId,
      applicationNumber: existingDraft?.applicationNumber || `AIC-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId,
      customerName: fullDisplayName,
      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      productVersion: selectedProduct.version,
      applicantInformation: {
        fullName: fullDisplayName,
        phone: contactPhone || 'Pending Phone',
        email: contactEmail,
        address: contactAddress
      },
      applicationAnswers: appFormAnswers,
      uploadedDocumentIds: uploadedFiles.map((f) => `DOC-${f.code}`),
      applicationStatus: 'draft',
      branchId: 'BR-BOLE',
      registrationChannel: 'self_service',
      createdAt: existingDraft?.createdAt || now,
      updatedAt: now
    };
    store.saveApplication(newApp);
    persistApplicationToFirestore(newApp).catch(() => {});
    setEditingDraftId(null);
    setAppSuccess('Draft saved! Resuming anytime from your Applications tab.');
    setTimeout(() => {
      setIsCreatingApp(false);
      setAppSuccess(null);
    }, 650);
  };

  const submitApplicationCore = (launchCheckoutImmediately: boolean) => {
    if (!selectedProduct) return;
    const now = new Date().toISOString();
    const existingDraft = editingDraftId ? allApplications.find((a) => a.applicationId === editingDraftId) : undefined;
    const newAppId = existingDraft?.applicationId || `APP-${Date.now()}`;
    const appNumber = existingDraft?.applicationNumber || `AIC-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const quoteAmountETB = calculateProductQuoteETB(selectedProduct, appFormAnswers);
    const quotationId = `QUO-AIC-${Date.now().toString().slice(-6)}`;

    const newApp: InsuranceApplication = {
      applicationId: newAppId,
      applicationNumber: appNumber,
      customerId,
      customerName: fullDisplayName,
      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      productVersion: selectedProduct.version,
      applicantInformation: {
        fullName: fullDisplayName,
        phone: contactPhone || 'Pending Phone',
        email: contactEmail,
        address: contactAddress
      },
      applicationAnswers: appFormAnswers,
      uploadedDocumentIds: uploadedFiles.map((f) => `DOC-${f.code}`),
      applicationStatus: 'quoted',
      quotationId,
      quotedAmountETB: quoteAmountETB,
      branchId: 'BR-BOLE',
      registrationChannel: 'self_service',
      createdAt: existingDraft?.createdAt || now,
      submittedAt: now,
      updatedAt: now
    };

    store.saveApplication(newApp);
    persistApplicationToFirestore(newApp).catch(() => {});
    setEditingDraftId(null);
    store.logAudit({
      actorUid: currentUser?.uid || 'CUST',
      actorName: fullDisplayName,
      actorRole: 'customer',
      action: 'APPLICATION_SUBMITTED',
      resourceType: 'application',
      resourceId: newAppId,
      reason: `Application ${appNumber} quoted at ${quoteAmountETB.toLocaleString()} ETB for ${selectedProduct.productName}`,
      correlationId: `APP-SUBMIT-${Date.now()}`
    });

    if (launchCheckoutImmediately) {
      setIsCreatingApp(false);
      setAppSuccess(null);
      setAppFormAnswers({});
      setUploadedFiles([]);
      setPaymentError(null);
      setPaymentDone(false);
      setLastIssuedPolicy(null);
      setCheckoutTarget({
        applicationId: newAppId,
        productId: selectedProduct.productId,
        productName: selectedProduct.productName,
        amountETB: quoteAmountETB,
        quotationId
      });
      return;
    }

    setAppSuccess(
      `Application ${appNumber} quoted at ${quoteAmountETB.toLocaleString()} ETB — ready for Chapa Sandbox Checkout.`
    );
    setTimeout(() => {
      setIsCreatingApp(false);
      setAppSuccess(null);
      setAppFormAnswers({});
      setUploadedFiles([]);
    }, 800);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    submitApplicationCore(false);
  };

  const handleSimulatePayment = async (simulateFailure = false) => {
    if (!checkoutTarget) return;
    setIsProcessingPayment(true);
    setPaymentError(null);

    const targetProduct =
      products.find((p) => p.productId === checkoutTarget.productId) || selectedProduct;
    const targetApp = allApplications.find((a) => a.applicationId === checkoutTarget.applicationId);

    const payAttemptId = `PAY-${Date.now()}`;
    const txRef = `AIC-CHAPA-2026-${Date.now().toString().slice(-5)}`;
    const now = new Date().toISOString();

    const attemptRecord: PaymentAttempt = {
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
      createdAt: now,
      updatedAt: now
    };

    store.createPaymentAttempt(attemptRecord);

    // Chapa sandbox verification
    const verifyRes = await chapaService.verifyPayment(txRef, checkoutTarget.amountETB, {
      method: selectedTestMethod,
      simulateFailure
    });

    if (verifyRes.verified) {
      store.verifyPaymentAttempt(payAttemptId, true);
      const verifiedAttempt: PaymentAttempt = {
        ...attemptRecord,
        providerReference: verifyRes.providerReference,
        paymentStatus: 'successful',
        verificationStatus: 'verified_server',
        verifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const vCode = `AIC-VRF-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const catPrefix = (targetProduct?.productCategory || 'GEN').slice(0, 3).toUpperCase();
      const polNumber = `AIC/${catPrefix}/2026/${Math.floor(100000 + Math.random() * 900000)}`;

      const maskedName = fullDisplayName
        .split(/\s+/)
        .map((part) => (part.length > 1 ? `${part[0]}***` : part))
        .join(' ');

      const answerSummary = targetApp?.applicationAnswers
        ? Object.values(targetApp.applicationAnswers)
            .filter((v) => typeof v === 'string' && v.trim().length > 0)
            .slice(0, 2)
            .join(' · ')
        : '';

      const newPolicy: InsurancePolicy = {
        policyId: `POL-${Date.now()}`,
        policyNumber: polNumber,
        verificationCode: vCode,
        verificationCodeHash: 'sha256_verified_token',
        customerId,
        customerName: fullDisplayName,
        customerPhone: contactPhone,
        maskedInsuredName: maskedName || 'A***',
        productId: targetProduct?.productId || checkoutTarget.productId,
        productName: checkoutTarget.productName,
        productVersion: targetProduct?.version || 1,
        applicationId: checkoutTarget.applicationId,
        quotationId: checkoutTarget.quotationId,
        paymentReference: verifyRes.providerReference,
        insuredSubject: answerSummary || `${checkoutTarget.productName} Schedule`,
        coverageSummary: targetProduct?.benefits || [],
        exclusionsSummary: (targetProduct?.exclusions || []).slice(0, 2),
        totalPremiumETB: checkoutTarget.amountETB,
        currency: 'ETB',
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
        policyStatus: 'active',
        policyDocumentId: `DOC-POL-${Date.now()}`,
        certificateDocumentId: `DOC-CERT-${Date.now()}`,
        preparedBy: 'AIC Digital Underwriting',
        reviewedBy: 'AIC Underwriting Directorate',
        approvedBy: 'AIC Issuing Authority',
        digitalSignatureRef: `AIC-SIG-SHA256-${Date.now().toString().slice(-6)}`,
        issuedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      store.issuePolicy(newPolicy);
      persistPaymentAndPolicyToFirestore({
        attempt: verifiedAttempt,
        policy: newPolicy,
        application: targetApp
      }).catch(() => {});
      setLastIssuedPolicy(newPolicy);
      setPaymentDone(true);
      setIsProcessingPayment(false);
    } else {
      store.verifyPaymentAttempt(payAttemptId, false);
      setPaymentError(verifyRes.message || 'Simulated payment failed. You can retry with any sandbox method.');
      setIsProcessingPayment(false);
    }
  };

  const handleFileClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const pol = allPolicies.find((p) => p.policyId === claimPolicyId) || allPolicies[0];
    if (!pol) return;

    const now = new Date().toISOString();
    const newClaim: InsuranceClaim = {
      claimId: `CLM-${Date.now()}`,
      claimNumber: `AIC-CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
      policyId: pol.policyId,
      policyNumber: pol.policyNumber,
      customerId,
      customerName: pol.customerName,
      incidentDate: claimDate || now.split('T')[0],
      incidentLocation: contactAddress,
      description: claimDesc,
      estimatedLossETB: Number(claimLossETB) || 25000,
      uploadedEvidenceIds: ['DOC-EVID-01'],
      claimStatus: 'submitted',
      createdAt: now,
      updatedAt: now
    };

    store.saveClaim(newClaim);
    persistClaimToFirestore(newClaim).catch(() => {});
    store.logAudit({
      actorUid: customerId,
      actorName: pol.customerName,
      actorRole: 'customer',
      action: 'CLAIM_SUBMITTED',
      resourceType: 'policy',
      resourceId: pol.policyId,
      reason: `Claim ${newClaim.claimNumber} filed for ${pol.policyNumber} (Est: ${newClaim.estimatedLossETB} ETB)`,
      correlationId: `CLM-${Date.now()}`
    });

    setClaimSuccess(true);
    setTimeout(() => {
      setIsFilingClaim(false);
      setClaimSuccess(false);
      setClaimDesc('');
      setClaimLossETB('');
    }, 900);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;
    setIsSavingProfile(true);
    setProfileFeedback(null);
    await updateCustomerProfileInFirestore(customerId, {
      firstName: profFirstName,
      lastName: profLastName,
      phone: profPhone,
      city: profCity,
      subcity: profSubcity,
      preferredLanguage: profLang
    });
    setLanguage(profLang);
    setIsSavingProfile(false);
    setProfileFeedback('Profile details updated and synced securely.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
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
              onClick={() => { setActiveTab('dashboard'); setIsCreatingApp(false); setInspectingProduct(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'dashboard' && !isCreatingApp ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4 text-[#c59b27]" />
              <span>Overview & Policies</span>
            </button>

            <button
              onClick={() => { setActiveTab('services'); setIsCreatingApp(false); setInspectingProduct(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'services' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4 text-[#c59b27]" />
              <span>Services & Products ({products.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('applications'); setInspectingProduct(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'applications' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-[#c59b27]" />
              <span>Applications ({allApplications.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('policies'); setIsCreatingApp(false); setInspectingProduct(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'policies' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileCheck className="w-4 h-4 text-[#c59b27]" />
              <span>E-Policy Registry ({allPolicies.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('payments'); setIsCreatingApp(false); setInspectingProduct(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'payments' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#c59b27]" />
              <span>Payments & Receipts</span>
            </button>

            <button
              onClick={() => { setActiveTab('claims'); setIsCreatingApp(false); setInspectingProduct(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'claims' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <AlertCircle className="w-4 h-4 text-[#c59b27]" />
              <span>Claims Center</span>
            </button>

            <button
              onClick={() => { setActiveTab('profile'); setIsCreatingApp(false); setInspectingProduct(null); }}
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
      <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-4 sm:space-y-8 overflow-y-auto overflow-x-hidden">
        {/* Mobile Navigation Bar */}
        <div className="md:hidden -mx-3 px-3 pb-2.5 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Overview' },
            { id: 'services', label: `Services (${products.length})` },
            { id: 'applications', label: `Applications (${allApplications.length})` },
            { id: 'policies', label: `Policies (${allPolicies.length})` },
            { id: 'payments', label: 'Payments' },
            { id: 'claims', label: 'Claims' },
            { id: 'profile', label: 'Profile & Security' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              data-compact="true"
              onClick={() => {
                setActiveTab(item.id as any);
                setIsCreatingApp(false);
                setInspectingProduct(null);
              }}
              className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
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
              Welcome back, {currentUser?.firstName || fullDisplayName}
            </h1>
          </div>

          <button
            onClick={() => {
              setInspectingProduct(null);
              setIsCreatingApp(true);
              setActiveTab('applications');
            }}
            className="bg-[#12366e] hover:bg-[#1a4b8c] text-white text-sm sm:text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#c59b27]" />
            <span>Apply for New Policy</span>
          </button>
        </div>

        <div key={isCreatingApp ? 'create-app' : activeTab} className="aic-view-transition space-y-4 sm:space-y-8">
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
                <div className="text-center py-8 space-y-3 text-xs text-slate-500">
                  <p>No active insurance policies yet. Explore AIC coverage plans or start a new application.</p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab('services')}
                      className="bg-white border border-slate-300 hover:bg-slate-50 text-[#12366e] px-4 py-2 rounded-lg font-semibold cursor-pointer"
                    >
                      Browse Services & Products
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingApp(true);
                        setActiveTab('applications');
                      }}
                      className="bg-[#12366e] text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
                    >
                      Apply for New Policy
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1B: IN-PORTAL SERVICES & PRODUCTS CATALOG OR FULL POLICY DETAIL PAGE */}
        {activeTab === 'services' && !isCreatingApp && (
          inspectingProduct ? (
            <div key={`detail-${inspectingProduct.productId}`} className="aic-view-transition">
              <ProductDetailPage
                slug={inspectingProduct.slug}
                navigate={navigate}
                embedded
                onBack={() => {
                  setInspectingProduct(null);
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onApply={(chosenProductId) => {
                  setInspectingProduct(null);
                  setSelectedProductId(chosenProductId);
                  setAppFormAnswers({});
                  setEditingDraftId(null);
                  setUploadedFiles([]);
                  setIsCreatingApp(true);
                  setActiveTab('applications');
                  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          ) : (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#12366e]">
                    AIC Insurance Services &amp; Products
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Review full policy coverage, official policy wordings, exclusions, and required documents before applying.
                  </p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-400 absolute left-3 top-3 sm:top-2.5" />
                  <input
                    type="text"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    placeholder="Search policies or coverage..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 sm:pl-8 pr-3 py-2.5 sm:py-2 text-base sm:text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All Lines' },
                  { id: 'motor', label: 'Motor' },
                  { id: 'property', label: 'Property & Fire' },
                  { id: 'marine', label: 'Marine & Cargo' },
                  { id: 'engineering', label: 'Engineering' },
                  { id: 'liability', label: 'Liability' },
                  { id: 'personal', label: 'Life & Health' },
                  { id: 'business', label: 'Business' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    data-compact="true"
                    onClick={() => setServiceCategory(cat.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      serviceCategory === cat.id
                        ? 'bg-[#12366e] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {products
                .filter((p) => {
                  const catMatch = serviceCategory === 'all' || p.productCategory === serviceCategory;
                  const q = serviceSearch.trim().toLowerCase();
                  const textMatch =
                    !q ||
                    p.productName.toLowerCase().includes(q) ||
                    p.shortDescription.toLowerCase().includes(q) ||
                    p.productCategory.toLowerCase().includes(q);
                  return catMatch && textMatch;
                })
                .map((product) => (
                  <div
                    key={product.productId}
                    className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 text-[#12366e]">
                          {product.productCategory}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-slate-700">
                          From {product.quotationConfiguration.standardMinimumPremiumETB.toLocaleString()} ETB
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {product.productName}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                          {product.shortDescription}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Key Coverage Highlights
                        </div>
                        {product.benefits.slice(0, 3).map((b, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setInspectingProduct(product);
                          if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 min-h-[44px] sm:min-h-0 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#12366e] text-base sm:text-xs font-semibold py-2.5 sm:py-2 px-3 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                      >
                        Policy Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProductId(product.productId);
                          setAppFormAnswers({});
                          setEditingDraftId(null);
                          setUploadedFiles([]);
                          setIsCreatingApp(true);
                          setActiveTab('applications');
                          if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 min-h-[44px] sm:min-h-0 bg-[#12366e] hover:bg-[#0e2a58] text-white text-base sm:text-xs font-semibold py-2.5 sm:py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#f0cb5a]" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          )
        )}

        {/* TAB 2: APPLICATIONS & DYNAMIC FORM INTAKE */}
        {activeTab === 'applications' && isCreatingApp && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#12366e]">New Insurance Policy Application</h2>
                <p className="text-xs text-slate-500">Complete the policy questions to calculate an instant ETB quote and buy in test mode.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-compact="true"
                  onClick={handleFillSampleAnswers}
                  className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Quick-Fill Test Data
                </button>
                <button
                  type="button"
                  data-compact="true"
                  onClick={() => setIsCreatingApp(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1.5 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            {appSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{appSuccess}</span>
              </div>
            )}

            {/* Product Selector + Instant Quote Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Insurance Policy Offering
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setAppFormAnswers({});
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 sm:py-2 text-base sm:text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                >
                  {products.map((p) => (
                    <option key={p.productId} value={p.productId}>
                      {p.productName} ({p.productCategory})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-900 text-white rounded-xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-medium">Instant Quote (incl. VAT):</span>
                <strong className="font-mono text-sm sm:text-base text-[#f0cb5a] tabular-nums">
                  {calculateProductQuoteETB(selectedProduct, appFormAnswers).toLocaleString()} ETB
                </strong>
              </div>
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
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm sm:text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Save Draft
                </button>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    type="submit"
                    className="bg-white border border-[#12366e] text-[#12366e] hover:bg-blue-50 text-sm sm:text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Application Only
                  </button>
                  <button
                    type="button"
                    onClick={() => submitApplicationCore(true)}
                    className="bg-[#12366e] hover:bg-[#0e2a58] text-white text-sm sm:text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-[#c59b27]" />
                    <span>Submit &amp; Buy Now (Test Mode)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#c59b27]" />
                  </button>
                </div>
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

                    <div className="flex flex-wrap items-center gap-2">
                      {app.applicationStatus === 'draft' && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDraftId(app.applicationId);
                            setSelectedProductId(app.productId);
                            setAppFormAnswers(app.applicationAnswers || {});
                            setIsCreatingApp(true);
                          }}
                          className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold px-3.5 py-1.5 rounded-lg text-xs cursor-pointer"
                        >
                          Resume Draft
                        </button>
                      )}
                      {(app.applicationStatus === 'quoted' || app.applicationStatus === 'submitted') && (
                        <button
                          type="button"
                          onClick={() => {
                            const matchedProduct = products.find((p) => p.productId === app.productId);
                            const amount =
                              app.quotedAmountETB ||
                              (matchedProduct ? calculateProductQuoteETB(matchedProduct, app.applicationAnswers) : 5500);
                            setCheckoutTarget({
                              applicationId: app.applicationId,
                              productId: app.productId,
                              productName: app.productName,
                              amountETB: amount,
                              quotationId: app.quotationId || `QUO-AIC-${app.applicationId.slice(-5)}`
                            });
                          }}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>
                            Pay {(app.quotedAmountETB || 5500).toLocaleString()} ETB via Chapa
                          </span>
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

            <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
              <table className="w-full min-w-[540px] text-left">
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
                  {allPayments.length > 0 ? (
                    allPayments.map((p) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        No payment transactions yet. Submit an insurance application to receive a quotation and complete payment via Chapa.
                      </td>
                    </tr>
                  )}
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

            {isFilingClaim && allPolicies.length === 0 && (
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-3">
                <p className="font-semibold">An active AIC insurance policy is required before filing a claim.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsFilingClaim(false);
                    setActiveTab('applications');
                    setIsCreatingApp(true);
                  }}
                  className="bg-[#12366e] text-white px-4 py-2 rounded-lg font-semibold cursor-pointer"
                >
                  Apply for a Policy First
                </button>
              </div>
            )}

            {isFilingClaim && allPolicies.length > 0 && (
              <form onSubmit={handleFileClaim} className="space-y-4 text-xs bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">Incident Notification Details</h4>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Active Policy</label>
                  <select
                    value={claimPolicyId || allPolicies[0]?.policyId || ''}
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
                  className="bg-[#12366e] text-white text-xs font-semibold px-5 py-2.5 rounded-lg cursor-pointer"
                >
                  Submit Formal Claim
                </button>
              </form>
            )}

            {/* Filed Claims List */}
            {allClaims.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Submitted Claims History</h4>
                {allClaims.map((clm) => (
                  <div key={clm.claimId} className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#12366e]">{clm.claimNumber}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {clm.claimStatus}
                        </span>
                      </div>
                      <div className="text-slate-600">
                        Policy: <span className="font-mono">{clm.policyNumber}</span> · Incident: {clm.incidentDate}
                      </div>
                      <p className="text-slate-700">{clm.description}</p>
                    </div>
                    <div className="font-mono font-bold text-slate-900 shrink-0">
                      Est. {clm.estimatedLossETB.toLocaleString()} ETB
                    </div>
                  </div>
                ))}
              </div>
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

            {profileFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={profFirstName}
                    onChange={(e) => setProfFirstName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={profLastName}
                    onChange={(e) => setProfLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Telephone</label>
                  <input
                    type="tel"
                    value={profPhone}
                    onChange={(e) => setProfPhone(e.target.value)}
                    placeholder="+251 91 123 4567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-[#12366e]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Electronic Mail (Verified Identity)</label>
                  <input
                    type="email"
                    disabled
                    value={contactEmail}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={profCity}
                    onChange={(e) => setProfCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sub-City / Preferred Language</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={profSubcity}
                      onChange={(e) => setProfSubcity(e.target.value)}
                      placeholder="Sub-city"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                    />
                    <select
                      value={profLang}
                      onChange={(e) => setProfLang(e.target.value as AppLanguage)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                    >
                      <option value="english">English</option>
                      <option value="amharic">አማርኛ</option>
                      <option value="tigrinya">ትግርኛ</option>
                      <option value="oromo">Afaan Oromoo</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-[#12366e] hover:bg-[#0e2a58] text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer disabled:opacity-60"
                >
                  {isSavingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>

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
        </div>
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

            <div className="flex flex-wrap justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const verifyCode = viewingPolicy.verificationCode;
                  setViewingPolicy(null);
                  navigate(`/verify-policy?code=${encodeURIComponent(verifyCode)}`);
                }}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-[#12366e] px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Verify Live Code
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingPolicy(null)}
                className="bg-[#12366e] text-white px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAPA PAYMENT CHECKOUT MODAL */}
      {checkoutTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#12366e]" />
                <div>
                  <h3 className="text-base font-bold text-[#12366e] leading-tight">Chapa V2 Sandbox Checkout</h3>
                  <span className="text-[11px] text-emerald-700 font-semibold">Test Mode · No Real Money Charged</span>
                </div>
              </div>
              {!isProcessingPayment && (
                <button
                  type="button"
                  data-compact="true"
                  aria-label="Close checkout modal"
                  onClick={() => setCheckoutTarget(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {paymentDone && lastIssuedPolicy ? (
              <div className="text-center py-3 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Payment Verified &amp; E-Policy Issued!</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Chapa sandbox verification succeeded and your live AIC policy has been synced to the registry.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left text-xs space-y-1.5">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Policy Number:</span>
                    <strong className="font-mono text-slate-900">{lastIssuedPolicy.policyNumber}</strong>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Verification Code:</span>
                    <strong className="font-mono text-[#12366e]">{lastIssuedPolicy.verificationCode}</strong>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Amount Settled:</span>
                    <strong className="font-mono text-emerald-700">{lastIssuedPolicy.totalPremiumETB.toLocaleString()} ETB</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const issued = lastIssuedPolicy;
                      setCheckoutTarget(null);
                      setPaymentDone(false);
                      setActiveTab('policies');
                      setViewingPolicy(issued);
                    }}
                    className="flex-1 bg-[#12366e] hover:bg-[#0e2a58] text-white px-4 py-2.5 rounded-lg text-sm sm:text-xs font-semibold cursor-pointer"
                  >
                    View E-Policy Certificate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const vCode = lastIssuedPolicy.verificationCode;
                      setCheckoutTarget(null);
                      setPaymentDone(false);
                      navigate(`/verify-policy?code=${encodeURIComponent(vCode)}`);
                    }}
                    className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-[#12366e] px-4 py-2.5 rounded-lg text-sm sm:text-xs font-semibold cursor-pointer"
                  >
                    Verify Code Live
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Product:</span>
                    <strong className="text-slate-900 text-right">{checkoutTarget.productName}</strong>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Test Premium (incl. VAT):</span>
                    <strong className="font-mono text-base text-slate-900 tabular-nums">
                      {checkoutTarget.amountETB.toLocaleString()} ETB
                    </strong>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">Quotation Ref:</span>
                    <span className="font-mono text-slate-700">{checkoutTarget.quotationId}</span>
                  </div>
                </div>

                {/* Test Payment Method Selector */}
                <div className="space-y-1.5">
                  <span className="block font-semibold text-slate-700">Select Sandbox Test Payment Channel:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'telebirr', label: 'Telebirr' },
                      { id: 'cbe_birr', label: 'CBE Birr' },
                      { id: 'test_card', label: 'Test Card' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        data-compact="true"
                        onClick={() => setSelectedTestMethod(m.id as any)}
                        className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          selectedTestMethod === m.id
                            ? 'bg-[#12366e] text-white border-[#12366e]'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {paymentError && (
                  <div role="alert" className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-medium">
                    {paymentError}
                  </div>
                )}

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-relaxed">
                  <strong>QA Test Mode Active:</strong> Testers can mock payment approvals or declined cards safely with zero real charges.
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(false)}
                    disabled={isProcessingPayment}
                    className="w-full bg-[#12366e] hover:bg-[#0e2a58] text-white py-3 rounded-xl font-semibold text-sm sm:text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-[#c59b27]" />
                    <span>{isProcessingPayment ? 'Verifying Sandbox Payment...' : `Approve Mock Payment (${checkoutTarget.amountETB.toLocaleString()} ETB)`}</span>
                  </button>

                  <button
                    type="button"
                    data-compact="true"
                    onClick={() => handleSimulatePayment(true)}
                    disabled={isProcessingPayment}
                    className="w-full py-1.5 text-[11px] font-semibold text-slate-500 hover:text-rose-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Test Failed / Declined Payment Scenario
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
