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
  AdminUploadedDocument,
  InsuranceClaim
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
  SUBSCRIBERS: 'aic_subscribers',
  CLAIMS: 'aic_claims'
};

const memoryFallback = new Map<string, string>();
const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Fallback for private browsing / embedded webviews
    }
    return memoryFallback.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    memoryFallback.set(key, value);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Ignore quota / security errors in restricted browsers
    }
  },
  removeItem(key: string): void {
    memoryFallback.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore security errors in restricted browsers
    }
  }
};

class AICStore {
  private listeners: Set<() => void> = new Set();
  private cache: Map<string, unknown> = new Map();

  constructor() {
    this.initializeIfEmpty();
  }

  private readCached<T>(key: string, fallback: T): T {
    if (this.cache.has(key)) {
      return this.cache.get(key) as T;
    }
    const raw = safeStorage.getItem(key);
    if (!raw) {
      this.cache.set(key, fallback);
      return fallback;
    }
    try {
      const parsed = JSON.parse(raw) as T;
      this.cache.set(key, parsed);
      return parsed;
    } catch {
      this.cache.set(key, fallback);
      return fallback;
    }
  }

  private writeCached<T>(key: string, value: T): void {
    this.cache.set(key, value);
    safeStorage.setItem(key, JSON.stringify(value));
  }

  private initializeIfEmpty() {
    // Ensure products exist and are migrated from legacy demonstration data
    const storedProducts = safeStorage.getItem(STORAGE_KEYS.PRODUCTS);
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
      safeStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    }

    // Ensure policies do not contain demonstration names
    const storedPolicies = safeStorage.getItem(STORAGE_KEYS.POLICIES);
    if (!storedPolicies) {
      safeStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(SEED_POLICIES));
    } else {
      try {
        const parsed = JSON.parse(storedPolicies);
        if (
          Array.isArray(parsed) &&
          parsed.some((p: any) => p.productName?.toLowerCase().includes('demonstration'))
        ) {
          safeStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(SEED_POLICIES));
        }
      } catch (e) {
        safeStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(SEED_POLICIES));
      }
    }

    // Ensure applications do not contain demonstration names
    const storedApps = safeStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!storedApps) {
      safeStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_APPLICATIONS));
    } else {
      try {
        const parsed = JSON.parse(storedApps);
        if (
          Array.isArray(parsed) &&
          parsed.some((a: any) => a.productName?.toLowerCase().includes('demonstration'))
        ) {
          safeStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_APPLICATIONS));
        }
      } catch (e) {
        safeStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(SEED_APPLICATIONS));
      }
    }

    // Initialize official admin documents
    if (!safeStorage.getItem(STORAGE_KEYS.ADMIN_DOCUMENTS)) {
      safeStorage.setItem(STORAGE_KEYS.ADMIN_DOCUMENTS, JSON.stringify(SEED_ADMIN_DOCUMENTS));
    }

    if (!safeStorage.getItem(STORAGE_KEYS.BRANCHES)) {
      safeStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(SEED_BRANCHES));
    }
    if (!safeStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      safeStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(SEED_CUSTOMERS));
    }
    if (!safeStorage.getItem(STORAGE_KEYS.OPERATORS)) {
      safeStorage.setItem(STORAGE_KEYS.OPERATORS, JSON.stringify(SEED_OPERATORS));
    }
    if (!safeStorage.getItem(STORAGE_KEYS.STAFF)) {
      safeStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(SEED_STAFF));
    }
    if (!safeStorage.getItem(STORAGE_KEYS.TRAINING_COURSES)) {
      safeStorage.setItem(STORAGE_KEYS.TRAINING_COURSES, JSON.stringify(SEED_TRAINING_COURSES));
    }
    if (!safeStorage.getItem(STORAGE_KEYS.EMAIL_TEMPLATES)) {
      safeStorage.setItem(STORAGE_KEYS.EMAIL_TEMPLATES, JSON.stringify(SEED_EMAIL_TEMPLATES));
    }
    if (!safeStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      safeStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(SEED_AUDIT_LOGS));
    }
    const seedPayments: PaymentAttempt[] = [
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
      },
      {
        paymentAttemptId: 'PAY-002',
        customerId: 'CUST-002',
        applicationId: 'APP-2026-002',
        quotationId: 'QUO-2026-002',
        provider: 'chapa_v2',
        merchantReference: 'AIC-CHAPA-2026-99241',
        providerReference: 'CHAPA-TX-992410',
        amountETB: 2580,
        currency: 'ETB',
        paymentStatus: 'successful',
        idempotencyKey: 'IDEMP-992410-AUTH',
        verificationStatus: 'verified_server',
        verifiedAt: '2026-02-05T10:12:00Z',
        createdAt: '2026-02-05T10:10:00Z',
        updatedAt: '2026-02-05T10:12:00Z'
      },
      {
        paymentAttemptId: 'PAY-003',
        customerId: 'CUST-001',
        applicationId: 'APP-2025-001',
        quotationId: 'QUO-2025-001',
        provider: 'chapa_v2',
        merchantReference: 'AIC-CHAPA-2025-88123',
        providerReference: 'CHAPA-TX-881230',
        amountETB: 42000,
        currency: 'ETB',
        paymentStatus: 'successful',
        idempotencyKey: 'IDEMP-881230-AUTH',
        verificationStatus: 'verified_server',
        verifiedAt: '2025-01-10T08:55:00Z',
        createdAt: '2025-01-10T08:50:00Z',
        updatedAt: '2025-01-10T08:55:00Z'
      },
      {
        paymentAttemptId: 'PAY-004',
        customerId: 'CUST-002',
        applicationId: 'APP-2026-003',
        quotationId: 'QUO-2026-003',
        provider: 'chapa_v2',
        merchantReference: 'AIC-CHAPA-2026-99518',
        providerReference: 'CHAPA-TX-995180',
        amountETB: 15575,
        currency: 'ETB',
        paymentStatus: 'pending',
        idempotencyKey: 'IDEMP-995180-PEND',
        verificationStatus: 'unverified',
        createdAt: '2026-02-19T09:15:00Z',
        updatedAt: '2026-02-19T09:15:00Z'
      }
    ];
    const storedPayments = safeStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!storedPayments) {
      safeStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(seedPayments));
    } else {
      try {
        const parsed = JSON.parse(storedPayments) as PaymentAttempt[];
        if (Array.isArray(parsed)) {
          const existingIds = new Set(parsed.map((p) => p.paymentAttemptId));
          const missing = seedPayments.filter((s) => !existingIds.has(s.paymentAttemptId));
          if (missing.length > 0) {
            safeStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([...parsed, ...missing]));
          }
        }
      } catch {
        safeStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(seedPayments));
      }
    }
    if (!safeStorage.getItem(STORAGE_KEYS.EMAIL_JOBS)) {
      safeStorage.setItem(STORAGE_KEYS.EMAIL_JOBS, JSON.stringify([
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
    if (this.cache.has(STORAGE_KEYS.CURRENT_USER)) {
      return (this.cache.get(STORAGE_KEYS.CURRENT_USER) as UserAccount | null) ?? null;
    }
    const raw = safeStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      this.cache.set(STORAGE_KEYS.CURRENT_USER, null);
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as UserAccount;
      this.cache.set(STORAGE_KEYS.CURRENT_USER, parsed);
      return parsed;
    } catch {
      safeStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      this.cache.set(STORAGE_KEYS.CURRENT_USER, null);
      return null;
    }
  }

  public setCurrentUser(user: UserAccount | null) {
    if (user) {
      this.writeCached(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      this.cache.set(STORAGE_KEYS.CURRENT_USER, null);
      safeStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
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
    } else if (role === 'finance') {
      mockUser = {
        uid: 'usr-fin-01',
        accountType: 'finance',
        firstName: 'Selamawit',
        lastName: 'Bekele',
        email: 'selamawit.finance@africainsurance.et',
        emailVerified: true,
        phone: '+251 91 100 0044',
        phoneVerified: true,
        branchId: 'BR-ADDIS-HQ',
        accountStatus: 'active',
        registrationChannel: 'branch_walkin',
        createdAt: '2025-11-15T08:00:00Z',
        updatedAt: '2026-01-01T08:00:00Z'
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
    return this.readCached<InsuranceProduct[]>(STORAGE_KEYS.PRODUCTS, []);
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
    const products = [...this.getProducts()];
    const idx = products.findIndex((p) => p.productId === product.productId);
    const updated = { ...product, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      products[idx] = updated;
    } else {
      products.push(updated);
    }
    this.writeCached(STORAGE_KEYS.PRODUCTS, products);
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
    const products = this.getProducts().map((item) =>
      item.productId === productId
        ? {
            ...item,
            publicStatus: 'archived' as const,
            archivedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : item
    );
    if (products.some((item) => item.productId === productId)) {
      this.writeCached(STORAGE_KEYS.PRODUCTS, products);
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
    return this.readCached<AdminUploadedDocument[]>(STORAGE_KEYS.ADMIN_DOCUMENTS, []);
  }

  public getDocumentsForProduct(productId: string): AdminUploadedDocument[] {
    const all = this.getAdminDocuments();
    return all.filter((d) => d.productId === productId || d.productId === 'all');
  }

  public saveAdminDocument(doc: AdminUploadedDocument): void {
    const docs = [...this.getAdminDocuments()];
    const idx = docs.findIndex((d) => d.id === doc.id);
    if (idx >= 0) {
      docs[idx] = doc;
    } else {
      docs.unshift(doc);
    }
    this.writeCached(STORAGE_KEYS.ADMIN_DOCUMENTS, docs);
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
    this.writeCached(STORAGE_KEYS.ADMIN_DOCUMENTS, filtered);
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
    return this.readCached<CustomerProfile[]>(STORAGE_KEYS.CUSTOMERS, []);
  }

  public getCustomerById(id: string): CustomerProfile | undefined {
    return this.getCustomers().find((c) => c.customerId === id || c.authUid === id);
  }

  public saveCustomer(customer: CustomerProfile): void {
    const list = [...this.getCustomers()];
    const idx = list.findIndex((c) => c.customerId === customer.customerId);
    const updated = { ...customer, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    this.writeCached(STORAGE_KEYS.CUSTOMERS, list);
    this.notify();
  }

  // --- OPERATORS & STAFF (ADMIN ONLY ONBOARDING) ---
  public getOperators(): OperatorProfile[] {
    return this.readCached<OperatorProfile[]>(STORAGE_KEYS.OPERATORS, []);
  }

  public getStaff(): StaffProfile[] {
    return this.readCached<StaffProfile[]>(STORAGE_KEYS.STAFF, []);
  }

  public saveOperator(op: OperatorProfile): void {
    const actor = this.getCurrentUser();
    if (actor && actor.accountType !== 'admin') return;
    const list = [...this.getOperators()];
    const idx = list.findIndex((item) => item.operatorId === op.operatorId);
    if (idx >= 0) {
      list[idx] = { ...op, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...op, updatedAt: new Date().toISOString() });
    }
    this.writeCached(STORAGE_KEYS.OPERATORS, list);
    this.notify();
  }

  public recordOperatorActivity(operatorId: string, metric: 'customer' | 'application' | 'certified'): void {
    const list = this.getOperators().map((item) => {
      if (item.operatorId !== operatorId) return item;
      const summary = { ...item.performanceSummary };
      if (metric === 'customer') {
        summary.totalAssistedOnboarded += 1;
      } else if (metric === 'application') {
        summary.totalApplicationsSubmitted += 1;
      }
      return {
        ...item,
        performanceSummary: summary,
        trainingStatus: metric === 'certified' ? ('certified' as const) : item.trainingStatus,
        updatedAt: new Date().toISOString()
      };
    });
    this.writeCached(STORAGE_KEYS.OPERATORS, list);
    this.notify();
  }

  public onboardEmployee(params: {
    name: string;
    email: string;
    phone: string;
    role: 'operator' | 'finance' | 'underwriter' | 'staff';
    branchId: string;
  }): { success: boolean; message: string } {
    const actor = this.getCurrentUser();
    if (!actor || actor.accountType !== 'admin') {
      return {
        success: false,
        message: 'Permission denied: Only Administrators can onboard employees.'
      };
    }

    const now = new Date().toISOString();
    const cleanName = params.name.trim();
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanPhone = params.phone.trim();

    if (!cleanName || !cleanEmail || !cleanPhone) {
      return { success: false, message: 'Name, email, and phone number are required.' };
    }

    if (params.role === 'operator') {
      const operators = [...this.getOperators()];
      if (operators.some((o) => o.email.toLowerCase() === cleanEmail)) {
        return { success: false, message: 'An operator with this email already exists.' };
      }
      const nextNum = operators.length + 1;
      const newOp: OperatorProfile = {
        operatorId: `OP-${String(nextNum).padStart(3, '0')}`,
        authUid: `usr-op-${Date.now().toString().slice(-4)}`,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        branchId: params.branchId || 'BR-ADDIS-HQ',
        supervisorId: actor.uid,
        assignedProducts: ['PRD-MTR-01', 'PRD-TPL-02', 'PRD-FIR-04'],
        accountStatus: 'active',
        trainingStatus: 'not_started',
        performanceSummary: {
          totalAssistedOnboarded: 0,
          totalApplicationsSubmitted: 0,
          totalPoliciesIssued: 0,
          complianceScorePct: 100
        },
        createdAt: now,
        updatedAt: now
      };
      operators.unshift(newOp);
      this.writeCached(STORAGE_KEYS.OPERATORS, operators);
      this.logAudit({
        actorUid: actor.uid,
        actorName: `${actor.firstName} ${actor.lastName}`,
        actorRole: actor.accountType,
        action: 'EMPLOYEE_ONBOARDED',
        resourceType: 'user',
        resourceId: newOp.operatorId,
        reason: `Onboarded new Direct-Sales Operator: ${newOp.name} (${newOp.branchId})`,
        correlationId: `EMP-OP-${Date.now()}`
      });
      this.notify();
      return { success: true, message: `Operator ${newOp.name} (${newOp.operatorId}) onboarded.` };
    }

    const staffList = [...this.getStaff()];
    if (staffList.some((s) => s.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'An employee with this email already exists.' };
    }
    const prefix = params.role === 'finance' ? 'FIN' : 'UW';
    const staffId = `STAFF-${prefix}-${String(staffList.length + 1).padStart(2, '0')}`;
    const newStaff: StaffProfile = {
      staffId,
      authUid: `usr-${prefix.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      name: cleanName,
      email: cleanEmail,
      role: params.role,
      department: params.role === 'finance' ? 'finance' : 'underwriting',
      branchId: params.branchId || 'BR-ADDIS-HQ',
      permissions:
        params.role === 'finance'
          ? ['view_payments', 'filter_transactions', 'export_financial_data', 'view_policies_readonly']
          : ['review_application', 'prepare_quotation', 'approve_underwriting', 'issue_policy'],
      accountStatus: 'active',
      supervisorId: actor.uid,
      createdAt: now,
      updatedAt: now
    };
    staffList.unshift(newStaff);
    this.writeCached(STORAGE_KEYS.STAFF, staffList);
    this.logAudit({
      actorUid: actor.uid,
      actorName: `${actor.firstName} ${actor.lastName}`,
      actorRole: actor.accountType,
      action: 'EMPLOYEE_ONBOARDED',
      resourceType: 'user',
      resourceId: staffId,
      reason: `Onboarded new ${params.role.toUpperCase()} employee: ${newStaff.name} (${newStaff.branchId})`,
      correlationId: `EMP-STF-${Date.now()}`
    });
    this.notify();
    return { success: true, message: `Employee ${newStaff.name} (${staffId}) onboarded.` };
  }

  public toggleOperatorStatus(operatorId: string, status: 'active' | 'suspended'): void {
    const actor = this.getCurrentUser();
    if (actor && actor.accountType !== 'admin') return;
    const list = this.getOperators().map((item) =>
      item.operatorId === operatorId
        ? { ...item, accountStatus: status, updatedAt: new Date().toISOString() }
        : item
    );
    if (list.some((item) => item.operatorId === operatorId)) {
      this.writeCached(STORAGE_KEYS.OPERATORS, list);
      this.logAudit({
        actorUid: actor?.uid || 'SYSTEM',
        actorName: actor?.firstName || 'Admin',
        actorRole: actor?.accountType || 'admin',
        action: status === 'suspended' ? 'OPERATOR_SUSPENDED' : 'OPERATOR_ACTIVATED',
        resourceType: 'user',
        resourceId: operatorId,
        reason: `Operator access status set to ${status}. Historical attributions intact.`,
        correlationId: `OP-STATUS-${Date.now()}`
      });
      this.notify();
    }
  }

  public toggleStaffStatus(staffId: string, status: 'active' | 'inactive'): void {
    const actor = this.getCurrentUser();
    if (!actor || actor.accountType !== 'admin') return;
    const list = this.getStaff().map((item) =>
      item.staffId === staffId
        ? { ...item, accountStatus: status, updatedAt: new Date().toISOString() }
        : item
    );
    if (list.some((item) => item.staffId === staffId)) {
      this.writeCached(STORAGE_KEYS.STAFF, list);
      this.logAudit({
        actorUid: actor.uid,
        actorName: `${actor.firstName} ${actor.lastName}`,
        actorRole: actor.accountType,
        action: status === 'inactive' ? 'STAFF_DEACTIVATED' : 'STAFF_ACTIVATED',
        resourceType: 'user',
        resourceId: staffId,
        reason: `Staff account status set to ${status}.`,
        correlationId: `STF-STATUS-${Date.now()}`
      });
      this.notify();
    }
  }

  // --- APPLICATIONS ---
  public getApplications(): InsuranceApplication[] {
    return this.readCached<InsuranceApplication[]>(STORAGE_KEYS.APPLICATIONS, []);
  }

  public getApplicationById(id: string): InsuranceApplication | undefined {
    return this.getApplications().find((a) => a.applicationId === id);
  }

  public saveApplication(app: InsuranceApplication): void {
    const list = [...this.getApplications()];
    const idx = list.findIndex((a) => a.applicationId === app.applicationId);
    const updated = { ...app, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    this.writeCached(STORAGE_KEYS.APPLICATIONS, list);
    this.notify();
  }

  // --- POLICIES ---
  public getPolicies(): InsurancePolicy[] {
    return this.readCached<InsurancePolicy[]>(STORAGE_KEYS.POLICIES, []);
  }

  public getPolicyById(id: string): InsurancePolicy | undefined {
    return this.getPolicies().find((p) => p.policyId === id);
  }

  public getPolicyByVerificationCode(code: string): InsurancePolicy | undefined {
    const cleanCode = code.trim().toUpperCase();
    return this.getPolicies().find((p) => p.verificationCode.toUpperCase() === cleanCode);
  }

  public savePolicy(policy: InsurancePolicy): { success: boolean; message: string } {
    const actor = this.getCurrentUser();
    if (actor && !['admin', 'operator', 'underwriter', 'staff'].includes(actor.accountType)) {
      return {
        success: false,
        message: 'Permission denied: Your role has read-only access to policies.'
      };
    }
    const list = [...this.getPolicies()];
    const idx = list.findIndex((p) => p.policyId === policy.policyId);
    const updated: InsurancePolicy = {
      ...policy,
      updatedAt: new Date().toISOString()
    };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    this.writeCached(STORAGE_KEYS.POLICIES, list);
    this.logAudit({
      actorUid: actor?.uid || 'SYSTEM',
      actorName: actor ? `${actor.firstName} ${actor.lastName}` : 'System',
      actorRole: actor?.accountType || 'admin',
      action: idx >= 0 ? 'POLICY_UPDATED' : 'POLICY_CREATED',
      resourceType: 'policy',
      resourceId: policy.policyId,
      reason: `Policy ${policy.policyNumber} updated (Status: ${policy.policyStatus})`,
      correlationId: `POL-EDIT-${Date.now()}`
    });
    this.notify();
    return { success: true, message: `Policy ${policy.policyNumber} saved successfully.` };
  }

  public issuePolicy(policy: InsurancePolicy): void {
    const policies = [...this.getPolicies()];
    if (!policies.some((p) => p.policyId === policy.policyId)) {
      policies.unshift(policy);
      this.writeCached(STORAGE_KEYS.POLICIES, policies);
    }

    // Update application status to approved
    const apps = this.getApplications().map((a) =>
      a.applicationId === policy.applicationId
        ? { ...a, applicationStatus: 'approved' as const, updatedAt: new Date().toISOString() }
        : a
    );
    if (apps.some((a) => a.applicationId === policy.applicationId)) {
      this.writeCached(STORAGE_KEYS.APPLICATIONS, apps);
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
    const list = [log, ...this.getVerificationLogs()].slice(0, 500);
    this.writeCached(STORAGE_KEYS.VERIFICATION_LOGS, list);
  }

  public getVerificationLogs(): PolicyVerificationLog[] {
    return this.readCached<PolicyVerificationLog[]>(STORAGE_KEYS.VERIFICATION_LOGS, []);
  }

  // --- BRANCHES ---
  public getBranches(): Branch[] {
    return this.readCached<Branch[]>(STORAGE_KEYS.BRANCHES, []);
  }

  // --- TRAINING COURSES & PROGRESS ---
  public getTrainingCourses(): TrainingCourse[] {
    return this.readCached<TrainingCourse[]>(STORAGE_KEYS.TRAINING_COURSES, []);
  }

  public getTrainingProgress(userId: string): TrainingProgress[] {
    const list = this.readCached<TrainingProgress[]>(STORAGE_KEYS.TRAINING_PROGRESS, []);
    return list.filter((p) => p.userId === userId);
  }

  public saveTrainingProgress(progress: TrainingProgress): void {
    const list = [...this.readCached<TrainingProgress[]>(STORAGE_KEYS.TRAINING_PROGRESS, [])];
    const idx = list.findIndex((p) => p.userId === progress.userId && p.courseId === progress.courseId);
    if (idx >= 0) {
      list[idx] = progress;
    } else {
      list.push(progress);
    }
    this.writeCached(STORAGE_KEYS.TRAINING_PROGRESS, list);
    this.notify();
  }

  // --- EMAIL AUTOMATION & JOBS ---
  public getEmailTemplates(): EmailTemplate[] {
    return this.readCached<EmailTemplate[]>(STORAGE_KEYS.EMAIL_TEMPLATES, []);
  }

  public getEmailJobs(): EmailJob[] {
    return this.readCached<EmailJob[]>(STORAGE_KEYS.EMAIL_JOBS, []);
  }

  public enqueueEmailJob(job: EmailJob): void {
    const jobs = [job, ...this.getEmailJobs()].slice(0, 300);
    this.writeCached(STORAGE_KEYS.EMAIL_JOBS, jobs);
    this.notify();
  }

  public retryEmailJob(emailJobId: string): void {
    const jobs = this.getEmailJobs().map((j) =>
      j.emailJobId === emailJobId
        ? {
            ...j,
            attemptCount: j.attemptCount + 1,
            status: 'delivered' as const,
            deliveredAt: new Date().toISOString(),
            failureReason: undefined
          }
        : j
    );
    if (jobs.some((j) => j.emailJobId === emailJobId)) {
      this.writeCached(STORAGE_KEYS.EMAIL_JOBS, jobs);
      this.notify();
    }
  }

  // --- PAYMENTS & CHAPA ---
  public getPaymentAttempts(): PaymentAttempt[] {
    return this.readCached<PaymentAttempt[]>(STORAGE_KEYS.PAYMENTS, []);
  }

  public createPaymentAttempt(attempt: PaymentAttempt): void {
    const list = [attempt, ...this.getPaymentAttempts()];
    this.writeCached(STORAGE_KEYS.PAYMENTS, list);
    this.notify();
  }

  public verifyPaymentAttempt(attemptId: string, success: boolean): void {
    const list = [...this.getPaymentAttempts()];
    const idx = list.findIndex((p) => p.paymentAttemptId === attemptId);
    if (idx >= 0) {
      const updated: PaymentAttempt = {
        ...list[idx],
        paymentStatus: success ? 'successful' : 'failed',
        verificationStatus: success ? 'verified_server' : 'failed_verification',
        verifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      list[idx] = updated;
      this.writeCached(STORAGE_KEYS.PAYMENTS, list);

      if (success) {
        const apps = this.getApplications().map((a) =>
          a.applicationId === updated.applicationId
            ? { ...a, applicationStatus: 'payment_verified' as const, updatedAt: new Date().toISOString() }
            : a
        );
        this.writeCached(STORAGE_KEYS.APPLICATIONS, apps);
      }

      this.logAudit({
        actorUid: this.getCurrentUser()?.uid || 'CHAPA-GATEWAY',
        actorName: 'Chapa V2 Integration',
        actorRole: 'finance',
        action: success ? 'PAYMENT_VERIFIED_SUCCESS' : 'PAYMENT_VERIFIED_FAILED',
        resourceType: 'payment',
        resourceId: attemptId,
        reason: `Server-to-server verification completed. Status: ${updated.paymentStatus} (${updated.amountETB} ETB)`,
        correlationId: `PAY-${attemptId}`
      });

      this.notify();
    }
  }

  // --- CLAIMS ---
  public getClaims(): InsuranceClaim[] {
    return this.readCached<InsuranceClaim[]>(STORAGE_KEYS.CLAIMS, []);
  }

  public saveClaim(claim: InsuranceClaim): void {
    const list = [...this.getClaims()];
    const idx = list.findIndex((c) => c.claimId === claim.claimId);
    const updated = { ...claim, updatedAt: new Date().toISOString() };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    this.writeCached(STORAGE_KEYS.CLAIMS, list);
    this.notify();
  }

  public mergeCustomerWorkspaceRecords(params: {
    applications?: InsuranceApplication[];
    policies?: InsurancePolicy[];
    payments?: PaymentAttempt[];
    claims?: InsuranceClaim[];
  }): void {
    let changed = false;

    if (params.applications?.length) {
      const existing = this.getApplications();
      const map = new Map(existing.map((a) => [a.applicationId, a]));
      for (const app of params.applications) {
        map.set(app.applicationId, app);
      }
      this.writeCached(
        STORAGE_KEYS.APPLICATIONS,
        Array.from(map.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      );
      changed = true;
    }

    if (params.policies?.length) {
      const existing = this.getPolicies();
      const map = new Map(existing.map((p) => [p.policyId, p]));
      for (const pol of params.policies) {
        map.set(pol.policyId, pol);
      }
      this.writeCached(
        STORAGE_KEYS.POLICIES,
        Array.from(map.values()).sort((a, b) => (b.issuedAt || '').localeCompare(a.issuedAt || ''))
      );
      changed = true;
    }

    if (params.payments?.length) {
      const existing = this.getPaymentAttempts();
      const map = new Map(existing.map((p) => [p.paymentAttemptId, p]));
      for (const pay of params.payments) {
        map.set(pay.paymentAttemptId, pay);
      }
      this.writeCached(
        STORAGE_KEYS.PAYMENTS,
        Array.from(map.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      );
      changed = true;
    }

    if (params.claims?.length) {
      const existing = this.getClaims();
      const map = new Map(existing.map((c) => [c.claimId, c]));
      for (const clm of params.claims) {
        map.set(clm.claimId, clm);
      }
      this.writeCached(
        STORAGE_KEYS.CLAIMS,
        Array.from(map.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      );
      changed = true;
    }

    if (changed) {
      this.notify();
    }
  }

  // --- AUDIT LOGS ---
  public getAuditLogs(): AuditLogEntry[] {
    return this.readCached<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  }

  public logAudit(entry: Omit<AuditLogEntry, 'auditId' | 'timestamp'> & { auditId?: string; timestamp?: string }): void {
    const fullEntry: AuditLogEntry = {
      auditId: entry.auditId || `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: entry.timestamp || new Date().toISOString(),
      ...entry
    };
    const list = [fullEntry, ...this.getAuditLogs()].slice(0, 1000);
    this.writeCached(STORAGE_KEYS.AUDIT_LOGS, list);
    this.notify();
  }

  // --- NEWSLETTER SUBSCRIBERS ---
  public getSubscribers(): NewsletterSubscriber[] {
    const raw = safeStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
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
      safeStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(initial));
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
        safeStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
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
    safeStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
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
      safeStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
      this.notify();
    }
  }

  public deleteSubscriber(subscriberId: string): void {
    const subscribers = this.getSubscribers().filter(s => s.subscriberId !== subscriberId);
    safeStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
    this.notify();
  }
}

export const store = new AICStore();
