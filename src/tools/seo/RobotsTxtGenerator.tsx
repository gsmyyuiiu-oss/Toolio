import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Download, Bot, Plus, Trash2 } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadText } from '../../lib/downloadManager';

export const RobotsTxtGenerator: React.FC = () => {
  const [sitemapUrl, setSitemapUrl] = useState<string>('https://toolio.pages.dev/sitemap.xml');
  const [defaultPolicy, setDefaultPolicy] = useState<'allow' | 'disallow'>('allow');
  const [disallowPaths, setDisallowPaths] = useState<string[]>(['/admin/', '/api/private/', '/tmp/']);
  const [newPath, setNewPath] = useState<string>('');

  const handleAddPath = () => {
    if (newPath.trim() && !disallowPaths.includes(newPath.trim())) {
      setDisallowPaths([...disallowPaths, newPath.trim()]);
      setNewPath('');
    }
  };

  const handleRemovePath = (p: string) => {
    setDisallowPaths(disallowPaths.filter(x => x !== p));
  };

  const robotsContent = `# Toolio Robots.txt
User-agent: *
${defaultPolicy === 'allow' ? 'Allow: /' : 'Disallow: /'}
${disallowPaths.map(p => `Disallow: ${p}`).join('\n')}

# Crawl Delay
Crawl-delay: 1

# XML Sitemap
Sitemap: ${sitemapUrl}
`;

  const handleDownload = () => {
    downloadText(robotsContent, 'robots.txt', 'text/plain', 'robots-txt-generator');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Sitemap XML Location URL:
          </label>
          <input
            type="text"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Default Crawler Access:
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDefaultPolicy('allow')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                defaultPolicy === 'allow'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Allow All (Recommended)
            </button>
            <button
              type="button"
              onClick={() => setDefaultPolicy('disallow')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                defaultPolicy === 'disallow'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Disallow All
            </button>
          </div>
        </div>

        {/* Disallow paths list */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-semibold text-slate-500">
            Disallowed Directories &amp; Paths:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="e.g. /private/ or /cgi-bin/"
              className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
            <button
              type="button"
              onClick={handleAddPath}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {disallowPaths.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs"
              >
                <span>{p}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePath(p)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Output code */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-cyan-400">
            robots.txt Preview
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download robots.txt</span>
            </button>
            <CopyButton textToCopy={robotsContent} label="Copy" size="sm" />
          </div>
        </div>
        <pre className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
          {robotsContent}
        </pre>
      </div>
    </div>
  );
};
