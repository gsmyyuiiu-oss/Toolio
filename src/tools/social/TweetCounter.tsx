import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Twitter, Split } from 'lucide-react';

export const TweetCounter: React.FC = () => {
  const [text, setText] = useState<string>(
    'Toolio is the universal online utility toolbox for the web! 200+ free tools with 100% in-browser processing. Zero sign-up, zero paywall. Check it out at https://toolio.pages.dev 🚀'
  );

  const charLimit = 280;
  const length = text.length;
  const remaining = charLimit - length;
  const pct = Math.min(100, Math.max(0, (length / charLimit) * 100));

  // Split into threads if longer than 280 characters
  const words = text.split(' ');
  const threads: string[] = [];
  let currentTweet = '';

  words.forEach((w) => {
    if ((currentTweet + ' ' + w).trim().length <= 260) {
      currentTweet = (currentTweet + ' ' + w).trim();
    } else {
      if (currentTweet) threads.push(currentTweet);
      currentTweet = w;
    }
  });
  if (currentTweet) threads.push(currentTweet);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Twitter className="w-5 h-5 text-sky-500" />
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Tweet &amp; Thread Counter
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className={remaining < 0 ? 'text-rose-500' : 'text-slate-500'}>
              {remaining} characters left
            </span>
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
              <div
                className={`w-6 h-6 rounded-full ${
                  remaining < 0 ? 'bg-rose-500' : remaining < 20 ? 'bg-amber-500' : 'bg-sky-500'
                } transition-all`}
                style={{ opacity: pct / 100 }}
              ></div>
            </div>
          </div>
        </div>

        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening? Type your tweet here..."
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm leading-relaxed focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
        ></textarea>
      </div>

      {/* Thread Splitter View if text exceeds limit */}
      {threads.length > 1 && (
        <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
              <Split className="w-4 h-4" />
              <span>Auto-Split Thread ({threads.length} Tweets)</span>
            </span>
            <CopyButton
              textToCopy={threads.map((t, i) => `${i + 1}/${threads.length} ${t}`).join('\n\n')}
              label="Copy Entire Thread"
              size="sm"
            />
          </div>

          <div className="space-y-2">
            {threads.map((tweet, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
              >
                <div className="flex justify-between items-center text-slate-400 font-mono">
                  <span>Tweet #{i + 1} of {threads.length}</span>
                  <CopyButton textToCopy={`${i + 1}/${threads.length} ${tweet}`} label="Copy" size="sm" />
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  <strong className="text-sky-500 mr-1.5">{i + 1}/{threads.length}</strong>
                  {tweet}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
