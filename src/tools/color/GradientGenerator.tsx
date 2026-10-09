import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Layers, RotateCw } from 'lucide-react';

export const GradientGenerator: React.FC = () => {
  const [color1, setColor1] = useState<string>('#4F46E5');
  const [color2, setColor2] = useState<string>('#06B6D4');
  const [angle, setAngle] = useState<number>(135);
  const [type, setType] = useState<'linear' | 'radial'>('linear');

  const cssGradient =
    type === 'linear'
      ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;

  const fullCssRule = `background: ${cssGradient};`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Live Preview Box */}
      <div
        className="w-full h-44 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 transition-all duration-300 flex items-center justify-center text-white font-bold text-sm"
        style={{ background: cssGradient }}
      >
        <span className="px-4 py-2 rounded-xl bg-black/30 backdrop-blur-xs font-mono">
          {type === 'linear' ? `${angle}° Angle` : 'Radial Circle'}
        </span>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('linear')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                type === 'linear'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Linear Gradient
            </button>
            <button
              type="button"
              onClick={() => setType('radial')}
              className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                type === 'radial'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              Radial Gradient
            </button>
          </div>

          {type === 'linear' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-semibold">Angle: {angle}°</span>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg accent-indigo-600"
              />
            </div>
          )}
        </div>

        {/* Color pickers */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Start Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-24 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">End Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-9 h-9 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-24 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* CSS Code */}
        <div className="p-3 rounded-2xl bg-slate-900 text-white font-mono text-xs flex items-center justify-between border border-slate-800">
          <span className="text-cyan-300 truncate pr-2">{fullCssRule}</span>
          <CopyButton textToCopy={fullCssRule} label="Copy CSS" size="sm" />
        </div>
      </div>
    </div>
  );
};
