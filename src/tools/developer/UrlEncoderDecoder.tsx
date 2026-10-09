import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Globe, ArrowLeftRight } from 'lucide-react';

export const UrlEncoderDecoder: React.FC = () => {
  const [urlInput, setUrlInput] = useState<string>(
    'https://toolio.pages.dev/search?q=percentage calculator&category=calculators&lang=en'
  );
  const [encodedOutput, setEncodedOutput] = useState<string>(
    'https%3A%2F%2Ftoolio.pages.dev%2Fsearch%3Fq%3Dpercentage%20calculator%26category%3Dcalculators%26lang%3Den'
  );

  const handleEncode = () => {
    setEncodedOutput(encodeURIComponent(urlInput));
  };

  const handleDecode = () => {
    try {
      setUrlInput(decodeURIComponent(encodedOutput));
    } catch {
      // ignore
    }
  };

  // Parse query params if URL contains ?
  const queryParams: { key: string; val: string }[] = [];
  try {
    const qIndex = urlInput.indexOf('?');
    if (qIndex !== -1) {
      const qStr = urlInput.substring(qIndex + 1);
      const params = new URLSearchParams(qStr);
      params.forEach((v, k) => queryParams.push({ key: k, val: v }));
    }
  } catch {
    // ignore
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleEncode}
          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
        >
          Encode URI Component
        </button>
        <button
          type="button"
          onClick={handleDecode}
          className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs cursor-pointer"
        >
          Decode URI Component
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Decoded */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Decoded / Normal URL</span>
            <CopyButton textToCopy={urlInput} label="Copy" size="sm" />
          </div>
          <textarea
            rows={6}
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              setEncodedOutput(encodeURIComponent(e.target.value));
            }}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          ></textarea>
        </div>

        {/* Encoded */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Percent-Encoded String</span>
            <CopyButton textToCopy={encodedOutput} label="Copy" size="sm" />
          </div>
          <textarea
            rows={6}
            value={encodedOutput}
            onChange={(e) => {
              setEncodedOutput(e.target.value);
              try {
                setUrlInput(decodeURIComponent(e.target.value));
              } catch {}
            }}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          ></textarea>
        </div>
      </div>

      {/* Query Parameters Breakdown */}
      {queryParams.length > 0 && (
        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Parsed Query Parameters ({queryParams.length})
          </span>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {queryParams.map((p, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between font-mono">
                <span className="font-bold text-slate-700 dark:text-slate-300">{p.key}</span>
                <span className="text-cyan-600 dark:text-cyan-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {p.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
