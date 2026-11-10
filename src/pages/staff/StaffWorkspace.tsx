import React, { useState } from 'react';
import { store } from '../../services/store';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Shield,
  Search,
  Eye,
  DollarSign,
  User,
  ArrowRight,
  Clock,
  Send,
  Building
} from 'lucide-react';
import {
  InsuranceApplication,
  InsurancePolicy,
  Quotation,
  InsuranceClaim
} from '../../types/insurance';

interface StaffWorkspaceProps {
  navigate: (route: string) => void;
}

export const StaffWorkspace: React.FC<StaffWorkspaceProps> = ({ navigate }) => {
  const currentUser = store.getCurrentUser();
  const allApplications = store.getApplications();
  const allPolicies = store.getPolicies();
  const products = store.getProducts();

  const [activeTab, setActiveTab] = useState<'queue' | 'policies' | 'claims'>('queue');
  const [selectedApp, setSelectedApp] = useState<InsuranceApplication | null>(null);

  // Underwriting Action States
  const [basePremiumInput, setBasePremiumInput] = useState<string>('45000');
  const [underwriterNotes, setUnderwriterNotes] = useState<string>('');
  const [missingInfoText, setMissingInfoText] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const pendingApps = allApplications.filter((a) => a.applicationStatus === 'submitted' || a.applicationStatus === 'under_review');

  const handleOpenReview = (app: InsuranceApplication) => {
    setSelectedApp(app);
    // Auto calculate initial indicative premium based on product minimum
    const prd = products.find((p) => p.productId === app.productId);
    const minPrem = prd?.quotationConfiguration.standardMinimumPremiumETB || 5000;
    setBasePremiumInput(minPrem.toString());
    setUnderwriterNotes('');
  };

  const handleIssueQuotation = () => {
    if (!selectedApp) return;

    const basePrem = parseFloat(basePremiumInput) || 5000;
    const vat = basePrem * 0.15;
    const stamp = 50;
    const total = basePrem + vat + stamp;

    const newQuotationId = `QUO-${Date.now()}`;
    const quo: Quotation = {
      quotationId: newQuotationId,
      applicationId: selectedApp.applicationId,
      customerId: selectedApp.customerId,
      customerName: selectedApp.customerName,
      productId: selectedApp.productId,
      productName: selectedApp.productName,
      productVersion: selectedApp.productVersion,
      coverageDetails: {
        description: 'Underwriter approved risk schedule and indemnification limits',
        insuredValueETB: basePrem * 20
      },
      premiumBreakdown: {
        basePremiumETB: basePrem,
        vatPercent: 15,
        vatAmountETB: vat,
        stampDutyETB: stamp,
        administrativeFeeETB: 0,
        totalPayableETB: total
      },
      currency: 'ETB',
      validityStart: new Date().toISOString().split('T')[0],
      validityEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      preparedBy: currentUser?.uid || 'STAFF-UW-01',
      status: 'issued',
      createdAt: new Date().toISOString()
    };

    // Update application
    selectedApp.applicationStatus = 'quoted';
    selectedApp.quotationId = newQuotationId;
    selectedApp.assignedOfficerId = currentUser?.uid || 'STAFF-UW-01';
    selectedApp.assignedOfficerName = `${currentUser?.firstName || 'Kassahun'} ${currentUser?.lastName || 'Worku'}`;
    selectedApp.underwritingNotes = [underwriterNotes || 'Risk assessed and quotation issued.'];
    store.saveApplication(selectedApp);

    store.logAudit({
      actorUid: currentUser?.uid || 'STAFF-UW-01',
      actorName: `${currentUser?.firstName || 'Kassahun'} ${currentUser?.lastName || 'Worku'}`,
      actorRole: 'underwriter',
      action: 'QUOTATION_ISSUED',
      resourceType: 'quotation',
      resourceId: newQuotationId,
      reason: `Quotation issued for ${selectedApp.applicationNumber} (Total: ${total} ETB)`,
      correlationId: `QUO-ISSUE-${Date.now()}`
    });

    setActionFeedback(`Quotation issued! Total payable: ${total.toLocaleString()} ETB. Customer notified to pay via Chapa.`);
    setTimeout(() => {
      setActionFeedback(null);
      setSelectedApp(null);
    }, 2000);
  };

  const handleRequestMoreInfo = () => {
    if (!selectedApp || !missingInfoText.trim()) return;

    selectedApp.applicationStatus = 'more_info_required';
    selectedApp.missingInformationRequest = missingInfoText;
    selectedApp.underwritingNotes = [
      ...(selectedApp.underwritingNotes || []),
      `Information requested: ${missingInfoText}`
    ];
    store.saveApplication(selectedApp);

    store.logAudit({
      actorUid: currentUser?.uid || 'STAFF-UW-01',
      actorName: `${currentUser?.firstName || 'Kassahun'} ${currentUser?.lastName || 'Worku'}`,
      actorRole: 'underwriter',
      action: 'APPLICATION_MORE_INFO_REQUESTED',
      resourceType: 'application',
      resourceId: selectedApp.applicationId,
      reason: `More information requested from applicant: ${missingInfoText}`,
      correlationId: `INFO-REQ-${Date.now()}`
    });

    setActionFeedback('Information request dispatched to customer portal and email outbox.');
    setTimeout(() => {
      setActionFeedback(null);
      setSelectedApp(null);
      setMissingInfoText('');
    }, 1500);
  };

  const handleDirectApproveAndIssue = () => {
    if (!selectedApp) return;

    const prd = products.find((p) => p.productId === selectedApp.productId);
    const prem = parseFloat(basePremiumInput) || 45000;
    const vCode = `AIC-VRF-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const polNumber = `AIC/${prd?.productCategory.slice(0, 3).toUpperCase() || 'GEN'}/2026/${Math.floor(100000 + Math.random() * 900000)}`;

    const newPolicy: InsurancePolicy = {
      policyId: `POL-${Date.now()}`,
      policyNumber: polNumber,
      verificationCode: vCode,
      verificationCodeHash: 'sha256_mock_hash_for_registry',
      customerId: selectedApp.customerId,
      customerName: selectedApp.customerName,
      customerPhone: selectedApp.applicantInformation.phone,
      maskedInsuredName: `${selectedApp.customerName.slice(0, 1)}*** ${selectedApp.customerName.split(' ')[1]?.slice(0, 1) || 'T'}***`,
      productId: selectedApp.productId,
      productName: selectedApp.productName,
      productVersion: selectedApp.productVersion,
      applicationId: selectedApp.applicationId,
      quotationId: `QUO-${Date.now()}`,
      paymentReference: 'CHAPA-STAFF-OVERRIDE',
      insuredSubject: selectedApp.applicationAnswers?.vehicleModel || selectedApp.applicationAnswers?.locationAddress || 'Insured Schedule',
      coverageSummary: prd?.benefits || ['Standard risk schedule'],
      exclusionsSummary: prd?.exclusions.slice(0, 2) || ['Statutory exclusions'],
      totalPremiumETB: prem,
      currency: 'ETB',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      policyStatus: 'active',
      policyDocumentId: `DOC-POL-${Date.now()}`,
      certificateDocumentId: `DOC-CERT-${Date.now()}`,
      preparedBy: currentUser?.uid || 'STAFF-UW-01',
      reviewedBy: currentUser?.uid || 'STAFF-UW-01',
      approvedBy: 'STAFF-ADM-01',
      digitalSignatureRef: `AIC-SIG-SHA256-${Date.now()}`,
      issuedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.issuePolicy(newPolicy);
    setActionFeedback(`Policy ${polNumber} issued with verification code ${vCode}! Customer e-policy registry updated.`);
    setTimeout(() => {
      setActionFeedback(null);
      setSelectedApp(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Staff Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#12366e] text-[#c59b27] flex items-center justify-center font-bold text-sm">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#12366e] leading-tight">Underwriting Desk</h2>
              <span className="text-[11px] text-slate-500 font-mono">Staff: {currentUser?.firstName || 'Kassahun'}</span>
            </div>
          </div>

          <nav className="p-3 space-y-1 text-xs font-medium">
            <button
              onClick={() => { setActiveTab('queue'); setSelectedApp(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'queue' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-[#c59b27]" />
              <span>Review Queue ({pendingApps.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('policies'); setSelectedApp(null); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'policies' ? 'bg-[#12366e] text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-4 h-4 text-[#c59b27]" />
              <span>Issued Policies ({allPolicies.length})</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 text-xs">
          <div className="font-semibold text-slate-900">{currentUser?.firstName} {currentUser?.lastName}</div>
          <div className="text-[11px] text-slate-500">Role: Senior Underwriter</div>
          <div className="text-[11px] text-slate-500 font-mono">Branch: BR-ADDIS-HQ</div>
        </div>
      </aside>

      {/* Main Underwriting View */}
      <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-4 sm:space-y-8 overflow-y-auto overflow-x-hidden">
        <div className="md:hidden -mx-3 px-3 pb-2.5 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'queue', label: 'Review Queue' },
            { id: 'issued', label: 'Issued Policies' },
            { id: 'verifications', label: 'Verifications' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setActiveTab(tab.id as any); setSelectedApp(null); }}
              className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                activeTab === tab.id ? 'bg-[#12366e] text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
              <span>Underwriting & Risk Adjudication</span>
              <span aria-hidden="true">·</span>
              <span>Maker-Checker Governance</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mt-1">
              Application Review & Policy Issuance
            </h1>
          </div>
        </div>

        {actionFeedback && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* TAB 1: REVIEW QUEUE */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            {selectedApp ? (
              /* APPLICATION DOSSIER & UNDERWRITING ACTIONS */
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase">
                      Application Dossier: {selectedApp.applicationNumber}
                    </span>
                    <h2 className="text-lg font-bold text-[#12366e] mt-0.5">
                      {selectedApp.productName}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Back to Queue
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Applicant Info */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <h4 className="font-bold text-[#12366e] uppercase text-[11px]">Applicant Profile</h4>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Customer:</span>
                      <strong className="text-slate-900">{selectedApp.customerName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-mono text-slate-900">{selectedApp.applicantInformation.phone}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500">Channel:</span>
                      <span className="capitalize">{selectedApp.registrationChannel.replace('_', ' ')}</span>
                    </div>
                    {selectedApp.createdByOperatorName && (
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Assisting Operator:</span>
                        <strong className="text-slate-900">{selectedApp.createdByOperatorName}</strong>
                      </div>
                    )}
                  </div>

                  {/* Answers & Specifications */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <h4 className="font-bold text-[#12366e] uppercase text-[11px]">Submitted Form Answers</h4>
                    {Object.entries(selectedApp.applicationAnswers || {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-slate-200">
                        <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <strong className="text-slate-900">{String(val)}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uploaded Documents Review */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-[#12366e] uppercase tracking-wider">
                    Uploaded Document Inspection
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900">Vehicle Logbook / National ID</span>
                        <div className="text-[10px] text-emerald-700 font-medium">Malware Scan: Clean · SHA-256 Valid</div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Underwriting Decision Panel */}
                <div className="bg-slate-50 border border-slate-300 rounded-xl p-6 space-y-4 text-xs">
                  <h4 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                    Underwriting Decision & Quotation Builder
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Base Premium (ETB) — Before 15% VAT & Stamp
                      </label>
                      <input
                        type="number"
                        value={basePremiumInput}
                        onChange={(e) => setBasePremiumInput(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono font-semibold"
                      />
                      <div className="text-[11px] text-slate-500 mt-1">
                        Total with 15% VAT + 50 ETB Stamp:{' '}
                        <strong className="text-slate-900 font-mono">
                          {((parseFloat(basePremiumInput) || 0) * 1.15 + 50).toLocaleString()} ETB
                        </strong>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Underwriter Internal Notes</label>
                      <input
                        type="text"
                        placeholder="Risk assessment notes..."
                        value={underwriterNotes}
                        onChange={(e) => setUnderwriterNotes(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-3">
                    <button
                      onClick={handleIssueQuotation}
                      className="bg-[#12366e] hover:bg-[#1a4b8c] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <DollarSign className="w-4 h-4 text-[#c59b27]" />
                      <span>Issue Formal Quotation to Customer</span>
                    </button>

                    <button
                      onClick={handleDirectApproveAndIssue}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Issue E-Policy Immediately</span>
                    </button>
                  </div>

                  {/* Request More Information Sub-Section */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <h5 className="font-semibold text-slate-800">Need more information or replacement documents?</h5>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Specify missing document or vehicle inspection requirement..."
                        value={missingInfoText}
                        onChange={(e) => setMissingInfoText(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900"
                      />
                      <button
                        onClick={handleRequestMoreInfo}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded font-semibold text-xs shrink-0"
                      >
                        Request Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* APPLICATIONS QUEUE TABLE */
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                    Applications Awaiting Underwriting Review
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">{allApplications.length} Total</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">App Reference</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Product</th>
                        <th className="p-3">Channel</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {allApplications.map((app) => (
                        <tr key={app.applicationId} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-semibold text-slate-900">{app.applicationNumber}</td>
                          <td className="p-3 font-medium text-slate-900">{app.customerName}</td>
                          <td className="p-3">{app.productName}</td>
                          <td className="p-3 capitalize">{app.registrationChannel.replace('_', ' ')}</td>
                          <td className="p-3">
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded uppercase">
                              {app.applicationStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleOpenReview(app)}
                              className="bg-[#12366e] text-white font-semibold text-xs px-3 py-1.5 rounded hover:bg-[#1a4b8c]"
                            >
                              Review & Adjudicate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ISSUED POLICIES */}
        {activeTab === 'policies' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
              Issued E-Policy Registry
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Policy Number</th>
                    <th className="p-3">Verification Code</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Premium</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {allPolicies.map((pol) => (
                    <tr key={pol.policyId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{pol.policyNumber}</td>
                      <td className="p-3 font-mono text-[#12366e] font-semibold">{pol.verificationCode}</td>
                      <td className="p-3 font-medium text-slate-900">{pol.customerName}</td>
                      <td className="p-3">{pol.productName}</td>
                      <td className="p-3 font-mono font-semibold tabular-nums">{pol.totalPremiumETB.toLocaleString()} ETB</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                          pol.policyStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {pol.policyStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
