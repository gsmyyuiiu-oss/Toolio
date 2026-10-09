import React, { useState } from 'react';
import {
  ShieldCheck, Lock, Key, Copy, Check, RefreshCw,
  Eye, EyeOff, ShieldAlert, Sparkles, Hash
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

export const SecurityMasterTool: React.FC<Props> = ({ tool }) => {
  const [passwordLength, setPasswordLength] = useState<number>(18);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>('k9#Wv$2mQ!z8Lp@7Xx');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Subnet CIDR calculation
  const [ipAddress, setIpAddress] = useState<string>('192.168.1.1');
  const [cidrBits, setCidrBits] = useState<number>(24);

  // Generate high-entropy password
  const handleGeneratePassword = () => {
    let chars = '';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    const array = new Uint32Array(passwordLength);
    crypto.getRandomValues(array);

    let res = '';
    for (let i = 0; i < passwordLength; i++) {
      res += chars[array[i] % chars.length];
    }

    setGeneratedPassword(res);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Entropy calculation
  let poolSize = 0;
  if (includeUppercase) poolSize += 26;
  if (includeLowercase) poolSize += 26;
  if (includeNumbers) poolSize += 10;
  if (includeSymbols) poolSize += 30;
  const entropy = Math.round(passwordLength * Math.log2(poolSize || 1));

  // Subnet stats
  const totalHosts = Math.pow(2, 32 - cidrBits);
  const usableHosts = Math.max(0, totalHosts - 2);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Subnet / IP Calculator View */}
      {tool.slug.includes('subnet') || tool.slug.includes('cidr') || tool.slug.includes('ipv4') ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            IPv4 Subnet & CIDR Mask Calculator
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">IP Address</label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-mono text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">
                Subnet Mask Prefix (/{cidrBits})
              </label>
              <input
                type="range"
                min="8"
                max="30"
                value={cidrBits}
                onChange={(e) => setCidrBits(Number(e.target.value))}
                className="w-full accent-red-500 mt-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border">
              <p className="text-xs text-slate-400 font-bold">Usable Hosts</p>
              <p className="text-2xl font-black text-red-500 mt-1">{usableHosts.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border">
              <p className="text-xs text-slate-400 font-bold">Total Addresses</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{totalHosts.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border">
              <p className="text-xs text-slate-400 font-bold">Wildcard Mask</p>
              <p className="text-xl font-mono font-bold text-slate-800 dark:text-white mt-1">
                0.0.0.{255 - (256 - totalHosts % 256)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Password & Key Generator View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="p-6 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
              <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Cryptographic Output • {entropy} Bits Entropy
              </p>
              <p className="text-2xl sm:text-3xl font-mono font-black text-slate-900 dark:text-white break-all select-all">
                {generatedPassword}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleGeneratePassword}
                className="p-3 bg-white dark:bg-slate-800 border rounded-xl hover:bg-slate-100 transition cursor-pointer"
                title="Regenerate"
              >
                <RefreshCw className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
              <button
                onClick={handleCopy}
                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Configuration Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>Password Length</span>
                <span className="font-mono text-red-600 dark:text-red-400 font-bold">{passwordLength} Characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                className="w-full accent-red-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { label: 'Uppercase (A-Z)', val: includeUppercase, set: setIncludeUppercase },
                { label: 'Lowercase (a-z)', val: includeLowercase, set: setIncludeLowercase },
                { label: 'Numbers (0-9)', val: includeNumbers, set: setIncludeNumbers },
                { label: 'Symbols (!@#$)', val: includeSymbols, set: setIncludeSymbols },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => item.set(!item.val)}
                  className={`p-3 rounded-2xl border text-xs font-bold transition cursor-pointer ${
                    item.val
                      ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  {item.val ? '✓ ' : '✕ '} {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
