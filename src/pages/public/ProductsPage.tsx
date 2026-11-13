import React, { useState } from 'react';
import { store } from '../../services/store';
import { useLanguage } from '../../i18n/LanguageContext';
import { Shield, Search, ArrowRight, CheckCircle2, Car, Building2, Anchor, HardHat, HeartHandshake, Briefcase, FileText } from 'lucide-react';
import { InsuranceProduct } from '../../types/insurance';
import { ResponsiveImage, getCategoryCoverImage } from '../../components/ResponsiveImage';

interface ProductsPageProps {
  navigate: (route: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ navigate }) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const products = store.getPublishedProducts();

  const categories = [
    { id: 'all', label: t('products.all') },
    { id: 'motor', label: 'Motor & Transport' },
    { id: 'property', label: 'Property & Fire' },
    { id: 'liability', label: 'Liability' },
    { id: 'marine', label: 'Marine & Cargo' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'personal', label: 'Personal & Accident' },
    { id: 'business', label: 'Commercial Package' }
  ];

  const filtered = products.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.productCategory === selectedCategory;
    const matchQuery =
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.benefits.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchQuery;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'motor': return <Car className="w-5 h-5 text-[#12366e]" />;
      case 'property': return <Building2 className="w-5 h-5 text-[#12366e]" />;
      case 'marine': return <Anchor className="w-5 h-5 text-[#12366e]" />;
      case 'engineering': return <HardHat className="w-5 h-5 text-[#12366e]" />;
      case 'personal': return <HeartHandshake className="w-5 h-5 text-[#12366e]" />;
      case 'business': return <Briefcase className="w-5 h-5 text-[#12366e]" />;
      default: return <FileText className="w-5 h-5 text-[#12366e]" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">
        {/* Header */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#12366e] uppercase tracking-wider">
            <span>{t('products.eyebrow')}</span>
            <span aria-hidden="true">·</span>
            <span>Comprehensive Statutory Lines</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#12366e] tracking-tight">
            {t('products.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {t('products.subtitle')}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
          {/* Segmented Category Buttons (Functional filter buttons complying with frontend-design constitution) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl w-full md:w-auto overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === c.id
                    ? 'bg-[#12366e] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t('products.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-xs pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-[#12366e]"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 pt-2 sm:pt-4">
          {filtered.map((product) => (
            <div
              key={product.productId}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="relative h-36 sm:h-40 w-full bg-slate-200 overflow-hidden border-b border-slate-100">
                  <ResponsiveImage
                    src={getCategoryCoverImage(product.productCategory, product.heroImage)}
                    alt={product.productName}
                    sizes="(max-width: 767px) 94vw, (max-width: 1023px) 46vw, 31vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm">
                    {getCategoryIcon(product.productCategory)}
                  </div>
                  <div className="absolute bottom-2.5 right-3 text-[10px] font-mono font-semibold text-white bg-slate-900/65 backdrop-blur-sm px-2 py-0.5 rounded uppercase">
                    v{product.version}.0 · {product.productCategory}
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#12366e] transition-colors">
                      {product.productName}
                    </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-1.5 sm:mt-2 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 sm:space-y-2">
                  <div className="text-[10px] sm:text-[11px] font-semibold text-slate-700">Key Coverage Benefits:</div>
                  {product.benefits.slice(0, 3).map((b, i) => (
                    <div key={i} className="flex items-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-600">
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{b}</span>
                    </div>
                  ))}
                </div>
                </div>
              </div>

              <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-3.5 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 block">Indicative Base</span>
                  <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums">
                    {product.quotationConfiguration.standardMinimumPremiumETB.toLocaleString()} ETB
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/insurance/${product.slug}`)}
                  className="bg-[#12366e] hover:bg-[#0e2a58] text-white text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{t('products.viewDetails')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
            <p className="text-sm text-slate-600">No insurance products match your search.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-3 text-xs font-semibold text-[#12366e] hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
