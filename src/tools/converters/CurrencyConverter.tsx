import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { ArrowLeftRight, RefreshCw, DollarSign } from 'lucide-react';

interface CurrencyInfo {
  code: string;
  name: string;
  rateToUsd: number; // 1 USD = rateToUsd in target
  symbol: string;
}

const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar', rateToUsd: 1.0, symbol: '$' },
  EUR: { code: 'EUR', name: 'Euro', rateToUsd: 0.92, symbol: '€' },
  GBP: { code: 'GBP', name: 'British Pound', rateToUsd: 0.78, symbol: '£' },
  INR: { code: 'INR', name: 'Indian Rupee', rateToUsd: 86.85, symbol: '₹' },
  JPY: { code: 'JPY', name: 'Japanese Yen', rateToUsd: 154.2, symbol: '¥' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', rateToUsd: 1.38, symbol: 'CA$' },
  AUD: { code: 'AUD', name: 'Australian Dollar', rateToUsd: 1.54, symbol: 'A$' },
  CHF: { code: 'CHF', name: 'Swiss Franc', rateToUsd: 0.88, symbol: 'Fr' },
  CNY: { code: 'CNY', name: 'Chinese Yuan', rateToUsd: 7.24, symbol: '¥' },
  BRL: { code: 'BRL', name: 'Brazilian Real', rateToUsd: 5.65, symbol: 'R$' },
  AED: { code: 'AED', name: 'UAE Dirham', rateToUsd: 3.67, symbol: 'د.إ' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', rateToUsd: 1.34, symbol: 'S$' },
  MXN: { code: 'MXN', name: 'Mexican Peso', rateToUsd: 19.85, symbol: 'Mex$' },
  KRW: { code: 'KRW', name: 'South Korean Won', rateToUsd: 1390.0, symbol: '₩' },
  SAR: { code: 'SAR', name: 'Saudi Riyal', rateToUsd: 3.75, symbol: '﷼' },
  ZAR: { code: 'ZAR', name: 'South African Rand', rateToUsd: 18.25, symbol: 'R' },
};

export const CurrencyConverter: React.FC = () => {
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('EUR');
  const [amount, setAmount] = useState<number>(100);

  const fromCurr = CURRENCIES[fromCode] || CURRENCIES.USD;
  const toCurr = CURRENCIES[toCode] || CURRENCIES.EUR;

  // Convert via USD anchor
  const amountInUsd = amount / fromCurr.rateToUsd;
  const result = amountInUsd * toCurr.rateToUsd;
  const singleExchangeRate = toCurr.rateToUsd / fromCurr.rateToUsd;

  const handleSwap = () => {
    const prev = fromCode;
    setFromCode(toCode);
    setToCode(prev);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* From */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-semibold text-slate-500">From Currency</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full text-2xl font-black px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="md:col-span-1 flex justify-center py-2">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 transition-transform hover:scale-105 cursor-pointer"
              title="Swap Currencies"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-500">To Currency</label>
              <CopyButton textToCopy={`${toCurr.symbol}${result.toFixed(2)}`} label="Copy" size="sm" />
            </div>
            <div className="w-full text-2xl font-black px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 overflow-x-auto no-scrollbar">
              {toCurr.symbol} {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exchange Rate Badge */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            1 {fromCode} = <strong>{singleExchangeRate.toFixed(4)} {toCode}</strong>
          </div>
          <div>
            1 {toCode} = <strong>{(1 / singleExchangeRate).toFixed(4)} {fromCode}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
