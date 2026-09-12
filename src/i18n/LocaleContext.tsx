import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MY_DICTIONARY } from './my';

export type Locale = 'en' | 'my';

export const LOCALES: { code: Locale; label: string; englishLabel: string }[] = [
  { code: 'en', label: 'English', englishLabel: 'English' },
  { code: 'my', label: 'မြန်မာ', englishLabel: 'Burmese' },
];

const STORAGE_KEY = 'mm-health-locale';

/**
 * Translations are keyed by their English source string rather than by an
 * invented identifier. Two consequences that matter: any string with no entry
 * renders its English source instead of a missing-key placeholder, and the
 * analytical prose held in src/data/miningData.ts can be translated at its
 * render site without restructuring the data.
 */
const DICTIONARIES: Record<Locale, Record<string, string>> = {
  en: {},
  my: MY_DICTIONARY,
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translate a source string, falling back to the string itself. */
  t: (source: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const resolveInitialLocale = (): Locale => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'my') return stored;
  } catch {
    // Blocked site-data throws on access.
  }
  return navigator.language?.toLowerCase().startsWith('my') ? 'my' : 'en';
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(resolveInitialLocale);

  // Drives the Myanmar font stack and line-height rules in index.css, and
  // tells assistive technology which language the page is in.
  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const dictionary = DICTIONARIES[locale];
    return {
      locale,
      setLocale: (next: Locale) => {
        setLocaleState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // A failed write costs persistence only.
        }
      },
      t: (source: string) => dictionary[source] ?? source,
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useI18n = (): LocaleContextValue => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useI18n must be used within a LocaleProvider');
  return ctx;
};
