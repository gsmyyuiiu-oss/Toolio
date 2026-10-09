import React, { useState, useEffect } from 'react';
import {
  Code, Code2, Check, Copy, RefreshCw, Key, Shield,
  Search, Lock, Hash, Layers, Laptop, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

export const DeveloperMasterTool: React.FC<Props> = ({ tool }) => {
  const [inputCode, setInputCode] = useState<string>(
    '{\n  "name": "Toolio",\n  "status": "online",\n  "toolsCount": 460,\n  "offlineSupport": true\n}'
  );
  const [outputCode, setOutputCode] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Auto configure transformation based on tool slug
  useEffect(() => {
    processAction(inputCode);
  }, [tool.slug]);

  const processAction = (val: string) => {
    const slug = tool.slug;
    setStatusMessage('');

    try {
      if (slug.includes('json-format') || slug === 'json-formatter') {
        const parsed = JSON.parse(val);
        setOutputCode(JSON.stringify(parsed, null, 2));
        setStatusMessage('✅ Valid JSON formatted with 2 spaces');
      } else if (slug.includes('json-minif') || slug === 'json-minifier') {
        const parsed = JSON.parse(val);
        setOutputCode(JSON.stringify(parsed));
        setStatusMessage('✅ JSON minified successfully');
      } else if (slug.includes('json-valid') || slug === 'json-validator') {
        JSON.parse(val);
        setOutputCode(val);
        setStatusMessage('✅ Perfect Valid JSON Syntax');
      } else if (slug.includes('base64-enc') || slug === 'base64-encoder') {
        setOutputCode(btoa(val));
        setStatusMessage('✅ String encoded to Base64');
      } else if (slug.includes('base64-dec') || slug === 'base64-decoder') {
        setOutputCode(atob(val.trim()));
        setStatusMessage('✅ Base64 decoded to text');
      } else if (slug.includes('url-enc') || slug === 'url-encoder') {
        setOutputCode(encodeURIComponent(val));
        setStatusMessage('✅ URL component encoded');
      } else if (slug.includes('url-dec') || slug === 'url-decoder') {
        setOutputCode(decodeURIComponent(val));
        setStatusMessage('✅ URL decoded');
      } else if (slug.includes('uuid')) {
        const uuids = Array.from({ length: 5 }, () => crypto.randomUUID()).join('\n');
        setOutputCode(uuids);
        setStatusMessage('✅ 5 Random RFC4122 v4 UUIDs generated');
      } else if (slug.includes('hash') || slug.includes('sha')) {
        // Compute SHA-256
        const encoder = new TextEncoder();
        const data = encoder.encode(val);
        crypto.subtle.digest('SHA-256', data).then((buf) => {
          const hex = Array.from(new Uint8Array(buf))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
          setOutputCode(hex);
          setStatusMessage('✅ SHA-256 cryptographic hash generated');
        });
      } else if (slug.includes('jwt-dec') || slug === 'jwt-decoder') {
        const parts = val.trim().split('.');
        if (parts.length >= 2) {
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          setOutputCode(JSON.stringify({ header, payload }, null, 2));
          setStatusMessage('✅ JWT header and payload claims decoded');
        } else {
          setOutputCode('Paste a valid JWT token format (header.payload.signature)');
        }
      } else {
        // Generic code cleanup
        setOutputCode(val.trim());
      }
    } catch (err: any) {
      setStatusMessage(`❌ Syntax Error: ${err.message}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputCode || inputCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Controls & Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
          {statusMessage || 'Enter input code or text to transform'}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => processAction(inputCode)}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Execute
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {isCopied ? 'Copied' : 'Copy Result'}
          </button>
        </div>
      </div>

      {/* Split Code Editor Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Input Data</span>
          <textarea
            value={inputCode}
            onChange={(e) => {
              setInputCode(e.target.value);
              processAction(e.target.value);
            }}
            rows={14}
            className="w-full p-3 bg-slate-950 text-slate-200 font-mono text-xs rounded-xl border border-slate-800 leading-relaxed focus:ring-2 focus:ring-violet-500"
            placeholder="Type or paste input code..."
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Output Result</span>
          <textarea
            readOnly
            value={outputCode}
            rows={14}
            className="w-full p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 leading-relaxed"
            placeholder="Transformed code will appear here..."
          />
        </div>
      </div>
    </div>
  );
};
