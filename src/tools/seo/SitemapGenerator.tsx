import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Download, Network } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadText } from '../../lib/downloadManager';

export const SitemapGenerator: React.FC = () => {
  const [urlsInput, setUrlsInput] = useState<string>(
    'https://toolio.pages.dev/\nhttps://toolio.pages.dev/tools/percentage-calculator\nhttps://toolio.pages.dev/tools/image-compressor\nhttps://toolio.pages.dev/tools/qr-code-generator\nhttps://toolio.pages.dev/tools/json-formatter-validator\nhttps://toolio.pages.dev/tools/bmi-calculator'
  );
  const [frequency, setFrequency] = useState<string>('weekly');
  const [priority, setPriority] = useState<string>('0.8');

  const today = new Date().toISOString().slice(0, 10);
  const urlList = urlsInput
    .split('\n')
    .map(u => u.trim())
    .filter(Boolean);

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlList
  .map(
    (u) => `  <url>
    <loc>${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${frequency}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const handleDownload = () => {
    downloadText(sitemapXml, 'sitemap.xml', 'application/xml', 'sitemap-generator');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Website URLs (One per line):
          </label>
          <textarea
            rows={5}
            value={urlsInput}
            onChange={(e) => setUrlsInput(e.target.value)}
            className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Change Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="always">always</option>
              <option value="hourly">hourly</option>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
              <option value="monthly">monthly</option>
              <option value="yearly">yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="1.0">1.0 (Homepage)</option>
              <option value="0.8">0.8 (High priority)</option>
              <option value="0.6">0.6 (Standard)</option>
              <option value="0.4">0.4 (Low priority)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-cyan-400">
            sitemap.xml Output ({urlList.length} URLs)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download sitemap.xml</span>
            </button>
            <CopyButton textToCopy={sitemapXml} label="Copy XML" size="sm" />
          </div>
        </div>
        <pre className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-60">
          {sitemapXml}
        </pre>
      </div>
    </div>
  );
};
