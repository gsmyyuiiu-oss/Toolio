import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Code, Upload, ArrowLeftRight } from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [plainText, setPlainText] = useState<string>('Toolio: 200+ Free Online Tools 🚀');
  const [base64Text, setBase64Text] = useState<string>('VG9vbGlvOiAyMDArIEZyZWUgT25saW5lIFRvb2xzIPCfmYA=');
  const [error, setError] = useState<string | null>(null);

  // UTF-8 safe encode
  const encodeBase64 = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str);
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
      const encoded = btoa(binString);
      setBase64Text(encoded);
      setError(null);
    } catch (e: any) {
      setError('Encoding error: ' + e.message);
    }
  };

  // UTF-8 safe decode
  const decodeBase64 = (b64: string) => {
    try {
      const binString = atob(b64.trim());
      const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
      const decoded = new TextDecoder().decode(bytes);
      setPlainText(decoded);
      setError(null);
    } catch {
      setError('Invalid Base64 sequence');
    }
  };

  const handlePlainChange = (v: string) => {
    setPlainText(v);
    encodeBase64(v);
  };

  const handleBase64Change = (v: string) => {
    setBase64Text(v);
    decodeBase64(v);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-mono">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Plain Text */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Plain Text (UTF-8)</span>
            <CopyButton textToCopy={plainText} label="Copy Text" size="sm" />
          </div>
          <textarea
            rows={10}
            value={plainText}
            onChange={(e) => handlePlainChange(e.target.value)}
            placeholder="Type or paste plain text here..."
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          ></textarea>
        </div>

        {/* Base64 Output */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Base64 String</span>
            <CopyButton textToCopy={base64Text} label="Copy Base64" size="sm" />
          </div>
          <textarea
            rows={10}
            value={base64Text}
            onChange={(e) => handleBase64Change(e.target.value)}
            placeholder="Paste Base64 string here..."
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          ></textarea>
        </div>
      </div>
    </div>
  );
};
