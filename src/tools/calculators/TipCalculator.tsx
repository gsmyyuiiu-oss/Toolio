import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Users, Receipt } from 'lucide-react';

export const TipCalculator: React.FC = () => {
  const [bill, setBill] = useState<number>(85.5);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [people, setPeople] = useState<number>(3);

  const billAmount = Math.max(0, bill);
  const tipAmount = (billAmount * tipPercent) / 100;
  const totalAmount = billAmount + tipAmount;
  const validPeople = Math.max(1, people);
  const perPersonTotal = totalAmount / validPeople;
  const perPersonTip = tipAmount / validPeople;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-500 mb-1">Bill Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
            className="w-full text-2xl font-black bg-transparent border-b border-slate-300 dark:border-slate-700 py-1 focus:outline-hidden"
          />
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-500 mb-1">Split Between (Guests)</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-20 text-2xl font-black bg-transparent border-b border-slate-300 dark:border-slate-700 py-1 focus:outline-hidden"
            />
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setPeople(people + 1)}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tip Percent Presets */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-2">Tip Percentage</label>
        <div className="grid grid-cols-5 gap-2">
          {[10, 15, 18, 20, 25].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setTipPercent(pct)}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tipPercent === pct
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Output split card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6 border border-slate-800">
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase text-slate-400 font-semibold">Total Tip:</span>
            <div className="text-2xl font-black text-amber-400 mt-0.5">
              ${tipAmount.toFixed(2)}
            </div>
          </div>
          <div>
            <span className="text-xs uppercase text-slate-400 font-semibold">Total Bill:</span>
            <div className="text-2xl font-black text-white mt-0.5">
              ${totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase text-emerald-400 font-bold tracking-wider">
              Each Person Pays ({validPeople} {validPeople === 1 ? 'person' : 'people'}):
            </span>
            <div className="text-4xl font-black text-white mt-1">
              ${perPersonTotal.toFixed(2)}
            </div>
            <span className="text-xs text-slate-400">
              (includes ${perPersonTip.toFixed(2)} tip per guest)
            </span>
          </div>
          <CopyButton textToCopy={`$${perPersonTotal.toFixed(2)}`} label="Copy Split" size="sm" />
        </div>
      </div>
    </div>
  );
};
