import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Ruler } from 'lucide-react';

export const PixelsToRemConverter: React.FC = () => {
  const [baseSize, setBaseSize] = useState<number>(16);
  const [pixelVal, setPixelVal] = useState<number>(24);
  const [remVal, setRemVal] = useState<number>(1.5);

  const handlePxChange = (px: number) => {
    setPixelVal(px);
    if (baseSize > 0) {
      setRemVal(Math.round((px / baseSize) * 10000) / 10000);
    }
  };

  const handleRemChange = (rem: number) => {
    setRemVal(rem);
    setPixelVal(Math.round(rem * baseSize * 100) / 100);
  };

  const cssRule = `font-size: ${remVal}rem; /* ${pixelVal}px at ${baseSize}px base */`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Base font size selector */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Root Base Font Size (1rem =):
        </span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={baseSize}
            onChange={(e) => {
              const b = Math.max(1, Number(e.target.value));
              setBaseSize(b);
              setRemVal(Math.round((pixelVal / b) * 10000) / 10000);
            }}
            className="w-16 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold"
          />
          <span className="text-slate-500 font-mono">px (default: 16px)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Pixels (px)</label>
          <input
            type="number"
            value={pixelVal}
            onChange={(e) => handlePxChange(Number(e.target.value))}
            className="w-full text-2xl font-black bg-transparent border-b border-indigo-400 py-1 focus:outline-hidden"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-500 mb-1">REM (rem)</label>
          <input
            type="number"
            step="0.0625"
            value={remVal}
            onChange={(e) => handleRemChange(Number(e.target.value))}
            className="w-full text-2xl font-black bg-transparent border-b border-emerald-400 py-1 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Copy CSS */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs flex items-center justify-between border border-slate-800">
        <span>{cssRule}</span>
        <CopyButton textToCopy={cssRule} label="Copy CSS" size="sm" />
      </div>

      {/* Tailwind / Standard Typography Scale */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Standard Tailwind Typography Scale
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { tag: 'text-xs', px: 12, rem: 0.75 },
            { tag: 'text-sm', px: 14, rem: 0.875 },
            { tag: 'text-base', px: 16, rem: 1 },
            { tag: 'text-lg', px: 18, rem: 1.125 },
            { tag: 'text-xl', px: 20, rem: 1.25 },
            { tag: 'text-2xl', px: 24, rem: 1.5 },
            { tag: 'text-3xl', px: 30, rem: 1.875 },
            { tag: 'text-4xl', px: 36, rem: 2.25 },
          ].map((item) => (
            <button
              key={item.tag}
              type="button"
              onClick={() => handlePxChange(item.px)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left hover:border-indigo-400 cursor-pointer"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200">{item.tag}</div>
              <div className="text-slate-500 font-mono text-[11px]">{item.px}px = {item.rem}rem</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
