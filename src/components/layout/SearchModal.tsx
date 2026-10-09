import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, Command } from 'lucide-react';
import { TOOLS_REGISTRY, searchTools } from '../../data/toolsRegistry';
import { TOOL_CATEGORIES } from '../../data/categories';
import { ToolDefinition } from '../../types';
import { IconResolver } from '../common/IconResolver';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  let results: ToolDefinition[] = [];
  if (query.trim()) {
    results = searchTools(query);
  } else if (selectedCategory !== 'all') {
    results = TOOLS_REGISTRY.filter(t => t.category === selectedCategory);
  } else {
    // Show popular tools by default
    results = TOOLS_REGISTRY.filter(t => t.isPopular).slice(0, 10);
  }

  if (selectedCategory !== 'all' && query.trim()) {
    results = results.filter(t => t.category === selectedCategory);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-16 p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh] min-w-0 mx-auto"
        style={{ width: 'min(calc(100% - 24px), 42rem)', maxWidth: 'calc(100vw - 24px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input bar */}
        <div className="flex items-center px-3 sm:px-4 py-3 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 min-w-0 gap-2">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 200+ online tools (e.g., percentage, jpg to png, json, bmi)..."
            className="w-full min-w-0 bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md shrink-0 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 sm:p-1.5 text-[11px] sm:text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center gap-1 font-mono shrink-0 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="category-scroll-container w-full max-w-full border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 min-w-max">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`category-filter-button px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer text-xs ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Categories
            </button>
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`category-filter-button px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto overscroll-y-contain p-2 sm:p-3 divide-y divide-slate-100 dark:divide-slate-800/60 min-w-0 subtle-scrollbar">
          {results.length > 0 ? (
            results.map((tool) => {
              const cat = TOOL_CATEGORIES.find((c) => c.id === tool.category);
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl hover:bg-indigo-50/70 dark:hover:bg-slate-800/70 cursor-pointer transition-colors group min-w-0 gap-2.5 sm:gap-3"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${cat?.bgColor || 'bg-slate-100 dark:bg-slate-800'} border`}>
                      <span className={cat?.color || 'text-slate-600'}>
                        <IconResolver name={tool.icon} className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                          {tool.name}
                        </span>
                        {tool.isPopular && (
                          <span className="text-[9px] sm:text-[10px] bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded shrink-0">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 line-clamp-1 truncate mt-0.5">
                        {tool.shortDesc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 transform group-hover:translate-x-1 transition-all" />
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm">No tools matching "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for "percentage", "compress", "converter", "json", or "age"
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[10px] sm:text-[11px] text-slate-500 flex items-center justify-between min-w-0 gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-700 dark:text-slate-300">
              ESC
            </kbd>
            <span className="hidden xs:inline">to exit</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium truncate">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">200+ Free Tools Ready In-Browser</span>
          </div>
        </div>
      </div>
    </div>
  );
};
