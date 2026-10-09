import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, FileImage } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadDataUrl } from '../../lib/downloadManager';

export const ImageFormatConverter: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [origName, setOrigName] = useState<string>('image.jpg');
  const [targetFormat, setTargetFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setOrigName(file.name.substring(0, file.name.lastIndexOf('.')) || 'image');
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const ext = targetFormat === 'image/jpeg' ? 'jpg' : targetFormat === 'image/png' ? 'png' : 'webp';
        const dataUrl = canvas.toDataURL(targetFormat, 0.92);
        downloadDataUrl(dataUrl, `${origName}.${ext}`, 'image-format-converter');
      }
    };
    img.src = imageSrc;
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
            <FileImage className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Click to upload photo to convert format
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Convert seamlessly between JPG, PNG, and WebP (Zero uploads, 100% private)
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Convert To:</label>
                <div className="flex gap-1.5">
                  {[
                    { label: 'PNG', mime: 'image/png' as const },
                    { label: 'JPG', mime: 'image/jpeg' as const },
                    { label: 'WebP', mime: 'image/webp' as const },
                  ].map((f) => (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => setTargetFormat(f.mime)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        targetFormat === f.mime
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {targetFormat === 'image/jpeg' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Background Fill Color</label>
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
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setImageSrc('')}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Converted File</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-950 flex items-center justify-center">
              <img src={imageSrc} alt="Preview" className="max-h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
