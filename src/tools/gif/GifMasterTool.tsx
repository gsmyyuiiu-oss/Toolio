import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Download, Play, Pause, RefreshCw, Film, Eye,
  FastForward, Rewind, RotateCw, Crop, Sparkles, Layers,
  Scissors, Stamp, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import JSZip from 'jszip';
import { ToolDefinition } from '../../types';
import { downloadBlob } from '../../utils/download';

interface Props {
  tool: ToolDefinition;
}

interface FrameItem {
  dataUrl: string;
  delayMs: number;
}

export const GifMasterTool: React.FC<Props> = ({ tool }) => {
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [watermarkText, setWatermarkText] = useState<string>('TOOLIO');
  const [gifDimensions, setGifDimensions] = useState<{ width: number; height: number }>({ width: 400, height: 400 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generate demo animated frames so user can test right away
  const handleLoadSample = () => {
    const demoFrames: FrameItem[] = [];
    const colors = ['#10b981', '#06b6d4', '#6366f1', '#a855f7', '#ec4899', '#f59e0b'];

    colors.forEach((color, i) => {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 320;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 320, 320);

      // Rotating shape
      ctx.save();
      ctx.translate(160, 160);
      ctx.rotate((i * Math.PI) / 3);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(-80, -80, 160, 160, 24);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${i + 1}`, 0, 0);

      ctx.restore();

      demoFrames.push({
        dataUrl: canvas.toDataURL('image/png'),
        delayMs: 200
      });
    });

    setFrames(demoFrames);
    setGifDimensions({ width: 320, height: 320 });
    setCurrentFrameIdx(0);
    setIsPlaying(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const loadedFrames: FrameItem[] = [];
    let count = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        loadedFrames.push({ dataUrl: url, delayMs: 150 });
        count++;
        if (count === files.length) {
          setFrames(loadedFrames);
          setCurrentFrameIdx(0);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Play animation loop
  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;

    const activeList = isReversed ? [...frames].reverse() : frames;
    const currentDelay = (activeList[currentFrameIdx]?.delayMs || 150) / speedMultiplier;

    const timer = setTimeout(() => {
      setCurrentFrameIdx((prev) => (prev + 1) % activeList.length);
    }, currentDelay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentFrameIdx, frames, speedMultiplier, isReversed]);

  // Render current frame to canvas with transform / watermark
  useEffect(() => {
    if (frames.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const activeList = isReversed ? [...frames].reverse() : frames;
    const curFrame = activeList[currentFrameIdx];
    if (!curFrame) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = gifDimensions.width;
      canvas.height = gifDimensions.height;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotationAngle * Math.PI) / 180);

      ctx.drawImage(
        img,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height
      );

      ctx.restore();

      // Watermark
      if (tool.slug === 'gif-watermark-tool' && watermarkText.trim()) {
        ctx.font = 'bold 20px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 6;
        ctx.textAlign = 'right';
        ctx.fillText(watermarkText, canvas.width - 16, canvas.height - 16);
      }
    };
    img.src = curFrame.dataUrl;
  }, [currentFrameIdx, frames, isReversed, rotationAngle, watermarkText, gifDimensions, tool.slug]);

  // Download all frames as ZIP
  const handleDownloadAllFramesZip = async () => {
    if (frames.length === 0) return;
    const zip = new JSZip();

    frames.forEach((f, idx) => {
      const base64Data = f.dataUrl.replace(/^data:image\/(png|jpeg);base64,/, '');
      zip.file(`frame-${String(idx + 1).padStart(3, '0')}.png`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    await downloadBlob(content, `extracted-gif-frames.zip`, tool.slug);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Export as WebM/MP4 video
  const handleExportAsVideo = () => {
    if (!canvasRef.current || frames.length === 0) return;
    const canvas = canvasRef.current;
    const stream = canvas.captureStream(20);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      await downloadBlob(blob, `animated-${tool.slug}.mp4`, tool.slug);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    };

    recorder.start();
    setTimeout(() => {
      recorder.stop();
    }, 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Upload & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {frames.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 dark:border-emerald-900/50 rounded-2xl p-10 bg-emerald-50/40 dark:bg-emerald-950/20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              Upload GIF or Frame Images for {tool.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
              Upload GIF files or multiple photos (JPG, PNG) to create and edit animations in browser.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Choose GIF / Image Frames
              </button>
              <button
                onClick={handleLoadSample}
                className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" /> Try With Demo Animation
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.gif"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center font-bold">
                  GIF
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">
                    {frames.length} Animation Frames Loaded
                  </p>
                  <p className="text-xs text-slate-500">
                    Frame {currentFrameIdx + 1} of {frames.length} • {gifDimensions.width}x{gifDimensions.height}px
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => setFrames([])}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Live Animation Display Canvas */}
            <div className="flex justify-center bg-slate-950 p-6 rounded-2xl mb-6">
              <canvas
                ref={canvasRef}
                className="max-h-[340px] rounded-xl shadow-lg border border-slate-800"
              />
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Column 1: Speed & Direction */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Speed & Direction
                </h4>
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                    <span>Playback Speed</span>
                    <span className="font-bold text-emerald-500">{speedMultiplier}x</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[0.5, 1, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeedMultiplier(s)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded ${speedMultiplier === s ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsReversed(!isReversed)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition ${isReversed ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                  >
                    <Rewind className="w-4 h-4" /> Reverse Order
                  </button>
                  <button
                    onClick={() => setRotationAngle((prev) => (prev + 90) % 360)}
                    className="flex-1 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center gap-1"
                  >
                    <RotateCw className="w-4 h-4" /> Rotate 90°
                  </button>
                </div>
              </div>

              {/* Column 2: Dimensions & Watermark */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dimensions & Effects
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Width</label>
                    <input
                      type="number"
                      value={gifDimensions.width}
                      onChange={(e) => setGifDimensions({ ...gifDimensions, width: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Height</label>
                    <input
                      type="number"
                      value={gifDimensions.height}
                      onChange={(e) => setGifDimensions({ ...gifDimensions, height: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded"
                    />
                  </div>
                </div>

                {tool.slug === 'gif-watermark-tool' && (
                  <div>
                    <label className="text-xs text-slate-500">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded mt-1"
                    />
                  </div>
                )}
              </div>

              {/* Column 3: Exports */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Export Options
                </h4>

                <button
                  onClick={handleDownloadAllFramesZip}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-emerald-500" /> Download All Frames as ZIP
                </button>

                <button
                  onClick={handleExportAsVideo}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Result ({tool.slug.includes('mp4') ? 'MP4' : 'GIF'})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
