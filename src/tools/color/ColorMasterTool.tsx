import React, { useState } from 'react';
import {
  Palette, Pipette, Sparkles, Sliders, Contrast,
  Sun, Moon, Copy, Check, Droplets, Square
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

export const ColorMasterTool: React.FC<Props> = ({ tool }) => {
  const [hexColor, setHexColor] = useState<string>('#d946ef');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [gradientDeg, setGradientDeg] = useState<number>(135);
  const [secondaryColor, setSecondaryColor] = useState<string>('#3b82f6');

  // Convert Hex to RGB
  const hexToRgb = (hex: string) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map((x) => x + x).join('');
    const num = parseInt(c, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  };

  const rgb = hexToRgb(hexColor);

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Generate 10 Shades
  const shades = Array.from({ length: 10 }, (_, i) => {
    const factor = (10 - i) / 10;
    const r = Math.round(rgb.r * factor);
    const g = Math.round(rgb.g * factor);
    const b = Math.round(rgb.b * factor);
    return `rgb(${r}, ${g}, ${b})`;
  });

  // Calculate Contrast Ratio with White (#ffffff)
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const lumColor = getLuminance(rgb.r, rgb.g, rgb.b);
  const contrastWithWhite = ((1.0 + 0.05) / (lumColor + 0.05)).toFixed(2);
  const contrastWithBlack = ((lumColor + 0.05) / (0.0 + 0.05)).toFixed(2);

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  const cssGradient = `linear-gradient(${gradientDeg}deg, ${hexColor}, ${secondaryColor})`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Visual Color Spectrum Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            className="w-32 h-32 rounded-3xl shadow-lg border-4 border-white dark:border-slate-800 flex items-center justify-center shrink-0 transition-transform transform hover:scale-105"
            style={{ backgroundColor: hexColor }}
          >
            <input
              type="color"
              value={hexColor}
              onChange={(e) => setHexColor(e.target.value)}
              className="w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="space-y-3 flex-1 text-center sm:text-left">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {hexColor.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Click the swatch or enter values to inspect across all web color spaces.
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-mono font-bold">
                rgb({rgb.r}, {rgb.g}, {rgb.b})
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-mono font-bold">
                hsl({hsl.h}°, {hsl.s}%, {hsl.l}%)
              </span>
            </div>
          </div>

          <button
            onClick={() => handleCopy(hexColor)}
            className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {isCopied ? 'Copied' : 'Copy HEX'}
          </button>
        </div>

        {/* Monochromatic Shade Ladder */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold uppercase text-slate-400">10-Step Monochromatic Shades</p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {shades.map((s, idx) => (
              <div
                key={idx}
                onClick={() => handleCopy(s)}
                className="h-14 rounded-xl cursor-pointer hover:scale-105 transition shadow-xs flex items-end p-1 text-[9px] font-mono font-bold text-white/80"
                style={{ backgroundColor: s }}
                title={s}
              />
            ))}
          </div>
        </div>

        {/* WCAG Contrast Assessment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950 text-white flex items-center justify-between border border-slate-800">
            <div>
              <p className="text-xs text-slate-400 font-bold">Contrast on White Text</p>
              <p className="text-2xl font-black mt-1">{contrastWithWhite}:1</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                Number(contrastWithWhite) >= 4.5
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}
            >
              {Number(contrastWithWhite) >= 4.5 ? 'WCAG AA Pass' : 'Low Contrast'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-between border border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-xs text-slate-500 font-bold">Contrast on Black Text</p>
              <p className="text-2xl font-black mt-1">{contrastWithBlack}:1</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                Number(contrastWithBlack) >= 4.5
                  ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-600 border border-rose-500/40'
              }`}
            >
              {Number(contrastWithBlack) >= 4.5 ? 'WCAG AA Pass' : 'Low Contrast'}
            </span>
          </div>
        </div>

        {/* CSS Gradient Sandbox */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 dark:text-white text-sm">
              CSS Gradient Generator
            </h4>
            <button
              onClick={() => handleCopy(`background: ${cssGradient};`)}
              className="text-xs font-bold text-fuchsia-600 hover:underline cursor-pointer"
            >
              Copy CSS
            </button>
          </div>
          <div
            className="w-full h-24 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800"
            style={{ background: cssGradient }}
          />
        </div>
      </div>
    </div>
  );
};
