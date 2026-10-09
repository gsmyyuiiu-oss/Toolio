import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Palette } from 'lucide-react';

export const ColorPickerConverter: React.FC = () => {
  const [hex, setHex] = useState<string>('#4F46E5');

  // Convert Hex to RGB
  const hexToRgb = (h: string) => {
    let clean = h.replace(/^#/, '');
    if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgb = hexToRgb(hex);

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const cssString = `color: ${hex}; /* ${rgbString} */`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <input
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value.toUpperCase())}
              className="w-28 h-28 rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl cursor-pointer"
            />
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">HEX Code</label>
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="w-full text-xl font-mono font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6'].map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setHex(swatch)}
                  className="w-7 h-7 rounded-lg border-2 border-white dark:border-slate-800 shadow-xs cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: swatch }}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Format Conversions */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 font-mono text-xs">
            <div>
              <span className="text-slate-400 mr-2">RGB:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{rgbString}</span>
            </div>
            <CopyButton textToCopy={rgbString} label="Copy RGB" size="sm" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 font-mono text-xs">
            <div>
              <span className="text-slate-400 mr-2">HSL:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{hslString}</span>
            </div>
            <CopyButton textToCopy={hslString} label="Copy HSL" size="sm" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 font-mono text-xs">
            <div>
              <span className="text-slate-400 mr-2">CSS:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{cssString}</span>
            </div>
            <CopyButton textToCopy={cssString} label="Copy CSS" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
};
