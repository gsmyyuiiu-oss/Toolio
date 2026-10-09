import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Tag, RotateCcw } from 'lucide-react';

export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [taxPercent, setTaxPercent] = useState<number>(8);

  const discountAmount = (originalPrice * discountPercent) / 100;
  const priceAfterDiscount = Math.max(0, originalPrice - discountAmount);
  const taxAmount = (priceAfterDiscount * taxPercent) / 100;
  const finalPrice = priceAfterDiscount + taxAmount;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-500 mb-1">Original Price ($)</label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(Number(e.target.value))}
            className="w-full text-xl font-bold bg-transparent border-b border-slate-300 dark:border-slate-700 py-1 focus:outline-hidden"
          />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-500 mb-1">Discount (% Off)</label>
          <input
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Number(e.target.value))}
            className="w-full text-xl font-bold bg-transparent border-b border-slate-300 dark:border-slate-700 py-1 focus:outline-hidden"
          />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <label className="block text-xs font-medium text-slate-500 mb-1">Sales Tax (% Optional)</label>
          <input
            type="number"
            value={taxPercent}
            onChange={(e) => setTaxPercent(Number(e.target.value))}
            className="w-full text-xl font-bold bg-transparent border-b border-slate-300 dark:border-slate-700 py-1 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Preset discount pills */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 font-medium">Quick presets:</span>
        {[10, 15, 20, 25, 30, 40, 50, 70].map((pct) => (
          <button
            key={pct}
            type="button"
            onClick={() => setDiscountPercent(pct)}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              discountPercent === pct
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {pct}%
          </button>
        ))}
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-tr from-indigo-900 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold">
              Final Checkout Price
            </span>
            <div className="text-4xl font-black mt-1">
              ${finalPrice.toFixed(2)}
            </div>
          </div>
          <CopyButton textToCopy={`$${finalPrice.toFixed(2)}`} label="Copy Total" size="sm" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-indigo-800/60 text-xs">
          <div>
            <span className="text-indigo-300 block">You Save:</span>
            <span className="font-extrabold text-emerald-400 text-base">${discountAmount.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-indigo-300 block">Sale Price:</span>
            <span className="font-extrabold text-white text-base">${priceAfterDiscount.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-indigo-300 block">Tax Added:</span>
            <span className="font-extrabold text-slate-300 text-base">${taxAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
