import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Megaphone, ExternalLink } from 'lucide-react';

export const UtmBuilder: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState<string>('https://toolio.pages.dev/tools/image-compressor');
  const [source, setSource] = useState<string>('newsletter');
  const [medium, setMedium] = useState<string>('email');
  const [campaign, setCampaign] = useState<string>('launch_promo');
  const [term, setTerm] = useState<string>('free_tools');
  const [content, setContent] = useState<string>('hero_cta');

  const buildUrl = () => {
    try {
      if (!baseUrl.trim()) return '';
      const url = new URL(baseUrl.trim());
      if (source.trim()) url.searchParams.set('utm_source', source.trim());
      if (medium.trim()) url.searchParams.set('utm_medium', medium.trim());
      if (campaign.trim()) url.searchParams.set('utm_campaign', campaign.trim());
      if (term.trim()) url.searchParams.set('utm_term', term.trim());
      if (content.trim()) url.searchParams.set('utm_content', content.trim());
      return url.toString();
    } catch {
      return baseUrl;
    }
  };

  const finalUrl = buildUrl();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Website URL (Required):
          </label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com/page"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-medium focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Campaign Source (utm_source):
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. google, twitter, newsletter"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Campaign Medium (utm_medium):
            </label>
            <input
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="e.g. cpc, email, banner, social"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Campaign Name (utm_campaign):
            </label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="e.g. spring_sale, summer_promo"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Campaign Content (utm_content):
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. button_blue, logo_link"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-cyan-400">
            Generated Tracked URL (GA4 Ready)
          </span>
          <CopyButton textToCopy={finalUrl} label="Copy Tracked Link" size="sm" />
        </div>
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-cyan-300 text-xs break-all select-all">
          {finalUrl}
        </div>
      </div>
    </div>
  );
};
