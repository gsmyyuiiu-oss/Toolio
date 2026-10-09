import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { FileCode2, Eye } from 'lucide-react';

export const MarkdownPreviewer: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`# Welcome to Toolio 🛠️

Toolio provides **200+ free online tools** designed for everyday productivity!

### Key Advantages:
- 🚀 **Lightning Fast** — Runs locally in your browser
- 🔒 **100% Private** — Zero uploads or tracking
- 🌐 **100+ Languages** — Global accessibility

\`\`\`javascript
// Quick example of Toolio utility
const tool = "Percentage Calculator";
console.log(\`Running \${tool} locally!\`);
\`\`\`

> *"Search → Open Tool → Complete Task → Copy Result → Leave"*
`);

  // Simple clean markdown parser for instant live preview
  const parseMarkdownToHtml = (md: string): string => {
    let html = md
      // Escape HTML entities
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-extrabold mt-5 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black mt-2 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">$1</h1>')
      // Blockquote
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 italic my-3 text-slate-500">$1</blockquote>')
      // Bold & Italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-slate-900 text-cyan-300 p-3 rounded-xl font-mono text-xs my-3 overflow-x-auto"><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code class="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-600 dark:text-indigo-400">$1</code>')
      // Unordered lists
      .replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      // Paragraph breaks
      .replace(/\n$/gim, '<br />');

    return html;
  };

  const renderedHtml = parseMarkdownToHtml(markdown);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Split Screen Markdown Editor</span>
        <CopyButton textToCopy={renderedHtml} label="Copy Rendered HTML" size="sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Markdown Source</span>
          </div>
          <textarea
            rows={14}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          ></textarea>
        </div>

        {/* Live Preview */}
        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Live Formatted Preview</span>
          </div>
          <div
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-h-[300px] max-h-[360px] overflow-y-auto text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          ></div>
        </div>
      </div>
    </div>
  );
};
