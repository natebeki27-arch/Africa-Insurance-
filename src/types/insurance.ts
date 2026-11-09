/**
 * Africa Insurance Company (AIC) - Platform Domain Models & Types
 * Complete specification adhering to the Firestore Database Blueprint.
 */

export type UserRole = 'customer' | 'operator' | 'underwriter' | 'staff' | 'finance' | 'admin';

export interface UserAccount {
  uid: string;
  accountType: UserRole;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  branchId?: string;
  operatorId?: string;
  accountStatus: 'active' | 'suspended' | 'pending_verification' | 'deactivated';
  registrationChannel: 'self_service' | 'assisted_operator' | 'branch_walkin';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  consentRecords?: {
    termsAccepted: boolean;
    dataProcessingAccepted: boolean;
    marketingConsent: boolean;
    timestamp: string;
  };
}

export interface CustomerProfile {
  customerId: string;
  authUid: string;
  customerNumber: string; // e.g. AIC-CUST-2026-0042
  customerType: 'individual' | 'corporate';
  personalInformation: {
    title?: string;
    fullName: string;
    dateOfBirth?: string;
    gender?: string;
    idType: 'national_id' | 'passport' | 'kebele_id' | 'business_license';
    idNumberMasked: string; // e.g. ETH-****-4819
    tinNumber?: string;
    occupation?: string;
  };
  contactInformation: {
    primaryPhone: string;
    secondaryPhone?: string;
    email: string;
    preferredLanguage: 'amharic' | 'english' | 'oromo' | 'tigrinya';
  };
  address: {
    subcityOrZone: string;
    woreda?: string;
    kebeleOrHouseNo?: string;
    city: string; // e.g. Addis Ababa, Hawassa
    region: string; // e.g. Addis Ababa, Oromia, Sidama, Amhara
    postalCode?: string;
  };
  identityVerificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  accountStatus: 'active' | 'dormant' | 'suspended';
  registrationChannel: 'self_service' | 'assisted_operator' | 'branch_walkin';
  createdByOperatorId?: string;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorProfile {
  operatorId: string;
  authUid: string;
  name: string;
  email: string;
  phone: string;
  branchId: string;
  supervisorId: string;
  assignedProducts: string[]; // product IDs
  accountStatus: 'active' | 'suspended' | 'inactive';
  trainingStatus: 'not_started' | 'in_progress' | 'certified' | 'renewal_required';
  performanceSummary: {
    totalAssistedOnboarded: number;
    totalApplicationsSubmitted: number;
    totalPoliciesIssued: number;
    complianceScorePct: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StaffProfile {
  staffId: string;
  authUid: string;
  name: string;
  email: string;
  role: 'underwriter' | 'staff' | 'finance' | 'admin';
  department: 'underwriting' | 'claims' | 'finance' | 'operations' | 'executive';
  branchId: string;
  permissions: string[];
  accountStatus: 'active' | 'inactive';
  supervisorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  branchId: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  managerName: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isHeadquarters?: boolean;
  status: 'active' | 'renovation' | 'closed';
  openingHours: string;
}

export interface DynamicFormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'date' | 'textarea' | 'boolean';
  placeholder?: string;
  options?: { label: string; value: string }[];
  required: boolean;
  helpText?: string;
  defaultValue?: string | number | boolean;
}

export interface InsuranceProduct {
  productId: string;
  slug: string;
  productName: string;
  productCategory: 'motor' | 'property' | 'liability' | 'marine' | 'engineering' | 'personal' | 'business';
  shortDescription: string;
  fullDescription: string;
  disclaimer: string;
  isDemonstration?: boolean;
  coverageSections: {
    title: string;
    description: string;
    limitOrFormula: string;
  }[];
  exclusions: string[];
  eligibilityRules: string[];
  requiredDocuments: {
    code: string;
    title: string;
    description: string;
    mandatory: boolean;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  applicationSchema: {
    stepTitle: string;
    fields: DynamicFormField[];
  }[];
  quotationConfiguration: {
    baseRateDescription: string;
    standardMinimumPremiumETB: number;
    taxRatePercent: number; // e.g. 15% VAT
    stampDutyETB: number; // e.g. 50 ETB
    indicativeCalculationSample: string;
  };
  underwritingConfiguration: {
    requiresInspection: boolean;
    makerCheckerRequired: boolean;
    autoQuoteEligible: boolean;
    maxAutoQuoteAmountETB: number;
  };
  policyTemplateId: string;
  certificateTemplateId?: string;
  renewalConfiguration: {
    defaultTenureMonths: number;
    gracePeriodDays: number;
    reminderCadenceDays: number[]; // [30, 14, 7, 0]
  };
  publicStatus: 'draft' | 'submitted' | 'approved' | 'published' | 'inactive' | 'archived';
  availability: 'online_and_operator' | 'operator_only' | 'restricted';
  version: number;
  createdBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface ProductVersionRecord {
  versionId: string;
  productId: string;
  versionNumber: number;
  contentSnapshot: Partial<InsuranceProduct>;
  legalTermsVersion: string;
  underwritingRulesVersion: string;
  approvalStatus: 'approved' | 'superseded';
  preparedBy: string;
  reviewedBy: string;
  approvedBy: string;
  effectiveFrom: string;
  createdAt: string;
}

export interface InsuranceApplication {
  applicationId: string;
  applicationNumber: string; // e.g. AIC-APP-2026-00812
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  productVersion: number;
  applicantInformation: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };
  applicationAnswers: Record<string, any>;
  uploadedDocumentIds: string[];
  applicationStatus:
    | 'draft'
    | 'submitted'
    | 'under_review'
    | 'more_info_required'
    | 'quoted'
    | 'awaiting_payment'
    | 'payment_verified'
    | 'pending_issuance'
    | 'approved'
    | 'declined'
    | 'withdrawn';
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  branchId: string;
  createdByOperatorId?: string;
  createdByOperatorName?: string;
  registrationChannel: 'self_service' | 'assisted_operator' | 'branch_walkin';
  underwritingNotes?: string[];
  missingInformationRequest?: string;
  quotationId?: string;
  createdAt: string;
  submittedAt?: string;
  updatedAt: string;
}

export interface CustomerDocument {
  documentId: string;
  ownerCustomerId: string;
  applicationId?: string;
  policyId?: string;
  documentType: 'national_id' | 'vehicle_logbook' | 'driver_license' | 'property_title' | 'medical_report' | 'business_license' | 'other';
  title: string;
  originalFileName: string;
  storagePath: string; // private in Storage
  mimeType: string;
  sizeBytes: number;
  checksum: string;
  uploadStatus: 'uploaded' | 'processing' | 'verified' | 'rejected' | 'quarantined';
  malwareScanStatus: 'clean' | 'scanning' | 'flagged';
  reviewStatus: 'pending' | 'accepted' | 'rejected';
  rejectionReason?: string;
  uploadedBy: string;
  uploadedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  version: number;
}

export interface Quotation {
  quotationId: string;
  applicationId: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  productVersion: number;
  coverageDetails: {
    description: string;
    insuredValueETB: number;
    deductibleOrExcessETB?: number;
  };
  premiumBreakdown: {
    basePremiumETB: number;
    vatPercent: number;
    vatAmountETB: number;
    stampDutyETB: number;
    administrativeFeeETB: number;
    totalPayableETB: number;
  };
  currency: 'ETB';
  validityStart: string;
  validityEnd: string; // usually 30 days
  preparedBy: string;
  approvedBy?: string;
  status: 'draft' | 'issued' | 'accepted' | 'expired' | 'superseded';
  createdAt: string;
}

export interface PaymentAttempt {
  paymentAttemptId: string;
  customerId: string;
  applicationId: string;
  quotationId: string;
  provider: 'chapa_v2';
  merchantReference: string; // e.g. AIC-CHAPA-2026-99382
  providerReference?: string;
  checkoutUrl?: string;
  amountETB: number;
  currency: 'ETB';
  paymentStatus: 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded';
  idempotencyKey: string;
  verificationStatus: 'unverified' | 'verified_server' | 'failed_verification';
  verifiedAt?: string;
  rawCallbackMetadata?: Record<string, any>;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsurancePolicy {
  policyId: string;
  policyNumber: string; // authoritative e.g. AIC/POL/2026/00918
  verificationCode: string; // unique, e.g. AIC-VRF-8924-K92X
  verificationCodeHash: string; // SHA-256 or secure hash
  customerId: string;
  customerName: string;
  customerPhone: string;
  maskedInsuredName: string; // for public verification, e.g. "A*** T***"
  productId: string;
  productName: string;
  productVersion: number;
  applicationId: string;
  quotationId: string;
  paymentReference: string;
  insuredSubject: string; // e.g. "Toyota Hilux 2024 / Plate A-82910"
  coverageSummary: string[];
  exclusionsSummary: string[];
  totalPremiumETB: number;
  currency: 'ETB';
  startDate: string; // ISO date
  expiryDate: string; // ISO date
  policyStatus: 'active' | 'expired' | 'cancelled' | 'suspended' | 'superseded';
  policyDocumentId: string;
  certificateDocumentId?: string;
  preparedBy: string;
  reviewedBy: string;
  approvedBy: string;
  digitalSignatureRef?: string;
  issuedAt: string;
  createdAt: string;
  updatedAt: string;
  supersedesPolicyId?: string;
}

export interface PolicyDocument {
  policyDocumentId: string;
  policyId: string;
  documentType: 'schedule' | 'certificate' | 'policy_wording' | 'endorsement';
  title: string;
  templateVersion: string;
  storagePath: string;
  documentVersion: number;
  generatedAt: string;
  checksum: string;
  status: 'valid' | 'revoked';
}

export interface PolicyVerificationLog {
  verificationId: string;
  queryCode: string;
  matchedPolicyId?: string;
  verificationOutcome: 'verified_active' | 'verified_expired' | 'verified_cancelled' | 'verified_suspended' | 'not_found' | 'invalid_format';
  verificationTimestamp: string;
  channel: 'public_portal' | 'institutional_api' | 'qr_scanner';
  ipMasked?: string;
  userAgentSnippet?: string;
}

export interface EmailTemplate {
  templateId: string;
  templateName: string;
  category: 'transactional' | 'renewal_reminder' | 'promotional';
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
  version: number;
  status: 'active' | 'draft' | 'archived';
  preparedBy: string;
  approvedBy?: string;
  updatedAt: string;
}

export interface EmailJob {
  emailJobId: string;
  eventId: string; // idempotency
  recipient: string;
  recipientName: string;
  templateId: string;
  category: 'transactional' | 'renewal_reminder' | 'promotional';
  subject: string;
  scheduledAt: string;
  status: 'queued' | 'processing' | 'delivered' | 'bounced' | 'failed' | 'retrying';
  attemptCount: number;
  lastAttemptAt?: string;
  deliveredAt?: string;
  providerMessageId?: string;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface RenewalAutomationConfig {
  cadenceDays: number[]; // [30, 14, 7, 0]
  campaignsIntervalMonths: number; // 4-month promotional campaigns
  autoSuppressRenewed: boolean;
}

export interface TrainingLesson {
  lessonId: string;
  title: string;
  durationMinutes: number;
  content: string;
  videoUrlPlaceholder?: string;
}

export interface TrainingCourse {
  courseId: string;
  title: string;
  description: string;
  audience: 'operator' | 'staff' | 'all';
  productId?: string;
  required: boolean;
  lessons: TrainingLesson[];
  assessmentQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
  passScorePct: number;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface TrainingProgress {
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  assessmentScore?: number;
  completionStatus: 'not_started' | 'in_progress' | 'passed' | 'failed';
  completedAt?: string;
  acknowledgedVersion?: string;
}

export interface InsuranceClaim {
  claimId: string;
  claimNumber: string; // AIC-CLM-2026-0031
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  incidentDate: string;
  incidentLocation: string;
  description: string;
  estimatedLossETB: number;
  uploadedEvidenceIds: string[];
  claimStatus: 'submitted' | 'under_investigation' | 'surveyor_assigned' | 'approved' | 'settled' | 'declined';
  assignedAdjusterId?: string;
  adjudicationNotes?: string;
  settlementAmountETB?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  auditId: string;
  actorUid: string;
  actorName: string;
  actorRole: UserRole;
  action: string; // e.g. "POLICY_ISSUED", "QUOTATION_APPROVED", "CUSTOMER_REGISTERED_BY_OPERATOR"
  resourceType: 'user' | 'customer' | 'application' | 'quotation' | 'policy' | 'document' | 'payment' | 'product';
  resourceId: string;
  branchId?: string;
  timestamp: string;
  reason?: string;
  metadata?: Record<string, any>;
  correlationId: string;
}

export interface NewsletterSubscriber {
  subscriberId: string;
  email: string;
  fullName?: string;
  frequency: 'weekly' | 'monthly' | 'breaking_announcements';
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  source: 'footer_signup' | 'admin_manual' | 'customer_portal';
}

export interface AdminUploadedDocument {
  id: string;
  title: string;
  productId?: string; // specific product ID (e.g. 'PRD-MTR-01') or 'all' for general public documentation
  productName?: string;
  category: 'policy_wording' | 'proposal_form' | 'claim_guide' | 'tariff_table' | 'brochure' | 'regulatory_filing';
  fileType: 'pdf' | 'doc' | 'sheet';
  fileSize: string;
  uploadDate: string;
  downloadUrl?: string;
  description: string;
  uploadedBy: string;
  version: string;
  isPublic: boolean;
  contentSummary?: string;
  sections?: { heading: string; body: string }[];
}
