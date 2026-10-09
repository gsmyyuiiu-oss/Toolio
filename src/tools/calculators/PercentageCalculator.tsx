import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { RotateCcw } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

export const PercentageCalculator: React.FC = () => {
  // Mode 1: What is X% of Y?
  const [val1A, setVal1A] = useState<string>('15');
  const [val1B, setVal1B] = useState<string>('240');

  // Mode 2: X is what % of Y?
  const [val2A, setVal2A] = useState<string>('36');
  const [val2B, setVal2B] = useState<string>('120');

  // Mode 3: Percentage increase / decrease from X to Y
  const [val3A, setVal3A] = useState<string>('50');
  const [val3B, setVal3B] = useState<string>('75');

  // Calculations
  const num1A = parseFloat(val1A) || 0;
  const num1B = parseFloat(val1B) || 0;
  const res1 = (num1A / 100) * num1B;

  const num2A = parseFloat(val2A) || 0;
  const num2B = parseFloat(val2B) || 0;
  const res2 = num2B !== 0 ? (num2A / num2B) * 100 : 0;

  const num3A = parseFloat(val3A) || 0;
  const num3B = parseFloat(val3B) || 0;
  const changeDiff = num3B - num3A;
  const res3Percent = num3A !== 0 ? (changeDiff / num3A) * 100 : 0;
  const isIncrease = changeDiff >= 0;

  const handleReset = () => {
    setVal1A('15');
    setVal1B('240');
    setVal2A('36');
    setVal2B('120');
    setVal3A('50');
    setVal3B('75');
    trackEvent('tool_complete', { tool: 'percentage-calculator', action: 'reset' });
  };

  return (
    <div className="space-y-6">
      {/* Header action controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Instant Percentage Engine
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: What is X% of Y? */}
        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              Method 1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">
              What is <span className="text-blue-600 dark:text-blue-400">X%</span> of <span className="text-blue-600 dark:text-blue-400">Y</span>?
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Percentage (X %)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={val1A}
                    onChange={(e) => setVal1A(e.target.value)}
                    className="w-full px-3 py-2 pr-7 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Total Value (Y)</label>
                <input
                  type="number"
                  value={val1B}
                  onChange={(e) => setVal1B(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Result:</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {res1.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </span>
              <CopyButton textToCopy={res1.toString()} label="Copy" size="sm" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              ({val1A} ÷ 100) × {val1B} = {res1}
            </p>
          </div>
        </div>

        {/* Card 2: X is what % of Y? */}
        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Method 2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">
              <span className="text-indigo-600 dark:text-indigo-400">X</span> is what % of <span className="text-indigo-600 dark:text-indigo-400">Y</span>?
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Part Value (X)</label>
                <input
                  type="number"
                  value={val2A}
                  onChange={(e) => setVal2A(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Whole Value (Y)</label>
                <input
                  type="number"
                  value={val2B}
                  onChange={(e) => setVal2B(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 mb-1">Result:</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {res2.toFixed(2)}%
              </span>
              <CopyButton textToCopy={`${res2.toFixed(2)}%`} label="Copy" size="sm" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              ({val2A} ÷ {val2B}) × 100 = {res2.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Card 3: % Increase / Decrease */}
        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              Method 3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">
              Percentage Increase / Decrease
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Initial Value</label>
                <input
                  type="number"
                  value={val3A}
                  onChange={(e) => setVal3A(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Final Value</label>
                <input
                  type="number"
                  value={val3B}
                  onChange={(e) => setVal3B(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500 mb-1">
              {isIncrease ? 'Increase:' : 'Decrease:'}
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-2xl font-black ${isIncrease ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isIncrease ? '+' : ''}{res3Percent.toFixed(2)}%
              </span>
              <CopyButton textToCopy={`${isIncrease ? '+' : ''}${res3Percent.toFixed(2)}%`} label="Copy" size="sm" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Difference: {changeDiff > 0 ? `+${changeDiff}` : changeDiff}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
