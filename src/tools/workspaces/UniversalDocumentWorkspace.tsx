import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ToolDefinition } from '../../types';
import { CopyButton } from '../../components/common/CopyButton';
import {
  FileText,
  Download,
  CaseSensitive,
  Type,
  Search,
  RotateCcw,
  Sparkles,
  GitCompare,
  Code,
  Image as ImageIcon,
} from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadBlob, downloadDataUrl } from '../../lib/downloadManager';

interface Props {
  tool: ToolDefinition;
}

export const UniversalDocumentWorkspace: React.FC<Props> = ({ tool }) => {
  const [content, setContent] = useState<string>(
    'Toolio is a universal online multi-tool web platform. It provides 200+ free, fast, easy-to-use online tools from one unified website without requiring accounts.'
  );
  const [findWord, setFindWord] = useState<string>('');
  const [replaceWord, setReplaceWord] = useState<string>('');
  const [diffOriginal, setDiffOriginal] = useState<string>('Toolio is a free tools platform.');
  const [diffModified, setDiffModified] = useState<string>('Toolio is a 100% free online tools platform.');

  // Word statistics
  const charCount = content.length;
  const charNoSpaces = content.replace(/\s/g, '').length;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const sentences = content.trim() ? (content.match(/[^.!?]+[.!?]+/g) || []).length || 1 : 0;
  const paragraphs = content.trim() ? content.split(/\n+/).filter(Boolean).length : 0;
  const readingTime = Math.ceil(words / 200);

  // Find and replace
  const handleFindReplace = () => {
    if (!findWord) return;
    const regex = new RegExp(findWord, 'gi');
    setContent(content.replace(regex, replaceWord));
  };

  // Case transforms
  const applyCase = (type: string) => {
    switch (type) {
      case 'upper':
        setContent(content.toUpperCase());
        break;
      case 'lower':
        setContent(content.toLowerCase());
        break;
      case 'title':
        setContent(content.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()));
        break;
      case 'sentence':
        setContent(content.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()));
        break;
      case 'reverse':
        setContent(content.split('').reverse().join(''));
        break;
      case 'sort':
        setContent(content.split('\n').sort().join('\n'));
        break;
      case 'dedup': {
        const lines = content.split('\n');
        setContent(Array.from(new Set(lines)).join('\n'));
        break;
      }
      case 'clean-spaces':
        setContent(content.replace(/[ \t]+/g, ' ').trim());
        break;
      case 'clean-empty':
        setContent(content.split('\n').filter(l => l.trim().length > 0).join('\n'));
        break;
    }
  };

  // Export Text to PDF
  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Toolio Exported Document', 20, 20);
    doc.setFontSize(11);
    const split = doc.splitTextToSize(content, 170);
    doc.text(split, 20, 32);
    const pdfBlob = doc.output('blob');
    downloadBlob(pdfBlob, 'document.pdf', 'text-to-pdf');
  };

  // Export Text to Image
  const handleExportImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Toolio Document Text', 60, 80);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '24px sans-serif';

    const words = content.split(' ');
    let line = '';
    let y = 140;

    for (const w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > 1080) {
        ctx.fillText(line, 60, y);
        line = w + ' ';
        y += 36;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, 60, y);

    const dataUrl = canvas.toDataURL('image/png');
    downloadDataUrl(dataUrl, 'text-image.png', 'text-to-image');
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Words</span>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-0.5">{words}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Characters</span>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-0.5">{charCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Sentences</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{sentences}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Paragraphs</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{paragraphs}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-slate-400 uppercase">Reading Time</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">~{readingTime}m</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyCase('upper')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold"
          >
            UPPERCASE
          </button>
          <button
            type="button"
            onClick={() => applyCase('lower')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold"
          >
            lowercase
          </button>
          <button
            type="button"
            onClick={() => applyCase('title')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold"
          >
            Title Case
          </button>
          <button
            type="button"
            onClick={() => applyCase('clean-spaces')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold"
          >
            Trim Extra Spaces
          </button>
          <button
            type="button"
            onClick={() => applyCase('dedup')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold"
          >
            Deduplicate Lines
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            type="button"
            onClick={handleExportImage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>
          <CopyButton textToCopy={content} label="Copy Text" size="sm" />
        </div>
      </div>

      {/* Find and Replace Bar */}
      {tool.slug.includes('replace') && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs">
          <input
            type="text"
            value={findWord}
            onChange={(e) => setFindWord(e.target.value)}
            placeholder="Find text..."
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-1 min-w-36"
          />
          <input
            type="text"
            value={replaceWord}
            onChange={(e) => setReplaceWord(e.target.value)}
            placeholder="Replace with..."
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-1 min-w-36"
          />
          <button
            type="button"
            onClick={handleFindReplace}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold cursor-pointer"
          >
            Replace All
          </button>
        </div>
      )}

      {/* Editor Main Canvas */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <textarea
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type or paste your document text here..."
          className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm leading-relaxed focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
        ></textarea>
      </div>
    </div>
  );
};
