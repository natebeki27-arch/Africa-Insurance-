import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  ArrowRight, 
  ExternalLink, 
  Newspaper, 
  Award,
  ChevronRight,
  ShieldCheck,
  Building,
  Sparkles,
  Clock,
  Tag
} from 'lucide-react';

interface MediaPageProps {
  navigate: (route: string) => void;
}

export const MediaPage: React.FC<MediaPageProps> = ({ navigate }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'announcements' | 'news'>('all');
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const defaultAnnouncements = [
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

  const [articles] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
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
    }
    return defaultAnnouncements;
  });

  const filteredArticles = articles.filter((a) => {
    if (activeCategory === 'all') return true;
    return a.category === activeCategory;
  });

  // Top featured story (either explicitly marked isFeatured or the first item)
  const heroStory = filteredArticles.find(a => a.isFeatured) || filteredArticles[0] || articles[0];
  // Recent list stories (excluding the hero story)
  const listStories = filteredArticles.filter(a => a.id !== heroStory?.id);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#12366e] uppercase tracking-wider">
              <span>Official Newsroom</span>
              <span aria-hidden="true">·</span>
              <span>Corporate Disclosures & Press Announcements</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-[#12366e] tracking-tight leading-tight">
              News & Updates
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Stay informed with authoritative corporate releases, client service milestones, insurance sector developments, and institutional announcements from Africa Insurance Company S.C.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl p-1.5 text-xs shadow-sm shrink-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#12366e] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Releases ({articles.length})
            </button>
            <button
              onClick={() => setActiveCategory('announcements')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeCategory === 'announcements'
                  ? 'bg-[#12366e] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Statutory Notices
            </button>
            <button
              onClick={() => setActiveCategory('news')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                activeCategory === 'news'
                  ? 'bg-[#12366e] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Company News
            </button>
          </div>
        </div>

        {/* HERO + LIST MAGAZINE LAYOUT */}
        {heroStory ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* HERO STORY (7 of 12 columns) */}
            <div 
              onClick={() => setSelectedArticle(heroStory)}
              className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#12366e]/30 transition-all duration-300 group flex flex-col justify-between cursor-pointer"
            >
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={heroStory.image || '/assets/aic_hero_addis_1793894081899.jpg'}
                  alt={heroStory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-[#f0cb5a] text-[#0c2550] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Top Featured Story</span>
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#f0cb5a]" />
                    <span>{heroStory.date}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug drop-shadow-sm group-hover:text-[#f0cb5a] transition-colors">
                    {heroStory.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {heroStory.summary}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#12366e]">
                  <span className="flex items-center gap-1.5">
                    <span>Read Full Statement</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">Ref: {heroStory.id}</span>
                </div>
              </div>
            </div>

            {/* LIST OF RECENT STORIES (5 of 12 columns) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Latest Headlines & Updates
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {listStories.length} updates
                </span>
              </div>

              <div className="space-y-3.5 flex-1 flex flex-col justify-between">
                {listStories.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedArticle(item)}
                    className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-[#12366e]/30 transition-all group flex gap-4 items-start cursor-pointer flex-1"
                  >
                    <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={item.image || '/assets/aic_family_protection_1793894083687.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-slate-400 font-mono">{item.date}</span>
                      </div>
                      
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#12366e] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500">
            No news articles found in this category.
          </div>
        )}

        {/* Additional Grid for More Headlines (if more than 4 total stories) */}
        {listStories.length > 3 && (
          <div className="space-y-4 pt-6">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">More Company Announcements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listStories.slice(3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedArticle(item)}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group space-y-3 cursor-pointer"
                >
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={item.image || '/assets/aic_hero_addis_1793894081899.jpg'}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-[#12366e]">
                      {item.tag || item.category}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{item.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#12366e] transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Full Detail Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="bg-[#12366e] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {selectedArticle.tag || selectedArticle.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedArticle.date}</span>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {selectedArticle.image && (
                <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                  <img
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                  {selectedArticle.title}
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedArticle.summary}
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
                  <div><strong>Publisher:</strong> Africa Insurance Company (S.C.) Corporate Communications</div>
                  <div><strong>Reference Code:</strong> {selectedArticle.id}</div>
                  <div><strong>National Bank of Ethiopia License:</strong> NBE Proclamation No. 86/1994</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Africa Insurance Company S.C.</span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="bg-[#12366e] hover:bg-[#184486] text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Corporate Press Contacts Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">Media Inquiries & Statutory Information Desk</h4>
            <p className="text-slate-500">
              For accredited press inquiries, investor relations, or statutory publication copies, contact our Head Office Marketing & CRM Department.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="mailto:md@africainsurancesc.com"
              className="bg-[#12366e] hover:bg-[#184486] text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>md@africainsurancesc.com</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
