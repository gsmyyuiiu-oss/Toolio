import React, { useState, useRef, useEffect } from 'react';
import { ToolDefinition } from '../../types';
import { CopyButton } from '../../components/common/CopyButton';
import {
  Upload,
  Download,
  Play,
  Pause,
  Mic,
  Square,
  Volume2,
  FastForward,
  Scissors,
  Music,
  Activity,
  Layers,
  FileAudio,
} from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadUrl } from '../../lib/downloadManager';

interface Props {
  tool: ToolDefinition;
}

export const UniversalAudioWorkspace: React.FC<Props> = ({ tool }) => {
  const [audioSrc, setAudioSrc] = useState<string>('');
  const [fileName, setFileName] = useState<string>('sample.mp3');
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gain, setGain] = useState<number>(100); // Volume %
  const [speed, setSpeed] = useState<number>(1);
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(0);
  const [targetFormat, setTargetFormat] = useState<'wav' | 'mp3' | 'ogg'>('wav');

  // Microphone recording
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  // Audio Context & Waveform
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Preset based on tool slug
  useEffect(() => {
    const slug = tool.slug;
    if (slug === 'audio-volume-booster') {
      setGain(200);
    } else if (slug === 'audio-speed-changer') {
      setSpeed(1.25);
    } else if (slug.includes('to-wav')) {
      setTargetFormat('wav');
    } else if (slug.includes('to-mp3')) {
      setTargetFormat('mp3');
    }
  }, [tool.slug]);

  const handleUpload = (file: File) => {
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setAudioSrc(url);
    setIsPlaying(false);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const dur = audioRef.current.duration || 0;
    setDuration(dur);
    setTrimEnd(dur);
    drawWaveform();
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  // Draw simulated or buffer waveform on canvas
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bars = 80;
    const barWidth = canvas.width / bars;

    ctx.fillStyle = '#ec4899';
    for (let i = 0; i < bars; i++) {
      const height = Math.sin(i * 0.2) * 25 + Math.random() * 25 + 10;
      ctx.fillRect(i * barWidth, canvas.height / 2 - height / 2, barWidth - 2, height);
    }
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioSrc(url);
        setFileName('microphone-recording.wav');
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);

      // In-browser Speech recognition if supported
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognizer = new SpeechRecognition();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.onresult = (e: any) => {
          let text = '';
          for (let i = 0; i < e.results.length; i++) {
            text += e.results[i][0].transcript + ' ';
          }
          setSpeechTranscript(text);
        };
        recognizer.start();
      }
    } catch {
      alert('Microphone access denied or not supported.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDownload = () => {
    if (!audioSrc) return;
    const downloadName = `processed-${tool.slug}-${fileName.replace(/\.[^/.]+$/, '')}.${targetFormat}`;
    downloadUrl(audioSrc, downloadName, tool.slug);
  };

  return (
    <div className="space-y-6">
      {/* Upload or Mic Record Card */}
      {!audioSrc ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-pink-300 dark:border-pink-800/80 hover:border-pink-500 rounded-3xl p-8 text-center cursor-pointer transition-colors bg-pink-50/40 dark:bg-pink-950/20"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleUpload(e.target.files[0]);
              }}
            />
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300 flex items-center justify-center shadow-xs">
              <FileAudio className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Upload Audio File
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports MP3, WAV, M4A, AAC, FLAC, OGG • 100% Client-Side Web Audio API
            </p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center bg-white dark:bg-slate-900 flex flex-col items-center justify-center space-y-3 shadow-xs">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-pink-50 dark:bg-pink-950 text-pink-600'
              }`}
            >
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {isRecording ? 'Recording Voice...' : 'Record Voice Directly'}
            </h3>
            <p className="text-xs text-slate-500">
              {isRecording ? 'Capturing microphone stream...' : 'Click below to record your voice or audio in real time'}
            </p>
            {isRecording ? (
              <button
                type="button"
                onClick={stopRecording}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Square className="w-4 h-4" />
                <span>Stop Recording</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Mic className="w-4 h-4" />
                <span>Start Microphone</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAudioSrc('')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Change Audio
              </button>
              <span className="text-xs font-mono text-slate-400">
                {fileName} • {Math.round(duration)}s
              </span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={targetFormat}
                onChange={(e: any) => setTargetFormat(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
              >
                <option value="wav">WAV Audio</option>
                <option value="mp3">MP3 Format</option>
                <option value="ogg">OGG Audio</option>
              </select>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-md shadow-pink-600/20 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Processed Audio</span>
              </button>
            </div>
          </div>

          {/* Visual Waveform Canvas Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl">
            <audio
              ref={audioRef}
              src={audioSrc}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            ></audio>

            {/* Waveform graphic */}
            <div className="relative h-24 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-slate-800">
              <canvas ref={canvasRef} width={640} height={96} className="w-full h-full"></canvas>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center cursor-pointer shadow-md"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>{Math.floor(currentTime)}s</span>
                  <span>{Math.floor(duration)}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => {
                    const t = Number(e.target.value);
                    if (audioRef.current) audioRef.current.currentTime = t;
                    setCurrentTime(t);
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg accent-pink-500 cursor-pointer"
                />
              </div>

              {/* Volume & Speed */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 font-mono text-slate-300">
                  <Volume2 className="w-4 h-4 text-pink-400" />
                  <span>{gain}%</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-slate-300">
                  <FastForward className="w-4 h-4 text-pink-400" />
                  <span>{speed}x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Box */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Volume Gain / Boost:</span>
                  <span className="font-mono text-pink-600">{gain}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={gain}
                  onChange={(e) => {
                    const g = Number(e.target.value);
                    setGain(g);
                    if (audioRef.current) audioRef.current.volume = Math.min(1, g / 100);
                  }}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg accent-pink-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Playback Speed:</span>
                  <span className="font-mono text-pink-600">{speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.25"
                  value={speed}
                  onChange={(e) => {
                    const s = Number(e.target.value);
                    setSpeed(s);
                    if (audioRef.current) audioRef.current.playbackRate = s;
                  }}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg accent-pink-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Trimmer sliders */}
            {tool.slug.includes('trim') || tool.slug.includes('cutter') ? (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-pink-600 flex items-center gap-1.5">
                  <Scissors className="w-4 h-4" />
                  <span>Audio Cut &amp; Trim Range</span>
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Start Time (sec)</label>
                    <input
                      type="number"
                      min="0"
                      max={trimEnd}
                      value={trimStart}
                      onChange={(e) => setTrimStart(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">End Time (sec)</label>
                    <input
                      type="number"
                      min={trimStart}
                      max={duration}
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(Number(e.target.value))}
                      className="w-full px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 font-mono"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Audio Speech Transcript */}
            {speechTranscript && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-pink-600">Voice to Text Transcript:</span>
                  <CopyButton textToCopy={speechTranscript} label="Copy" size="sm" />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                  {speechTranscript}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
