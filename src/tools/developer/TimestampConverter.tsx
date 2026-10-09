import React, { useState, useEffect } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Watch, Clock } from 'lucide-react';

export const TimestampConverter: React.FC = () => {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState<string>(String(Math.floor(Date.now() / 1000)));
  const [inputDate, setInputDate] = useState<string>(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const epochNum = parseInt(inputEpoch, 10);
  // Auto-detect seconds vs milliseconds
  const ms = inputEpoch.length > 11 ? epochNum : epochNum * 1000;
  const parsedDate = !isNaN(epochNum) ? new Date(ms) : null;

  const handleDateToEpoch = (dStr: string) => {
    setInputDate(dStr);
    const d = new Date(dStr);
    if (!isNaN(d.getTime())) {
      setInputEpoch(String(Math.floor(d.getTime() / 1000)));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Current Ticker */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold">
            <Watch className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Current Unix Epoch Time</span>
            <div className="text-2xl font-black font-mono text-cyan-300">
              {currentEpoch}
            </div>
          </div>
        </div>
        <CopyButton textToCopy={String(currentEpoch)} label="Copy" size="sm" />
      </div>

      {/* Epoch to Date */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Enter Unix Timestamp (Seconds or Milliseconds):
          </label>
          <input
            type="number"
            value={inputEpoch}
            onChange={(e) => setInputEpoch(e.target.value)}
            className="w-full text-lg font-mono font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        {parsedDate && !isNaN(parsedDate.getTime()) ? (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
              <span className="text-slate-500">UTC / GMT:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{parsedDate.toUTCString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
              <span className="text-slate-500">Local Time:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{parsedDate.toString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
              <span className="text-slate-500">ISO 8601:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{parsedDate.toISOString()}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-rose-500">Invalid timestamp format</div>
        )}
      </div>

      {/* Date to Epoch */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
          Or Pick Date/Time to Convert to Epoch:
        </label>
        <input
          type="datetime-local"
          value={inputDate}
          onChange={(e) => handleDateToEpoch(e.target.value)}
          className="w-full text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
        />
      </div>
    </div>
  );
};
