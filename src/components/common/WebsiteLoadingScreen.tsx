import React from 'react';
import { Sparkles, Layers, Zap } from 'lucide-react';

interface LoadingScreenProps {
  progress?: number;
  message?: string;
}

export const WebsiteLoadingScreen: React.FC<LoadingScreenProps> = ({
  progress = 100,
  message = 'Preparing high-speed browser tools...'
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-2xl transition-all duration-700">
      {/* Background ambient glowing orbs */}
      <div className="absolute w-96 h-96 -top-20 -left-20 bg-indigo-600/30 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute w-96 h-96 -bottom-20 -right-20 bg-fuchsia-600/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Brand Logo Icon with Multi-ring Spinners */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          {/* Outer glowing pulsing ring */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 animate-spin-slow opacity-80 blur-md" />
          
          {/* Middle spinning border */}
          <div className="absolute inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-cyan-400 animate-spin-slow" />
          
          {/* Inner dark core */}
          <div className="absolute inset-2 rounded-xl bg-slate-950 flex items-center justify-center shadow-inner">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
          <span>Toolio</span>
          <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-sm">
            Pro Suite
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 font-medium">
          {message}
        </p>

        {/* Elegant Animated Progress Bar */}
        <div className="w-56 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-6 relative border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(10, progress))}%` }}
          />
          {/* Shimmer sweep over bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>

        <div className="flex items-center gap-4 mt-4 text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> 100% In-Browser
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-400" /> 460+ Active Tools
          </span>
        </div>
      </div>
    </div>
  );
};
