import React, { useState } from 'react';
import {
  Search, Globe, Share2, Twitter, Copy, Check, Eye,
  Compass, Link, Bot, QrCode, FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

export const SeoMasterTool: React.FC<Props> = ({ tool }) => {
  const [pageTitle, setPageTitle] = useState<string>('Toolio — Free Online Tools for Everyone');
  const [metaDescription, setMetaDescription] = useState<string>(
    '200+ fast, free, and privacy-first online tools for converters, image editing, developers, and calculators.'
  );
  const [canonicalUrl, setCanonicalUrl] = useState<string>('https://toolio.dev/tools');
  const [utmSource, setUtmSource] = useState<string>('newsletter');
  const [utmMedium, setUtmMedium] = useState<string>('email');
  const [utmCampaign, setUtmCampaign] = useState<string>('launch_promo');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Live characters metrics
  const titleChars = pageTitle.length;
  const descChars = metaDescription.length;

  const fullUtmUrl = `${canonicalUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;

  const generatedHtmlSnippet = `<!-- Primary Meta Tags -->
<title>${pageTitle}</title>
<meta name="title" content="${pageTitle}" />
<meta name="description" content="${metaDescription}" />
<link rel="canonical" href="${canonicalUrl}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonicalUrl}" />
<meta property="og:title" content="${pageTitle}" />
<meta property="og:description" content="${metaDescription}" />

<!-- Twitter / X Cards -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${canonicalUrl}" />
<meta property="twitter:title" content="${pageTitle}" />
<meta property="twitter:description" content="${metaDescription}" />`;

  const handleGenerateQr = async () => {
    try {
      const url = await QRCode.toDataURL(canonicalUrl, { width: 300, margin: 2 });
      setQrDataUrl(url);
      confetti({ particleCount: 30, spread: 50 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Editor & Preview Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>Page Title</span>
              <span className={titleChars > 60 ? 'text-amber-500' : 'text-emerald-500'}>
                {titleChars}/60 Chars {titleChars <= 60 ? '✅ Ideal' : '⚠️ Too Long'}
              </span>
            </div>
            <input
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-sm font-semibold"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
              <span>Meta Description</span>
              <span className={descChars > 160 ? 'text-amber-500' : 'text-emerald-500'}>
                {descChars}/160 Chars {descChars <= 160 ? '✅ Ideal' : '⚠️ Too Long'}
              </span>
            </div>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block">Canonical Target URL</label>
            <input
              type="text"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-sm font-mono"
            />
          </div>
        </div>

        {/* Live Google Search SERP Preview */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live Google SERP Desktop Preview
          </p>
          <div className="space-y-1">
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{canonicalUrl}</p>
            <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
              {pageTitle}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {metaDescription}
            </p>
          </div>
        </div>

        {/* Generated Meta Tags Snippet */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400">
              HTML Head Meta Code Snippet
            </span>
            <button
              onClick={() => handleCopy(generatedHtmlSnippet)}
              className="px-3 py-1 bg-lime-500 hover:bg-lime-600 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {isCopied ? 'Copied' : 'Copy HTML'}
            </button>
          </div>
          <pre className="p-4 bg-slate-950 text-lime-400 font-mono text-xs rounded-2xl overflow-x-auto leading-relaxed border border-slate-800">
            {generatedHtmlSnippet}
          </pre>
        </div>

        {/* QR Code generator button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleGenerateQr}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            <QrCode className="w-4 h-4 text-lime-600" /> Generate Scannable QR Code for URL
          </button>
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR Code" className="w-20 h-20 rounded-xl border p-1 bg-white" />
          )}
        </div>
      </div>
    </div>
  );
};
