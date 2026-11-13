import React, { useState } from 'react';
import { store } from '../../services/store';
import { 
  Shield, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  HelpCircle, 
  Calendar, 
  DollarSign, 
  Lock,
  Download,
  Eye,
  FileCheck2,
  Printer,
  X,
  Share2,
  Building,
  Sparkles
} from 'lucide-react';
import { AdminUploadedDocument } from '../../types/insurance';
import { ResponsiveImage, getCategoryCoverImage } from '../../components/ResponsiveImage';

interface ProductDetailPageProps {
  slug: string;
  navigate: (route: string) => void;
  embedded?: boolean;
  onBack?: () => void;
  onApply?: (productId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  navigate,
  embedded = false,
  onBack,
  onApply
}) => {
  const product = store.getProductBySlug(slug);
  const [selectedDoc, setSelectedDoc] = useState<AdminUploadedDocument | null>(null);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);

  if (!product) {
    return (
      <div className={embedded ? 'bg-white border border-slate-200 rounded-2xl py-14 px-4 text-center' : 'min-h-screen bg-slate-50 py-16 text-center'}>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested insurance policy configuration does not exist.</p>
        <button
          type="button"
          onClick={() => (onBack ? onBack() : navigate('/insurance'))}
          className="mt-4 px-4 py-2 bg-[#12366e] hover:bg-[#0e2a58] text-white text-xs font-semibold rounded-lg cursor-pointer"
        >
          Return to Catalogue
        </button>
      </div>
    );
  }

  // Fetch all official documents uploaded by the admin for this product or general public
  const officialDocs = store.getDocumentsForProduct(product.productId);

  const handleStartApplication = () => {
    if (onApply) {
      onApply(product.productId);
      return;
    }
    const user = store.getCurrentUser();
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/portal?action=new_app&productId=${product.productId}`)}`);
    } else if (user.accountType === 'operator') {
      navigate(`/operator?action=new_app&productId=${product.productId}`);
    } else {
      navigate(`/portal?action=new_app&productId=${product.productId}`);
    }
  };

  const handleDownloadDoc = (doc: AdminUploadedDocument) => {
    // Generate an official document file download
    const content = `================================================================================
AFRICA INSURANCE COMPANY (S.C.)
HEAD OFFICE: Africa Avenue (Bole Road), P.O. Box 12941, Addis Ababa, Ethiopia
Tel: +251 11 663 7716 / 17 / 18 / 19 | Email: md@africainsurancesc.com
Licensed & Supervised by the National Bank of Ethiopia (Lic. No. NBE/INS/003)
================================================================================

DOCUMENT TITLE: ${doc.title.toUpperCase()}
REFERENCE ID:   ${doc.id}
VERSION:        ${doc.version}
CATEGORY:       ${doc.category.toUpperCase().replace('_', ' ')}
TARGET POLICY:  ${product.productName} (Code: ${product.productId})
UPLOAD DATE:    ${doc.uploadDate}
ISSUING OFFICE: ${doc.uploadedBy}

--------------------------------------------------------------------------------
1. EXECUTIVE SUMMARY & JURISDICTION
--------------------------------------------------------------------------------
${doc.description}

Summary of Coverage:
${doc.contentSummary || 'Standard policy provisions underwritten pursuant to the Commercial Code of Ethiopia and National Bank of Ethiopia Directives.'}

--------------------------------------------------------------------------------
2. OFFICIAL CLAUSES, TERMS & CONDITIONS
--------------------------------------------------------------------------------
${(doc.sections || []).map((s, idx) => `
[${idx + 1}] ${s.heading}
--------------------------------------------------------------------------------
${s.body}
`).join('\n')}

--------------------------------------------------------------------------------
3. STATUTORY UNDERWRITING & REGULATORY COMPLIANCE
--------------------------------------------------------------------------------
Policyholder Protection Notice:
This document constitutes the official registered policy terms of Africa Insurance
Company S.C. All benefits and indemnities are guaranteed by statutory actuarial
solvency reserves verified by the National Bank of Ethiopia.

Issued under authority of:
Executive Directorate of Underwriting & Claims
Africa Insurance Company S.C., Addis Ababa, Ethiopia.
================================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.id}_${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessNotice(`Downloaded "${doc.title}" successfully.`);
    setTimeout(() => setDownloadSuccessNotice(null), 4000);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'policy_wording':
        return <span className="bg-blue-100 text-[#12366e] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Policy Wording</span>;
      case 'proposal_form':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Proposal Form</span>;
      case 'claim_guide':
        return <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Claims Guide</span>;
      case 'tariff_table':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Statutory Tariff</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Corporate Document</span>;
    }
  };

  return (
    <div className={embedded ? 'w-full' : 'min-h-screen bg-slate-50 py-6 sm:py-10'}>
      <div className={embedded ? 'space-y-6 sm:space-y-8' : 'max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8'}>
        
        {/* Breadcrumb & Back */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => (onBack ? onBack() : navigate('/insurance'))}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#12366e] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>{onBack ? 'Back to Services & Products' : 'Back to Products Catalogue'}</span>
          </button>
          <div className="text-xs text-slate-500 font-mono">
            ID: {product.productId} · Rev {product.version}.0
          </div>
        </div>

        {/* Download Success Toast */}
        {downloadSuccessNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center justify-between animate-in fade-in shadow-sm">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{downloadSuccessNotice}</span>
            </div>
            <button onClick={() => setDownloadSuccessNotice(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
                <span>{product.productCategory} Line</span>
                <span aria-hidden="true">·</span>
                <span>Online &amp; Operator Application Enabled</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-[#12366e] tracking-tight">
                {product.productName}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Regulatory Assurance Callout */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-900 flex items-start gap-3">
                <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Official Africa Insurance Company S.C. Policy Schedule</strong>
                  <p className="mt-0.5 text-emerald-800">
                    Registered with the National Bank of Ethiopia. Complete your application online or via an authorized AIC operator for immediate digital issuance and policy code generation.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleStartApplication}
                  className="bg-[#12366e] hover:bg-[#0e2a58] text-white text-xs font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Start Online Application</span>
                  <ArrowRight className="w-4 h-4 text-[#c59b27]" />
                </button>
                <div className="text-xs text-slate-500">
                  <span>Indicative minimum: </span>
                  <strong className="text-slate-900 font-mono tabular-nums">
                    {product.quotationConfiguration.standardMinimumPremiumETB.toLocaleString()} ETB
                  </strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[16/10] bg-slate-100">
                <ResponsiveImage
                  src={getCategoryCoverImage(product.productCategory, product.heroImage)}
                  alt={product.productName}
                  priority={!embedded}
                  sizes="(max-width: 1023px) 94vw, 440px"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-white">
                  <span className="bg-[#12366e]/85 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    Africa Insurance S.C.
                  </span>
                  <span className="bg-slate-900/70 backdrop-blur-sm px-2.5 py-1 rounded-md font-mono">
                    {product.productCategory.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: OFFICIAL POLICY DOCUMENTATION UPLOADED BY ADMIN */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#12366e] uppercase tracking-wider">
                  Admin Published Repository
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#12366e]" />
                <span className="text-xs text-slate-500">Verified Policy Wordings & Schedules</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileCheck2 className="w-6 h-6 text-[#12366e]" />
                <span>Official Policy Documentation & Downloads</span>
              </h2>
            </div>
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-900">{officialDocs.length}</span> official documents available
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {officialDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-50/70 border border-slate-200 hover:border-[#12366e]/40 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    {getCategoryBadge(doc.category)}
                    <span className="text-[11px] font-mono text-slate-400">{doc.fileSize} · {doc.fileType.toUpperCase()}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#12366e] transition-colors leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Ver: {doc.version}</span>
                    <span>{doc.uploadDate}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="bg-white hover:bg-slate-100 text-[#12366e] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => handleDownloadDoc(doc)}
                      className="bg-[#12366e] hover:bg-[#0e2a58] text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Structured 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 2 Cols: Scope of Coverage, Exclusions, Application Schema, FAQs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Coverage Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#12366e] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#c59b27]" />
                <span>Scope of Coverage</span>
              </h2>
              <div className="space-y-4 pt-2">
                {product.coverageSections.map((sec, i) => (
                  <div key={i} className="border border-slate-100 rounded-lg p-4 bg-slate-50/50 space-y-1">
                    <h4 className="text-sm font-semibold text-slate-900">{sec.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{sec.description}</p>
                    <div className="pt-2 text-[11px] font-mono text-slate-500">
                      Limit: <span className="text-slate-900 font-semibold">{sec.limitOrFormula}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Exclusions */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#12366e] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Standard Exclusions</span>
              </h2>
              <p className="text-xs text-slate-500">
                The following situations, damages, and perils are specifically excluded under this policy wording:
              </p>
              <ul className="space-y-2 pt-1">
                {product.exclusions.map((ex, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3: Application Form Schema Preview */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#12366e] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#164b96]" />
                <span>Application Intake Schema</span>
              </h2>
              <p className="text-xs text-slate-500">
                Applicants or direct-sales operators complete the following verified fields during dynamic application submission:
              </p>
              <div className="space-y-4 pt-2">
                {product.applicationSchema.map((step, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50/60">
                    <h4 className="text-xs font-semibold text-[#12366e] uppercase tracking-wider mb-2">
                      Step {idx + 1}: {step.stepTitle}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {step.fields.map((f) => (
                        <div key={f.id} className="p-2.5 bg-white border border-slate-200 rounded">
                          <div className="font-medium text-slate-800 flex items-center justify-between">
                            <span>{f.label}</span>
                            {f.required && <span className="text-[10px] text-amber-700 font-semibold">Required</span>}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">Type: {f.type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: FAQs */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#12366e] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#c59b27]" />
                <span>Frequently Asked Questions</span>
              </h2>
              <div className="space-y-3 pt-2">
                {product.faq.map((item, i) => (
                  <div key={i} className="border border-slate-100 rounded-lg p-4 bg-slate-50/50">
                    <h4 className="text-xs font-semibold text-slate-900">{item.question}</h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Required Documents, Underwriting Rules & Summary */}
          <div className="space-y-6">
            {/* Required Documents Card (Customer Submissions) */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                Applicant Mandatory Uploads
              </h3>
              <p className="text-xs text-slate-500">
                To proceed with underwriting review, clear digital scans must be uploaded:
              </p>
              <div className="space-y-3 pt-1">
                {product.requiredDocuments.map((doc) => (
                  <div key={doc.code} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="font-semibold text-slate-900 flex items-center justify-between">
                      <span>{doc.title}</span>
                      {doc.mandatory ? (
                        <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-medium">Mandatory</span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">Optional</span>
                      )}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{doc.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Underwriting & Rating Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                Underwriting Architecture
              </h3>

              <div className="space-y-2.5 text-slate-600">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Physical Inspection:</span>
                  <span className="font-semibold text-slate-900">
                    {product.underwritingConfiguration.requiresInspection ? 'Required' : 'Waived'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Maker-Checker Approval:</span>
                  <span className="font-semibold text-slate-900">
                    {product.underwritingConfiguration.makerCheckerRequired ? 'Mandatory' : 'Standard'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Tax & VAT:</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {product.quotationConfiguration.taxRatePercent}% VAT + {product.quotationConfiguration.stampDutyETB} ETB Stamp
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Tenure & Grace Period:</span>
                  <span className="font-semibold text-slate-900">
                    {product.renewalConfiguration.defaultTenureMonths} Mos ({product.renewalConfiguration.gracePeriodDays}d Grace)
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Policy Template:</span>
                  <span className="font-mono text-slate-700">{product.policyTemplateId}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartApplication}
                  className="w-full bg-[#c59b27] hover:bg-[#d4af37] text-[#0c2550] font-semibold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Document Preview Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(selectedDoc.category)}
                    <span className="text-xs text-slate-400 font-mono">ID: {selectedDoc.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {selectedDoc.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Official Document Letterhead */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-500 font-mono text-[11px]">
                  <span>AFRICA INSURANCE COMPANY (S.C.)</span>
                  <span>VERSION: {selectedDoc.version}</span>
                </div>
                <div className="text-slate-700">
                  <strong>Registered Line:</strong> {selectedDoc.productName || product.productName}
                </div>
                <div className="text-slate-500 text-[11px]">
                  <strong>Uploaded By:</strong> {selectedDoc.uploadedBy} · <strong>Published:</strong> {selectedDoc.uploadDate}
                </div>
              </div>

              {/* Document Summary & Sections */}
              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl text-slate-700">
                  <strong className="text-[#12366e] block mb-1">Document Scope:</strong>
                  <p>{selectedDoc.description}</p>
                  {selectedDoc.contentSummary && (
                    <p className="mt-2 text-slate-600">{selectedDoc.contentSummary}</p>
                  )}
                </div>

                {selectedDoc.sections && selectedDoc.sections.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Policy Sections & Clauses:
                    </h4>
                    {selectedDoc.sections.map((sec, i) => (
                      <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-1">
                        <div className="font-bold text-slate-900">{sec.heading}</div>
                        <p className="text-slate-600 leading-relaxed">{sec.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  Official Statutory Document · National Bank of Ethiopia
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleDownloadDoc(selectedDoc)}
                    className="flex-1 sm:flex-none bg-[#12366e] hover:bg-[#0e2a58] text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File ({selectedDoc.fileSize})</span>
                  </button>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

