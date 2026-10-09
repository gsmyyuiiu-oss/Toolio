import React, { useState } from 'react';
import { GitCompare, RotateCcw } from 'lucide-react';

export const TextDiffChecker: React.FC = () => {
  const [originalText, setOriginalText] = useState<string>(
    'Toolio is a free online tools platform.\nIt features fast calculators and image tools.\nEnjoy using our tools without sign-up.'
  );
  const [modifiedText, setModifiedText] = useState<string>(
    'Toolio is a 100% free online tools platform.\nIt features fast calculators, converters and image tools.\nEnjoy using 200+ tools without any sign-up or paywall.'
  );

  const origLines = originalText.split('\n');
  const modLines = modifiedText.split('\n');
  const maxLines = Math.max(origLines.length, modLines.length);

  const diffRows = [];
  for (let i = 0; i < maxLines; i++) {
    const o = origLines[i];
    const m = modLines[i];
    const isDiff = o !== m;
    diffRows.push({
      lineNum: i + 1,
      orig: o !== undefined ? o : null,
      mod: m !== undefined ? m : null,
      isDiff,
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Original Version
          </label>
          <textarea
            rows={6}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Modified Version
          </label>
          <textarea
            rows={6}
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          ></textarea>
        </div>
      </div>

      {/* Visual Diff View */}
      <div className="p-4 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-indigo-400" />
            <span className="font-bold">Side-by-Side Comparison</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/40 border border-rose-500"></span>
              Original
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/40 border border-emerald-500"></span>
              Modified
            </span>
          </div>
        </div>

        <div className="font-mono text-xs space-y-1 max-h-80 overflow-y-auto pr-1">
          {diffRows.map((row) => (
            <div
              key={row.lineNum}
              className={`grid grid-cols-1 md:grid-cols-2 gap-2 p-1.5 rounded-lg ${
                row.isDiff ? 'bg-slate-800/80 border border-slate-700/60' : 'hover:bg-slate-800/40'
              }`}
            >
              {/* Left */}
              <div
                className={`p-1.5 rounded overflow-x-auto ${
                  row.isDiff && row.orig !== null ? 'bg-rose-950/60 text-rose-200' : 'text-slate-300'
                }`}
              >
                <span className="text-slate-500 mr-2 select-none">{row.lineNum}</span>
                <span>{row.orig !== null ? row.orig || ' ' : '—'}</span>
              </div>

              {/* Right */}
              <div
                className={`p-1.5 rounded overflow-x-auto ${
                  row.isDiff && row.mod !== null ? 'bg-emerald-950/60 text-emerald-200' : 'text-slate-300'
                }`}
              >
                <span className="text-slate-500 mr-2 select-none">{row.lineNum}</span>
                <span>{row.mod !== null ? row.mod || ' ' : '—'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
