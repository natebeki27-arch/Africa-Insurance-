import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { getDestinationForAccount } from '../../services/authService';
import { useLanguage } from '../../i18n/LanguageContext';
import { 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Building2, 
  Car, 
  HeartHandshake, 
  Anchor, 
  HardHat, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  Phone
} from 'lucide-react';
import { ResponsiveImage, getCategoryCoverImage, getPosterImageUrl } from '../../components/ResponsiveImage';

interface HomePageProps {
  navigate: (route: string) => void;
}

interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  description: string;
  tabLabel: string;
  category: string;
  bgImage: string;
  bgVideo?: string;
  bgType?: 'video' | 'image';
  bgAlt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    badge: 'Committed to Excellence and Quality Services · Est. Dec 8, 1994',
    title: 'Committed to Excellence and Quality Services',
    description: 'Africa Insurance Company (AIC) S.C. combines three decades of financial solvency, over ETB 603 million in paid-up capital, and authoritative protection for Ethiopian families and national enterprises.',
    tabLabel: '01 · Corporate Excellence',
    category: 'Institutional Solvency',
    bgImage: '/assets/aic_hero_addis_1793894081899.jpg',
    bgType: 'image',
    bgAlt: 'Addis Ababa Financial District and Africa Insurance Company Head Office'
  },
  {
    id: 2,
    badge: 'AIC Motor Insurance Division · Nationwide Coverage',
    title: 'Comprehensive Motor & Fleet Risk Protection for Ethiopian Roads',
    description: 'End-to-end risk underwriting for private vehicles, commercial trucks, passenger transport, and national freight fleets along the Djibouti corridor with 24/7 emergency claims assistance.',
    tabLabel: '02 · Motor & Fleets',
    category: 'Motor & Transport',
    bgImage: '/assets/city_traffic_poster.jpg',
    bgVideo: '/assets/city_traffic_alive.mp4',
    bgType: 'video',
    bgAlt: 'Living Ethiopian Highway Traffic and Logistics Transport'
  },
  {
    id: 3,
    badge: 'Commercial Property & Industrial Risk Solutions',
    title: 'Safeguarding Manufacturing Plants, Warehouses & Real Estate',
    description: 'Comprehensive fire, lightning, earthquake, explosion, and business interruption policies protecting industrial complexes, agro-processing facilities, and commercial buildings across all regions.',
    tabLabel: '03 · Fire & Property',
    category: 'Fire & Property',
    bgImage: '/assets/aic_property_industrial_1794050067051.jpg',
    bgType: 'image',
    bgAlt: 'Industrial Manufacturing Complex and Warehouse Distribution Facility'
  },
  {
    id: 4,
    badge: 'Maritime Transit & Port Cargo Underwriting · Djibouti Corridor',
    title: 'Marine Cargo & Hull Insurance for National Import & Export',
    description: 'Robust transit coverage safeguarding sea freight, air shipments, and container transit from international dispatch to Modjo Dry Port and customs clearing terminals across Ethiopia.',
    tabLabel: '04 · Marine Cargo',
    category: 'Marine & Logistics',
    bgImage: '/assets/aic_marine_cargo_port_1794050066638.jpg',
    bgType: 'image',
    bgAlt: 'Commercial Maritime Container Terminal and Cargo Vessel Operations'
  },
  {
    id: 5,
    badge: 'Group Life, Healthcare & Employee Welfare Schemes',
    title: 'Institutional Life, Medical & Workmen’s Compensation',
    description: 'Customized employee healthcare plans, group personal accident indemnities, and statutory employer liability schemes securing enterprise workforce well-being and family financial security.',
    tabLabel: '05 · Life & Health',
    category: 'Life & Medical',
    bgImage: '/assets/aic_healthcare_medical_1794050066647.jpg',
    bgType: 'image',
    bgAlt: 'Modern Healthcare Clinic and Medical Team in Ethiopia'
  }
];

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  policyType: string;
  policyCode: string;
  avatarUrl: string;
  avatarInitials: string;
  rating: number;
  quote: string;
  tenure: string;
  category: 'motor' | 'property' | 'marine' | 'life';
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Dawit Alemayehu',
    role: 'Managing Director',
    company: 'Rift Valley Logistics S.C.',
    location: 'Addis Ababa',
    policyType: 'Commercial Motor Fleet & Transit',
    policyCode: 'AIC-VRF-8924-K92X',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'DA',
    rating: 5,
    quote: 'AIC’s fleet underwriting and instant digital verification give our cross-border logistics team total confidence along the Djibouti corridor. Claims in Adama were settled in 48 hours without delays.',
    tenure: '7 yrs with AIC',
    category: 'motor'
  },
  {
    id: 2,
    name: 'Dr. Bethlehem Tefera',
    role: 'Founder & Chief Medical Officer',
    company: 'Ethio-Care Clinics Network',
    location: 'Hawassa',
    policyType: 'Fire & Commercial Property',
    policyCode: 'AIC-VRF-7120-P44M',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'BT',
    rating: 5,
    quote: 'Operating three regional diagnostic centers requires ironclad property protection. AIC tailored our fire and specialized medical equipment coverage to our exact clinical needs.',
    tenure: '4 yrs with AIC',
    category: 'property'
  },
  {
    id: 3,
    name: 'Yohannes Bekele',
    role: 'Operations Director',
    company: 'Blue Nile Agro-Industries',
    location: 'Bahir Dar',
    policyType: 'Industrial All-Risks & Machinery',
    policyCode: 'AIC-VRF-4901-B12N',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'YB',
    rating: 5,
    quote: 'The digital e-policy platform makes renewing our processing plant’s annual coverage seamless. Having tamper-evident SHA-256 codes allowed our bank to confirm our insured status immediately.',
    tenure: '9 yrs with AIC',
    category: 'property'
  },
  {
    id: 4,
    name: 'Samrawit Gebremedhin',
    role: 'VP Human Capital',
    company: 'Pioneer Tech Ethiopia',
    location: 'Addis Ababa',
    policyType: 'Group Life & Medical Welfare',
    policyCode: 'AIC-VRF-3382-L89G',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'SG',
    rating: 5,
    quote: 'We onboarded 280 team members onto AIC’s Group Personal Accident and Medical scheme. Staff submit outpatient receipts directly from phones with rapid reimbursement.',
    tenure: '3 yrs with AIC',
    category: 'life'
  },
  {
    id: 5,
    name: 'Mulugeta Assefa',
    role: 'General Manager & Hauler',
    company: 'Dire Express Transport',
    location: 'Dire Dawa',
    policyType: 'Goods in Transit & Commercial Truck',
    policyCode: 'AIC-VRF-6219-M55K',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'MA',
    rating: 5,
    quote: 'As an independent freight hauler carrying grain and steel across the eastern corridor, traffic checkpoints verify my AIC certificate in seconds via code, preventing highway delays.',
    tenure: '5 yrs with AIC',
    category: 'motor'
  },
  {
    id: 6,
    name: 'Asegedech Wolde',
    role: 'Commercial Director',
    company: 'Sheba Textiles Mill',
    location: 'Hawassa Industrial Park',
    policyType: 'Industrial Fire & Perils',
    policyCode: 'AIC-VRF-9912-T77A',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'AW',
    rating: 5,
    quote: 'Operating inside Hawassa Industrial Park requires strict compliance with international buyer safety audits. AIC’s comprehensive perils policy satisfied European apparel buyers immediately.',
    tenure: '6 yrs with AIC',
    category: 'property'
  },
  {
    id: 7,
    name: 'Girma Tadesse',
    role: 'Head of Clearing & Logistics',
    company: 'Modjo Dry Port Freight Agency',
    location: 'Modjo',
    policyType: 'Marine Cargo & Container Transit',
    policyCode: 'AIC-VRF-1845-C62J',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'GT',
    rating: 5,
    quote: 'Managing thousands of shipping containers from Djibouti port to Modjo dry terminal demands instant transit cover notes. Africa Insurance’s automated platform generates verifiable e-policies on demand.',
    tenure: '8 yrs with AIC',
    category: 'marine'
  },
  {
    id: 8,
    name: 'Dr. Selamawit Hailu',
    role: 'Chief Surgeon & Board Member',
    company: 'Red Sea Specialty Clinic',
    location: 'Adama',
    policyType: 'Professional Medical Indemnity',
    policyCode: 'AIC-VRF-5534-H81R',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813633-825590987c67?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'SH',
    rating: 5,
    quote: 'Our specialist surgical department relies on AIC for professional liability and medical indemnity. Their claims team understands clinical procedures and provides reassuring defense coverage.',
    tenure: '5 yrs with AIC',
    category: 'life'
  },
  {
    id: 9,
    name: 'Tewodros Kebede',
    role: 'Chief Civil Engineer',
    company: 'Abyssinia Engineering & Construction',
    location: 'Addis Ababa',
    policyType: 'Contractors All Risks (CAR)',
    policyCode: 'AIC-VRF-8109-E33K',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'TK',
    rating: 5,
    quote: 'We insured our 14-story commercial tower project under AIC’s Contractors All-Risks policy. Third-party liability and heavy machinery coverage were transparent and fairly priced.',
    tenure: '4 yrs with AIC',
    category: 'property'
  },
  {
    id: 10,
    name: 'Meron Hailemariam',
    role: 'Managing Director',
    company: 'Highlands Organic Coffee Exporters',
    location: 'Jimma',
    policyType: 'Marine Cargo Transit & Warehousing',
    policyCode: 'AIC-VRF-2761-W90Q',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'MH',
    rating: 5,
    quote: 'Exporting specialty Yirgacheffe and Jimma coffee beans to German roasters requires unbroken transit coverage. AIC covers our road haulage and sea voyage with zero documentation friction.',
    tenure: '6 yrs with AIC',
    category: 'marine'
  },
  {
    id: 11,
    name: 'Berhanu Mengistu',
    role: 'Fleet Safety Director',
    company: 'Oromia Passenger Bus Lines',
    location: 'Debre Zeit',
    policyType: 'Public Service Vehicle (PSV) Motor',
    policyCode: 'AIC-VRF-4402-B78V',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'BM',
    rating: 5,
    quote: 'With over 45 inter-city buses connecting central and southern Ethiopia, passenger liability and vehicle comprehensive insurance are essential. AIC has been our trusted partner since 2017.',
    tenure: '9 yrs with AIC',
    category: 'motor'
  },
  {
    id: 12,
    name: 'Hiwot Mengesha',
    role: 'Supply Chain Manager',
    company: 'Awash Agro-Bottling Works',
    location: 'Addis Ababa',
    policyType: 'Machinery Breakdown & Perils',
    policyCode: 'AIC-VRF-6378-A19F',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'HM',
    rating: 5,
    quote: 'When a turbine failure halted our bottling line, AIC’s industrial engineers arrived on site the next morning. Consequential loss coverage helped us maintain payroll during machine repair.',
    tenure: '5 yrs with AIC',
    category: 'property'
  },
  {
    id: 13,
    name: 'Kassahun Belay',
    role: 'Senior Plant Manager',
    company: 'Rift Valley Cement Industries',
    location: 'Dire Dawa',
    policyType: 'Heavy Industrial Equipment & Perils',
    policyCode: 'AIC-VRF-3914-R52D',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'KB',
    rating: 5,
    quote: 'Heavy quarrying machinery and kilns represent tens of millions of Birr in enterprise value. Africa Insurance’s engineering underwriters provided custom loss prevention guidance.',
    tenure: '7 yrs with AIC',
    category: 'property'
  },
  {
    id: 14,
    name: 'Rahel Alemayehu',
    role: 'Chief Financial Officer',
    company: 'Entoto FinTech Systems',
    location: 'Addis Ababa',
    policyType: 'Group Life & Executive Health',
    policyCode: 'AIC-VRF-7840-E21T',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'RA',
    rating: 5,
    quote: 'Attracting senior software talent in Ethiopia requires top-tier medical and group life protection. AIC’s cashless clinic network in Addis makes employee healthcare stress-free.',
    tenure: '4 yrs with AIC',
    category: 'life'
  },
  {
    id: 15,
    name: 'Solomon Desta',
    role: 'Managing Partner',
    company: 'Desta & Sons Heavy Excavation',
    location: 'Gondar',
    policyType: 'Heavy Plant, Machinery & Motor Commercial',
    policyCode: 'AIC-VRF-1198-D64S',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'SD',
    rating: 5,
    quote: 'Our bulldozers and heavy excavators operate in rugged terrain across Amhara region. AIC’s fast claims response and authorized garage repair network kept our downtime minimal.',
    tenure: '8 yrs with AIC',
    category: 'motor'
  },
  {
    id: 16,
    name: 'Tigist Worku',
    role: 'Managing Director',
    company: 'Horizon Horticultural Exporters',
    location: 'Bishoftu',
    policyType: 'Cold-Chain Air Cargo & Transit',
    policyCode: 'AIC-VRF-8547-H99X',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    avatarInitials: 'TW',
    rating: 5,
    quote: 'Exporting delicate fresh-cut roses via Ethiopian Cargo to European auction markets requires strict temperature-controlled transit policies. AIC understands perishable cold-chain logistics.',
    tenure: '6 yrs with AIC',
    category: 'marine'
  }
];

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const publishedProducts = store.getPublishedProducts();
  const { t } = useLanguage();

  // 1. Hero Slidable Showcase State (5 Slides from africainsurancesc.com)
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);

  // Auto-advance hero slides every 5.0 seconds
  useEffect(() => {
    if (isHeroPaused) return;
    const interval = setInterval(() => {
      setCurrentSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHeroPaused]);

  const handleNextHero = () => {
    setCurrentSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevHero = () => {
    setCurrentSlideIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // 2. Customer Testimonials Carousel State (16 items, 4 visible at once)
  const [selectedTestimonialCategory, setSelectedTestimonialCategory] = useState<string>('all');
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);

  // Filter testimonials by category if selected
  const filteredTestimonials = selectedTestimonialCategory === 'all'
    ? TESTIMONIALS
    : TESTIMONIALS.filter(t => t.category === selectedTestimonialCategory);

  const totalPages = Math.ceil(filteredTestimonials.length / 4);

  // Auto-advance testimonial pages every 5.0 seconds
  useEffect(() => {
    if (isTestimonialPaused || totalPages <= 1) return;
    const interval = setInterval(() => {
      setCurrentTestimonialPage((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(interval);
  }, [isTestimonialPaused, totalPages]);

  const handleNextTestimonial = () => {
    setCurrentTestimonialPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevTestimonial = () => {
    setCurrentTestimonialPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleTestimonials = filteredTestimonials.slice(
    currentTestimonialPage * 4,
    (currentTestimonialPage + 1) * 4
  );

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'motor': return <Car className="w-5 h-5 text-[#12366e]" />;
      case 'property': return <Building2 className="w-5 h-5 text-[#12366e]" />;
      case 'marine': return <Anchor className="w-5 h-5 text-[#12366e]" />;
      case 'engineering': return <HardHat className="w-5 h-5 text-[#12366e]" />;
      case 'personal': return <HeartHandshake className="w-5 h-5 text-[#12366e]" />;
      default: return <FileText className="w-5 h-5 text-[#12366e]" />;
    }
  };

  const activeSlide = HERO_SLIDES[currentSlideIdx];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SECTION 1: HERO SECTION WITH LIVING BACKGROUND MATCHING EACH SLIDE */}
      <section className="relative bg-gradient-to-br from-[#0e2a58] via-[#12366e] to-[#184486] text-white overflow-hidden">
        {/* Dynamic Living Visual for each typography slide */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HERO_SLIDES.map((slide, idx) => {
            const isSlideActive = idx === currentSlideIdx;
            if (idx !== 0 && !isSlideActive) {
              return null;
            }
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isSlideActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {slide.bgType === 'video' ? (
                  <>
                    <ResponsiveImage
                      src={slide.bgImage}
                      alt={slide.bgAlt}
                      priority={isSlideActive}
                      sizes="100vw"
                      className="w-full h-full object-cover object-center scale-105 transition-transform duration-7000 ease-out"
                    />
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="none"
                      poster={getPosterImageUrl(slide.bgImage)}
                      className="hidden md:block absolute inset-0 w-full h-full object-cover object-center scale-105 pointer-events-none"
                    >
                      {slide.bgVideo && <source src={slide.bgVideo} type="video/mp4" />}
                      <source src="/assets/city_traffic_alive.mp4" type="video/mp4" />
                      <source src="/assets/city_traffic_alive.webm" type="video/webm" />
                    </video>
                  </>
                ) : (
                  <ResponsiveImage
                    src={slide.bgImage}
                    alt={slide.bgAlt}
                    priority={idx === 0}
                    sizes="100vw"
                    className="w-full h-full object-cover object-center scale-105 transition-transform duration-7000 ease-out"
                  />
                )}
              </div>
            );
          })}

          {/* Lighter corporate sapphire blue overlay */}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#12366e]/80 via-[#184486]/62 to-[#1f56a6]/35 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-radial from-transparent via-[#184486]/15 to-[#12366e]/35 pointer-events-none" />
        </div>

        {/* Left Screen Navigation Button (Slide Prev) */}
        <button
          onClick={handlePrevHero}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/35 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl group cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Right Screen Navigation Button (Slide Next) */}
        <button
          onClick={handleNextHero}
          aria-label="Next slide"
          className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 active:bg-white/35 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-2xl group cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Selected Hero Content Container (Centered 5-Slide Typography Showcases) */}
        <div 
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
          className="relative z-10 max-w-7xl mx-auto px-12 sm:px-16 lg:px-24 py-14 sm:py-28 lg:py-36 flex flex-col justify-center min-h-[380px] sm:min-h-[560px] lg:min-h-[640px]"
        >
          {/* Top Active Slide Typography & Content with Smooth 5s Transition Effect */}
          <div 
            key={activeSlide.id}
            className="max-w-3xl space-y-4 sm:space-y-6 [text-shadow:_0_2px_12px_rgba(0,0,0,0.35)] transition-all duration-700 ease-in-out animate-in fade-in slide-in-from-bottom-2"
          >
            {/* Main Dynamic Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] sm:leading-[1.08] text-balance font-sans transition-all duration-500">
              {t(`hero.slide${activeSlide.id}.title`, activeSlide.title)}
            </h1>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-lg text-slate-100 leading-relaxed font-sans font-normal tracking-[-0.011em] max-w-2xl transition-all duration-500 line-clamp-3 sm:line-clamp-none">
              {t(`hero.slide${activeSlide.id}.desc`, activeSlide.description)}
            </p>

            {/* Action Button: Get Started */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button
                onClick={() => {
                  const currentUser = store.getCurrentUser();
                  if (currentUser) {
                    navigate(getDestinationForAccount(currentUser));
                  } else {
                    navigate('/login');
                  }
                }}
                className="bg-white hover:bg-slate-100 text-slate-900 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold tracking-tight transition-all shadow-lg hover:shadow-xl flex items-center gap-2 sm:gap-2.5 group whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t('hero.getStarted')}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Sleek Minimalist Slide Pagination Indicators */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIdx(idx)}
              aria-label={`Go to slide ${idx + 1}: ${slide.category}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlideIdx
                  ? 'w-8 bg-[#f0cb5a] shadow-md'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: PRODUCTS GRID SECTION */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-12 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-7 sm:mb-12 pb-4 sm:pb-6 border-b border-slate-200/80">
          <div>
            <div className="text-[11px] sm:text-xs font-semibold text-[#12366e] uppercase tracking-wider mb-1.5 sm:mb-2">
              {t('home.productsEyebrow')}
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              {t('home.productsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 sm:mt-2 max-w-xl">
              {t('home.productsSubtitle')}
            </p>
          </div>
          <button
            onClick={() => navigate('/insurance')}
            className="text-xs font-semibold text-[#12366e] hover:text-[#184486] flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>{t('home.productsAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
          {publishedProducts.slice(0, 6).map((product) => (
            <div
              key={product.productId}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="relative h-32 sm:h-36 w-full bg-slate-200 overflow-hidden border-b border-slate-100">
                  <ResponsiveImage
                    src={getCategoryCoverImage(product.productCategory, product.heroImage)}
                    alt={product.productName}
                    sizes="(max-width: 767px) 94vw, (max-width: 1023px) 46vw, 31vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    {getCategoryIcon(product.productCategory)}
                  </div>
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-mono font-semibold text-white bg-slate-900/65 backdrop-blur-sm px-2 py-0.5 rounded uppercase">
                    {product.productCategory}
                  </span>
                </div>

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#12366e] transition-colors">
                      {product.productName}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-1.5 sm:mt-2 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="text-[10px] sm:text-[11px] font-semibold text-slate-700">{t('home.sampleCoverage')}</div>
                    {product.benefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-600">
                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-3.5 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] sm:text-xs">
                  <span className="text-slate-500">{t('home.from')} </span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {product.quotationConfiguration.standardMinimumPremiumETB.toLocaleString()} ETB
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/insurance/${product.slug}`)}
                  className="text-xs font-semibold text-[#12366e] hover:text-[#184486] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                >
                  <span>{t('home.details')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CUSTOMER TESTIMONIAL CAROUSEL (POLICYHOLDER SOCIAL PROOF & TRUST - 16 STORIES, 4 VISIBLE AT ONCE) */}
      <section className="bg-slate-100/80 border-y border-slate-200/80 py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div className="max-w-2xl space-y-1.5 sm:space-y-2">
              <span className="text-[11px] sm:text-xs font-semibold text-[#12366e] uppercase tracking-wider block">
                {t('home.testimonialsEyebrow')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {t('home.testimonialsTitle')}
              </h2>
            </div>

            {/* Page & Navigation Controls */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <button
                onClick={handlePrevTestimonial}
                aria-label="Previous testimonial page"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-300 hover:border-[#12366e] text-slate-700 hover:text-[#12366e] flex items-center justify-center transition-all shadow-sm hover:shadow cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="text-xs font-mono text-slate-600 font-semibold px-2">
                <span>Page {currentTestimonialPage + 1}</span>
                <span className="text-slate-300 mx-1">/</span>
                <span>{totalPages}</span>
              </div>
              <button
                onClick={handleNextTestimonial}
                aria-label="Next testimonial page"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-300 hover:border-[#12366e] text-slate-700 hover:text-[#12366e] flex items-center justify-center transition-all shadow-sm hover:shadow cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* 4 Testimonial Cards Visible At Once (Compact & Dense) */}
          <div 
            onMouseEnter={() => setIsTestimonialPaused(true)}
            onMouseLeave={() => setIsTestimonialPaused(false)}
            className="space-y-4 sm:space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {visibleTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white border border-slate-200 hover:border-[#12366e]/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group h-full relative"
                >
                  <div className="space-y-3.5">
                    {/* Author header */}
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0 w-11 h-11">
                        <ResponsiveImage
                          src={testimonial.avatarUrl}
                          alt={testimonial.name}
                          sizes="44px"
                          width={44}
                          height={44}
                          pictureClassName="block w-11 h-11"
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm"
                          onFallbackError={(e) => {
                            const pic = e.currentTarget.closest('picture') as HTMLElement | null;
                            if (pic) pic.style.display = 'none';
                            (pic?.nextElementSibling as HTMLElement | null)?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden w-11 h-11 rounded-full bg-[#12366e] text-white flex items-center justify-center font-bold text-xs border border-slate-200 shadow-sm">
                          {testimonial.avatarInitials}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {testimonial.name}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500 truncate leading-tight">
                          {testimonial.role}
                        </p>
                        <p className="text-[11px] font-semibold text-[#12366e] truncate leading-tight">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating & Location */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-0.5">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">
                        {testimonial.location}, ET
                      </span>
                    </div>

                    {/* Policy Type chip */}
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 text-[10px] font-medium border border-slate-200/70 truncate max-w-full">
                      <Shield className="w-2.5 h-2.5 text-[#12366e] shrink-0" />
                      <span className="truncate">{testimonial.policyType}</span>
                    </div>

                    {/* Quote Text */}
                    <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-4">
                      "{testimonial.quote}"
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-end text-[11px]">
                    <span className="text-slate-400 font-medium">
                      {testimonial.tenure}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonials Page Indicator Dots */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {[...Array(totalPages)].map((_, pageIdx) => (
                  <button
                    key={pageIdx}
                    onClick={() => setCurrentTestimonialPage(pageIdx)}
                    aria-label={`Go to testimonial page ${pageIdx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      pageIdx === currentTestimonialPage
                        ? 'w-8 bg-[#12366e]'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Social Proof Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 pt-2 sm:pt-4 text-center">
            <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm">
              <div className="text-xl sm:text-3xl font-bold font-mono text-[#12366e]">30+</div>
              <div className="text-[11px] sm:text-xs text-slate-600 font-medium mt-1">{t('home.stat1')}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm">
              <div className="text-xl sm:text-3xl font-bold font-mono text-[#12366e]">100%</div>
              <div className="text-[11px] sm:text-xs text-slate-600 font-medium mt-1">{t('home.stat2')}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm">
              <div className="text-xl sm:text-3xl font-bold font-mono text-[#12366e]">32+</div>
              <div className="text-[11px] sm:text-xs text-slate-600 font-medium mt-1">{t('home.stat3')}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm">
              <div className="text-xl sm:text-3xl font-bold font-mono text-[#12366e]">98.6%</div>
              <div className="text-[11px] sm:text-xs text-slate-600 font-medium mt-1">{t('home.stat4')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: EDITORIAL STORYTELLING SECTION (LOOM & ANTIGRAVITY INSPIRED) */}
      <section className="bg-white border-b border-slate-200/80 py-12 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 lg:gap-20 items-center">
            {/* Left Image Asset */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 aspect-[4/3] bg-slate-200">
              <ResponsiveImage
                src="/assets/aic_family_protection_1793894083687.jpg"
                alt="Ethiopian Family Security"
                sizes="(max-width: 1023px) 94vw, 580px"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-7 sm:left-7 sm:right-7 text-white">
                <span className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-[#c59b27]">{t('home.familyBadge')}</span>
                <h3 className="text-base sm:text-xl font-bold text-white mt-1">{t('home.familyCaption')}</h3>
              </div>
            </div>

            {/* Right Editorial Copy */}
            <div className="space-y-5 sm:space-y-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight text-balance leading-tight">
                {t('home.editorialTitle')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t('home.editorialDesc')}
              </p>

              <div className="grid grid-cols-2 gap-4 sm:gap-8 pt-4 sm:pt-6 border-t border-slate-200/80">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#12366e] tabular-nums">30+ Years</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 mt-1">{t('home.stat1')}</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#12366e] tabular-nums">ETB 603M+</div>
                  <div className="text-[11px] sm:text-xs text-slate-500 mt-1">Paid-up capital scaling to ETB 2 billion</div>
                </div>
              </div>

              <div className="pt-1 sm:pt-2">
                <button
                  onClick={() => navigate('/about')}
                  className="text-xs font-semibold text-[#12366e] hover:text-[#184486] flex items-center gap-2 group cursor-pointer"
                >
                  <span>{t('home.readProfile')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: COMMERCIAL FLEET & LOGISTICS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-12 sm:py-24">
        <div className="bg-gradient-to-br from-[#0e2a58] via-[#12366e] to-[#184486] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6">
              <span className="text-[11px] sm:text-xs font-semibold text-[#f0cb5a] uppercase tracking-wider">{t('home.fleetEyebrow')}</span>
              <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                {t('home.fleetTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('home.fleetDesc')}
              </p>
              <div className="pt-1 sm:pt-2">
                <button
                  onClick={() => navigate('/insurance/commercial-fleet-motor-insurance')}
                  className="bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-md inline-flex items-center gap-2 group cursor-pointer"
                >
                  <span>{t('home.fleetBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 shadow-lg bg-slate-800/40">
              <ResponsiveImage
                src="/assets/aic_fleet_logistics_1793894083707.jpg"
                alt="Ethiopian Commercial Logistics Fleet"
                sizes="(max-width: 1023px) 94vw, 560px"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
