import React, { useState, useEffect } from 'react';
import { ToolDefinition } from '../types';
import { TOOL_CATEGORIES } from '../data/categories';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ToolCard } from '../components/common/ToolCard';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { AdBanner } from '../components/layout/AdBanner';
import { InContentAd } from '../ads/InContentAd';
import { AdSlot } from '../ads/AdSlot';
import { DownloadAd } from '../ads/DownloadAd';
import { ToolComponentResolver } from '../tools/ToolComponentResolver';
import { SeoManager } from '../seo/SeoManager';
import { useTranslation } from '../i18n/useTranslation';
import {
  Star,
  Share2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { getFavorites, toggleFavorite, addRecentTool } from '../utils/storage';
import { trackEvent } from '../utils/analytics';
import { IconResolver } from '../components/common/IconResolver';

interface ToolDetailPageProps {
  tool: ToolDefinition;
  onSelectTool: (tool: ToolDefinition) => void;
  onSelectCategory: (categorySlug: string) => void;
  onNavigateHome: () => void;
}

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({
  tool,
  onSelectTool,
  onSelectCategory,
  onNavigateHome,
}) => {
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [shareCopied, setShareCopied] = useState<boolean>(false);

  useEffect(() => {
    const favs = getFavorites();
    setIsFavorite(favs.includes(tool.slug));
    addRecentTool(tool.slug);
    trackEvent('tool_open', { tool: tool.slug, category: tool.category });
  }, [tool.slug, tool.category]);

  const handleToggleFav = () => {
    const updated = toggleFavorite(tool.slug);
    setIsFavorite(updated);
  };

  const handleShare = async () => {
    const fullUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: tool.seo.title,
          text: tool.shortDesc,
          url: fullUrl,
        });
        return;
      } catch {}
    }
    // Fallback: clipboard copy
    navigator.clipboard.writeText(fullUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const category = TOOL_CATEGORIES.find((c) => c.id === tool.category);

  // Related tools
  const relatedTools = (tool.relatedSlugs || [])
    .map((slug) => TOOLS_REGISTRY.find((t) => t.slug === slug))
    .filter(Boolean) as ToolDefinition[];

  // Fallback if no specific related tools specified: pick from same category
  const finalRelatedTools =
    relatedTools.length > 0
      ? relatedTools
      : TOOLS_REGISTRY.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 4);

  // Schema.org structured data (WebApplication + FAQPage)
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: window.location.href,
    description: tool.description,
    applicationCategory: category?.name || 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  if (tool.faqs && tool.faqs.length > 0) {
    schema['mainEntity'] = tool.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    }));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <SeoManager
        title={tool.seo.title}
        description={tool.seo.description}
        canonicalPath={tool.seo.canonicalPath}
        schema={schema}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: category?.name || 'Category', onClick: () => onSelectCategory(category?.slug || '') },
          { label: tool.name },
        ]}
      />

      {/* Tool Header Card */}
      <div
        style={{ ['--accent-color' as any]: tool.accentHex || '#6366f1' }}
        className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div
          className="absolute -top-16 -right-16 w-44 h-44 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ backgroundColor: tool.accentHex || '#6366f1' }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs transition-transform transform hover:scale-105 duration-200"
              style={{
                backgroundColor: `${tool.accentHex || '#6366f1'}18`,
                borderColor: `${tool.accentHex || '#6366f1'}35`,
                color: tool.accentHex || '#6366f1',
              }}
            >
              <IconResolver name={tool.icon} className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${tool.accentHex || '#6366f1'}15`,
                    color: tool.accentHex || '#6366f1',
                  }}
                >
                  {category?.name?.replace(/\s*\(\d+\)/, '') || 'Online Tool'}
                </span>
                {tool.isPopular && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                    Popular
                  </span>
                )}
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 100% In-Browser
                </span>
              </div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-black mt-2 tracking-tight transition-colors duration-200"
                style={{ color: tool.accentHex || '#3b82f6' }}
              >
                {tool.name}
              </h1>
            </div>
          </div>

          {/* Quick Actions (Favorite + Share) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleToggleFav}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
              title={isFavorite ? 'Saved to Favorites' : 'Pin to Favorites'}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
              <span>{isFavorite ? 'Pinned' : 'Pin Tool'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareCopied ? 'Link Copied!' : t.shareTool}</span>
            </button>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {tool.description}
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% In-Browser &amp; Private</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-blue-500" />
            <span>Instant Results</span>
          </span>
          <span>•</span>
          <span>No Account Required</span>
        </div>
      </div>

      {/* Responsive Top Banner above tool workspace */}
      <AdSlot placement="tool_page_top" />

      {/* The Interactive Tool Interface */}
      <section aria-label="Tool execution workspace">
        <ToolComponentResolver tool={tool} />
      </section>

      {/* Clearly separated sponsored area near results / download controls */}
      <DownloadAd />

      {/* Non-Intrusive Sponsored Slot below tool */}
      <AdBanner position="below-tool" />

      {/* Step-by-Step "How to use" Section */}
      {tool.howToUse && tool.howToUse.length > 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{t.howToUse}</span>
            <span>{tool.name}</span>
          </h2>
          <ol className="space-y-3 pt-2 text-sm text-slate-700 dark:text-slate-300">
            {tool.howToUse.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Key Features */}
      {tool.features && tool.features.length > 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {t.features}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {tool.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Real-world Examples */}
      {tool.examples && tool.examples.length > 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {t.examples}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {tool.examples.map((ex, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{ex.title}</h4>
                <div className="text-xs space-y-1 font-mono">
                  <div className="text-slate-500">Input: <span className="text-slate-800 dark:text-slate-200">{ex.input}</span></div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold">Result: {ex.output}</div>
                </div>
                {ex.explanation && (
                  <p className="text-xs text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700">
                    {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* In-Content Non-Intrusive Sponsored Slot */}
      <InContentAd />

      {/* FAQs Section */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            <span>{t.faqs}</span>
          </h2>
          <FaqAccordion faqs={tool.faqs} />
        </section>
      )}

      {/* Related Tools Carousel / Grid (PRD Section 24 Internal Linking) */}
      {finalRelatedTools.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {t.relatedTools}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {finalRelatedTools.map((relTool) => (
              <ToolCard
                key={relTool.id}
                tool={relTool}
                onSelect={onSelectTool}
                isFavorite={false}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
