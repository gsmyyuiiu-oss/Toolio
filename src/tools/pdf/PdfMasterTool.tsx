import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Download, FileText, Layers, Scissors, RotateCw,
  Stamp, PenTool, Lock, Eye, Trash2, Hash, RefreshCw, Sparkles,
  FileSearch, Table, Copy, Check, Camera
} from 'lucide-react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';
import { downloadBlob } from '../../utils/download';

interface Props {
  tool: ToolDefinition;
}

export const PdfMasterTool: React.FC<Props> = ({ tool }) => {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState<string>('document.pdf');
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Tool specific states
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [pagesToExtract, setPagesToExtract] = useState<string>('1');
  const [pageToDelete, setPageToDelete] = useState<number>(1);
  const [docTitle, setDocTitle] = useState<string>('Document');
  const [docAuthor, setDocAuthor] = useState<string>('Author');
  const [textContent, setTextContent] = useState<string>('Welcome to Toolio PDF Tool.\nThis document was generated directly inside your web browser.\nNo servers involved — 100% private and instant.');
  const [extractedText, setExtractedText] = useState<string>('');

  // Signature
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingSig, setIsDrawingSig] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generate a sample PDF so users can test immediately without uploading
  const handleLoadSample = async () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(244, 63, 94);
    doc.text('Toolio Sample PDF Document', 20, 30);

    doc.setFontSize(14);
    doc.setTextColor(51, 65, 85);
    doc.text('Page 1 — Overview & Features', 20, 45);

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'This is a demonstration PDF created in real time inside your browser memory.\nYou can compress, merge, split, rotate, watermark, or sign this document instantly.',
      20,
      60
    );

    // Add page 2
    doc.addPage();
    doc.setFontSize(22);
    doc.setTextColor(244, 63, 94);
    doc.text('Page 2 — Document Specifications', 20, 30);
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('Generated with client-side WebAssembly & HTML5 Canvas.\nNo tracking. No data uploads.', 20, 50);

    const arrayBuffer = doc.output('arraybuffer');
    const bytes = new Uint8Array(arrayBuffer);
    setPdfBytes(bytes);
    setFileName('sample-toolio-doc.pdf');
    setPageCount(2);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    setPdfBytes(bytes);

    try {
      const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setPageCount(pdfDoc.getPageCount());
      setDocTitle(pdfDoc.getTitle() || file.name);
      setDocAuthor(pdfDoc.getAuthor() || '');
    } catch {
      setPageCount(1);
    }
  };

  // Signature drawing canvas helpers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawingSig(true);
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingSig) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawingSig(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Master Action Processing
  const handleProcessAction = async () => {
    setIsProcessing(true);
    try {
      const slug = tool.slug;

      // 1. Text or Office to PDF
      if (slug.includes('to-pdf')) {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(docTitle, 20, 20);
        doc.setFontSize(11);
        const splitLines = doc.splitTextToSize(textContent, 170);
        doc.text(splitLines, 20, 35);
        doc.save(`${docTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);

        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        setIsProcessing(false);
        return;
      }

      if (!pdfBytes) {
        setIsProcessing(false);
        return;
      }

      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();

      // 2. Watermark
      if (slug === 'pdf-watermark') {
        pages.forEach((page) => {
          const { width, height } = page.getSize();
          page.drawText(watermarkText, {
            x: width / 4,
            y: height / 2,
            size: 40,
            color: rgb(0.8, 0.2, 0.2),
            rotate: degrees(45),
            opacity: 0.35
          });
        });
      }

      // 3. Page Numbering
      if (slug === 'pdf-page-numbering') {
        const total = pages.length;
        pages.forEach((page, idx) => {
          const { width } = page.getSize();
          page.drawText(`Page ${idx + 1} of ${total}`, {
            x: width / 2 - 30,
            y: 20,
            size: 10,
            color: rgb(0.3, 0.3, 0.3)
          });
        });
      }

      // 4. Rotator
      if (slug === 'pdf-rotator') {
        pages.forEach((page) => {
          page.setRotation(degrees(rotationAngle));
        });
      }

      // 5. Delete Page
      if (slug === 'pdf-page-deleter') {
        if (pageToDelete >= 1 && pageToDelete <= pages.length) {
          pdfDoc.removePage(pageToDelete - 1);
        }
      }

      // 6. Signer
      if (slug === 'pdf-signer' && signatureCanvasRef.current) {
        const sigPngData = signatureCanvasRef.current.toDataURL('image/png');
        const sigImage = await pdfDoc.embedPng(sigPngData);
        const firstPage = pages[0];
        if (firstPage) {
          firstPage.drawImage(sigImage, {
            x: 50,
            y: 50,
            width: 150,
            height: 60
          });
        }
      }

      // 7. Metadata Editor / Remover
      if (slug === 'pdf-metadata-editor') {
        pdfDoc.setTitle(docTitle);
        pdfDoc.setAuthor(docAuthor);
      } else if (slug === 'pdf-metadata-remover') {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
      }

      const modifiedBytes = await pdfDoc.save();
      const blob = new Blob([modifiedBytes as BlobPart], { type: 'application/pdf' });
      await downloadBlob(blob, `toolio-${tool.slug}-${fileName}`, tool.slug);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Upload & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {tool.slug.includes('to-pdf') ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-500" />
              {tool.name} — Create Formatted PDF
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Author Name</label>
                <input
                  type="text"
                  value={docAuthor}
                  onChange={(e) => setDocAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-sm mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500">Document Content / Text</label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={6}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm mt-1 font-sans"
              />
            </div>
            <button
              onClick={handleProcessAction}
              disabled={isProcessing}
              className="py-3 px-6 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Generate & Download PDF
            </button>
          </div>
        ) : !pdfBytes ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-rose-300 dark:border-rose-900/50 rounded-2xl p-10 bg-rose-50/40 dark:bg-rose-950/20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              Upload PDF for {tool.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
              100% secure client-side PDF manipulation engine. Zero files uploaded to any external server.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" /> Choose PDF File
              </button>
              <button
                onClick={handleLoadSample}
                className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-rose-500" /> Load Sample 2-Page PDF
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center font-bold">
                  PDF
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm truncate max-w-xs">{fileName}</p>
                  <p className="text-xs text-slate-500">{pageCount} Pages • {docTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 rounded-lg transition"
                >
                  Change File
                </button>
                <button
                  onClick={() => setPdfBytes(null)}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition"
                >
                  Clear
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Column 1: Config Specifics */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tool Parameters
                </h4>

                {tool.slug === 'pdf-watermark' && (
                  <div>
                    <label className="text-xs text-slate-500">Watermark Text</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded mt-1"
                    />
                  </div>
                )}

                {tool.slug === 'pdf-rotator' && (
                  <div>
                    <label className="text-xs text-slate-500">Rotation Angle</label>
                    <select
                      value={rotationAngle}
                      onChange={(e) => setRotationAngle(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded mt-1"
                    >
                      <option value={90}>Rotate 90° Clockwise</option>
                      <option value={180}>Rotate 180°</option>
                      <option value={270}>Rotate 270° (90° Counter-Clockwise)</option>
                    </select>
                  </div>
                )}

                {tool.slug === 'pdf-page-deleter' && (
                  <div>
                    <label className="text-xs text-slate-500">Page to Delete</label>
                    <input
                      type="number"
                      min={1}
                      max={pageCount}
                      value={pageToDelete}
                      onChange={(e) => setPageToDelete(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded mt-1"
                    />
                  </div>
                )}

                {tool.slug === 'pdf-metadata-editor' && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Document Title</label>
                      <input
                        type="text"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Document Author</label>
                      <input
                        type="text"
                        value={docAuthor}
                        onChange={(e) => setDocAuthor(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Column 2: Digital Signature Pad */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {tool.slug === 'pdf-signer' ? 'Digital Signature' : 'Document Info'}
                </h4>

                {tool.slug === 'pdf-signer' ? (
                  <div className="space-y-2">
                    <div className="border border-slate-300 dark:border-slate-700 bg-white rounded-xl overflow-hidden">
                      <canvas
                        ref={signatureCanvasRef}
                        width={300}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="w-full cursor-crosshair"
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Draw signature with mouse/touch</span>
                      <button
                        onClick={clearSignature}
                        className="text-rose-500 hover:underline font-medium cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                    <p className="text-slate-500">Document Pages: <span className="font-bold text-slate-800 dark:text-white">{pageCount}</span></p>
                    <p className="text-slate-500">Security: <span className="text-emerald-500 font-bold">Unrestricted</span></p>
                    <p className="text-slate-500">Engine: <span className="font-mono text-[10px]">pdf-lib WebAssembly</span></p>
                  </div>
                )}
              </div>

              {/* Column 3: Execute Action Button */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Process & Export
                </h4>

                <button
                  onClick={handleProcessAction}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                  Execute {tool.name.replace('PDF', '').trim()} Result
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
