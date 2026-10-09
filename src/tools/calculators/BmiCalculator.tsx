import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Heart, Activity } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

export const BmiCalculator: React.FC = () => {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  // Metric
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);

  // Imperial
  const [weightLbs, setWeightLbs] = useState<number>(154);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);

  let bmi = 0;
  let minIdealWeight = 0;
  let maxIdealWeight = 0;

  if (unit === 'metric') {
    const hM = Math.max(0.1, heightCm / 100);
    bmi = weightKg / (hM * hM);
    minIdealWeight = 18.5 * (hM * hM);
    maxIdealWeight = 24.9 * (hM * hM);
  } else {
    const totalInches = heightFeet * 12 + heightInches;
    if (totalInches > 0) {
      bmi = (weightLbs / (totalInches * totalInches)) * 703;
      minIdealWeight = (18.5 * (totalInches * totalInches)) / 703;
      maxIdealWeight = (24.9 * (totalInches * totalInches)) / 703;
    }
  }

  const roundedBmi = Math.round(bmi * 10) / 10;

  let category = 'Normal';
  let categoryColor = 'text-emerald-500';
  let barColor = 'bg-emerald-500';

  if (roundedBmi < 18.5) {
    category = 'Underweight';
    categoryColor = 'text-blue-500';
    barColor = 'bg-blue-500';
  } else if (roundedBmi <= 24.9) {
    category = 'Normal weight';
    categoryColor = 'text-emerald-500';
    barColor = 'bg-emerald-500';
  } else if (roundedBmi <= 29.9) {
    category = 'Overweight';
    categoryColor = 'text-amber-500';
    barColor = 'bg-amber-500';
  } else {
    category = 'Obese';
    categoryColor = 'text-rose-500';
    barColor = 'bg-rose-500';
  }

  // Position on gauge (10 to 40 scale)
  const clampedBmi = Math.min(Math.max(roundedBmi, 10), 40);
  const pointerPercent = ((clampedBmi - 10) / 30) * 100;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Unit switch tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setUnit('metric')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              unit === 'metric'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Metric (kg, cm)
          </button>
          <button
            type="button"
            onClick={() => setUnit('imperial')}
            className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              unit === 'imperial'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Imperial (lbs, feet/inches)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <span>Enter Your Measurements</span>
          </h3>

          {unit === 'metric' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Height (Feet)</label>
                  <input
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Inches</label>
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Weight (lbs)</label>
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Ideal Healthy Weight Range for your height:
            <span className="block font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {Math.round(minIdealWeight)} – {Math.round(maxIdealWeight)} {unit === 'metric' ? 'kg' : 'lbs'}
            </span>
          </div>
        </div>

        {/* Results Panel */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Body Mass Index
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <span className="text-5xl font-black text-slate-900 dark:text-white">
                  {roundedBmi}
                </span>
                <span className={`block font-bold text-base mt-1 ${categoryColor}`}>
                  {category}
                </span>
              </div>
              <CopyButton textToCopy={`BMI: ${roundedBmi} (${category})`} label="Copy" size="sm" />
            </div>

            {/* Visual Gauge */}
            <div className="mt-6">
              <div className="relative h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800">
                <div className="bg-blue-400 h-full w-[28%]" title="Underweight (<18.5)"></div>
                <div className="bg-emerald-400 h-full w-[21%]" title="Normal (18.5 - 24.9)"></div>
                <div className="bg-amber-400 h-full w-[17%]" title="Overweight (25 - 29.9)"></div>
                <div className="bg-rose-400 h-full w-[34%]" title="Obese (30+)"></div>
              </div>

              {/* Indicator needle */}
              <div
                className="relative flex justify-center -mt-1 transform -translate-x-1/2 transition-all duration-300"
                style={{ left: `${pointerPercent}%` }}
              >
                <div className="w-3 h-3 bg-slate-900 dark:bg-white rounded-full border-2 border-white dark:border-slate-900 shadow-md"></div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                <span>&lt;18.5 (Low)</span>
                <span>18.5–24.9 (Norm)</span>
                <span>25–29.9</span>
                <span>30+ (Obese)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            ❤️ <strong>WHO Standard:</strong> BMI is a standard screening metric for adult men and women aged 20+.
          </div>
        </div>
      </div>
    </div>
  );
};
