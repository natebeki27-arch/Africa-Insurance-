import React, { useState } from 'react';
import { store } from '../../services/store';
import {
  Briefcase,
  Users,
  UserPlus,
  FileText,
  GraduationCap,
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Upload,
  UserCheck
} from 'lucide-react';
import {
  CustomerProfile,
  InsuranceApplication,
  TrainingCourse,
  TrainingProgress
} from '../../types/insurance';
import { PlatformGuideModule } from '../../components/PlatformGuideModule';

interface OperatorPortalProps {
  navigate: (route: string) => void;
  initialAction?: string;
  initialProductId?: string;
}

export const OperatorPortal: React.FC<OperatorPortalProps> = ({
  navigate,
  initialAction,
  initialProductId
}) => {
  const currentUser = store.getCurrentUser();
  const operatorId = currentUser?.operatorId || 'OP-001';
  const operators = store.getOperators();
  const currentOperator = operators.find((op) => op.operatorId === operatorId) || operators[0];
  const allCustomers = store.getCustomers();
  const allApplications = store.getApplications().filter(
    (a) => a.createdByOperatorId === operatorId || a.branchId === currentOperator.branchId
  );
  const courses = store.getTrainingCourses();
  const progressList = store.getTrainingProgress(currentUser?.uid || 'usr-op-001');
  const products = store.getPublishedProducts();

  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'new_customer' | 'applications' | 'training' | 'manuals' | 'guide'>(
    initialAction === 'new_customer'
      ? 'new_customer'
      : initialAction === 'new_app'
        ? 'applications'
        : 'overview'
  );

  // Search customer state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<CustomerProfile | null>(null);

  // Assisted Customer Registration State
  const [assistedForm, setAssistedForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idType: 'national_id' as const,
    idNumber: '',
    city: 'Addis Ababa',
    subcity: 'Kirkos',
    customerConsentSigned: false,
    consentFormRef: ''
  });
  const [onboardSuccess, setOnboardSuccess] = useState<string | null>(null);
  const [onboardError, setOnboardError] = useState<string | null>(null);

  // Assisted Application Creation State
  const [isCreatingApp, setIsCreatingApp] = useState(initialAction === 'new_app');
  const [appCustomerId, setAppCustomerId] = useState(allCustomers[0]?.customerId || '');
  const [appProductId, setAppProductId] = useState(initialProductId || products[0]?.productId || '');
  const [appAnswers, setAppAnswers] = useState<Record<string, any>>({});
  const [appSuccess, setAppSuccess] = useState<string | null>(null);

  // Training state
  const [activeCourse, setActiveCourse] = useState<TrainingCourse | null>(null);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const selectedAppProduct = products.find((p) => p.productId === appProductId) || products[0];

  // Search logic to prevent duplicate registration
  const handleCustomerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPerformed(true);
    const q = searchQuery.trim().toLowerCase();
    const found = allCustomers.find(
      (c) =>
        c.contactInformation.primaryPhone.includes(q) ||
        c.personalInformation.fullName.toLowerCase().includes(q) ||
        c.personalInformation.idNumberMasked.toLowerCase().includes(q)
    );
    setDuplicateWarning(found || null);
  };

  const handleRegisterAssistedCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    setOnboardError(null);
    if (!assistedForm.customerConsentSigned) {
      setOnboardError('Strict Rule: An operator cannot register a customer without signed customer consent.');
      return;
    }

    // Check operator self-contact rule
    if (
      assistedForm.phone.trim() === currentOperator.phone.trim() ||
      assistedForm.email.trim().toLowerCase() === currentOperator.email.trim().toLowerCase()
    ) {
      setOnboardError('Security Violation: Operators may never substitute their personal phone or email for a customer profile.');
      return;
    }

    const newCustId = `CUST-${Math.floor(100 + Math.random() * 900)}`;
    const custNumber = `AIC-CUST-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCustomer: CustomerProfile = {
      customerId: newCustId,
      authUid: `usr-assisted-${Date.now()}`,
      customerNumber: custNumber,
      customerType: 'individual',
      personalInformation: {
        fullName: `${assistedForm.firstName} ${assistedForm.lastName}`.trim(),
        idType: assistedForm.idType,
        idNumberMasked: `ETH-****-${assistedForm.idNumber.slice(-4) || '7891'}`
      },
      contactInformation: {
        primaryPhone: assistedForm.phone.trim(),
        email: assistedForm.email.trim(),
        preferredLanguage: 'amharic'
      },
      address: {
        city: assistedForm.city,
        subcityOrZone: assistedForm.subcity,
        region: 'Addis Ababa'
      },
      identityVerificationStatus: 'pending',
      accountStatus: 'active',
      registrationChannel: 'assisted_operator',
      createdByOperatorId: operatorId,
      branchId: currentOperator.branchId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.saveCustomer(newCustomer);

    // Update operator performance summary cleanly
    store.recordOperatorActivity(currentOperator.operatorId, 'customer');

    store.logAudit({
      actorUid: currentUser?.uid || 'OP',
      actorName: currentOperator.name,
      actorRole: 'operator',
      action: 'CUSTOMER_REGISTERED_BY_OPERATOR',
      resourceType: 'customer',
      resourceId: newCustId,
      branchId: currentOperator.branchId,
      reason: `Assisted registration completed. Consent Ref: ${assistedForm.consentFormRef || 'SIGNED-HARDCOPY-RECORD'}`,
      correlationId: `OP-REG-${Date.now()}`
    });

    setAssistedForm({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      idType: 'national_id',
      idNumber: '',
      city: 'Addis Ababa',
      subcity: 'Kirkos',
      customerConsentSigned: false,
      consentFormRef: ''
    });
    setOnboardSuccess(`Customer ${newCustomer.personalInformation.fullName} (${custNumber}) registered successfully!`);
    setTimeout(() => {
      setOnboardSuccess(null);
      setActiveTab('customers');
    }, 2000);
  };

  const handleAssistedAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCust = allCustomers.find((c) => c.customerId === appCustomerId) || allCustomers[0];
    const newAppId = `APP-${Date.now()}`;
    const appNumber = `AIC-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: InsuranceApplication = {
      applicationId: newAppId,
      applicationNumber: appNumber,
      customerId: targetCust.customerId,
      customerName: targetCust.personalInformation.fullName,
      productId: selectedAppProduct.productId,
      productName: selectedAppProduct.productName,
      productVersion: selectedAppProduct.version,
      applicantInformation: {
        fullName: targetCust.personalInformation.fullName,
        phone: targetCust.contactInformation.primaryPhone,
        email: targetCust.contactInformation.email,
        address: `${targetCust.address.subcityOrZone}, ${targetCust.address.city}`
      },
      applicationAnswers: appAnswers,
      uploadedDocumentIds: ['DOC-OPERATOR-VERIFIED-01'],
      applicationStatus: 'submitted',
      branchId: currentOperator.branchId,
      createdByOperatorId: operatorId,
      createdByOperatorName: currentOperator.name,
      registrationChannel: 'assisted_operator',
      createdAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.saveApplication(newApp);

    store.recordOperatorActivity(currentOperator.operatorId, 'application');

    store.logAudit({
      actorUid: currentUser?.uid || 'OP',
      actorName: currentOperator.name,
      actorRole: 'operator',
      action: 'OPERATOR_APPLICATION_SUBMITTED',
      resourceType: 'application',
      resourceId: newAppId,
      branchId: currentOperator.branchId,
      reason: `Assisted application ${appNumber} submitted for customer ${targetCust.customerNumber}`,
      correlationId: `OP-APP-${Date.now()}`
    });

    setAppSuccess(`Application ${appNumber} submitted successfully on behalf of customer!`);
    setTimeout(() => {
      setIsCreatingApp(false);
      setAppSuccess(null);
    }, 2000);
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse) return;

    let correctCount = 0;
    activeCourse.assessmentQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const scorePct = Math.round((correctCount / activeCourse.assessmentQuestions.length) * 100);
    setQuizScore(scorePct);
    setQuizSubmitted(true);

    const isPassed = scorePct >= activeCourse.passScorePct;

    const prog: TrainingProgress = {
      userId: currentUser?.uid || 'usr-op-001',
      courseId: activeCourse.courseId,
      completedLessonIds: activeCourse.lessons.map((l) => l.lessonId),
      assessmentScore: scorePct,
      completionStatus: isPassed ? 'passed' : 'failed',
      completedAt: new Date().toISOString(),
      acknowledgedVersion: 'v1.0-NBE-COMPLIANCE'
    };

    store.saveTrainingProgress(prog);

    if (isPassed) {
      store.recordOperatorActivity(currentOperator.operatorId, 'certified');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Operator Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#12366e] text-[#c59b27] flex items-center justify-center font-bold text-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#12366e] leading-tight">Operator Workspace</h2>
              <span className="text-[11px] text-slate-500 font-mono">ID: {operatorId}</span>
            </div>
          </div>

          <nav className="p-3 space-y-1 text-xs font-medium">
            <button
              onClick={() => { setActiveTab('overview'); setIsCreatingApp(false); setActiveCourse(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'overview' && !isCreatingApp ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4 text-[#c59b27]" />
              <span>Operator Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('customers'); setIsCreatingApp(false); setActiveCourse(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'customers' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-[#c59b27]" />
              <span>Search & Customer Registry</span>
            </button>

            <button
              onClick={() => { setActiveTab('new_customer'); setIsCreatingApp(false); setActiveCourse(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'new_customer' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <UserPlus className="w-4 h-4 text-[#c59b27]" />
              <span>Assisted Onboarding</span>
            </button>

            <button
              onClick={() => { setActiveTab('applications'); setActiveCourse(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'applications' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-[#c59b27]" />
              <span>Assisted Applications ({allApplications.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('training'); setIsCreatingApp(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'training' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#c59b27]" />
              <span>Training Academy & Certification</span>
            </button>

            <button
              onClick={() => { setActiveTab('manuals'); setIsCreatingApp(false); setActiveCourse(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'manuals' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#c59b27]" />
              <span>Sales Guidelines & Manuals</span>
            </button>

            <div className="pt-3 mt-3 border-t border-slate-100 space-y-1">
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                System Docs
              </div>
              <button
                onClick={() => { setActiveTab('guide'); setIsCreatingApp(false); setActiveCourse(null); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'guide' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-[#c59b27]" />
                <span>Platform Guide</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Operator Profile Footer */}
        <div className="p-4 border-t border-slate-100 text-xs">
          <div className="font-semibold text-slate-900 truncate">{currentOperator.name}</div>
          <div className="text-[11px] text-slate-500 font-mono">Branch: {currentOperator.branchId}</div>
          <div className="mt-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
              currentOperator.trainingStatus === 'certified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {currentOperator.trainingStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Workspace View */}
      <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-4 sm:space-y-8 overflow-y-auto overflow-x-hidden">
        <div className="md:hidden -mx-3 px-3 pb-2.5 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'customers', label: 'Customers' },
            { id: 'new_customer', label: 'Register' },
            { id: 'applications', label: 'Applications' },
            { id: 'training', label: 'Training' },
            { id: 'manuals', label: 'Manuals' },
            { id: 'guide', label: 'Platform Guide' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setActiveTab(tab.id as any); setIsCreatingApp(false); }}
              className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                activeTab === tab.id ? 'bg-[#12366e] text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
              <span>Authorized Direct-Sales Representative</span>
              <span aria-hidden="true">·</span>
              <span>Branch: {currentOperator.branchId}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mt-1">
              {currentOperator.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('new_customer')}
              className="bg-[#12366e] hover:bg-[#1a4b8c] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-[#c59b27]" />
              <span>Register Customer</span>
            </button>
          </div>
        </div>

        <div key={activeTab} className="aic-view-transition space-y-4 sm:space-y-8">
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-xs font-medium text-slate-500">Customers Onboarded</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {currentOperator.performanceSummary.totalAssistedOnboarded}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Assisted registrations</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-xs font-medium text-slate-500">Applications Filed</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {currentOperator.performanceSummary.totalApplicationsSubmitted}
                </div>
                <span className="text-[11px] text-slate-600 font-medium">Underwriting pipeline</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-xs font-medium text-slate-500">Policies Issued</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {currentOperator.performanceSummary.totalPoliciesIssued}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Converted policies</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-xs font-medium text-slate-500">Compliance Score</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {currentOperator.performanceSummary.complianceScorePct}%
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Regulatory audit pass</span>
              </div>
            </div>

            {/* Quick Actions & Recent Assigned Work */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                Authorized Insurance Products for Sales
              </h3>
              <p className="text-xs text-slate-500">
                You are authorized to onboard customers and intake applications for the following lines:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {currentOperator.assignedProducts.map((pId) => {
                  const p = products.find((item) => item.productId === pId);
                  return (
                    <div key={pId} className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 text-xs space-y-1">
                      <div className="font-bold text-slate-900">{p?.productName || pId}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Min Premium: {p?.quotationConfiguration.standardMinimumPremiumETB} ETB</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEARCH & CUSTOMERS (DUPLICATE PREVENTION) */}
        {activeTab === 'customers' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                Customer Search & Duplicate Account Prevention
              </h3>
              <p className="text-xs text-slate-500">
                Mandatory rule: Operators must query existing records by phone, National ID or full name before creating a new customer profile.
              </p>
            </div>

            <form onSubmit={handleCustomerSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Enter phone number (+251...), National ID, or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs pl-9 pr-3 py-2.5 rounded-lg focus:bg-white focus:outline-none focus:border-[#12366e]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#12366e] text-white text-xs font-semibold px-5 py-2.5 rounded-lg"
              >
                Search
              </button>
            </form>

            {searchPerformed && (
              <div className="space-y-4">
                {duplicateWarning ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-3 text-xs text-amber-900">
                    <div className="flex items-center gap-2 font-bold text-amber-800">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Existing Customer Profile Detected — Do Not Create Duplicate Account!</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-800 bg-white p-3 rounded-lg border border-amber-200">
                      <div>Name: <strong>{duplicateWarning.personalInformation.fullName}</strong></div>
                      <div>Customer No: <strong className="font-mono">{duplicateWarning.customerNumber}</strong></div>
                      <div>Phone: <strong className="font-mono">{duplicateWarning.contactInformation.primaryPhone}</strong></div>
                      <div>ID: <strong className="font-mono">{duplicateWarning.personalInformation.idNumberMasked}</strong></div>
                    </div>
                    <button
                      onClick={() => {
                        setAppCustomerId(duplicateWarning.customerId);
                        setIsCreatingApp(true);
                        setActiveTab('applications');
                      }}
                      className="bg-[#12366e] text-white font-semibold text-xs px-4 py-2 rounded-lg"
                    >
                      Continue Application for this Customer
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>No duplicate record found. You may proceed with assisted onboarding.</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('new_customer')}
                      className="bg-[#12366e] text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg"
                    >
                      Open Registration Form
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Customer List */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">All Customer Records in Branch</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Customer No</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Channel</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {allCustomers.map((c) => (
                      <tr key={c.customerId} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-semibold text-slate-900">{c.customerNumber}</td>
                        <td className="p-3 font-medium text-slate-900">{c.personalInformation.fullName}</td>
                        <td className="p-3 font-mono text-slate-600">{c.contactInformation.primaryPhone}</td>
                        <td className="p-3 capitalize">{c.registrationChannel.replace('_', ' ')}</td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setAppCustomerId(c.customerId);
                              setIsCreatingApp(true);
                              setActiveTab('applications');
                            }}
                            className="text-[#12366e] font-semibold hover:underline"
                          >
                            New Application
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSISTED ONBOARDING */}
        {activeTab === 'new_customer' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#12366e]">Operator-Assisted Customer Registration</h3>
              <p className="text-xs text-slate-500">Every assisted registration is attributed to Operator ID: {operatorId} and Branch: {currentOperator.branchId}.</p>
            </div>

            {onboardError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{onboardError}</span>
              </div>
            )}

            {onboardSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{onboardSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRegisterAssistedCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dawit"
                    value={assistedForm.firstName}
                    onChange={(e) => setAssistedForm({ ...assistedForm, firstName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Father's Name (Last Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mengistu"
                    value={assistedForm.lastName}
                    onChange={(e) => setAssistedForm({ ...assistedForm, lastName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Customer Telephone Number (Must be customer's own phone)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+251 91 ..."
                    value={assistedForm.phone}
                    onChange={(e) => setAssistedForm({ ...assistedForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="customer@example.et"
                    value={assistedForm.email}
                    onChange={(e) => setAssistedForm({ ...assistedForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    required
                    value={assistedForm.city}
                    onChange={(e) => setAssistedForm({ ...assistedForm, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sub-City / Woreda</label>
                  <input
                    type="text"
                    required
                    value={assistedForm.subcity}
                    onChange={(e) => setAssistedForm({ ...assistedForm, subcity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ID Document Type</label>
                  <select
                    value={assistedForm.idType}
                    onChange={(e) => setAssistedForm({ ...assistedForm, idType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  >
                    <option value="national_id">National ID Card</option>
                    <option value="passport">Ethiopian Passport</option>
                    <option value="kebele_id">Kebele Resident ID</option>
                    <option value="business_license">Commercial Trade License</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ID Document Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ETH-4819-2041"
                    value={assistedForm.idNumber}
                    onChange={(e) => setAssistedForm({ ...assistedForm, idNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              {/* Mandatory Authorization Consent Box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                <div className="font-bold text-amber-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-700" />
                  <span>Mandatory Regulatory Customer Authorization Record</span>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer text-amber-950">
                  <input
                    type="checkbox"
                    required
                    checked={assistedForm.customerConsentSigned}
                    onChange={(e) => setAssistedForm({ ...assistedForm, customerConsentSigned: e.target.checked })}
                    className="mt-0.5 rounded border-amber-400 text-[#12366e]"
                  />
                  <span>
                    I certify that I have verified the customer original ID, explained the policy terms, and received signed customer authorization allowing me to create this account on their behalf.
                  </span>
                </label>

                <div>
                  <label className="block font-semibold text-amber-900 mb-1">Physical Consent Reference Number / Form Code</label>
                  <input
                    type="text"
                    placeholder="e.g. AIC-CONSENT-2026-BR-HQ-0419"
                    value={assistedForm.consentFormRef}
                    onChange={(e) => setAssistedForm({ ...assistedForm, consentFormRef: e.target.value })}
                    className="w-full bg-white border border-amber-300 rounded px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#12366e] hover:bg-[#0e2a58] text-white font-semibold text-xs px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>Save & Onboard Customer</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#c59b27]" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: ASSISTED APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                  Assisted Applications Management
                </h3>
                <p className="text-xs text-slate-500">Submit and follow up on customer applications assigned to your branch.</p>
              </div>

              <button
                onClick={() => setIsCreatingApp(!isCreatingApp)}
                className="bg-[#12366e] text-white text-xs font-semibold px-3.5 py-2 rounded-lg"
              >
                {isCreatingApp ? 'Cancel Application' : '+ New Assisted Application'}
              </button>
            </div>

            {appSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{appSuccess}</span>
              </div>
            )}

            {isCreatingApp ? (
              <form onSubmit={handleAssistedAppSubmit} className="space-y-4 text-xs bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm">Assisted Application Intake</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Select Customer</label>
                    <select
                      value={appCustomerId}
                      onChange={(e) => setAppCustomerId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    >
                      {allCustomers.map((c) => (
                        <option key={c.customerId} value={c.customerId}>
                          {c.personalInformation.fullName} ({c.customerNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Select Insurance Product</label>
                    <select
                      value={appProductId}
                      onChange={(e) => setAppProductId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    >
                      {products.map((p) => (
                        <option key={p.productId} value={p.productId}>
                          {p.productName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h5 className="font-bold text-slate-800">Dynamic Product Questions</h5>
                  {selectedAppProduct.applicationSchema[0]?.fields.map((field) => (
                    <div key={field.id}>
                      <label className="block font-semibold text-slate-700 mb-1">{field.label}</label>
                      <input
                        type="text"
                        required={field.required}
                        placeholder={field.placeholder}
                        value={appAnswers[field.id] || ''}
                        onChange={(e) => setAppAnswers({ ...appAnswers, [field.id]: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="bg-[#12366e] text-white text-xs font-semibold px-6 py-2.5 rounded-lg"
                >
                  Submit Assisted Application to Underwriting
                </button>
              </form>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Ref</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {allApplications.map((app) => (
                      <tr key={app.applicationId} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-semibold text-slate-900">{app.applicationNumber}</td>
                        <td className="p-3 font-medium text-slate-900">{app.customerName}</td>
                        <td className="p-3">{app.productName}</td>
                        <td className="p-3">
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded uppercase">
                            {app.applicationStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{app.submittedAt?.split('T')[0] || 'Draft'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: TRAINING ACADEMY */}
        {activeTab === 'training' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-[#12366e]">Direct-Sales Operator Training Academy</h3>
              <p className="text-xs text-slate-500">
                Mandatory certification modules covering National Bank of Ethiopia directives, customer consent, and anti-fraud protocols.
              </p>
            </div>

            {activeCourse ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-base font-bold text-slate-900">{activeCourse.title}</h4>
                  <button
                    onClick={() => setActiveCourse(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Back to Course List
                  </button>
                </div>

                {/* Lesson Reader */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
                  <div className="text-slate-500 font-semibold uppercase text-[11px]">
                    Lesson {activeLessonIdx + 1} of {activeCourse.lessons.length}: {activeCourse.lessons[activeLessonIdx]?.title}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {activeCourse.lessons[activeLessonIdx]?.title}
                  </div>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs">
                    {activeCourse.lessons[activeLessonIdx]?.content}
                  </p>
                  <div className="flex justify-between pt-4 border-t border-slate-200">
                    <button
                      disabled={activeLessonIdx === 0}
                      onClick={() => setActiveLessonIdx((prev) => Math.max(0, prev - 1))}
                      className="text-xs font-semibold text-slate-600 disabled:opacity-30"
                    >
                      Previous Lesson
                    </button>
                    <button
                      disabled={activeLessonIdx === activeCourse.lessons.length - 1}
                      onClick={() => setActiveLessonIdx((prev) => Math.min(activeCourse.lessons.length - 1, prev + 1))}
                      className="text-xs font-semibold text-[#12366e] disabled:opacity-30"
                    >
                      Next Lesson →
                    </button>
                  </div>
                </div>

                {/* Knowledge Assessment Quiz */}
                <div className="bg-white border border-slate-300 rounded-xl p-6 space-y-5 text-xs">
                  <h4 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                    Knowledge Assessment Quiz (Passing Score: {activeCourse.passScorePct}%)
                  </h4>

                  {quizSubmitted ? (
                    <div className={`p-4 rounded-xl border text-xs font-semibold ${
                      (quizScore || 0) >= activeCourse.passScorePct
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}>
                      <div className="text-base font-bold">
                        Score: {quizScore}% — {(quizScore || 0) >= activeCourse.passScorePct ? 'PASSED & CERTIFIED' : 'FAILED — Retake Required'}
                      </div>
                      <p className="mt-1 font-normal">
                        {(quizScore || 0) >= activeCourse.passScorePct
                          ? 'Congratulations! You have satisfied all regulatory compliance checks for sales authorization.'
                          : 'You must review the course material and achieve at least 80% to maintain active sales authorization.'}
                      </p>
                      <button
                        onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
                        className="mt-3 text-xs bg-[#12366e] text-white px-3.5 py-1.5 rounded"
                      >
                        Retake Assessment
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleQuizSubmit} className="space-y-5">
                      {activeCourse.assessmentQuestions.map((q, qIdx) => (
                        <div key={qIdx} className="space-y-2 border-b border-slate-100 pb-3">
                          <div className="font-semibold text-slate-900">
                            {qIdx + 1}. {q.question}
                          </div>
                          <div className="space-y-1.5 pl-2">
                            {q.options.map((opt, optIdx) => (
                              <label key={optIdx} className="flex items-center gap-2 cursor-pointer text-slate-700">
                                <input
                                  type="radio"
                                  name={`question_${qIdx}`}
                                  checked={quizAnswers[qIdx] === optIdx}
                                  onChange={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                                  className="text-[#12366e]"
                                  required
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <button
                        type="submit"
                        className="bg-[#12366e] text-white text-xs font-semibold px-5 py-2.5 rounded-lg"
                      >
                        Submit Knowledge Assessment
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((c) => {
                  const prog = progressList.find((p) => p.courseId === c.courseId);
                  return (
                    <div key={c.courseId} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between text-xs space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded uppercase">
                            {c.audience} course
                          </span>
                          {prog?.completionStatus === 'passed' && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                              Certified ({prog.assessmentScore}%)
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                        <p className="text-slate-600 leading-relaxed">{c.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">{c.lessons.length} Modules</span>
                        <button
                          onClick={() => {
                            setActiveCourse(c);
                            setActiveLessonIdx(0);
                            setQuizSubmitted(false);
                          }}
                          className="bg-[#12366e] text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg"
                        >
                          Open Course
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: MANUALS & CODE OF CONDUCT */}
        {activeTab === 'manuals' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 text-xs text-slate-700">
            <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
              Operator Sales Conduct & Compliance Manual
            </h3>

            <div className="space-y-4 leading-relaxed">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900">1. Principle of Utmost Good Faith (Uberrimae Fidei)</h4>
                <p>
                  Insurance contracts in Ethiopia are governed by the principle of utmost good faith. Direct-sales operators must present policy wordings, terms, exclusions, and deductibles truthfully. Operators must never encourage a customer to conceal pre-existing vehicle damages or property liabilities.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900">2. Customer Ownership of Credentials</h4>
                <p>
                  When registering a customer through assisted onboarding, the customer must remain the exclusive owner of their insurance account. Never enter an operator's phone number as the customer's contact number.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900">3. Document Validation & Anti-Forgery</h4>
                <p>
                  All vehicle Libre documents, commercial licenses, and national IDs must be verified against original documents. Submitting fraudulent photographs or altering chassis numbers triggers immediate account revocation and criminal prosecution under Ethiopian federal law.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PLATFORM SYSTEM GUIDE & DOCUMENTATION */}
        {activeTab === 'guide' && (
          <PlatformGuideModule
            role="operator"
            workspace="operator"
            userId={currentUser?.uid || operatorId}
            onQuickNavigate={({ tab, route }) => {
              if (route) {
                navigate(route);
              } else if (tab) {
                setIsCreatingApp(false);
                setActiveCourse(null);
                setActiveTab(tab as any);
              }
            }}
          />
        )}
        </div>
      </main>
    </div>
  );
};
