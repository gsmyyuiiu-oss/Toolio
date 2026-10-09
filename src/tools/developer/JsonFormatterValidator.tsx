import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Braces, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadText } from '../../lib/downloadManager';

export const JsonFormatterValidator: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>(
    '{"name":"Toolio","type":"online-tools","active":true,"features":["calculators","converters","generators"],"stats":{"toolsCount":200,"pricing":"free"}}'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);

  const formatJson = (spaces: number) => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, spaces));
      setErrorMsg(null);
      setIsValid(true);
      trackEvent('tool_complete', { tool: 'json-formatter-validator', action: 'format' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON syntax');
      setIsValid(false);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed));
      setErrorMsg(null);
      setIsValid(true);
      trackEvent('tool_complete', { tool: 'json-formatter-validator', action: 'minify' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON syntax');
      setIsValid(false);
    }
  };

  const sortKeys = () => {
    try {
      const parsed = JSON.parse(inputJson);
      const deepSort = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (Array.isArray(obj)) return obj.map(deepSort);
        return Object.keys(obj)
          .sort()
          .reduce((acc: any, key: string) => {
            acc[key] = deepSort(obj[key]);
            return acc;
          }, {});
      };
      setInputJson(JSON.stringify(deepSort(parsed), null, 2));
      setErrorMsg(null);
      setIsValid(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON syntax');
      setIsValid(false);
    }
  };

  const handleDownload = () => {
    downloadText(inputJson, 'formatted.json', 'application/json', 'json-formatter-validator');
  };

  return (
    <div className="space-y-4">
      {/* Action buttons toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => formatJson(2)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer transition-colors shadow-xs"
          >
            Prettify (2 Spaces)
          </button>
          <button
            type="button"
            onClick={() => formatJson(4)}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 cursor-pointer transition-colors"
          >
            Prettify (4 Spaces)
          </button>
          <button
            type="button"
            onClick={minifyJson}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 cursor-pointer transition-colors"
          >
            Minify (Compact)
          </button>
          <button
            type="button"
            onClick={sortKeys}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 cursor-pointer transition-colors"
          >
            Sort Keys A-Z
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>.json</span>
          </button>
          <CopyButton textToCopy={inputJson} label="Copy JSON" size="sm" />
        </div>
      </div>

      {/* Status banner */}
      {errorMsg ? (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      ) : (
        <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Valid JSON syntax</span>
        </div>
      )}

      {/* Editor container */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 p-4 shadow-xl">
        <textarea
          rows={14}
          value={inputJson}
          onChange={(e) => {
            setInputJson(e.target.value);
            try {
              JSON.parse(e.target.value);
              setErrorMsg(null);
              setIsValid(true);
            } catch (err: any) {
              setErrorMsg(err.message);
              setIsValid(false);
            }
          }}
          className="w-full bg-transparent font-mono text-xs sm:text-sm text-cyan-300 leading-relaxed focus:outline-hidden resize-y"
          placeholder="Paste JSON here..."
          spellCheck={false}
        ></textarea>
      </div>
    </div>
  );
};
