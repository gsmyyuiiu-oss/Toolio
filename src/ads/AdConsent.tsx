import React, { useState } from 'react';
import { ShieldCheck, Cookie, Check, X, Settings2 } from 'lucide-react';
import { useAds } from './AdProvider';

export const AdConsent: React.FC = () => {
  const { consent, updateConsent, setIsSettingsOpen, config } = useAds();
  const [closed, setClosed] = useState(false);

  if (!config.privacy.requireConsent || consent !== 'pending' || closed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-slide-up">
      <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xl space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Privacy &amp; Advertising Choices
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Toolio uses non-intrusive advertisements to keep 460+ browser utilities 100% free without accounts. Choose whether you agree to personalized ads.
            </p>
          </div>
        </div>

        <div className="pt-1 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => updateConsent('granted')}
            className="flex-1 min-w-[120px] px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept All</span>
          </button>

          <button
            type="button"
            onClick={() => updateConsent('denied')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Reject Non-Essential</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSettingsOpen(true);
              setClosed(true);
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Configure Ad Preferences"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
