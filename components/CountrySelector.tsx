import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useCountry } from '../lib/CountryContext';

interface CountrySelectorProps {
  variant?: 'light' | 'dark' | 'pill';
  className?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  variant = 'light',
  className = ''
}) => {
  const { country, countryCode, availableCountries, setCountryCode } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonStyles = {
    light: 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-xs',
    dark: 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 shadow-sm',
    pill: 'bg-white/90 hover:bg-white text-slate-900 border-slate-200/80 shadow-md backdrop-blur-md'
  }[variant];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${buttonStyles} focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer`}
        aria-expanded={isOpen}
        aria-label="Select Country & Currency"
      >
        <span className="text-base leading-none">{country.flag}</span>
        <span className="font-semibold">{country.currencyCode}</span>
        <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">({country.currencySymbol.trim()})</span>
        <ChevronDown size={12} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-200 py-2 z-[999] animate-[fadeIn_0.15s_ease-out]">
          <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Globe size={11} />
              <span>Select Your Country</span>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {availableCountries.map((c) => {
              const isSelected = c.code === country.code;
              return (
                <button
                  key={c.code}
                  onClick={() => {
                    setCountryCode(c.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors hover:bg-blue-50/80 cursor-pointer ${
                    isSelected ? 'bg-blue-50/50 font-bold text-blue-700' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{c.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({c.currencyCode})</span>
                      </div>
                      <div className="text-[11px] text-emerald-600 font-bold">
                        {c.formattedPrice}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check size={14} className="text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
          <div className="px-3 py-1.5 border-t border-slate-100 mt-1 text-[10px] text-slate-400 text-center">
            Prices update automatically
          </div>
        </div>
      )}
    </div>
  );
};
