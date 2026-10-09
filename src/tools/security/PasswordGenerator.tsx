import React, { useState, useEffect } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { KeyRound, RefreshCw, ShieldCheck, ShieldAlert } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

const PASSPHRASE_WORDS = [
  'correct', 'horse', 'battery', 'staple', 'silver', 'forest', 'quantum', 'galaxy',
  'ocean', 'falcon', 'summit', 'shadow', 'aurora', 'crystal', 'velvet', 'beacon',
  'comet', 'ember', 'glacier', 'horizon', 'nebula', 'phoenix', 'solitude', 'vortex'
];

export const PasswordGenerator: React.FC = () => {
  const [mode, setMode] = useState<'random' | 'passphrase'>('random');
  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(true);
  const [passphraseWords, setPassphraseWords] = useState<number>(4);
  const [password, setPassword] = useState<string>('');

  const generatePassword = () => {
    if (mode === 'passphrase') {
      const selected = [];
      for (let i = 0; i < passphraseWords; i++) {
        const randIndex = Math.floor(Math.random() * PASSPHRASE_WORDS.length);
        selected.push(PASSPHRASE_WORDS[randIndex]);
      }
      setPassword(selected.join('-'));
      return;
    }

    let charset = '';
    if (includeLower) charset += excludeAmbiguous ? 'abcdefghijkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) charset += excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += excludeAmbiguous ? '23456789' : '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let res = '';
    for (let i = 0; i < length; i++) {
      res += charset[array[i] % charset.length];
    }
    setPassword(res);
    trackEvent('tool_complete', { tool: 'password-generator' });
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, mode, passphraseWords]);

  // Calculate entropy
  let poolSize = 0;
  if (includeLower) poolSize += 26;
  if (includeUpper) poolSize += 26;
  if (includeNumbers) poolSize += 10;
  if (includeSymbols) poolSize += 30;
  if (poolSize === 0) poolSize = 26;

  const entropyBits = mode === 'passphrase' ? passphraseWords * 13 : Math.round(length * Math.log2(poolSize));

  let strengthLabel = 'Weak';
  let strengthColor = 'text-rose-500';
  let crackTime = '< 1 second';

  if (entropyBits >= 80) {
    strengthLabel = 'Very Strong (Uncrackable)';
    strengthColor = 'text-emerald-500';
    crackTime = 'Trillions of years';
  } else if (entropyBits >= 60) {
    strengthLabel = 'Strong';
    strengthColor = 'text-cyan-500';
    crackTime = 'Thousands of years';
  } else if (entropyBits >= 40) {
    strengthLabel = 'Moderate';
    strengthColor = 'text-amber-500';
    crackTime = 'A few hours to days';
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Generated Password Result Box */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${strengthColor}`}>{strengthLabel}</span>
            <span>• ~{entropyBits} bits entropy</span>
          </div>
          <span className="text-[11px] text-slate-500">Estimated crack time: {crackTime}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono text-xl sm:text-2xl font-bold text-cyan-300 break-all select-all">
          {password}
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={generatePassword}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New</span>
          </button>
          <CopyButton textToCopy={password} label="Copy Password" size="md" />
        </div>
      </div>

      {/* Mode & Options Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('random')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              mode === 'random'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Random Characters
          </button>
          <button
            type="button"
            onClick={() => setMode('passphrase')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
              mode === 'passphrase'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Memorable Passphrase
          </button>
        </div>

        {mode === 'random' ? (
          <>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-600 dark:text-slate-300">Password Length:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{length} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>8 chars</span>
                <span>32 chars</span>
                <span>64 chars</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                <span>Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                <span>Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                <span>Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                <span>Symbols (!@#$%)</span>
              </label>
              <label className="col-span-2 flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                <span>Exclude ambiguous characters (0, O, 1, l, I)</span>
              </label>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Number of Words:</label>
            <div className="flex gap-2">
              {[3, 4, 5, 6].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setPassphraseWords(w)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    passphraseWords === w
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {w} Words
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
