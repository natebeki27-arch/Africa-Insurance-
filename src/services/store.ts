import {
  InsuranceProduct,
  Branch,
  OperatorProfile,
  StaffProfile,
  CustomerProfile,
  InsurancePolicy,
  InsuranceApplication,
  TrainingCourse,
  TrainingProgress,
  EmailTemplate,
  EmailJob,
  AuditLogEntry,
  CustomerDocument,
  Quotation,
  PaymentAttempt,
  PolicyVerificationLog,
  UserRole,
  UserAccount,
  NewsletterSubscriber,
  AdminUploadedDocument
} from '../types/insurance';
import {
  SEED_BRANCHES,
  SEED_PRODUCTS,
  SEED_CUSTOMERS,
  SEED_OPERATORS,
  SEED_STAFF,
  SEED_POLICIES,
  SEED_APPLICATIONS,
  SEED_TRAINING_COURSES,
  SEED_EMAIL_TEMPLATES,
  SEED_AUDIT_LOGS,
  SEED_ADMIN_DOCUMENTS
} from '../data/seedData';

const STORAGE_KEYS = {
  CURRENT_USER: 'aic_current_user',
  PRODUCTS: 'aic_products',
  BRANCHES: 'aic_branches',
  CUSTOMERS: 'aic_customers',
  OPERATORS: 'aic_operators',
  STAFF: 'aic_staff',
  APPLICATIONS: 'aic_applications',
  POLICIES: 'aic_policies',
  DOCUMENTS: 'aic_documents',
  ADMIN_DOCUMENTS: 'aic_admin_documents',
  QUOTATIONS: 'aic_quotations',
  PAYMENTS: 'aic_payments',
  VERIFICATION_LOGS: 'aic_verification_logs',
  EMAIL_TEMPLATES: 'aic_email_templates',
  EMAIL_JOBS: 'aic_email_jobs',
  TRAINING_COURSES: 'aic_training_courses',
  TRAINING_PROGRESS: 'aic_training_progress',
  AUDIT_LOGS: 'aic_audit_logs',
  SETTINGS: 'aic_settings',
  SUBSCRIBERS: 'aic_subscribers'
};

class AICStore {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initializeIfEmpty();
  }

  private initializeIfEmpty() {
    // Ensure products exist and are migrated from legacy demonstration data
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    let shouldRefreshProducts = false;
    if (!storedProducts) {
      shouldRefreshProducts = true;
    } else {
      try {
        const parsed = JSON.parse(storedProducts);
        if (
          !Array.isArray(parsed) ||
          parsed.length === 0 ||
          parsed.some(
            (p: any) =>
              p.isDemonstration ||
              p.productName?.toLowerCase().includes('demonstration') ||
              p.slug?.toLowerCase().includes('demonstration')
          )
        ) {
          shouldRefreshProducts = true;
        }
      } catch (e) {
        shouldRefreshProducts = true;
      }
    }
    if (shouldRefreshProducts) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    }

    // Ensure policies do not contain demonstration names
    const storedPolicies = localStorage.getItem(STORAGE_KEYS.POLICIES);
    if (!storedPolicies) {
      localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(SEED_POLICIES));
    } else {
      try {
        const parsed = JSON.parse(storedPolicies);
        if (
          Array.isArray(parsed) &&
          parsed.some((p: any) => p.productName?.toLowerCase().includes('demonstration'))
        ) {
          localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(SEED_POLICIES));
        }
      } catch (e) {
        localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(SEED_POLICIES));
      }
    }

    // Ensure applications do not contain demonstration names
    const storedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!storedApps) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_APPLICATIONS));
    } else {
      try {
        const parsed = JSON.parse(storedApps);
        if (
          Array.isArray(parsed) &&
          parsed.some((a: any) => a.productName?.toLowerCase().includes('demonstration'))
        ) {
          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_APPLICATIONS));
        }
      } catch (e) {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_APPLICATIONS));
      }
    }

    // Initialize official admin documents
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_DOCUMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_DOCUMENTS, JSON.stringify(SEED_ADMIN_DOCUMENTS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.BRANCHES)) {
      localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(SEED_BRANCHES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(SEED_CUSTOMERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.OPERATORS)) {
      localStorage.setItem(STORAGE_KEYS.OPERATORS, JSON.stringify(SEED_OPERATORS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STAFF)) {
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(SEED_STAFF));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRAINING_COURSES)) {
      localStorage.setItem(STORAGE_KEYS.TRAINING_COURSES, JSON.stringify(SEED_TRAINING_COURSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMAIL_TEMPLATES)) {
      localStorage.setItem(STORAGE_KEYS.EMAIL_TEMPLATES, JSON.stringify(SEED_EMAIL_TEMPLATES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(SEED_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([
        {
          paymentAttemptId: 'PAY-001',
          customerId: 'CUST-001',
          applicationId: 'APP-2026-001',
          quotationId: 'QUO-2026-001',
          provider: 'chapa_v2',
          merchantReference: 'AIC-CHAPA-2026-99182',
          providerReference: 'CHAPA-TX-991823',
          amountETB: 85275,
          currency: 'ETB',
          paymentStatus: 'successful',
          idempotencyKey: 'IDEMP-991823-AUTH',
          verificationStatus: 'verified_server',
          verifiedAt: '2026-02-01T15:15:00Z',
          createdAt: '2026-02-01T15:10:00Z',
          updatedAt: '2026-02-01T15:15:00Z'
        }
      ]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMAIL_JOBS)) {
      localStorage.setItem(STORAGE_KEYS.EMAIL_JOBS, JSON.stringify([
        {
          emailJobId: 'EML-JOB-001',
          eventId: 'EVT-POL-ISSUE-001',
          recipient: 'abebe.tadesse@example.et',
          recipientName: 'Abebe Tadesse Kebede',
          templateId: 'TPL-EML-POLICY-ISSUED',
          category: 'transactional',
          subject: 'Your Official AIC Insurance Policy Has Been Issued: AIC/MTR/2026/004812',
          scheduledAt: '2026-02-01T15:21:00Z',
          status: 'delivered',
          attemptCount: 1,
          deliveredAt: '2026-02-01T15:21:04Z',
          providerMessageId: 'resend_msg_89210293',
          createdAt: '2026-02-01T15:20:00Z'
        }
      ]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to administrator account for instant developer inspection
      this.setCurrentUser({
        uid: 'usr-admin-01',
        accountType: 'admin',
        firstName: 'Eleni',
        lastName: 'Hailu',
        email: 'eleni.admin@africainsurance.et',
        emailVerified: true,
        phone: '+251 91 100 0001',
        phoneVerified: true,
        branchId: 'BR-ADDIS-HQ',
        accountStatus: 'active',
        registrationChannel: 'branch_walkin',
        createdAt: '2025-10-01T08:00:00Z',
        updatedAt: '2026-01-01T08:00:00Z'
      });
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // --- CURRENT USER & AUTH ---
  public getCurrentUser(): UserAccount | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  }

  public setCurrentUser(user: UserAccount | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notify();
  }

  public switchRole(role: UserRole) {
    let mockUser: UserAccount;
    if (role === 'admin') {
      mockUser = {
        uid: 'usr-admin-01',
        accountType: 'admin',
        firstName: 'Eleni',
        lastName: 'Hailu',
        email: 'eleni.admin@africainsurance.et',
        emailVerified: true,
        phone: '+251 91 100 0001',
        phoneVerified: true,
        branchId: 'BR-ADDIS-HQ',
        accountStatus: 'active',
        registrationChannel: 'branch_walkin',
        createdAt: '2025-10-01T08:00:00Z',
        updatedAt: '2026-01-01T08:00:00Z'
      };
    } else if (role === 'underwriter') {
      mockUser = {
        uid: 'usr-staff-uw',
        accountType: 'underwriter',
        firstName: 'Kassahun',
        lastName: 'Worku',
        email: 'kassahun.underwriting@africainsurance.et',
        emailVerified: true,
        phone: '+251 91 100 0002',
        phoneVerified: true,
        branchId: 'BR-ADDIS-HQ',
        accountStatus: 'active',
        registrationChannel: 'branch_walkin',
        createdAt: '2025-11-01T08:00:00Z',
        updatedAt: '2026-01-01T08:00:00Z'
      };
    } else if (role === 'operator') {
      mockUser = {
        uid: 'usr-op-001',
        accountType: 'operator',
        firstName: 'Yonas',
        lastName: 'Berhanu',
        email: 'yonas.operator@africainsurance.et',
        emailVerified: true,
        phone: '+251 91 188 9900',
        phoneVerified: true,
        branchId: 'BR-ADDIS-HQ',
        operatorId: 'OP-001',
        accountStatus: 'active',
        registrationChannel: 'branch_walkin',
        createdAt: '2026-01-05T08:00:00Z',
        updatedAt: '2026-02-15T10:00:00Z'
      };
    } else {
      mockUser = {
        uid: 'usr-cust-001',
        accountType: 'customer',
        firstName: 'Abebe',
        lastName: 'Tadesse',
        email: 'abebe.tadesse@example.et',
        emailVerified: true,
        phone: '+251 91 123 4567',
        phoneVerified: true,
        branchId: 'BR-BOLE',
        accountStatus: 'active',
        registrationChannel: 'self_service',
        createdAt: '2026-01-22T09:30:00Z',
        updatedAt: '2026-02-10T14:15:00Z'
      };
    }
    this.setCurrentUser(mockUser);
    this.logAudit({
      actorUid: mockUser.uid,
      actorName: `${mockUser.firstName} ${mockUser.lastName}`,
      actorRole: mockUser.accountType,
      action: 'USER_ROLE_SWITCH',
      resourceType: 'user',
      resourceId: mockUser.uid,
      reason: `Switched active preview role to ${role}`,
      correlationId: `AUTH-${Date.now()}`
    });
  }

  // --- PRODUCTS ---
  public getProducts(): InsuranceProduct[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  }

  public getPublishedProducts(): InsuranceProduct[] {
    return this.getProducts().filter((p) => p.publicStatus === 'published');
  }

  public getProductBySlug(slug: string): InsuranceProduct | undefined {
    return this.getProducts().find((p) => p.slug === slug);
  }

  public getProductById(id: string): InsuranceProduct | undefined {
    return this.getProducts().find((p) => p.productId === id);
  }

  public saveProduct(product: InsuranceProduct): void {
    const products = this.getProducts();
    const idx = products.findIndex((p) => p.productId === product.productId);
    const updated = { ...product, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      products[idx] = updated;
    } else {
      products.push(updated);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.logAudit({
      actorUid: this.getCurrentUser()?.uid || 'SYSTEM',
      actorName: this.getCurrentUser()?.firstName || 'System',
      actorRole: this.getCurrentUser()?.accountType || 'admin',
      action: idx >= 0 ? 'PRODUCT_UPDATED' : 'PRODUCT_CREATED',
      resourceType: 'product',
      resourceId: product.productId,
      reason: `Saved product "${product.productName}" (Status: ${product.publicStatus})`,
      correlationId: `PRD-${Date.now()}`
    });
    this.notify();
  }

  public archiveProduct(productId: string): void {
    const products = this.getProducts();
    const p = products.find((item) => item.productId === productId);
    if (p) {
      p.publicStatus = 'archived';
      p.archivedAt = new Date().toISOString();
      p.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.logAudit({
        actorUid: this.getCurrentUser()?.uid || 'SYSTEM',
        actorName: this.getCurrentUser()?.firstName || 'System',
        actorRole: this.getCurrentUser()?.accountType || 'admin',
        action: 'PRODUCT_ARCHIVED',
        resourceType: 'product',
        resourceId: productId,
        reason: 'Product archived. Historical references preserved.',
        correlationId: `PRD-ARCH-${Date.now()}`
      });
      this.notify();
    }
  }

  // --- ADMIN UPLOADED POLICY DOCUMENTS ---
  public getAdminDocuments(): AdminUploadedDocument[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_DOCUMENTS);
    return raw ? JSON.parse(raw) : [];
  }

  public getDocumentsForProduct(productId: string): AdminUploadedDocument[] {
    const all = this.getAdminDocuments();
    return all.filter((d) => d.productId === productId || d.productId === 'all');
  }

  public saveAdminDocument(doc: AdminUploadedDocument): void {
    const docs = this.getAdminDocuments();
    const idx = docs.findIndex((d) => d.id === doc.id);
    if (idx >= 0) {
      docs[idx] = doc;
    } else {
      docs.unshift(doc);
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_DOCUMENTS, JSON.stringify(docs));
    this.logAudit({
      actorUid: this.getCurrentUser()?.uid || 'SYSTEM',
      actorName: this.getCurrentUser()?.firstName || 'System',
      actorRole: this.getCurrentUser()?.accountType || 'admin',
      action: idx >= 0 ? 'DOCUMENT_UPDATED' : 'DOCUMENT_UPLOADED',
      resourceType: 'document',
      resourceId: doc.id,
      reason: `Uploaded / saved official document "${doc.title}" (Category: ${doc.category})`,
      correlationId: `DOC-${Date.now()}`
    });
    this.notify();
  }

  public deleteAdminDocument(docId: string): void {
    const docs = this.getAdminDocuments();
    const filtered = docs.filter((d) => d.id !== docId);
    localStorage.setItem(STORAGE_KEYS.ADMIN_DOCUMENTS, JSON.stringify(filtered));
    this.logAudit({
      actorUid: this.getCurrentUser()?.uid || 'SYSTEM',
      actorName: this.getCurrentUser()?.firstName || 'System',
      actorRole: this.getCurrentUser()?.accountType || 'admin',
      action: 'DOCUMENT_DELETED',
      resourceType: 'document',
      resourceId: docId,
      reason: `Deleted official document reference ${docId}`,
      correlationId: `DOC-DEL-${Date.now()}`
    });
    this.notify();
  }

  // --- CUSTOMERS ---
  public getCustomers(): CustomerProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return raw ? JSON.parse(raw) : [];
  }

  public getCustomerById(id: string): CustomerProfile | undefined {
    return this.getCustomers().find((c) => c.customerId === id || c.authUid === id);
  }

  public saveCustomer(customer: CustomerProfile): void {
    const list = this.getCustomers();
    const idx = list.findIndex((c) => c.customerId === customer.customerId);
    const updated = { ...customer, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(list));
    this.notify();
  }

  // --- OPERATORS ---
  public getOperators(): OperatorProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.OPERATORS);
    return raw ? JSON.parse(raw) : [];
  }

  public saveOperator(op: OperatorProfile): void {
    const list = this.getOperators();
    const idx = list.findIndex((item) => item.operatorId === op.operatorId);
    if (idx >= 0) {
      list[idx] = { ...op, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...op, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.OPERATORS, JSON.stringify(list));
    this.notify();
  }

  public toggleOperatorStatus(operatorId: string, status: 'active' | 'suspended'): void {
    const list = this.getOperators();
    const op = list.find((item) => item.operatorId === operatorId);
    if (op) {
      op.accountStatus = status;
      op.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.OPERATORS, JSON.stringify(list));
      this.logAudit({
        actorUid: this.getCurrentUser()?.uid || 'SYSTEM',
        actorName: this.getCurrentUser()?.firstName || 'Admin',
        actorRole: this.getCurrentUser()?.accountType || 'admin',
        action: status === 'suspended' ? 'OPERATOR_SUSPENDED' : 'OPERATOR_ACTIVATED',
        resourceType: 'user',
        resourceId: operatorId,
        reason: `Operator access status set to ${status}. Historical attributions intact.`,
        correlationId: `OP-STATUS-${Date.now()}`
      });
      this.notify();
    }
  }

  // --- APPLICATIONS ---
  public getApplications(): InsuranceApplication[] {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return raw ? JSON.parse(raw) : [];
  }

  public getApplicationById(id: string): InsuranceApplication | undefined {
    return this.getApplications().find((a) => a.applicationId === id);
  }

  public saveApplication(app: InsuranceApplication): void {
    const list = this.getApplications();
    const idx = list.findIndex((a) => a.applicationId === app.applicationId);
    const updated = { ...app, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(list));
    this.notify();
  }

  // --- POLICIES ---
  public getPolicies(): InsurancePolicy[] {
    const raw = localStorage.getItem(STORAGE_KEYS.POLICIES);
    return raw ? JSON.parse(raw) : [];
  }

  public getPolicyById(id: string): InsurancePolicy | undefined {
    return this.getPolicies().find((p) => p.policyId === id);
  }

  public getPolicyByVerificationCode(code: string): InsurancePolicy | undefined {
    const cleanCode = code.trim().toUpperCase();
    return this.getPolicies().find((p) => p.verificationCode.toUpperCase() === cleanCode);
  }

  public issuePolicy(policy: InsurancePolicy): void {
    const policies = this.getPolicies();
    policies.unshift(policy);
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(policies));

    // Update application status to approved
    const apps = this.getApplications();
    const app = apps.find((a) => a.applicationId === policy.applicationId);
    if (app) {
      app.applicationStatus = 'approved';
      app.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    }

    // Schedule email confirmation
    this.enqueueEmailJob({
      emailJobId: `EML-JOB-${Date.now()}`,
      eventId: `EVT-POLICY-${policy.policyId}`,
      recipient: policy.customerPhone || 'customer@example.et',
      recipientName: policy.customerName,
      templateId: 'TPL-EML-POLICY-ISSUED',
      category: 'transactional',
      subject: `Your Official AIC Insurance Policy Has Been Issued: ${policy.policyNumber}`,
      scheduledAt: new Date().toISOString(),
      status: 'delivered',
      attemptCount: 1,
      deliveredAt: new Date().toISOString(),
      providerMessageId: `chapa_verify_${policy.verificationCode}`,
      createdAt: new Date().toISOString()
    });

    this.logAudit({
      actorUid: this.getCurrentUser()?.uid || 'SYSTEM',
      actorName: this.getCurrentUser()?.firstName || 'Underwriter',
      actorRole: this.getCurrentUser()?.accountType || 'underwriter',
      action: 'POLICY_ISSUED',
      resourceType: 'policy',
      resourceId: policy.policyId,
      reason: `Policy ${policy.policyNumber} issued with unique verification code ${policy.verificationCode}`,
      correlationId: `POL-ISSUE-${Date.now()}`
    });

    this.notify();
  }

  // --- PUBLIC VERIFICATION ---
  public verifyPolicyCode(code: string, channel: 'public_portal' | 'institutional_api' | 'qr_scanner' = 'public_portal'): {
    outcome: PolicyVerificationLog['verificationOutcome'];
    policy?: InsurancePolicy;
    timestamp: string;
  } {
    const timestamp = new Date().toISOString();
    const clean = code.trim().toUpperCase();
    let outcome: PolicyVerificationLog['verificationOutcome'];
    const matched = this.getPolicyByVerificationCode(clean);

    if (!clean || clean.length < 5) {
      outcome = 'invalid_format';
    } else if (!matched) {
      outcome = 'not_found';
    } else if (matched.policyStatus === 'active') {
      // Check if dates expired
      const today = new Date().toISOString().split('T')[0];
      if (matched.expiryDate < today) {
        outcome = 'verified_expired';
      } else {
        outcome = 'verified_active';
      }
    } else if (matched.policyStatus === 'expired') {
      outcome = 'verified_expired';
    } else if (matched.policyStatus === 'cancelled') {
      outcome = 'verified_cancelled';
    } else {
      outcome = 'verified_suspended';
    }

    // Record verification event
    this.logVerification({
      verificationId: `VRF-${Date.now()}`,
      queryCode: clean,
      matchedPolicyId: matched?.policyId,
      verificationOutcome: outcome,
      verificationTimestamp: timestamp,
      channel,
      ipMasked: '197.156.***.***',
      userAgentSnippet: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 50) : 'Browser'
    });

    return {
      outcome,
      policy: outcome.startsWith('verified_') ? matched : undefined,
      timestamp
    };
  }

  private logVerification(log: PolicyVerificationLog): void {
    const raw = localStorage.getItem(STORAGE_KEYS.VERIFICATION_LOGS);
    const list: PolicyVerificationLog[] = raw ? JSON.parse(raw) : [];
    list.unshift(log);
    localStorage.setItem(STORAGE_KEYS.VERIFICATION_LOGS, JSON.stringify(list.slice(0, 500)));
  }

  public getVerificationLogs(): PolicyVerificationLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.VERIFICATION_LOGS);
    return raw ? JSON.parse(raw) : [];
  }

  // --- BRANCHES ---
  public getBranches(): Branch[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BRANCHES);
    return raw ? JSON.parse(raw) : [];
  }

  // --- TRAINING COURSES & PROGRESS ---
  public getTrainingCourses(): TrainingCourse[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRAINING_COURSES);
    return raw ? JSON.parse(raw) : [];
  }

  public getTrainingProgress(userId: string): TrainingProgress[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRAINING_PROGRESS);
    const list: TrainingProgress[] = raw ? JSON.parse(raw) : [];
    return list.filter((p) => p.userId === userId);
  }

  public saveTrainingProgress(progress: TrainingProgress): void {
    const raw = localStorage.getItem(STORAGE_KEYS.TRAINING_PROGRESS);
    const list: TrainingProgress[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex((p) => p.userId === progress.userId && p.courseId === progress.courseId);
    if (idx >= 0) {
      list[idx] = progress;
    } else {
      list.push(progress);
    }
    localStorage.setItem(STORAGE_KEYS.TRAINING_PROGRESS, JSON.stringify(list));
    this.notify();
  }

  // --- EMAIL AUTOMATION & JOBS ---
  public getEmailTemplates(): EmailTemplate[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EMAIL_TEMPLATES);
    return raw ? JSON.parse(raw) : [];
  }

  public getEmailJobs(): EmailJob[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EMAIL_JOBS);
    return raw ? JSON.parse(raw) : [];
  }

  public enqueueEmailJob(job: EmailJob): void {
    const jobs = this.getEmailJobs();
    jobs.unshift(job);
    localStorage.setItem(STORAGE_KEYS.EMAIL_JOBS, JSON.stringify(jobs.slice(0, 300)));
    this.notify();
  }

  public retryEmailJob(emailJobId: string): void {
    const jobs = this.getEmailJobs();
    const job = jobs.find((j) => j.emailJobId === emailJobId);
    if (job) {
      job.attemptCount += 1;
      job.status = 'delivered';
      job.deliveredAt = new Date().toISOString();
      job.failureReason = undefined;
      localStorage.setItem(STORAGE_KEYS.EMAIL_JOBS, JSON.stringify(jobs));
      this.notify();
    }
  }

  // --- PAYMENTS & CHAPA ---
  public getPaymentAttempts(): PaymentAttempt[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return raw ? JSON.parse(raw) : [];
  }

  public createPaymentAttempt(attempt: PaymentAttempt): void {
    const list = this.getPaymentAttempts();
    list.unshift(attempt);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));
    this.notify();
  }

  public verifyPaymentAttempt(attemptId: string, success: boolean): void {
    const list = this.getPaymentAttempts();
    const item = list.find((p) => p.paymentAttemptId === attemptId);
    if (item) {
      item.paymentStatus = success ? 'successful' : 'failed';
      item.verificationStatus = success ? 'verified_server' : 'failed_verification';
      item.verifiedAt = new Date().toISOString();
      item.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(list));

      // Also update linked application status if successful
      if (success) {
        const apps = this.getApplications();
        const app = apps.find((a) => a.applicationId === item.applicationId);
        if (app) {
          app.applicationStatus = 'payment_verified';
          app.updatedAt = new Date().toISOString();
          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
        }
      }

      this.logAudit({
        actorUid: this.getCurrentUser()?.uid || 'CHAPA-GATEWAY',
        actorName: 'Chapa V2 Integration',
        actorRole: 'finance',
        action: success ? 'PAYMENT_VERIFIED_SUCCESS' : 'PAYMENT_VERIFIED_FAILED',
        resourceType: 'payment',
        resourceId: attemptId,
        reason: `Server-to-server verification completed. Status: ${item.paymentStatus} (${item.amountETB} ETB)`,
        correlationId: `PAY-${attemptId}`
      });

      this.notify();
    }
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : [];
  }

  public logAudit(entry: Omit<AuditLogEntry, 'auditId' | 'timestamp'> & { auditId?: string; timestamp?: string }): void {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    const list: AuditLogEntry[] = raw ? JSON.parse(raw) : [];
    const fullEntry: AuditLogEntry = {
      auditId: entry.auditId || `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      ...entry
    };
    list.unshift(fullEntry);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(list.slice(0, 1000)));
    this.notify();
  }

  // --- NEWSLETTER SUBSCRIBERS ---
  public getSubscribers(): NewsletterSubscriber[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
    if (!raw) {
      const initial: NewsletterSubscriber[] = [
        {
          subscriberId: 'SUB-001',
          email: 'corporate.desk@midroc-corp.et',
          fullName: 'Dawit Mengistu',
          frequency: 'weekly',
          status: 'active',
          subscribedAt: '2026-01-15T10:30:00Z',
          source: 'footer_signup'
        },
        {
          subscriberId: 'SUB-002',
          email: 'logistics.manager@trans-ethiopia.et',
          fullName: 'Sara Alemayehu',
          frequency: 'breaking_announcements',
          status: 'active',
          subscribedAt: '2026-02-01T14:15:00Z',
          source: 'customer_portal'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  }

  public addSubscriber(email: string, fullName?: string, frequency: 'weekly' | 'monthly' | 'breaking_announcements' = 'weekly', source: 'footer_signup' | 'admin_manual' | 'customer_portal' = 'footer_signup'): { success: boolean; message: string; subscriber?: NewsletterSubscriber } {
    const cleanEmail = email.trim().toLowerCase();
    const subscribers = this.getSubscribers();
    const existing = subscribers.find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        existing.subscribedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
        this.notify();
        return { success: true, message: 'Welcome back! Your subscription has been reactivated.', subscriber: existing };
      }
      return { success: false, message: 'This email is already subscribed to AIC company updates.' };
    }

    const newSub: NewsletterSubscriber = {
      subscriberId: `SUB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: cleanEmail,
      fullName: fullName?.trim() || undefined,
      frequency,
      status: 'active',
      subscribedAt: new Date().toISOString(),
      source
    };

    subscribers.unshift(newSub);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
    this.logAudit({
      actorUid: this.getCurrentUser()?.uid || 'PUBLIC-VISITOR',
      actorName: fullName || cleanEmail,
      actorRole: 'customer',
      action: 'NEWSLETTER_SUBSCRIBED',
      resourceType: 'user',
      resourceId: newSub.subscriberId,
      reason: `Subscribed to AIC newsletter (${frequency})`,
      correlationId: `SUB-${newSub.subscriberId}`
    });

    this.notify();
    return { success: true, message: 'Thank you for subscribing to Africa Insurance Company updates.', subscriber: newSub };
  }

  public updateSubscriberStatus(subscriberId: string, status: 'active' | 'unsubscribed'): void {
    const subscribers = this.getSubscribers();
    const item = subscribers.find(s => s.subscriberId === subscriberId);
    if (item) {
      item.status = status;
      localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
      this.notify();
    }
  }

  public deleteSubscriber(subscriberId: string): void {
    const subscribers = this.getSubscribers().filter(s => s.subscriberId !== subscriberId);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
    this.notify();
  }
}

export const store = new AICStore();
