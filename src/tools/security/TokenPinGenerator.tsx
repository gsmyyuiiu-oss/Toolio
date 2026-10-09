import React, { useState, useEffect } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Key, Shield, RefreshCw } from 'lucide-react';

export const TokenPinGenerator: React.FC = () => {
  const [type, setType] = useState<'pin' | 'hex' | 'token'>('pin');
  const [pinLength, setPinLength] = useState<number>(6);
  const [count, setCount] = useState<number>(5);
  const [results, setResults] = useState<string[]>([]);

  const generateCodes = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      if (type === 'pin') {
        const arr = new Uint32Array(pinLength);
        window.crypto.getRandomValues(arr);
        const pin = Array.from(arr).map(n => n % 10).join('');
        list.push(pin);
      } else if (type === 'hex') {
        const arr = new Uint8Array(16);
        window.crypto.getRandomValues(arr);
        const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
        list.push(hex);
      } else {
        const arr = new Uint8Array(24);
        window.crypto.getRandomValues(arr);
        const token = btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_');
        list.push(`sk_live_${token}`);
      }
    }
    setResults(list);
  };

  useEffect(() => {
    generateCodes();
  }, [type, pinLength, count]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Type tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('pin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              type === 'pin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Numeric PIN
          </button>
          <button
            type="button"
            onClick={() => setType('hex')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              type === 'hex' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Hex Secret Key (32-char)
          </button>
          <button
            type="button"
            onClick={() => setType('token')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              type === 'token' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            API Live Token
          </button>
        </div>

        {type === 'pin' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">PIN Length:</span>
            {[4, 6, 8].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setPinLength(l)}
                className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
                  pinLength === l ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                }`}
              >
                {l} Digits
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="p-4 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-cyan-400">
            Generated Codes ({results.length})
          </span>
          <CopyButton textToCopy={results.join('\n')} label="Copy All" size="sm" />
        </div>

        <div className="space-y-2">
          {results.map((code, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300"
            >
              <span>{code}</span>
              <CopyButton textToCopy={code} label="Copy" size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
