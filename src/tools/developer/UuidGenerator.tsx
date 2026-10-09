import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { RefreshCw, Key } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

export const UuidGenerator: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generateUuidV4 = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback using crypto.getRandomValues
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  };

  const handleGenerate = () => {
    const list: string[] = [];
    const count = Math.min(100, Math.max(1, quantity));
    for (let i = 0; i < count; i++) {
      let u = generateUuidV4();
      if (removeHyphens) u = u.replace(/-/g, '');
      if (uppercase) u = u.toUpperCase();
      list.push(u);
    }
    setUuids(list);
    trackEvent('tool_complete', { tool: 'uuid-generator', count });
  };

  // Generate on first render
  React.useEffect(() => {
    handleGenerate();
  }, []);

  const allUuidsText = uuids.join('\n');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">Quantity:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-center text-sm"
            />
            <span className="text-xs text-slate-400">(Max 100)</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              <span>Uppercase</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={removeHyphens}
                onChange={(e) => setRemoveHyphens(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              <span>No Hyphens</span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate UUIDs</span>
          </button>
        </div>
      </div>

      {/* UUID List Display */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-cyan-400">
            Generated Version 4 UUIDs ({uuids.length})
          </span>
          <CopyButton textToCopy={allUuidsText} label="Copy All UUIDs" size="sm" />
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {uuids.map((u, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-cyan-300 hover:border-indigo-500 transition-colors"
            >
              <span className="truncate pr-2">{u}</span>
              <CopyButton textToCopy={u} label="Copy" size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
