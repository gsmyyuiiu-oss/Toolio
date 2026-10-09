import React, { useState, useEffect } from 'react';
import { Clock4, Globe, Sun, Moon } from 'lucide-react';

interface CityClock {
  city: string;
  country: string;
  timeZone: string;
}

const CITIES: CityClock[] = [
  { city: 'London', country: 'United Kingdom', timeZone: 'Europe/London' },
  { city: 'New York', country: 'United States', timeZone: 'America/New_York' },
  { city: 'San Francisco', country: 'United States', timeZone: 'America/Los_Angeles' },
  { city: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo' },
  { city: 'Paris', country: 'France', timeZone: 'Europe/Paris' },
  { city: 'Dubai', country: 'UAE', timeZone: 'Asia/Dubai' },
  { city: 'Mumbai', country: 'India', timeZone: 'Asia/Kolkata' },
  { city: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney' },
];

export const WorldClock: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {CITIES.map((c) => {
          let timeString = '';
          let dateString = '';
          let hourNum = 12;

          try {
            const formatter = new Intl.DateTimeFormat('en-US', {
              timeZone: c.timeZone,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true,
            });
            timeString = formatter.format(now);

            const hourFormatter = new Intl.DateTimeFormat('en-US', {
              timeZone: c.timeZone,
              hour: 'numeric',
              hour12: false,
            });
            hourNum = parseInt(hourFormatter.format(now), 10);

            const dateFormatter = new Intl.DateTimeFormat('en-US', {
              timeZone: c.timeZone,
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
            dateString = dateFormatter.format(now);
          } catch {
            timeString = '00:00:00';
          }

          const isDaytime = hourNum >= 6 && hourNum < 18;

          return (
            <div
              key={c.city}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs hover:border-indigo-400 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">{c.country}</span>
                {isDaytime ? (
                  <span title="Daytime">
                    <Sun className="w-4 h-4 text-amber-500" />
                  </span>
                ) : (
                  <span title="Nighttime">
                    <Moon className="w-4 h-4 text-indigo-400" />
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {c.city}
                </h3>
                <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                  {timeString}
                </div>
                <div className="text-xs text-slate-400 font-medium mt-1">
                  {dateString}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
