import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Coins, TrendingUp } from 'lucide-react';

export const ProfitMarginCalculator: React.FC = () => {
  const [cost, setCost] = useState<number>(45);
  const [revenue, setRevenue] = useState<number>(80);

  const costVal = Math.max(0, cost);
  const revenueVal = Math.max(0, revenue);
  const grossProfit = revenueVal - costVal;
  const marginPercent = revenueVal > 0 ? (grossProfit / revenueVal) * 100 : 0;
  const markupPercent = costVal > 0 ? (grossProfit / costVal) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-500 mb-1">Cost of Goods (COGS $)</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="w-full text-2xl font-black bg-transparent border-b border-slate-300 dark:border-slate-700 py-1 focus:outline-hidden"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-500 mb-1">Selling Price / Revenue ($)</label>
          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            className="w-full text-2xl font-black bg-transparent border-b border-slate-300 dark:border-slate-700 py-1 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6 border border-slate-800">
        <div className="flex items-baseline justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase text-slate-400 font-semibold">Gross Profit:</span>
            <div className={`text-4xl font-black mt-0.5 ${grossProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${grossProfit.toFixed(2)}
            </div>
          </div>
          <CopyButton textToCopy={`Profit: $${grossProfit.toFixed(2)} (Margin: ${marginPercent.toFixed(1)}%)`} label="Copy" size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 uppercase font-semibold">Profit Margin</span>
            <div className="text-3xl font-black text-cyan-400 mt-1">
              {marginPercent.toFixed(1)}%
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">(Profit ÷ Selling Price)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 uppercase font-semibold">Markup</span>
            <div className="text-3xl font-black text-purple-400 mt-1">
              {markupPercent.toFixed(1)}%
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">(Profit ÷ Cost)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
