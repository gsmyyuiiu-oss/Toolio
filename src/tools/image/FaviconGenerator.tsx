import React, { useState, useRef } from 'react';
import { Upload, Download, Sparkles } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { downloadDataUrl } from '../../lib/downloadManager';

export const FaviconGenerator: React.FC = () => {
  const [iconSrc, setIconSrc] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('⚡');
  const [isEmojiMode, setIsEmojiMode] = useState<boolean>(true);
  const [shape, setShape] = useState<'square' | 'rounded' | 'circle'>('rounded');
  const [bgColor, setBgColor] = useState<string>('#4F46E5');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateCanvas = (size: number): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Draw background
    ctx.fillStyle = bgColor;
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.clip();
    } else if (shape === 'rounded') {
      const radius = size * 0.22;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fill();
      ctx.clip();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    // Draw Emoji or Image
    if (isEmojiMode) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${size * 0.6}px sans-serif`;
      ctx.fillText(selectedEmoji, size / 2, size / 2 + size * 0.05);
    }

    return canvas;
  };

  const handleDownload = (size: number) => {
    const canvas = generateCanvas(size);
    downloadDataUrl(canvas.toDataURL('image/png'), `favicon-${size}x${size}.png`, 'favicon-generator');
  };

  const htmlCode = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Mode selector */}
        <div className="flex gap-2">
          {['⚡', '🚀', '🔥', '🛠️', '💎', '⭐', '🍀', '💡', '🎯', '🐱'].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                setSelectedEmoji(emoji);
                setIsEmojiMode(true);
              }}
              className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                selectedEmoji === emoji && isEmojiMode
                  ? 'bg-indigo-100 dark:bg-indigo-950 border-2 border-indigo-500'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Shape & Color options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Corner Shape</label>
            <div className="flex gap-2">
              {(['rounded', 'circle', 'square'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShape(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                    shape === s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-500">{bgColor}</span>
            </div>
          </div>
        </div>

        {/* Browser Tab Preview */}
        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Browser Tab Preview</span>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-t-lg bg-white dark:bg-slate-900 border-t border-x border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-xs">
            <span
              className={`w-4 h-4 flex items-center justify-center text-[10px] text-white ${
                shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded' : 'rounded-none'
              }`}
              style={{ backgroundColor: bgColor }}
            >
              {selectedEmoji}
            </span>
            <span>My Awesome App</span>
            <span className="text-slate-400 text-[10px] ml-2">×</span>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-500 mb-2">Download Favicon Sizes</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[16, 32, 48, 180].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleDownload(size)}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span>{size} × {size}</span>
              </button>
            ))}
          </div>
        </div>

        {/* HTML snippet */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>HTML &lt;head&gt; Code</span>
            <CopyButton textToCopy={htmlCode} label="Copy HTML" size="sm" />
          </div>
          <pre className="p-3 rounded-xl bg-slate-900 text-cyan-300 text-xs font-mono overflow-x-auto">
            {htmlCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
