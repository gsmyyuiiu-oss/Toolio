import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  Cookie,
  Lock,
  Sliders,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAds } from './AdProvider';
import { ConsentStatus } from './adConfig';

export const AdSettingsModal: React.FC = () => {
  const {
    consent,
    updateConsent,
    isSettingsOpen,
    setIsSettingsOpen,
  } = useAds();

  // Local state for interactive choices in this session
  const [allowAds, setAllowAds] = useState<boolean>(consent === 'granted');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync state whenever modal opens
  useEffect(() => {
    if (isSettingsOpen) {
      setAllowAds(consent === 'granted');
      setSavedSuccess(false);
    }
  }, [isSettingsOpen, consent]);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    const nextConsent: ConsentStatus = allowAds ? 'granted' : 'denied';
    updateConsent(nextConsent);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 800);
  };

  const handleAcceptAll = () => {
    updateConsent('granted');
    setAllowAds(true);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 600);
  };

  const handleRejectAll = () => {
    updateConsent('denied');
    setAllowAds(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 600);
  };

  // Browser Do Not Track indicator
  const dntActive = typeof navigator !== 'undefined' && (navigator.doNotTrack === '1' || (window as any).doNotTrack === '1');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="privacy-modal-title" className="text-base font-black text-slate-900 dark:text-white">
                Privacy &amp; Cookie Preferences
              </h3>
              <p className="text-xs text-slate-500">
                Manage your privacy choices and personalized advertising consent
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close preferences"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Toolio is built with a privacy-first architecture. All file manipulations, conversions, and calculations occur entirely within your browser engine. We never store or upload your private documents. Below you can customize how browser cookies and non-intrusive advertisements operate.
          </p>

          {/* Section 1: Strictly Necessary Storage */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Strictly Necessary Storage
                </h4>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Always Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Required for basic website functionality, such as saving your selected interface theme (light/dark), preferred language, and favorite tool shortcuts locally in browser storage. These never track you across the internet.
            </p>
          </div>

          {/* Section 2: Advertising & Analytics Cookies */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cookie className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Advertising &amp; Analytics
                </h4>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowAds}
                  onChange={(e) => setAllowAds(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enables polite, non-intrusive advertisements that allow us to provide over 460+ productivity tools completely free to the world without subscription walls. If turned off, personalized advertising cookies are blocked.
            </p>
          </div>

          {/* Section 3: Browser Privacy Signals */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Browser Do Not Track (DNT) / GPC Signal</span>
            </div>
            <span className={`font-semibold ${dntActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
              {dntActive ? 'Honored & Active' : 'Respected when set'}
            </span>
          </div>

          {/* Current Status Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs">
            <span className="text-slate-600 dark:text-slate-400">Current Consent Status:</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-300 capitalize">
              {consent === 'granted' ? 'Personalized Ads Permitted' : consent === 'denied' ? 'Non-Essential Ads Blocked' : 'Pending Selection'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={handleRejectAll}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Reject Non-Essential
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
            >
              Accept All
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Preferences Saved</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Choices</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
