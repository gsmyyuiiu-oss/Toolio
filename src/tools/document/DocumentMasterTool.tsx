import React, { useState, useEffect } from 'react';
import {
  Copy, Check, Download, RefreshCw, Type, AlignLeft,
  Clock, Hash, ListFilter, ArrowUpDown, FlipHorizontal,
  Eraser, GitCompare, Replace, BookOpen, FileEdit, Eye,
  Code, Image as ImageIcon, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { ToolDefinition } from '../../types';
import { downloadText, downloadBlob } from '../../utils/download';

interface Props {
  tool: ToolDefinition;
}

export const DocumentMasterTool: React.FC<Props> = ({ tool }) => {
  const [text, setText] = useState<string>(
    'Toolio is a universal online toolbox featuring 200+ fast, free, and privacy-first online tools.\nAll transformations happen directly in your browser memory.\nNo personal data is collected or uploaded to any server.'
  );
  const [secondaryText, setSecondaryText] = useState<string>(
    'Toolio is an awesome toolbox with 200+ free online tools.\nAll processes occur locally in your browser memory.'
  );
  const [findWord, setFindWord] = useState<string>('');
  const [replaceWord, setReplaceWord] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Live text metrics
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;
  const readingTimeMin = (words / 200).toFixed(1);
  const speakingTimeMin = (words / 130).toFixed(1);

  // Auto configure transformation based on tool slug
  useEffect(() => {
    const slug = tool.slug;
    if (slug === 'uppercase-converter') {
      setText((prev) => prev.toUpperCase());
    } else if (slug === 'lowercase-converter') {
      setText((prev) => prev.toLowerCase());
    } else if (slug === 'remove-empty-lines') {
      setText((prev) => prev.split('\n').filter((l) => l.trim().length > 0).join('\n'));
    } else if (slug === 'remove-extra-spaces') {
      setText((prev) => prev.replace(/[ \t]+/g, ' ').trim());
    }
  }, [tool.slug]);

  // Casing Converters
  const applyCasing = (mode: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab') => {
    if (mode === 'upper') setText(text.toUpperCase());
    else if (mode === 'lower') setText(text.toLowerCase());
    else if (mode === 'title') {
      setText(
        text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase())
      );
    } else if (mode === 'sentence') {
      setText(
        text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
      );
    } else if (mode === 'camel') {
      const wordsArr = text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/);
      setText(
        wordsArr.map((w, i) => (i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))).join('')
      );
    } else if (mode === 'snake') {
      setText(text.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, ''));
    } else if (mode === 'kebab') {
      setText(text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, ''));
    }
  };

  // Duplicate remover
  const removeDuplicates = () => {
    const lines = text.split('\n');
    const unique = Array.from(new Set(lines));
    setText(unique.join('\n'));
  };

  // Text sorting
  const sortLines = (direction: 'asc' | 'desc') => {
    const lines = text.split('\n');
    lines.sort((a, b) => (direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a)));
    setText(lines.join('\n'));
  };

  // Text reverser
  const reverseText = (mode: 'chars' | 'words' | 'lines') => {
    if (mode === 'chars') setText(text.split('').reverse().join(''));
    else if (mode === 'words') setText(text.split(' ').reverse().join(' '));
    else if (mode === 'lines') setText(text.split('\n').reverse().join('\n'));
  };

  // Find & Replace
  const handleFindReplace = () => {
    if (!findWord) return;
    const regex = new RegExp(findWord, 'g');
    setText(text.replace(regex, replaceWord));
  };

  // Lorem Ipsum generator
  const generateLorem = (paraCount: number) => {
    const sampleParas = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.'
    ];
    setText(Array.from({ length: paraCount }, (_, i) => sampleParas[i % sampleParas.length]).join('\n\n'));
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Download as TXT or PDF
  const handleDownload = async (format: 'txt' | 'pdf') => {
    if (format === 'txt') {
      await downloadText(text, `${tool.slug}.txt`, 'text/plain', tool.slug);
    } else {
      const doc = new jsPDF();
      doc.setFontSize(12);
      const splitLines = doc.splitTextToSize(text, 170);
      doc.text(splitLines, 20, 20);
      const pdfBlob = doc.output('blob');
      await downloadBlob(pdfBlob, `${tool.slug}.pdf`, tool.slug);
    }

    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Live Text Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Words</p>
          <p className="text-2xl font-black text-cyan-500 mt-1">{words}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Characters</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{characters}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">No Spaces</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{charsNoSpaces}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sentences</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{sentences}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Paragraphs</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{paragraphs}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Reading Time</p>
          <p className="text-2xl font-black text-emerald-500 mt-1">{readingTimeMin}m</p>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => applyCasing('upper')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 rounded-lg transition"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => applyCasing('lower')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 rounded-lg transition"
            >
              lowercase
            </button>
            <button
              onClick={() => applyCasing('title')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 rounded-lg transition"
            >
              Title Case
            </button>
            <button
              onClick={() => applyCasing('sentence')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 rounded-lg transition"
            >
              Sentence Case
            </button>
            <button
              onClick={removeDuplicates}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 rounded-lg transition"
            >
              Deduplicate Lines
            </button>
            <button
              onClick={() => sortLines('asc')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 rounded-lg transition"
            >
              Sort A-Z
            </button>
            <button
              onClick={() => reverseText('chars')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 rounded-lg transition"
            >
              Reverse Chars
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {isCopied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={() => handleDownload('txt')}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Save TXT
            </button>
            <button
              onClick={() => handleDownload('pdf')}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Save PDF
            </button>
          </div>
        </div>

        {/* Find & Replace Bar */}
        {tool.slug === 'find-and-replace' && (
          <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <input
              type="text"
              placeholder="Find text..."
              value={findWord}
              onChange={(e) => setFindWord(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded-lg flex-1"
            />
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceWord}
              onChange={(e) => setReplaceWord(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded-lg flex-1"
            />
            <button
              onClick={handleFindReplace}
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-lg cursor-pointer transition"
            >
              Replace All
            </button>
          </div>
        )}

        {/* Lorem Generator Bar */}
        {tool.slug === 'lorem-ipsum-generator' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Quick Generate:</span>
            {[1, 2, 3, 5].map((n) => (
              <button
                key={n}
                onClick={() => generateLorem(n)}
                className="px-3 py-1 text-xs bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold rounded-lg border border-cyan-200 dark:border-cyan-800"
              >
                {n} {n === 1 ? 'Paragraph' : 'Paragraphs'}
              </button>
            ))}
          </div>
        )}

        {/* Text Diff Checker Dual Area */}
        {tool.slug === 'text-diff-checker' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Original Text A</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-xs focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">Modified Text B</label>
              <textarea
                value={secondaryText}
                onChange={(e) => setSecondaryText(e.target.value)}
                rows={10}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-xs focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        ) : (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={12}
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-cyan-500 leading-relaxed"
            placeholder="Type or paste your text content here..."
          />
        )}
      </div>
    </div>
  );
};
