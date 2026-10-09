import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Eye, Check, X, ArrowLeftRight } from 'lucide-react';

export const ContrastChecker: React.FC = () => {
  const [fgColor, setFgColor] = useState<string>('#FFFFFF');
  const [bgColor, setBgColor] = useState<string>('#4F46E5');

  const getLuminance = (hex: string) => {
    let clean = hex.replace(/^#/, '');
    if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const l1 = getLuminance(fgColor);
  const l2 = getLuminance(bgColor);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const formattedRatio = Math.round(ratio * 100) / 100;

  // WCAG evaluations
  const passAANormal = ratio >= 4.5;
  const passAALarge = ratio >= 3.0;
  const passAAANormal = ratio >= 7.0;
  const passAAALarge = ratio >= 4.5;

  const handleSwap = () => {
    const prev = fgColor;
    setFgColor(bgColor);
    setBgColor(prev);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Visual Mockup Box */}
      <div
        className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 transition-colors"
        style={{ backgroundColor: bgColor, color: fgColor }}
      >
        <h3 className="text-2xl font-black">
          The quick brown fox jumps over the lazy dog.
        </h3>
        <p className="text-sm opacity-90 leading-relaxed">
          Good color contrast ensures every user, including people with low vision or color blindness, can effortlessly read your content across screens.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value.toUpperCase())}
                  className="w-9 h-9 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value.toUpperCase())}
                  className="w-24 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              className="mt-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-transform hover:scale-105 cursor-pointer"
              title="Swap Colors"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                  className="w-9 h-9 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                  className="w-24 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 font-semibold uppercase">Contrast Ratio</span>
            <div className={`text-4xl font-black font-mono mt-0.5 ${passAANormal ? 'text-emerald-500' : 'text-rose-500'}`}>
              {formattedRatio}:1
            </div>
          </div>
        </div>

        {/* WCAG Compliance Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-slate-500 block mb-1">WCAG AA Normal</span>
            <div className={`font-bold flex items-center gap-1 ${passAANormal ? 'text-emerald-500' : 'text-rose-500'}`}>
              {passAANormal ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span>{passAANormal ? 'Pass (4.5:1)' : 'Fail'}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-slate-500 block mb-1">WCAG AA Large</span>
            <div className={`font-bold flex items-center gap-1 ${passAALarge ? 'text-emerald-500' : 'text-rose-500'}`}>
              {passAALarge ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span>{passAALarge ? 'Pass (3.0:1)' : 'Fail'}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-slate-500 block mb-1">WCAG AAA Normal</span>
            <div className={`font-bold flex items-center gap-1 ${passAAANormal ? 'text-emerald-500' : 'text-rose-500'}`}>
              {passAAANormal ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span>{passAAANormal ? 'Pass (7.0:1)' : 'Fail'}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
            <span className="text-slate-500 block mb-1">WCAG AAA Large</span>
            <div className={`font-bold flex items-center gap-1 ${passAAALarge ? 'text-emerald-500' : 'text-rose-500'}`}>
              {passAAALarge ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span>{passAAALarge ? 'Pass (4.5:1)' : 'Fail'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
