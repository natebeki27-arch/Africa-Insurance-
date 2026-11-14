import React, { useState } from 'react';
import { 
  Building, 
  Users, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  Briefcase, 
  Search, 
  Sparkles,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  FileText
} from 'lucide-react';

interface LeadershipPageProps {
  navigate: (route: string) => void;
  initialTab?: 'board' | 'executives' | 'structure';
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  image: string;
  initials: string;
  bio: string;
  category: 'Executive' | 'Non-Executive' | 'Independent' | 'Secretary';
  committees?: string[];
}

export interface ExecutiveManager {
  id: string;
  name: string;
  title: string;
  department: string;
  image: string;
  initials: string;
  responsibilities: string[];
  contact?: string;
}

export const BOARD_MEMBERS: BoardMember[] = [
  {
    id: 'aklilu-wubet',
    name: 'Dr. Aklilu Wubet',
    role: 'Chairman of the Board',
    image: '/assets/board/aklilu_wubet.jpg?hd=3',
    initials: 'AW',
    category: 'Non-Executive',
    bio: 'Leads the Board of Directors of Africa Insurance Company S.C., overseeing corporate governance, fiduciary compliance, risk appetite, and strategic capital growth toward the ETB 2 Billion capitalization goal.',
    committees: ['Board Executive Committee', 'Risk & Compliance Committee']
  },
  {
    id: 'alemu-berhe',
    name: 'Ato Alemu Berhe',
    role: 'Vice Chairman of the Board',
    image: '/assets/board/alemu_berhe.jpg?hd=3',
    initials: 'AB',
    category: 'Non-Executive',
    bio: 'Supports the Chairman in strategic board oversight, long-range institutional development, and continuous engagement with corporate stakeholders.',
    committees: ['Strategy & Investment Committee', 'Audit Oversight']
  },
  {
    id: 'getachew-tadesse',
    name: 'Ato Getachew Tadesse',
    role: 'Director',
    image: '/assets/board/getachew_tadesse.jpg?hd=3',
    initials: 'GT',
    category: 'Non-Executive',
    bio: 'Provides seasoned governance in national financial regulation, operational risk controls, and shareholder dividend policy.',
    committees: ['Audit Committee', 'Nomination & Governance']
  },
  {
    id: 'abdurahman-abdulbaki',
    name: 'Ato Abdurahman Abdulbaki',
    role: 'Director',
    image: '/assets/board/abdurahman_abdulbaki.jpg?hd=3',
    initials: 'AA',
    category: 'Non-Executive',
    bio: 'Experienced board member contributing to strategic portfolio diversification, asset-liability matching, and solvency margin evaluation.',
    committees: ['Strategy & Investment Committee']
  },
  {
    id: 'birhanu-tadesse',
    name: 'Ato Birhanu Tadesse',
    role: 'Director',
    image: '/assets/board/birhanu_tadesse.jpg?hd=3',
    initials: 'BT',
    category: 'Non-Executive',
    bio: 'Advises the board on commercial underwriting standards, reinsurance security ratings, and nationwide branch network growth.',
    committees: ['Risk & Compliance Committee']
  },
  {
    id: 'enewey-gmedhin',
    name: 'W/ro Enewey G/Medhin',
    role: 'Director',
    image: '/assets/board/enewey_gmedhin.jpg?hd=3',
    initials: 'EG',
    category: 'Non-Executive',
    bio: 'Brings high-level commercial acumen, corporate social accountability, and human capital empowerment insights to board deliberations.',
    committees: ['Human Resource & Compensation Committee']
  },
  {
    id: 'sitotawe-bekele',
    name: 'Ato Sitotawe Bekele',
    role: 'Director',
    image: '/assets/board/sitotawe_bekele.jpg?hd=3',
    initials: 'SB',
    category: 'Non-Executive',
    bio: 'Experienced in business leadership and corporate strategy, reinforcing compliance with National Bank of Ethiopia directives.',
    committees: ['Audit Committee', 'Risk & Compliance Committee']
  },
  {
    id: 'genet-argaw',
    name: 'W/ro Genet Argaw',
    role: 'Director',
    image: '/assets/board/genet_argaw.jpg?hd=3',
    initials: 'GA',
    category: 'Non-Executive',
    bio: 'Focuses on sustainable corporate governance, customer protection standards, and client-centric insurance services.',
    committees: ['Human Resource & Compensation Committee', 'Strategy Committee']
  },
  {
    id: 'firdosa-adus',
    name: 'W/ro Firdosa Adus',
    role: 'Director',
    image: '/assets/board/firdosa_adus.jpg?hd=3',
    initials: 'FA',
    category: 'Non-Executive',
    bio: 'Offers executive acumen in enterprise risk management, underwriting balance, and capital expansion strategies.',
    committees: ['Board Executive Committee', 'Risk Committee']
  },
  {
    id: 'yisak-kebede',
    name: 'Ato Yisak Kebede',
    role: "Company's Secretary",
    image: '/assets/board/yisak_kebede.jpg?hd=3',
    initials: 'YK',
    category: 'Secretary',
    bio: 'Oversees statutory board secretariat services, shareholder register administration, National Bank of Ethiopia regulatory filings, and general assembly coordination.',
    committees: ['Secretariat & Regulatory Affairs']
  }
];

export const EXECUTIVE_MANAGERS: ExecutiveManager[] = [
  {
    id: 'kiros-jiranie',
    name: 'Ato Kiros Jiranie',
    title: 'Managing Director & CEO',
    department: 'Executive Office',
    image: '/assets/executives/kiros.jpg?hd=3',
    initials: 'KJ',
    responsibilities: [
      'Nationwide insurance underwriting operations leadership',
      'Fiduciary accountability to the Board of Directors & National Bank of Ethiopia',
      'Capital expansion to ETB 2 Billion and corporate solvency maintenance',
      'Overall executive governance and strategic corporate partnerships'
    ],
    contact: 'md@africainsurancesc.com'
  },
  {
    id: 'kassahun-begashaw',
    name: 'Ato Kassahun Begashaw',
    title: 'Deputy Managing Director — Operation',
    department: 'Operations Sector',
    image: '/assets/executives/kassahun.jpg?hd=3',
    initials: 'KB',
    responsibilities: [
      'Directing Underwriting & Nationwide Branch Operations',
      'Claims Management and rapid fair settlement pipelines',
      'Reinsurance treaty placement & international securities',
      'Life & Health Insurance underwriting and micro-insurance programs'
    ],
    contact: 'operations@africainsurancesc.com'
  },
  {
    id: 'daniel-teweldebrehan',
    name: 'Ato Daniel Teweldebrehan',
    title: 'Deputy Managing Director — Resource',
    department: 'Resource & Administration Sector',
    image: '/assets/executives/daniel.jpg?hd=3',
    initials: 'DT',
    responsibilities: [
      'Financial Management, investments in bonds, equity shares and real estate',
      'Information & Communication Technology modern infrastructure',
      'Human Resource Management & staff competency development',
      'Corporate facilities, logistical assets, and property administration'
    ],
    contact: 'resource@africainsurancesc.com'
  },
  {
    id: 'branch-ops-mgr',
    name: 'Branch Operations Leadership',
    title: 'Manager — U/W & Branch Operations Department',
    department: 'Underwriting & Branches',
    image: '/assets/executives/placeholder.jpg?hd=3',
    initials: 'BO',
    responsibilities: [
      'Supervising 17+ core branches across Addis Ababa and federal regional capitals',
      'Standardized risk surveying and rate pricing conformity',
      'Business development and field agent monitoring'
    ]
  },
  {
    id: 'tesfaye-girma',
    name: 'Ato Tesfaye Girma',
    title: 'Manager — HRM & Property Administration Department',
    department: 'Human Resources & Property',
    image: '/assets/executives/tesfaye.jpg?hd=3',
    initials: 'TG',
    responsibilities: [
      'Talent recruitment, employee relations, and workforce benefits',
      'Corporate property administration and facilities management',
      'Compliance with national labor proclamations and safety codes'
    ]
  },
  {
    id: 'mezmur-hawaz',
    name: 'Ato Mezmur Hawaz',
    title: 'Manager — Reinsurance Service',
    department: 'Reinsurance Service',
    image: '/assets/executives/mezmur.jpg?hd=3',
    initials: 'MH',
    responsibilities: [
      'Treaty and facultative reinsurance placement with premier global reinsurers (Africa Re, Ethiopian Re, Zep Re)',
      'Large industrial and catastrophic risk cession modeling',
      'Solvency exposure minimization on massive property and marine risks'
    ]
  },
  {
    id: 'tesema-hidetu',
    name: 'Ato Tesema Hidetu',
    title: 'Manager — Internal Audit Department',
    department: 'Internal Audit',
    image: '/assets/executives/tesema.jpg?hd=3',
    initials: 'TH',
    responsibilities: [
      'Independent internal audit reporting directly to the Board Audit Committee',
      'Financial controls auditing and underwriting compliance verification',
      'Prevention of fraud, operational leakage, and statutory infractions'
    ]
  },
  {
    id: 'yohaness-hailu',
    name: 'Ato Yohaness Hailu',
    title: 'Manager — Claims Management Department',
    department: 'Claims Management',
    image: '/assets/executives/yohannes.jpg?hd=3',
    initials: 'YH',
    responsibilities: [
      'Prompt, equitable settlement of motor, fire, marine, and engineering claims',
      'Independent assessor dispatch and salvage realization',
      'Customer claim dispute resolution and fast-track processing'
    ]
  },
  {
    id: 'michael-mesfin',
    name: 'Ato Michael Mesfin',
    title: 'Manager — Legal Service',
    department: 'Legal Affairs',
    image: '/assets/executives/michael.jpg?hd=3',
    initials: 'MM',
    responsibilities: [
      'Corporate legal advisory, litigation management, and subrogation recoveries',
      'Policy wording contract review and compliance with the Commercial Code',
      'Regulatory compliance consultations with National Bank of Ethiopia'
    ]
  },
  {
    id: 'alemseged-meresa',
    name: 'Ato Alemseged Meresa',
    title: 'Manager — Life & Health Insurance Department',
    department: 'Life & Health',
    image: '/assets/executives/alemseged.jpg?hd=3',
    initials: 'AM',
    responsibilities: [
      'Group and Individual Term Life, Endowment, and Education policies',
      'Comprehensive Medical & Health insurance programs for corporate clients',
      'Actuarial mortality tracking and group policy renewals'
    ]
  },
  {
    id: 'kelemwork-tadesse',
    name: 'W/ro Kelemwork Tadesse',
    title: 'Manager — Finance and Investment Department',
    department: 'Finance & Investment',
    image: '/assets/executives/kelemwork.jpg?hd=3',
    initials: 'KT',
    responsibilities: [
      'Financial accounting, IFRS reporting, and statutory balance sheet preparation',
      'Prudent investment of insurance funds in NBE bonds, time deposits, and equities',
      'Cash flow liquidity management ensuring immediate claim payout solvency'
    ]
  },
  {
    id: 'estifanos-emiru',
    name: 'Ato Estifanos Emiru',
    title: 'Manager — Engineering Service',
    department: 'Engineering & Surveying',
    image: '/assets/executives/estifanos.jpg?hd=3',
    initials: 'EE',
    responsibilities: [
      'Technical engineering risk inspection for construction & machinery breakdown',
      'Pre-risk factory assessments and loss prevention recommendations',
      'Valuation of high-value industrial risks and commercial structures'
    ]
  },
  {
    id: 'haney-kassa',
    name: 'W/ro Haney Kassa',
    title: 'Manager — Risk Management & AML-CFT & Compliance',
    department: 'Risk & Compliance',
    image: '/assets/executives/haney.jpg?hd=3',
    initials: 'HK',
    responsibilities: [
      'Anti-Money Laundering & Combating Financing of Terrorism (AML/CFT) frameworks',
      'Enterprise Risk Management (ERM) policies across all branches',
      'Adherence to National Bank of Ethiopia directives and international norms'
    ]
  },
  {
    id: 'bedilu-mekonnen',
    name: 'Ato Bedilu Mekonnen',
    title: 'Manager — Marketing and CRM Department',
    department: 'Marketing & CRM',
    image: '/assets/executives/bedilu.jpg?hd=3',
    initials: 'BM',
    responsibilities: [
      'Brand positioning, corporate communications, and digital channels',
      'Customer Relationship Management (CRM) and satisfaction monitoring',
      'Direct-sales operator recruitment and public marketing campaigns'
    ]
  },
  {
    id: 'dejene-megersa',
    name: 'Ato Dejene Megersa',
    title: 'Manager — ICT Department',
    department: 'Information & Communications Tech',
    image: '/assets/executives/dejene.jpg?hd=3',
    initials: 'DM',
    responsibilities: [
      'Core insurance management software infrastructure and cybersecurity',
      'Branch VPN connectivity, online policy issuance, and portal automation',
      'Data integrity, automated backups, and 24/7 disaster recovery systems'
    ]
  }
];

export const LeadershipPage: React.FC<LeadershipPageProps> = ({ navigate, initialTab = 'board' }) => {
  const [activeTab, setActiveTab] = useState<'board' | 'executives' | 'structure'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<BoardMember | ExecutiveManager | null>(null);

  const filteredBoard = BOARD_MEMBERS.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExecutives = EXECUTIVE_MANAGERS.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb & Title */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
            <button onClick={() => navigate('/about')} className="hover:underline cursor-pointer">About AIC</button>
            <span>/</span>
            <span>Corporate Leadership & Management</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold text-[#12366e] tracking-tight">
                Corporate Leadership & Governance
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
                Africa Insurance Company (S.C.) is steered by an esteemed Board of Directors and an experienced Executive Management Team with decades of actuarial, underwriting, and fiduciary leadership across Ethiopia.
              </p>
            </div>

            {/* Quick Capital Badge */}
            <div className="bg-[#12366e] text-white p-4 rounded-2xl shrink-0 shadow-md border border-[#c59b27]/30 text-right">
              <span className="text-[10px] uppercase font-bold text-[#f0cb5a] block">Paid-Up Capital</span>
              <span className="text-xl font-bold font-mono">ETB 603M+</span>
              <span className="text-[11px] text-slate-300 block">Scaling to ETB 2 Billion</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 p-1 bg-slate-200/80 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('board')}
              className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'board'
                  ? 'bg-white text-[#12366e] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Board of Directors ({BOARD_MEMBERS.length})
            </button>
            <button
              onClick={() => setActiveTab('executives')}
              className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'executives'
                  ? 'bg-white text-[#12366e] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Executive Management ({EXECUTIVE_MANAGERS.length})
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`w-full sm:w-auto sm:flex-initial px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'structure'
                  ? 'bg-white text-[#12366e] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Organizational Structure
            </button>
          </div>

          {activeTab !== 'structure' && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab === 'board' ? 'directors' : 'executive managers'}...`}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#12366e] focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* TAB 1: BOARD OF DIRECTORS */}
        {activeTab === 'board' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#12366e] to-[#1c498a] text-white p-6 sm:p-8 rounded-3xl shadow-sm space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#f0cb5a]">
                Statutory Fiduciary Oversight
              </span>
              <h2 className="text-2xl font-bold">The Board of Directors</h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
                Duly elected by the General Assembly of Shareholders and sanctioned by the National Bank of Ethiopia, our Board of Directors ensures strategic stewardship, financial sustainability, rigorous regulatory compliance, and maximum shareholder value.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredBoard.map((member) => (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-[#12366e]/40 transition-all duration-300 group flex flex-col items-center text-center space-y-4 cursor-pointer"
                >
                  <div className="relative w-full aspect-square max-w-[210px] rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-md group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.fallback-initials');
                          if (fallback) fallback.classList.remove('hidden');
                        }
                      }}
                    />
                    <div className="fallback-initials hidden absolute inset-0 flex items-center justify-center bg-[#12366e] text-white font-bold text-2xl">
                      {member.initials}
                    </div>
                  </div>

                  <div className="space-y-1 w-full">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#12366e] transition-colors leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#c59b27] leading-tight">
                      {member.role}
                    </p>
                  </div>

                  <div className="w-full pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#12366e] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: EXECUTIVE MANAGEMENT */}
        {activeTab === 'executives' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#0c2550] to-[#12366e] text-white p-6 sm:p-8 rounded-3xl shadow-sm space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#f0cb5a]">
                Operational & Technical Leadership
              </span>
              <h2 className="text-2xl font-bold">Executive Management Team</h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
                Appointed pursuant to National Bank of Ethiopia fit-and-proper directives, our Executive Committee executes board strategies, oversees daily underwriting, handles claims settlements, and drives technological innovation.
              </p>
            </div>

            {/* Top 3 Executives Prominent Spotlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredExecutives.slice(0, 3).map((exec) => (
                <div
                  key={exec.id}
                  onClick={() => setSelectedMember(exec)}
                  className="bg-white border-2 border-[#12366e]/20 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                      <img
                        src={exec.image}
                        alt={exec.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = parent.querySelector('.fallback-initials');
                            if (fallback) fallback.classList.remove('hidden');
                          }
                        }}
                      />
                      <div className="fallback-initials hidden absolute inset-0 flex items-center justify-center bg-[#12366e] text-white font-bold text-xl">
                        {exec.initials}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#c59b27] block">
                        {exec.department}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#12366e] transition-colors leading-tight">
                        {exec.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#12366e] leading-snug">
                        {exec.title}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <p className="text-[11px] font-semibold text-slate-800 uppercase tracking-wider">Key Executive Focus:</p>
                    <ul className="space-y-1">
                      {exec.responsibilities.slice(0, 2).map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs">
                          <CheckCircle className="w-3.5 h-3.5 text-[#c59b27] shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-[#12366e] pt-2">
                    <span>Full Responsibilities</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Department Managers Grid */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Department & Service Managers</h3>
                <span className="text-xs text-slate-500">Authorized Departmental Heads</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredExecutives.slice(3).map((exec) => (
                  <div
                    key={exec.id}
                    onClick={() => setSelectedMember(exec)}
                    className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#12366e]/30 transition-all cursor-pointer group flex items-start gap-3"
                  >
                    <div className="relative w-16 h-18 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                      <img
                        src={exec.image}
                        alt={exec.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = parent.querySelector('.fallback-initials');
                            if (fallback) fallback.classList.remove('hidden');
                          }
                        }}
                      />
                      <div className="fallback-initials hidden absolute inset-0 flex items-center justify-center bg-[#12366e] text-white font-bold text-sm">
                        {exec.initials}
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#12366e] transition-colors leading-snug truncate">
                        {exec.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#c59b27] leading-tight">
                        {exec.title}
                      </p>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {exec.department}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORGANIZATIONAL STRUCTURE */}
        {activeTab === 'structure' && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-[#12366e] uppercase tracking-wider">Corporate Hierarchy</span>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                    Official Organizational Structure Chart
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Approved by the Board of Directors in conformity with National Bank of Ethiopia Insurance Directives.
                  </p>
                </div>
                <a
                  href="/assets/aic_org_chart.jpg?hd=3"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#12366e] hover:bg-[#184486] text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all shrink-0"
                >
                  <span>Open Full Resolution</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Chart Image Viewer */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white p-2">
                <img
                  src="/assets/aic_org_chart.jpg?hd=3"
                  alt="Africa Insurance Company S.C. Organizational Structure"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto rounded-xl object-contain max-h-[700px] mx-auto"
                />
              </div>

              {/* Structural Narrative Hierarchy */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-[#12366e] font-bold text-sm">
                    <ShieldCheck className="w-5 h-5 text-[#c59b27]" />
                    <span>Level 1: Governance</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                    <li>• General Assembly of Shareholders</li>
                    <li>• Board of Directors (10 Members)</li>
                    <li>• Internal Audit & Risk Oversight Committees</li>
                    <li>• Company's Secretary & Statutory Secretariat</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-[#12366e] font-bold text-sm">
                    <Briefcase className="w-5 h-5 text-[#c59b27]" />
                    <span>Level 2: Executive Office</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                    <li>• Managing Director & CEO (Ato Kiros Jiranie)</li>
                    <li>• Deputy MD — Operations (Ato Kassahun Begashaw)</li>
                    <li>• Deputy MD — Resource (Ato Daniel Teweldebrehan)</li>
                    <li>• Risk Management, AML/CFT & Compliance</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-[#12366e] font-bold text-sm">
                    <Building className="w-5 h-5 text-[#c59b27]" />
                    <span>Level 3: Operational Units</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                    <li>• 17+ Nationwide Branches & Underwriting Desks</li>
                    <li>• Claims Management, Legal & Engineering Services</li>
                    <li>• Life & Health Insurance Underwriting</li>
                    <li>• Finance, Investment & ICT Infrastructure</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Detailed Member Profile */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md shrink-0">
                    <img
                      key={selectedMember.id}
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      decoding="async"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.fallback-initials');
                          if (fallback) fallback.classList.remove('hidden');
                        }
                      }}
                    />
                    <div className="fallback-initials hidden absolute inset-0 flex items-center justify-center bg-[#12366e] text-white font-bold text-xl">
                      {selectedMember.initials}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#c59b27]">
                      {'role' in selectedMember ? selectedMember.category : selectedMember.department}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {selectedMember.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#12366e]">
                      {'role' in selectedMember ? selectedMember.role : selectedMember.title}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              {'bio' in selectedMember ? (
                <div className="space-y-4 text-xs text-slate-600">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">Board Fiduciary Profile</h4>
                    <p className="leading-relaxed text-slate-700">{selectedMember.bio}</p>
                  </div>
                  {selectedMember.committees && selectedMember.committees.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Board Committees</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.committees.map((c, i) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-xs text-slate-600">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Operational Responsibilities</h4>
                    <ul className="space-y-2">
                      {selectedMember.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-700">
                          <CheckCircle className="w-4 h-4 text-[#c59b27] shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {selectedMember.contact && (
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-slate-700 font-mono text-xs">
                      <Mail className="w-4 h-4 text-[#12366e]" />
                      <span>{selectedMember.contact}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Africa Insurance Company S.C.</span>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="bg-[#12366e] hover:bg-[#184486] text-white px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
