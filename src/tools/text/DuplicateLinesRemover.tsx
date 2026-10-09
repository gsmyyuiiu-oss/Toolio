import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { ListFilter, ArrowDownAZ, ArrowUpZA } from 'lucide-react';

export const DuplicateLinesRemover: React.FC = () => {
  const [inputLines, setInputLines] = useState<string>(
    'apple\nbanana\norange\napple\ngrape\nbanana\napple\nwatermelon\n'
  );
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [removeEmpty, setRemoveEmpty] = useState<boolean>(true);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('asc');

  let rawLines = inputLines.split('\n');
  const initialCount = rawLines.length;

  if (trimWhitespace) {
    rawLines = rawLines.map((l) => l.trim());
  }

  if (removeEmpty) {
    rawLines = rawLines.filter((l) => l.length > 0);
  }

  // Deduplicate
  const seen = new Set<string>();
  const uniqueLines: string[] = [];

  rawLines.forEach((line) => {
    const key = caseSensitive ? line : line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueLines.push(line);
    }
  });

  if (sortOrder === 'asc') {
    uniqueLines.sort((a, b) => a.localeCompare(b));
  } else if (sortOrder === 'desc') {
    uniqueLines.sort((a, b) => b.localeCompare(a));
  }

  const resultText = uniqueLines.join('\n');
  const removedCount = Math.max(0, initialCount - uniqueLines.length);

  return (
    <div className="space-y-6">
      {/* Settings bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded accent-indigo-600"
            />
            <span>Case Sensitive</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={removeEmpty}
              onChange={(e) => setRemoveEmpty(e.target.checked)}
              className="rounded accent-indigo-600"
            />
            <span>Remove Empty Lines</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="rounded accent-indigo-600"
            />
            <span>Trim Spaces</span>
          </label>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'none' : 'asc')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 cursor-pointer ${
              sortOrder === 'asc'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <ArrowDownAZ className="w-3.5 h-3.5" />
            <span>Sort A-Z</span>
          </button>
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'none' : 'desc')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 cursor-pointer ${
              sortOrder === 'desc'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <ArrowUpZA className="w-3.5 h-3.5" />
            <span>Sort Z-A</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between text-xs text-slate-500 font-semibold">
            <span>Original Text / List ({initialCount} lines):</span>
            <button
              type="button"
              onClick={() => setInputLines('')}
              className="text-slate-400 hover:text-rose-500"
            >
              Clear
            </button>
          </div>
          <textarea
            rows={10}
            value={inputLines}
            onChange={(e) => setInputLines(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          ></textarea>
        </div>

        {/* Output */}
        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Clean List ({uniqueLines.length} lines • {removedCount} removed)
            </span>
            <CopyButton textToCopy={resultText} label="Copy Clean List" size="sm" />
          </div>
          <textarea
            readOnly
            rows={10}
            value={resultText}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs focus:outline-hidden"
          ></textarea>
        </div>
      </div>
    </div>
  );
};
