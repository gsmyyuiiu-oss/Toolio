import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { CaseSensitive, RotateCcw } from 'lucide-react';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState<string>('Hello world, welcome to Toolio online utilities platform!');

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
      .replace(/\s+/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const toKebabCase = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const toAlternatingCase = (str: string) => {
    return str
      .split('')
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join('');
  };

  return (
    <div className="space-y-6">
      {/* Transformation buttons grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setText(text.toUpperCase())}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-xs"
        >
          UPPERCASE
        </button>
        <button
          type="button"
          onClick={() => setText(text.toLowerCase())}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-xs"
        >
          lowercase
        </button>
        <button
          type="button"
          onClick={() => setText(toTitleCase(text))}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-xs"
        >
          Title Case
        </button>
        <button
          type="button"
          onClick={() => setText(toSentenceCase(text))}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-xs"
        >
          Sentence case
        </button>
        <button
          type="button"
          onClick={() => setText(toCamelCase(text))}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-xs"
        >
          camelCase
        </button>
        <button
          type="button"
          onClick={() => setText(toSnakeCase(text))}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-xs"
        >
          snake_case
        </button>
        <button
          type="button"
          onClick={() => setText(toKebabCase(text))}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-xs"
        >
          kebab-case
        </button>
        <button
          type="button"
          onClick={() => setText(toAlternatingCase(text))}
          className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-xs"
        >
          aLtErNaTiNg
        </button>
      </div>

      {/* Text Area */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Converted Output / Editable Input:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setText('')}
              className="text-slate-400 hover:text-rose-500 transition-colors"
            >
              Clear
            </button>
            <CopyButton textToCopy={text} label="Copy Output" size="sm" />
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
    </div>
  );
};
