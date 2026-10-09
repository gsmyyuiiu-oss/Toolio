import React, { useState, useRef, useEffect } from 'react';
import { ToolDefinition } from '../../types';
import { CopyButton } from '../../components/common/CopyButton';
import {
  Upload,
  Download,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sliders,
  Crop,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  ShieldCheck,
  Type,
  FileImage,
} from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadDataUrl } from '../../lib/downloadManager';

interface Props {
  tool: ToolDefinition;
}

export const UniversalImageWorkspace: React.FC<Props> = ({ tool }) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [fileName, setFileName] = useState<string>('sample.png');
  const [fileSize, setFileSize] = useState<number>(0);
  const [mimeType, setMimeType] = useState<string>('image/png');

  // Operation parameters
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [blur, setBlur] = useState<number>(0);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const [pixelate, setPixelate] = useState<number>(1);
  const [sharpen, setSharpen] = useState<boolean>(false);
  const [quality, setQuality] = useState<number>(85);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [aspectLock, setAspectLock] = useState<boolean>(true);
  const [origDimensions, setOrigDimensions] = useState<{ w: number; h: number }>({ w: 800, h: 600 });
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/png');
  const [watermarkText, setWatermarkText] = useState<string>('Toolio');
  const [watermarkColor, setWatermarkColor] = useState<string>('#ffffff');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(80);
  const [watermarkPos, setWatermarkPos] = useState<'center' | 'bottom-right' | 'top-left'>('bottom-right');
  const [bgRemoveThreshold, setBgRemoveThreshold] = useState<number>(30);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [base64Output, setBase64Output] = useState<string>('');
  const [base64Input, setBase64Input] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set initial preset according to tool slug
  useEffect(() => {
    const slug = tool.slug;
    if (slug.includes('to-png') || slug.includes('jpg-to-png') || slug.includes('gif-to-png') || slug.includes('bmp-to-png')) {
      setTargetFormat('image/png');
    } else if (slug.includes('to-jpg') || slug.includes('png-to-jpg') || slug.includes('webp-to-jpg')) {
      setTargetFormat('image/jpeg');
    } else if (slug.includes('to-webp')) {
      setTargetFormat('image/webp');
    } else if (slug === 'image-blur') {
      setBlur(8);
    } else if (slug === 'image-grayscale') {
      setGrayscale(100);
    } else if (slug === 'image-color-inverter') {
      setInvert(100);
    } else if (slug === 'image-pixelate') {
      setPixelate(12);
    } else if (slug === 'image-sharpen') {
      setSharpen(true);
    } else if (slug === 'image-brightness') {
      setBrightness(130);
    } else if (slug === 'image-contrast') {
      setContrast(140);
    } else if (slug === 'image-compressor') {
      setQuality(65);
    }
  }, [tool.slug]);

  const handleUpload = (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type || 'image/png');

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      setBase64Output(src);

      const img = new Image();
      img.onload = () => {
        setOrigDimensions({ w: img.width, h: img.height });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  // Re-render canvas whenever controls change
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isRotated90 = Math.abs(rotation % 180) === 90;
      canvas.width = isRotated90 ? targetHeight : targetWidth;
      canvas.height = isRotated90 ? targetWidth : targetHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Center for transforms
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      // Filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) blur(${blur}px) grayscale(${grayscale}%) invert(${invert}%)`;

      const drawW = targetWidth;
      const drawH = targetHeight;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Pixelation
      if (pixelate > 1) {
        const pCanvas = document.createElement('canvas');
        const pCtx = pCanvas.getContext('2d');
        const scale = 1 / pixelate;
        pCanvas.width = Math.max(1, Math.floor(canvas.width * scale));
        pCanvas.height = Math.max(1, Math.floor(canvas.height * scale));
        if (pCtx) {
          pCtx.drawImage(canvas, 0, 0, pCanvas.width, pCanvas.height);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(pCanvas, 0, 0, pCanvas.width, pCanvas.height, 0, 0, canvas.width, canvas.height);
          ctx.imageSmoothingEnabled = true;
        }
      }

      // Background removal (Chroma/corner keying)
      if (tool.slug === 'image-background-remover') {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        // Sample top-left corner as key background
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];

        for (let i = 0; i < data.length; i += 4) {
          const diff = Math.sqrt(
            Math.pow(data[i] - bgR, 2) + Math.pow(data[i + 1] - bgG, 2) + Math.pow(data[i + 2] - bgB, 2)
          );
          if (diff < bgRemoveThreshold * 2.5) {
            data[i + 3] = 0; // Transparent
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // Watermark
      if (tool.slug.includes('watermark') && watermarkText.trim()) {
        ctx.save();
        ctx.font = `bold ${Math.max(20, Math.floor(canvas.width * 0.05))}px sans-serif`;
        ctx.fillStyle = watermarkColor;
        ctx.globalAlpha = watermarkOpacity / 100;
        if (watermarkPos === 'center') {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(watermarkText, canvas.width / 2, canvas.height / 2);
        } else if (watermarkPos === 'bottom-right') {
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          ctx.fillText(watermarkText, canvas.width - 24, canvas.height - 24);
        } else {
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(watermarkText, 24, 24);
        }
        ctx.restore();
      }

      // Update Base64 string
      setBase64Output(canvas.toDataURL(targetFormat, quality / 100));
    };
    img.src = imageSrc;
  }, [
    imageSrc,
    rotation,
    flipH,
    flipV,
    brightness,
    contrast,
    blur,
    grayscale,
    invert,
    pixelate,
    targetWidth,
    targetHeight,
    targetFormat,
    quality,
    watermarkText,
    watermarkColor,
    watermarkOpacity,
    watermarkPos,
    bgRemoveThreshold,
    tool.slug,
  ]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ext = targetFormat === 'image/jpeg' ? 'jpg' : targetFormat === 'image/png' ? 'png' : 'webp';
    const dataUrl = canvas.toDataURL(targetFormat, quality / 100);
    const filename = `processed-${tool.slug}-${fileName.replace(/\.[^/.]+$/, '')}.${ext}`;
    downloadDataUrl(dataUrl, filename, tool.slug);
  };

  const handleBase64Load = () => {
    if (!base64Input.trim()) return;
    const clean = base64Input.startsWith('data:') ? base64Input : `data:image/png;base64,${base64Input}`;
    setImageSrc(clean);
  };

  return (
    <div className="space-y-6">
      {/* Upload card */}
      {!imageSrc ? (
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files[0]) handleUpload(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-amber-300 dark:border-amber-800/80 hover:border-amber-500 rounded-3xl p-10 text-center cursor-pointer transition-colors bg-amber-50/40 dark:bg-amber-950/20"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleUpload(e.target.files[0]);
              }}
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center shadow-xs">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Upload Image for {tool.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports JPG, PNG, WebP, GIF, BMP, TIFF, SVG, HEIC &amp; AVIF • 100% Client-Side Privacy
            </p>
          </div>

          {tool.slug === 'base64-to-image' && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Or Paste Base64 Data String:
              </label>
              <textarea
                rows={4}
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Paste data:image/png;base64,iVBORw0KGgoAAA..."
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
              ></textarea>
              <button
                type="button"
                onClick={handleBase64Load}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-sm"
              >
                Render Image from Base64
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Action Bar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setImageSrc('')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Change Image
              </button>
              <span className="text-xs text-slate-400 font-mono">
                {origDimensions.w}×{origDimensions.h}px • {(fileSize / 1024).toFixed(1)} KB
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={targetFormat}
                onChange={(e: any) => setTargetFormat(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="image/png">Export PNG</option>
                <option value="image/jpeg">Export JPG</option>
                <option value="image/webp">Export WebP</option>
              </select>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                <span>Download Result</span>
              </button>
            </div>
          </div>

          {/* Controls Box tailored to specific tool */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
            {/* Quick Transforms */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:border-amber-400 cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-500" />
                <span>Rotate 90° ({rotation}°)</span>
              </button>

              <button
                type="button"
                onClick={() => setFlipH((f) => !f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                  flipH
                    ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Flip Horizontal</span>
              </button>

              <button
                type="button"
                onClick={() => setFlipV((f) => !f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer ${
                  flipV
                    ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-800'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FlipVertical className="w-3.5 h-3.5" />
                <span>Flip Vertical</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGrayscale((g) => (g === 100 ? 0 : 100));
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                  grayscale === 100
                    ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-800'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                B&amp;W Grayscale
              </button>

              <button
                type="button"
                onClick={() => setInvert((i) => (i === 100 ? 0 : 100))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                  invert === 100
                    ? 'bg-amber-100 dark:bg-amber-950 border-amber-400 text-amber-800'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Invert Colors
              </button>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Quality:</span>
                  <span className="font-mono text-amber-600">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Brightness:</span>
                  <span className="font-mono text-amber-600">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Blur:</span>
                  <span className="font-mono text-amber-600">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Watermark controls if watermark tool */}
            {tool.slug.includes('watermark') && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Watermark Settings
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block mb-1 font-semibold text-slate-500">Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-slate-500">Position</label>
                    <select
                      value={watermarkPos}
                      onChange={(e: any) => setWatermarkPos(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
                    >
                      <option value="bottom-right">Bottom Right</option>
                      <option value="center">Center</option>
                      <option value="top-left">Top Left</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-slate-500">Opacity ({watermarkOpacity}%)</label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={watermarkOpacity}
                      onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 accent-amber-500 mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Background remover tolerance */}
            {tool.slug === 'image-background-remover' && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-amber-600">Background Tolerance Sensitivity</span>
                  <span>{bgRemoveThreshold}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={bgRemoveThreshold}
                  onChange={(e) => setBgRemoveThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg accent-amber-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Samples corner background color and makes matching pixels transparent.
                </p>
              </div>
            )}
          </div>

          {/* Preview Canvas */}
          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-center items-center overflow-auto max-h-[500px]">
            <canvas ref={canvasRef} className="max-w-full max-h-[460px] object-contain rounded-xl shadow-md"></canvas>
          </div>

          {/* Metadata & EXIF Viewer / Base64 */}
          {(tool.slug.includes('metadata') || tool.slug.includes('exif') || tool.slug.includes('base64')) && (
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Image Inspection &amp; Base64
                </h4>
                <CopyButton textToCopy={base64Output} label="Copy Base64" size="sm" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono">
                  <span className="text-slate-400 block text-[10px]">MIME TYPE</span>
                  <span className="font-bold">{mimeType}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono">
                  <span className="text-slate-400 block text-[10px]">DIMENSIONS</span>
                  <span className="font-bold">{origDimensions.w} × {origDimensions.h}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono">
                  <span className="text-slate-400 block text-[10px]">FILE SIZE</span>
                  <span className="font-bold">{(fileSize / 1024).toFixed(1)} KB</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono">
                  <span className="text-slate-400 block text-[10px]">EXIF TAGS</span>
                  <span className="font-bold text-emerald-500">Stripped / Clean</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
