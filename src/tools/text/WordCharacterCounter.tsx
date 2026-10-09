import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Type, RotateCcw } from 'lucide-react';

export const WordCharacterCounter: React.FC = () => {
  const [text, setText] = useState<string>(
    'Toolio is a universal online utility toolbox designed for maximum speed, simplicity, and complete user privacy. All tools run directly in your browser without tracking or accounts.'
  );

  const charCountWithSpaces = text.length;
  const charCountNoSpaces = text.replace(/\s/g, '').length;
  const wordsArray = text.trim() ? text.trim().split(/\s+/) : [];
  const wordCount = wordsArray.length;
  const sentencesCount = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || []).length || 1 : 0;
  const paragraphsCount = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;

  // Reading time (~200 words per minute) & speaking time (~130 wpm)
  const readingTimeMin = Math.ceil(wordCount / 200);
  const speakingTimeMin = Math.ceil(wordCount / 130);

  // Keyword frequency top 5
  const wordFreq: Record<string, number> = {};
  wordsArray.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length > 2) {
      wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    }
  });

  const sortedKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top metrics bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase">Words</span>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
            {wordCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase">Characters</span>
          <div className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
            {charCountWithSpaces}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase">Sentences</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {sentencesCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase">Paragraphs</span>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
            {paragraphsCount}
          </div>
        </div>
      </div>

      {/* Text Area */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Type or paste your text below:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setText('')}
              className="text-slate-400 hover:text-rose-500 transition-colors"
            >
              Clear
            </button>
            <CopyButton textToCopy={text} label="Copy Text" size="sm" />
          </div>
        </div>
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text here..."
          className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
        ></textarea>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Characters (no spaces):</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{charCountNoSpaces}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Reading Time:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">~{readingTimeMin} min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Speaking Time:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">~{speakingTimeMin} min</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="font-semibold text-slate-500 block mb-2">Top Keywords:</span>
          <div className="flex flex-wrap gap-2">
            {sortedKeywords.length > 0 ? (
              sortedKeywords.map(([kw, count]) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono"
                >
                  {kw} <strong className="text-indigo-600 dark:text-indigo-400">({count})</strong>
                </span>
              ))
            ) : (
              <span className="text-slate-400">None detected yet.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
