import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { CalendarRange } from 'lucide-react';

export const DateDifferenceCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(true);

  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffMs = Math.abs(end.getTime() - start.getTime());
  let totalCalendarDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (includeEndDate) totalCalendarDays += 1;

  // Calculate business days (Monday to Friday)
  let businessDays = 0;
  let cur = new Date(start <= end ? start : end);
  const finish = new Date(start <= end ? end : start);

  while (cur <= finish) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) {
      businessDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  if (!includeEndDate && businessDays > 0) businessDays -= 1;

  const totalWeeks = (totalCalendarDays / 7).toFixed(1);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <label className="block text-xs font-semibold text-slate-500">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full text-base font-bold bg-transparent text-slate-900 dark:text-slate-100 py-1"
          />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <label className="block text-xs font-semibold text-slate-500">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full text-base font-bold bg-transparent text-slate-900 dark:text-slate-100 py-1"
          />
        </div>
      </div>

      <div className="flex items-center text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={includeEndDate}
            onChange={(e) => setIncludeEndDate(e.target.checked)}
            className="rounded accent-indigo-600"
          />
          <span>Include end date in calculation (+1 day)</span>
        </label>
      </div>

      {/* Result Cards */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-baseline justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Total Duration
            </span>
            <div className="text-4xl font-black text-white mt-1">
              {totalCalendarDays} Days
            </div>
          </div>
          <CopyButton textToCopy={`${totalCalendarDays} days`} label="Copy Days" size="sm" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 uppercase font-semibold">Working Business Days</span>
            <div className="text-3xl font-black text-cyan-400 mt-1">
              {businessDays}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">(Excludes weekends)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Weeks</span>
            <div className="text-3xl font-black text-indigo-400 mt-1">
              {totalWeeks}
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">weeks elapsed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
