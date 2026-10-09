import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Play, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAds } from './AdProvider';
import { BannerAd } from './BannerAd';

export interface InterstitialState {
  isOpen: boolean;
  onComplete?: () => void;
  reason?: string;
}

export const InterstitialModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  reason?: string;
}> = ({ isOpen, onClose, onComplete, reason = 'Download Ready' }) => {
  const { config } = useAds();
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);
  const [canSkip, setCanSkip] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const duration = config.frequency.interstitialCountdownSeconds || 5;

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(duration);
      setCanSkip(false);

      let current = duration;
      timerRef.current = setInterval(() => {
        current -= 1;
        setSecondsRemaining(current);
        if (current <= 2) {
          setCanSkip(true);
        }
        if (current <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleProceed();
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, duration]);

  const handleProceed = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
    if (onComplete) {
      onComplete();
    }
  }, [onClose, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden space-y-5 text-center">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
              Sponsor Message
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-[11px] font-medium">{reason}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Adsterra Safe Network</span>
          </div>
        </div>

        {/* Headline */}
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Your file is ready!
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Please support Toolio sponsors to keep all tools free and account-free.
          </p>
        </div>

        {/* Sponsored Creative Display */}
        <div className="py-2 flex justify-center">
          <BannerAd
            size="300x250"
            placementId="interstitial_modal"
            label="Sponsored Sponsor Spot"
            className="my-0"
          />
        </div>

        {/* Action button & countdown */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold font-mono text-indigo-600 dark:text-indigo-400 text-xs">
              {secondsRemaining}
            </span>
            <span>{secondsRemaining > 0 ? `Auto-continuing in ${secondsRemaining}s...` : 'Ready!'}</span>
          </div>

          <button
            type="button"
            onClick={handleProceed}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer ${
              canSkip || secondsRemaining <= 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>{secondsRemaining <= 0 ? 'Continue to File' : canSkip ? 'Skip Ad & Continue' : 'Please wait...'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
