import React, { useState, useEffect } from 'react';
import {
  Calculator, Percent, TrendingUp, TrendingDown, DollarSign,
  CreditCard, Coins, Home, PiggyBank, BarChart, Target,
  Receipt, Tag, Heart, Flame, Scale, Clock, Zap, ArrowRight,
  Copy, Check, RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

export const CalculatorsMasterTool: React.FC<Props> = ({ tool }) => {
  const [num1, setNum1] = useState<number>(100);
  const [num2, setNum2] = useState<number>(15);
  const [num3, setNum3] = useState<number>(5);
  const [result, setResult] = useState<number | string>(0);
  const [explanation, setExplanation] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Auto configure fields based on tool slug
  useEffect(() => {
    const slug = tool.slug;
    if (slug === 'percentage-calculator') {
      setNum1(15);
      setNum2(250);
      const res = (15 / 100) * 250;
      setResult(res);
      setExplanation('15% of 250 = (15 / 100) × 250 = 37.5');
    } else if (slug === 'percentage-increase-calculator') {
      setNum1(50);
      setNum2(75);
      const diff = 75 - 50;
      const pct = (diff / 50) * 100;
      setResult(`+${pct.toFixed(2)}%`);
      setExplanation(`((75 - 50) / 50) × 100 = +50% Increase`);
    } else if (slug === 'discount-calculator') {
      setNum1(120); // Price
      setNum2(25); // 25% off
      const saved = (120 * 25) / 100;
      const finalPrice = 120 - saved;
      setResult(`$${finalPrice.toFixed(2)} (Saved $${saved.toFixed(2)})`);
      setExplanation(`25% discount on $120 saves $30. Final price: $90.`);
    } else if (slug === 'gst-calculator' || slug === 'vat-calculator') {
      setNum1(500); // Amount
      setNum2(18); // 18% Tax
      const tax = (500 * 18) / 100;
      setResult(`Total: $${(500 + tax).toFixed(2)} (Tax: $${tax.toFixed(2)})`);
      setExplanation(`18% tax on $500 is $90. Gross total = $590.`);
    } else if (slug === 'emi-calculator' || slug === 'loan-calculator') {
      setNum1(100000); // Principal
      setNum2(8.5); // Rate %
      setNum3(5); // 5 Years
      calculateEmi(100000, 8.5, 5);
    } else if (slug === 'compound-interest-calculator') {
      setNum1(10000); // Principal
      setNum2(7); // Rate %
      setNum3(10); // 10 Years
      calculateCompound(10000, 7, 10);
    } else if (slug === 'sip-calculator') {
      setNum1(5000); // Monthly investment
      setNum2(12); // Expected return %
      setNum3(10); // Years
      calculateSip(5000, 12, 10);
    } else if (slug === 'bmi-calculator') {
      setNum1(70); // kg
      setNum2(175); // cm
      const hM = 175 / 100;
      const bmi = 70 / (hM * hM);
      setResult(bmi.toFixed(1));
      setExplanation(`BMI = 70 / (1.75)² = 22.9 (Normal Weight Range: 18.5 - 24.9)`);
    } else if (slug === 'bmr-calculator') {
      setNum1(70); // kg
      setNum2(175); // cm
      setNum3(28); // age
      const bmr = 10 * 70 + 6.25 * 175 - 5 * 28 + 5;
      setResult(`${Math.round(bmr)} kcal/day`);
      setExplanation(`Mifflin-St Jeor formula baseline metabolic rate at rest.`);
    } else if (slug === 'salary-calculator') {
      setNum1(85000); // annual salary
      const hourly = 85000 / (52 * 40);
      const monthly = 85000 / 12;
      setResult(`$${monthly.toFixed(2)} / mo ($${hourly.toFixed(2)} / hr)`);
      setExplanation(`Based on standard 40-hour work weeks and 52 weeks per year.`);
    } else {
      setResult((num1 * num2).toLocaleString());
      setExplanation(`${num1} × ${num2} = ${num1 * num2}`);
    }
  }, [tool.slug]);

  const calculateEmi = (p: number, rPct: number, years: number) => {
    const r = rPct / 12 / 100;
    const n = years * 12;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - p;
    setResult(`$${emi.toFixed(2)} / month`);
    setExplanation(`Total Interest: $${totalInterest.toFixed(2)} • Total Payable: $${totalPayable.toFixed(2)}`);
  };

  const calculateCompound = (p: number, rPct: number, years: number) => {
    const amount = p * Math.pow(1 + rPct / 100, years);
    const interest = amount - p;
    setResult(`$${amount.toFixed(2)}`);
    setExplanation(`Initial Principal: $${p.toLocaleString()} • Total Earned Interest: $${interest.toFixed(2)}`);
  };

  const calculateSip = (monthly: number, rPct: number, years: number) => {
    const i = rPct / 12 / 100;
    const n = years * 12;
    const futureVal = monthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = monthly * n;
    const returns = futureVal - invested;
    setResult(`$${futureVal.toFixed(2)}`);
    setExplanation(`Total Invested: $${invested.toLocaleString()} • Estimated Capital Gains: $${returns.toFixed(2)}`);
  };

  const handleRecalculate = () => {
    const slug = tool.slug;
    if (slug === 'percentage-calculator') {
      const res = (num1 / 100) * num2;
      setResult(res);
      setExplanation(`${num1}% of ${num2} = ${res}`);
    } else if (slug === 'percentage-increase-calculator') {
      const diff = num2 - num1;
      const pct = (diff / num1) * 100;
      setResult(`${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`);
      setExplanation(`Change from ${num1} to ${num2} is ${pct.toFixed(2)}%`);
    } else if (slug === 'discount-calculator') {
      const saved = (num1 * num2) / 100;
      setResult(`$${(num1 - saved).toFixed(2)}`);
      setExplanation(`Discount saved: $${saved.toFixed(2)}`);
    } else if (slug === 'emi-calculator' || slug === 'loan-calculator' || slug === 'mortgage-calculator') {
      calculateEmi(num1, num2, num3);
    } else if (slug === 'compound-interest-calculator') {
      calculateCompound(num1, num2, num3);
    } else if (slug === 'sip-calculator') {
      calculateSip(num1, num2, num3);
    } else if (slug === 'bmi-calculator') {
      const hM = num2 / 100;
      const bmi = num1 / (hM * hM);
      setResult(bmi.toFixed(1));
      setExplanation(`BMI = ${bmi.toFixed(1)}`);
    } else if (slug === 'tip-calculator') {
      const tip = (num1 * num2) / 100;
      const total = num1 + tip;
      const perPerson = total / (num3 || 1);
      setResult(`$${perPerson.toFixed(2)} / person`);
      setExplanation(`Total with tip: $${total.toFixed(2)} (Tip: $${tip.toFixed(2)})`);
    } else if (slug === 'salary-calculator') {
      const hourly = num1 / (52 * 40);
      const monthly = num1 / 12;
      setResult(`$${monthly.toFixed(2)} / month ($${hourly.toFixed(2)} / hr)`);
    } else {
      setResult((num1 + num2).toString());
      setExplanation(`${num1} + ${num2} = ${num1 + num2}`);
    }

    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(String(result));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Main Interactive Calculator Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              {tool.slug.includes('percentage')
                ? 'Percentage (%)'
                : tool.slug.includes('discount') || tool.slug.includes('tax')
                ? 'Original Price ($)'
                : tool.slug.includes('emi') || tool.slug.includes('loan') || tool.slug.includes('compound')
                ? 'Loan Principal ($)'
                : tool.slug.includes('bmi')
                ? 'Weight (kg)'
                : 'Primary Input'}
            </label>
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-black focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              {tool.slug.includes('percentage')
                ? 'Total Value'
                : tool.slug.includes('discount')
                ? 'Discount (%)'
                : tool.slug.includes('emi') || tool.slug.includes('loan') || tool.slug.includes('compound')
                ? 'Annual Interest Rate (%)'
                : tool.slug.includes('bmi')
                ? 'Height (cm)'
                : 'Secondary Input'}
            </label>
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-black focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {(tool.slug.includes('emi') ||
            tool.slug.includes('loan') ||
            tool.slug.includes('compound') ||
            tool.slug.includes('sip') ||
            tool.slug.includes('tip') ||
            tool.slug.includes('bmr')) && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                {tool.slug.includes('tip')
                  ? 'Split Between (People)'
                  : tool.slug.includes('bmr')
                  ? 'Age (Years)'
                  : 'Duration (Years)'}
              </label>
              <input
                type="number"
                value={num3}
                onChange={(e) => setNum3(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-black focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleRecalculate}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Calculator className="w-5 h-5" /> Calculate {tool.name}
        </button>

        {/* Calculated Result Display */}
        <div className="p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              Calculated Result:
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-800 flex items-center gap-1 cursor-pointer hover:bg-blue-50"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {isCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
            {result}
          </p>
          {explanation && (
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium pt-1">
              {explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
