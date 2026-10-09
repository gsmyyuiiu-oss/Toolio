import React from 'react';
import { Search, Home, ArrowRight } from 'lucide-react';
import { getPopularTools } from '../data/toolsRegistry';
import { ToolDefinition } from '../types';
import { ToolCard } from '../components/common/ToolCard';
import { SeoManager } from '../seo/SeoManager';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onOpenSearch: () => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onOpenSearch,
  onSelectTool,
}) => {
  const popularTools = getPopularTools().slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-8">
      <SeoManager
        title="404 — Tool Not Found | Toolio"
        description="The tool or page you requested could not be found. Search our catalog of 200+ free online utilities."
      />

      <div className="space-y-3">
        <span className="text-6xl font-black text-indigo-600 dark:text-indigo-400">404</span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Oops! Tool Not Found
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The utility you are looking for might have been renamed or moved. Use the search bar below or explore our popular tools.
        </p>

        <div className="flex justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>Search 200+ Tools</span>
          </button>
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </button>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-left space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Popular Tools You Might Need:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {popularTools.map((t) => (
            <ToolCard key={t.id} tool={t} onSelect={onSelectTool} />
          ))}
        </div>
      </div>
    </div>
  );
};
