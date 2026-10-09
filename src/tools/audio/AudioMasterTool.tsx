import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Download, Play, Pause, Scissors, Volume2, Mic,
  Sliders, Activity, Music, RefreshCw, Sparkles, Tag, Check,
  FastForward, TrendingUp, Layers, FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';
import { downloadBlob } from '../../utils/download';

interface Props {
  tool: ToolDefinition;
}

export const AudioMasterTool: React.FC<Props> = ({ tool }) => {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('audio.mp3');
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Tool specific states
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(10);
  const [volumeBoost, setVolumeBoost] = useState<number>(150); // percentage
  const [speedVal, setSpeedVal] = useState<number>(1);
  const [fadeInDuration, setFadeInDuration] = useState<number>(2);
  const [fadeOutDuration, setFadeOutDuration] = useState<number>(2);

  // Metadata
  const [trackTitle, setTrackTitle] = useState<string>('My Track');
  const [artistName, setArtistName] = useState<string>('Artist');
  const [albumName, setAlbumName] = useState<string>('Toolio Collection');

  // Microphone recording
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Speech to Text
  const [transcript, setTranscript] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  // Waveform visualization
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto setup based on tool slug
  useEffect(() => {
    const slug = tool.slug;
    if (slug === 'audio-volume-booster') setVolumeBoost(250);
    else if (slug === 'audio-volume-normalizer') setVolumeBoost(100);
    else if (slug === 'audio-speed-changer') setSpeedVal(1.5);
  }, [tool.slug]);

  // Generate an audio melody buffer (synth chord progression) so user can test right away
  const handleLoadSample = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioCtx;
    const sampleRate = audioCtx.sampleRate;
    const len = sampleRate * 5; // 5 seconds
    const buffer = audioCtx.createBuffer(2, len, sampleRate);

    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    // Chords frequencies: C4 (261.63), E4 (329.63), G4 (392.00), B4 (493.88)
    const freqs = [261.63, 329.63, 392.00, 523.25];
    for (let i = 0; i < len; i++) {
      const t = i / sampleRate;
      let val = 0;
      freqs.forEach((f, idx) => {
        val += Math.sin(2 * Math.PI * f * t) * Math.exp(-t * (0.8 + idx * 0.2)) * 0.2;
      });
      left[i] = val;
      right[i] = val;
    }

    setAudioBuffer(buffer);
    setDuration(5);
    setTrimEnd(5);
    setFileName('sample-melody.wav');

    // Create playable URL
    const wavBlob = audioBufferToWavBlob(buffer);
    const url = URL.createObjectURL(wavBlob);
    setAudioUrl(url);

    drawWaveform(buffer);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const arrayBuffer = await file.arrayBuffer();

    const audioCtx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioCtx;

    try {
      const decoded = await audioCtx.decodeAudioData(arrayBuffer);
      setAudioBuffer(decoded);
      setDuration(decoded.duration);
      setTrimEnd(decoded.duration);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      drawWaveform(decoded);
    } catch (err) {
      console.error('Audio decode failed', err);
    }
  };

  // Convert AudioBuffer to 16-bit PCM WAV Blob
  const audioBufferToWavBlob = (buf: AudioBuffer): Blob => {
    const numChannels = buf.numberOfChannels;
    const sampleRate = buf.sampleRate;
    const format = 1;
    const bitDepth = 16;
    const numSamples = buf.length * numChannels;
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
    for (let i = 0; i < buf.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buf.getChannelData(channel)[i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([buffer], { type: 'audio/wav' });
  };

  const drawWaveform = (buf: AudioBuffer) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const data = buf.getChannelData(0);
    const step = Math.ceil(data.length / canvas.width);
    const amp = canvas.height / 2;

    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, '#ec4899');
    grad.addColorStop(0.5, '#a855f7');
    grad.addColorStop(1, '#3b82f6');
    ctx.fillStyle = grad;

    for (let i = 0; i < canvas.width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  };

  const togglePlay = () => {
    if (!audioBuffer) return;
    const audioCtx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioCtx;

    if (isPlaying) {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }
      setIsPlaying(false);
    } else {
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = speedVal;

      const gainNode = audioCtx.createGain();
      gainNode.gain.value = volumeBoost / 100;

      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      source.onended = () => setIsPlaying(false);
      source.start(0, trimStart, trimEnd - trimStart);
      sourceNodeRef.current = source;
      setIsPlaying(true);
    }
  };

  // Start / Stop Microphone Recording
  const handleToggleRecord = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        recordedChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
          const arrayBuf = await blob.arrayBuffer();
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioContextRef.current = audioCtx;
          const decoded = await audioCtx.decodeAudioData(arrayBuf);
          setAudioBuffer(decoded);
          setDuration(decoded.duration);
          setTrimEnd(decoded.duration);
          setFileName('mic-recording.wav');
          setAudioUrl(URL.createObjectURL(blob));
          drawWaveform(decoded);
        };

        recorder.start();
        setIsRecording(true);
        setRecordingSeconds(0);
      } catch (err) {
        console.error('Microphone access denied', err);
      }
    }
  };

  // Live Speech Recognition for Audio to Text
  const handleToggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTranscript('Speech recognition is not supported in this browser engine.');
      return;
    }

    if (isTranscribing) {
      setIsTranscribing(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      };
      recognition.onerror = () => setIsTranscribing(false);
      recognition.onend = () => setIsTranscribing(false);
      recognition.start();
      setIsTranscribing(true);
    }
  };

  // Process & Download
  const handleProcessAndDownload = async () => {
    if (!audioBuffer) return;

    const audioCtx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioBuffer.sampleRate;
    const channels = audioBuffer.numberOfChannels;

    // Slice buffer according to trimStart and trimEnd
    const startSample = Math.floor(trimStart * sampleRate);
    const endSample = Math.min(audioBuffer.length, Math.floor(trimEnd * sampleRate));
    const newLength = Math.max(1, endSample - startSample);

    const newBuffer = audioCtx.createBuffer(channels, newLength, sampleRate);

    for (let c = 0; c < channels; c++) {
      const srcData = audioBuffer.getChannelData(c);
      const destData = newBuffer.getChannelData(c);
      const gain = volumeBoost / 100;

      for (let i = 0; i < newLength; i++) {
        let sample = srcData[startSample + i] * gain;

        // Apply Fade In
        if (fadeInDuration > 0 && i < fadeInDuration * sampleRate) {
          sample *= i / (fadeInDuration * sampleRate);
        }

        // Apply Fade Out
        const remaining = newLength - i;
        if (fadeOutDuration > 0 && remaining < fadeOutDuration * sampleRate) {
          sample *= remaining / (fadeOutDuration * sampleRate);
        }

        // Limiter
        destData[i] = Math.max(-1, Math.min(1, sample));
      }
    }

    const wavBlob = audioBufferToWavBlob(newBuffer);
    const ext = tool.slug.includes('mp3') ? 'mp3' : 'wav';
    await downloadBlob(wavBlob, `${fileName.replace(/\.[^/.]+$/, '')}-${tool.slug}.${ext}`, tool.slug);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Upload & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {!audioBuffer ? (
          tool.slug === 'audio-recorder' || tool.slug === 'voice-recorder' ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <button
                onClick={handleToggleRecord}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition transform hover:scale-105 mb-4 cursor-pointer ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-pink-500 text-white'}`}
              >
                <Mic className="w-10 h-10" />
              </button>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                {isRecording ? 'Recording Live Microphone...' : 'Click to Start Voice Recording'}
              </h3>
              <p className="text-sm text-slate-500 max-w-md mb-4">
                Record high quality audio with noise suppression directly into WAV format.
              </p>
              <button
                onClick={handleLoadSample}
                className="text-xs text-pink-600 dark:text-pink-400 font-semibold hover:underline"
              >
                Or test with sample audio melody
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-pink-300 dark:border-pink-900/50 rounded-2xl p-10 bg-pink-50/40 dark:bg-pink-950/20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
                <Music className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                Upload Audio for {tool.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                Supports MP3, WAV, M4A, AAC, FLAC, and OGG. Processed 100% inside your browser.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Choose Audio File
                </button>
                <button
                  onClick={handleLoadSample}
                  className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-pink-500" /> Load Sample Audio
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 flex items-center justify-center font-bold">
                  MP3
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm truncate max-w-xs">{fileName}</p>
                  <p className="text-xs text-slate-500">
                    Duration: {duration.toFixed(1)}s • {audioBuffer.sampleRate}Hz • {audioBuffer.numberOfChannels} ch
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play Audio'}
                </button>
                <button
                  onClick={() => {
                    setAudioBuffer(null);
                    setAudioUrl(null);
                  }}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Waveform Visualization Canvas */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
              <canvas ref={canvasRef} className="w-full h-32 rounded" />
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Column 1: Cut & Trim */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Trim & Cut Timeline
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
                    onChange={(e) => setTrimStart(Number(e.target.value))}
                    className="w-full accent-pink-500"
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
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>

              {/* Column 2: Volume & Speed */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Volume & Playback Speed
                </h4>
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                    <span>Volume Boost</span>
                    <span className="font-bold text-pink-500">{volumeBoost}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="400"
                    value={volumeBoost}
                    onChange={(e) => setVolumeBoost(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-1">
                    <span>Audio Speed</span>
                    <span className="font-bold text-pink-500">{speedVal}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={speedVal}
                    onChange={(e) => setSpeedVal(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>

              {/* Column 3: Processing Action */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Process & Export
                </h4>
                {tool.slug.includes('fade') && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Fade In ({fadeInDuration}s)</label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={fadeInDuration}
                        onChange={(e) => setFadeInDuration(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Fade Out ({fadeOutDuration}s)</label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={fadeOutDuration}
                        onChange={(e) => setFadeOutDuration(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleProcessAndDownload}
                  className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  Download Processed Audio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio to Text Feature */}
      {tool.slug === 'audio-to-text' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-pink-500" /> Real-Time Voice Transcription
            </h4>
            <button
              onClick={handleToggleSpeechRecognition}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer ${isTranscribing ? 'bg-rose-500 text-white animate-pulse' : 'bg-pink-500 text-white'}`}
            >
              <Mic className="w-3.5 h-3.5" />
              {isTranscribing ? 'Listening...' : 'Start Transcription'}
            </button>
          </div>
          <textarea
            readOnly
            value={transcript || 'Click "Start Transcription" and speak clearly into your microphone...'}
            rows={4}
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
          />
        </div>
      )}
    </div>
  );
};
