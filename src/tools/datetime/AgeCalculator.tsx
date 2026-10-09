import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Calendar, Cake, Clock } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const birth = new Date(birthDate);
  const target = new Date(targetDate);

  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = Math.max(0, target.getTime() - birth.getTime());
  const totalDaysLived = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDaysLived / 7);
  const totalHours = totalDaysLived * 24;

  // Day of birth
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const birthDayName = daysOfWeek[birth.getDay()];

  // Next birthday calculation
  const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday < target) {
    nextBirthday.setFullYear(target.getFullYear() + 1);
  }
  const daysUntilNextBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <label className="block text-xs font-semibold text-slate-500">Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full text-base font-bold bg-transparent text-slate-900 dark:text-slate-100 py-1"
          />
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <label className="block text-xs font-semibold text-slate-500">Calculate Age As Of</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full text-base font-bold bg-transparent text-slate-900 dark:text-slate-100 py-1"
          />
        </div>
      </div>

      {/* Main Age Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-baseline justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Your Current Age
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              {years} Years, {months} Months, {days} Days
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              Born on a <strong>{birthDayName}</strong>
            </span>
          </div>
          <CopyButton textToCopy={`${years} years, ${months} months, ${days} days`} label="Copy Age" size="sm" />
        </div>

        {/* Secondary metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block">Total Days</span>
            <span className="font-bold text-base text-cyan-300 font-mono mt-0.5 block">{totalDaysLived.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block">Total Weeks</span>
            <span className="font-bold text-base text-cyan-300 font-mono mt-0.5 block">{totalWeeks.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block">Total Hours</span>
            <span className="font-bold text-base text-cyan-300 font-mono mt-0.5 block">{totalHours.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block">Next Birthday</span>
            <span className="font-bold text-base text-amber-300 font-mono mt-0.5 block">In {daysUntilNextBirthday} days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
