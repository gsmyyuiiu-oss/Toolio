import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Link2 } from 'lucide-react';

export const SlugGenerator: React.FC = () => {
  const [headline, setHeadline] = useState<string>(
    '10 Amazing Tips for Building Modern Web Applications in 2026!'
  );
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = useState<boolean>(true);

  const generateSlug = (text: string) => {
    let s = text
      .normalize('NFD') // decompose accented letters
      .replace(/[\u0300-\u036f]/g, '') // remove accent diacritics
      .replace(/[^\w\s-]/g, '') // remove non-alphanumeric except hyphen and space
      .trim()
      .replace(/[-\s]+/g, separator); // replace spaces/hyphens with chosen separator

    return lowercase ? s.toLowerCase() : s;
  };

  const slug = generateSlug(headline);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Article Title / Headline:
          </label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full text-base font-medium px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-2">
          <div className="flex items-center gap-3">
            <span className="text-slate-500">Separator:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setSeparator('-')}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                  separator === '-'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Hyphen (-)
              </button>
              <button
                type="button"
                onClick={() => setSeparator('_')}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                  separator === '_'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Underscore (_)
              </button>
            </div>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded accent-indigo-600"
            />
            <span>Force Lowercase</span>
          </label>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="uppercase font-bold tracking-wider text-emerald-400">SEO-Friendly URL Slug</span>
          <CopyButton textToCopy={slug} label="Copy Slug" size="sm" />
        </div>
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-cyan-300 text-sm break-all">
          {slug}
        </div>
        <div className="text-[11px] text-slate-500 pt-1">
          Full URL preview: <span className="text-slate-300">https://yoursite.com/blog/{slug}</span>
        </div>
      </div>
    </div>
  );
};
