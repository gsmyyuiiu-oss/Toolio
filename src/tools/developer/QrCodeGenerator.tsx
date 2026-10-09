import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { CopyButton } from '../../components/common/CopyButton';
import { Download, QrCode, Wifi, Link, Type } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadDataUrl } from '../../lib/downloadManager';

export const QrCodeGenerator: React.FC = () => {
  const [qrType, setQrType] = useState<'url' | 'text' | 'wifi'>('url');
  const [content, setContent] = useState<string>('https://toolio.pages.dev');
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeWiFi');
  const [wifiPass, setWifiPass] = useState<string>('SecretPassword123');
  const [qrColor, setQrColor] = useState<string>('#000000');
  const [qrBg, setQrBg] = useState<string>('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getPayload = () => {
    if (qrType === 'wifi') {
      return `WIFI:T:WPA;S:${wifiSsid};P:${wifiPass};;`;
    }
    return content;
  };

  useEffect(() => {
    const payload = getPayload();
    if (!payload.trim()) return;

    QRCode.toDataURL(payload, {
      width: 400,
      margin: 2,
      color: {
        dark: qrColor,
        light: qrBg,
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {});
  }, [qrType, content, wifiSsid, wifiPass, qrColor, qrBg]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    downloadDataUrl(qrDataUrl, 'toolio-qr-code.png', 'qr-code-generator');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Type switch */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            setQrType('url');
            setContent('https://toolio.pages.dev');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
            qrType === 'url'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Link className="w-3.5 h-3.5" />
          <span>URL Website</span>
        </button>
        <button
          type="button"
          onClick={() => setQrType('text')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
            qrType === 'text'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Plain Text</span>
        </button>
        <button
          type="button"
          onClick={() => setQrType('wifi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
            qrType === 'wifi'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>WiFi Network</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Controls */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            {qrType === 'wifi' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">WiFi Password</label>
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  {qrType === 'url' ? 'Target Website URL' : 'Text Content'}
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                ></textarea>
              </div>
            )}

            {/* Colors */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">QR Code Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-500">{qrColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrBg}
                    onChange={(e) => setQrBg(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-500">{qrBg}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Preview & Download */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 dark:border-slate-800">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Generated QR" className="w-48 h-48 rounded-lg object-contain" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-400">
                Generating...
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
