import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, LANGUAGE_OPTIONS, AppLanguage } from '../i18n/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'compact' | 'pills';
  onSelect?: () => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'desktop',
  onSelect
}) => {
  const { language, setLanguage } = useLanguage();

  const handleChange = (nextLang: AppLanguage) => {
    setLanguage(nextLang);
    onSelect?.();
  };

  if (variant === 'pills') {
    return (
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Language Switcher">
        {LANGUAGE_OPTIONS.map((opt) => (
          <button
            key={opt.code}
            type="button"
            onClick={() => handleChange(opt.code)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              language === opt.code
                ? 'bg-[#12366e] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <select
        aria-label="Select Language"
        value={language}
        onChange={(e) => handleChange(e.target.value as AppLanguage)}
        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.short}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 hover:border-slate-300 transition-colors">
      <Globe className="w-3.5 h-3.5 text-[#12366e] shrink-0" />
      <select
        aria-label="Select Language"
        value={language}
        onChange={(e) => handleChange(e.target.value as AppLanguage)}
        className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
