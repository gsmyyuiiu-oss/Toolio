import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { HardDrive } from 'lucide-react';

export const FileSizeConverter: React.FC = () => {
  const [bytes, setBytes] = useState<number>(10485760); // 10 MB default
  const [standard, setStandard] = useState<'binary' | 'decimal'>('binary');

  const base = standard === 'binary' ? 1024 : 1000;

  const kb = bytes / base;
  const mb = kb / base;
  const gb = mb / base;
  const tb = gb / base;

  const handleUpdate = (val: number, multiplier: number) => {
    setBytes(val * multiplier);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Standard switch */}
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-500">Unit Standard:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStandard('binary')}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
              standard === 'binary'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Binary IEC (1 KiB = 1024 Bytes)
          </button>
          <button
            type="button"
            onClick={() => setStandard('decimal')}
            className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
              standard === 'decimal'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Decimal SI (1 KB = 1000 Bytes)
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Bytes */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>Bytes (B)</span>
            <CopyButton textToCopy={bytes.toString()} label="Copy" size="sm" />
          </div>
          <input
            type="number"
            value={bytes}
            onChange={(e) => setBytes(Number(e.target.value))}
            className="w-full text-lg font-mono font-bold bg-transparent text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* KB */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>{standard === 'binary' ? 'Kibibytes (KiB)' : 'Kilobytes (KB)'}</span>
            <CopyButton textToCopy={kb.toFixed(4)} label="Copy" size="sm" />
          </div>
          <input
            type="number"
            value={Number(kb.toFixed(4))}
            onChange={(e) => handleUpdate(Number(e.target.value), base)}
            className="w-full text-lg font-mono font-bold bg-transparent text-indigo-600 dark:text-indigo-400"
          />
        </div>

        {/* MB */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>{standard === 'binary' ? 'Mebibytes (MiB)' : 'Megabytes (MB)'}</span>
            <CopyButton textToCopy={mb.toFixed(4)} label="Copy" size="sm" />
          </div>
          <input
            type="number"
            value={Number(mb.toFixed(4))}
            onChange={(e) => handleUpdate(Number(e.target.value), base * base)}
            className="w-full text-lg font-mono font-bold bg-transparent text-cyan-600 dark:text-cyan-400"
          />
        </div>

        {/* GB */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>{standard === 'binary' ? 'Gibibytes (GiB)' : 'Gigabytes (GB)'}</span>
            <CopyButton textToCopy={gb.toFixed(4)} label="Copy" size="sm" />
          </div>
          <input
            type="number"
            value={Number(gb.toFixed(4))}
            onChange={(e) => handleUpdate(Number(e.target.value), base * base * base)}
            className="w-full text-lg font-mono font-bold bg-transparent text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};
