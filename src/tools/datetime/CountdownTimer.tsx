import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, Flag } from 'lucide-react';

export const CountdownTimer: React.FC = () => {
  const [mode, setMode] = useState<'timer' | 'stopwatch'>('timer');

  // Countdown timer state
  const [timerMinutes, setTimerMinutes] = useState<number>(25);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(25 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Stopwatch state
  const [stopwatchMs, setStopwatchMs] = useState<number>(0);
  const [stopwatchRunning, setStopwatchRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSecondsLeft]);

  // Stopwatch interval
  useEffect(() => {
    let interval: any = null;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchMs(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatStopwatch = (totalMs: number) => {
    const mins = Math.floor(totalMs / 60000);
    const secs = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor((totalMs % 1000) / 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const handleResetTimer = (mins: number) => {
    setTimerRunning(false);
    setTimerMinutes(mins);
    setTimerSecondsLeft(mins * 60);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMode('timer')}
            className={`px-5 py-2 rounded-lg text-xs font-bold cursor-pointer ${
              mode === 'timer'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Countdown Timer
          </button>
          <button
            type="button"
            onClick={() => setMode('stopwatch')}
            className={`px-5 py-2 rounded-lg text-xs font-bold cursor-pointer ${
              mode === 'stopwatch'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Stopwatch &amp; Laps
          </button>
        </div>
      </div>

      {mode === 'timer' ? (
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 text-center space-y-6 shadow-xl">
          {/* Preset Buttons */}
          <div className="flex justify-center gap-2 text-xs">
            {[5, 10, 15, 25, 45].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleResetTimer(m)}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${
                  timerMinutes === m && !timerRunning
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {m}m {m === 25 ? '(Pomodoro)' : ''}
              </button>
            ))}
          </div>

          {/* Time digits */}
          <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-cyan-300">
            {formatTimer(timerSecondsLeft)}
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setTimerRunning(!timerRunning)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{timerRunning ? 'Pause' : 'Start'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleResetTimer(timerMinutes)}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 text-center space-y-6 shadow-xl">
          <div className="text-5xl sm:text-6xl font-mono font-black tracking-tight text-emerald-300">
            {formatStopwatch(stopwatchMs)}
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setStopwatchRunning(!stopwatchRunning)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              {stopwatchRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{stopwatchRunning ? 'Stop' : 'Start'}</span>
            </button>
            {stopwatchRunning && (
              <button
                type="button"
                onClick={() => setLaps(prev => [stopwatchMs, ...prev])}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span>Lap</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setStopwatchRunning(false);
                setStopwatchMs(0);
                setLaps([]);
              }}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {laps.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800 text-left max-h-40 overflow-y-auto pr-2 space-y-1 text-xs font-mono">
              {laps.map((l, i) => (
                <div key={i} className="flex justify-between p-2 rounded bg-slate-950 text-slate-300">
                  <span>Lap #{laps.length - i}</span>
                  <span className="text-emerald-400 font-bold">{formatStopwatch(l)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
