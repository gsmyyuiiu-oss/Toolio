import React, { useState, useRef } from 'react';
import { Upload, Pipette } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const ImageColorPicker: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [pickedColor, setPickedColor] = useState<string>('#4F46E5');
  const [rgbColor, setRgbColor] = useState<string>('rgb(79, 70, 229)');
  const [swatches, setSwatches] = useState<string[]>(['#4F46E5', '#06B6D4', '#10B981', '#F59E0B']);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    setPickedColor(hex);
    setRgbColor(`rgb(${r}, ${g}, ${b})`);
    setSwatches(prev => [hex, ...prev.filter(c => c !== hex)].slice(0, 8));
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-10 text-center cursor-pointer transition-colors bg-white/50 dark:bg-slate-900/40"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Pipette className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Upload an image to pick &amp; inspect colors
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Click anywhere on the photo to extract exact HEX, RGB, and palette colors
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Picked color bar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl border-2 border-white dark:border-slate-800 shadow-md transition-colors"
                style={{ backgroundColor: pickedColor }}
              ></div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Selected Color</span>
                <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                  {pickedColor}
                </div>
                <div className="text-xs font-mono text-slate-500">{rgbColor}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CopyButton textToCopy={pickedColor} label="Copy HEX" size="md" />
              <CopyButton textToCopy={rgbColor} label="Copy RGB" size="md" />
              <button
                type="button"
                onClick={() => setImageSrc('')}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Change Image
              </button>
            </div>
          </div>

          {/* Palette History */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium">Sampled Palette:</span>
            {swatches.map((color, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPickedColor(color)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:scale-105 transition-transform"
              >
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: color }}></span>
                <span className="font-mono text-[11px] font-bold">{color}</span>
              </button>
            ))}
          </div>

          {/* Interactive Canvas */}
          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-center overflow-auto max-h-[500px]">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="cursor-crosshair max-w-full rounded-xl shadow-md"
            ></canvas>
          </div>
        </div>
      )}
    </div>
  );
};
