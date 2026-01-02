'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language, type TranslationKeys } from './translations';

export type UnitSystem = 'metric' | 'imperial';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
  dir: 'ltr' | 'rtl';
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const RTL_LANGUAGES: Language[] = ['ar'];
const METRIC_LANGUAGES: Language[] = ['es', 'fr', 'de', 'ar', 'zh', 'ja'];

function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  const browserLang = navigator.language.split('-')[0];
  const supportedLanguages = Object.keys(translations) as Language[];

  if (supportedLanguages.includes(browserLang as Language)) {
    return browserLang as Language;
  }

  return 'en';
}

function getDefaultUnitSystem(lang: Language): UnitSystem {
  return METRIC_LANGUAGES.includes(lang) ? 'metric' : 'imperial';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>('imperial');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language;
    const storedUnit = localStorage.getItem('unitSystem') as UnitSystem;

    if (stored && translations[stored]) {
      setLanguageState(stored);
      if (storedUnit && (storedUnit === 'metric' || storedUnit === 'imperial')) {
        setUnitSystemState(storedUnit);
      } else {
        setUnitSystemState(getDefaultUnitSystem(stored));
      }
    } else {
      const detected = detectBrowserLanguage();
      setLanguageState(detected);
      localStorage.setItem('language', detected);
      const defaultUnit = getDefaultUnitSystem(detected);
      setUnitSystemState(defaultUnit);
      localStorage.setItem('unitSystem', defaultUnit);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
      document.documentElement.dir = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
    }
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setUnitSystem = (system: UnitSystem) => {
    setUnitSystemState(system);
    localStorage.setItem('unitSystem', system);
  };

  const t = (key: TranslationKeys): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  const dir = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir, unitSystem, setUnitSystem }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
