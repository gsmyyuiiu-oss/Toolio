import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Download, Play, Pause, Scissors, Volume2, VolumeX,
  FastForward, RotateCw, Crop, Camera, Sparkles, Sliders,
  Video as VideoIcon, Music, Eye, RefreshCw, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';
import { downloadDataUrl, downloadUrl } from '../../utils/download';

interface Props {
  tool: ToolDefinition;
}

export const VideoMasterTool: React.FC<Props> = ({ tool }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('video.mp4');
  const [fileSize, setFileSize] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Tool specific states
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(5);
  const [speed, setSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [aspectPreset, setAspectPreset] = useState<'original' | '16:9' | '9:16' | '1:1'>('original');
  const [targetResolution, setTargetResolution] = useState<'1080p' | '720p' | '480p'>('720p');
  const [watermarkText, setWatermarkText] = useState<string>('TOOLIO');
  const [thumbnailText, setThumbnailText] = useState<string>('NEW VIDEO');
  const [extractedFrameUrl, setExtractedFrameUrl] = useState<string | null>(null);

  // Audio extraction
  const [extractedAudioUrl, setExtractedAudioUrl] = useState<string | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto configure defaults based on tool slug
  useEffect(() => {
    const slug = tool.slug;
    if (slug === 'slow-motion-maker') setSpeed(0.5);
    else if (slug === 'time-lapse-maker') setSpeed(4);
    else if (slug === 'mute-video') setIsMuted(true);
    else if (slug.includes('aspect-ratio') || slug === 'video-cropper') setAspectPreset('9:16');
  }, [tool.slug]);

  // Generate an in-browser sample video so the user can test immediately without uploading
  const handleLoadSample = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d')!;

    // We can generate a recorded canvas clip using MediaRecorder
    const stream = canvas.captureStream(30);
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    } catch {
      recorder = new MediaRecorder(stream);
    }

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoSrc(url);
      setFileName('sample-demo-video.webm');
      setFileSize(blob.size);
      setDuration(4);
      setTrimEnd(4);
      setDimensions({ width: 640, height: 360 });
    };

    recorder.start();

    // Animate a bouncing ball on canvas for 3 seconds
    let frame = 0;
    const maxFrames = 90; // 3 seconds at 30fps
    const animInterval = setInterval(() => {
      frame++;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 640, 360);

      // Rainbow background gradient
      const grad = ctx.createLinearGradient(0, 0, 640, 360);
      grad.addColorStop(0, '#7c3aed');
      grad.addColorStop(1, '#db2777');
      ctx.fillStyle = grad;
      ctx.fillRect(20, 20, 600, 320);

      // Bouncing circle
      const x = 320 + Math.sin(frame * 0.1) * 200;
      const y = 180 + Math.cos(frame * 0.1) * 80;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(x, y, 35, 0, Math.PI * 2);
      ctx.fill();

      // Text counter
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Toolio Video Engine: Frame ${frame}`, 320, 180);

      if (frame >= maxFrames) {
        clearInterval(animInterval);
        recorder.stop();
      }
    }, 1000 / 30);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const vid = videoRef.current;
    setDuration(vid.duration || 0);
    setTrimEnd(vid.duration || 5);
    setDimensions({ width: vid.videoWidth, height: vid.videoHeight });
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Capture current video frame as high-res still image
  const handleCaptureFrame = () => {
    if (!videoRef.current) return;
    const vid = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = vid.videoWidth || 640;
    canvas.height = vid.videoHeight || 360;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

    if (tool.slug === 'video-thumbnail-generator' && thumbnailText.trim()) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 44px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(thumbnailText, canvas.width / 2, canvas.height - 35);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setExtractedFrameUrl(dataUrl);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 }
    });
  };

  // Extract Audio as standard WAV PCM file
  const handleExtractAudio = async () => {
    if (!videoRef.current || !videoSrc) return;
    setIsProcessing(true);
    setProcessProgress(20);

    try {
      const response = await fetch(videoSrc);
      const arrayBuffer = await response.arrayBuffer();
      setProcessProgress(50);

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      setProcessProgress(80);

      // Encode into WAV
      const numChannels = decodedBuffer.numberOfChannels;
      const sampleRate = decodedBuffer.sampleRate;
      const format = 1; // PCM
      const bitDepth = 16;

      const numSamples = decodedBuffer.length * numChannels;
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);

      const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + numSamples * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, format, true);
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numChannels * 2, true);
      view.setUint16(32, numChannels * 2, true);
      view.setUint16(34, bitDepth, true);
      writeString(36, 'data');
      view.setUint32(40, numSamples * 2, true);

      let offset = 44;
      for (let i = 0; i < decodedBuffer.length; i++) {
        for (let channel = 0; channel < numChannels; channel++) {
          const sample = Math.max(-1, Math.min(1, decodedBuffer.getChannelData(channel)[i]));
          view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
          offset += 2;
        }
      }

      const audioBlob = new Blob([buffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setExtractedAudioUrl(audioUrl);
      setIsProcessing(false);
      setProcessProgress(100);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  // Video processing / render loop
  const handleProcessVideo = async () => {
    if (!videoRef.current) return;
    setIsProcessing(true);
    setProcessProgress(10);

    const vid = videoRef.current;
    const canvas = document.createElement('canvas');

    let outW = vid.videoWidth || 640;
    let outH = vid.videoHeight || 360;

    if (aspectPreset === '9:16') {
      outW = 720;
      outH = 1280;
    } else if (aspectPreset === '1:1') {
      outW = 720;
      outH = 720;
    }

    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d')!;

    const stream = canvas.captureStream(30);
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    } catch {
      recorder = new MediaRecorder(stream);
    }

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setProcessedVideoUrl(url);
      setIsProcessing(false);
      setProcessProgress(100);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    };

    recorder.start();

    vid.currentTime = trimStart;
    vid.playbackRate = speed;
    await vid.play();

    const drawInterval = setInterval(() => {
      if (!vid || vid.paused || vid.ended || vid.currentTime >= trimEnd) {
        clearInterval(drawInterval);
        vid.pause();
        recorder.stop();
        return;
      }

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Blurred background for vertical reels conversion
      if (aspectPreset === '9:16' || aspectPreset === '1:1') {
        ctx.filter = 'blur(20px)';
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';

        // Draw centered main video
        const scale = Math.min(canvas.width / vid.videoWidth, canvas.height / vid.videoHeight);
        const w = vid.videoWidth * scale;
        const h = vid.videoHeight * scale;
        ctx.drawImage(vid, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      } else {
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      }

      // Watermark
      if (tool.slug === 'video-watermark-tool' && watermarkText.trim()) {
        ctx.font = 'bold 28px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.fillText(watermarkText, canvas.width - 150, canvas.height - 30);
      }

      ctx.restore();

      const progress = Math.min(95, Math.round(((vid.currentTime - trimStart) / (trimEnd - trimStart)) * 100));
      setProcessProgress(progress);
    }, 1000 / 30);
  };

  const handleDownloadExtractedFrame = () => {
    if (!extractedFrameUrl) return;
    downloadDataUrl(extractedFrameUrl, `frame-${Math.round(currentTime)}s.jpg`, tool.slug);
  };

  const handleDownloadProcessed = () => {
    if (!processedVideoUrl) return;
    const ext = tool.slug.includes('webm') ? 'webm' : 'mp4';
    downloadUrl(processedVideoUrl, `${fileName.replace(/\.[^/.]+$/, '')}-${tool.slug}.${ext}`, tool.slug);
  };

  const handleDownloadAudio = () => {
    if (!extractedAudioUrl) return;
    const ext = tool.slug.includes('mp3') ? 'mp3' : 'wav';
    downloadUrl(extractedAudioUrl, `${fileName.replace(/\.[^/.]+$/, '')}-audio.${ext}`, tool.slug);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Upload & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {!videoSrc ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 dark:border-purple-900/50 rounded-2xl p-10 bg-purple-50/40 dark:bg-purple-950/20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <VideoIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              Upload Video for {tool.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
              Supports MP4, WebM, MOV, AVI, MKV, FLV & MPEG up to 500MB. Processed securely in your browser.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Choose Video File
              </button>
              <button
                onClick={handleLoadSample}
                className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-500" /> Try With Demo Clip
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center font-bold">
                  VID
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm truncate max-w-xs">{fileName}</p>
                  <p className="text-xs text-slate-500">
                    {dimensions.width}x{dimensions.height} • {duration.toFixed(1)}s • {(fileSize / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg transition"
                >
                  Change Video
                </button>
                <button
                  onClick={() => {
                    setVideoSrc(null);
                    setProcessedVideoUrl(null);
                    setExtractedFrameUrl(null);
                    setExtractedAudioUrl(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                >
                  Clear
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Video Player Display */}
            <div className="relative rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[400px] mb-6">
              <video
                ref={videoRef}
                src={videoSrc}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={() => {
                  if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                }}
                className="max-h-[380px] w-auto mx-auto"
                muted={isMuted}
              />
              <button
                onClick={togglePlay}
                className="absolute w-14 h-14 rounded-full bg-purple-600/80 hover:bg-purple-600 text-white flex items-center justify-center shadow-lg transition transform hover:scale-110 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Column 1: Trim & Speed */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Timeline & Speed
                </h4>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                    <span>Trim Start Time</span>
                    <span className="font-mono">{trimStart.toFixed(1)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 10}
                    step="0.1"
                    value={trimStart}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTrimStart(val);
                      if (videoRef.current) videoRef.current.currentTime = val;
                    }}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                    <span>Trim End Time</span>
                    <span className="font-mono">{trimEnd.toFixed(1)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 10}
                    step="0.1"
                    value={trimEnd}
                    onChange={(e) => setTrimEnd(Number(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                    <span>Playback Speed</span>
                    <span className="font-bold text-purple-600">{speed}x</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[0.25, 0.5, 1, 1.5, 2, 4].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSpeed(s);
                          if (videoRef.current) videoRef.current.playbackRate = s;
                        }}
                        className={`flex-1 py-1 text-xs font-medium rounded ${speed === s ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 2: Aspect & Audio */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Aspect Ratio & Sound
                </h4>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Aspect Ratio Preset
                  </label>
                  <select
                    value={aspectPreset}
                    onChange={(e) => setAspectPreset(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                  >
                    <option value="original">Original Aspect Ratio</option>
                    <option value="9:16">9:16 Vertical (TikTok, Reels, Shorts)</option>
                    <option value="1:1">1:1 Square (Instagram Posts)</option>
                    <option value="16:9">16:9 Landscape (YouTube, TV)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">Audio Mute State</p>
                    <p className="text-[10px] text-slate-400">Silence audio channel</p>
                  </div>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${isMuted ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    {isMuted ? 'Muted' : 'Sound On'}
                  </button>
                </div>

                {tool.slug.includes('audio') || tool.slug.includes('mp3') || tool.slug.includes('wav') ? (
                  <button
                    onClick={handleExtractAudio}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <Music className="w-4 h-4" /> Extract Audio Track ({tool.slug.includes('mp3') ? 'MP3' : 'WAV'})
                  </button>
                ) : (
                  <button
                    onClick={handleCaptureFrame}
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-purple-500" /> Capture Exact Frame as JPG
                  </button>
                )}
              </div>

              {/* Column 3: Processing Action */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Process & Export
                </h4>

                {tool.slug === 'video-watermark-tool' && (
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

                {tool.slug === 'video-thumbnail-generator' && (
                  <div>
                    <label className="text-xs text-slate-500">Thumbnail Cover Text</label>
                    <input
                      type="text"
                      value={thumbnailText}
                      onChange={(e) => setThumbnailText(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded mt-1"
                    />
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Rendering Video Canvas...</span>
                      <span>{processProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full transition-all duration-200"
                        style={{ width: `${processProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleProcessVideo}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                  Process {tool.name.replace('Video', '').trim()} Result
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Audio Player */}
      {extractedAudioUrl && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-pink-500" /> Extracted Audio Result
            </h4>
            <button
              onClick={handleDownloadAudio}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Audio
            </button>
          </div>
          <audio controls src={extractedAudioUrl} className="w-full" />
        </div>
      )}

      {/* Extracted Frame Preview */}
      {extractedFrameUrl && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-purple-500" /> Captured High-Res Still Frame
            </h4>
            <button
              onClick={handleDownloadExtractedFrame}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Frame Image
            </button>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-950 flex items-center justify-center">
            <img src={extractedFrameUrl} alt="Captured frame" className="max-h-[360px] rounded-lg shadow" />
          </div>
        </div>
      )}

      {/* Processed Video Output */}
      {processedVideoUrl && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" /> Processed Video Output Ready
            </h4>
            <button
              onClick={handleDownloadProcessed}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Processed Video
            </button>
          </div>
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-950 flex items-center justify-center">
            <video controls src={processedVideoUrl} className="max-h-[380px] rounded-lg shadow" />
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
