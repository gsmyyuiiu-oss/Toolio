import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

export const JwtDecoder: React.FC = () => {
  const [token, setToken] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkF5dXNoIEt1bWFyIiwiYWRtaW4iOnRydWUsImlhdCI6MTY3MDAwMDAwMCwiZXhwIjoyMDgwMDAwMDAwfQ.cTh-signature-placeholder'
  );

  let headerObj: any = null;
  let payloadObj: any = null;
  let signature = '';
  let error: string | null = null;
  let isExpired = false;
  let expDateStr = '';

  try {
    const parts = token.trim().split('.');
    if (parts.length >= 2) {
      headerObj = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      payloadObj = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      signature = parts[2] || '';

      if (payloadObj && payloadObj.exp) {
        const expMs = payloadObj.exp * 1000;
        const now = Date.now();
        isExpired = now > expMs;
        expDateStr = new Date(expMs).toLocaleString();
      }
    } else {
      error = 'JWT must consist of three parts separated by dots: header.payload.signature';
    }
  } catch (err: any) {
    error = 'Failed to decode JWT string. Ensure it is valid base64url encoded.';
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
          Encoded JSON Web Token:
        </label>
        <textarea
          rows={4}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste JWT (eyJhbGciOi...) here"
          className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
        ></textarea>
      </div>

      {error ? (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Expiration badge */}
          {expDateStr && (
            <div
              className={`p-3 rounded-2xl border text-xs flex items-center justify-between font-semibold ${
                isExpired
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <span>Token Status: {isExpired ? 'Expired' : 'Active (Valid)'}</span>
              <span className="font-mono">Expires: {expDateStr}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Header */}
            <div className="p-4 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-rose-400 uppercase tracking-wider">
                  Header (Algorithm &amp; Token Type)
                </span>
                <CopyButton textToCopy={JSON.stringify(headerObj, null, 2)} label="Copy" size="sm" />
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 text-rose-300 font-mono text-xs overflow-x-auto">
                {JSON.stringify(headerObj, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="p-4 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-cyan-400 uppercase tracking-wider">
                  Payload (Claims Data)
                </span>
                <CopyButton textToCopy={JSON.stringify(payloadObj, null, 2)} label="Copy" size="sm" />
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto">
                {JSON.stringify(payloadObj, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
