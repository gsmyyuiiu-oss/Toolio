import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { Upload, Download, FolderArchive, FileText, Trash2 } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadBlob } from '../../lib/downloadManager';

export const ZipCreator: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [zipName, setZipName] = useState<string>('archive.zip');
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const added = Array.from(newFiles);
    setFiles(prev => [...prev, ...added]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleCreateZip = async () => {
    if (files.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      for (const file of files) {
        zip.file(file.name, file);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const targetZipName = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
      await downloadBlob(blob, targetZipName, 'zip-creator');
    } catch {
      alert('Failed to create ZIP archive.');
    } finally {
      setIsZipping(false);
    }
  };

  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
  const formattedSize =
    totalBytes > 1024 * 1024
      ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(totalBytes / 1024).toFixed(1)} KB`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleAddFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-3xl p-8 text-center cursor-pointer transition-colors bg-white/50 dark:bg-slate-900/40"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleAddFiles(e.target.files)}
        />
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <FolderArchive className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Click or drag &amp; drop files to bundle into ZIP
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          100% In-Browser Compression (Files never leave your device)
        </p>
      </div>

      {files.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Archive Name:</label>
              <input
                type="text"
                value={zipName}
                onChange={(e) => setZipName(e.target.value)}
                className="w-48 px-3 py-1.5 text-xs font-mono font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono">
                {files.length} files ({formattedSize})
              </span>
              <button
                type="button"
                onClick={handleCreateZip}
                disabled={isZipping}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isZipping ? 'Archiving...' : 'Download .ZIP'}</span>
              </button>
            </div>
          </div>

          {/* Staged files list */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {files.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="truncate font-medium">{f.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-400 font-mono text-[11px]">
                    {(f.size / 1024).toFixed(1)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
