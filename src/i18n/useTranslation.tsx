import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, TRANSLATIONS, TranslationDictionary } from './translations';
import { LanguageOption } from '../types';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (code: string) => void;
  t: TranslationDictionary;
  languageInfo: LanguageOption;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
    // 1. Try saved language
    const saved = localStorage.getItem('toolio_lang');
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved;
    }
    // 2. Try browser language detection
    const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
    if (browserLang && SUPPORTED_LANGUAGES.some(l => l.code === browserLang)) {
      return browserLang;
    }
    return 'en';
  });

  const setLanguage = (code: string) => {
    setCurrentLanguageState(code);
    localStorage.setItem('toolio_lang', code);
  };

  useEffect(() => {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage);
    const dir = langObj?.dir || 'ltr';
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = dir;
  }, [currentLanguage]);

  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
  const languageInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t: dict,
        languageInfo,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
