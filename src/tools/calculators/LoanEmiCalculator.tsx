import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { RotateCcw, PieChart } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

export const LoanEmiCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [years, setYears] = useState<number>(15);

  // Math: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const principal = Math.max(0, amount);
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = Math.max(1, years * 12);

  let monthlyEmi = 0;
  let totalPayment = 0;
  let totalInterest = 0;

  if (monthlyRate > 0) {
    monthlyEmi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    totalPayment = monthlyEmi * totalMonths;
    totalInterest = totalPayment - principal;
  } else {
    monthlyEmi = principal / totalMonths;
    totalPayment = principal;
    totalInterest = 0;
  }

  const principalRatio = totalPayment > 0 ? (principal / totalPayment) * 100 : 50;
  const interestRatio = 100 - principalRatio;

  const handleReset = () => {
    setAmount(250000);
    setInterestRate(7.5);
    setYears(15);
  };

  return (
    <div className="space-y-8">
      {/* Top reset bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loan &amp; Mortgage Payment Estimator
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input sliders & fields */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loan Amount */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Loan Amount (Principal)
              </label>
              <div className="flex items-center gap-1 font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
                <span>$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-28 text-right bg-transparent border-b border-blue-400 focus:outline-hidden"
                />
              </div>
            </div>
            <input
              type="range"
              min="1000"
              max="2000000"
              step="5000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>$1,000</span>
              <span>$1,000,000</span>
              <span>$2,000,000</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Annual Interest Rate
              </label>
              <div className="flex items-center gap-1 font-mono text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-16 text-right bg-transparent border-b border-indigo-400 focus:outline-hidden"
                />
                <span>%</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1%</span>
              <span>12%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Loan Tenure
              </label>
              <div className="flex items-center gap-1 font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-14 text-right bg-transparent border-b border-emerald-400 focus:outline-hidden"
                />
                <span>Years ({years * 12} Mos)</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 Year</span>
              <span>15 Years</span>
              <span>35 Years</span>
            </div>
          </div>
        </div>

        {/* Results summary card */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Monthly Payment Breakdown
            </span>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <div className="text-4xl font-black text-white tracking-tight">
                  ${Math.round(monthlyEmi).toLocaleString()}
                </div>
                <div className="text-xs text-indigo-200 mt-0.5">per month</div>
              </div>
              <CopyButton textToCopy={`$${Math.round(monthlyEmi).toLocaleString()}`} label="Copy EMI" size="sm" />
            </div>

            {/* Split Progress bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-blue-300">Principal ({principalRatio.toFixed(1)}%)</span>
                <span className="text-rose-300">Interest ({interestRatio.toFixed(1)}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${principalRatio}%` }}
                ></div>
                <div
                  className="bg-rose-500 h-full transition-all duration-300"
                  style={{ width: `${interestRatio}%` }}
                ></div>
              </div>
            </div>

            {/* Totals list */}
            <div className="mt-6 space-y-3 pt-6 border-t border-slate-800 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Principal:</span>
                <span className="font-bold text-white">${principal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Interest Payable:</span>
                <span className="font-bold text-rose-300">${Math.round(totalInterest).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-base pt-2 border-t border-slate-800/80">
                <span className="text-slate-300 font-medium">Total Amount Payable:</span>
                <span className="font-black text-emerald-400">${Math.round(totalPayment).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-indigo-200 leading-relaxed">
            💡 <strong>Tip:</strong> An extra $100/month payment reduces total tenure and saves thousands in compound interest over time.
          </div>
        </div>
      </div>
    </div>
  );
};
