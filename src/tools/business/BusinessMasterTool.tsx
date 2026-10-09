import React, { useState } from 'react';
import {
  Briefcase, FileText, Receipt, Sparkles, Building, QrCode,
  Mail, Clock, DollarSign, TrendingUp, Percent, Target,
  Sliders, Hash, Calculator, Users, Download, Copy, Check
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

export const BusinessMasterTool: React.FC<Props> = ({ tool }) => {
  // Invoice state
  const [invoiceNumber, setInvoiceNumber] = useState<string>('INV-2026-001');
  const [clientName, setClientName] = useState<string>('Acme Corp');
  const [clientEmail, setClientEmail] = useState<string>('billing@acme.com');
  const [items, setItems] = useState([
    { description: 'Web Application Development', hours: 40, rate: 120 },
    { description: 'UI/UX Interactive System Design', hours: 20, rate: 100 }
  ]);
  const [taxRate, setTaxRate] = useState<number>(10);

  // Meeting Cost Calculator state
  const [meetingAttendees, setMeetingAttendees] = useState<number>(6);
  const [avgSalary, setAvgSalary] = useState<number>(95000);
  const [meetingDurationMinutes, setMeetingDurationMinutes] = useState<number>(45);

  // Business Name Generator
  const [keyword, setKeyword] = useState<string>('Tech');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);

  // vCard QR
  const [vcardName, setVcardName] = useState<string>('John Doe');
  const [vcardPhone, setVcardPhone] = useState<string>('+1 (555) 019-2834');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Invoice calculations
  const subtotal = items.reduce((sum, item) => sum + item.hours * item.rate, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalDue = subtotal + taxAmount;

  // Meeting cost calculation
  // Assume 2000 work hours/year
  const hourlyAttendeeRate = avgSalary / 2000;
  const totalMeetingCost = (hourlyAttendeeRate * meetingAttendees * (meetingDurationMinutes / 60)).toFixed(2);

  // Business name generator
  const handleGenerateNames = () => {
    const prefixes = ['Nova', 'Apex', 'Hyper', 'Omni', 'Vanguard', 'Prime', 'Pulse', 'Next', 'Aura'];
    const suffixes = ['Labs', 'Works', 'Flow', 'Craft', 'Matrix', 'Dynamics', 'Logic', 'Sync'];
    const results: string[] = [];
    prefixes.forEach((p) => {
      suffixes.forEach((s) => {
        results.push(`${p}${keyword}${s}`);
      });
    });
    setGeneratedNames(results.slice(0, 12));
    confetti({ particleCount: 30, spread: 50 });
  };

  // Generate vCard QR
  const handleGenerateVcard = async () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEND:VCARD`;
    try {
      const url = await QRCode.toDataURL(vcard, { width: 300, margin: 2 });
      setQrCodeDataUrl(url);
      confetti({ particleCount: 40, spread: 50 });
    } catch (err) {
      console.error(err);
    }
  };

  // Generate and download printable PDF Invoice
  const handleDownloadInvoicePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(217, 119, 6);
    doc.text('INVOICE', 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Invoice Number: ${invoiceNumber}`, 20, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 42);

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Billed To:`, 20, 56);
    doc.setFontSize(11);
    doc.text(clientName, 20, 64);
    doc.text(clientEmail, 20, 71);

    // Line items table
    let y = 90;
    doc.setFillColor(248, 250, 252);
    doc.rect(20, y - 6, 170, 10, 'F');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text('Description', 24, y);
    doc.text('Hours', 115, y);
    doc.text('Rate', 140, y);
    doc.text('Total', 170, y);

    y += 10;
    items.forEach((item) => {
      doc.setTextColor(15, 23, 42);
      doc.text(item.description, 24, y);
      doc.text(String(item.hours), 115, y);
      doc.text(`$${item.rate}`, 140, y);
      doc.text(`$${item.hours * item.rate}`, 170, y);
      y += 8;
    });

    // Summary totals
    y += 10;
    doc.line(20, y, 190, y);
    y += 10;
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, y);
    y += 8;
    doc.text(`Tax (${taxRate}%): $${taxAmount.toFixed(2)}`, 140, y);
    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(217, 119, 6);
    doc.text(`Total Due: $${totalDue.toFixed(2)}`, 140, y);

    doc.save(`${invoiceNumber.toLowerCase()}.pdf`);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Invoice Generator View */}
      {tool.slug.includes('invoice') || tool.slug.includes('receipt') || tool.slug.includes('quotation') ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-500">Create & export branded PDF invoices instantly</p>
            </div>
            <button
              onClick={handleDownloadInvoicePdf}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PDF Invoice
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Invoice Number</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Client Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Client Email</label>
              <input
                type="text"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          {/* Line items list */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase text-slate-400">Invoice Line Items</span>
            {items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border items-center"
              >
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const copy = [...items];
                    copy[idx].description = e.target.value;
                    setItems(copy);
                  }}
                  className="col-span-6 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded-lg font-semibold"
                />
                <input
                  type="number"
                  value={item.hours}
                  onChange={(e) => {
                    const copy = [...items];
                    copy[idx].hours = Number(e.target.value);
                    setItems(copy);
                  }}
                  placeholder="Qty/Hours"
                  className="col-span-3 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded-lg font-bold"
                />
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => {
                    const copy = [...items];
                    copy[idx].rate = Number(e.target.value);
                    setItems(copy);
                  }}
                  placeholder="Rate $"
                  className="col-span-3 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded-lg font-bold"
                />
              </div>
            ))}
          </div>

          {/* Totals Summary */}
          <div className="p-6 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400">Subtotal: ${subtotal.toFixed(2)}</p>
              <p className="text-xs font-bold text-slate-400">Tax ({taxRate}%): ${taxAmount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Total Due</p>
              <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
                ${totalDue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ) : tool.slug.includes('meeting') ? (
        /* Meeting Cost Calculator View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Meeting Cost Financial Calculator
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Attendee Count</label>
              <input
                type="number"
                value={meetingAttendees}
                onChange={(e) => setMeetingAttendees(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xl font-black"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Avg Salary ($/yr)</label>
              <input
                type="number"
                value={avgSalary}
                onChange={(e) => setAvgSalary(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xl font-black"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={meetingDurationMinutes}
                onChange={(e) => setMeetingDurationMinutes(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xl font-black"
              />
            </div>
          </div>
          <div className="p-6 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 text-center">
            <p className="text-xs font-bold text-amber-600 uppercase">Estimated Meeting Cost</p>
            <p className="text-5xl font-black text-amber-600 mt-2">${totalMeetingCost}</p>
          </div>
        </div>
      ) : tool.slug.includes('name-generator') ? (
        /* Brand Name Generator View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Brandable Business & Company Name Generator
          </h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter seed keyword (e.g. Cloud, Pay, Peak)..."
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-bold"
            />
            <button
              onClick={handleGenerateNames}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl transition cursor-pointer"
            >
              Generate Names
            </button>
          </div>
          {generatedNames.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {generatedNames.map((n, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 border rounded-xl font-bold text-slate-800 dark:text-white text-center hover:bg-amber-50 transition"
                >
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* vCard QR Business Card */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            vCard Digital QR Business Card
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={vcardName}
                onChange={(e) => setVcardName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Phone Number</label>
              <input
                type="text"
                value={vcardPhone}
                onChange={(e) => setVcardPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleGenerateVcard}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" /> Generate QR Code
          </button>
          {qrCodeDataUrl && (
            <div className="flex justify-center p-4 bg-white rounded-2xl border w-fit mx-auto">
              <img src={qrCodeDataUrl} alt="vCard QR" className="w-48 h-48" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
