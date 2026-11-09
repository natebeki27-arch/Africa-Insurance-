import {
  InsuranceProduct,
  Branch,
  OperatorProfile,
  StaffProfile,
  CustomerProfile,
  InsurancePolicy,
  InsuranceApplication,
  TrainingCourse,
  EmailTemplate,
  AuditLogEntry,
  AdminUploadedDocument
} from '../types/insurance';

export const OFFICIAL_DISCLAIMER = 'Official Africa Insurance Company (S.C.) Approved Policy Schedule · Regulated by the National Bank of Ethiopia';
export const DEMO_DISCLAIMER = OFFICIAL_DISCLAIMER;

export const SEED_BRANCHES: Branch[] = [
  {
    branchId: 'BR-ADDIS-HQ',
    name: 'Headquarters & Corporate Branch',
    city: 'Addis Ababa',
    address: 'Africa Avenue (Bole Road), Head Office Building, P.O. Box: 12941',
    phone: '+251 11 663 7716',
    email: 'md@africainsurancesc.com',
    managerName: 'Solomon Tesfaye',
    coordinates: { lat: 9.0018, lng: 38.7845 },
    isHeadquarters: true,
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM, Sat: 8:00 AM - 12:00 PM'
  },
  {
    branchId: 'BR-BOLE',
    name: 'Bole Commercial Branch',
    city: 'Addis Ababa',
    address: 'Bole Sub-City, Near Edna Mall, Airport Road',
    phone: '+251 11 662 4810',
    email: 'bole.branch@africainsurance.et',
    managerName: 'Hiwot Bekele',
    coordinates: { lat: 8.9984, lng: 38.7865 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM, Sat: 8:00 AM - 1:00 PM'
  },
  {
    branchId: 'BR-PIAZZA',
    name: 'Piazza Historic Branch',
    city: 'Addis Ababa',
    address: 'Arada Sub-City, De Gaulle Square, Piazza Commercial Centre',
    phone: '+251 11 155 3290',
    email: 'piazza.branch@africainsurance.et',
    managerName: 'Kibreab Wolde',
    coordinates: { lat: 9.0345, lng: 38.7511 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-MERKATO',
    name: 'Merkato Wholesale & Trade Branch',
    city: 'Addis Ababa',
    address: 'Addis Ketema Sub-City, Commercial Bank Building, Merkato',
    phone: '+251 11 278 1900',
    email: 'merkato.branch@africainsurance.et',
    managerName: 'Tewodros Assefa',
    coordinates: { lat: 9.0315, lng: 38.7360 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM, Sat: 8:00 AM - 1:00 PM'
  },
  {
    branchId: 'BR-ADAMA',
    name: 'Adama Transport Corridor Branch',
    city: 'Adama',
    address: 'Oromia Region, Express Highway Commercial Strip, Main Post Office Area',
    phone: '+251 22 111 8840',
    email: 'adama.branch@africainsurance.et',
    managerName: 'Gemechu Desta',
    coordinates: { lat: 8.5400, lng: 39.2700 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM, Sat: 8:00 AM - 12:00 PM'
  },
  {
    branchId: 'BR-HAWASSA',
    name: 'Hawassa Regional Office',
    city: 'Hawassa',
    address: 'Sidama Region, Piazza District, Main Commercial Corridor',
    phone: '+251 46 220 8910',
    email: 'hawassa.office@africainsurance.et',
    managerName: 'Dawit Mengistu',
    coordinates: { lat: 7.0621, lng: 38.4764 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-DIRE-DAWA',
    name: 'Dire Dawa Commercial Branch',
    city: 'Dire Dawa',
    address: 'Kebele 02, Station Road Commercial Complex',
    phone: '+251 25 111 6340',
    email: 'diredawa.branch@africainsurance.et',
    managerName: 'Ahmed Mohammed',
    coordinates: { lat: 9.6009, lng: 41.8501 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-BAHIR-DAR',
    name: 'Bahir Dar Regional Office',
    city: 'Bahir Dar',
    address: 'Amhara Region, Papyrus Boulevard, Lake Tana Commercial Area',
    phone: '+251 58 220 4120',
    email: 'bahirdar.office@africainsurance.et',
    managerName: 'Tigist Alemayehu',
    coordinates: { lat: 11.5936, lng: 37.3908 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-GONDAR',
    name: 'Gondar Heritage Branch',
    city: 'Gondar',
    address: 'Central Piazza Commercial Area, Near Fasilides Castle',
    phone: '+251 58 111 2345',
    email: 'gondar.branch@africainsurance.et',
    managerName: 'Yared Mulugeta',
    coordinates: { lat: 12.6075, lng: 37.4667 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-MEKELLE',
    name: 'Mekelle Regional Office',
    city: 'Mekelle',
    address: 'Tigray Region, Romanat Square Commercial Centre',
    phone: '+251 34 440 7654',
    email: 'mekelle.office@africainsurance.et',
    managerName: 'Berhe Gebru',
    coordinates: { lat: 13.4967, lng: 39.4753 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-JIMMA',
    name: 'Jimma Coffee & Agro Branch',
    city: 'Jimma',
    address: 'Oromia Region, Aba Jifar Boulevard, Commercial District',
    phone: '+251 47 111 4560',
    email: 'jimma.branch@africainsurance.et',
    managerName: 'Tolosa Beyene',
    coordinates: { lat: 7.6734, lng: 36.8344 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-DESSIE',
    name: 'Dessie Wollo Branch',
    city: 'Dessie',
    address: 'Amhara Region, Piazza Main Road Commercial Corridor',
    phone: '+251 33 111 3490',
    email: 'dessie.branch@africainsurance.et',
    managerName: 'Moges Belay',
    coordinates: { lat: 11.1300, lng: 39.6300 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-JIGJIGA',
    name: 'Jigjiga Cross-Border Branch',
    city: 'Jigjiga',
    address: 'Somali Region, Main Airport Commercial Avenue',
    phone: '+251 25 775 2310',
    email: 'jigjiga.branch@africainsurance.et',
    managerName: 'Farhan Abdi',
    coordinates: { lat: 9.3500, lng: 42.8000 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-NEKEMTE',
    name: 'Nekemte Western Branch',
    city: 'Nekemte',
    address: 'Oromia Region, Kumsa Moroda Road Commercial Complex',
    phone: '+251 57 661 2450',
    email: 'nekemte.branch@africainsurance.et',
    managerName: 'Chala Gutema',
    coordinates: { lat: 9.0833, lng: 36.5500 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-SEBETA',
    name: 'Sebeta Industrial Zone Branch',
    city: 'Sebeta',
    address: 'Oromia Special Zone, Main Industrial Corridor',
    phone: '+251 11 338 1200',
    email: 'sebeta.branch@africainsurance.et',
    managerName: 'Abinet Tulu',
    coordinates: { lat: 8.9167, lng: 38.6167 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-WOLAYITA-SODO',
    name: 'Wolayita Sodo Branch',
    city: 'Wolayita Sodo',
    address: 'South Ethiopia Region, Commercial Bank Plaza',
    phone: '+251 46 551 2130',
    email: 'sodo.branch@africainsurance.et',
    managerName: 'Ermias Markos',
    coordinates: { lat: 6.8600, lng: 37.7600 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  },
  {
    branchId: 'BR-SHASHEMENE',
    name: 'Shashemene Junction Office',
    city: 'Shashemene',
    address: 'Oromia Region, Awash Bank Building, Crossroads Hub',
    phone: '+251 46 110 3420',
    email: 'shashemene.office@africainsurance.et',
    managerName: 'Takele Hunde',
    coordinates: { lat: 7.2000, lng: 38.6000 },
    status: 'active',
    openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM'
  }
];

export const SEED_PRODUCTS: InsuranceProduct[] = [
  {
    productId: 'PRD-MTR-01',
    slug: 'motor-private-insurance',
    productName: 'Private Motor Vehicle Comprehensive Insurance',
    productCategory: 'motor',
    shortDescription: 'Authoritative comprehensive motor policy for private passenger automobiles.',
    fullDescription: 'Comprehensive protection against accidental damage, collision, overturning, fire, theft, and third-party liabilities in compliance with National Bank of Ethiopia standards.',
    heroImage: '/assets/aic_fleet_logistics_1793894083707.jpg',
    disclaimer: OFFICIAL_DISCLAIMER,
    isDemonstration: false,
    benefits: [
      'Comprehensive own-damage indemnification up to vehicle market value',
      'Statutory third-party bodily injury and property damage liabilities',
      'Towing & roadside assistance facilitation across Addis Ababa and national highway corridors'
    ],
    coverageSections: [
      {
        title: 'Section A: Own Damage & Collision',
        description: 'Covers accidental collision, overturning, fire, self-ignition, and lightning damages up to declared vehicle market value.',
        limitOrFormula: 'Declared market value (Subject to surveyor inspection report)'
      },
      {
        title: 'Section B: Statutory Third-Party Liability',
        description: 'Statutory third-party liability coverage compliant with standard Ethiopian transport regulatory benchmarks.',
        limitOrFormula: 'National statutory liability limits'
      }
    ],
    exclusions: [
      'Unlicensed driver operation',
      'General wear, mechanical or electrical breakdown without collision impact',
      'Operating beyond registered territorial borders without cross-border endorsement'
    ],
    eligibilityRules: [
      'Vehicle registered in Ethiopia with valid yellow/blue book (Libre)',
      'Applicant possesses active Ethiopian driver license or company representative authorization'
    ],
    requiredDocuments: [
      { code: 'DOC_LIBRE', title: 'Vehicle Logbook (Libre)', description: 'Clear photo or scan of front and back page of vehicle ownership document', mandatory: true },
      { code: 'DOC_DL', title: 'Driver License', description: 'Authorized primary driver license', mandatory: true },
      { code: 'DOC_INSPEC', title: 'Annual Roadworthiness Certificate', description: 'Current Ministry of Transport inspection stamp', mandatory: false }
    ],
    faq: [
      { question: 'How does claims assessment work for private motor accidents?', answer: 'Notify our 24/7 central claims department immediately. An AIC certified surveyor conducts on-site or garage inspection within 24 hours in Addis Ababa and major regional centers.' }
    ],
    applicationSchema: [
      {
        stepTitle: 'Vehicle Identification',
        fields: [
          { id: 'vehicleMake', label: 'Vehicle Make', type: 'text', placeholder: 'e.g. Toyota', required: true },
          { id: 'vehicleModel', label: 'Vehicle Model', type: 'text', placeholder: 'e.g. Hilux Double Cab', required: true },
          { id: 'yearOfManufacture', label: 'Year of Manufacture', type: 'number', placeholder: '2023', required: true },
          { id: 'plateNumber', label: 'Plate Number', type: 'text', placeholder: 'e.g. 3-B48102 AA', required: true },
          { id: 'chassisNumber', label: 'Chassis / VIN Number', type: 'text', placeholder: '17-character VIN', required: true },
          { id: 'estimatedValueETB', label: 'Estimated Insured Value (ETB)', type: 'number', placeholder: '2500000', required: true }
        ]
      },
      {
        stepTitle: 'Usage & Driver History',
        fields: [
          { id: 'usageType', label: 'Vehicle Usage', type: 'select', options: [{ label: 'Private Personal', value: 'private' }, { label: 'Commercial Business', value: 'commercial' }], required: true },
          { id: 'priorClaimsLast3Years', label: 'Any claims in last 3 years?', type: 'boolean', defaultValue: false, required: true }
        ]
      }
    ],
    quotationConfiguration: {
      baseRateDescription: 'Official rating factor: 3.25% of vehicle insured value',
      standardMinimumPremiumETB: 4500,
      taxRatePercent: 15,
      stampDutyETB: 50,
      indicativeCalculationSample: 'Estimated Value * 0.0325 + 15% VAT + 50 ETB Stamp'
    },
    underwritingConfiguration: {
      requiresInspection: true,
      makerCheckerRequired: false,
      autoQuoteEligible: true,
      maxAutoQuoteAmountETB: 3500000
    },
    policyTemplateId: 'TPL-MTR-OFFICIAL-01',
    renewalConfiguration: {
      defaultTenureMonths: 12,
      gracePeriodDays: 14,
      reminderCadenceDays: [30, 14, 7, 0]
    },
    publicStatus: 'published',
    availability: 'online_and_operator',
    version: 1,
    createdBy: 'AIC-ADMIN-SYS',
    publishedAt: '2026-01-15T08:00:00Z',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    productId: 'PRD-TPL-02',
    slug: 'third-party-liability-insurance',
    productName: 'Compulsory Third-Party Road Liability Insurance',
    productCategory: 'liability',
    shortDescription: 'Mandatory statutory third-party bodily injury and property damage protection for all road users.',
    fullDescription: 'Statutory third-party road safety liability certificate meeting National Bank of Ethiopia and Federal Transport Authority compulsory motor vehicle requirements.',
    heroImage: '/assets/aic_fleet_logistics_1793894083707.jpg',
    disclaimer: OFFICIAL_DISCLAIMER,
    isDemonstration: false,
    benefits: [
      'Statutory third-party bodily injury & fatal accident indemnity',
      'Statutory third-party property damage coverage',
      'Instant QR-verifiable e-sticker and digital certificate issuance'
    ],
    coverageSections: [
      { title: 'Statutory Road Safety Coverage', description: 'Compensation for third-party medical and vehicle damage claims as stipulated by statutory road safety authority rules.', limitOrFormula: 'National statutory schedule' }
    ],
    exclusions: ['Damage to insured vehicle', 'Intentional or criminal acts'],
    eligibilityRules: ['Active vehicle registration in Ethiopia'],
    requiredDocuments: [
      { code: 'DOC_LIBRE', title: 'Vehicle Libre', description: 'Copy of vehicle ownership logbook', mandatory: true },
      { code: 'DOC_ID', title: 'Owner National ID', description: 'Copy of valid owner identification', mandatory: true }
    ],
    faq: [{ question: 'Is this compulsory for all motor vehicles operating in Ethiopia?', answer: 'Yes, Proclamation No. 799/2013 mandates third-party liability insurance for all motor vehicles operating on public roads in Ethiopia.' }],
    applicationSchema: [
      {
        stepTitle: 'Vehicle & Owner Details',
        fields: [
          { id: 'plateNumber', label: 'Plate Number', type: 'text', placeholder: 'e.g. 2-A91024 AA', required: true },
          { id: 'vehicleCategory', label: 'Vehicle Category', type: 'select', options: [{ label: 'Automobile (< 5 seats)', value: 'auto_small' }, { label: 'Minibus / Taxi', value: 'taxi' }, { label: 'Commercial Truck', value: 'truck' }], required: true }
        ]
      }
    ],
    quotationConfiguration: {
      baseRateDescription: 'Statutory tier: 1,800 ETB flat base rate',
      standardMinimumPremiumETB: 1800,
      taxRatePercent: 15,
      stampDutyETB: 50,
      indicativeCalculationSample: '1800 ETB + 15% VAT + 50 ETB Stamp'
    },
    underwritingConfiguration: {
      requiresInspection: false,
      makerCheckerRequired: false,
      autoQuoteEligible: true,
      maxAutoQuoteAmountETB: 50000
    },
    policyTemplateId: 'TPL-TPL-OFFICIAL-02',
    renewalConfiguration: {
      defaultTenureMonths: 12,
      gracePeriodDays: 7,
      reminderCadenceDays: [30, 14, 7, 0]
    },
    publicStatus: 'published',
    availability: 'online_and_operator',
    version: 1,
    createdBy: 'AIC-ADMIN-SYS',
    publishedAt: '2026-01-15T08:00:00Z',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z'
  },
  {
    productId: 'PRD-CMP-03',
    slug: 'commercial-fleet-motor-insurance',
    productName: 'Commercial Fleet & Heavy Truck Motor Insurance',
    productCategory: 'motor',
    shortDescription: 'Enterprise fleet protection covering cargo trucks, construction vehicles, and corporate passenger fleets.',
    fullDescription: 'Designed for transport operators, logistics fleets, and corporate enterprises requiring heavy equipment, multi-vehicle coverage, and goods-in-transit liability.',
    heroImage: '/assets/aic_fleet_logistics_1793894083707.jpg',
    disclaimer: OFFICIAL_DISCLAIMER,
    isDemonstration: false,
    benefits: [
      'Own damage, collision repair, and total loss replacement',
      'Theft, fire, flood, and atmospheric peril endorsements',
      'Authorized driver and co-driver personal accident coverage'
    ],
    coverageSections: [
      { title: 'Own Vehicle Protection', description: 'Comprehensive repairs or agreed replacement value following covered accidents or natural perils.', limitOrFormula: '100% of Agreed Insured Value' },
      { title: 'Passenger Medical Expense', description: 'Emergency medical expenses for authorized occupants.', limitOrFormula: 'Up to 25,000 ETB per occupant' }
    ],
    exclusions: ['Unattended vehicle with keys inside', 'Driver under intoxicating influence'],
    eligibilityRules: ['Vehicle under 15 years old since manufacture date', 'Commercial tracking device required for values over 5,000,000 ETB'],
    requiredDocuments: [
      { code: 'DOC_LIBRE', title: 'Vehicle Logbook', description: 'Official ownership logbook', mandatory: true },
      { code: 'DOC_PHOTOS', title: 'Vehicle Inspection Photos', description: '4-side photos of vehicle condition', mandatory: true }
    ],
    faq: [{ question: 'Can commercial fleets be rated with group volume discounts?', answer: 'Yes, enterprises managing 5 or more commercial vehicles qualify for customized fleet underwriting and tiered premium rebates.' }],
    applicationSchema: [
      {
        stepTitle: 'Vehicle Specifications',
        fields: [
          { id: 'vehicleMake', label: 'Make & Model', type: 'text', placeholder: 'e.g. Isuzu NPR Truck', required: true },
          { id: 'plateNumber', label: 'Plate Number', type: 'text', placeholder: '3-C19202 AA', required: true },
          { id: 'insuredValueETB', label: 'Sum Insured (ETB)', type: 'number', placeholder: '4500000', required: true },
          { id: 'hasAntiTheft', label: 'Has GPS Tracker installed?', type: 'boolean', defaultValue: true, required: true }
        ]
      }
    ],
    quotationConfiguration: {
      baseRateDescription: 'Commercial rating factor: 4.10% of insured vehicle sum',
      standardMinimumPremiumETB: 6500,
      taxRatePercent: 15,
      stampDutyETB: 50,
      indicativeCalculationSample: 'Insured Value * 0.041 + 15% VAT + 50 ETB Stamp'
    },
    underwritingConfiguration: {
      requiresInspection: true,
      makerCheckerRequired: true,
      autoQuoteEligible: false,
      maxAutoQuoteAmountETB: 10000000
    },
    policyTemplateId: 'TPL-CMP-OFFICIAL-03',
    renewalConfiguration: {
      defaultTenureMonths: 12,
      gracePeriodDays: 14,
      reminderCadenceDays: [30, 14, 7, 0]
    },
    publicStatus: 'published',
    availability: 'online_and_operator',
    version: 1,
    createdBy: 'AIC-ADMIN-SYS',
    publishedAt: '2026-01-16T08:00:00Z',
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-16T08:00:00Z'
  },
  {
    productId: 'PRD-FIR-04',
    slug: 'fire-and-lightning-insurance',
    productName: 'Standard Fire & Allied Perils Insurance',
    productCategory: 'property',
    shortDescription: 'Statutory structural fire and allied perils protection for residential, commercial, and industrial premises.',
    fullDescription: 'Protects physical buildings, machinery, and fixtures against fire, lightning, domestic gas explosions, storm, tempest, and water damage resulting from firefighting efforts.',
    heroImage: '/assets/aic_hero_addis_1793894081899.jpg',
    disclaimer: OFFICIAL_DISCLAIMER,
    isDemonstration: false,
    benefits: [
      'Structural rebuild and architectural reinstatement coverage',
      'Extinguishment and emergency municipal firefighting expense coverage',
      'Debris removal and site clearance allowance'
    ],
    coverageSections: [
      { title: 'Standard Fire & Lightning Perils', description: 'Direct physical loss caused by sudden uncontrolled fire or atmospheric lightning discharge.', limitOrFormula: 'Building reinstatement valuation' }
    ],
    exclusions: ['Arson by owner or willful misconduct', 'War, civil unrest, or nuclear explosion'],
    eligibilityRules: ['Permanent brick, stone, or reinforced concrete construction', 'Equipped with operational fire extinguisher'],
    requiredDocuments: [
      { code: 'DOC_TITLE', title: 'Property Ownership Deed / Leasehold', description: 'Official municipal title deed', mandatory: true },
      { code: 'DOC_VAL', title: 'Property Valuation Report', description: 'Certified engineer valuation within 24 months', mandatory: false }
    ],
    faq: [{ question: 'Can commercial tenants insure inventory and stock under this policy?', answer: 'Yes, tenants can insure stock-in-trade, furniture, fixtures, and business inventory independently of building ownership.' }],
    applicationSchema: [
      {
        stepTitle: 'Premises Profile',
        fields: [
          { id: 'buildingType', label: 'Occupancy Type', type: 'select', options: [{ label: 'Residential House', value: 'residential' }, { label: 'Commercial Retail / Office', value: 'commercial' }, { label: 'Industrial Warehouse', value: 'warehouse' }], required: true },
          { id: 'locationAddress', label: 'Premises Address', type: 'text', placeholder: 'Bole Sub-City, Woreda 03, House 412', required: true },
          { id: 'reinstatementValueETB', label: 'Building Reinstatement Value (ETB)', type: 'number', placeholder: '8000000', required: true }
        ]
      }
    ],
    quotationConfiguration: {
      baseRateDescription: 'Fire tariff factor: 0.18% of building valuation',
      standardMinimumPremiumETB: 3000,
      taxRatePercent: 15,
      stampDutyETB: 50,
      indicativeCalculationSample: 'Building Value * 0.0018 + 15% VAT + 50 ETB Stamp'
    },
    underwritingConfiguration: {
      requiresInspection: true,
      makerCheckerRequired: true,
      autoQuoteEligible: false,
      maxAutoQuoteAmountETB: 20000000
    },
    policyTemplateId: 'TPL-FIR-OFFICIAL-04',
    renewalConfiguration: {
      defaultTenureMonths: 12,
      gracePeriodDays: 30,
      reminderCadenceDays: [30, 14, 7, 0]
    },
    publicStatus: 'published',
    availability: 'online_and_operator',
    version: 1,
    createdBy: 'AIC-ADMIN-SYS',
    publishedAt: '2026-01-16T08:00:00Z',
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-16T08:00:00Z'
  },
  {
    productId: 'PRD-PRP-05',
    slug: 'property-all-risks-insurance',
    productName: 'Commercial Property & Industrial All Risks Insurance',
    productCategory: 'property',
    shortDescription: 'Comprehensive property protection covering physical structures, equipment, stock, and business assets.',
    fullDescription: 'All-risks asset protection tailored for manufacturing facilities, commercial real estate, corporate offices, and warehouses across Ethiopia.',
    heroImage: '/assets/aic_hero_addis_1793894081899.jpg',
    disclaimer: OFFICIAL_DISCLAIMER,
    isDemonstration: false,
    benefits: [
      'All-risks material damage and machinery protection',
      'Forcible burglary, robbery, and housebreaking cover',
      'Alternative accommodation or rent loss benefit'
    ],
    coverageSections: [
      { title: 'Commercial Property & Inventory', description: 'Loss or damage arising from accidental physical damage or violent entry theft.', limitOrFormula: 'Agreed asset schedule value' }
    ],
    exclusions: ['Unexplained inventory shrinkage', 'Normal wear and tear or gradual deterioration'],
    eligibilityRules: ['Functioning physical perimeter security and lockable premises'],
    requiredDocuments: [
      { code: 'DOC_ASSET_SCHED', title: 'Asset & Equipment Schedule', description: 'Itemized list of property and values', mandatory: true },
      { code: 'DOC_BIZ_LIC', title: 'Trade License', description: 'Renewed business license for commercial applicants', mandatory: true }
    ],
    faq: [{ question: 'What is the claims excess?', answer: 'Standard policy deductible is 2,500 ETB for non-theft claims and 5% for burglary claims, adjustable during underwriting.' }],
    applicationSchema: [
      {
        stepTitle: 'Asset Details',
        fields: [
          { id: 'businessTradeName', label: 'Business / Enterprise Name', type: 'text', placeholder: 'e.g. Abyssinia Trading PLC', required: true },
          { id: 'totalAssetValueETB', label: 'Total Declared Asset Value (ETB)', type: 'number', placeholder: '5000000', required: true },
          { id: 'securityGuardsOnSite', label: '24/7 Security Guarding on premises?', type: 'boolean', defaultValue: true, required: true }
        ]
      }
    ],
    quotationConfiguration: {
      baseRateDescription: 'Property tariff rate: 0.35% of total schedule value',
      standardMinimumPremiumETB: 5000,
      taxRatePercent: 15,
      stampDutyETB: 50,
      indicativeCalculationSample: 'Asset Value * 0.0035 + 15% VAT + 50 ETB Stamp'
    },
    underwritingConfiguration: {
      requiresInspection: true,
      makerCheckerRequired: true,
      autoQuoteEligible: false,
      maxAutoQuoteAmountETB: 15000000
    },
    policyTemplateId: 'TPL-PRP-OFFICIAL-05',
    renewalConfiguration: {
      defaultTenureMonths: 12,
      gracePeriodDays: 21,
      reminderCadenceDays: [30, 14, 7, 0]
    },
    publicStatus: 'published',
    availability: 'online_and_operator',
    version: 1,
    createdBy: 'AIC-ADMIN-SYS',
    publishedAt: '2026-01-17T08:00:00Z',
    createdAt: '2026-01-13T08:00:00Z',
    updatedAt: '2026-01-17T08:00:00Z'
  },
  {
    productId: 'PRD-MAR-06',
    slug: 'marine-cargo-transit-insurance',
    productName: 'Marine Cargo Transit Insurance (Import & Export)',
    productCategory: 'marine',
    shortDescription: 'International marine cargo transit coverage for sea, air, rail, and road shipments via Djibouti trade corridor.',
    fullDescription: 'Underwritten according to Institute Cargo Clauses (A/B/C) protecting import and export cargo from port of origin to final delivery at dry ports across Ethiopia.',
    heroImage: '/assets/aic_fleet_logistics_1793894083707.jpg',
    disclaimer: OFFICIAL_DISCLAIMER,
    isDemonstration: false,
    benefits: [
      'Institute Cargo Clauses (A) all-risks cargo indemnity',
      'Warehouse-to-warehouse multimodal coverage via Djibouti / Modjo',
      'General average and salvage charges contribution'
    ],
    coverageSections: [
      { title: 'Multimodal Transit Cargo', description: 'Physical loss or damage to cargo in transit including overturning, sinking, and collision.', limitOrFormula: '110% of CIF Invoice Value' }
    ],
    exclusions: ['Inherent vice or nature of the subject matter', 'Insufficient or improper packing of goods'],
    eligibilityRules: ['Letter of Credit (LC) or approved CAD financing document from National Bank of Ethiopia authorized bank'],
    requiredDocuments: [
      { code: 'DOC_COMM_INV', title: 'Commercial Invoice & Packing List', description: 'Supplier commercial invoice showing CIF terms', mandatory: true },
      { code: 'DOC_BL', title: 'Bill of Lading / Airway Bill', description: 'Clean shipped on board freight receipt', mandatory: true }
    ],
    faq: [{ question: 'Does this policy satisfy National Bank of Ethiopia import Letter of Credit (LC) requirements?', answer: 'Yes, Africa Insurance Company marine certificates fully comply with NBE foreign currency allocation directives and international trade financing standards.' }],
    applicationSchema: [
      {
        stepTitle: 'Shipment Particulars',
        fields: [
          { id: 'cargoDescription', label: 'Cargo Description', type: 'text', placeholder: 'e.g. Pharmaceutical raw materials', required: true },
          { id: 'originPort', label: 'Port of Loading', type: 'text', placeholder: 'e.g. Shanghai Port, China', required: true },
          { id: 'destinationPoint', label: 'Final Destination Dry Port', type: 'select', options: [{ label: 'Modjo Dry Port', value: 'modjo' }, { label: 'Kaliti Inland Container Depot', value: 'kaliti' }, { label: 'Dire Dawa Dry Port', value: 'diredawa' }], required: true },
          { id: 'cifValueETB', label: 'Declared CIF Cargo Value (ETB)', type: 'number', placeholder: '12000000', required: true }
        ]
      }
    ],
    quotationConfiguration: {
      baseRateDescription: 'Marine factor: 0.45% of 110% CIF valuation',
      standardMinimumPremiumETB: 7500,
      taxRatePercent: 15,
      stampDutyETB: 50,
      indicativeCalculationSample: '(CIF Value * 1.1) * 0.0045 + 15% VAT + 50 ETB Stamp'
    },
    underwritingConfiguration: {
      requiresInspection: false,
      makerCheckerRequired: true,
      autoQuoteEligible: false,
      maxAutoQuoteAmountETB: 30000000
    },
    policyTemplateId: 'TPL-MAR-OFFICIAL-06',
    renewalConfiguration: {
      defaultTenureMonths: 3,
      gracePeriodDays: 0,
      reminderCadenceDays: [14, 7, 0]
    },
    publicStatus: 'published',
    availability: 'online_and_operator',
    version: 1,
    createdBy: 'AIC-ADMIN-SYS',
    publishedAt: '2026-01-17T08:00:00Z',
    createdAt: '2026-01-13T08:00:00Z',
    updatedAt: '2026-01-17T08:00:00Z'
  },
  {
    productId: 'PRD-ENG-07',
    slug: 'contractors-all-risks-engineering',
    productName: 'Contractors All Risks & Machinery Breakdown Insurance',
    productCategory: 'engineering',
    shortDescription: 'Engineering risk insurance for civil construction projects, industrial plant machinery, and boilers.',
    fullDescription: 'Protects civil engineers, general contractors, and project developers against accidental physical damage to contract works, temporary works, and construction machinery.',
    heroImage: '/assets/aic_hero_addis_1793894081899.jpg',
    disclaimer: OFFICIAL_DISCLAIMER,
    isDemonstration: false,
    benefits: [
      'Full contract works material damage indemnity',
      'Construction plant, equipment, and crane cover',
      'Surrounding third-party bodily injury and property indemnity'
    ],
    coverageSections: [
      { title: 'Contract Works Material Damage', description: 'Accidental physical damage to permanent and temporary works during the contract period.', limitOrFormula: 'Full Contract Award Sum' }
    ],
    exclusions: ['Defective design or workmanship rectification cost', 'Cessation of work exceeding 30 continuous days without notice'],
    eligibilityRules: ['Valid contractor trade license and approved project contract with client employer'],
    requiredDocuments: [
      { code: 'DOC_CONTRACT', title: 'Awarded Construction Contract', description: 'Copy of contract agreement and Bill of Quantities', mandatory: true },
      { code: 'DOC_SITE_PLAN', title: 'Site Layout & Soil Test', description: 'General site layout engineering plan', mandatory: false }
    ],
    faq: [{ question: 'Can the policy include the mandatory post-completion maintenance defect period?', answer: 'Yes, standard policies can be extended with a 12-month or 24-month maintenance warranty period endorsement.' }],
    applicationSchema: [
      {
        stepTitle: 'Project Details',
        fields: [
          { id: 'projectName', label: 'Project Name & Description', type: 'text', placeholder: 'e.g. 5-Storey Mixed Commercial Plaza', required: true },
          { id: 'contractValueETB', label: 'Contract Award Value (ETB)', type: 'number', placeholder: '45000000', required: true },
          { id: 'contractDurationMonths', label: 'Estimated Construction Period (Months)', type: 'number', placeholder: '18', required: true }
        ]
      }
    ],
    quotationConfiguration: {
      baseRateDescription: 'Engineering tariff: 0.55% of contract works sum',
      standardMinimumPremiumETB: 15000,
      taxRatePercent: 15,
      stampDutyETB: 100,
      indicativeCalculationSample: 'Contract Value * 0.0055 + 15% VAT + 100 ETB Stamp'
    },
    underwritingConfiguration: {
      requiresInspection: true,
      makerCheckerRequired: true,
      autoQuoteEligible: false,
      maxAutoQuoteAmountETB: 50000000
    },
    policyTemplateId: 'TPL-ENG-OFFICIAL-07',
    renewalConfiguration: {
      defaultTenureMonths: 18,
      gracePeriodDays: 30,
      reminderCadenceDays: [60, 30, 14, 0]
    },
    publicStatus: 'published',
    availability: 'online_and_operator',
    version: 1,
    createdBy: 'AIC-ADMIN-SYS',
    publishedAt: '2026-01-18T08:00:00Z',
    createdAt: '2026-01-14T08:00:00Z',
    updatedAt: '2026-01-18T08:00:00Z'
  },
  {
    productId: 'PRD-PAC-08',
    slug: 'personal-accident-life-insurance',
    productName: 'Group & Individual Personal Accident Insurance',
    productCategory: 'personal',
    shortDescription: '24-hour worldwide personal accident, accidental death, and permanent total disablement protection.',
    fullDescription: 'Lump-sum financial compensation to individuals, corporate employee groups, and families following accidental bodily injury anywhere in Ethiopia or worldwide.',
    heroImage: '/assets/aic_family_protection_1793894083687.jpg',
    disclaimer: OFFICIAL_DISCLAIMER,
    isDemonstration: false,
    benefits: [
      'Accidental death capital lump-sum compensation to designated beneficiaries',
      'Continental scale permanent total disability payouts up to 100%',
      'Weekly temporary disablement and hospitalization allowance'
    ],
    coverageSections: [
      { title: 'Capital Benefit: Death & Permanent Disablement', description: 'Lump-sum compensation following accidental bodily injury occurring anywhere in Ethiopia or worldwide.', limitOrFormula: '100% of Selected Capital Sum' },
      { title: 'Accident Medical Reimbursement', description: 'Direct hospitalization and medication reimbursement following a covered accident.', limitOrFormula: 'Up to 50,000 ETB per incident' }
    ],
    exclusions: ['Pre-existing physical infirmity', 'Extreme aviation sports or military service operations'],
    eligibilityRules: ['Ages 18 to 65 years at time of policy entry', 'Resident of Ethiopia'],
    requiredDocuments: [
      { code: 'DOC_ID', title: 'National ID / Passport', description: 'Valid government issued identity document', mandatory: true },
      { code: 'DOC_BENEF', title: 'Beneficiary Designation Form', description: 'Signed designation of legal heirs', mandatory: true }
    ],
    faq: [{ question: 'Can employers arrange group coverage for their entire workforce?', answer: 'Yes, Group Personal Accident (GPA) policies provide scaled corporate underwriting based on employee payroll and occupational risk tiers.' }],
    applicationSchema: [
      {
        stepTitle: 'Applicant Profile & Coverage Tier',
        fields: [
          { id: 'occupationRiskClass', label: 'Occupation Risk Group', type: 'select', options: [{ label: 'Class 1: Administrative / Office Professional', value: 'class1' }, { label: 'Class 2: Supervisory / Field Engineer', value: 'class2' }, { label: 'Class 3: Construction / Industrial Work', value: 'class3' }], required: true },
          { id: 'capitalSumETB', label: 'Desired Capital Protection Sum (ETB)', type: 'select', options: [{ label: '500,000 ETB Capital Sum', value: '500000' }, { label: '1,000,000 ETB Capital Sum', value: '1000000' }, { label: '2,500,000 ETB Capital Sum', value: '2500000' }], required: true },
          { id: 'beneficiaryFullName', label: 'Primary Beneficiary Full Name', type: 'text', placeholder: 'e.g. Almaz Tadesse', required: true }
        ]
      }
    ],
    quotationConfiguration: {
      baseRateDescription: 'Actuarial rating: 0.22% of selected capital benefit',
      standardMinimumPremiumETB: 1200,
      taxRatePercent: 15,
      stampDutyETB: 50,
      indicativeCalculationSample: 'Capital Sum * 0.0022 + 15% VAT + 50 ETB Stamp'
    },
    underwritingConfiguration: {
      requiresInspection: false,
      makerCheckerRequired: false,
      autoQuoteEligible: true,
      maxAutoQuoteAmountETB: 2500000
    },
    policyTemplateId: 'TPL-PAC-OFFICIAL-08',
    renewalConfiguration: {
      defaultTenureMonths: 12,
      gracePeriodDays: 14,
      reminderCadenceDays: [30, 14, 7, 0]
    },
    publicStatus: 'published',
    availability: 'online_and_operator',
    version: 1,
    createdBy: 'AIC-ADMIN-SYS',
    publishedAt: '2026-01-18T08:00:00Z',
    createdAt: '2026-01-14T08:00:00Z',
    updatedAt: '2026-01-18T08:00:00Z'
  },
  {
    productId: 'PRD-TRV-09',
    slug: 'international-travel-assistance-insurance',
    productName: 'International Travel Medical Assistance Insurance',
    productCategory: 'personal',
    shortDescription: 'Visa-compliant international travel health insurance covering Schengen, Middle East, and worldwide journeys.',
    fullDescription: 'Guaranteed embassy-approved medical expense coverage, emergency medical evacuation, repatriation of remains, and baggage assistance for travelers departing Ethiopia.',
    heroImage: '/assets/aic_family_protection_1793894083687.jpg',
    disclaimer: OFFICIAL_DISCLAIMER,
    isDemonstration: false,
    benefits: [
      'EUR 30,000 minimum medical coverage complying with Schengen embassy requirements',
      '24/7 global emergency medical assistance and medical evacuation',
      'Checked baggage delay, trip cancellation, and repatriation cover'
    ],
    coverageSections: [
      { title: 'Emergency Medical & Hospitalization', description: 'In-patient hospital treatment, outpatient consultations, and prescribed emergency medications abroad.', limitOrFormula: 'Equivalent of EUR 30,000' }
    ],
    exclusions: ['Traveling against medical advice', 'Medical tourism or elective cosmetic procedures abroad'],
    eligibilityRules: ['Ethiopian passport holder or legal foreign resident departing from Ethiopia'],
    requiredDocuments: [
      { code: 'DOC_PASSPORT', title: 'Passport Bio Page', description: 'Valid passport with at least 6 months remaining validity', mandatory: true },
      { code: 'DOC_FLIGHT', title: 'Confirmed Flight Itinerary', description: 'Roundtrip flight reservation booking', mandatory: true }
    ],
    faq: [{ question: 'Is this certificate accepted by European Schengen and worldwide embassies in Addis Ababa?', answer: 'Yes, AIC travel insurance certificates are formally registered and recognized by all diplomatic missions and consular visa offices in Ethiopia.' }],
    applicationSchema: [
      {
        stepTitle: 'Journey Details',
        fields: [
          { id: 'destinationRegion', label: 'Travel Destination', type: 'select', options: [{ label: 'Schengen Area (Europe)', value: 'schengen' }, { label: 'Middle East & Gulf Countries', value: 'middle_east' }, { label: 'Worldwide (excl. USA/Canada)', value: 'worldwide' }], required: true },
          { id: 'departureDate', label: 'Departure Date', type: 'date', required: true },
          { id: 'returnDate', label: 'Return Date', type: 'date', required: true },
          { id: 'passportNumber', label: 'Passport Number', type: 'text', placeholder: 'EP1234567', required: true }
        ]
      }
    ],
    quotationConfiguration: {
      baseRateDescription: 'Travel rating factor: 95 ETB per day of travel duration',
      standardMinimumPremiumETB: 1500,
      taxRatePercent: 15,
      stampDutyETB: 50,
      indicativeCalculationSample: '(Duration Days * 95 ETB) + 15% VAT + 50 ETB Stamp'
    },
    underwritingConfiguration: {
      requiresInspection: false,
      makerCheckerRequired: false,
      autoQuoteEligible: true,
      maxAutoQuoteAmountETB: 200000
    },
    policyTemplateId: 'TPL-TRV-OFFICIAL-09',
    renewalConfiguration: {
      defaultTenureMonths: 1,
      gracePeriodDays: 0,
      reminderCadenceDays: [3, 0]
    },
    publicStatus: 'published',
    availability: 'online_and_operator',
    version: 1,
    createdBy: 'AIC-ADMIN-SYS',
    publishedAt: '2026-01-19T08:00:00Z',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-19T08:00:00Z'
  },
  {
    productId: 'PRD-BIZ-10',
    slug: 'business-multi-peril-commercial-package',
    productName: 'Business Multi-Peril Commercial Package Insurance',
    productCategory: 'business',
    shortDescription: 'Integrated enterprise package combining commercial property, public liability, and cash-in-transit.',
    fullDescription: 'Convenient multi-peril commercial protection package tailored for Ethiopian retailers, hospitality venues, private clinics, and distribution warehouses.',
    heroImage: '/assets/aic_hero_addis_1793894081899.jpg',
    disclaimer: OFFICIAL_DISCLAIMER,
    isDemonstration: false,
    benefits: [
      'Combined property, inventory, and electrical machinery protection',
      'Premises public liability and customer safety indemnity',
      'Cash-in-safe and money-in-transit security cover'
    ],
    coverageSections: [
      { title: 'Commercial Premises & Stock', description: 'Fire, storm, flood, and water damage to business premises and stored merchandise.', limitOrFormula: 'Declared commercial stock value' },
      { title: 'Public & Product Liability', description: 'Legal defense and indemnification for third-party injury claims occurring on premises.', limitOrFormula: '1,000,000 ETB per occurrence' }
    ],
    exclusions: ['Commercial financial losses due to market price fluctuation', 'Employee dishonesty without fidelity guarantee endorsement'],
    eligibilityRules: ['Registered business enterprise with valid Ministry of Trade license and Tax Identification Number (TIN)'],
    requiredDocuments: [
      { code: 'DOC_TRADE_LIC', title: 'Commercial Registration & Trade License', description: 'Current renewed license copy', mandatory: true },
      { code: 'DOC_TIN', title: 'TIN Certificate', description: 'Official tax registration certificate', mandatory: true }
    ],
    faq: [{ question: 'Can seasonal inventory peaks be adjusted dynamically?', answer: 'Yes, commercial policyholders can submit endorsement declarations to increase stock coverage limits during peak trading seasons.' }],
    applicationSchema: [
      {
        stepTitle: 'Enterprise Information',
        fields: [
          { id: 'companyLegalName', label: 'Company / Business Registered Name', type: 'text', placeholder: 'e.g. Entoto Coffee Roasters PLC', required: true },
          { id: 'tinNumber', label: 'Tax Identification Number (TIN)', type: 'text', placeholder: '10-digit TIN', required: true },
          { id: 'businessSector', label: 'Sector / Activity', type: 'select', options: [{ label: 'Retail & Distribution', value: 'retail' }, { label: 'Food, Beverage & Hospitality', value: 'hospitality' }, { label: 'Light Manufacturing & Assembly', value: 'manufacturing' }, { label: 'Professional / Tech Services', value: 'services' }], required: true },
          { id: 'annualTurnoverETB', label: 'Estimated Annual Turnover (ETB)', type: 'number', placeholder: '10000000', required: true }
        ]
      }
    ],
    quotationConfiguration: {
      baseRateDescription: 'Commercial package rate: 0.48% of declared equipment & inventory',
      standardMinimumPremiumETB: 8500,
      taxRatePercent: 15,
      stampDutyETB: 100,
      indicativeCalculationSample: 'Asset Value * 0.0048 + 15% VAT + 100 ETB Stamp'
    },
    underwritingConfiguration: {
      requiresInspection: true,
      makerCheckerRequired: true,
      autoQuoteEligible: false,
      maxAutoQuoteAmountETB: 25000000
    },
    policyTemplateId: 'TPL-BIZ-OFFICIAL-10',
    renewalConfiguration: {
      defaultTenureMonths: 12,
      gracePeriodDays: 30,
      reminderCadenceDays: [30, 14, 7, 0]
    },
    publicStatus: 'published',
    availability: 'online_and_operator',
    version: 1,
    createdBy: 'AIC-ADMIN-SYS',
    publishedAt: '2026-01-20T08:00:00Z',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-20T08:00:00Z'
  }
];

export const SEED_CUSTOMERS: CustomerProfile[] = [
  {
    customerId: 'CUST-001',
    authUid: 'usr-cust-001',
    customerNumber: 'AIC-CUST-2026-00101',
    customerType: 'individual',
    personalInformation: {
      title: 'Ato',
      fullName: 'Abebe Tadesse Kebede',
      dateOfBirth: '1984-06-12',
      gender: 'Male',
      idType: 'national_id',
      idNumberMasked: 'ETH-****-7819',
      tinNumber: '0049281921',
      occupation: 'Civil Engineer'
    },
    contactInformation: {
      primaryPhone: '+251 91 123 4567',
      email: 'abebe.tadesse@example.et',
      preferredLanguage: 'amharic'
    },
    address: {
      subcityOrZone: 'Bole',
      woreda: '04',
      kebeleOrHouseNo: 'House 812',
      city: 'Addis Ababa',
      region: 'Addis Ababa'
    },
    identityVerificationStatus: 'verified',
    accountStatus: 'active',
    registrationChannel: 'self_service',
    branchId: 'BR-BOLE',
    createdAt: '2026-01-22T09:30:00Z',
    updatedAt: '2026-02-10T14:15:00Z'
  },
  {
    customerId: 'CUST-002',
    authUid: 'usr-cust-002',
    customerNumber: 'AIC-CUST-2026-00102',
    customerType: 'individual',
    personalInformation: {
      title: 'W/ro',
      fullName: 'Selamawit Girma Desta',
      dateOfBirth: '1991-11-04',
      gender: 'Female',
      idType: 'national_id',
      idNumberMasked: 'ETH-****-3391',
      occupation: 'Medical Doctor'
    },
    contactInformation: {
      primaryPhone: '+251 92 234 5678',
      email: 'selamawit.girma@example.et',
      preferredLanguage: 'english'
    },
    address: {
      subcityOrZone: 'Kirkos',
      woreda: '02',
      city: 'Addis Ababa',
      region: 'Addis Ababa'
    },
    identityVerificationStatus: 'verified',
    accountStatus: 'active',
    registrationChannel: 'assisted_operator',
    createdByOperatorId: 'OP-001',
    branchId: 'BR-ADDIS-HQ',
    createdAt: '2026-02-01T11:00:00Z',
    updatedAt: '2026-02-01T11:00:00Z'
  }
];

export const SEED_OPERATORS: OperatorProfile[] = [
  {
    operatorId: 'OP-001',
    authUid: 'usr-op-001',
    name: 'Yonas Berhanu Haile',
    email: 'yonas.operator@africainsurance.et',
    phone: '+251 91 188 9900',
    branchId: 'BR-ADDIS-HQ',
    supervisorId: 'STAFF-UW-01',
    assignedProducts: ['PRD-MTR-01', 'PRD-TPL-02', 'PRD-CMP-03', 'PRD-PAC-08', 'PRD-TRV-09'],
    accountStatus: 'active',
    trainingStatus: 'certified',
    performanceSummary: {
      totalAssistedOnboarded: 48,
      totalApplicationsSubmitted: 42,
      totalPoliciesIssued: 38,
      complianceScorePct: 98
    },
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z'
  },
  {
    operatorId: 'OP-002',
    authUid: 'usr-op-002',
    name: 'Bethlehem Alemu Kassaye',
    email: 'bethlehem.operator@africainsurance.et',
    phone: '+251 92 344 5566',
    branchId: 'BR-BOLE',
    supervisorId: 'STAFF-UW-01',
    assignedProducts: ['PRD-MTR-01', 'PRD-TPL-02', 'PRD-FIR-04', 'PRD-BIZ-10'],
    accountStatus: 'active',
    trainingStatus: 'in_progress',
    performanceSummary: {
      totalAssistedOnboarded: 19,
      totalApplicationsSubmitted: 16,
      totalPoliciesIssued: 14,
      complianceScorePct: 92
    },
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-02-20T10:00:00Z'
  }
];

export const SEED_STAFF: StaffProfile[] = [
  {
    staffId: 'STAFF-UW-01',
    authUid: 'usr-staff-uw',
    name: 'Kassahun Worku Teshome',
    email: 'kassahun.underwriting@africainsurance.et',
    role: 'underwriter',
    department: 'underwriting',
    branchId: 'BR-ADDIS-HQ',
    permissions: ['review_application', 'prepare_quotation', 'approve_underwriting', 'issue_policy'],
    accountStatus: 'active',
    createdAt: '2025-11-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z'
  },
  {
    staffId: 'STAFF-ADM-01',
    authUid: 'usr-admin-01',
    name: 'Eleni Hailu Gebremedhin',
    email: 'eleni.admin@africainsurance.et',
    role: 'admin',
    department: 'operations',
    branchId: 'BR-ADDIS-HQ',
    permissions: ['all_access', 'manage_users', 'manage_products', 'manage_settings', 'view_audit_logs'],
    accountStatus: 'active',
    createdAt: '2025-10-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z'
  }
];

export const SEED_POLICIES: InsurancePolicy[] = [
  {
    policyId: 'POL-2026-001',
    policyNumber: 'AIC/MTR/2026/004812',
    verificationCode: 'AIC-VRF-8924-K92X',
    verificationCodeHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    customerId: 'CUST-001',
    customerName: 'Abebe Tadesse Kebede',
    customerPhone: '+251 91 123 4567',
    maskedInsuredName: 'A*** T*** K***',
    productId: 'PRD-MTR-01',
    productName: 'Private Motor Vehicle Comprehensive Insurance',
    productVersion: 1,
    applicationId: 'APP-2026-001',
    quotationId: 'QUO-2026-001',
    paymentReference: 'CHAPA-TX-991823',
    insuredSubject: 'Toyota Hilux Double Cab (Plate: 3-B48102 AA / Chassis: JTEBU29J3810294)',
    coverageSummary: [
      'Accidental collision & own damage up to 2,500,000 ETB',
      'Statutory road safety third-party liability',
      'Towing & roadside assistance allowance'
    ],
    exclusionsSummary: [
      'Unlicensed driver operation',
      'Operating beyond registered borders without cross-border pass'
    ],
    totalPremiumETB: 85275,
    currency: 'ETB',
    startDate: '2026-02-01',
    expiryDate: '2027-01-31',
    policyStatus: 'active',
    policyDocumentId: 'DOC-POL-001',
    certificateDocumentId: 'DOC-CERT-001',
    preparedBy: 'STAFF-UW-01',
    reviewedBy: 'STAFF-UW-01',
    approvedBy: 'STAFF-ADM-01',
    digitalSignatureRef: 'AIC-SIG-SHA256-499102-SECURE',
    issuedAt: '2026-02-01T15:20:00Z',
    createdAt: '2026-02-01T15:20:00Z',
    updatedAt: '2026-02-01T15:20:00Z'
  },
  {
    policyId: 'POL-2026-002',
    policyNumber: 'AIC/PAC/2026/001190',
    verificationCode: 'AIC-VRF-3381-M74Q',
    verificationCodeHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    customerId: 'CUST-002',
    customerName: 'Selamawit Girma Desta',
    customerPhone: '+251 92 234 5678',
    maskedInsuredName: 'S*** G*** D***',
    productId: 'PRD-PAC-08',
    productName: 'Group & Individual Personal Accident Insurance',
    productVersion: 1,
    applicationId: 'APP-2026-002',
    quotationId: 'QUO-2026-002',
    paymentReference: 'CHAPA-TX-992410',
    insuredSubject: 'Personal 24-Hour Capital Safeguard — 1,000,000 ETB Capital Sum',
    coverageSummary: [
      'Accidental death capital lump-sum 1,000,000 ETB',
      'Permanent total disability up to 100% schedule',
      'Emergency accident hospitalization reimbursement up to 50,000 ETB'
    ],
    exclusionsSummary: [
      'Pre-existing physical impairment',
      'Extreme unauthorized high-altitude sports'
    ],
    totalPremiumETB: 2580,
    currency: 'ETB',
    startDate: '2026-02-05',
    expiryDate: '2027-02-04',
    policyStatus: 'active',
    policyDocumentId: 'DOC-POL-002',
    certificateDocumentId: 'DOC-CERT-002',
    preparedBy: 'STAFF-UW-01',
    reviewedBy: 'STAFF-UW-01',
    approvedBy: 'STAFF-ADM-01',
    digitalSignatureRef: 'AIC-SIG-SHA256-881290-SECURE',
    issuedAt: '2026-02-05T10:15:00Z',
    createdAt: '2026-02-05T10:15:00Z',
    updatedAt: '2026-02-05T10:15:00Z'
  },
  {
    policyId: 'POL-2025-EXP',
    policyNumber: 'AIC/MTR/2025/000984',
    verificationCode: 'AIC-VRF-1092-EXP7',
    verificationCodeHash: 'c22b5f9178342609428d6f51b2c5af4c0bde6a42ab4541ac9fc3ecd88390be53',
    customerId: 'CUST-001',
    customerName: 'Abebe Tadesse Kebede',
    customerPhone: '+251 91 123 4567',
    maskedInsuredName: 'A*** T*** K***',
    productId: 'PRD-MTR-01',
    productName: 'Private Motor Vehicle Comprehensive Insurance',
    productVersion: 1,
    applicationId: 'APP-2025-001',
    quotationId: 'QUO-2025-001',
    paymentReference: 'CHAPA-TX-881230',
    insuredSubject: 'Suzuki Dzire (Plate: 2-B31980 AA)',
    coverageSummary: ['Previous term third-party & accidental damage'],
    exclusionsSummary: ['General statutory exclusions'],
    totalPremiumETB: 42000,
    currency: 'ETB',
    startDate: '2025-01-10',
    expiryDate: '2026-01-09',
    policyStatus: 'expired',
    policyDocumentId: 'DOC-POL-EXP',
    preparedBy: 'STAFF-UW-01',
    reviewedBy: 'STAFF-UW-01',
    approvedBy: 'STAFF-ADM-01',
    issuedAt: '2025-01-10T09:00:00Z',
    createdAt: '2025-01-10T09:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z'
  }
];

export const SEED_APPLICATIONS: InsuranceApplication[] = [
  {
    applicationId: 'APP-2026-003',
    applicationNumber: 'AIC-APP-2026-00319',
    customerId: 'CUST-002',
    customerName: 'Selamawit Girma Desta',
    productId: 'PRD-FIR-04',
    productName: 'Standard Fire & Allied Perils Insurance',
    productVersion: 1,
    applicantInformation: {
      fullName: 'Selamawit Girma Desta',
      phone: '+251 92 234 5678',
      email: 'selamawit.girma@example.et',
      address: 'Kirkos Sub-City, Woreda 02, House 491, Addis Ababa'
    },
    applicationAnswers: {
      buildingType: 'residential',
      locationAddress: 'Kirkos Sub-City, Woreda 02, House 491',
      reinstatementValueETB: 7500000
    },
    uploadedDocumentIds: ['DOC-UPLOAD-01', 'DOC-UPLOAD-02'],
    applicationStatus: 'under_review',
    assignedOfficerId: 'STAFF-UW-01',
    assignedOfficerName: 'Kassahun Worku',
    branchId: 'BR-ADDIS-HQ',
    registrationChannel: 'self_service',
    createdAt: '2026-02-18T14:00:00Z',
    submittedAt: '2026-02-18T14:15:00Z',
    updatedAt: '2026-02-19T09:00:00Z'
  }
];

export const SEED_TRAINING_COURSES: TrainingCourse[] = [
  {
    courseId: 'CRS-001',
    title: 'AIC Direct-Sales Operator Onboarding & Code of Conduct',
    description: 'Core regulatory training on customer authorization, ethical sales practices, data protection, and anti-fraud protocols.',
    audience: 'operator',
    required: true,
    passScorePct: 80,
    status: 'published',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
    lessons: [
      {
        lessonId: 'LES-01',
        title: '01. Regulatory Standards & National Bank of Ethiopia Directives',
        durationMinutes: 20,
        content: `As an authorized Africa Insurance Company (AIC) direct-sales representative, your actions directly bind the institution. Every customer interaction must uphold transparency, fairness, and strict compliance with the National Bank of Ethiopia Insurance Business Proclamation. You must never misrepresent policy coverage, omit exclusions, or make oral commitments that contradict written policy wordings.`
      },
      {
        lessonId: 'LES-02',
        title: '02. Customer Consent & Assisted Registration Rules',
        durationMinutes: 25,
        content: `Assisted registration exists to expand insurance access to Ethiopian citizens and enterprise owners. You MUST obtain explicit, documented customer consent before creating or submitting records on their behalf. You may never substitute your personal telephone or email for the customer's legitimate contact information. The customer remains the exclusive owner of their insurance contract.`
      },
      {
        lessonId: 'LES-03',
        title: '03. Document Integrity, KYC & Anti-Fraud Procedures',
        durationMinutes: 25,
        content: `All uploaded identification, vehicle logbooks (Libre), trade licenses, and asset valuation certificates must be verified against original documents. Document forgery, tampering, or submitting unverified photographs is a severe violation resulting in immediate account revocation and regulatory reporting.`
      }
    ],
    assessmentQuestions: [
      {
        question: 'When performing an assisted customer registration, what is required before creating the account?',
        options: [
          'Explicit customer consent or documented authorization record',
          'Only the operator supervisor oral approval',
          'No consent is needed as long as national ID is available',
          'Only a verbal phone call without records'
        ],
        correctIndex: 0
      },
      {
        question: 'Can an operator enter their own phone number as the customer primary contact number?',
        options: [
          'Yes, if the customer is busy',
          'Strictly prohibited; the customer must have their own contact details',
          'Allowed for the first 30 days only',
          'Yes, if authorized by branch manager'
        ],
        correctIndex: 1
      },
      {
        question: 'What happens when an operator is suspended by administration?',
        options: [
          'Their historical records are permanently deleted',
          'Their access is immediately blocked while all historical attributions remain intact',
          'They can still issue policies through other branches',
          'Their customer accounts are automatically cancelled'
        ],
        correctIndex: 1
      }
    ]
  },
  {
    courseId: 'CRS-002',
    title: 'Motor Underwriting & Vehicle Inspection Fundamentals',
    description: 'Technical guidance on vehicle classification, chassis validation, inspection guidelines, and risk factors.',
    audience: 'operator',
    required: true,
    passScorePct: 80,
    status: 'published',
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
    lessons: [
      {
        lessonId: 'LES-04',
        title: '01. Vehicle Categories & Libre Verification',
        durationMinutes: 30,
        content: `Understand the distinctions between Code 2 (Commercial/Freight), Code 3 (Private Passenger), and public transport codes in Ethiopia. Ensure vehicle chassis numbers on the physical vehicle match the official logbook exactly.`
      }
    ],
    assessmentQuestions: [
      {
        question: 'Which document is mandatory to confirm vehicle legal ownership in Ethiopia?',
        options: [
          'Vehicle Logbook (Libre)',
          'Fuel coupon receipt',
          'Driver parking ticket',
          'General business card'
        ],
        correctIndex: 0
      }
    ]
  }
];

export const SEED_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    templateId: 'TPL-EML-WELCOME',
    templateName: 'Customer Welcome & Verification',
    category: 'transactional',
    subject: 'Welcome to Africa Insurance Company (AIC) — Verify Your Account',
    htmlBody: `<p>Dear {{customerName}},</p><p>Welcome to Africa Insurance Company (AIC). Your digital insurance portal account is ready. Please click the link below to confirm your contact details.</p>`,
    textBody: `Dear {{customerName}},\n\nWelcome to Africa Insurance Company (AIC). Please verify your account.`,
    variables: ['customerName', 'verificationUrl'],
    version: 1,
    status: 'active',
    preparedBy: 'STAFF-ADM-01',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    templateId: 'TPL-EML-APP-SUBMITTED',
    templateName: 'Application Received Confirmation',
    category: 'transactional',
    subject: 'AIC Application Received: {{applicationNumber}}',
    htmlBody: `<p>Dear {{customerName}},</p><p>We have received your application for {{productName}} (Ref: {{applicationNumber}}). Our underwriting team will review your submission.</p>`,
    textBody: `Dear {{customerName}},\n\nWe have received your application for {{productName}} (Ref: {{applicationNumber}}).`,
    variables: ['customerName', 'productName', 'applicationNumber'],
    version: 1,
    status: 'active',
    preparedBy: 'STAFF-ADM-01',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    templateId: 'TPL-EML-POLICY-ISSUED',
    templateName: 'E-Policy Issuance & Digital Certificate',
    category: 'transactional',
    subject: 'Your Official AIC Insurance Policy Has Been Issued: {{policyNumber}}',
    htmlBody: `<p>Dear {{customerName}},</p><p>Congratulations. Your policy {{policyNumber}} for {{productName}} has been formally approved and issued. Your verification code is: <strong>{{verificationCode}}</strong>.</p>`,
    textBody: `Dear {{customerName}},\n\nYour policy {{policyNumber}} has been issued. Verification code: {{verificationCode}}.`,
    variables: ['customerName', 'policyNumber', 'productName', 'verificationCode', 'expiryDate'],
    version: 1,
    status: 'active',
    preparedBy: 'STAFF-ADM-01',
    updatedAt: '2026-01-10T08:00:00Z'
  },
  {
    templateId: 'TPL-EML-RENEWAL-30D',
    templateName: 'Policy Renewal Reminder (30 Days Before Expiry)',
    category: 'renewal_reminder',
    subject: 'Policy Renewal Notice — 30 Days Remaining: {{policyNumber}}',
    htmlBody: `<p>Dear {{customerName}},</p><p>This is a courtesy reminder that your policy {{policyNumber}} will expire on {{expiryDate}}. You may renew online via your customer portal to ensure uninterrupted protection.</p>`,
    textBody: `Dear {{customerName}},\n\nYour policy {{policyNumber}} expires on {{expiryDate}}. Please renew online.`,
    variables: ['customerName', 'policyNumber', 'expiryDate', 'renewalPortalUrl'],
    version: 1,
    status: 'active',
    preparedBy: 'STAFF-ADM-01',
    updatedAt: '2026-01-10T08:00:00Z'
  }
];

export const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    auditId: 'AUD-001',
    actorUid: 'usr-admin-01',
    actorName: 'Eleni Hailu (Administrator)',
    actorRole: 'admin',
    action: 'SYSTEM_INITIALIZATION',
    resourceType: 'product',
    resourceId: 'ALL-PRODUCTS',
    branchId: 'BR-ADDIS-HQ',
    timestamp: '2026-01-15T08:00:00Z',
    reason: 'Initial platform bootstrap and 10 statutory insurance products published',
    correlationId: 'INIT-TRACE-001'
  },
  {
    auditId: 'AUD-002',
    actorUid: 'usr-staff-uw',
    actorName: 'Kassahun Worku (Underwriter)',
    actorRole: 'underwriter',
    action: 'POLICY_ISSUED',
    resourceType: 'policy',
    resourceId: 'POL-2026-001',
    branchId: 'BR-ADDIS-HQ',
    timestamp: '2026-02-01T15:20:00Z',
    reason: 'Underwriting approved, Chapa payment confirmed, policy certificate issued with unique verification code',
    correlationId: 'POL-ISSUE-TRACE-4812'
  },
  {
    auditId: 'AUD-003',
    actorUid: 'usr-op-001',
    actorName: 'Yonas Berhanu (Operator)',
    actorRole: 'operator',
    action: 'CUSTOMER_REGISTERED_BY_OPERATOR',
    resourceType: 'customer',
    resourceId: 'CUST-002',
    branchId: 'BR-ADDIS-HQ',
    timestamp: '2026-02-01T11:00:00Z',
    reason: 'Assisted registration executed with signed customer consent',
    correlationId: 'OP-ONBOARD-TRACE-002'
  }
];

export const SEED_ADMIN_DOCUMENTS: AdminUploadedDocument[] = [
  {
    id: 'DOC-MTR-01-WORDING',
    title: 'Private Motor Vehicle Comprehensive Policy Wording & Schedule',
    productId: 'PRD-MTR-01',
    productName: 'Private Motor Vehicle Comprehensive Insurance',
    category: 'policy_wording',
    fileType: 'pdf',
    fileSize: '1.4 MB',
    uploadDate: '2026-01-15',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Underwriting & Claims Directorate (Head Office)',
    description: 'Official standard policy terms, conditions, own-damage limits, and third-party liabilities approved under National Bank of Ethiopia insurance directives.',
    contentSummary: 'Complete terms covering accidental collision, overturning, fire, explosion, theft, and third-party liabilities. Includes towing charges and emergency roadside assistance.',
    sections: [
      {
        heading: 'Section 1 — Own Damage & Accidental Collision',
        body: 'The Company will indemnify the Insured against loss of or damage to the Motor Vehicle, its accessories, and spare parts whilst thereon by accidental collision or overturning, fire, external explosion, self-ignition, lightning, burglary, housebreaking, or theft, malicious acts, and whilst in transit by road or rail within Ethiopia.'
      },
      {
        heading: 'Section 2 — Third-Party Liability',
        body: 'The Company will indemnify the Insured in the event of an accident caused by or arising out of the use of the Motor Vehicle against all sums which the Insured shall become legally liable to pay in respect of death of or bodily injury to any person and damage to property.'
      },
      {
        heading: 'Section 3 — Towing & Vehicle Safeguard Allowances',
        body: 'If the Motor Vehicle is disabled by reason of loss or damage covered under this Policy, the Company will bear the reasonable cost of protection and removal to the nearest competent repairer.'
      }
    ]
  },
  {
    id: 'DOC-MTR-01-PROPOSAL',
    title: 'Private Motor Insurance Proposal & Physical Inspection Form',
    productId: 'PRD-MTR-01',
    productName: 'Private Motor Vehicle Comprehensive Insurance',
    category: 'proposal_form',
    fileType: 'pdf',
    fileSize: '680 KB',
    uploadDate: '2026-01-16',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Underwriting Directorate (Head Office)',
    description: 'Mandatory underwriting questionnaire and physical inspection rubric required for private passenger automobile intake.',
    contentSummary: 'Contains vehicle particulars, chassis verification, registered Libre validation, and four-angle photo verification checklist.',
    sections: [
      {
        heading: 'Part A — Applicant Identification & Vehicle Registration',
        body: 'Enter full legal name, Taxpayer Identification Number (if corporate), National ID / Passport number, vehicle plate number, engine serial, and 17-character VIN chassis number as verified against the official Libre.'
      },
      {
        heading: 'Part B — Physical Vehicle Inspection Rubric',
        body: 'Authorized AIC surveyor or accredited inspection garage must verify windshield integrity, tire tread depth, odometer reading, prior repaired impacts, and existing mechanical body condition.'
      }
    ]
  },
  {
    id: 'DOC-MTR-01-CLAIM',
    title: 'Motor Accident Claim Notification & Garage Settlement Guide',
    productId: 'PRD-MTR-01',
    productName: 'Private Motor Vehicle Comprehensive Insurance',
    category: 'claim_guide',
    fileType: 'pdf',
    fileSize: '920 KB',
    uploadDate: '2026-01-18',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Claims Department (Head Office)',
    description: 'Step-by-step guidance for notifying motor accidents, obtaining traffic police reports, surveyor assignment, and authorized garage repair authorization.',
    contentSummary: 'Detailed claims workflow with phone numbers for 24/7 accident helplines, list of AIC preferred garages in Addis Ababa, and required document checklist.',
    sections: [
      {
        heading: 'Step 1 — Immediate On-Site Notification',
        body: 'Do not move the vehicle unless directed by traffic police officers. Call AIC 24/7 central dispatch (+251 11 663 7716) immediately to log your accident notification.'
      },
      {
        heading: 'Step 2 — Police Report & Damage Survey',
        body: 'Obtain the official Traffic Police sketch and report. An AIC certified automobile surveyor will inspect the vehicle either at the site or at an accredited recovery yard within 24 hours.'
      },
      {
        heading: 'Step 3 — Settlement & Preferred Garages',
        body: 'Upon approval of repair estimate, AIC issues direct payment guarantee to the repairer, minimizing out-of-pocket costs to policy deductible.'
      }
    ]
  },
  {
    id: 'DOC-TPL-02-TARIFF',
    title: 'Compulsory Third-Party Motor Road Liability Statutory Tariff & Schedule',
    productId: 'PRD-TPL-02',
    productName: 'Compulsory Third-Party Road Liability Insurance',
    category: 'tariff_table',
    fileType: 'pdf',
    fileSize: '520 KB',
    uploadDate: '2026-01-12',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Legal & Regulatory Directorate',
    description: 'Official statutory premium rates and liability limits established under Ethiopian Federal Proclamation No. 799/2013 and Council of Ministers Regulations.',
    contentSummary: 'Contains vehicle classification tariff tables (automobiles, taxis, buses, commercial freight, agricultural tractors) and statutory victim compensation schedules.',
    sections: [
      {
        heading: 'Statutory Authority & Mandate',
        body: 'In accordance with Proclamation No. 799/2013, all motor vehicles operating on public roads across the Federal Democratic Republic of Ethiopia must hold valid third-party liability insurance.'
      },
      {
        heading: 'Statutory Indemnity Limits',
        body: 'Covers bodily injury, emergency medical treatment costs, total or partial permanent disability, and fatal injury compensation as prescribed in the national insurance schedule.'
      }
    ]
  },
  {
    id: 'DOC-CMP-03-WORDING',
    title: 'Commercial Fleet & Heavy Logistics Truck Master Policy Schedule',
    productId: 'PRD-CMP-03',
    productName: 'Commercial Fleet & Heavy Truck Motor Insurance',
    category: 'policy_wording',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    uploadDate: '2026-01-20',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Commercial Fleet Underwriting Division',
    description: 'Enterprise master policy schedule for commercial logistics fleets, dry port transit trucks, and heavy construction equipment.',
    contentSummary: 'Comprehensive multi-vehicle schedule, goods-in-transit liability, cross-border Djibouti transit endorsements, and fleet volume rebate clauses.',
    sections: [
      {
        heading: 'Section 1 — Multi-Vehicle Fleet Coverage',
        body: 'Applies to scheduled commercial vehicles operating within Ethiopia and designated cross-border trade corridors with active carrier endorsements.'
      },
      {
        heading: 'Section 2 — Driver & Crew Personal Accident Endorsement',
        body: 'Provides 24/7 personal accident protection for registered drivers, co-drivers, and cargo escorts during commercial transit operations.'
      }
    ]
  },
  {
    id: 'DOC-FIR-04-WORDING',
    title: 'Standard Fire & Allied Perils Policy Wording & General Conditions',
    productId: 'PRD-FIR-04',
    productName: 'Standard Fire & Allied Perils Insurance',
    category: 'policy_wording',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-01-14',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Property & Industrial Underwriting Directorate',
    description: 'Comprehensive policy wording covering physical buildings, civil structures, inventory, and fixtures against fire, lightning, and allied atmospheric perils.',
    contentSummary: 'Standard fire definitions, covered allied perils (explosion, storm, flood, bursting of pipes), excluded causes, and reinstatement value basis rules.',
    sections: [
      {
        heading: 'Perils Insured Under Standard Schedule',
        body: 'Direct physical loss or damage caused by fire, lightning, explosion of gas or boilers used for domestic purposes, aircraft impact, riot, and strike.'
      },
      {
        heading: 'Basis of Settlement & Reinstatement',
        body: 'Settlement calculated upon the cost of replacing or reinstating property of the same kind or type in a condition substantially equal to, but not better than, its condition when new.'
      }
    ]
  },
  {
    id: 'DOC-FIR-04-CLAIM',
    title: 'Fire & Property Claim Notification Form & Assessment Checklist',
    productId: 'PRD-FIR-04',
    productName: 'Standard Fire & Allied Perils Insurance',
    category: 'claim_guide',
    fileType: 'pdf',
    fileSize: '740 KB',
    uploadDate: '2026-01-19',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Claims Department (Head Office)',
    description: 'Intake document and forensic loss evidence checklist required following property damage, structural fire, or industrial loss.',
    contentSummary: 'Instructions on immediate salvage efforts, municipal fire department report submission, stock register records, and loss adjuster assignment.',
    sections: [
      {
        heading: 'Immediate Post-Fire Action',
        body: 'Safeguard unaffected property without endangering life. Notify AIC Claims Department within 48 hours of occurrence.'
      },
      {
        heading: 'Mandatory Documentation',
        body: 'Submit fire brigade official report, forensic police certificate, itemized statement of lost or damaged property, and pre-loss inventory records.'
      }
    ]
  },
  {
    id: 'DOC-PRP-05-WORDING',
    title: 'Commercial Property & Industrial All Risks Policy Specifications',
    productId: 'PRD-PRP-05',
    productName: 'Commercial Property & Industrial All Risks Insurance',
    category: 'policy_wording',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    uploadDate: '2026-01-18',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Property & Engineering Directorate',
    description: 'Full all-risks policy specification for manufacturing plants, corporate towers, and commercial retail establishments.',
    contentSummary: 'All-risks material damage, machinery breakdown indemnity, burglary and armed robbery protection, and business interruption endorsements.',
    sections: [
      {
        heading: 'All-Risks Insuring Agreement',
        body: 'Indemnifies against sudden, unforeseen, and accidental physical loss or damage to property from any cause other than those specifically excluded.'
      },
      {
        heading: 'Burglary & Forcible Entry Endorsement',
        body: 'Covers theft involving forcible and violent entry into or exit from premises, or armed robbery assault on duty staff.'
      }
    ]
  },
  {
    id: 'DOC-MAR-06-WORDING',
    title: 'Marine Cargo Transit Insurance (Institute Cargo Clauses A) Policy Wording',
    productId: 'PRD-MAR-06',
    productName: 'Marine Cargo Transit Insurance (Import & Export)',
    category: 'policy_wording',
    fileType: 'pdf',
    fileSize: '1.6 MB',
    uploadDate: '2026-01-15',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Marine & Aviation Underwriting Directorate',
    description: 'Authoritative multimodal marine cargo policy schedule incorporating international Institute of London Underwriters Cargo Clauses (A).',
    contentSummary: 'Warehouse-to-warehouse transit coverage, sea transport, rail freight, dry port clearance, general average contributions, and salvage expenses.',
    sections: [
      {
        heading: 'Institute Cargo Clauses (A) Scope',
        body: 'All-risks indemnity covering total and partial loss of or damage to the insured cargo during maritime, rail, and highway multimodal transit.'
      },
      {
        heading: 'Transit Duration (Warehouse to Warehouse)',
        body: 'Insurance attaches from the time goods leave the warehouse at port of origin and continues until delivery to the consignee warehouse or dry port in Ethiopia.'
      }
    ]
  },
  {
    id: 'DOC-MAR-06-CLAIM',
    title: 'Marine Cargo Survey & Dry Port Claims Settlement Procedure',
    productId: 'PRD-MAR-06',
    productName: 'Marine Cargo Transit Insurance (Import & Export)',
    category: 'claim_guide',
    fileType: 'pdf',
    fileSize: '890 KB',
    uploadDate: '2026-01-20',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Marine Claims Directorate',
    description: 'Protocol for conducting joint dry port container inspections at Modjo, Kaliti, or Dire Dawa, and expediting import cargo claims.',
    contentSummary: 'Cargo discharge notice, maritime tally sheet verification, customs declaration filing, and joint surveyor inspection guidelines.',
    sections: [
      {
        heading: 'Inspection at Customs Dry Port',
        body: 'If shipping container seal is broken or external damage is visible, request immediate joint survey with Ethiopian Customs and AIC marine inspector.'
      }
    ]
  },
  {
    id: 'DOC-ENG-07-WORDING',
    title: 'Contractors All Risks (CAR) Engineering Policy Specification',
    productId: 'PRD-ENG-07',
    productName: 'Contractors All Risks & Machinery Breakdown Insurance',
    category: 'policy_wording',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-01-17',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Engineering & Construction Directorate',
    description: 'Standard civil works and engineering project policy terms meeting Ethiopian Roads Administration (ERA) and Ministry of Urban Development standards.',
    contentSummary: 'Contract works material damage, temporary works, contractor plant and machinery (CPM), third-party surrounding liability, and maintenance period warranty.',
    sections: [
      {
        heading: 'Section 1 — Material Damage to Contract Works',
        body: 'Covers physical loss or damage to permanent and temporary civil works, construction materials, and scaffolding on site during project execution.'
      },
      {
        heading: 'Section 2 — Third-Party Liability',
        body: 'Indemnifies against legal liability arising from accidental bodily injury to third parties or accidental damage to property occurring on or adjacent to site.'
      }
    ]
  },
  {
    id: 'DOC-PAC-08-WORDING',
    title: 'Group & Individual Personal Accident Policy Wordings & Disability Scales',
    productId: 'PRD-PAC-08',
    productName: 'Group & Individual Personal Accident Insurance',
    category: 'policy_wording',
    fileType: 'pdf',
    fileSize: '1.1 MB',
    uploadDate: '2026-01-15',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Life & Personal Lines Directorate',
    description: '24-hour worldwide personal accident terms, accidental death capital benefits, permanent disability continental scale, and medical expenses.',
    contentSummary: 'Capital payout formulas, beneficiary designation rules, weekly temporary disablement allowances, and medical reimbursement procedures.',
    sections: [
      {
        heading: 'Capital Sum Benefits',
        body: '100% payout of capital sum in the event of accidental death or permanent total disability, payable directly to designated beneficiaries or the insured.'
      },
      {
        heading: 'Continental Scale of Permanent Disability',
        body: 'Standard actuarial percentage payouts for loss of limbs, sight, hearing, or permanent functional impairment resulting from accidental injury.'
      }
    ]
  },
  {
    id: 'DOC-TRV-09-WORDING',
    title: 'International Travel Medical Assistance Policy Schedule (Schengen Compliant)',
    productId: 'PRD-TRV-09',
    productName: 'International Travel Medical Assistance Insurance',
    category: 'policy_wording',
    fileType: 'pdf',
    fileSize: '1.3 MB',
    uploadDate: '2026-01-18',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Life & International Services Department',
    description: 'Official travel assistance certificate terms guaranteeing EUR 30,000 emergency medical assistance recognized by all foreign embassies in Ethiopia.',
    contentSummary: 'Emergency medical expenses abroad, international assistance network helpline, medical repatriation of remains, and baggage delay compensation.',
    sections: [
      {
        heading: 'Schengen & Worldwide Embassy Compliance',
        body: 'Guarantees minimum EUR 30,000 emergency hospitalization and repatriation coverage required for Schengen and global visa applications.'
      },
      {
        heading: '24/7 International Medical Assistance Helpline',
        body: 'Direct cashless hospital admission coordination through AIC worldwide emergency assistance network.'
      }
    ]
  },
  {
    id: 'DOC-BIZ-10-WORDING',
    title: 'Business Multi-Peril Commercial Package Master Agreement',
    productId: 'PRD-BIZ-10',
    productName: 'Business Multi-Peril Commercial Package Insurance',
    category: 'policy_wording',
    fileType: 'pdf',
    fileSize: '1.9 MB',
    uploadDate: '2026-01-20',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Commercial SME Directorate',
    description: 'Comprehensive business package combining property damage, public liability, business interruption, and cash-in-safe protection.',
    contentSummary: 'All-in-one package designed for commercial enterprises, private clinics, restaurants, distributors, and retailers across Ethiopian cities.',
    sections: [
      {
        heading: 'Section 1 — Commercial Premises & Inventory',
        body: 'Protection for building contents, merchandise, and machinery against fire, storm, water, and forcible burglary.'
      },
      {
        heading: 'Section 2 — Public & Products Liability',
        body: 'Legal liability indemnity for customer injuries, slip-and-fall incidents, or property damage occurring within business premises.'
      }
    ]
  },
  {
    id: 'DOC-CORP-BROCHURE-2026',
    title: 'Africa Insurance Company Master Corporate Products & Services Brochure',
    productId: 'all',
    productName: 'All General & Life Insurance Lines',
    category: 'brochure',
    fileType: 'pdf',
    fileSize: '3.8 MB',
    uploadDate: '2026-01-22',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Marketing & Corporate Communications',
    description: 'Comprehensive institutional overview of Africa Insurance Company S.C., underwriting capabilities, branch networks, and digital services.',
    contentSummary: '30-year corporate heritage, executive governance, financial solvency highlights, and complete overview of general and life insurance product suites.',
    sections: [
      {
        heading: 'Corporate Overview & Financial Solidity',
        body: 'Established on December 8, 1994, Africa Insurance Company S.C. operates over 35 branches and contact offices across Ethiopia with over ETB 603 million in paid-up capital.'
      },
      {
        heading: 'Digital Underwriting & Rapid E-Policy Issuance',
        body: 'State-of-the-art policy management platform with instant QR verification and integrated digital payment gateway options.'
      }
    ]
  },
  {
    id: 'DOC-NBE-REGULATORY-FILING',
    title: 'National Bank of Ethiopia Statutory Solvency & License Certification',
    productId: 'all',
    productName: 'All General & Life Insurance Lines',
    category: 'regulatory_filing',
    fileType: 'pdf',
    fileSize: '850 KB',
    uploadDate: '2026-01-10',
    version: '2026.1',
    isPublic: true,
    uploadedBy: 'Legal & Compliance Directorate',
    description: 'Official statutory compliance disclosure and licensing certificate issued under National Bank of Ethiopia Proclamation No. 86/1994.',
    contentSummary: 'Official insurer registration details, composite general and life insurance operating license, and actuarial solvency reserve validation.',
    sections: [
      {
        heading: 'Statutory Licensing Authority',
        body: 'Africa Insurance Company S.C. is an authorized composite insurer licensed and regulated by the National Bank of Ethiopia pursuant to the Licensing and Supervision of Insurance Business Proclamation.'
      }
    ]
  }
];
