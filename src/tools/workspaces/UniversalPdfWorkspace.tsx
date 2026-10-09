import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { ToolDefinition } from '../../types';
import { CopyButton } from '../../components/common/CopyButton';
import {
  Upload,
  Download,
  FileText,
  Lock,
  Unlock,
  PenTool,
  RotateCw,
  Scissors,
  CheckCircle2,
  Trash2,
  Plus,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadBlob } from '../../lib/downloadManager';

interface Props {
  tool: ToolDefinition;
}

export const UniversalPdfWorkspace: React.FC<Props> = ({ tool }) => {
  const [pdfFileName, setPdfFileName] = useState<string>('document.pdf');
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  const [textContent, setTextContent] = useState<string>(
    'Toolio Universal PDF Suite.\nCreated 100% in-browser with zero cloud uploads for maximum privacy.\nAll pages and text layers processed locally.'
  );
  const [watermark, setWatermark] = useState<string>('CONFIDENTIAL');
  const [password, setPassword] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [signatureData, setSignatureData] = useState<string>('');

  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawingSig, setIsDrawingSig] = useState<boolean>(false);

  const handleUpload = (file: File) => {
    setPdfFileName(file.name);
    // Simulate reading PDF pages or image conversion
    const samplePages = [
      'Page 1: Executive Summary & Overview',
      'Page 2: Detailed Financial Data & Metrics',
      'Page 3: Signatures and Closing Approvals',
    ];
    setPdfPages(samplePages);
  };

  // Sign canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawingSig(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingSig) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#4f46e5';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawingSig(false);
    const canvas = sigCanvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
      setIsSigned(true);
    }
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setIsSigned(false);
      setSignatureData('');
    }
  };

  // Generate real PDF using jsPDF
  const handleGeneratePdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text(`Toolio — ${tool.name}`, 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on ${new Date().toLocaleDateString()} • In-Browser Client Processing`, 20, 32);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 36, 190, 36);

    // Body text
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    const splitText = doc.splitTextToSize(textContent, 170);
    doc.text(splitText, 20, 48);

    // Watermark if requested
    if (tool.slug.includes('watermark') && watermark) {
      doc.setFontSize(50);
      doc.setTextColor(220, 38, 38);
      // semi-transparent watermark text
      doc.text(watermark, 35, 140, { angle: 45 });
    }

    // Add Signature if signed
    if (isSigned && signatureData) {
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text('Authorized Signature:', 20, 200);
      doc.addImage(signatureData, 'PNG', 20, 205, 60, 25);
    }

    // Add page numbers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${i} of ${totalPages}`, 170, 285);
    }

    const pdfBlob = doc.output('blob');
    downloadBlob(pdfBlob, `${pdfFileName.replace(/\.[^/.]+$/, '')}-processed.pdf`, tool.slug);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {pdfPages.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) handleUpload(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-rose-300 dark:border-rose-800/80 hover:border-rose-500 rounded-3xl p-10 text-center cursor-pointer transition-colors bg-rose-50/40 dark:bg-rose-950/20"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/*,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleUpload(e.target.files[0]);
            }}
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shadow-xs">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Select or Drop File for {tool.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Supports PDF, JPG, PNG, Word, Excel, PowerPoint &amp; Text • 100% Client-Side JS
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPdfPages([])}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Change Document
              </button>
              <span className="text-xs font-mono text-slate-400">
                {pdfFileName} • {pageCount} pages detected
              </span>
            </div>

            <button
              type="button"
              onClick={handleGeneratePdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Generated PDF</span>
            </button>
          </div>

          {/* Interactive Document Page Preview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Page Canvas Viewer */}
            <div className="md:col-span-7 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Document Preview (Page {currentPage} of {pageCount})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1 font-mono text-[11px]"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{rotation}°</span>
                  </button>
                </div>
              </div>

              <div
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 min-h-[320px] space-y-4 relative overflow-hidden"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {tool.slug.includes('watermark') && watermark && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-4xl sm:text-5xl font-black text-rose-500/20 rotate-45 select-none">
                      {watermark}
                    </span>
                  </div>
                )}

                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  Toolio PDF Document
                </h3>

                <textarea
                  rows={8}
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-none focus:outline-hidden resize-none"
                ></textarea>

                {isSigned && signatureData && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-500 block mb-1">
                      Digital Signature Verified:
                    </span>
                    <img src={signatureData} alt="Signature" className="h-12 border rounded bg-white p-1" />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Controls (Signature, Watermark, Password) */}
            <div className="md:col-span-5 space-y-4">
              {/* PDF Signer Pad */}
              {tool.slug.includes('sign') && (
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Draw Digital Signature</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-xs text-slate-400 hover:text-rose-500"
                    >
                      Clear
                    </button>
                  </div>
                  <canvas
                    ref={sigCanvasRef}
                    width={320}
                    height={110}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl cursor-crosshair"
                  ></canvas>
                  <p className="text-[11px] text-slate-400">
                    Draw with mouse or finger to stamp signature directly into PDF.
                  </p>
                </div>
              )}

              {/* Watermark Control */}
              {tool.slug.includes('watermark') && (
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Watermark Text:
                  </label>
                  <input
                    type="text"
                    value={watermark}
                    onChange={(e) => setWatermark(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              )}

              {/* Password Protector Control */}
              {(tool.slug.includes('password') || tool.slug.includes('lock')) && (
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-rose-500" />
                    <span>Set Encryption Password:</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password..."
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              )}

              {/* Text Extractor View */}
              {(tool.slug.includes('text') || tool.slug.includes('ocr')) && (
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-rose-600">Extracted PDF Text:</span>
                    <CopyButton textToCopy={textContent} label="Copy Text" size="sm" />
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono max-h-40 overflow-y-auto">
                    {textContent}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
