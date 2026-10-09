import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Download, RefreshCw, Copy, Check, Eye, Crop,
  Maximize2, Minimize2, RotateCw, FlipHorizontal, FlipVertical,
  Sun, Droplets, Grid, Sparkles, Stamp, Scissors, FileSearch,
  ShieldCheck, ArrowRightLeft, Image as ImageIcon, Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';
import { downloadDataUrl } from '../../lib/downloadManager';

interface Props {
  tool: ToolDefinition;
}

export const ImageMasterTool: React.FC<Props> = ({ tool }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image');
  const [fileSize, setFileSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Tool specific states
  const [quality, setQuality] = useState<number>(85);
  const [outputFormat, setOutputFormat] = useState<string>('image/png');
  const [resizeWidth, setResizeWidth] = useState<number>(800);
  const [resizeHeight, setResizeHeight] = useState<number>(600);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Filters
  const [blurVal, setBlurVal] = useState<number>(0);
  const [pixelateVal, setPixelateVal] = useState<number>(8);
  const [sharpenVal, setSharpenVal] = useState<number>(0);
  const [brightnessVal, setBrightnessVal] = useState<number>(100);
  const [contrastVal, setContrastVal] = useState<number>(100);
  const [grayscaleVal, setGrayscaleVal] = useState<number>(0);
  const [invertVal, setInvertVal] = useState<number>(0);

  // Watermark
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkPosition, setWatermarkPosition] = useState<'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(70);
  const [watermarkColor, setWatermarkColor] = useState<string>('#ffffff');
  const [watermarkFontSize, setWatermarkFontSize] = useState<number>(32);

  // Background removal
  const [bgTolerance, setBgTolerance] = useState<number>(30);
  const [bgColorToRemove, setBgColorToRemove] = useState<string>('#ffffff');

  // Base64
  const [base64Input, setBase64Input] = useState<string>('');
  const [base64Output, setBase64Output] = useState<string>('');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Live processed preview
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [processedFileSize, setProcessedFileSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-configure defaults based on tool slug
  useEffect(() => {
    const slug = tool.slug;
    if (slug.includes('to-png')) {
      setOutputFormat('image/png');
    } else if (slug.includes('to-jpg')) {
      setOutputFormat('image/jpeg');
    } else if (slug.includes('to-webp')) {
      setOutputFormat('image/webp');
    } else if (slug === 'image-compressor') {
      setOutputFormat('image/jpeg');
      setQuality(70);
    } else if (slug === 'image-blur') {
      setBlurVal(8);
    } else if (slug === 'image-pixelate') {
      setPixelateVal(16);
    } else if (slug === 'image-grayscale') {
      setGrayscaleVal(100);
    } else if (slug === 'image-color-inverter') {
      setInvertVal(100);
    } else if (slug === 'image-brightness-adjuster') {
      setBrightnessVal(125);
    } else if (slug === 'image-contrast-adjuster') {
      setContrastVal(140);
    }
  }, [tool.slug]);

  // Load a demo sample image so user can test instantly without uploading
  const handleLoadSample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;

    // Draw vibrant gradient background
    const grad = ctx.createLinearGradient(0, 0, 800, 600);
    grad.addColorStop(0, '#3b82f6');
    grad.addColorStop(0.5, '#8b5cf6');
    grad.addColorStop(1, '#ec4899');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);

    // Draw decorative art shapes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(400, 300, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 38px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Sample Test Image', 400, 290);

    ctx.font = '20px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('Toolio 100% In-Browser Engine (800x600)', 400, 330);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImageSrc(dataUrl);
    setFileName('sample-test-image.jpg');
    setFileSize(145000);
    setOriginalDimensions({ width: 800, height: 600 });
    setResizeWidth(800);
    setResizeHeight(600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageSrc(result);
      setBase64Output(result);

      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setResizeWidth(img.naturalWidth);
        setResizeHeight(img.naturalHeight);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  // Re-render processed canvas whenever settings change
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const slug = tool.slug;
      let targetW = originalDimensions.width || img.naturalWidth;
      let targetH = originalDimensions.height || img.naturalHeight;

      // Handle Resizer
      if (slug === 'image-resizer' || slug === 'image-compressor') {
        targetW = resizeWidth;
        targetH = resizeHeight;
      }

      // Handle Cropper (default 1:1 or custom)
      let cropX = 0;
      let cropY = 0;
      let cropW = img.naturalWidth;
      let cropH = img.naturalHeight;

      if (slug === 'image-cropper') {
        const minDim = Math.min(img.naturalWidth, img.naturalHeight);
        cropX = (img.naturalWidth - minDim) / 2;
        cropY = (img.naturalHeight - minDim) / 2;
        cropW = minDim;
        cropH = minDim;
        targetW = minDim;
        targetH = minDim;
      }

      // Handle Rotator
      const angleRad = (rotationAngle * Math.PI) / 180;
      const isOrthogonal = rotationAngle % 180 !== 0 && rotationAngle % 90 === 0;

      canvas.width = isOrthogonal ? targetH : targetW;
      canvas.height = isOrthogonal ? targetW : targetH;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle rotation and flip
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angleRad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // Apply CSS style canvas filters
      const filterStrings: string[] = [];
      if (blurVal > 0) filterStrings.push(`blur(${blurVal}px)`);
      if (brightnessVal !== 100) filterStrings.push(`brightness(${brightnessVal}%)`);
      if (contrastVal !== 100) filterStrings.push(`contrast(${contrastVal}%)`);
      if (grayscaleVal > 0) filterStrings.push(`grayscale(${grayscaleVal}%)`);
      if (invertVal > 0) filterStrings.push(`invert(${invertVal}%)`);

      if (filterStrings.length > 0) {
        ctx.filter = filterStrings.join(' ');
      }

      // Draw image
      ctx.drawImage(
        img,
        cropX, cropY, cropW, cropH,
        -targetW / 2, -targetH / 2, targetW, targetH
      );

      ctx.filter = 'none';
      ctx.restore();

      // Pixelation post-process
      if (slug === 'image-pixelate' && pixelateVal > 1) {
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d')!;
        const scaledW = Math.max(1, Math.floor(canvas.width / pixelateVal));
        const scaledH = Math.max(1, Math.floor(canvas.height / pixelateVal));
        offCanvas.width = scaledW;
        offCanvas.height = scaledH;

        offCtx.drawImage(canvas, 0, 0, scaledW, scaledH);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offCanvas, 0, 0, scaledW, scaledH, 0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
      }

      // Background Remover algorithm
      if (slug === 'image-background-remover') {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Parse target color hex
        const rTarget = parseInt(bgColorToRemove.slice(1, 3), 16) || 255;
        const gTarget = parseInt(bgColorToRemove.slice(3, 5), 16) || 255;
        const bTarget = parseInt(bgColorToRemove.slice(5, 7), 16) || 255;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const diff = Math.sqrt(
            Math.pow(r - rTarget, 2) + Math.pow(g - gTarget, 2) + Math.pow(b - bTarget, 2)
          );

          if (diff < bgTolerance * 2.5) {
            data[i + 3] = 0; // Transparent
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // Watermark overlay
      if (slug === 'image-watermark-tool' && watermarkText.trim()) {
        ctx.save();
        ctx.font = `bold ${watermarkFontSize}px Inter, sans-serif`;
        ctx.fillStyle = watermarkColor;
        ctx.globalAlpha = watermarkOpacity / 100;

        let wx = canvas.width / 2;
        let wy = canvas.height / 2;
        ctx.textAlign = 'center';

        if (watermarkPosition === 'bottom-right') {
          wx = canvas.width - 24;
          wy = canvas.height - 24;
          ctx.textAlign = 'right';
        } else if (watermarkPosition === 'bottom-left') {
          wx = 24;
          wy = canvas.height - 24;
          ctx.textAlign = 'left';
        } else if (watermarkPosition === 'top-right') {
          wx = canvas.width - 24;
          wy = 40;
          ctx.textAlign = 'right';
        } else if (watermarkPosition === 'top-left') {
          wx = 24;
          wy = 40;
          ctx.textAlign = 'left';
        }

        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 6;
        ctx.fillText(watermarkText, wx, wy);
        ctx.restore();
      }

      // Generate preview data URL
      const finalUrl = canvas.toDataURL(outputFormat, quality / 100);
      setPreviewDataUrl(finalUrl);

      // Estimate compressed size in bytes
      const approxBytes = Math.round((finalUrl.length * 3) / 4);
      setProcessedFileSize(approxBytes);
    };
    img.src = imageSrc;
  }, [
    imageSrc, quality, outputFormat, resizeWidth, resizeHeight,
    rotationAngle, flipH, flipV, blurVal, pixelateVal, brightnessVal,
    contrastVal, grayscaleVal, invertVal, watermarkText, watermarkPosition,
    watermarkOpacity, watermarkColor, watermarkFontSize, bgTolerance,
    bgColorToRemove, tool.slug, originalDimensions
  ]);

  const handleDownload = () => {
    if (!previewDataUrl) return;

    let ext = 'png';
    if (outputFormat === 'image/jpeg') ext = 'jpg';
    if (outputFormat === 'image/webp') ext = 'webp';

    const cleanBase = fileName.replace(/\.[^/.]+$/, '');
    const outName = `${cleanBase}-${tool.slug}.${ext}`;

    downloadDataUrl(previewDataUrl, outName, tool.slug);

    confetti({
      particleCount: 55,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleCopyBase64 = (type: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleBase64InputSubmit = () => {
    if (!base64Input.trim()) return;
    let url = base64Input.trim();
    if (!url.startsWith('data:image')) {
      url = `data:image/png;base64,${url}`;
    }
    setImageSrc(url);
    setFileName('decoded-image.png');
    setFileSize(Math.round((url.length * 3) / 4));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Upload & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {!imageSrc ? (
          tool.slug === 'base64-to-image' ? (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Paste Base64 Encoded Image Data:
              </label>
              <textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Paste data:image/png;base64,iVBORw0KGgoAAAANSUhEUg... or raw base64 string"
                rows={6}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleBase64InputSubmit}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition"
              >
                Decode & Preview Image
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-amber-300 dark:border-amber-900/50 rounded-2xl p-10 bg-amber-50/40 dark:bg-amber-950/20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                Upload Image for {tool.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                Supports JPG, PNG, WEBP, GIF, BMP, TIFF, HEIC & AVIF up to 100MB. Processed 100% in your browser for absolute privacy.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Choose Image File
                </button>
                <button
                  onClick={handleLoadSample}
                  className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-amber-500" /> Try With Sample Image
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center font-bold">
                IMG
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-white text-sm truncate max-w-xs">{fileName}</p>
                <p className="text-xs text-slate-500">
                  {originalDimensions.width}x{originalDimensions.height}px • {(fileSize / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg transition"
              >
                Change File
              </button>
              <button
                onClick={() => {
                  setImageSrc(null);
                  setPreviewDataUrl(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
              >
                Clear
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Controls Grid */}
        {imageSrc && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Control Column 1 */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Format & Compression
              </h4>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Target Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                >
                  <option value="image/png">PNG (Lossless, Transparent)</option>
                  <option value="image/jpeg">JPG / JPEG (Compact Web Photo)</option>
                  <option value="image/webp">WEBP (Next-Gen High Efficiency)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Compression Quality</span>
                  <span className="font-bold text-amber-500">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Resize Controls */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Dimensions</span>
                  <button
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`text-xs px-2 py-0.5 rounded font-mono ${lockAspectRatio ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}
                  >
                    {lockAspectRatio ? 'Locked 🔒' : 'Free 🔓'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400">Width (px)</label>
                    <input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setResizeWidth(val);
                        if (lockAspectRatio && originalDimensions.width > 0) {
                          setResizeHeight(Math.round(val * (originalDimensions.height / originalDimensions.width)));
                        }
                      }}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Height (px)</label>
                    <input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setResizeHeight(val);
                        if (lockAspectRatio && originalDimensions.height > 0) {
                          setResizeWidth(Math.round(val * (originalDimensions.width / originalDimensions.height)));
                        }
                      }}
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Control Column 2: Transform & Adjustments */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Transform & Filters
              </h4>

              {/* Rotation & Flip Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setRotationAngle((prev) => (prev + 90) % 360)}
                  className="flex-1 py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-medium rounded-lg flex items-center justify-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" /> +90°
                </button>
                <button
                  onClick={() => setFlipH(!flipH)}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 ${flipH ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  <FlipHorizontal className="w-3.5 h-3.5" /> Flip H
                </button>
                <button
                  onClick={() => setFlipV(!flipV)}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 ${flipV ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  <FlipVertical className="w-3.5 h-3.5" /> Flip V
                </button>
              </div>

              {/* Filter Sliders */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Brightness</span>
                    <span>{brightnessVal}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={brightnessVal}
                    onChange={(e) => setBrightnessVal(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Contrast</span>
                    <span>{contrastVal}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={contrastVal}
                    onChange={(e) => setContrastVal(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Blur (Radius)</span>
                    <span>{blurVal}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={blurVal}
                    onChange={(e) => setBlurVal(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                {tool.slug === 'image-pixelate' && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Pixel Block Size</span>
                      <span>{pixelateVal}px</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="48"
                      value={pixelateVal}
                      onChange={(e) => setPixelateVal(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Control Column 3: Specialized Features (Watermark / Bg Removal) */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Special Effects & Watermark
              </h4>

              {tool.slug === 'image-background-remover' ? (
                <div className="space-y-3 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900">
                  <label className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Background Color to Erase:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColorToRemove}
                      onChange={(e) => setBgColorToRemove(e.target.value)}
                      className="w-8 h-8 rounded border-0 cursor-pointer"
                    />
                    <span className="text-xs font-mono">{bgColorToRemove}</span>
                    <button
                      onClick={() => setBgColorToRemove('#ffffff')}
                      className="text-xs px-2 py-1 bg-white dark:bg-slate-800 rounded border"
                    >
                      White
                    </button>
                    <button
                      onClick={() => setBgColorToRemove('#00ff00')}
                      className="text-xs px-2 py-1 bg-white dark:bg-slate-800 rounded border"
                    >
                      Green
                    </button>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Color Tolerance</span>
                      <span>{bgTolerance}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="80"
                      value={bgTolerance}
                      onChange={(e) => setBgTolerance(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>
              ) : tool.slug === 'image-watermark-tool' ? (
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Position</label>
                      <select
                        value={watermarkPosition}
                        onChange={(e) => setWatermarkPosition(e.target.value as any)}
                        className="w-full px-2 py-1 text-xs bg-white dark:bg-slate-800 border rounded"
                      >
                        <option value="center">Center</option>
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="top-right">Top Right</option>
                        <option value="top-left">Top Left</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Opacity ({watermarkOpacity}%)</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                        className="w-full accent-amber-500 mt-1"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Metadata & EXIF Status
                    </p>
                    <p className="text-xs text-slate-500">
                      {tool.slug === 'exif-remover'
                        ? '✅ EXIF data automatically stripped on clean canvas export.'
                        : 'Dimensions and pixel data loaded in memory.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Download Master Button */}
              <button
                onClick={handleDownload}
                disabled={!previewDataUrl}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                Download {tool.name.replace('Image', '').trim()} Result
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Preview Display */}
      {previewDataUrl && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-500" /> Live Processed Result Preview
            </h4>
            <div className="flex items-center gap-3 text-xs">
              {processedFileSize && fileSize > 0 && (
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full font-bold">
                  {(processedFileSize / 1024).toFixed(1)} KB (
                  {Math.round((1 - processedFileSize / fileSize) * 100)}% smaller)
                </span>
              )}
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center min-h-[300px] overflow-hidden">
            <img
              src={previewDataUrl}
              alt="Processed preview"
              className="max-h-[480px] max-w-full object-contain rounded-lg shadow-md"
            />
          </div>
        </div>
      )}

      {/* Base64 Output Drawer (for Image to Base64 tool) */}
      {tool.slug === 'image-to-base64' && base64Output && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 dark:text-white">Generated Base64 Snippets</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600 dark:text-slate-400">Data URL URI</span>
                <button
                  onClick={() => handleCopyBase64('uri', base64Output)}
                  className="text-amber-500 hover:text-amber-600 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedType === 'uri' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedType === 'uri' ? 'Copied' : 'Copy URI'}
                </button>
              </div>
              <textarea
                readOnly
                value={base64Output.slice(0, 150) + '...'}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded font-mono text-xs"
                rows={2}
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600 dark:text-slate-400">HTML Image Tag</span>
                <button
                  onClick={() => handleCopyBase64('html', `<img src="${base64Output}" alt="Image" />`)}
                  className="text-amber-500 hover:text-amber-600 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedType === 'html' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedType === 'html' ? 'Copied' : 'Copy HTML'}
                </button>
              </div>
              <textarea
                readOnly
                value={`<img src="${base64Output.slice(0, 80)}..." alt="Image" />`}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded font-mono text-xs"
                rows={2}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
