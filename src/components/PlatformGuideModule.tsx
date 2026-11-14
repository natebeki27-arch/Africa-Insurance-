import React, { useMemo, useState } from 'react';
import {
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertCircle,
  Users,
  Layers,
  ArrowUpRight,
  Ban,
  Compass
} from 'lucide-react';

export interface PlatformGuideActionTarget {
  tab?: string;
  route?: string;
  label: string;
}

type GuideRole = 'customer' | 'operator' | 'staff' | 'finance' | 'admin';
type GuideWorkspace = 'admin' | 'operator' | 'staff' | 'customer';

interface PlatformGuideModuleProps {
  role: GuideRole;
  workspace?: GuideWorkspace;
  userId?: string;
  onQuickNavigate?: (target: { tab?: string; route?: string }) => void;
}

interface RolePermissionProfile {
  roleTitle: string;
  workspaceScope: string;
  summary: string;
  canDo: string[];
  cannotDo: string[];
  howToUse: string[];
}

const ROLE_PROFILES: Record<GuideRole, RolePermissionProfile> = {
  admin: {
    roleTitle: 'System Administrator',
    workspaceScope: 'Full Operations & Governance Console',
    summary:
      'You have complete authority to view and edit all platform operations, content, products, policies, and customer records—plus exclusive control over onboarding and managing employees.',
    canDo: [
      'Onboard new employees (Operators, Finance Officers, and Underwriters) and activate or suspend staff/operator access.',
      'View and edit Website Content, CMS banners, News Articles, Official Policy Documents, and Newsletter Subscribers.',
      'Create, edit, duplicate, and archive Insurance Products in the Product Catalogue.',
      'Search all customers, verify KYC identity status, and activate or suspend customer accounts.',
      'Edit E-Policies (status, expiry date, insured subject), review verification logs, and audit Chapa transactions with CSV/JSON export.',
      'Inspect automated email templates, test-dispatch emails, and view the immutable Security & Audit Trail.'
    ],
    cannotDo: [
      'Cannot delete issued policies or erase immutable audit logs (National Bank of Ethiopia compliance requires archiving/auditing only).',
      'Cannot alter historical server-verified payment gateway amounts directly.'
    ],
    howToUse: [
      'Use "Operators & Agents" to onboard new employees and manage staff/operator status.',
      'Use "Product Catalogue", "Website Content & CMS", and "Policy Documents" to publish live changes to the website.',
      'Use "E-Policies" and "Chapa V2 Gateway" to edit policies, filter payments, and export reports.'
    ]
  },
  operator: {
    roleTitle: 'Direct-Sales Operator',
    workspaceScope: 'Operations Console & Assisted Customer Sales',
    summary:
      'You share the same operational view and edit permissions as an Administrator across content, documents, products, customers, policies, and transactions—except you cannot onboard or alter employees.',
    canDo: [
      'View and edit Website Content & CMS, News Announcements, Policy Documents, and Newsletter Subscribers.',
      'Configure, edit, duplicate, and archive Insurance Products.',
      'View and manage Customer CRM records, verify customer KYC, and assist walk-in customers with onboarding and applications.',
      'Edit E-Policies (status, expiry date, insured subject) and inspect public verification logs.',
      'View all Chapa transactions, filter settlement records, export CSV/JSON data, and inspect Email & Audit Logs.'
    ],
    cannotDo: [
      'Cannot onboard new employees (Operators, Finance Officers, or Underwriters).',
      'Cannot suspend, activate, or alter any employee or operator account status.',
      'Cannot enter your own phone number or email in place of a customer during assisted registration.'
    ],
    howToUse: [
      'Use "Customer CRM", "Product Catalogue", "Website Content & CMS", and "Policy Documents" to manage daily operations and live updates.',
      'Use "E-Policies" to inspect policy schedules or update policy status, expiry date, or insured subject.',
      'Use "Chapa V2 Gateway" to filter payment settlements or export CSV/JSON transaction logs.'
    ]
  },
  finance: {
    roleTitle: 'Finance Officer',
    workspaceScope: 'Paid Transactions Ledger, Filtering & Data Export',
    summary:
      'Your workspace is dedicated to financial reconciliation. You can see every paid and pending transaction, filter data, and export CSV/JSON reports—while policies and employee onboarding stay locked.',
    canDo: [
      'View every paid, pending, and failed Chapa transaction with customer name, policy number, and product details.',
      'Filter transactions by search term, payment status (including Paid Only), server verification status, date range, and min/max ETB amount.',
      'Export filtered transaction ledgers to UTF-8 CSV or JSON, and export the E-Policy Register to CSV.',
      'View Real Database Metrics, the E-Policy Registry (read-only), Public Verification Logs, and Audit Logs.'
    ],
    cannotDo: [
      'Cannot edit, update, suspend, or modify any insurance policy record.',
      'Cannot onboard new employees or modify operator/staff access.',
      'Cannot edit Website Content/CMS, Policy Documents, Insurance Products, Customer KYC, or Email Campaigns.'
    ],
    howToUse: [
      'Open "Chapa V2 Gateway" (your default landing view) to review verified paid settlements and ETB totals.',
      'Combine "Paid Only", date range, or ETB min/max filters, then click "Export CSV" or "Export JSON" to download reports.',
      'Open "E-Policies" anytime to cross-check policy numbers and export the read-only policy register CSV.'
    ]
  },
  staff: {
    roleTitle: 'Underwriter / Staff',
    workspaceScope: 'Underwriting Adjudication & Policy Issuance',
    summary:
      'You review customer risk applications, validate KYC and asset documents, issue formal ETB quotations, and approve eligible policies into the registry.',
    canDo: [
      'Inspect pending applications in the Underwriting Review Queue along with risk inputs and uploaded documents.',
      'Request additional documents ("More Info Required") or reject ineligible submissions with a recorded reason.',
      'Set final underwriting premium terms and issue pay-ready formal quotations.',
      'Verify and activate policies in the Issued Policy Registry.'
    ],
    cannotDo: [
      'Cannot access the Admin Control Centre (Website CMS, Product Catalog configuration, Email Templates, or Financial Ledger Exports).',
      'Cannot onboard new employees or manage operator/staff accounts.'
    ],
    howToUse: [
      'Open "Underwriting Queue" to select a submitted or pending application.',
      'Verify supporting documents (National ID, Libre, Commercial License) and either request clarification or approve & issue a formal quote.',
      'Monitor active issued certificates in "Issued Policies".'
    ]
  },
  customer: {
    roleTitle: 'Policyholder (Customer)',
    workspaceScope: 'Customer Self-Service Portal & Public Website',
    summary:
      'You can explore insurance products, request quotes, complete applications, pay premiums in sandbox mode, download verified E-Policies, and submit claims—while internal company controls remain restricted to AIC staff.',
    canDo: [
      'Browse all published insurance products, read coverage details & exclusions, and calculate indicative ETB estimates.',
      'Create, save as Draft, and submit new policy applications using "Services & Products" or "My Applications".',
      'Complete premium payments via the Chapa V2 Sandbox checkout ("Payments & Receipts") to issue active E-Policies immediately.',
      'Download official E-Policy certificates, verify verification codes publicly (/verify-policy), file claims ("Claims Center"), and manage your profile & language.'
    ],
    cannotDo: [
      'Cannot access the Admin Control Centre, Operator Console, or internal Underwriting and Finance dashboards.',
      'Cannot self-approve applications requiring underwriter review or manually edit issued policy premiums, coverage dates, or policy status.',
      'Cannot view other policyholders’ applications, certificates, or payment transactions.'
    ],
    howToUse: [
      '1. Pick a cover in "Services & Products" and click Apply to save a draft or submit your application.',
      '2. Once your application is Quoted, open "My Applications" and click "Pay via Chapa" (use Sandbox Test Mode for QA).',
      '3. Download your active certificate from "E-Policies" or report an incident anytime in "Claims Center".'
    ]
  }
};

interface GuideStep {
  step: string;
  title: string;
  detail: string;
  systemNote: string;
}

interface GuideChapter {
  id: string;
  number: string;
  title: string;
  audience: 'all' | 'internal' | 'customer';
  topicLabel: string;
  summary: string;
  highlights: { label: string; description: string }[];
  workflowSteps?: GuideStep[];
  sections: {
    heading: string;
    body: string[];
    checklist?: string[];
  }[];
  actions: Record<GuideRole, PlatformGuideActionTarget[]>;
}

const GUIDE_CHAPTERS: GuideChapter[] = [
  {
    id: 'architecture',
    number: '01',
    title: 'How the AIC Platform & Your Workspace Work',
    audience: 'all',
    topicLabel: 'System Overview',
    summary:
      'How public policy discovery, authentication, role-secured workspaces, and live Cloud Firestore synchronization connect across the application.',
    highlights: [
      {
        label: 'Public Website & Verification',
        description:
          'Everyone can browse published insurance products, check branch locations, read news, and verify active certificate codes publicly.'
      },
      {
        label: 'Role-Secured Workspaces',
        description:
          'Signing in routes your account automatically to your authorized portal—showing only the tools and records permitted for your role.'
      },
      {
        label: 'Live Data Sync',
        description:
          'Applications, formal quotations, Chapa V2 settlements, issued E-Policies, and claims synchronize immediately across sessions.'
      }
    ],
    workflowSteps: [
      {
        step: 'Step 01',
        title: 'Sign In & Role Routing',
        detail:
          'Sign in with Google or Email/Password. First-time self-service users complete a quick onboarding profile before opening their portal.',
        systemNote: 'Authenticated accounts receive automatic role routing based on their verified profile.'
      },
      {
        step: 'Step 02',
        title: 'Browse Coverage & Start Application',
        detail:
          'Open insurance product pages to review coverage sections, exclusions, and required documents, then create an application.',
        systemNote: 'Each product renders risk-specific fields matching its underwriting schema.'
      },
      {
        step: 'Step 03',
        title: 'Quotation & Underwriting Review',
        detail:
          'Standard applications calculate itemized ETB pricing immediately; specialized risks are reviewed by an Underwriter before quoting.',
        systemNote: 'Computes Base Premium + 15% VAT + 50 ETB Stamp Duty automatically.'
      },
      {
        step: 'Step 04',
        title: 'Payment Settlement & E-Policy',
        detail:
          'Paying a quote settles the transaction and immediately mints an active E-Policy certificate with a public verification code.',
        systemNote: 'Generates Policy Number (AIC/...) and public lookup code (AIC-VRF-...).'
      }
    ],
    sections: [
      {
        heading: 'How Areas of the Website Connect',
        body: [
          'The platform separates the public website (product catalog, public policy verifier, branch locator, corporate information, claims instructions) from authenticated workspaces.',
          'All policy numbers, payment references, and verification codes follow a single authoritative record so receipts and certificates remain consistent everywhere.'
        ]
      }
    ],
    actions: {
      customer: [
        { tab: 'services', label: 'Open Services & Products' },
        { tab: 'dashboard', label: 'Go to Overview' }
      ],
      operator: [
        { tab: 'overview', label: 'Open Overview Metrics' },
        { tab: 'customers', label: 'Open Customer CRM' }
      ],
      staff: [
        { tab: 'queue', label: 'Open Underwriting Queue' },
        { tab: 'policies', label: 'View Issued Policies' }
      ],
      finance: [
        { tab: 'payments', label: 'Open Transactions & Export' },
        { tab: 'policies', label: 'View Policies (Read-Only)' }
      ],
      admin: [
        { tab: 'overview', label: 'Real Database Metrics' },
        { tab: 'operators', label: 'Manage Employees' }
      ]
    }
  },
  {
    id: 'policy-lifecycle',
    number: '02',
    title: 'Applications, Quotations & E-Policy Lifecycle',
    audience: 'all',
    topicLabel: 'Applications & Policies',
    summary:
      'Step-by-step guide to creating draft applications, understanding every status stage, and issuing or managing active E-Policies.',
    highlights: [
      {
        label: 'Save Draft Anytime',
        description:
          'Incomplete application forms can be saved as Draft and resumed later without re-entering asset or beneficiary data.'
      },
      {
        label: 'Clear Review Statuses',
        description:
          'Every application transitions clearly from Draft to Submitted, Quoted / Awaiting Payment, and Approved / Issued.'
      },
      {
        label: 'Instant Certificate Issuance',
        description:
          'Once paid and approved, the E-Policy schedule and printable certificate become available immediately.'
      }
    ],
    sections: [
      {
        heading: 'Application Status Stages Explained',
        body: [
          'Tracking application status tells you exactly what happens next in the lifecycle:'
        ],
        checklist: [
          'Draft: Saved before formal submission — still editable.',
          'Submitted / Under Review: Sent to Underwriting for verification of attached ID, vehicle Libre, or asset details.',
          'More Info Required: Clarifications or clearer document scans were requested before pricing.',
          'Quoted / Awaiting Payment: Itemized ETB premium schedule is ready for Chapa checkout.',
          'Approved / Issued: Payment verified and active E-Policy issued.'
        ]
      },
      {
        heading: 'Using Sample Test Data for QA',
        body: [
          'Inside the Customer Portal Application Wizard, click "Fill Sample Details" to populate realistic Ethiopian plates, TIN numbers, and Addis Ababa addresses in one click so end-to-end flows can be tested quickly.'
        ]
      }
    ],
    actions: {
      customer: [
        { tab: 'applications', label: 'Open My Applications' },
        { tab: 'policies', label: 'Open E-Policies' }
      ],
      operator: [
        { tab: 'policies', label: 'Manage E-Policies' },
        { tab: 'products', label: 'Configure Products' }
      ],
      staff: [
        { tab: 'queue', label: 'Review Pending Queue' },
        { tab: 'policies', label: 'Issued Policy Registry' }
      ],
      finance: [
        { tab: 'policies', label: 'View Policy Registry (Read-Only)' },
        { tab: 'payments', label: 'Reconcile Settlements' }
      ],
      admin: [
        { tab: 'products', label: 'Configure Product CMS' },
        { tab: 'policies', label: 'Manage E-Policies' }
      ]
    }
  },
  {
    id: 'payments-sandbox',
    number: '03',
    title: 'Payments, Chapa V2 Checkout & Reconciliation',
    audience: 'all',
    topicLabel: 'Billing & Transactions',
    summary:
      'How ETB premium tax breakdowns, Telebirr / CBE Birr / Card sandbox checkout, declined-payment retries, receipts, and financial exports work.',
    highlights: [
      {
        label: 'Tax Breakdown Included',
        description:
          'Every premium quote clearly separates Base Premium (ETB), 15% statutory VAT, and 50 ETB Stamp Duty.'
      },
      {
        label: 'Safe QA Sandbox Testing',
        description:
          'Test successful Telebirr/CBE Birr/Card settlements OR failed/declined scenarios without real financial charges.'
      },
      {
        label: 'Structured Financial Ledger',
        description:
          'Finance Officers, Operators, and Admins can filter transactions by status, verification, date, and amount—and export CSV or JSON.'
      }
    ],
    sections: [
      {
        heading: 'How Checkout & Ledger Tracking Work',
        body: [
          'From any Quoted application, clicking "Pay via Chapa" opens the Chapa V2 Sandbox dialog to simulate either an approved payment (which mints the E-Policy) or a declined payment (allowing retry).',
          'Paid transactions immediately appear inside both the customer’s "Payments & Receipts" tab and the internal Transactions Ledger with server verification timestamps.'
        ]
      }
    ],
    actions: {
      customer: [{ tab: 'payments', label: 'Open Payments & Receipts' }],
      operator: [{ tab: 'payments', label: 'Open Chapa V2 Gateway' }],
      staff: [{ tab: 'policies', label: 'View Settled Policies' }],
      finance: [{ tab: 'payments', label: 'Filter & Export Transactions' }],
      admin: [{ tab: 'payments', label: 'Open Chapa V2 Gateway' }]
    }
  },
  {
    id: 'claims-workflow',
    number: '04',
    title: 'Claims Notification, Inspection & Settlement',
    audience: 'all',
    topicLabel: 'Claims Process',
    summary:
      'How insured incidents are reported digitally, documented for traffic or commercial losses, surveyed by assessors, and settled.',
    highlights: [
      {
        label: 'Prompt Emergency Reporting',
        description:
          'Motor accidents and urgent commercial losses should be logged in Claims Center and reported to +251 11 663 7716.'
      },
      {
        label: 'Policy-Linked Filings',
        description:
          'Claims attach directly to an active E-Policy record with loss date, estimated ETB amount, and incident summary.'
      },
      {
        label: 'Clear Claim Stages',
        description:
          'Follow claim progress from Submitted Notice through Assessor Inspection, Repair Authorization, and Payout Settlement.'
      }
    ],
    sections: [
      {
        heading: 'Filing an Accurate First Notice of Loss',
        body: [
          'Select the affected active policy in the Claims Center, enter the incident date and estimated loss value in ETB, and record a clear factual description including any Traffic Police Report reference.',
          'Preserve scene photographs and wait for assessor authorization before starting non-emergency repairs.'
        ]
      }
    ],
    actions: {
      customer: [
        { tab: 'claims', label: 'Open Claims Center' },
        { route: '/claims', label: 'Public Claims Guidelines' }
      ],
      operator: [{ route: '/claims', label: 'View Public Claims Page' }],
      staff: [{ route: '/claims', label: 'View Public Claims Page' }],
      finance: [{ tab: 'audit', label: 'View Financial Audit Trail' }],
      admin: [
        { tab: 'policies', label: 'Inspect E-Policies' },
        { tab: 'audit', label: 'View Audit Trail' }
      ]
    }
  },
  {
    id: 'verification-security',
    number: '05',
    title: 'Certificate Verification & Data Privacy',
    audience: 'all',
    topicLabel: 'Verification & Security',
    summary:
      'How third parties confirm E-Policy authenticity instantly without exposing private policyholder details.',
    highlights: [
      {
        label: 'Unique Verification Codes',
        description:
          'Every issued E-Policy carries a dedicated AIC-VRF-XXXX code and printable certificate schedule.'
      },
      {
        label: 'Privacy-Safe Public Lookup',
        description:
          'Public lookups confirm validity period, coverage type, and masked owner initials without revealing phone numbers or addresses.'
      }
    ],
    sections: [
      {
        heading: 'Running a Public Verification Check',
        body: [
          'Click "Verify Live Code" on any active E-Policy or visit the public Verify Policy page (/verify-policy) and enter the AIC-VRF code or Policy Number.',
          'Every lookup confirms active, expired, or invalid coverage status immediately.'
        ]
      }
    ],
    actions: {
      customer: [
        { tab: 'policies', label: 'Open My E-Policies' },
        { route: '/verify-policy', label: 'Public Verification Tool' }
      ],
      operator: [
        { tab: 'policies', label: 'Inspect Verification Logs' },
        { route: '/verify-policy', label: 'Public Verification Tool' }
      ],
      staff: [
        { tab: 'policies', label: 'Issued Policies Registry' },
        { route: '/verify-policy', label: 'Public Verification Tool' }
      ],
      finance: [
        { tab: 'policies', label: 'Policies & Verification Logs' },
        { route: '/verify-policy', label: 'Public Verification Tool' }
      ],
      admin: [
        { tab: 'policies', label: 'Policies & Verification Logs' },
        { route: '/verify-policy', label: 'Public Verification Tool' }
      ]
    }
  },
  {
    id: 'internal-roles-guide',
    number: '06',
    title: 'Internal Role Boundaries & Staff Permissions Guide',
    audience: 'internal',
    topicLabel: 'Role Boundaries',
    summary:
      'Detailed reference of what Administrators, Direct-Sales Operators, Finance Officers, and Underwriters can and cannot do inside internal workspaces.',
    highlights: [
      {
        label: 'Strict Role Separation',
        description:
          'Permissions are enforced in the UI, application store, and Firestore security rules according to company governance.'
      },
      {
        label: 'Employee Onboarding Lock',
        description:
          'Only System Administrators can onboard new employees or suspend/activate staff and operator accounts.'
      },
      {
        label: 'Finance Data & Policy Lock',
        description:
          'Finance Officers see every paid transaction with full filter/export tools, while E-Policies remain strictly read-only.'
      }
    ],
    sections: [
      {
        heading: 'Exact Internal Role Rules (Can & Cannot Do)',
        body: [
          'Review your team role below so you know which actions belong to your desk:'
        ],
        checklist: [
          'Administrator: Can view and edit every module AND is the only role allowed to onboard new employees or activate/suspend operators and internal staff.',
          'Direct-Sales Operator: Shares Admin view and edit rights across Website CMS, Documents, Products, Customer CRM, E-Policies, and Transactions — CANNOT onboard employees or alter staff/operator access.',
          'Finance Officer: Can see every paid and pending transaction, apply multi-field filters, export CSV/JSON transaction and policy reports, and view read-only policies and audit logs — CANNOT edit policies, alter CMS/products, or onboard employees.',
          'Underwriter / Staff: Can adjudicate applications in the Underwriting Queue, request missing KYC documents, issue formal quotations, and approve policies — CANNOT access Admin Control modules or onboard employees.'
        ]
      }
    ],
    actions: {
      customer: [{ tab: 'profile', label: 'Profile & Languages' }],
      operator: [{ tab: 'operators', label: 'View Team Roster (Read-Only)' }],
      staff: [{ tab: 'queue', label: 'Underwriting Queue' }],
      finance: [{ tab: 'payments', label: 'Paid Transactions & Export' }],
      admin: [
        { tab: 'operators', label: 'Onboard / Manage Employees' },
        { tab: 'audit', label: 'Security & Audit Trail' }
      ]
    }
  },
  {
    id: 'customer-account-guide',
    number: '06',
    title: 'Your Account Access, Security & Language Preferences',
    audience: 'customer',
    topicLabel: 'Account & Languages',
    summary:
      'What your Policyholder account can and cannot access, how Google sign-in linking works, and how to switch between 4 supported languages.',
    highlights: [
      {
        label: 'Private Self-Service Account',
        description:
          'Your login isolates your personal applications, payment receipts, E-Policies, and claims—no other customer can view your records.'
      },
      {
        label: 'No Internal Admin Access',
        description:
          'Internal company administration, underwriting approvals, employee management, and company-wide ledgers are restricted strictly to authorized AIC staff.'
      }
    ],
    sections: [
      {
        heading: 'Your Policyholder Permissions & Account Controls',
        body: [
          'Use "Profile & Settings" inside your portal to review your contact information, link your Google Account for faster login, or change display language between English, Amharic (አማርኛ), Afaan Oromoo, and Tigrigna (ትግርኛ).'
        ],
        checklist: [
          'Allowed: Browse products, save/submit applications, test Chapa sandbox payments, download your certificates, file claims, and update profile preferences.',
          'Restricted: Cannot access Admin Control panels, internal operations workspaces, or alter policy premiums and status manually.'
        ]
      }
    ],
    actions: {
      customer: [{ tab: 'profile', label: 'Open Profile & Settings' }],
      operator: [{ tab: 'overview', label: 'Overview' }],
      staff: [{ tab: 'queue', label: 'Queue' }],
      finance: [{ tab: 'payments', label: 'Transactions' }],
      admin: [{ tab: 'overview', label: 'Overview' }]
    }
  }
];

export const PlatformGuideModule: React.FC<PlatformGuideModuleProps> = ({
  role,
  workspace,
  onQuickNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const roleProfile = ROLE_PROFILES[role];

  const visibleChapters = useMemo(() => {
    return GUIDE_CHAPTERS.filter((ch) => {
      if (ch.audience === 'all') return true;
      if (role === 'customer') return ch.audience === 'customer';
      return ch.audience === 'internal';
    });
  }, [role]);

  const [activeChapterId, setActiveChapterId] = useState<string>(visibleChapters[0]?.id || 'architecture');
  const [activeWorkflowIdx, setActiveWorkflowIdx] = useState<number>(0);

  const filteredChapters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return visibleChapters;
    return visibleChapters.filter(
      (ch) =>
        ch.title.toLowerCase().includes(q) ||
        ch.summary.toLowerCase().includes(q) ||
        ch.sections.some(
          (s) =>
            s.heading.toLowerCase().includes(q) ||
            s.body.some((b) => b.toLowerCase().includes(q)) ||
            (s.checklist && s.checklist.some((c) => c.toLowerCase().includes(q)))
        )
    );
  }, [searchQuery, visibleChapters]);

  const activeChapter =
    filteredChapters.find((c) => c.id === activeChapterId) ||
    filteredChapters[0] ||
    visibleChapters[0];

  const activeIndex = visibleChapters.findIndex((c) => c.id === activeChapter.id);

  // Align quick-launch buttons cleanly when an operator opens Platform Guide inside OperatorPortal vs AdminControlCentre
  const roleActions = useMemo(() => {
    if (role === 'operator' && workspace === 'operator') {
      switch (activeChapter.id) {
        case 'architecture':
          return [
            { tab: 'overview', label: 'Operator Dashboard' },
            { tab: 'customers', label: 'Customer Directory' }
          ];
        case 'policy-lifecycle':
          return [
            { tab: 'applications', label: 'Assisted Applications' },
            { tab: 'new_customer', label: 'Onboard New Customer' }
          ];
        case 'payments-sandbox':
          return [{ tab: 'applications', label: 'Check Assisted Quotes' }];
        case 'internal-roles-guide':
          return [{ route: '/admin', label: 'Open Operations Console' }];
        default:
          return activeChapter.actions.operator || [];
      }
    }
    return activeChapter.actions[role] || [];
  }, [activeChapter, role, workspace]);

  const IconForChapter = (id: string) => {
    switch (id) {
      case 'architecture':
        return Layers;
      case 'policy-lifecycle':
        return FileText;
      case 'payments-sandbox':
        return CreditCard;
      case 'claims-workflow':
        return AlertCircle;
      case 'verification-security':
        return ShieldCheck;
      default:
        return Users;
    }
  };

  const ChapterIcon = IconForChapter(activeChapter.id);

  return (
    <div className="space-y-6">
      {/* Top Documentation Header & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#12366e] font-semibold">
            <Compass className="w-4 h-4 text-[#c59b27]" />
            <span>Platform Documentation &amp; Role Guide</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            How the Africa Insurance Digital System Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Clear guidance on what your signed-in role can do, what is restricted, and how to use each area of the application.
          </p>
        </div>

        <div className="w-full lg:w-72 shrink-0">
          <label htmlFor="aic-platform-guide-search" className="sr-only">
            Search platform documentation
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="aic-platform-guide-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or permissions..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-base sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#12366e] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Clear Signed-In Role Permissions Matrix: Can Do / Cannot Do / How to Use */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#12366e]">
              Your Active Role &amp; Access Scope
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {roleProfile.roleTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              {roleProfile.summary}
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#12366e]/10 text-[#12366e] text-xs font-semibold shrink-0 self-start sm:self-center">
            {roleProfile.workspaceScope}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* What You Can Do */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>What You Can Do</span>
            </div>
            <ul className="space-y-2">
              {roleProfile.canDo.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What You Cannot Do */}
          <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-900">
              <Ban className="w-4 h-4 text-rose-600 shrink-0" />
              <span>What You Cannot Do (Restrictions)</span>
            </div>
            <ul className="space-y-2">
              {roleProfile.cannotDo.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 leading-relaxed">
                  <Ban className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* How to Use This Role in the Application */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold text-[#12366e]">
            How to Use the Application as {roleProfile.roleTitle}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {roleProfile.howToUse.map((tip, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-700 leading-relaxed">
                {tip}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Split Documentation Reader: Chapter Rail + Focused Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Topic Navigation Rail */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-500 border-b border-slate-100 flex items-center justify-between">
            <span>System Guide Topics</span>
            <span className="font-mono tabular-nums">{filteredChapters.length}</span>
          </div>

          {filteredChapters.length === 0 ? (
            <div className="p-4 text-xs text-slate-500 text-center space-y-2">
              <p>No documentation topics matched &ldquo;{searchQuery}&rdquo;.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#12366e] font-semibold hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="space-y-1 pt-1">
              {filteredChapters.map((ch) => {
                const selected = ch.id === activeChapter.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setActiveChapterId(ch.id);
                      setActiveWorkflowIdx(0);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-start justify-between gap-2.5 cursor-pointer ${
                      selected
                        ? 'bg-[#12366e] text-white'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className={`text-[11px] font-mono tabular-nums ${selected ? 'text-[#f0cb5a]' : 'text-slate-400'}`}>
                        {ch.number} · {ch.topicLabel}
                      </div>
                      <div className={`text-xs font-semibold leading-snug ${selected ? 'text-white' : 'text-slate-900'}`}>
                        {ch.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Right Article Body */}
        <article className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 sm:p-8 space-y-6">
          {/* Topic Header */}
          <div className="border-b border-slate-200 pb-5 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ChapterIcon className="w-4 h-4 text-[#12366e]" />
              <span className="font-mono font-semibold text-[#12366e]">Section {activeChapter.number}</span>
              <span aria-hidden="true">·</span>
              <span>{activeChapter.topicLabel}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-balance">
              {activeChapter.number}. {activeChapter.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {activeChapter.summary}
            </p>
          </div>

          {/* Core Key Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 pb-6">
            {activeChapter.highlights.map((hl, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1.5">
                <div className="text-xs font-bold text-[#12366e]">{hl.label}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{hl.description}</p>
              </div>
            ))}
          </div>

          {/* Interactive Workflow Walkthrough */}
          {activeChapter.workflowSteps && activeChapter.workflowSteps.length > 0 && (
            <div className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900">End-to-End Flow</h4>
                <span className="text-xs text-slate-500">Select any step to inspect how it works</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {activeChapter.workflowSteps.map((st, idx) => (
                  <button
                    key={st.step}
                    type="button"
                    onClick={() => setActiveWorkflowIdx(idx)}
                    className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      activeWorkflowIdx === idx
                        ? 'bg-[#12366e] border-[#12366e] text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`text-[11px] font-mono font-semibold ${activeWorkflowIdx === idx ? 'text-[#f0cb5a]' : 'text-slate-500'}`}>
                      {st.step}
                    </div>
                    <div className="text-xs font-semibold mt-0.5 leading-snug">{st.title}</div>
                  </button>
                ))}
              </div>

              {activeChapter.workflowSteps[activeWorkflowIdx] && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 text-sm">
                    {activeChapter.workflowSteps[activeWorkflowIdx].step}:{' '}
                    {activeChapter.workflowSteps[activeWorkflowIdx].title}
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {activeChapter.workflowSteps[activeWorkflowIdx].detail}
                  </p>
                  <div className="pt-2 border-t border-slate-200 text-slate-600 font-mono text-[11px]">
                    System behavior: {activeChapter.workflowSteps[activeWorkflowIdx].systemNote}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Detailed Sections */}
          <div className="space-y-6">
            {activeChapter.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-3">
                <h4 className="text-base font-bold text-slate-900">{sec.heading}</h4>
                <div className="space-y-2.5">
                  {sec.body.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {sec.checklist && sec.checklist.length > 0 && (
                  <ul className="space-y-2 pt-1">
                    {sec.checklist.map((item, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Role-Contextual Quick Launch Actions */}
          {roleActions.length > 0 && onQuickNavigate && (
            <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Open in your workspace:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {roleActions.map((act, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onQuickNavigate({ tab: act.tab, route: act.route })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-[#12366e] text-[#12366e] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>{act.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Previous / Next Topic Pagination */}
          <div className="pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={activeIndex <= 0}
              onClick={() => {
                if (activeIndex > 0) {
                  setActiveChapterId(visibleChapters[activeIndex - 1].id);
                  setActiveWorkflowIdx(0);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={activeIndex >= visibleChapters.length - 1}
              onClick={() => {
                if (activeIndex < visibleChapters.length - 1) {
                  setActiveChapterId(visibleChapters[activeIndex + 1].id);
                  setActiveWorkflowIdx(0);
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#12366e] hover:bg-[#0e2a58] text-white text-xs font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};
