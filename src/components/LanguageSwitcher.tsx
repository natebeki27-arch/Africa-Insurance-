import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (nextLang: AppLanguage) => {
    setLanguage(nextLang);
    setOpen(false);
    onSelect?.();
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (variant === 'pills') {
    return (
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Language Switcher">
        {LANGUAGE_OPTIONS.map((opt) => (
          <button
            key={opt.code}
            type="button"
            data-compact="true"
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

  const currentOption = LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        data-compact="true"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Select Language (${currentOption.label})`}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={currentOption.label}
        className="inline-flex items-center gap-1 h-7 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg px-2 py-1 text-[11px] font-semibold text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
      >
        <Globe className="w-3 h-3 text-[#12366e] shrink-0" />
        <span>{currentOption.short}</span>
        <ChevronDown className={`w-3 h-3 text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 text-xs"
        >
          {LANGUAGE_OPTIONS.map((opt) => {
            const active = opt.code === language;
            return (
              <button
                key={opt.code}
                type="button"
                data-plain="true"
                role="option"
                aria-selected={active}
                onClick={() => handleChange(opt.code)}
                className={`w-full text-left px-3 py-1.5 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  active
                    ? 'bg-slate-50 text-[#12366e] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#12366e]'
                }`}
              >
                <span>{opt.label}</span>
                {active && <Check className="w-3.5 h-3.5 text-[#12366e] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

