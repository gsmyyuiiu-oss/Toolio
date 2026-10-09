import React, { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Shrink, RefreshCw } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadDataUrl } from '../../lib/downloadManager';

export const ImageCompressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [compressedPreview, setCompressedPreview] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(75);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setOriginalFile(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setOriginalPreview(dataUrl);
      compressImage(dataUrl, file.type, quality);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (srcUrl: string, mimeType: string, qualityPct: number) => {
    setIsCompressing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const format = mimeType === 'image/png' ? 'image/jpeg' : mimeType;
        const compressedData = canvas.toDataURL(format, qualityPct / 100);
        setCompressedPreview(compressedData);

        // Approximate size calculation
        const head = `data:${format};base64,`;
        const sizeInBytes = Math.round(((compressedData.length - head.length) * 3) / 4);
        setCompressedSize(sizeInBytes);
      }
      setIsCompressing(false);
    };
    img.src = srcUrl;
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (originalPreview && originalFile) {
      compressImage(originalPreview, originalFile.type, newQ);
    }
  };

  const handleDownload = () => {
    if (!compressedPreview) return;
    const downloadName = `compressed-${originalFile?.name || 'image.jpg'}`;
    downloadDataUrl(compressedPreview, downloadName, 'image-compressor');
  };

  const formatKB = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const savingsPercent = originalSize > 0 ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100)) : 0;

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!originalPreview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-10 text-center cursor-pointer transition-colors bg-white/50 dark:bg-slate-900/40"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Click to upload or drag &amp; drop your image
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Supports JPG, PNG, and WebP • 100% In-Browser Compression (Zero Cloud Uploads)
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-1/2 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Compression Quality:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                value={quality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Smaller file size (10%)</span>
                <span>Best quality (95%)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setOriginalPreview('');
                  setCompressedPreview('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Upload Another
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download ({formatKB(compressedSize)})</span>
              </button>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Card */}
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>Original Image</span>
                <span className="font-mono text-slate-500">{formatKB(originalSize)}</span>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <img src={originalPreview} alt="Original" className="max-h-full object-contain" />
              </div>
            </div>

            {/* Compressed Card */}
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-600 dark:text-emerald-400">
                  Compressed ({savingsPercent}% Saved!)
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                  {formatKB(compressedSize)}
                </span>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                {isCompressing ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                    <span>Compressing...</span>
                  </div>
                ) : (
                  <img src={compressedPreview} alt="Compressed" className="max-h-full object-contain" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
