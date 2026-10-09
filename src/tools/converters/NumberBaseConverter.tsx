import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Binary, RotateCcw } from 'lucide-react';

export const NumberBaseConverter: React.FC = () => {
  const [dec, setDec] = useState<string>('255');
  const [bin, setBin] = useState<string>('11111111');
  const [hex, setHex] = useState<string>('FF');
  const [oct, setOct] = useState<string>('377');

  const updateFromDecimal = (val: string) => {
    setDec(val);
    const n = parseInt(val, 10);
    if (!isNaN(n)) {
      setBin(n.toString(2));
      setHex(n.toString(16).toUpperCase());
      setOct(n.toString(8));
    } else {
      setBin('');
      setHex('');
      setOct('');
    }
  };

  const updateFromBinary = (val: string) => {
    setBin(val);
    const n = parseInt(val, 2);
    if (!isNaN(n)) {
      setDec(n.toString(10));
      setHex(n.toString(16).toUpperCase());
      setOct(n.toString(8));
    }
  };

  const updateFromHex = (val: string) => {
    setHex(val);
    const n = parseInt(val, 16);
    if (!isNaN(n)) {
      setDec(n.toString(10));
      setBin(n.toString(2));
      setOct(n.toString(8));
    }
  };

  const updateFromOctal = (val: string) => {
    setOct(val);
    const n = parseInt(val, 8);
    if (!isNaN(n)) {
      setDec(n.toString(10));
      setBin(n.toString(2));
      setHex(n.toString(16).toUpperCase());
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Decimal */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Decimal (Base 10)</span>
          <CopyButton textToCopy={dec} label="Copy" size="sm" />
        </div>
        <input
          type="text"
          value={dec}
          onChange={(e) => updateFromDecimal(e.target.value)}
          placeholder="e.g. 255"
          className="w-full text-xl font-mono font-bold bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden"
        />
      </div>

      {/* Binary */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Binary (Base 2)</span>
          <CopyButton textToCopy={bin} label="Copy" size="sm" />
        </div>
        <input
          type="text"
          value={bin}
          onChange={(e) => updateFromBinary(e.target.value)}
          placeholder="e.g. 11111111"
          className="w-full text-xl font-mono font-bold bg-transparent text-cyan-600 dark:text-cyan-400 focus:outline-hidden"
        />
      </div>

      {/* Hexadecimal */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Hexadecimal (Base 16)</span>
          <CopyButton textToCopy={hex} label="Copy" size="sm" />
        </div>
        <input
          type="text"
          value={hex}
          onChange={(e) => updateFromHex(e.target.value)}
          placeholder="e.g. FF"
          className="w-full text-xl font-mono font-bold bg-transparent text-indigo-600 dark:text-indigo-400 focus:outline-hidden"
        />
      </div>

      {/* Octal */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Octal (Base 8)</span>
          <CopyButton textToCopy={oct} label="Copy" size="sm" />
        </div>
        <input
          type="text"
          value={oct}
          onChange={(e) => updateFromOctal(e.target.value)}
          placeholder="e.g. 377"
          className="w-full text-xl font-mono font-bold bg-transparent text-emerald-600 dark:text-emerald-400 focus:outline-hidden"
        />
      </div>
    </div>
  );
};
