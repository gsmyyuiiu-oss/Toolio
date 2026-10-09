import React from 'react';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';
import { TOOL_CATEGORIES } from '../data/categories';
import { CopyButton } from '../components/common/CopyButton';
import { Download, Network, CheckCircle2, Search } from 'lucide-react';
import { SeoManager } from '../seo/SeoManager';
import { downloadText } from '../utils/download';

export const SitemapXmlPage: React.FC = () => {
  const today = new Date().toISOString().slice(0, 10);
  const baseUrl = 'https://toolio.pages.dev';

  const xmlEntries = [
    `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    ...TOOL_CATEGORIES.map(
      (cat) => `  <url>
    <loc>${baseUrl}/category/${cat.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
    ...TOOLS_REGISTRY.map(
      (tool) => `  <url>
    <loc>${baseUrl}/tools/${tool.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    ),
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries.join('\n')}
</urlset>`;

  const handleDownload = () => {
    downloadText(sitemapXml, 'sitemap.xml', 'application/xml', 'sitemap');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8">
      <SeoManager
        title="XML Sitemap — Toolio Google Search Console Feed"
        description="Live XML sitemap feed for Toolio with all 200+ indexable tools and category URLs for search engine crawlers."
        canonicalPath="/sitemap.xml"
      />

      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                Google Search Console Ready
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">sitemap.xml Feed</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download XML</span>
            </button>
            <CopyButton textToCopy={sitemapXml} label="Copy XML" size="sm" />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Contains {xmlEntries.length} canonical URLs. Submit this URL directly into your Google Search Console dashboard under <strong>Sitemaps</strong>.
        </p>

        <pre className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
          {sitemapXml}
        </pre>
      </div>

      {/* Google Search Console Verification Checklist */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-500" />
          <span>Google Search Console Integration Steps</span>
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Verify your domain in <strong>Google Search Console</strong> using Cloudflare DNS TXT record or HTML meta tag.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Navigate to <em>Index → Sitemaps</em> and submit <code>https://toolio.pages.dev/sitemap.xml</code>.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Ensure <code>robots.txt</code> allows crawlers to reach all utility endpoints.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>Check Core Web Vitals score (LCP, INP, CLS) in the Experience dashboard.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
