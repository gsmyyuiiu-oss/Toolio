import React, { useState } from 'react';
import {
  DollarSign, Clock, Calendar, Sparkles, TrendingUp,
  Percent, ShieldCheck, Download, Copy, Check, Info,
  Calculator, PieChart, ArrowRight, RefreshCw, Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

export const FreelanceRateCalculator: React.FC<Props> = ({ tool }) => {
  // Financial parameters
  const [desiredAnnualIncome, setDesiredAnnualIncome] = useState<number>(85000);
  const [annualBusinessExpenses, setAnnualBusinessExpenses] = useState<number>(12000);
  const [taxRatePercentage, setTaxRatePercentage] = useState<number>(25);
  const [desiredProfitMargin, setDesiredProfitMargin] = useState<number>(15);

  // Time parameters
  const [vacationWeeks, setVacationWeeks] = useState<number>(4);
  const [holidaysAndSickDays, setHolidaysAndSickDays] = useState<number>(15); // days
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [billableHoursPercentage, setBillableHoursPercentage] = useState<number>(60); // % of time billable

  const [copied, setCopied] = useState(false);

  // Calculations
  // Total work weeks per year = 52 - vacationWeeks
  const workWeeks = Math.max(1, 52 - vacationWeeks);
  // Total work days per year approx (workWeeks * 5) - holidaysAndSickDays
  const totalWorkDays = Math.max(1, workWeeks * 5 - holidaysAndSickDays);
  // Total available working hours in the year
  const totalAvailableHours = (totalWorkDays / 5) * hoursPerWeek;
  // Billable hours per year
  const billableHoursPerYear = Math.max(1, totalAvailableHours * (billableHoursPercentage / 100));

  // Pre-tax income needed to take home desiredAnnualIncome
  const taxMultiplier = 1 - taxRatePercentage / 100;
  const grossIncomeNeededForNet = taxMultiplier > 0 ? desiredAnnualIncome / taxMultiplier : desiredAnnualIncome;

  // Add expenses
  const grossWithExpenses = grossIncomeNeededForNet + annualBusinessExpenses;

  // Add desired profit buffer
  const totalRevenueTarget = grossWithExpenses * (1 + desiredProfitMargin / 100);

  // Resulting rates
  const hourlyRate = Math.ceil(totalRevenueTarget / billableHoursPerYear);
  const dailyRate = Math.ceil(hourlyRate * (hoursPerWeek / 5));
  const weeklyRate = Math.ceil(hourlyRate * (hoursPerWeek * (billableHoursPercentage / 100)));
  const monthlyRetainer = Math.ceil(totalRevenueTarget / 12);

  const handleCopySummary = () => {
    const text = `Freelance Rate Calculation:
Target Hourly Rate: $${hourlyRate}/hr
Day Rate: $${dailyRate}/day
Weekly Rate: $${weeklyRate}/week
Monthly Retainer: $${monthlyRetainer}/mo
Annual Gross Revenue Target: $${Math.round(totalRevenueTarget).toLocaleString()}
Based on ${Math.round(billableHoursPerYear)} billable hours/year (${billableHoursPercentage}% billable).`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({ particleCount: 35, spread: 60 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner with dynamic gradient */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/60 dark:border-indigo-900/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            100% Client-Side Financial Model
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Calculate Your Sustainable Freelance Rate
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Account for taxes, health insurance, unpaid vacation, non-billable client acquisition time, and profit margins to never undercharge again.
          </p>
        </div>

        <button
          onClick={handleCopySummary}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Rates!' : 'Copy Rate Breakdown'}
        </button>
      </div>

      {/* Main Results Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hourly Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/40 shadow-xl relative overflow-hidden group hover:border-indigo-500 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Minimum Hourly
          </span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
              ${hourlyRate}
            </span>
            <span className="text-sm font-bold text-slate-400">/ hour</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Recommended baseline for hourly contracting & consultations.
          </p>
        </div>

        {/* Day Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-purple-500 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Full Day Rate
          </span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
              ${dailyRate}
            </span>
            <span className="text-sm font-bold text-slate-400">/ day</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Ideal for full-day workshops, agile sprints, or on-site days.
          </p>
        </div>

        {/* Weekly Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-pink-500 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> Weekly Sprint
          </span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
              ${weeklyRate.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-slate-400">/ week</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Dedicated weekly engagement allocation based on billable capacity.
          </p>
        </div>

        {/* Monthly Retainer */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500 transition-all">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Monthly Retainer
          </span>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">
              ${monthlyRetainer.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-slate-400">/ month</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Target monthly revenue needed to meet annual income & profit goals.
          </p>
        </div>
      </div>

      {/* Input Sliders & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Financial & Tax Goals */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider">
            <DollarSign className="w-4 h-4" /> 1. Financial & Tax Goals
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Desired Annual Net Take-Home Pay ($)
              </label>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                ${desiredAnnualIncome.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={20000}
              max={300000}
              step={2500}
              value={desiredAnnualIncome}
              onChange={(e) => setDesiredAnnualIncome(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>$20k</span>
              <span>$150k</span>
              <span>$300k+</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Annual Business Operating Expenses ($)
              </label>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                ${annualBusinessExpenses.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={60000}
              step={1000}
              value={annualBusinessExpenses}
              onChange={(e) => setAnnualBusinessExpenses(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Includes software subscriptions, equipment, insurance, accountant, and marketing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Estimated Tax Rate ({taxRatePercentage}%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={taxRatePercentage}
                onChange={(e) => setTaxRatePercentage(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Profit Margin Buffer ({desiredProfitMargin}%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={desiredProfitMargin}
                onChange={(e) => setDesiredProfitMargin(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Time & Billable Capacity */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm uppercase tracking-wider">
            <Clock className="w-4 h-4" /> 2. Time & Billable Capacity
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Billable Hours Share ({billableHoursPercentage}%)
              </label>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                ~{Math.round((hoursPerWeek * billableHoursPercentage) / 100)} hrs/week billable
              </span>
            </div>
            <input
              type="range"
              min={25}
              max={90}
              step={5}
              value={billableHoursPercentage}
              onChange={(e) => setBillableHoursPercentage(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Typical freelancers spend 35%–50% on sales, invoicing, email, and admin.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Working Hours Per Week
              </label>
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                {hoursPerWeek} hrs
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Vacation Weeks/Year
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={vacationWeeks}
                onChange={(e) => setVacationWeeks(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Sick & Holiday Days
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={holidaysAndSickDays}
                onChange={(e) => setHolidaysAndSickDays(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown Detailed Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-indigo-500" />
          Financial Model Breakdown
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border">
            <span className="text-[11px] font-bold uppercase text-slate-400">Annual Gross Goal</span>
            <p className="text-lg font-black text-slate-800 dark:text-white mt-1">
              ${Math.round(totalRevenueTarget).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Billable Hours</span>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {Math.round(billableHoursPerYear)} hrs
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border">
            <span className="text-[11px] font-bold uppercase text-slate-400">Est. Annual Taxes</span>
            <p className="text-lg font-black text-rose-500 mt-1">
              ${Math.round(grossIncomeNeededForNet * (taxRatePercentage / 100)).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border">
            <span className="text-[11px] font-bold uppercase text-slate-400">Business Retained Profit</span>
            <p className="text-lg font-black text-emerald-500 mt-1">
              ${Math.round(grossWithExpenses * (desiredProfitMargin / 100)).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
