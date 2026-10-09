import React, { useState } from 'react';
import { TOOL_CATEGORIES } from '../data/categories';
import { TOOLS_REGISTRY, searchTools } from '../data/toolsRegistry';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ToolCard } from '../components/common/ToolCard';
import { ToolDefinition } from '../types';
import { SeoManager } from '../seo/SeoManager';
import { AdSlot } from '../ads/AdSlot';
import { Search, Sparkles } from 'lucide-react';

interface AllToolsPageProps {
  onSelectTool: (tool: ToolDefinition) => void;
  onNavigateHome: () => void;
}

export const AllToolsPage: React.FC<AllToolsPageProps> = ({
  onSelectTool,
  onNavigateHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  let displayedTools = TOOLS_REGISTRY;

  if (searchQuery.trim()) {
    displayedTools = searchTools(searchQuery);
  }

  if (activeCategory !== 'all') {
    displayedTools = displayedTools.filter((t) => t.category === activeCategory);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <SeoManager
        title="All 200+ Free Online Tools Directory | Toolio"
        description="Browse the complete catalog of 200+ free online tools for calculators, converters, image compressors, developer utilities, and SEO."
        canonicalPath="/tools"
      />

      <Breadcrumb
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'All Tools' },
        ]}
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          All 200+ Free Online Tools
        </h1>
        <p className="text-sm text-slate-500">
          Fast, browser-based utilities organized by category. Zero signup required.
        </p>

        {/* Live Search Input */}
        <div className="relative mt-4">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools by name, tag, or function..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-scroll-container w-full max-w-full py-1 pb-3 px-0.5">
        <div className="flex items-center gap-2 min-w-max justify-start sm:justify-center">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`category-filter-button px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
            }`}
          >
            All ({TOOLS_REGISTRY.length})
          </button>
          {TOOL_CATEGORIES.map((cat) => {
            const count = TOOLS_REGISTRY.filter((t) => t.category === cat.id).length;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`category-filter-button px-3.5 py-2 rounded-xl text-xs whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30 font-bold'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedTools.map((tool, idx) => (
          <React.Fragment key={tool.id}>
            <ToolCard tool={tool} onSelect={onSelectTool} />
            {idx === 3 && (
              <AdSlot placement="all_tools_in_grid" />
            )}
          </React.Fragment>
        ))}
      </div>

      {displayedTools.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          No tools matched your search "{searchQuery}".
        </div>
      )}
    </div>
  );
};
