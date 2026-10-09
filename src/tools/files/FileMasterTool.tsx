import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Download, FolderArchive, Archive, Hash, Binary,
  ShieldCheck, FileSearch, Info, Eye, Files, RefreshCw,
  Copy, Check, Sparkles, Code
} from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';
import { downloadBlob } from '../../lib/downloadManager';

interface Props {
  tool: ToolDefinition;
}

interface FileItem {
  name: string;
  size: number;
  type: string;
  data: Uint8Array;
}

export const FileMasterTool: React.FC<Props> = ({ tool }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [zipEntries, setZipEntries] = useState<{ name: string; size: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Hash results
  const [sha256Hash, setSha256Hash] = useState<string>('');
  const [sha1Hash, setSha1Hash] = useState<string>('');
  const [magicHex, setMagicHex] = useState<string>('');
  const [detectedMime, setDetectedMime] = useState<string>('');

  // Hex dump viewer
  const [hexRows, setHexRows] = useState<{ offset: string; hex: string; ascii: string }[]>([]);

  // Base64
  const [base64Output, setBase64Output] = useState<string>('');
  const [base64Input, setBase64Input] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Batch Renamer
  const [renamePrefix, setRenamePrefix] = useState<string>('file-');
  const [renameSuffix, setRenameSuffix] = useState<string>('');

  // File Size Converter
  const [sizeInput, setSizeInput] = useState<number>(1024);
  const [sizeUnit, setSizeUnit] = useState<'B' | 'KB' | 'MB' | 'GB'>('MB');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Demo sample loader
  const handleLoadSample = () => {
    const enc = new TextEncoder();
    const bytes = enc.encode('Hello from Toolio! This is a test file for zip, hash, and format analysis.');
    setFiles([
      {
        name: 'sample-readme.txt',
        size: bytes.length,
        type: 'text/plain',
        data: bytes
      },
      {
        name: 'sample-config.json',
        size: 45,
        type: 'application/json',
        data: enc.encode('{\n  "version": "1.0",\n  "status": "active"\n}')
      }
    ]);
    analyzeFile(bytes, 'sample-readme.txt');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const loaded: FileItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const buffer = await file.arrayBuffer();
      const u8 = new Uint8Array(buffer);
      loaded.push({
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        data: u8
      });

      // Analyze first file for hash & hex dump
      if (i === 0) {
        analyzeFile(u8, file.name);

        // If file is zip, extract file list
        if (file.name.endsWith('.zip') || tool.slug.includes('extract')) {
          try {
            const zip = await JSZip.loadAsync(buffer);
            const entries: { name: string; size: number }[] = [];
            zip.forEach((path, entry) => {
              if (!entry.dir) entries.push({ name: path, size: (entry as any)._data?.uncompressedSize || 0 });
            });
            setZipEntries(entries);
          } catch (err) {
            console.error('Zip parse failed', err);
          }
        }
      }
    }
    setFiles(loaded);
  };

  const analyzeFile = async (bytes: Uint8Array, name: string) => {
    // 1. Calculate SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes as unknown as BufferSource);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    setSha256Hash(hashHex);

    // 2. Magic bytes
    const slice = bytes.slice(0, 16);
    const magic = Array.from(slice).map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
    setMagicHex(magic);

    // Format detection
    if (magic.startsWith('89 50 4E 47')) setDetectedMime('image/png (PNG Image)');
    else if (magic.startsWith('FF D8 FF')) setDetectedMime('image/jpeg (JPEG Image)');
    else if (magic.startsWith('25 50 44 46')) setDetectedMime('application/pdf (PDF Document)');
    else if (magic.startsWith('50 4B 03 04')) setDetectedMime('application/zip (ZIP Archive)');
    else if (magic.startsWith('47 49 46 38')) setDetectedMime('image/gif (GIF Animation)');
    else setDetectedMime('Plain Text / Binary Stream');

    // 3. Hex Dump (first 256 bytes)
    const rows: { offset: string; hex: string; ascii: string }[] = [];
    const limit = Math.min(256, bytes.length);
    for (let i = 0; i < limit; i += 16) {
      const chunk = bytes.slice(i, i + 16);
      const offset = i.toString(16).padStart(6, '0').toUpperCase();
      const hex = Array.from(chunk).map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
      const ascii = Array.from(chunk).map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.')).join('');
      rows.push({ offset, hex, ascii });
    }
    setHexRows(rows);

    // 4. Base64
    let binary = '';
    const len = Math.min(bytes.length, 50000);
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    setBase64Output(btoa(binary));
  };

  // Create ZIP archive
  const handleCreateZip = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    const zip = new JSZip();

    files.forEach((f, idx) => {
      let finalName = f.name;
      if (tool.slug.includes('rename')) {
        const ext = f.name.includes('.') ? f.name.slice(f.name.lastIndexOf('.')) : '';
        finalName = `${renamePrefix}${idx + 1}${renameSuffix}${ext}`;
      }
      zip.file(finalName, f.data);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    await downloadBlob(content, `toolio-${tool.slug}-archive.zip`, tool.slug);
    setIsProcessing(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Base64 decode to file
  const handleDecodeBase64 = () => {
    if (!base64Input.trim()) return;
    try {
      const clean = base64Input.replace(/^data:[^;]+;base64,/, '');
      const binaryString = atob(clean);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes]);
      downloadBlob(blob, 'decoded-file.bin', tool.slug);

      confetti({ particleCount: 40, spread: 50 });
    } catch (err) {
      alert('Invalid Base64 string');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* File Size Converter Dedicated Section */}
      {tool.slug === 'file-size-converter' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Binary & Decimal File Size Converter
          </h3>
          <div className="flex gap-4">
            <input
              type="number"
              value={sizeInput}
              onChange={(e) => setSizeInput(Number(e.target.value))}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-lg font-bold flex-1"
            />
            <select
              value={sizeUnit}
              onChange={(e) => setSizeUnit(e.target.value as any)}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
            >
              <option value="B">Bytes (B)</option>
              <option value="KB">Kilobytes (KB)</option>
              <option value="MB">Megabytes (MB)</option>
              <option value="GB">Gigabytes (GB)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {['Bytes', 'Kilobytes (KB)', 'Megabytes (MB)', 'Gigabytes (GB)'].map((label, idx) => {
              const multipliers = [1, 1024, 1024 * 1024, 1024 * 1024 * 1024];
              const inputBytes =
                sizeUnit === 'B'
                  ? sizeInput
                  : sizeUnit === 'KB'
                  ? sizeInput * 1024
                  : sizeUnit === 'MB'
                  ? sizeInput * 1024 * 1024
                  : sizeInput * 1024 * 1024 * 1024;
              const converted = (inputBytes / multipliers[idx]).toLocaleString(undefined, {
                maximumFractionDigits: 4
              });

              return (
                <div key={label} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border">
                  <p className="text-xs text-slate-400 font-semibold">{label}</p>
                  <p className="text-xl font-black text-indigo-500 mt-1 truncate">{converted}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : tool.slug === 'base64-file-decoder' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Decode Base64 to Binary File</h3>
          <textarea
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder="Paste base64 file string here..."
            rows={8}
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-xs"
          />
          <button
            onClick={handleDecodeBase64}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer shadow"
          >
            Decode & Download File
          </button>
        </div>
      ) : (
        /* Upload & Inspection Panel */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 dark:border-indigo-900/50 rounded-2xl p-10 bg-indigo-50/40 dark:bg-indigo-950/20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <FolderArchive className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                Upload Files for {tool.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
                Supports all file formats. Binary analysis, compression, and hashing execute 100% locally.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Choose Files
                </button>
                <button
                  onClick={handleLoadSample}
                  className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" /> Load Sample Files
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-base">
                    {files.length} File{files.length > 1 ? 's' : ''} Loaded
                  </h4>
                  <p className="text-xs text-slate-500">
                    Total: {(files.reduce((a, b) => a + b.size, 0) / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCreateZip}
                    disabled={isProcessing}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    {tool.slug.includes('rename') ? 'Download Renamed ZIP' : 'Download Compressed ZIP'}
                  </button>
                  <button
                    onClick={() => setFiles([])}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Batch Renamer Controls */}
              {tool.slug.includes('rename') && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border">
                  <div>
                    <label className="text-xs text-slate-500">Filename Prefix</label>
                    <input
                      type="text"
                      value={renamePrefix}
                      onChange={(e) => setRenamePrefix(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Filename Suffix</label>
                    <input
                      type="text"
                      value={renameSuffix}
                      onChange={(e) => setRenameSuffix(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Hashing & Format Analysis Result */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Cryptographic SHA-256</p>
                  <p className="font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all select-all">
                    {sha256Hash || 'Calculating...'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Format & Magic Bytes</p>
                  <p className="font-semibold text-xs text-slate-800 dark:text-white">{detectedMime}</p>
                  <p className="font-mono text-[10px] text-slate-500">{magicHex}</p>
                </div>
              </div>

              {/* Hex Dump Viewer */}
              {hexRows.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold uppercase text-slate-400 mb-2">
                    Binary Hex Dump Viewer (First 256 Bytes)
                  </h5>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto space-y-1">
                    {hexRows.map((r, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-slate-500">{r.offset}</span>
                        <span className="text-indigo-400 flex-1">{r.hex}</span>
                        <span className="text-emerald-400">{r.ascii}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
