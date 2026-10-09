import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Globe, Search, Sparkles } from 'lucide-react';

export const MetaTagGenerator: React.FC = () => {
  const [title, setTitle] = useState<string>('Toolio — Free Online Tools for Everyone | 200+ Fast Utilities');
  const [description, setDescription] = useState<string>(
    'Toolio is a universal online utility platform featuring 200+ free, fast, browser-powered tools: calculators, unit converters, image compressors, developer tools, and SEO utilities.'
  );
  const [url, setUrl] = useState<string>('https://toolio.pages.dev');
  const [ogImage, setOgImage] = useState<string>('https://toolio.pages.dev/og-cover.png');
  const [keywords, setKeywords] = useState<string>('free online tools, calculator, image compressor, json formatter, converter');

  const metaHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<link rel="canonical" href="${url}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${ogImage}">

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${ogImage}">`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Form Inputs */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Site Title</span>
              <span className={title.length > 60 ? 'text-amber-500' : 'text-slate-400'}>
                {title.length}/60 chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
              <span>Meta Description</span>
              <span className={description.length > 160 ? 'text-amber-500' : 'text-slate-400'}>
                {description.length}/160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Canonical URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">OpenGraph Image URL</label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>
        </div>

        {/* Live Google Search Preview */}
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Google Search Snippet Preview
          </span>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-[11px] text-slate-500 flex items-center gap-1 font-sans">
              <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 inline-block"></span>
              <span className="truncate">{url}</span>
            </div>
            <h4 className="text-base text-indigo-700 dark:text-indigo-400 font-semibold hover:underline cursor-pointer truncate">
              {title || 'Page Title'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {description || 'Page meta description snippet appears here.'}
            </p>
          </div>
        </div>
      </div>

      {/* Generated Code */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-cyan-400">
            Generated HTML &lt;head&gt; Meta Tags
          </span>
          <CopyButton textToCopy={metaHtml} label="Copy HTML Code" size="sm" />
        </div>
        <pre className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-60">
          {metaHtml}
        </pre>
      </div>
    </div>
  );
};
