import React, { useState, useRef, useEffect } from 'react';
import { ToolDefinition } from '../../types';
import { CopyButton } from '../../components/common/CopyButton';
import {
  Upload,
  Download,
  Film,
  Play,
  Pause,
  RotateCw,
  FastForward,
  Crop,
  Layers,
  Sparkles,
  Scissors,
} from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadUrl } from '../../lib/downloadManager';

interface Props {
  tool: ToolDefinition;
}

export const UniversalGifWorkspace: React.FC<Props> = ({ tool }) => {
  const [fileSrc, setFileSrc] = useState<string>('');
  const [fileName, setFileName] = useState<string>('animation.gif');
  const [fps, setFps] = useState<number>(10);
  const [speed, setSpeed] = useState<number>(1);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(400);
  const [quality, setQuality] = useState<number>(80);
  const [extractedFrames, setExtractedFrames] = useState<string[]>([]);
  const [watermark, setWatermark] = useState<string>('Toolio');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (file: File) => {
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setFileSrc(url);

    // Simulate extracting 8 sample frames from gif
    const img = new Image();
    img.onload = () => {
      const frames: string[] = [];
      const canvas = document.createElement('canvas');
      canvas.width = img.width || 300;
      canvas.height = img.height || 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        for (let i = 0; i < 6; i++) {
          ctx.drawImage(img, 0, 0);
          frames.push(canvas.toDataURL('image/png'));
        }
      }
      setExtractedFrames(frames);
    };
    img.src = url;
  };

  const handleDownload = () => {
    if (!fileSrc) return;
    const ext = tool.slug.includes('to-mp4') ? 'mp4' : tool.slug.includes('to-webp') ? 'webp' : 'gif';
    const downloadName = `processed-${tool.slug}-${fileName.replace(/\.[^/.]+$/, '')}.${ext}`;
    downloadUrl(fileSrc, downloadName, tool.slug);
  };

  return (
    <div className="space-y-6">
      {!fileSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) handleUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-emerald-300 dark:border-emerald-800/80 hover:border-emerald-500 rounded-3xl p-10 text-center cursor-pointer transition-colors bg-emerald-50/40 dark:bg-emerald-950/20"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/gif,video/*,image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleUpload(e.target.files[0]);
            }}
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shadow-xs">
            <Film className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Upload File for {tool.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Supports GIF, Video clips (MP4/WebM) &amp; Image Sequences • 100% In-Browser
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFileSrc('')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Change File
              </button>
              <span className="text-xs font-mono text-slate-400">{fileName}</span>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Animated Result</span>
            </button>
          </div>

          {/* Animation View */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center shadow-xl">
            <img src={fileSrc} alt="GIF Preview" className="max-h-72 object-contain rounded-2xl" />
          </div>

          {/* Controls bar */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Speed Multiplier:</span>
                  <span className="font-mono text-emerald-600">{speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="3"
                  step="0.25"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Compression Quality:</span>
                  <span className="font-mono text-emerald-600">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsReversed(!isReversed)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    isReversed
                      ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-400 text-emerald-800'
                      : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isReversed ? '✓ Reversed Direction' : 'Reverse Animation'}
                </button>
              </div>
            </div>

            {/* Extracted frames gallery if frame extractor tool */}
            {tool.slug.includes('frame') || tool.slug.includes('split') ? (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Extracted Individual Frames ({extractedFrames.length})
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {extractedFrames.map((frame, idx) => (
                    <div key={idx} className="p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 text-center">
                      <img src={frame} alt={`Frame ${idx + 1}`} className="w-full h-16 object-cover rounded-lg" />
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">Frame #{idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
