import React from 'react';
import { CopyButton } from '../components/common/CopyButton';
import { Download, Bot } from 'lucide-react';
import { SeoManager } from '../seo/SeoManager';
import { downloadText } from '../utils/download';

export const RobotsTxtPage: React.FC = () => {
  const robotsText = `# Toolio robots.txt
User-agent: *
Allow: /

# Exclude private dev artifacts
Disallow: /api/private/

# XML Sitemap
Sitemap: https://toolio.pages.dev/sitemap.xml
`;

  const handleDownload = () => {
    downloadText(robotsText, 'robots.txt', 'text/plain', 'robots');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      <SeoManager
        title="robots.txt — Toolio Search Crawler Policy"
        description="Search engine crawler policy and sitemap directives for Toolio."
        canonicalPath="/robots.txt"
      />

      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                Webmaster Directive
              </span>
              <h1 className="text-2xl font-black">robots.txt Directives</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <CopyButton textToCopy={robotsText} label="Copy" size="sm" />
          </div>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
          {robotsText}
        </pre>
      </div>
    </div>
  );
};
