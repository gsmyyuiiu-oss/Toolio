import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { SearchCode, Check, AlertCircle } from 'lucide-react';

const REGEX_PRESETS = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { label: 'URL', pattern: 'https?:\\/\\/[\\w\\.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&\'\\(\\)\\*\\+,;=.]+' },
  { label: 'IPv4 Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
  { label: 'Phone Number', pattern: '\\+?[0-9]{1,3}?[-. ]?\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})' },
  { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
];

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean }>({ g: true, i: true, m: false });
  const [testText, setTestText] = useState<string>(
    'Contact support@toolio.dev or hello@example.com for help! Do not send to invalid-email@.'
  );

  const activeFlags = `${flags.g ? 'g' : ''}${flags.i ? 'i' : ''}${flags.m ? 'm' : ''}`;
  let matches: string[] = [];
  let error: string | null = null;

  try {
    const reg = new RegExp(pattern, activeFlags);
    const m = testText.match(reg);
    if (m) matches = Array.from(m);
  } catch (err: any) {
    error = err.message;
  }

  return (
    <div className="space-y-6">
      {/* Pattern & Flags */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full flex-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Regular Expression Pattern:
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-mono font-bold text-lg">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full pl-7 pr-20 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
              />
              <span className="absolute right-3 text-slate-400 font-mono font-bold text-sm">
                /{activeFlags}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-5">
            <button
              type="button"
              onClick={() => setFlags({ ...flags, g: !flags.g })}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer ${
                flags.g ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              global (g)
            </button>
            <button
              type="button"
              onClick={() => setFlags({ ...flags, i: !flags.i })}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer ${
                flags.i ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              ignoreCase (i)
            </button>
            <button
              type="button"
              onClick={() => setFlags({ ...flags, m: !flags.m })}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer ${
                flags.m ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              multiline (m)
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 no-scrollbar">
          <span className="text-slate-400 font-medium">Presets:</span>
          {REGEX_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setPattern(p.pattern)}
              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
          Found <strong>{matches.length}</strong> match{matches.length === 1 ? '' : 'es'}
        </div>
      )}

      {/* Test String */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
          Test String:
        </label>
        <textarea
          rows={5}
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
        ></textarea>
      </div>

      {/* Matches List */}
      {matches.length > 0 && (
        <div className="p-4 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Captured Matches:
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {matches.map((m, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono text-xs text-cyan-300 font-bold"
              >
                #{idx + 1}: {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
