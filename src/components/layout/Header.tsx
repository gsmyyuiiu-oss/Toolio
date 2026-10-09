import React, { useState, useEffect, useRef } from 'react';
import {
  Wrench,
  Search,
  Moon,
  Sun,
  Globe,
  Check,
  ChevronDown,
  Menu,
  X,
  Laptop,
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { TOOL_CATEGORIES } from '../../data/categories';
import { ThemeMode } from '../../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onNavigateHome: () => void;
  onNavigateCategory?: (categorySlug: string) => void;
  onNavigateAllTools?: () => void;
  themeMode: ThemeMode;
  onSetThemeMode: (mode: ThemeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onNavigateHome,
  onNavigateCategory,
  onNavigateAllTools,
  themeMode,
  onSetThemeMode,
}) => {
  const { currentLanguage, setLanguage, languageInfo, supportedLanguages, t } = useTranslation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click using refs so inside clicks aren't lost
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setLangMenuOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(target)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleToggleTheme = () => {
    const nextMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    onSetThemeMode(nextMode);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-1.5 sm:gap-3 min-w-0">
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 sm:gap-2.5 text-left group cursor-pointer focus:outline-hidden shrink-0"
              aria-label="Toolio Homepage"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Wrench className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                  Toolio
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300">
                  Universal Online Tools
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <div className="relative" ref={categoriesRef}>
                <button
                  type="button"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Categories</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 gap-1 z-50">
                    {TOOL_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategoriesOpen(false);
                          if (onNavigateCategory) onNavigateCategory(cat.slug);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">→</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onNavigateAllTools}
                className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                All 200+ Tools
              </button>
            </nav>
          </div>

          {/* Search Trigger Button - Auto-shrinks smoothly on narrow mobile screens */}
          <div className="flex-1 min-w-0 max-w-md mx-1 sm:mx-4">
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shadow-xs transition-all text-xs sm:text-sm cursor-pointer group min-w-0"
              aria-label="Open search dialog"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 overflow-hidden">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                <span className="truncate text-left text-xs sm:text-sm">
                  <span className="hidden sm:inline">Search 200+ tools (e.g., percentage, json, qr)...</span>
                  <span className="inline sm:hidden">Search...</span>
                </span>
              </div>
              <div className="hidden md:flex items-center gap-1 font-mono text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 shrink-0">
                <span>⌘</span>
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Language Selector Dropdown (desktop & tablet) */}
            <div className="relative hidden sm:block" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer shrink-0"
                aria-label="Select language"
              >
                <span className="text-sm sm:text-base leading-none">{languageInfo.flag}</span>
                <span className="hidden xl:inline">{languageInfo.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden xs:inline" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 max-h-80 overflow-y-auto p-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 divide-y divide-slate-100 dark:divide-slate-800/80">
                  <div className="p-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>100+ Global Languages</span>
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div className="pt-1 space-y-0.5">
                    {supportedLanguages.map((lang) => {
                      const isSelected = lang.code === currentLanguage;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lang.code);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-semibold'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{lang.flag}</span>
                            <div>
                              <span>{lang.nativeName}</span>
                              <span className="text-[10px] text-slate-400 ml-1.5">({lang.name})</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Day / Night Theme Toggle Button (Always visible on all screens) */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shrink-0"
              title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle light or dark theme"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-600" />
              )}
            </button>

            {/* Mobile Hamburger Button (Always visible on mobile breakpoints) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4 shadow-2xl animate-pop-in max-h-[85vh] overflow-y-auto"
        >
          {/* Main Navigation Links */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateHome();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-between cursor-pointer"
            >
              <span>Home</span>
              <span className="text-xs text-indigo-500 font-mono">→</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onNavigateAllTools) onNavigateAllTools();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-between cursor-pointer"
            >
              <span>Explore All 200+ Tools</span>
              <span className="text-xs text-indigo-500 font-mono">→</span>
            </button>
          </div>

          {/* Theme Selector Controls */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1">
              Display Theme
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSetThemeMode('light')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-amber-50 dark:bg-slate-800 border-amber-300 dark:border-amber-500 text-amber-700 dark:text-amber-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => onSetThemeMode('dark')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-indigo-50 dark:bg-slate-800 border-indigo-300 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => onSetThemeMode('system')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  themeMode === 'system'
                    ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-slate-500" />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Language Selector for Mobile */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
              <span>Language</span>
              <span className="text-xs text-indigo-500 font-semibold">{languageInfo.flag} {languageInfo.nativeName}</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 subtle-scrollbar">
              {supportedLanguages.slice(0, 10).map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium shrink-0 border transition-colors cursor-pointer ${
                    currentLanguage === lang.code
                      ? 'bg-indigo-600 border-indigo-600 text-white font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {lang.flag} {lang.nativeName}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Grid */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1 mb-2 flex items-center justify-between">
              <span>All Categories</span>
              <span className="text-[11px] text-indigo-500 font-semibold">{TOOL_CATEGORIES.length} Categories</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {TOOL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavigateCategory) onNavigateCategory(cat.slug);
                  }}
                  className="text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate cursor-pointer"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
