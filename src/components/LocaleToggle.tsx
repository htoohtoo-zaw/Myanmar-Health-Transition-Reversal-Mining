import React from 'react';
import { Languages } from 'lucide-react';
import { Locale, LOCALES, useI18n } from '../i18n/LocaleContext';

export const LocaleToggle: React.FC = () => {
  const { locale, setLocale } = useI18n();

  return (
    <div className="relative inline-flex items-center shrink-0">
      <Languages
        size={14}
        className="absolute left-2 text-[var(--c-muted)] pointer-events-none"
        aria-hidden="true"
      />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="appearance-none pl-7 pr-2 py-1.5 text-[12px] font-medium rounded-[6px] border border-[var(--c-border-strong)] bg-[var(--c-subtle)] text-[var(--c-ink)] cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-[var(--c-primary)]"
        aria-label="Select language"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
};
