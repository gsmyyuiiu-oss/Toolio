import React from 'react';
import { TOOL_CATEGORIES } from '../data/categories';
import { TOOLS_REGISTRY, getToolsByCategory } from '../data/toolsRegistry';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ToolCard } from '../components/common/ToolCard';
import { ToolDefinition } from '../types';
import { SeoManager } from '../seo/SeoManager';
import { IconResolver } from '../components/common/IconResolver';
import { AdSlot } from '../ads/AdSlot';

interface CategoryPageProps {
  categorySlug: string;
  onSelectTool: (tool: ToolDefinition) => void;
  onSelectCategory: (categorySlug: string) => void;
  onNavigateHome: () => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  onSelectTool,
  onSelectCategory,
  onNavigateHome,
}) => {
  const category = TOOL_CATEGORIES.find((c) => c.slug === categorySlug) || TOOL_CATEGORIES[0];
  const tools = getToolsByCategory(category.id);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} — Free Online Tools`,
    description: category.description,
    url: window.location.href,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <SeoManager
        title={`${category.name} — Free Online Tools | Toolio`}
        description={`Explore all free ${category.name.toLowerCase()} tools on Toolio: ${category.description}. Fast, free, and runs in your browser.`}
        canonicalPath={`/category/${category.slug}`}
        schema={schema}
      />

      <Breadcrumb
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Categories' },
          { label: category.name },
        ]}
      />

      {/* Category Banner */}
      <div className={`p-8 sm:p-10 rounded-3xl ${category.bgColor} border space-y-3 text-left`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-xs">
            <span className={category.color}>
              <IconResolver name={category.icon} className="w-6 h-6" />
            </span>
          </div>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${category.badgeColor}`}>
              {tools.length} Tools Available
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              {category.name}
            </h1>
          </div>
        </div>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Tools Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          All {category.name} Utilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {tools.map((tool, idx) => (
            <React.Fragment key={tool.id}>
              <ToolCard tool={tool} onSelect={onSelectTool} />
              {idx === 3 && (
                <AdSlot placement="category_page_in_grid" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Category Bottom Banner Slot */}
      <AdSlot placement="category_page_banner" />

      {/* Other Categories Links */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Explore Other Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {TOOL_CATEGORIES.filter((c) => c.id !== category.id).map((other) => (
            <button
              key={other.id}
              type="button"
              onClick={() => onSelectCategory(other.slug)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition-colors cursor-pointer"
            >
              {other.name} →
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
