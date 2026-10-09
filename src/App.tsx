import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/layout/SearchModal';
import { HomePage } from './pages/HomePage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { AllToolsPage } from './pages/AllToolsPage';
import { SitemapXmlPage } from './pages/SitemapXmlPage';
import { RobotsTxtPage } from './pages/RobotsTxtPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LanguageProvider } from './i18n/useTranslation';
import { ToolDefinition, ThemeMode } from './types';
import { TOOLS_REGISTRY, getToolBySlug } from './data/toolsRegistry';
import { TOOL_CATEGORIES } from './data/categories';
import { getStoredTheme, setStoredTheme } from './utils/storage';
import { WebsiteLoadingScreen } from './components/common/WebsiteLoadingScreen';
import { AdProvider, AdSlot } from './ads';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getStoredTheme());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial smooth website loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Listen to browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut Cmd+K or Ctrl+K or / to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme application
  useEffect(() => {
    const applyTheme = () => {
      const isDark =
        themeMode === 'dark' ||
        (themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
    setStoredTheme(themeMode);

    if (themeMode === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [themeMode]);

  // Navigate helper with HTML5 History API
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (tool: ToolDefinition) => {
    navigate(`/tools/${tool.slug}`);
  };

  const handleSelectCategory = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
  };

  // Route matching
  const renderCurrentView = () => {
    const path = currentPath.replace(/\/+$/, '') || '/';

    // 1. Home
    if (path === '/') {
      return (
        <HomePage
          onSelectTool={handleSelectTool}
          onSelectCategory={handleSelectCategory}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigateAllTools={() => navigate('/tools')}
        />
      );
    }

    // 2. All Tools Directory
    if (path === '/tools') {
      return (
        <AllToolsPage
          onSelectTool={handleSelectTool}
          onNavigateHome={() => navigate('/')}
        />
      );
    }

    // 3. Tool Detail (/tools/[tool-slug])
    if (path.startsWith('/tools/')) {
      const slug = path.replace('/tools/', '');
      const tool = getToolBySlug(slug);
      if (tool) {
        return (
          <ToolDetailPage
            tool={tool}
            onSelectTool={handleSelectTool}
            onSelectCategory={handleSelectCategory}
            onNavigateHome={() => navigate('/')}
          />
        );
      }
      return (
        <NotFoundPage
          onNavigateHome={() => navigate('/')}
          onOpenSearch={() => setIsSearchOpen(true)}
          onSelectTool={handleSelectTool}
        />
      );
    }

    // 4. Category Page (/category/[slug] or /categories/[slug])
    if (path.startsWith('/category/') || path.startsWith('/categories/')) {
      const catSlug = path.replace(/^\/(category|categories)\//, '');
      const exists = TOOL_CATEGORIES.some((c) => c.slug === catSlug);
      if (exists) {
        return (
          <CategoryPage
            categorySlug={catSlug}
            onSelectTool={handleSelectTool}
            onSelectCategory={handleSelectCategory}
            onNavigateHome={() => navigate('/')}
          />
        );
      }
      return (
        <NotFoundPage
          onNavigateHome={() => navigate('/')}
          onOpenSearch={() => setIsSearchOpen(true)}
          onSelectTool={handleSelectTool}
        />
      );
    }

    // 5. Sitemap XML (/sitemap.xml) and Robots.txt (/robots.txt)
    // Do not allow React SPA routing to replace the actual static files in public/
    if (path === '/sitemap.xml' || path === '/robots.txt') {
      window.location.replace(path);
      return null;
    }

    // 7. Legal pages
    const legalPages = ['privacy-policy', 'terms', 'cookie-policy', 'disclaimer', 'about', 'contact'];
    const strippedPage = path.replace('/', '');
    if (legalPages.includes(strippedPage)) {
      return (
        <LegalPage
          pageId={strippedPage}
          onNavigateHome={() => navigate('/')}
        />
      );
    }

    // 8. 404 Not Found
    return (
      <NotFoundPage
        onNavigateHome={() => navigate('/')}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectTool={handleSelectTool}
      />
    );
  };

  return (
    <LanguageProvider>
      <AdProvider>
        {isLoading && <WebsiteLoadingScreen />}
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors w-full max-w-full min-w-0 pb-20 sm:pb-24">
          {/* Optional top-of-page sponsored slot */}
          <AdSlot placement="header_top" className="pt-2" />

          {/* Navigation Header */}
          <Header
            onOpenSearch={() => setIsSearchOpen(true)}
            onNavigateHome={() => navigate('/')}
            onNavigateCategory={handleSelectCategory}
            onNavigateAllTools={() => navigate('/tools')}
            themeMode={themeMode}
            onSetThemeMode={setThemeMode}
          />

          {/* Global Search Modal */}
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectTool={handleSelectTool}
          />

          {/* Main Content Area */}
          <main className="flex-1 py-6 sm:py-8 w-full max-w-full min-w-0">
            {renderCurrentView()}
          </main>

          {/* Global Footer */}
          <Footer
            onNavigateCategory={handleSelectCategory}
            onNavigateLegal={(page) => navigate(`/${page}`)}
            onNavigateHome={() => navigate('/')}
          />
        </div>
      </AdProvider>
    </LanguageProvider>
  );
}
