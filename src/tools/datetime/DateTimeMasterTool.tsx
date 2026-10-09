import React, { useState, useEffect } from 'react';
import {
  Clock, Globe, Calendar, CalendarDays, Timer, Hourglass,
  Play, Pause, RotateCcw, Copy, Check, Sparkles, Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

export const DateTimeMasterTool: React.FC<Props> = ({ tool }) => {
  const [now, setNow] = useState<Date>(new Date());
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);

  // Countdown timer state
  const [countdownMinutes, setCountdownMinutes] = useState<number>(10);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(600);
  const [isCountdownRunning, setIsCountdownRunning] = useState<boolean>(false);

  // Date Diff
  const [date1, setDate1] = useState<string>('2026-01-01');
  const [date2, setDate2] = useState<string>('2026-12-31');

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch ticker
  useEffect(() => {
    let interval: any = null;
    if (isStopwatchRunning) {
      interval = setInterval(() => setStopwatchTime((prev) => prev + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  // Countdown ticker
  useEffect(() => {
    let interval: any = null;
    if (isCountdownRunning && countdownSeconds > 0) {
      interval = setInterval(() => setCountdownSeconds((prev) => prev - 1), 1000);
    } else if (countdownSeconds === 0 && isCountdownRunning) {
      setIsCountdownRunning(false);
      confetti({ particleCount: 50, spread: 60 });
    }
    return () => clearInterval(interval);
  }, [isCountdownRunning, countdownSeconds]);

  // Date calculation
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffDays = Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  const diffWeeks = (diffDays / 7).toFixed(1);

  // World cities
  const CITIES = [
    { name: 'New York (EDT)', timeZone: 'America/New_York' },
    { name: 'London (BST)', timeZone: 'Europe/London' },
    { name: 'Tokyo (JST)', timeZone: 'Asia/Tokyo' },
    { name: 'Dubai (GST)', timeZone: 'Asia/Dubai' },
    { name: 'Paris (CEST)', timeZone: 'Europe/Paris' },
    { name: 'Singapore (SGT)', timeZone: 'Asia/Singapore' }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Dynamic Module based on slug */}
      {tool.slug === 'stopwatch' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Precision Stopwatch
          </h3>
          <p className="text-6xl sm:text-7xl font-mono font-black text-orange-500 tracking-tight">
            {Math.floor(stopwatchTime / 60000)
              .toString()
              .padStart(2, '0')}
            :
            {Math.floor((stopwatchTime % 60000) / 1000)
              .toString()
              .padStart(2, '0')}
            .
            {Math.floor((stopwatchTime % 1000) / 10)
              .toString()
              .padStart(2, '0')}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
              className={`px-8 py-3 rounded-2xl font-bold text-white shadow-md transition cursor-pointer ${isStopwatchRunning ? 'bg-amber-600' : 'bg-orange-500 hover:bg-orange-600'}`}
            >
              {isStopwatchRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                setIsStopwatchRunning(false);
                setStopwatchTime(0);
              }}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-2xl font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      ) : tool.slug === 'countdown-timer' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            Countdown Timer
          </h3>
          <p className="text-6xl sm:text-7xl font-mono font-black text-orange-500 tracking-tight">
            {Math.floor(countdownSeconds / 60)
              .toString()
              .padStart(2, '0')}
            :
            {(countdownSeconds % 60).toString().padStart(2, '0')}
          </p>
          <div className="flex justify-center gap-3">
            {[5, 10, 15, 25, 30].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setCountdownSeconds(m * 60);
                  setIsCountdownRunning(false);
                }}
                className="px-3 py-1.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-xl border border-orange-200 dark:border-orange-800"
              >
                {m}m
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => setIsCountdownRunning(!isCountdownRunning)}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow transition cursor-pointer"
            >
              {isCountdownRunning ? 'Pause' : 'Start Timer'}
            </button>
            <button
              onClick={() => {
                setIsCountdownRunning(false);
                setCountdownSeconds(600);
              }}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      ) : tool.slug.includes('date') || tool.slug.includes('days') ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Calculate Days & Differences Between Dates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Start Date</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-bold text-base"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">End Date</label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-bold text-base"
              />
            </div>
          </div>
          <div className="p-6 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-900 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-orange-600 uppercase">Duration Elapsed</p>
              <p className="text-3xl font-black text-orange-600 dark:text-orange-400 mt-1">
                {diffDays} Total Days ({diffWeeks} Weeks)
              </p>
            </div>
            <button
              onClick={() => handleCopy(`${diffDays} days`)}
              className="px-3 py-1.5 bg-white dark:bg-slate-800 text-xs font-bold rounded-xl border flex items-center gap-1 cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {isCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      ) : (
        /* World Clocks & Universal Clock */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Current Local Time
            </p>
            <p className="text-5xl sm:text-6xl font-mono font-black text-orange-500 tracking-tight">
              {now.toLocaleTimeString()}
            </p>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              {now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-orange-500" /> Live International Clocks
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CITIES.map((c) => {
              const timeStr = now.toLocaleTimeString('en-US', { timeZone: c.timeZone });
              return (
                <div
                  key={c.name}
                  className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800"
                >
                  <p className="text-xs text-slate-400 font-semibold">{c.name}</p>
                  <p className="text-xl font-mono font-black text-slate-800 dark:text-white mt-1">
                    {timeStr}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
