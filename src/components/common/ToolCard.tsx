import React from 'react';
import { Star, ArrowUpRight } from 'lucide-react';
import { ToolDefinition } from '../../types';
import { TOOL_CATEGORIES } from '../../data/categories';
import { IconResolver } from './IconResolver';

interface ToolCardProps {
  tool: ToolDefinition;
  onSelect: (tool: ToolDefinition) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent, tool: ToolDefinition) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const category = TOOL_CATEGORIES.find((c) => c.id === tool.category);
  const accentHex = tool.accentHex || '#6366f1';
  const colorClass = tool.colorClass || 'text-indigo-500';

  return (
    <div
      onClick={() => onSelect(tool)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(tool);
        }
      }}
      style={{
        ['--tool-color' as any]: accentHex,
      }}
      className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-[var(--tool-color)] shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer text-left focus:outline-hidden focus:ring-2 focus:ring-[var(--tool-color)] overflow-hidden w-full min-w-0 max-w-full"
    >
      {/* Decorative colored glow in top-right corner */}
      <div
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: accentHex }}
      />

      <div>
        {/* Top bar: Icon & Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 shadow-xs"
            style={{
              backgroundColor: `${accentHex}15`,
              borderColor: `${accentHex}30`,
              color: accentHex,
            }}
          >
            <IconResolver name={tool.icon} className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.isPopular && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                Popular
              </span>
            )}
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => onToggleFavorite(e, tool)}
                className={`p-1.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  isFavorite ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Pin to favorites'}
                aria-label="Toggle favorite"
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Big Tool Name with prominent color */}
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 group-hover:text-[var(--tool-color)] transition-colors duration-200 flex items-center justify-between tracking-tight">
          <span>{tool.name}</span>
          <ArrowUpRight
            className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-[var(--tool-color)] transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.shortDesc}
        </p>
      </div>

      {/* Bottom Category pill and action */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <span
          className="font-bold text-[11px] px-2 py-0.5 rounded-md"
          style={{
            backgroundColor: `${accentHex}12`,
            color: accentHex,
          }}
        >
          {category?.name?.replace(/\s*\(\d+\)/, '') || 'Online Tool'}
        </span>
        <span
          className="font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200"
          style={{ color: accentHex }}
        >
          Open Tool →
        </span>
      </div>
    </div>
  );
};
