import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Lock,
  Star,
  Clock,
  Layers,
} from 'lucide-react';
import { TOOL_CATEGORIES } from '../data/categories';
import { TOOLS_REGISTRY, getPopularTools } from '../data/toolsRegistry';
import { ToolCard } from '../components/common/ToolCard';
import { AdBanner } from '../components/layout/AdBanner';
import { AdSlot } from '../ads/AdSlot';
import { useTranslation } from '../i18n/useTranslation';
import { ToolDefinition } from '../types';
import { getRecentTools, getFavorites, toggleFavorite } from '../utils/storage';
import { SeoManager } from '../seo/SeoManager';
import { IconResolver } from '../components/common/IconResolver';

interface HomePageProps {
  onSelectTool: (tool: ToolDefinition) => void;
  onSelectCategory: (categorySlug: string) => void;
  onOpenSearch: () => void;
  onNavigateAllTools: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTool,
  onSelectCategory,
  onOpenSearch,
  onNavigateAllTools,
}) => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [homeCategory, setHomeCategory] = useState<string>('all');

  useEffect(() => {
    setFavorites(getFavorites());
    setRecentSlugs(getRecentTools());
  }, []);

  const handleToggleFav = (e: React.MouseEvent, tool: ToolDefinition) => {
    e.stopPropagation();
    toggleFavorite(tool.slug);
    setFavorites(getFavorites());
  };

  const popularTools = getPopularTools();
  const favoriteTools = TOOLS_REGISTRY.filter((t) => favorites.includes(t.slug));
  const recentTools = recentSlugs
    .map((slug) => TOOLS_REGISTRY.find((t) => t.slug === slug))
    .filter(Boolean) as ToolDefinition[];

  const filteredTools =
    homeCategory === 'all'
      ? popularTools
      : TOOLS_REGISTRY.filter((t) => t.category === homeCategory);

  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Toolio',
    url: 'https://toolio.pages.dev',
    description:
      'Universal online utility platform with 200+ free online tools: calculators, converters, image compressors, developer tools, and SEO utilities.',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="space-y-16">
      <SeoManager
        title="Toolio — Free Online Tools for Everyone | 200+ Fast Utilities"
        description="Toolio is a universal online utility toolbox featuring 200+ fast, free, and browser-powered tools: calculators, unit converters, image compressors, developer tools, and SEO utilities. No signup required."
        canonicalPath="/"
        schema={homeSchema}
      />

      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-10 text-center max-w-5xl mx-auto px-4 overflow-hidden">
        {/* Ambient multi-color dynamic gradient mesh glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[700px] h-[350px] sm:h-[400px] bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-pink-500/25 blur-3xl rounded-full -z-10 pointer-events-none animate-pulse-glow" />
        <div className="absolute -top-10 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-full inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-[11px] sm:text-xs font-bold mb-6 shadow-md shadow-indigo-500/10 animate-float">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 animate-spin-slow shrink-0" />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-black">
            463+ Online Tools
          </span>
          <span className="text-slate-400 hidden xs:inline">•</span>
          <span className="hidden xs:inline">16 Verticals</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Free &amp; Private</span>
        </div>

        <h1 className="text-3xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.14] sm:leading-[1.12] break-words">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Fast, Free Online Tools
          </span>{' '}
          for Everyone
        </h1>

        <p className="mt-5 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          The ultimate productivity engine for media, documents, business finances, science, code, and conversions.
          Zero signup, zero file uploads, 100% private in your browser.
        </p>

        {/* Large Prominent Hero Search Box */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div
            onClick={onOpenSearch}
            className="group relative flex items-center w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-all duration-200"
          >
            <Search className="w-6 h-6 text-indigo-500 shrink-0 mr-3" />
            <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 text-sm sm:text-base text-left truncate flex-1">
              Search a tool... (e.g. percentage, jpg to png, bmi, json)
            </span>
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-slate-500 font-bold border border-slate-200 dark:border-slate-700">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span className="font-medium">Trending searches:</span>
            {['Percentage Calculator', 'Image Compressor', 'QR Code Generator', 'Loan EMI', 'JSON Formatter'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={onOpenSearch}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-2 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pinned Favorites (If user pinned any) */}
      {favoriteTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t.favorites}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {favoriteTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                isFavorite={true}
                onToggleFavorite={handleToggleFav}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently Used (If any exist) */}
      {recentTools.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t.recentlyUsed}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                isFavorite={favorites.includes(tool.slug)}
                onToggleFavorite={handleToggleFav}
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Tools / Quick Filter Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {homeCategory === 'all' ? t.popularTools : 'Category Tools'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Instant, browser-executed utilities ready to use without an account
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateAllTools}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer self-start sm:self-auto"
          >
            <span>{t.viewAllTools}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills Slider */}
        <div className="category-scroll-container w-full max-w-full pb-3.5 pt-1 px-0.5">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-max">
            <button
              type="button"
              onClick={() => setHomeCategory('all')}
              className={`category-filter-button px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                homeCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
              }`}
            >
              ★ Most Popular
            </button>
            {TOOL_CATEGORIES.map((cat) => {
              const isSelected = homeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setHomeCategory(cat.id)}
                  className={`category-filter-button px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30 font-bold'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onSelect={onSelectTool}
              isFavorite={favorites.includes(tool.slug)}
              onToggleFavorite={handleToggleFav}
            />
          ))}
        </div>
      </section>

      {/* Polite Ad Placement */}
      <AdSlot placement="home_mid_content" />

      {/* Browse All Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t.browseCategories}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Organized across 12 distinct utility verticals for instant problem solving
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {TOOL_CATEGORIES.map((cat) => {
            const count = TOOLS_REGISTRY.filter((t) => t.category === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bgColor} border`}>
                    <span className={cat.color}>
                      <IconResolver name={cat.icon} className="w-5 h-5" />
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${cat.badgeColor}`}>
                    {count}+ {t.toolsCountBadge}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore category</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Native Ad Partner Placement */}
      <AdSlot placement="native_banner" />

      {/* SEO Explanatory Content Section (PRD Section 17 & 23) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Toolio — The Universal Toolbox for the Modern Web
          </h2>

          <p>
            Toolio was created with a simple, refreshing philosophy: <strong>«Search → Open Tool → Complete Task → Copy or Download Result → Leave»</strong>. In an era where most utility websites clutter your screen with deceptive popups, aggressive paywalls, or force you to create unnecessary accounts just to resize a photo or calculate sales tax, Toolio does the exact opposite.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Client-Side Privacy</span>
              </h4>
              <p className="text-xs text-slate-500">
                Your images, code snippets, financial numbers, and documents are processed locally inside your browser engine. Files are never transmitted or stored on remote servers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Zero Latency &amp; Offline</span>
              </h4>
              <p className="text-xs text-slate-500">
                Because calculations and transformations execute using native HTML5 Canvas, Web Crypto, and JavaScript workers, tools execute with sub-millisecond responsiveness.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-indigo-500" />
                <span>Global Accessibility</span>
              </h4>
              <p className="text-xs text-slate-500">
                Accessible in 100+ languages with full RTL support for Arabic, light/dark themes, and WCAG AA contrast standards.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
