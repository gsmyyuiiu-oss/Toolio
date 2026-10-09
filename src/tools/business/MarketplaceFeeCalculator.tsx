import React, { useState } from 'react';
import {
  ShoppingBag, DollarSign, Percent, Sparkles, TrendingUp,
  Tag, Truck, ArrowRight, Copy, Check, Info, ShieldCheck,
  CreditCard, Store, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

type PlatformKey = 'etsy' | 'ebay' | 'amazon' | 'shopify' | 'poshmark' | 'custom';

interface PlatformPreset {
  name: string;
  category: string;
  transactionFeePct: number;
  fixedFee: number;
  paymentProcessingPct: number;
  paymentProcessingFixed: number;
  listingFee: number;
  notes: string;
}

const PLATFORM_PRESETS: Record<PlatformKey, PlatformPreset> = {
  etsy: {
    name: 'Etsy',
    category: 'Handmade & Vintage',
    transactionFeePct: 6.5,
    fixedFee: 0.0,
    paymentProcessingPct: 3.0,
    paymentProcessingFixed: 0.25,
    listingFee: 0.20,
    notes: '6.5% transaction fee + $0.20 listing fee + 3% + $0.25 payment processing'
  },
  ebay: {
    name: 'eBay',
    category: 'General Marketplace',
    transactionFeePct: 13.25,
    fixedFee: 0.30,
    paymentProcessingPct: 0.0,
    paymentProcessingFixed: 0.0,
    listingFee: 0.0,
    notes: 'Standard 13.25% final value fee + $0.30 per order (Managed Payments included)'
  },
  amazon: {
    name: 'Amazon FBM',
    category: 'General Retail',
    transactionFeePct: 15.0,
    fixedFee: 0.0,
    paymentProcessingPct: 0.0,
    paymentProcessingFixed: 0.0,
    listingFee: 0.0,
    notes: 'Standard 15% referral fee across most retail categories (FBM)'
  },
  shopify: {
    name: 'Shopify / Stripe',
    category: 'Independent Store',
    transactionFeePct: 0.0,
    fixedFee: 0.0,
    paymentProcessingPct: 2.9,
    paymentProcessingFixed: 0.30,
    listingFee: 0.0,
    notes: 'Basic Shopify Payments: 2.9% + $0.30 with 0% extra transaction fee'
  },
  poshmark: {
    name: 'Poshmark',
    category: 'Apparel & Fashion',
    transactionFeePct: 20.0,
    fixedFee: 0.0,
    paymentProcessingPct: 0.0,
    paymentProcessingFixed: 0.0,
    listingFee: 0.0,
    notes: '20% commission on sales $15 and above (flat $2.95 below $15)'
  },
  custom: {
    name: 'Custom Marketplace',
    category: 'Custom Rate',
    transactionFeePct: 10.0,
    fixedFee: 0.0,
    paymentProcessingPct: 2.9,
    paymentProcessingFixed: 0.30,
    listingFee: 0.0,
    notes: 'Fully customizable percentage & fixed commission structure'
  }
};

export const MarketplaceFeeCalculator: React.FC<Props> = ({ tool }) => {
  const [platform, setPlatform] = useState<PlatformKey>('etsy');
  const [sellingPrice, setSellingPrice] = useState<number>(45.00);
  const [shippingCharged, setShippingCharged] = useState<number>(5.00);
  const [itemCost, setItemCost] = useState<number>(12.00);
  const [shippingCost, setShippingCost] = useState<number>(4.50);
  const [customFeePct, setCustomFeePct] = useState<number>(10.0);
  const [customFixedFee, setCustomFixedFee] = useState<number>(0.30);
  const [copied, setCopied] = useState(false);

  const currentPreset = PLATFORM_PRESETS[platform];

  // Fee calculation logic
  const grossCustomerPaid = sellingPrice + shippingCharged;

  const transactionPct = platform === 'custom' ? customFeePct : currentPreset.transactionFeePct;
  const transactionFixed = platform === 'custom' ? customFixedFee : currentPreset.fixedFee;
  const paymentPct = platform === 'custom' ? 0 : currentPreset.paymentProcessingPct;
  const paymentFixed = platform === 'custom' ? 0 : currentPreset.paymentProcessingFixed;
  const listingFee = currentPreset.listingFee;

  // Platform transaction fee (applied on total order or item price depending on platform)
  const transactionFee = (grossCustomerPaid * (transactionPct / 100)) + transactionFixed;
  const paymentFee = (grossCustomerPaid * (paymentPct / 100)) + paymentFixed;
  const totalMarketplaceFees = transactionFee + paymentFee + listingFee;

  // Cost of goods & fulfilment
  const totalSellerCosts = itemCost + shippingCost;

  // Profit calculation
  const netPayout = grossCustomerPaid - totalMarketplaceFees;
  const netProfit = netPayout - totalSellerCosts;
  const profitMargin = grossCustomerPaid > 0 ? (netProfit / grossCustomerPaid) * 100 : 0;
  const effectiveFeePercentage = grossCustomerPaid > 0 ? (totalMarketplaceFees / grossCustomerPaid) * 100 : 0;

  const handleCopy = () => {
    const text = `Marketplace Fee Breakdown (${currentPreset.name}):
Selling Price: $${sellingPrice.toFixed(2)} + Shipping Charged: $${shippingCharged.toFixed(2)}
Gross Total: $${grossCustomerPaid.toFixed(2)}
Total Marketplace Fees: $${totalMarketplaceFees.toFixed(2)} (${effectiveFeePercentage.toFixed(1)}%)
COGS + Shipping: $${totalSellerCosts.toFixed(2)}
Net Take-Home Profit: $${netProfit.toFixed(2)} (${profitMargin.toFixed(1)}% margin)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-200/60 dark:border-amber-900/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
            <Store className="w-3.5 h-3.5 text-amber-500" />
            Etsy, eBay, Amazon, Shopify & Poshmark Presets
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Marketplace Seller Fee & Profit Calculator
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Accurately calculate net profit, total platform commissions, payment processing charges, and true margins before listing items.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Breakdown!' : 'Copy Summary'}
        </button>
      </div>

      {/* Platform Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {(Object.keys(PLATFORM_PRESETS) as PlatformKey[]).map((key) => {
          const p = PLATFORM_PRESETS[key];
          const isSelected = platform === key;
          return (
            <button
              key={key}
              onClick={() => setPlatform(key)}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20 font-black'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300 font-bold'
              }`}
            >
              <div className="text-sm">{p.name}</div>
              <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                {p.category}
              </div>
            </button>
          );
        })}
      </div>

      {/* Result Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Profit */}
        <div className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 shadow-xl relative overflow-hidden transition-all ${
          netProfit >= 0 ? 'border-emerald-500/40 hover:border-emerald-500' : 'border-rose-500/40 hover:border-rose-500'
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            <TrendingUp className="w-3.5 h-3.5" /> Net Take-Home Profit
          </span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className={`text-4xl sm:text-5xl font-black ${
              netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              ${netProfit.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            After all commissions, payment fees, shipping & item costs.
          </p>
        </div>

        {/* Profit Margin */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-500 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5" /> Profit Margin
          </span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
              {profitMargin.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Net profit divided by gross revenue charged to buyer.
          </p>
        </div>

        {/* Total Fees */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Total Platform Fees
          </span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-rose-500">
              ${totalMarketplaceFees.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-400">({effectiveFeePercentage.toFixed(1)}%)</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Transaction cut, payment processing & listing fee.
          </p>
        </div>

        {/* Net Payout */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-500 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" /> Marketplace Payout
          </span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
              ${netPayout.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Direct deposit amount transferred into your bank account.
          </p>
        </div>
      </div>

      {/* Input Sliders & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales & Shipping Pricing */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm uppercase tracking-wider">
            <Tag className="w-4 h-4" /> 1. Customer Pricing
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Item Sale Price ($)</label>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">${sellingPrice.toFixed(2)}</span>
            </div>
            <input
              type="number"
              step="0.5"
              min="0"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Shipping Charged to Buyer ($)</label>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">${shippingCharged.toFixed(2)}</span>
            </div>
            <input
              type="number"
              step="0.5"
              min="0"
              value={shippingCharged}
              onChange={(e) => setShippingCharged(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base"
            />
          </div>

          {platform === 'custom' && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Fee %</label>
                <input
                  type="number"
                  step="0.1"
                  value={customFeePct}
                  onChange={(e) => setCustomFeePct(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Fixed Fee ($)</label>
                <input
                  type="number"
                  step="0.05"
                  value={customFixedFee}
                  onChange={(e) => setCustomFixedFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border font-bold text-sm"
                />
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 text-xs text-amber-800 dark:text-amber-300">
            <strong>Rule:</strong> {currentPreset.notes}
          </div>
        </div>

        {/* Costs & Expenses */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm uppercase tracking-wider">
            <Truck className="w-4 h-4" /> 2. Seller Costs (COGS & Shipping)
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Item Cost / Material Cost ($)</label>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">${itemCost.toFixed(2)}</span>
            </div>
            <input
              type="number"
              step="0.5"
              min="0"
              value={itemCost}
              onChange={(e) => setItemCost(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Actual Postage & Packaging Cost ($)</label>
              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">${shippingCost.toFixed(2)}</span>
            </div>
            <input
              type="number"
              step="0.5"
              min="0"
              value={shippingCost}
              onChange={(e) => setShippingCost(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-base"
            />
          </div>

          {/* Fee Itemization */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Marketplace Commission:</span>
              <span className="font-bold font-mono">${transactionFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Payment Processing:</span>
              <span className="font-bold font-mono">${paymentFee.toFixed(2)}</span>
            </div>
            {listingFee > 0 && (
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Listing Fee:</span>
                <span className="font-bold font-mono">${listingFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-900 dark:text-white pt-2 border-t">
              <span>Gross Total Charged to Customer:</span>
              <span className="font-mono">${grossCustomerPaid.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
