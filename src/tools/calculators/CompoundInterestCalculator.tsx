import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { TrendingUp, RotateCcw } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

export const CompoundInterestCalculator: React.FC = () => {
  const [initialAmount, setInitialAmount] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [annualRate, setAnnualRate] = useState<number>(8);
  const [tenureYears, setTenureYears] = useState<number>(10);
  const [compoundFreq, setCompoundFreq] = useState<number>(12); // monthly = 12

  // Formula:
  // FV = P * (1 + r/n)^(n*t) + PMT * [ ((1 + r/n)^(n*t) - 1) / (r/n) ]
  const P = Math.max(0, initialAmount);
  const PMT = Math.max(0, monthlyContribution);
  const r = annualRate / 100;
  const t = Math.max(1, tenureYears);
  const n = compoundFreq;

  const ratePerPeriod = r / n;
  const totalPeriods = n * t;

  let futureValueFromPrincipal = P * Math.pow(1 + ratePerPeriod, totalPeriods);
  let futureValueFromDeposits = 0;

  if (ratePerPeriod > 0) {
    futureValueFromDeposits = PMT * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod);
  } else {
    futureValueFromDeposits = PMT * totalPeriods;
  }

  const totalFutureValue = futureValueFromPrincipal + futureValueFromDeposits;
  const totalInvested = P + (PMT * 12 * t);
  const totalInterestEarned = Math.max(0, totalFutureValue - totalInvested);

  const handleReset = () => {
    setInitialAmount(10000);
    setMonthlyContribution(500);
    setAnnualRate(8);
    setTenureYears(10);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Compound Wealth &amp; Investment Forecast
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-medium text-slate-500 mb-1">Initial Deposit ($)</label>
              <input
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                className="w-full text-lg font-bold bg-transparent border-b border-slate-300 dark:border-slate-700 py-1 focus:outline-hidden"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-medium text-slate-500 mb-1">Monthly Contribution ($)</label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full text-lg font-bold bg-transparent border-b border-slate-300 dark:border-slate-700 py-1 focus:outline-hidden"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-medium text-slate-500 mb-1">Estimated Return Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full text-lg font-bold bg-transparent border-b border-slate-300 dark:border-slate-700 py-1 focus:outline-hidden"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-medium text-slate-500 mb-1">Investment Period (Years)</label>
              <input
                type="number"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full text-lg font-bold bg-transparent border-b border-slate-300 dark:border-slate-700 py-1 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Compounding Frequency:</span>
            <select
              value={compoundFreq}
              onChange={(e) => setCompoundFreq(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value={12}>Monthly (12/yr)</option>
              <option value={4}>Quarterly (4/yr)</option>
              <option value={1}>Annually (1/yr)</option>
              <option value={365}>Daily (365/yr)</option>
            </select>
          </div>
        </div>

        {/* Results summary */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 text-white flex flex-col justify-between space-y-6 shadow-xl border border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Future Estimated Balance
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-4xl font-black text-white">
                ${Math.round(totalFutureValue).toLocaleString()}
              </div>
              <CopyButton textToCopy={`$${Math.round(totalFutureValue).toLocaleString()}`} label="Copy" size="sm" />
            </div>

            <div className="mt-6 space-y-3 pt-6 border-t border-slate-800 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Contributed:</span>
                <span className="font-bold text-slate-200">${Math.round(totalInvested).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Interest Earned:</span>
                <span className="font-black text-emerald-400">+${Math.round(totalInterestEarned).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
            🚀 Compound interest generates <strong>{totalInvested > 0 ? ((totalInterestEarned / totalInvested) * 100).toFixed(0) : 0}%</strong> on top of your deposits over {tenureYears} years.
          </div>
        </div>
      </div>
    </div>
  );
};
