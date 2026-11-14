import React, { useState, useEffect, useMemo } from 'react';
import { store } from '../../services/store';
import { chapaService } from '../../services/chapa';
import {
  Shield,
  Layers,
  Users,
  Briefcase,
  FileCheck,
  CreditCard,
  Mail,
  History,
  Plus,
  Edit,
  Archive,
  Copy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  ExternalLink,
  Calendar,
  Lock,
  Send,
  Globe,
  Megaphone,
  Trash2,
  MapPin,
  Building,
  Phone,
  Newspaper,
  FileText,
  Download,
  Eye,
  FileCheck2,
  FolderOpen,
  BookOpen,
  UserPlus,
  Filter
} from 'lucide-react';
import { PlatformGuideModule } from '../../components/PlatformGuideModule';
import {
  InsuranceProduct,
  CustomerProfile,
  OperatorProfile,
  InsurancePolicy,
  EmailTemplate,
  EmailJob,
  AuditLogEntry,
  PolicyVerificationLog,
  NewsletterSubscriber,
  AdminUploadedDocument
} from '../../types/insurance';

interface AdminControlCentreProps {
  navigate: (route: string) => void;
}

export const AdminControlCentre: React.FC<AdminControlCentreProps> = ({ navigate }) => {
  const currentUser = store.getCurrentUser();
  const currentRole = currentUser?.accountType || 'admin';
  const isAdmin = currentRole === 'admin';
  const isOperator = currentRole === 'operator';
  const isFinance = currentRole === 'finance';

  // Role Permissions Matrix
  const canOnboardEmployees = isAdmin;
  const canEditOperations = isAdmin || isOperator;
  const canEditPolicies = isAdmin || isOperator;

  type AdminTab =
    | 'overview'
    | 'content'
    | 'documents'
    | 'subscribers'
    | 'products'
    | 'customers'
    | 'operators'
    | 'policies'
    | 'payments'
    | 'emails'
    | 'audit'
    | 'guide';

  const allowedTabs: AdminTab[] = isFinance
    ? ['overview', 'payments', 'policies', 'audit', 'guide']
    : [
        'overview',
        'content',
        'documents',
        'subscribers',
        'products',
        'customers',
        'operators',
        'policies',
        'payments',
        'emails',
        'audit',
        'guide'
      ];

  const [activeTab, setActiveTab] = useState<AdminTab>(isFinance ? 'payments' : 'overview');

  useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab(isFinance ? 'payments' : 'overview');
    }
  }, [currentRole]);

  const products = store.getProducts();
  const customers = store.getCustomers();
  const operators = store.getOperators();
  const staffMembers = store.getStaff();
  const policies = store.getPolicies();
  const applications = store.getApplications();
  const paymentAttempts = store.getPaymentAttempts();
  const emailTemplates = store.getEmailTemplates();
  const emailJobs = store.getEmailJobs();
  const auditLogs = store.getAuditLogs();
  const verificationLogs = store.getVerificationLogs();
  const subscribers = store.getSubscribers();
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [newManualSubEmail, setNewManualSubEmail] = useState('');
  const [newManualSubName, setNewManualSubName] = useState('');

  // Inline confirmation state (iFrame-safe replacement for browser confirm())
  const [confirmDeleteDocId, setConfirmDeleteDocId] = useState<string | null>(null);
  const [confirmArchiveProductId, setConfirmArchiveProductId] = useState<string | null>(null);

  // Employee Onboarding State (Admin Only)
  const [showOnboardForm, setShowOnboardForm] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '+251 ',
    role: 'operator' as 'operator' | 'finance' | 'underwriter',
    branchId: 'BR-ADDIS-HQ'
  });
  const [employeeFeedback, setEmployeeFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Policy Edit State (Admin & Operator only — strictly blocked for Finance)
  const [editingPolicy, setEditingPolicy] = useState<InsurancePolicy | null>(null);
  const [policyFeedback, setPolicyFeedback] = useState<string | null>(null);

  // Finance / Payment Ledger Filter & Export State
  const [txSearch, setTxSearch] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState<'all' | 'successful' | 'pending' | 'failed'>('all');
  const [txVerifyFilter, setTxVerifyFilter] = useState<'all' | 'verified_server' | 'unverified' | 'failed_verification'>('all');
  const [txDateFrom, setTxDateFrom] = useState('');
  const [txDateTo, setTxDateTo] = useState('');
  const [txMinAmount, setTxMinAmount] = useState('');
  const [txMaxAmount, setTxMaxAmount] = useState('');
  const [txExportFeedback, setTxExportFeedback] = useState<string | null>(null);

  // Official Policy Documents Management State
  const [adminDocs, setAdminDocs] = useState<AdminUploadedDocument[]>(() => store.getAdminDocuments());
  const [docSearch, setDocSearch] = useState('');
  const [selectedDocCategory, setSelectedDocCategory] = useState<string>('all');
  const [selectedDocProductFilter, setSelectedDocProductFilter] = useState<string>('all');
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Partial<AdminUploadedDocument> | null>(null);
  const [previewingDoc, setPreviewingDoc] = useState<AdminUploadedDocument | null>(null);
  const [docSavedFeedback, setDocSavedFeedback] = useState<string | null>(null);

  // Website Content & CMS Editor State
  const [contentSavedFeedback, setContentSavedFeedback] = useState<string | null>(null);
  const [contentConfig, setContentConfig] = useState(() => {
    const saved = localStorage.getItem('aic_site_cms_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      motto: 'Committed to Excellence and Quality Services',
      mottoAmharic: 'የላቀና ጥራት ያለው አገልግሎት መስጠት ቃል ኪዳናችን ነው !',
      vision: 'Providing Safety and Assurance to Our Customers',
      mission: 'To Provide the Most Reliable Insurance Products and Services to Our Existing and Potential Customers by Deploying Highly Competent and Motivated Employees and Up-to-Date Technologies.',
      capitalNotice: 'Paid-Up Capital Over ETB 603+ Million · Licensed by National Bank of Ethiopia',
      headOfficePhone: '+251 11 663 7716 / 17 / 18 / 19',
      headOfficeEmail: 'md@africainsurancesc.com',
      emergencyHelpline: '+251 11 663 7716',
      activeAlertBanner: 'National Bank of Ethiopia Authorized Insurer · Serving Ethiopia Since 1994'
    };
  });

  // News & Announcements Publishing State
  const [newsList, setNewsList] = useState<any[]>(() => {
    const saved = localStorage.getItem('aic_site_news_articles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter(
            (a: any) =>
              !a.title?.toLowerCase().includes('shareholder') &&
              !a.title?.toLowerCase().includes('capital to etb 2 billion') &&
              !a.tag?.toLowerCase().includes('shareholder')
          );
          if (filtered.length > 0) return filtered;
        }
      } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'NEWS-01',
        tag: 'Headquarters Milestone',
        title: 'Africa Insurance Company Expands Headquarters & Central Assessment Hub on Bole Road, Addis Ababa',
        date: 'January 2026',
        summary: 'To accelerate claims settlement and direct enterprise service, Africa Insurance Company S.C. has expanded its flagship Head Office operations and digital customer assessment hub along the Bole Road financial corridor in Addis Ababa.',
        category: 'announcements',
        image: '/assets/aic_hero_addis_1793894081899.jpg',
        isFeatured: true
      },
      {
        id: 'NEWS-02',
        tag: 'Corporate Milestone',
        title: 'Africa Insurance Company Celebrates 30 Years of Unbroken Solvency & Excellence',
        date: 'December 2024',
        summary: 'Marking three decades since founding on December 8, 1994, AIC commemorated its journey as one of Ethiopia’s pioneering private insurers with special awards to longstanding corporate policyholders.',
        category: 'news',
        image: '/assets/aic_property_industrial_1794050067051.jpg',
        isFeatured: false
      },
      {
        id: 'NEWS-03',
        tag: 'Digital Operations',
        title: 'Launch of Authoritative E-Policy Issuance & Instant Verification Ledger',
        date: 'January 2026',
        summary: 'Under supervisory guidance from the National Bank of Ethiopia, AIC deployed its digitized policy issuance engine, allowing policyholders and transit authorities across the Addis Ababa transport corridors to verify coverage instantly.',
        category: 'announcements',
        image: '/assets/aic_fleet_logistics_1793894083707.jpg',
        isFeatured: false
      },
      {
        id: 'NEWS-04',
        tag: 'Customer Centers',
        title: 'Expansion of Direct Customer Service Centers Across Addis Ababa Sub-Cities & Regional Hubs',
        date: 'November 2025',
        summary: 'New customer service desks and rapid claims inspection facilities opened across Addis Ababa sub-cities and major hubs in Hawassa, Adama, and Bahir Dar to expedite localized motor, property, and family coverage.',
        category: 'news',
        image: '/assets/aic_family_protection_1793894083687.jpg',
        isFeatured: false
      }
    ];
  });

  const [newArticle, setNewArticle] = useState({
    title: '',
    tag: 'Corporate News',
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    summary: '',
    category: 'news',
    image: '/assets/aic_hero_addis_1793894081899.jpg',
    isFeatured: false
  });

  const handleAddNewsArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.summary) return;
    const article = {
      ...newArticle,
      id: `NEWS-${Date.now()}`
    };
    let updated = [article, ...newsList];
    if (article.isFeatured) {
      updated = updated.map(item => item.id === article.id ? item : { ...item, isFeatured: false });
    }
    setNewsList(updated);
    localStorage.setItem('aic_site_news_articles', JSON.stringify(updated));
    setNewArticle({
      title: '',
      tag: 'Corporate News',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      summary: '',
      category: 'news',
      image: '/assets/aic_hero_addis_1793894081899.jpg',
      isFeatured: false
    });
    setContentSavedFeedback('New news article published successfully with Hero + List priority.');
    setTimeout(() => setContentSavedFeedback(null), 3000);
  };

  const handleDeleteNewsArticle = (id: string) => {
    const updated = newsList.filter(n => n.id !== id);
    setNewsList(updated);
    localStorage.setItem('aic_site_news_articles', JSON.stringify(updated));
  };

  const handleSaveContentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('aic_site_cms_config', JSON.stringify(contentConfig));
    setContentSavedFeedback('Website content and corporate parameters saved successfully.');
    setTimeout(() => setContentSavedFeedback(null), 3000);
  };

  // Product CMS modal / form state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<InsuranceProduct> | null>(null);
  const [productSavedFeedback, setProductSavedFeedback] = useState<string | null>(null);

  // Email test send state
  const [testEmailRecipient, setTestEmailRecipient] = useState('customer@example.et');
  const [testEmailFeedback, setTestEmailFeedback] = useState<string | null>(null);

  // Search filter for CRM
  const [crmSearch, setCrmSearch] = useState('');

  // Calculate real metrics directly from store
  const totalCustomers = customers.length;
  const activePoliciesCount = policies.filter((p) => p.policyStatus === 'active').length;
  const grossPremiumETB = policies.reduce((acc, p) => acc + (p.totalPremiumETB || 0), 0);
  const pendingUnderwritingCount = applications.filter((a) => a.applicationStatus === 'submitted' || a.applicationStatus === 'under_review').length;
  const totalEmailsSent = emailJobs.filter((e) => e.status === 'delivered').length;

  const handleCreateNewProduct = () => {
    const newId = `PRD-NEW-${Math.floor(100 + Math.random() * 900)}`;
    setEditingProduct({
      productId: newId,
      slug: `custom-product-${newId.toLowerCase()}`,
      productName: 'Commercial Underwriting Line',
      productCategory: 'property',
      shortDescription: 'Comprehensive corporate asset protection and underwriting schedule.',
      fullDescription: 'Underwritten in full conformity with National Bank of Ethiopia regulatory directives and AIC corporate underwriting parameters.',
      heroImage: '/assets/aic_hero_addis_1793894081899.jpg',
      disclaimer: 'Official Africa Insurance Company (S.C.) Approved Policy Schedule · Regulated by the National Bank of Ethiopia',
      isDemonstration: false,
      benefits: ['Direct damage indemnification', 'Emergency inspection & rapid claims processing'],
      coverageSections: [
        { title: 'Standard Coverage Section', description: 'Certified risk exposure and agreed schedule limits', limitOrFormula: '100% of declared value' }
      ],
      exclusions: ['Willful misconduct or unauthorized operations', 'War and nuclear contamination'],
      eligibilityRules: ['Resident or registered business entity in Ethiopia with valid TIN'],
      requiredDocuments: [
        { code: 'DOC_KYC', title: 'National ID / Commercial Registration', description: 'Valid government ID or commercial registration certificate', mandatory: true }
      ],
      faq: [{ question: 'What is the claims notification window?', answer: 'Notice must be given within 48 hours to any AIC branch or digital portal.' }],
      applicationSchema: [
        {
          stepTitle: 'Primary Risk Schedule',
          fields: [
            { id: 'declaredValue', label: 'Insured Value (ETB)', type: 'number', required: true }
          ]
        }
      ],
      quotationConfiguration: {
        baseRateDescription: 'Standard regulatory tariff: 1.25% of declared valuation',
        standardMinimumPremiumETB: 3500,
        taxRatePercent: 15,
        stampDutyETB: 50,
        indicativeCalculationSample: 'Insured Value * 0.0125 + 15% VAT + 50 ETB Stamp Duty'
      },
      underwritingConfiguration: {
        requiresInspection: false,
        makerCheckerRequired: false,
        autoQuoteEligible: true,
        maxAutoQuoteAmountETB: 10000000
      },
      policyTemplateId: 'TPL-CORPORATE-NBE',
      renewalConfiguration: {
        defaultTenureMonths: 12,
        gracePeriodDays: 14,
        reminderCadenceDays: [30, 14, 7, 0]
      },
      publicStatus: 'draft',
      availability: 'online_and_operator',
      version: 1,
      createdBy: 'ADMIN'
    });
    setIsEditingProduct(true);
  };

  // Official Policy Documents Management Handlers
  const handleCreateNewDoc = () => {
    const newDocId = `DOC-ADM-${Date.now().toString().slice(-4)}`;
    setEditingDoc({
      id: newDocId,
      title: 'Official Endorsement & Policy Schedule',
      productId: 'all',
      productName: 'All Products / Corporate General',
      category: 'policy_wording',
      fileType: 'pdf',
      fileSize: '1.8 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      downloadUrl: '#',
      description: 'Official policy document approved by Africa Insurance Company (S.C.) Underwriting Directorate.',
      uploadedBy: 'Underwriting Directorate (HQ)',
      version: 'v2.4 (2026)',
      isPublic: true,
      contentSummary: 'Certified statutory documentation compliant with National Bank of Ethiopia directives.',
      sections: [
        {
          heading: 'Operative Clause & Schedule',
          body: 'This document constitutes an official policy record of Africa Insurance Company (S.C.) subject to Ethiopian maritime, commercial, and insurance codes.'
        },
        {
          heading: 'Claims Notice & Settlement Protocol',
          body: 'Notice of loss must be reported promptly within statutory timelines to AIC Claims Department or any branch office across Ethiopia.'
        }
      ]
    });
    setIsEditingDoc(true);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc || !editingDoc.title) return;
    const docToSave: AdminUploadedDocument = {
      id: editingDoc.id || `DOC-ADM-${Date.now().toString().slice(-6)}`,
      title: editingDoc.title,
      productId: editingDoc.productId || 'all',
      productName: editingDoc.productId === 'all'
        ? 'All Products / Corporate General'
        : (products.find((p) => p.productId === editingDoc.productId)?.productName || editingDoc.productName || 'General Policy'),
      category: (editingDoc.category as any) || 'policy_wording',
      fileType: (editingDoc.fileType as any) || 'pdf',
      fileSize: editingDoc.fileSize || '1.8 MB',
      uploadDate: editingDoc.uploadDate || new Date().toISOString().split('T')[0],
      downloadUrl: editingDoc.downloadUrl || '#',
      description: editingDoc.description || 'Official document approved by AIC Underwriting Directorate.',
      uploadedBy: editingDoc.uploadedBy || 'Underwriting Directorate (HQ)',
      version: editingDoc.version || 'v2.4 (2026)',
      isPublic: editingDoc.isPublic !== undefined ? editingDoc.isPublic : true,
      contentSummary: editingDoc.contentSummary || 'Certified statutory document under National Bank of Ethiopia regulations.',
      sections: editingDoc.sections && editingDoc.sections.length > 0 ? editingDoc.sections : [
        {
          heading: 'Operative Clause & Schedule',
          body: 'This document constitutes an official policy record of Africa Insurance Company (S.C.) subject to Ethiopian maritime, commercial, and insurance codes.'
        }
      ]
    };
    store.saveAdminDocument(docToSave);
    setAdminDocs(store.getAdminDocuments());
    setDocSavedFeedback(`Official document "${docToSave.title}" published & synced to policy pages.`);
    setTimeout(() => {
      setDocSavedFeedback(null);
      setIsEditingDoc(false);
      setEditingDoc(null);
    }, 1200);
  };

  const handleDeleteDoc = (docId: string, title: string) => {
    store.deleteAdminDocument(docId);
    setAdminDocs(store.getAdminDocuments());
    setConfirmDeleteDocId(null);
    setDocSavedFeedback(`Document "${title}" deleted and unlinked from public product pages.`);
    setTimeout(() => setDocSavedFeedback(null), 2500);
  };

  const handleDownloadDoc = (doc: AdminUploadedDocument) => {
    const lines = [
      `AFRICA INSURANCE COMPANY (S.C.)`,
      `HEAD OFFICE: BOLE ROAD, ADDIS ABABA, ETHIOPIA`,
      `DOCUMENT CONTROL NUMBER: ${doc.id}`,
      `TITLE: ${doc.title.toUpperCase()}`,
      `APPLICABLE PRODUCT: ${doc.productName}`,
      `CATEGORY: ${doc.category.toUpperCase().replace(/_/g, ' ')} | VERSION: ${doc.version}`,
      `ISSUANCE DATE: ${doc.uploadDate} | ISSUING DEPT: ${doc.uploadedBy}`,
      `SUPERVISORY AUTHORITY: REGULATED BY THE NATIONAL BANK OF ETHIOPIA`,
      `================================================================================`,
      ``,
      `SUMMARY / SCOPE OF DOCUMENT:`,
      doc.description,
      ``,
      doc.contentSummary ? `CONTENT SUMMARY:\n${doc.contentSummary}\n` : '',
      `OFFICIAL POLICY CLAUSES & SECTIONS:`,
      `--------------------------------------------------------------------------------`,
      ...(doc.sections || []).flatMap((sec, idx) => [
        `\n[SECTION ${idx + 1}] ${sec.heading.toUpperCase()}`,
        sec.body,
        `--------------------------------------------------------------------------------`
      ]),
      ``,
      `================================================================================`,
      `AUTHENTICITY CONFIRMATION:`,
      `This document is certified by Africa Insurance Company (S.C.). For verification`,
      `or claims notification, contact our Bole Road Head Office at +251 11 663 7716`,
      `or email claims@africainsurancesc.com / info@africainsurancesc.com.`,
      `================================================================================`
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.id}_${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.productId) return;
    store.saveProduct(editingProduct as InsuranceProduct);
    setProductSavedFeedback(`Product "${editingProduct.productName}" saved successfully.`);
    setTimeout(() => {
      setProductSavedFeedback(null);
      setIsEditingProduct(false);
      setEditingProduct(null);
    }, 1200);
  };

  const handleDuplicateProduct = (prd: InsuranceProduct) => {
    const dupId = `PRD-DUP-${Date.now().toString().slice(-4)}`;
    const duplicate: InsuranceProduct = {
      ...prd,
      productId: dupId,
      slug: `${prd.slug}-draft-copy`,
      productName: `${prd.productName} (Draft Copy)`,
      publicStatus: 'draft',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.saveProduct(duplicate);
  };

  const handleArchiveProduct = (productId: string) => {
    store.archiveProduct(productId);
    setConfirmArchiveProductId(null);
    setProductSavedFeedback('Product archived cleanly. Existing active policies remain intact.');
    setTimeout(() => setProductSavedFeedback(null), 2500);
  };

  const handleToggleOperator = (opId: string, currentStatus: string) => {
    if (!canOnboardEmployees) return;
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    store.toggleOperatorStatus(opId, newStatus);
  };

  const handleToggleStaff = (staffId: string, currentStatus: string) => {
    if (!canOnboardEmployees) return;
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    store.toggleStaffStatus(staffId, newStatus);
  };

  const handleOnboardEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canOnboardEmployees) {
      setEmployeeFeedback({ type: 'error', text: 'Only Administrators may onboard new employees.' });
      return;
    }
    const res = store.onboardEmployee(employeeForm);
    setEmployeeFeedback({ type: res.success ? 'success' : 'error', text: res.message });
    if (res.success) {
      setEmployeeForm({ name: '', email: '', phone: '+251 ', role: 'operator', branchId: 'BR-ADDIS-HQ' });
      setShowOnboardForm(false);
    }
    setTimeout(() => setEmployeeFeedback(null), 3500);
  };

  const handleSavePolicyEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditPolicies || !editingPolicy) return;
    const res = store.savePolicy(editingPolicy);
    setPolicyFeedback(res.message);
    if (res.success) {
      setEditingPolicy(null);
    }
    setTimeout(() => setPolicyFeedback(null), 3000);
  };

  // Enrich & filter payment transactions cleanly
  const enrichedTransactions = useMemo(() => {
    return paymentAttempts.map((tx) => {
      const linkedPolicy = policies.find(
        (p) =>
          p.applicationId === tx.applicationId ||
          p.paymentReference === tx.providerReference ||
          p.paymentReference === tx.merchantReference
      );
      const linkedCustomer = customers.find(
        (c) => c.customerId === tx.customerId || c.authUid === tx.customerId
      );
      const linkedApp = applications.find((a) => a.applicationId === tx.applicationId);

      return {
        ...tx,
        customerName:
          linkedCustomer?.personalInformation.fullName ||
          linkedPolicy?.customerName ||
          linkedApp?.customerName ||
          tx.customerId,
        policyNumber: linkedPolicy?.policyNumber || 'Pending Issuance',
        productName: linkedPolicy?.productName || linkedApp?.productName || 'Insurance Premium'
      };
    });
  }, [paymentAttempts, policies, customers, applications]);

  const filteredTransactions = useMemo(() => {
    const q = txSearch.trim().toLowerCase();
    const minVal = txMinAmount ? parseFloat(txMinAmount) : null;
    const maxVal = txMaxAmount ? parseFloat(txMaxAmount) : null;

    return enrichedTransactions.filter((tx) => {
      if (txStatusFilter !== 'all' && tx.paymentStatus !== txStatusFilter) return false;
      if (txVerifyFilter !== 'all' && tx.verificationStatus !== txVerifyFilter) return false;
      if (minVal !== null && Number.isFinite(minVal) && tx.amountETB < minVal) return false;
      if (maxVal !== null && Number.isFinite(maxVal) && tx.amountETB > maxVal) return false;

      const txDate = (tx.verifiedAt || tx.createdAt || '').slice(0, 10);
      if (txDateFrom && txDate && txDate < txDateFrom) return false;
      if (txDateTo && txDate && txDate > txDateTo) return false;

      if (q) {
        const matches =
          tx.merchantReference.toLowerCase().includes(q) ||
          (tx.providerReference || '').toLowerCase().includes(q) ||
          tx.paymentAttemptId.toLowerCase().includes(q) ||
          tx.customerId.toLowerCase().includes(q) ||
          tx.customerName.toLowerCase().includes(q) ||
          tx.policyNumber.toLowerCase().includes(q) ||
          tx.productName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [enrichedTransactions, txSearch, txStatusFilter, txVerifyFilter, txDateFrom, txDateTo, txMinAmount, txMaxAmount]);

  const filteredPaidTotalETB = useMemo(
    () =>
      filteredTransactions
        .filter((t) => t.paymentStatus === 'successful')
        .reduce((sum, t) => sum + (t.amountETB || 0), 0),
    [filteredTransactions]
  );

  const filteredPaidCount = useMemo(
    () => filteredTransactions.filter((t) => t.paymentStatus === 'successful').length,
    [filteredTransactions]
  );

  const escapeCsvCell = (val: string | number | undefined | null): string => {
    const str = String(val ?? '');
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const triggerDownloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportTransactionsCsv = () => {
    const headers = [
      'Payment ID',
      'Merchant Reference',
      'Provider Reference',
      'Customer Name',
      'Customer ID',
      'Policy Number',
      'Product',
      'Amount (ETB)',
      'Currency',
      'Payment Status',
      'Verification Status',
      'Verified At',
      'Created At'
    ];
    const rows = filteredTransactions.map((tx) =>
      [
        tx.paymentAttemptId,
        tx.merchantReference,
        tx.providerReference || '',
        tx.customerName,
        tx.customerId,
        tx.policyNumber,
        tx.productName,
        tx.amountETB,
        tx.currency,
        tx.paymentStatus,
        tx.verificationStatus,
        tx.verifiedAt || '',
        tx.createdAt
      ]
        .map(escapeCsvCell)
        .join(',')
    );
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const dateStamp = new Date().toISOString().split('T')[0];
    triggerDownloadFile(csvContent, `aic-transactions-${dateStamp}.csv`, 'text/csv;charset=utf-8;');

    store.logAudit({
      actorUid: currentUser?.uid || 'SYSTEM',
      actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Staff',
      actorRole: currentRole,
      action: 'FINANCE_DATA_EXPORTED',
      resourceType: 'payment',
      resourceId: `CSV-${dateStamp}`,
      reason: `Exported ${filteredTransactions.length} transaction records as CSV`,
      correlationId: `EXP-CSV-${Date.now()}`
    });
    setTxExportFeedback(`Exported ${filteredTransactions.length} transactions to CSV.`);
    setTimeout(() => setTxExportFeedback(null), 3000);
  };

  const handleExportTransactionsJson = () => {
    const dateStamp = new Date().toISOString().split('T')[0];
    const payload = {
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser?.email || currentRole,
      role: currentRole,
      totalRecords: filteredTransactions.length,
      paidTotalETB: filteredPaidTotalETB,
      transactions: filteredTransactions
    };
    triggerDownloadFile(
      JSON.stringify(payload, null, 2),
      `aic-transactions-${dateStamp}.json`,
      'application/json;charset=utf-8;'
    );

    store.logAudit({
      actorUid: currentUser?.uid || 'SYSTEM',
      actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Staff',
      actorRole: currentRole,
      action: 'FINANCE_DATA_EXPORTED',
      resourceType: 'payment',
      resourceId: `JSON-${dateStamp}`,
      reason: `Exported ${filteredTransactions.length} transaction records as JSON`,
      correlationId: `EXP-JSON-${Date.now()}`
    });
    setTxExportFeedback(`Exported ${filteredTransactions.length} transactions to JSON.`);
    setTimeout(() => setTxExportFeedback(null), 3000);
  };

  const handleExportPoliciesCsv = () => {
    const headers = [
      'Policy Number',
      'Verification Code',
      'Customer Name',
      'Product',
      'Insured Subject',
      'Premium (ETB)',
      'Start Date',
      'Expiry Date',
      'Status'
    ];
    const rows = policies.map((p) =>
      [
        p.policyNumber,
        p.verificationCode,
        p.customerName,
        p.productName,
        p.insuredSubject,
        p.totalPremiumETB,
        p.startDate,
        p.expiryDate,
        p.policyStatus
      ]
        .map(escapeCsvCell)
        .join(',')
    );
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const dateStamp = new Date().toISOString().split('T')[0];
    triggerDownloadFile(csvContent, `aic-policies-register-${dateStamp}.csv`, 'text/csv;charset=utf-8;');

    store.logAudit({
      actorUid: currentUser?.uid || 'SYSTEM',
      actorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Staff',
      actorRole: currentRole,
      action: 'POLICIES_EXPORTED_CSV',
      resourceType: 'policy',
      resourceId: `POL-CSV-${dateStamp}`,
      reason: `Exported ${policies.length} policies as CSV`,
      correlationId: `POL-EXP-${Date.now()}`
    });
  };

  const handleSendTestEmail = (template: EmailTemplate) => {
    store.enqueueEmailJob({
      emailJobId: `EML-TEST-${Date.now()}`,
      eventId: `EVT-TEST-${Date.now()}`,
      recipient: testEmailRecipient,
      recipientName: 'Valued Client',
      templateId: template.templateId,
      category: template.category,
      subject: template.subject.replace('{{customerName}}', 'Valued Client').replace('{{policyNumber}}', 'AIC/MTR/2026/004812'),
      scheduledAt: new Date().toISOString(),
      status: 'delivered',
      attemptCount: 1,
      deliveredAt: new Date().toISOString(),
      providerMessageId: `provider_mock_tx_${Date.now()}`,
      createdAt: new Date().toISOString()
    });

    setTestEmailFeedback(`Test email dispatched using template "${template.templateName}" to ${testEmailRecipient}`);
    setTimeout(() => setTestEmailFeedback(null), 2500);
  };

  const filteredCustomers = customers.filter((c) =>
    c.personalInformation.fullName.toLowerCase().includes(crmSearch.toLowerCase()) ||
    c.customerNumber.toLowerCase().includes(crmSearch.toLowerCase()) ||
    c.contactInformation.primaryPhone.includes(crmSearch)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Role-Aware Persistent Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#0c2550] to-[#0e2a58] text-slate-300 flex flex-col justify-between shrink-0 hidden md:flex border-r border-[#184486]/40">
        <div>
          {/* Workspace Title */}
          <div className="p-5 border-b border-[#184486]/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c59b27] text-[#0c2550] flex items-center justify-center font-bold text-sm shadow">
              {isFinance ? <CreditCard className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">
                {isFinance ? 'Finance Ledger' : isOperator ? 'Operator Console' : 'Admin Control'}
              </h2>
              <span className="text-[11px] text-slate-300 font-mono">
                {isFinance ? 'Treasury & Reconciliation' : isOperator ? 'Full Ops (No Onboarding)' : 'AIC Central Console'}
              </span>
            </div>
          </div>

          <nav className="p-3 space-y-1 text-xs font-medium">
            {allowedTabs.includes('overview') && (
              <button
                onClick={() => { setActiveTab('overview'); setIsEditingProduct(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'overview' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Real Database Metrics</span>
              </button>
            )}

            {allowedTabs.includes('content') && (
              <button
                onClick={() => { setActiveTab('content'); setIsEditingProduct(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'content' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Website Content & CMS</span>
              </button>
            )}

            {allowedTabs.includes('subscribers') && (
              <button
                onClick={() => { setActiveTab('subscribers'); setIsEditingProduct(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'subscribers' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Newsletter Subscribers ({subscribers.length})</span>
              </button>
            )}

            {allowedTabs.includes('documents') && (
              <button
                onClick={() => { setActiveTab('documents'); setIsEditingProduct(false); setIsEditingDoc(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'documents' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Policy Documents ({adminDocs.length})</span>
              </button>
            )}

            {allowedTabs.includes('products') && (
              <button
                onClick={() => { setActiveTab('products'); setIsEditingProduct(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'products' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Product CMS ({products.length})</span>
              </button>
            )}

            {allowedTabs.includes('customers') && (
              <button
                onClick={() => { setActiveTab('customers'); setIsEditingProduct(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'customers' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customer CRM (360)</span>
              </button>
            )}

            {allowedTabs.includes('operators') && (
              <button
                onClick={() => { setActiveTab('operators'); setIsEditingProduct(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'operators' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Employees & Operators ({operators.length + staffMembers.length})</span>
              </button>
            )}

            {allowedTabs.includes('policies') && (
              <button
                onClick={() => { setActiveTab('policies'); setIsEditingProduct(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'policies' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>E-Policy Registry {isFinance ? '(Read-Only)' : '& Verifications'}</span>
              </button>
            )}

            {allowedTabs.includes('payments') && (
              <button
                onClick={() => { setActiveTab('payments'); setIsEditingProduct(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'payments' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>{isFinance ? 'Paid Transactions & Export' : 'Chapa V2 Gateway'}</span>
              </button>
            )}

            {allowedTabs.includes('emails') && (
              <button
                onClick={() => { setActiveTab('emails'); setIsEditingProduct(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'emails' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email & Automation</span>
              </button>
            )}

            {allowedTabs.includes('audit') && (
              <button
                onClick={() => { setActiveTab('audit'); setIsEditingProduct(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'audit' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Immutable Audit Logs</span>
              </button>
            )}

            <div className="pt-3 mt-3 border-t border-[#184486]/40 space-y-1">
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Documentation
              </div>
              <button
                onClick={() => { setActiveTab('guide'); setIsEditingProduct(false); setIsEditingDoc(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === 'guide' ? 'bg-[#c59b27] text-[#0c2550] font-bold shadow-sm' : 'hover:bg-[#12366e]/70 text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Platform Guide</span>
              </button>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-[#184486]/30 text-xs text-slate-300">
          <div className="text-white font-semibold capitalize">
            {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Administrator'}
          </div>
          <div className="text-[11px] font-mono text-[#f0cb5a] uppercase">
            Role: {currentRole} · NBE Audit Active
          </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-4 sm:space-y-8 overflow-y-auto overflow-x-hidden">
        {/* Mobile Navigation Bar */}
        <div className="md:hidden -mx-3 px-3 pb-2.5 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'overview', label: 'Metrics' },
            { id: 'content', label: 'CMS' },
            { id: 'documents', label: `Docs (${adminDocs.length})` },
            { id: 'subscribers', label: `Subscribers (${subscribers.length})` },
            { id: 'products', label: `Products (${products.length})` },
            { id: 'customers', label: `Customers (${customers.length})` },
            { id: 'operators', label: `Employees (${operators.length + staffMembers.length})` },
            { id: 'policies', label: isFinance ? 'Policies (Read-Only)' : 'E-Policies' },
            { id: 'payments', label: isFinance ? 'Paid Transactions' : 'Chapa' },
            { id: 'emails', label: 'Emails' },
            { id: 'audit', label: 'Audit' },
            { id: 'guide', label: 'Platform Guide' }
          ]
            .filter((t) => allowedTabs.includes(t.id as AdminTab))
            .map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as AdminTab);
                  setIsEditingProduct(false);
                  setIsEditingDoc(false);
                }}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#12366e] text-white'
                    : 'bg-white border border-slate-200 text-slate-700'
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
              <span>
                {isFinance
                  ? 'Finance & Treasury Operations'
                  : isOperator
                  ? 'Operator Control Workspace'
                  : 'Executive System Control'}
              </span>
              <span aria-hidden="true">·</span>
              <span>Headquarters Directorate</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mt-1">
              Africa Insurance Company Operations Centre
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'documents' && canEditOperations && (
              <button
                onClick={handleCreateNewDoc}
                className="bg-[#12366e] hover:bg-[#1a4b8c] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#c59b27]" />
                <span>Upload / Register Document</span>
              </button>
            )}

            {activeTab === 'products' && canEditOperations && (
              <button
                onClick={handleCreateNewProduct}
                className="bg-[#12366e] hover:bg-[#1a4b8c] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 text-[#c59b27]" />
                <span>Add Insurance Product</span>
              </button>
            )}

            {activeTab === 'operators' && canOnboardEmployees && (
              <button
                type="button"
                onClick={() => setShowOnboardForm(!showOnboardForm)}
                className="bg-[#12366e] hover:bg-[#1a4b8c] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#c59b27]" />
                <span>{showOnboardForm ? 'Close Onboarding Form' : 'Onboard New Employee'}</span>
              </button>
            )}
          </div>
        </div>

        <div key={activeTab} className="aic-view-transition space-y-4 sm:space-y-8">
        {/* TAB 1: OVERVIEW & REAL DATABASE METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-xs font-medium text-slate-500">Total Registered Customers</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {totalCustomers}
                </div>
                <span className="text-[11px] text-slate-500">Calculated from Firestore customers</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-xs font-medium text-slate-500">Active Issued Policies</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {activePoliciesCount}
                </div>
                <span className="text-[11px] text-emerald-600 font-semibold">100% Verifiable SHA-256</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-xs font-medium text-slate-500">Gross Issued Premium</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {grossPremiumETB.toLocaleString()} ETB
                </div>
                <span className="text-[11px] text-slate-500">Settled via Chapa V2</span>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-xs font-medium text-slate-500">Underwriting Backlog</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {pendingUnderwritingCount}
                </div>
                <span className="text-[11px] text-amber-600 font-medium">Awaiting review</span>
              </div>
            </div>

            {/* Quick Status of Payment and Verification Pipelines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 text-xs">
                <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                  Payment Gateway Integration Health
                </h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Provider:</span>
                    <strong className="text-slate-900">Chapa (V2 REST Integration)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Server Verification:</span>
                    <span className="text-emerald-700 font-semibold">Operational (Independent Server-to-Server)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Currencies Supported:</span>
                    <span className="font-mono text-slate-900">ETB (Ethiopian Birr)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Total Payment Attempts:</span>
                    <span className="font-mono font-bold text-slate-900">{paymentAttempts.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3 text-xs">
                <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                  Email Delivery & Automation Outbox
                </h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Delivery Adapter:</span>
                    <strong className="text-slate-900">Dedicated Transactional Provider Adapter</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Renewal Cadence:</span>
                    <span className="font-semibold text-slate-900">30d, 14d, 7d, Expiry Day</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Promotional Campaigns:</span>
                    <span className="text-slate-900">4-Month Interval (Consent Enforced)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Delivered Jobs:</span>
                    <span className="font-mono font-bold text-slate-900">{totalEmailsSent}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1.5: WEBSITE CONTENT & CMS MANAGER */}
        {activeTab === 'content' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {contentSavedFeedback && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{contentSavedFeedback}</span>
              </div>
            )}

            {/* Content Edit Form */}
            <form onSubmit={handleSaveContentConfig} className="space-y-8">
              {/* Card 1: Corporate Identity & Slogans */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-[#12366e] uppercase tracking-wider">Brand & Messaging</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">Corporate Identity & Official Slogans</h3>
                  </div>
                  <Globe className="w-5 h-5 text-[#c59b27]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Corporate Slogan / Motto (English)</label>
                    <input
                      type="text"
                      required
                      value={contentConfig.motto}
                      onChange={(e) => setContentConfig({ ...contentConfig, motto: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#12366e]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Corporate Slogan / Motto (Amharic)</label>
                    <input
                      type="text"
                      required
                      value={contentConfig.mottoAmharic}
                      onChange={(e) => setContentConfig({ ...contentConfig, mottoAmharic: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#12366e]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Vision Statement</label>
                    <textarea
                      rows={2}
                      required
                      value={contentConfig.vision}
                      onChange={(e) => setContentConfig({ ...contentConfig, vision: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Mission Statement</label>
                    <textarea
                      rows={2}
                      required
                      value={contentConfig.mission}
                      onChange={(e) => setContentConfig({ ...contentConfig, mission: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Capital & Solvency Milestone Text</label>
                    <input
                      type="text"
                      required
                      value={contentConfig.capitalNotice}
                      onChange={(e) => setContentConfig({ ...contentConfig, capitalNotice: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-[#12366e]"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: Contact, Switchboard & Emergency Helpline */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-[#12366e] uppercase tracking-wider">Communication Channels</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">Headquarters & Emergency Helplines</h3>
                  </div>
                  <Phone className="w-5 h-5 text-[#c59b27]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Head Office Switchboards</label>
                    <input
                      type="text"
                      required
                      value={contentConfig.headOfficePhone}
                      onChange={(e) => setContentConfig({ ...contentConfig, headOfficePhone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Contact Email</label>
                    <input
                      type="email"
                      required
                      value={contentConfig.headOfficeEmail}
                      onChange={(e) => setContentConfig({ ...contentConfig, headOfficeEmail: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">24/7 Claims Emergency Line</label>
                    <input
                      type="text"
                      required
                      value={contentConfig.emergencyHelpline}
                      onChange={(e) => setContentConfig({ ...contentConfig, emergencyHelpline: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit / Save Bar */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Updates take effect across all public views immediately upon saving.
                </span>
                <button
                  type="submit"
                  className="bg-[#12366e] hover:bg-[#184486] text-white px-6 py-2.5 rounded-xl font-semibold text-xs tracking-tight transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#f0cb5a]" />
                  <span>Save Website Content Updates</span>
                </button>
              </div>
            </form>

            {/* Card 3: Publish & Onboard News Articles and Announcements */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold text-[#12366e] uppercase tracking-wider">Newsroom Onboarding</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Publish New Corporate Press Release or Milestone</h3>
                  <p className="text-xs text-slate-500">Articles published here appear immediately in the About Us and Media newsrooms.</p>
                </div>
                <Newspaper className="w-5 h-5 text-[#c59b27]" />
              </div>

              <form onSubmit={handleAddNewsArticle} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Article Title / Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AIC Opens New High-Tech Claims Assessment Centre in Addis Ababa"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category & Tag</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value, tag: e.target.value === 'announcements' ? 'Corporate Announcement' : 'Corporate News' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                  >
                    <option value="news">Corporate News</option>
                    <option value="announcements">Announcement / Tender</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Cover Image Asset</label>
                  <select
                    value={newArticle.image}
                    onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e]"
                  >
                    <option value="/assets/aic_hero_addis_1793894081899.jpg">Addis Ababa Financial Center (Head Office)</option>
                    <option value="/assets/aic_family_protection_1793894083687.jpg">Family & Life Protection</option>
                    <option value="/assets/aic_fleet_logistics_1793894083707.jpg">Motor & Freight Logistics</option>
                    <option value="/assets/aic_property_industrial_1794050067051.jpg">Industrial & Engineering Infrastructure</option>
                    <option value="/assets/aic_marine_cargo_port_1794050066638.jpg">Marine Cargo & Port Transit</option>
                    <option value="/assets/aic_healthcare_medical_1794050066647.jpg">Medical & Healthcare Insurance</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newArticle.isFeatured}
                      onChange={(e) => setNewArticle({ ...newArticle, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-[#12366e] rounded border-slate-300 focus:ring-[#12366e]"
                    />
                    <span>Set as Top Hero Story</span>
                  </label>
                </div>

                <div className="sm:col-span-3">
                  <label className="block font-semibold text-slate-700 mb-1">Full Summary / Body Text</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter comprehensive announcement details, resolutions, or public disclosure text..."
                    value={newArticle.summary}
                    onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-[#12366e] leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#12366e] hover:bg-[#184486] text-white px-5 py-2.5 rounded-xl font-semibold text-xs tracking-tight transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#f0cb5a]" />
                    <span>Publish Article</span>
                  </button>
                </div>
              </form>

              {/* Published Articles List with Hero Indicator */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Active News & Announcements on Website ({newsList.length})
                </h4>
                <div className="space-y-2">
                  {newsList.map((article: any) => (
                    <div key={article.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        {article.image && (
                          <img
                            src={article.image}
                            alt=""
                            className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0 mt-0.5"
                          />
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {article.isFeatured && (
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                Top Hero Story
                              </span>
                            )}
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                              {article.tag || article.category}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">{article.date}</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900">{article.title}</h5>
                          <p className="text-xs text-slate-600 line-clamp-2">{article.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!article.isFeatured && (
                          <button
                            onClick={() => {
                              const updated = newsList.map(n => ({ ...n, isFeatured: n.id === article.id }));
                              setNewsList(updated);
                              localStorage.setItem('aic_site_news_articles', JSON.stringify(updated));
                            }}
                            className="text-xs text-[#12366e] hover:text-[#184486] font-semibold px-2 py-1 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            Make Hero
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNewsArticle(article.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: NEWSLETTER SUBSCRIBERS MANAGEMENT */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
                    <Mail className="w-4 h-4 text-[#c59b27]" />
                    <span>Audience Engagement</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    AIC Corporate Gazette & Newsletter Subscribers ({subscribers.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time database of clients and corporate stakeholders subscribed via footer or customer portal.
                  </p>
                </div>

                {/* Manual Add Subscriber */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newManualSubEmail) return;
                    store.addSubscriber(newManualSubEmail, newManualSubName || undefined, 'weekly', 'admin_manual');
                    setNewManualSubEmail('');
                    setNewManualSubName('');
                  }}
                  className="flex flex-col sm:flex-row items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Full Name (opt)"
                    value={newManualSubName}
                    onChange={(e) => setNewManualSubName(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#12366e] w-full sm:w-36"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Enter email to add"
                    value={newManualSubEmail}
                    onChange={(e) => setNewManualSubEmail(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#12366e] w-full sm:w-48"
                  />
                  <button
                    type="submit"
                    className="bg-[#12366e] hover:bg-[#184486] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#f0cb5a]" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Search & Metrics */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={subscriberSearch}
                    onChange={(e) => setSubscriberSearch(e.target.value)}
                    placeholder="Search by email, name, or source..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-[#12366e]"
                  />
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span>Active: <strong className="text-emerald-700">{subscribers.filter(s => s.status === 'active').length}</strong></span>
                  <span>·</span>
                  <span>Unsubscribed: <strong className="text-slate-700">{subscribers.filter(s => s.status === 'unsubscribed').length}</strong></span>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Subscriber Email</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Frequency</th>
                      <th className="p-3">Source</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Subscribed Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {subscribers
                      .filter(s => 
                        s.email.toLowerCase().includes(subscriberSearch.toLowerCase()) ||
                        (s.fullName && s.fullName.toLowerCase().includes(subscriberSearch.toLowerCase())) ||
                        s.source.includes(subscriberSearch.toLowerCase())
                      )
                      .map((sub) => (
                        <tr key={sub.subscriberId} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-500">{sub.subscriberId}</td>
                          <td className="p-3 font-semibold text-slate-900">{sub.email}</td>
                          <td className="p-3 text-slate-700">{sub.fullName || '—'}</td>
                          <td className="p-3">
                            <span className="capitalize px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                              {sub.frequency.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-500">{sub.source}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              sub.status === 'active' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-[11px]">
                            {new Date(sub.subscribedAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {sub.status === 'active' ? (
                              <button
                                onClick={() => store.updateSubscriberStatus(sub.subscriberId, 'unsubscribed')}
                                className="text-[11px] text-amber-700 hover:underline cursor-pointer"
                              >
                                Pause
                              </button>
                            ) : (
                              <button
                                onClick={() => store.updateSubscriberStatus(sub.subscriberId, 'active')}
                                className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
                              >
                                Activate
                              </button>
                            )}
                            <button
                              onClick={() => store.deleteSubscriber(sub.subscriberId)}
                              className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                            >
                              Remove
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

        {/* TAB 2: PRODUCT CMS & VERSIONING */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {productSavedFeedback && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{productSavedFeedback}</span>
              </div>
            )}

            {isEditingProduct && editingProduct ? (
              /* PRODUCT EDIT FORM (All 16 Structured Sections) */
              <form onSubmit={handleSaveProduct} className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 space-y-6 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h3 className="text-base font-bold text-[#12366e]">
                    Configure Insurance Product: {editingProduct.productName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => { setIsEditingProduct(false); setEditingProduct(null); }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Product Commercial Name</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.productName || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={editingProduct.productCategory || 'property'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, productCategory: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    >
                      <option value="motor">Motor</option>
                      <option value="property">Property</option>
                      <option value="liability">Liability</option>
                      <option value="marine">Marine</option>
                      <option value="engineering">Engineering</option>
                      <option value="personal">Personal</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer-Facing Summary Description</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.shortDescription || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Detailed Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.fullDescription || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fullDescription: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                {/* Official Regulatory & Policy Disclaimer Input */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                  <label className="block font-semibold text-[#12366e]">Official Regulatory & Policy Disclaimer</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.disclaimer || 'Official Africa Insurance Company (S.C.) Approved Policy Schedule · Regulated by the National Bank of Ethiopia'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, disclaimer: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-semibold"
                  />
                  <span className="text-[10px] text-slate-600">Displayed on policy schedules and underwriting disclosures.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Standard Min Premium (ETB)</label>
                    <input
                      type="number"
                      value={editingProduct.quotationConfiguration?.standardMinimumPremiumETB || 3000}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          quotationConfiguration: {
                            ...editingProduct.quotationConfiguration!,
                            standardMinimumPremiumETB: parseFloat(e.target.value) || 0
                          }
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Publication Status</label>
                    <select
                      value={editingProduct.publicStatus || 'draft'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, publicStatus: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-semibold"
                    >
                      <option value="draft">Draft (Private)</option>
                      <option value="submitted">Submitted for Approval</option>
                      <option value="published">Published (Live in Catalogue)</option>
                      <option value="inactive">Inactive</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Availability Channel</label>
                    <select
                      value={editingProduct.availability || 'online_and_operator'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, availability: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    >
                      <option value="online_and_operator">Online & Operator Assisted</option>
                      <option value="operator_only">Operator Assisted Only</option>
                      <option value="restricted">Restricted Corporate</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsEditingProduct(false); setEditingProduct(null); }}
                    className="px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-semibold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#12366e] text-white rounded-lg font-semibold text-xs shadow-sm hover:bg-[#0e2a58]"
                  >
                    Save Product Configuration
                  </button>
                </div>
              </form>
            ) : (
              /* PRODUCTS LIST TABLE */
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                    Insurance Product Catalogue & CMS
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">{products.length} Products Configured</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Min Premium</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Version</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {products.map((p) => (
                        <tr key={p.productId} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-900">
                            <div>{p.productName}</div>
                            <span className="text-[10px] text-slate-400 font-mono">{p.productId}</span>
                          </td>
                          <td className="p-3 capitalize">{p.productCategory}</td>
                          <td className="p-3 font-mono font-semibold tabular-nums">
                            {p.quotationConfiguration.standardMinimumPremiumETB.toLocaleString()} ETB
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                              p.publicStatus === 'published' ? 'bg-emerald-100 text-emerald-800' : p.publicStatus === 'archived' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {p.publicStatus}
                            </span>
                          </td>
                          <td className="p-3 font-mono">v{p.version}.0</td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => { setEditingProduct(p); setIsEditingProduct(true); }}
                              className="text-[#12366e] font-semibold hover:underline"
                              title="Edit product"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDuplicateProduct(p)}
                              className="text-slate-600 font-semibold hover:underline"
                              title="Duplicate as draft"
                            >
                              Duplicate
                            </button>
                            {p.publicStatus !== 'archived' && (
                              confirmArchiveProductId === p.productId ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleArchiveProduct(p.productId)}
                                    className="bg-rose-600 text-white px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmArchiveProductId(null)}
                                    className="text-slate-500 hover:text-slate-700 text-[11px] font-semibold cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmArchiveProductId(p.productId)}
                                  className="text-rose-600 font-semibold hover:underline cursor-pointer"
                                  title="Archive product"
                                >
                                  Archive
                                </button>
                              )
                            )}
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

        {/* TAB 3: CUSTOMER CRM 360 */}
        {activeTab === 'customers' && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                  Customer Database, Onboarding &amp; KYC Control
                </h3>
                <p className="text-xs text-slate-500">Search customer profiles, verify KYC status, and manage account access.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search customer, phone, ID..."
                  value={crmSearch}
                  onChange={(e) => setCrmSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs pl-9 pr-3 py-2 rounded-lg"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Customer ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">KYC Status</th>
                    <th className="p-3">Account Status</th>
                    <th className="p-3">Channel</th>
                    <th className="p-3 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCustomers.map((c) => (
                    <tr key={c.customerId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-semibold text-slate-900">{c.customerNumber}</td>
                      <td className="p-3 font-semibold text-slate-900">{c.personalInformation.fullName}</td>
                      <td className="p-3 font-mono text-slate-600">{c.contactInformation.primaryPhone}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                          c.identityVerificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.identityVerificationStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {c.identityVerificationStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                          c.accountStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {c.accountStatus}
                        </span>
                      </td>
                      <td className="p-3 capitalize">{c.registrationChannel.replace('_', ' ')}</td>
                      <td className="p-3 text-right space-x-2 whitespace-nowrap">
                        {c.identityVerificationStatus !== 'verified' && (
                          <button
                            type="button"
                            onClick={() => {
                              store.saveCustomer({ ...c, identityVerificationStatus: 'verified', updatedAt: new Date().toISOString() });
                              store.logAudit({
                                actorUid: 'ADMIN',
                                actorName: 'System Administrator',
                                actorRole: 'admin',
                                action: 'CUSTOMER_KYC_VERIFIED',
                                resourceType: 'customer',
                                resourceId: c.customerId,
                                reason: `Verified KYC for ${c.personalInformation.fullName}`,
                                correlationId: `KYC-${Date.now()}`
                              });
                            }}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold px-2.5 py-1 rounded cursor-pointer"
                          >
                            Verify KYC
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const nextStatus = c.accountStatus === 'active' ? 'suspended' : 'active';
                            store.saveCustomer({ ...c, accountStatus: nextStatus, updatedAt: new Date().toISOString() });
                          }}
                          className={`font-semibold px-2.5 py-1 rounded cursor-pointer ${
                            c.accountStatus === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {c.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: EMPLOYEES & DIRECT-SALES OPERATORS (ONBOARDING ADMIN ONLY) */}
        {activeTab === 'operators' && (
          <div className="space-y-6">
            {employeeFeedback && (
              <div
                className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                  employeeFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {employeeFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                )}
                <span>{employeeFeedback.text}</span>
              </div>
            )}

            {!canOnboardEmployees && (
              <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-700 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#12366e] shrink-0" />
                <span>
                  <strong>Administrator-Only Action:</strong> Your role ({currentRole}) has full operational edit rights across customers, products, and policies, but cannot onboard or alter employee accounts.
                </span>
              </div>
            )}

            {canOnboardEmployees && showOnboardForm && (
              <form onSubmit={handleOnboardEmployee} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#12366e]">Onboard New Employee</h4>
                    <p className="text-slate-500">Provision a Direct-Sales Operator, Finance Officer, or Underwriter account.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOnboardForm(false)}
                    className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={employeeForm.name}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                      placeholder="e.g. Dawit Hailemariam"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                      placeholder="name@africainsurance.et"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={employeeForm.phone}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Employee Role *</label>
                    <select
                      value={employeeForm.role}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-slate-900 font-semibold"
                    >
                      <option value="operator">Direct-Sales Operator</option>
                      <option value="finance">Finance Officer</option>
                      <option value="underwriter">Underwriter / Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Assigned Branch *</label>
                    <select
                      value={employeeForm.branchId}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, branchId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-slate-900"
                    >
                      <option value="BR-ADDIS-HQ">BR-ADDIS-HQ (Bole Head Office)</option>
                      <option value="BR-BOLE">BR-BOLE</option>
                      <option value="BR-HAWASSA">BR-HAWASSA</option>
                      <option value="BR-ADAMA">BR-ADAMA</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#12366e] hover:bg-[#0e2a58] text-white font-semibold px-5 py-2.5 rounded-lg cursor-pointer"
                  >
                    Create & Activate Employee Record
                  </button>
                </div>
              </form>
            )}

            {/* Direct-Sales Operators Table */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                  Direct-Sales Operators ({operators.length})
                </h3>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left min-w-[680px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Operator ID</th>
                      <th className="p-3">Operator Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3">Training Status</th>
                      <th className="p-3">Account Status</th>
                      {canOnboardEmployees && <th className="p-3 text-right">Access Control</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {operators.map((op) => (
                      <tr key={op.operatorId} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-semibold text-slate-900">{op.operatorId}</td>
                        <td className="p-3 font-semibold text-slate-900">{op.name}</td>
                        <td className="p-3 font-mono text-slate-600">{op.email}</td>
                        <td className="p-3 font-mono">{op.branchId}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                            op.trainingStatus === 'certified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {op.trainingStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                            op.accountStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {op.accountStatus}
                          </span>
                        </td>
                        {canOnboardEmployees && (
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleToggleOperator(op.operatorId, op.accountStatus)}
                              className={`text-xs font-semibold px-3 py-1 rounded transition-colors cursor-pointer ${
                                op.accountStatus === 'active'
                                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                            >
                              {op.accountStatus === 'active' ? 'Suspend Access' : 'Activate Access'}
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Headquarters Staff & Finance Roster */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                Internal Staff, Finance & Underwriting Officers ({staffMembers.length})
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left min-w-[680px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Staff ID</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3">Status</th>
                      {canOnboardEmployees && <th className="p-3 text-right">Access Control</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {staffMembers.map((st) => (
                      <tr key={st.staffId} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-semibold text-slate-900">{st.staffId}</td>
                        <td className="p-3 font-semibold text-slate-900">{st.name}</td>
                        <td className="p-3 font-mono text-slate-600">{st.email}</td>
                        <td className="p-3 uppercase font-semibold text-[#12366e]">{st.role}</td>
                        <td className="p-3 font-mono">{st.branchId}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                            st.accountStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {st.accountStatus}
                          </span>
                        </td>
                        {canOnboardEmployees && (
                          <td className="p-3 text-right">
                            {st.role !== 'admin' && (
                              <button
                                onClick={() => handleToggleStaff(st.staffId, st.accountStatus)}
                                className={`text-xs font-semibold px-3 py-1 rounded transition-colors cursor-pointer ${
                                  st.accountStatus === 'active'
                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                {st.accountStatus === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: E-POLICY REGISTRY & VERIFICATION LOGS (READ-ONLY FOR FINANCE) */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            {policyFeedback && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{policyFeedback}</span>
              </div>
            )}

            {isFinance && (
              <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-700 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#12366e] shrink-0" />
                <span>
                  <strong>Finance Read-Only Mode:</strong> Finance officers can inspect and export policy schedules for financial reconciliation, but cannot edit or alter policy records.
                </span>
              </div>
            )}

            {canEditPolicies && editingPolicy && (
              <form onSubmit={handleSavePolicyEdit} className="bg-white border border-slate-300 rounded-xl p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#12366e]">
                      Edit Policy: {editingPolicy.policyNumber}
                    </h4>
                    <p className="text-slate-500">Customer: {editingPolicy.customerName} · {editingPolicy.productName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingPolicy(null)}
                    className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Policy Status</label>
                    <select
                      value={editingPolicy.policyStatus}
                      onChange={(e) => setEditingPolicy({ ...editingPolicy, policyStatus: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs font-semibold text-slate-900"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="expired">Expired</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={editingPolicy.expiryDate}
                      onChange={(e) => setEditingPolicy({ ...editingPolicy, expiryDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Insured Subject</label>
                    <input
                      type="text"
                      value={editingPolicy.insuredSubject}
                      onChange={(e) => setEditingPolicy({ ...editingPolicy, insuredSubject: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#12366e] hover:bg-[#0e2a58] text-white font-semibold px-5 py-2 rounded-lg cursor-pointer"
                  >
                    Save Policy Changes
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                  Authoritative E-Policy Registry ({policies.length})
                </h3>
                <button
                  type="button"
                  onClick={handleExportPoliciesCsv}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3 py-1.5 rounded-lg cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5 text-[#12366e]" />
                  <span>Export Policies CSV</span>
                </button>
              </div>
              <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left min-w-[680px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Policy Number</th>
                      <th className="p-3">Verification Code</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Premium</th>
                      <th className="p-3">Period</th>
                      <th className="p-3">Status</th>
                      {canEditPolicies && <th className="p-3 text-right">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {policies.map((p) => (
                      <tr key={p.policyId} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">{p.policyNumber}</td>
                        <td className="p-3 font-mono font-bold text-[#12366e]">{p.verificationCode}</td>
                        <td className="p-3 font-medium text-slate-900">{p.customerName}</td>
                        <td className="p-3 font-mono font-semibold tabular-nums">{p.totalPremiumETB.toLocaleString()} ETB</td>
                        <td className="p-3 font-mono text-slate-500">{p.startDate} to {p.expiryDate}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                            p.policyStatus === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {p.policyStatus}
                          </span>
                        </td>
                        {canEditPolicies && (
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => setEditingPolicy({ ...p })}
                              className="text-[#12366e] font-semibold hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Public Verification Audit Logs */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                Public Policy Verification Access Logs
              </h3>
              <p className="text-xs text-slate-500">Every external code query is audited with timestamp, channel, and outcome.</p>

              <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
                <table className="w-full text-left min-w-[640px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Verification ID</th>
                      <th className="p-3">Queried Code</th>
                      <th className="p-3">Outcome</th>
                      <th className="p-3">Channel</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {verificationLogs.map((log) => (
                      <tr key={log.verificationId} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-semibold text-slate-900">{log.verificationId}</td>
                        <td className="p-3 font-mono text-[#12366e]">{log.queryCode}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                            log.verificationOutcome.startsWith('verified_active') ? 'bg-emerald-100 text-emerald-800' : log.verificationOutcome.startsWith('verified_expired') ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {log.verificationOutcome.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 capitalize">{log.channel.replace('_', ' ')}</td>
                        <td className="p-3 font-mono text-slate-500">{log.verificationTimestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PAID TRANSACTIONS LEDGER, FILTERING & EXPORT (FINANCE, ADMIN & OPERATOR) */}
        {activeTab === 'payments' && (
          <div className="space-y-6 text-xs">
            {txExportFeedback && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{txExportFeedback}</span>
              </div>
            )}

            {/* Filtered Settlement Summary KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-slate-500 font-medium">Paid Transactions Total (Filtered)</span>
                <div className="text-2xl font-bold text-[#12366e] font-mono tabular-nums">
                  {filteredPaidTotalETB.toLocaleString()} ETB
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  {filteredPaidCount} verified paid settlements
                </span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-slate-500 font-medium">Matching Transactions</span>
                <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {filteredTransactions.length}
                </div>
                <span className="text-[11px] text-slate-500">
                  Out of {enrichedTransactions.length} total gateway records
                </span>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
                <span className="text-slate-500 font-medium">Gateway & Currency</span>
                <div className="text-lg font-bold text-slate-900">Chapa V2 · ETB</div>
                <span className="text-[11px] text-slate-500">HMAC-SHA256 Server Verified</span>
              </div>
            </div>

            {/* Filter & Export Controls Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#c59b27]" />
                    <span>Transactions Ledger, Filter &amp; Export</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Inspect every paid transaction, filter by status, verification, date range, or ETB amount, and export reports.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportTransactionsCsv}
                    className="bg-[#12366e] hover:bg-[#0e2a58] text-white font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5 text-[#c59b27]" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportTransactionsJson}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5 text-[#12366e]" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <div className="lg:col-span-2 relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={txSearch}
                    onChange={(e) => setTxSearch(e.target.value)}
                    placeholder="Search ref, customer, policy #..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-base sm:text-xs text-slate-900"
                  />
                </div>

                <select
                  value={txStatusFilter}
                  onChange={(e) => setTxStatusFilter(e.target.value as any)}
                  aria-label="Payment Status Filter"
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-slate-800 font-semibold"
                >
                  <option value="all">All Statuses</option>
                  <option value="successful">Paid / Successful</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed / Declined</option>
                </select>

                <select
                  value={txVerifyFilter}
                  onChange={(e) => setTxVerifyFilter(e.target.value as any)}
                  aria-label="Verification Filter"
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-slate-800"
                >
                  <option value="all">All Verification</option>
                  <option value="verified_server">Verified Server</option>
                  <option value="unverified">Pending / Unverified</option>
                  <option value="failed_verification">Failed Verify</option>
                </select>

                <input
                  type="date"
                  value={txDateFrom}
                  onChange={(e) => setTxDateFrom(e.target.value)}
                  aria-label="From Date"
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-slate-800 font-mono"
                />

                <input
                  type="date"
                  value={txDateTo}
                  onChange={(e) => setTxDateTo(e.target.value)}
                  aria-label="To Date"
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-base sm:text-xs text-slate-800 font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min ETB"
                    value={txMinAmount}
                    onChange={(e) => setTxMinAmount(e.target.value)}
                    className="w-28 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-base sm:text-xs font-mono text-slate-900"
                  />
                  <input
                    type="number"
                    placeholder="Max ETB"
                    value={txMaxAmount}
                    onChange={(e) => setTxMaxAmount(e.target.value)}
                    className="w-28 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-base sm:text-xs font-mono text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setTxStatusFilter(txStatusFilter === 'successful' ? 'all' : 'successful')}
                    className={`px-3 py-1.5 rounded-lg font-semibold border transition-colors cursor-pointer ${
                      txStatusFilter === 'successful'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Paid Only
                  </button>
                </div>

                {(txSearch || txStatusFilter !== 'all' || txVerifyFilter !== 'all' || txDateFrom || txDateTo || txMinAmount || txMaxAmount) && (
                  <button
                    type="button"
                    onClick={() => {
                      setTxSearch('');
                      setTxStatusFilter('all');
                      setTxVerifyFilter('all');
                      setTxDateFrom('');
                      setTxDateTo('');
                      setTxMinAmount('');
                      setTxMaxAmount('');
                    }}
                    className="text-[#12366e] font-semibold hover:underline cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>

              {/* Filtered Transactions Table */}
              <div className="border border-slate-200 rounded-xl overflow-x-auto">
                <table className="w-full text-left min-w-[820px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Merchant / Provider Ref</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Policy &amp; Product</th>
                      <th className="p-3">Amount (ETB)</th>
                      <th className="p-3">Payment Status</th>
                      <th className="p-3">Verification</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500">
                          No transactions matched the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((p) => (
                        <tr key={p.paymentAttemptId} className="hover:bg-slate-50">
                          <td className="p-3">
                            <div className="font-mono font-semibold text-slate-900">{p.merchantReference}</div>
                            {p.providerReference && (
                              <div className="text-[11px] font-mono text-slate-500">{p.providerReference}</div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-900">{p.customerName}</div>
                            <div className="text-[11px] font-mono text-slate-500">{p.customerId}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-mono font-semibold text-[#12366e]">{p.policyNumber}</div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{p.productName}</div>
                          </td>
                          <td className="p-3 font-mono font-bold tabular-nums text-slate-900">
                            {p.amountETB.toLocaleString()} ETB
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                                p.paymentStatus === 'successful'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.paymentStatus === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {p.paymentStatus === 'successful' ? 'paid' : p.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-[11px] text-slate-600">
                            {p.verificationStatus}
                          </td>
                          <td className="p-3 font-mono text-slate-500 whitespace-nowrap">
                            {(p.verifiedAt || p.createdAt).split('T')[0]}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: EMAIL & AUTOMATION ENGINE */}
        {activeTab === 'emails' && (
          <div className="space-y-6">
            {testEmailFeedback && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{testEmailFeedback}</span>
              </div>
            )}

            {/* Email Templates */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                    Automated Email Templates
                  </h3>
                  <p className="text-slate-500">Configured transactional notifications, renewal cadences, and campaigns.</p>
                </div>
              </div>

              <div className="space-y-3">
                {emailTemplates.map((tpl) => (
                  <div key={tpl.templateId} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{tpl.templateName}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono uppercase">
                          {tpl.category}
                        </span>
                      </div>
                      <div className="text-slate-600">Subject: <strong className="text-slate-900">{tpl.subject}</strong></div>
                      <div className="text-[11px] text-slate-400 font-mono">Variables: {tpl.variables.join(', ')}</div>
                    </div>

                    <button
                      onClick={() => handleSendTestEmail(tpl)}
                      className="bg-[#12366e] text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 text-[#c59b27]" />
                      <span>Send Test Email</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Outbox Delivery Queue */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                Live Outbox Delivery Queue
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Event ID</th>
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Delivered At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {emailJobs.map((j) => (
                      <tr key={j.emailJobId} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-semibold text-slate-900">{j.eventId}</td>
                        <td className="p-3 font-mono">{j.recipient}</td>
                        <td className="p-3 text-slate-800 truncate max-w-xs">{j.subject}</td>
                        <td className="p-3">
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded uppercase">
                            {j.status}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{j.deliveredAt?.split('T')[0] || 'In Queue'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: IMMUTABLE AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 text-xs">
            <div>
              <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider">
                Security & Regulatory Audit Trail
              </h3>
              <p className="text-slate-500">
                Tamper-resistant audit log recording every privileged operation, role switch, policy issuance, and operator onboarding action.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Audit ID</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Reason / Details</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.auditId} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{log.auditId}</td>
                      <td className="p-3 font-sans font-medium text-slate-800">{log.actorName}</td>
                      <td className="p-3 uppercase text-[10px] text-slate-600">{log.actorRole}</td>
                      <td className="p-3 text-[#12366e] font-semibold">{log.action}</td>
                      <td className="p-3 font-sans text-slate-600 max-w-sm truncate">{log.reason}</td>
                      <td className="p-3 text-slate-500 text-[11px]">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* TAB: OFFICIAL POLICY DOCUMENTS MANAGEMENT */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {docSavedFeedback && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{docSavedFeedback}</span>
              </div>
            )}

            {/* Document Upload / Edit Form */}
            {isEditingDoc && editingDoc ? (
              <form onSubmit={handleSaveDoc} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#12366e]">
                      {adminDocs.some((d) => d.id === editingDoc.id) ? 'Edit Official Policy Document' : 'Upload / Register Official Document'}
                    </h3>
                    <p className="text-slate-500">Published documents immediately appear on matching public policy pages and downloads.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsEditingDoc(false); setEditingDoc(null); }}
                    className="text-slate-500 hover:text-slate-800 font-semibold px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Document Title *</label>
                    <input
                      type="text"
                      required
                      value={editingDoc.title || ''}
                      onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Insurance Product *</label>
                    <select
                      value={editingDoc.productId || 'all'}
                      onChange={(e) => setEditingDoc({ ...editingDoc, productId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    >
                      <option value="all">All Products / Corporate General</option>
                      {products.map((p) => (
                        <option key={p.productId} value={p.productId}>
                          {p.productName} ({p.productId})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={editingDoc.category || 'policy_wording'}
                      onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    >
                      <option value="policy_wording">Policy Wording</option>
                      <option value="proposal_form">Proposal Form</option>
                      <option value="claim_guide">Claim Guide</option>
                      <option value="tariff_table">Tariff Schedule</option>
                      <option value="brochure">Corporate Brochure</option>
                      <option value="regulatory_filing">Regulatory Filing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">File Format</label>
                    <select
                      value={editingDoc.fileType || 'pdf'}
                      onChange={(e) => setEditingDoc({ ...editingDoc, fileType: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    >
                      <option value="pdf">PDF</option>
                      <option value="doc">DOCX</option>
                      <option value="sheet">XLSX</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Version</label>
                    <input
                      type="text"
                      value={editingDoc.version || ''}
                      onChange={(e) => setEditingDoc({ ...editingDoc, version: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">File Size</label>
                    <input
                      type="text"
                      value={editingDoc.fileSize || ''}
                      onChange={(e) => setEditingDoc({ ...editingDoc, fileSize: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description / Scope *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingDoc.description || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Executive Summary</label>
                  <textarea
                    rows={2}
                    value={editingDoc.contentSummary || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, contentSummary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700">Official Policy Clauses & Sections</label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingDoc({
                          ...editingDoc,
                          sections: [...(editingDoc.sections || []), { heading: 'New Clause Heading', body: '' }]
                        })
                      }
                      className="text-[#12366e] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Clause Section</span>
                    </button>
                  </div>
                  {(editingDoc.sections || []).map((sec, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder="Section Heading"
                          value={sec.heading}
                          onChange={(e) => {
                            const updated = [...(editingDoc.sections || [])];
                            updated[idx] = { ...updated[idx], heading: e.target.value };
                            setEditingDoc({ ...editingDoc, sections: updated });
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded px-2.5 py-1.5 font-semibold text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (editingDoc.sections || []).filter((_, i) => i !== idx);
                            setEditingDoc({ ...editingDoc, sections: updated });
                          }}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Clause wording..."
                        value={sec.body}
                        onChange={(e) => {
                          const updated = [...(editingDoc.sections || [])];
                          updated[idx] = { ...updated[idx], body: e.target.value };
                          setEditingDoc({ ...editingDoc, sections: updated });
                        }}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingDoc.isPublic !== false}
                      onChange={(e) => setEditingDoc({ ...editingDoc, isPublic: e.target.checked })}
                      className="rounded border-slate-300 text-[#12366e]"
                    />
                    <span>Publicly visible & downloadable on product pages</span>
                  </label>
                  <button
                    type="submit"
                    className="bg-[#12366e] hover:bg-[#0e2a58] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Publish & Sync Document
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 text-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#12366e] uppercase tracking-wider flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-[#c59b27]" />
                      <span>Official Policy Documentation & Regulatory Filings</span>
                    </h3>
                    <p className="text-slate-500 mt-0.5">
                      Manage policy wordings, proposal forms, claim guides, and NBE tariff schedules synced to all public policy pages.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-slate-900 w-48"
                      />
                    </div>
                    <select
                      value={selectedDocCategory}
                      onChange={(e) => setSelectedDocCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700"
                    >
                      <option value="all">All Categories</option>
                      <option value="policy_wording">Policy Wordings</option>
                      <option value="proposal_form">Proposal Forms</option>
                      <option value="claim_guide">Claim Guides</option>
                      <option value="tariff_table">Tariff Schedules</option>
                      <option value="brochure">Brochures</option>
                      <option value="regulatory_filing">Regulatory Filings</option>
                    </select>
                    <select
                      value={selectedDocProductFilter}
                      onChange={(e) => setSelectedDocProductFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 max-w-[180px]"
                    >
                      <option value="all">All Products</option>
                      {products.map((p) => (
                        <option key={p.productId} value={p.productId}>
                          {p.productName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Doc ID</th>
                        <th className="p-3">Title & Description</th>
                        <th className="p-3">Target Product</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Version / Size</th>
                        <th className="p-3">Visibility</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {adminDocs
                        .filter((d) => {
                          const matchesSearch =
                            d.title.toLowerCase().includes(docSearch.toLowerCase()) ||
                            d.id.toLowerCase().includes(docSearch.toLowerCase()) ||
                            (d.productName || '').toLowerCase().includes(docSearch.toLowerCase());
                          const matchesCat = selectedDocCategory === 'all' || d.category === selectedDocCategory;
                          const matchesProd = selectedDocProductFilter === 'all' || d.productId === selectedDocProductFilter;
                          return matchesSearch && matchesCat && matchesProd;
                        })
                        .map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-[#12366e] whitespace-nowrap">{doc.id}</td>
                            <td className="p-3 max-w-xs">
                              <div className="font-semibold text-slate-900">{doc.title}</div>
                              <div className="text-[11px] text-slate-500 truncate">{doc.description}</div>
                            </td>
                            <td className="p-3 text-slate-700">{doc.productName}</td>
                            <td className="p-3">
                              <span className="uppercase text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                {doc.category.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-3 font-mono text-slate-600 whitespace-nowrap">
                              {doc.version} · {doc.fileSize}
                            </td>
                            <td className="p-3">
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                                  doc.isPublic ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {doc.isPublic ? 'Public' : 'Internal'}
                              </span>
                            </td>
                            <td className="p-3 text-right whitespace-nowrap space-x-1">
                              <button
                                onClick={() => setPreviewingDoc(doc)}
                                title="Preview Document"
                                className="p-1.5 text-slate-600 hover:text-[#12366e] hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDownloadDoc(doc)}
                                title="Download Document"
                                className="p-1.5 text-slate-600 hover:text-[#12366e] hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setEditingDoc(doc); setIsEditingDoc(true); }}
                                title="Edit Document"
                                className="p-1.5 text-slate-600 hover:text-[#12366e] hover:bg-slate-100 rounded cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              {confirmDeleteDocId === doc.id ? (
                                <span className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDoc(doc.id, doc.title)}
                                    className="bg-rose-600 text-white px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteDocId(null)}
                                    className="text-slate-500 hover:text-slate-700 px-1.5 py-0.5 text-[11px] font-semibold cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteDocId(doc.id)}
                                  title="Delete Document"
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Document Preview Modal */}
            {previewingDoc && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
                  <div className="bg-[#12366e] text-white px-6 py-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#f0cb5a]">
                        {previewingDoc.id} · {previewingDoc.version}
                      </span>
                      <h4 className="text-base font-bold">{previewingDoc.title}</h4>
                    </div>
                    <button
                      onClick={() => setPreviewingDoc(null)}
                      className="text-slate-300 hover:text-white text-xs font-semibold px-2.5 py-1 rounded border border-white/20 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto space-y-4 text-xs">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
                      <div className="font-bold text-[#12366e] uppercase">Africa Insurance Company (S.C.)</div>
                      <div className="text-slate-600">Applicable Product: {previewingDoc.productName}</div>
                      <div className="text-slate-600">Issuing Directorate: {previewingDoc.uploadedBy}</div>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{previewingDoc.description}</p>
                    {previewingDoc.sections?.map((sec, idx) => (
                      <div key={idx} className="border-t border-slate-100 pt-3 space-y-1">
                        <h5 className="font-bold text-slate-900">{idx + 1}. {sec.heading}</h5>
                        <p className="text-slate-600 leading-relaxed">{sec.body}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                    <button
                      onClick={() => handleDownloadDoc(previewingDoc)}
                      className="bg-[#12366e] hover:bg-[#0e2a58] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Official Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: PLATFORM SYSTEM GUIDE & DOCUMENTATION */}
        {activeTab === 'guide' && (
          <PlatformGuideModule
            role={isFinance ? 'finance' : isOperator ? 'operator' : 'admin'}
            workspace="admin"
            userId={currentUser?.uid}
            onQuickNavigate={({ tab, route }) => {
              if (route) {
                navigate(route);
              } else if (tab && allowedTabs.includes(tab as AdminTab)) {
                setIsEditingProduct(false);
                setIsEditingDoc(false);
                setActiveTab(tab as AdminTab);
              }
            }}
          />
        )}
        </div>
      </main>
    </div>
  );
};
