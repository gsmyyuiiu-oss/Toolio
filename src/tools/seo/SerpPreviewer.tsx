import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Smartphone, Monitor } from 'lucide-react';

export const SerpPreviewer: React.FC = () => {
  const [title, setTitle] = useState<string>('Percentage Calculator — Free Online Percent Tool | Toolio');
  const [url, setUrl] = useState<string>('https://toolio.pages.dev/tools/percentage-calculator');
  const [desc, setDesc] = useState<string>(
    'Calculate percentages, percentage increases, decreases, and fractions quickly with Toolio’s free, instant online percentage calculator.'
  );
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const titlePixelLength = title.length * 9.5; // approximate 600px desktop truncation limit
  const isTitleTruncated = titlePixelLength > 600;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Page Title</span>
            <span className={isTitleTruncated ? 'text-amber-500 font-bold' : 'text-slate-400'}>
              ~{Math.round(titlePixelLength)}px / 600px {isTitleTruncated ? '(May Truncate)' : '(Good)'}
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Target URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>Meta Description</span>
            <span className={desc.length > 160 ? 'text-amber-500 font-bold' : 'text-slate-400'}>
              {desc.length}/160 chars
            </span>
          </div>
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          ></textarea>
        </div>
      </div>

      {/* Device Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Google Search Appearance
        </span>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
              device === 'desktop'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
              device === 'mobile'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Google Snippet Simulation */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm font-sans">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 text-[10px]">
            T
          </div>
          <div className="truncate">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">Toolio</span>
            <span className="text-[11px] text-slate-400">{url}</span>
          </div>
        </div>

        <h3 className={`font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer ${
          device === 'mobile' ? 'text-base' : 'text-lg'
        }`}>
          {isTitleTruncated ? title.slice(0, 60) + '...' : title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {desc.length > 160 ? desc.slice(0, 157) + '...' : desc}
        </p>
      </div>
    </div>
  );
};
