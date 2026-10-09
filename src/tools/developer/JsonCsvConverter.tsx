import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { ArrowLeftRight, Download, Table } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { downloadText } from '../../lib/downloadManager';

export const JsonCsvConverter: React.FC = () => {
  const [mode, setMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify(
      [
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Engineer' },
        { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'Designer' },
        { id: 3, name: 'Charlie Ray', email: 'charlie@example.com', role: 'Product Manager' },
      ],
      null,
      2
    )
  );
  const [csvOutput, setCsvOutput] = useState<string>(
    'id,name,email,role\n1,Alice Smith,alice@example.com,Engineer\n2,Bob Jones,bob@example.com,Designer\n3,Charlie Ray,charlie@example.com,Product Manager'
  );
  const [error, setError] = useState<string | null>(null);

  const convertJsonToCsv = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Input must be a non-empty array of JSON objects');
      }
      const headers = Object.keys(parsed[0]);
      const csvLines = [headers.join(',')];

      parsed.forEach((item) => {
        const row = headers.map((h) => {
          const val = item[h] !== undefined ? String(item[h]) : '';
          return val.includes(',') ? `"${val}"` : val;
        });
        csvLines.push(row.join(','));
      });

      const res = csvLines.join('\n');
      setCsvOutput(res);
      setError(null);
      trackEvent('tool_complete', { tool: 'json-csv-converter', dir: 'json-to-csv' });
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
    }
  };

  const convertCsvToJson = () => {
    try {
      const lines = csvOutput.trim().split('\n');
      if (lines.length < 2) throw new Error('CSV must contain a header line and at least one data row');

      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      const items = lines.slice(1).map((line) => {
        const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
        const obj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          obj[h] = vals[idx] !== undefined ? vals[idx] : '';
        });
        return obj;
      });

      setJsonInput(JSON.stringify(items, null, 2));
      setError(null);
      trackEvent('tool_complete', { tool: 'json-csv-converter', dir: 'csv-to-json' });
    } catch (err: any) {
      setError(err.message || 'Invalid CSV format');
    }
  };

  const handleDownload = (content: string, filename: string, type: string) => {
    downloadText(content, filename, type, 'json-csv-converter');
  };

  return (
    <div className="space-y-6">
      {/* Switch tabs */}
      <div className="flex justify-between items-center">
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMode('json-to-csv')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'json-to-csv'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            JSON → CSV
          </button>
          <button
            type="button"
            onClick={() => setMode('csv-to-json')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'csv-to-json'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            CSV → JSON
          </button>
        </div>

        <button
          type="button"
          onClick={mode === 'json-to-csv' ? convertJsonToCsv : convertCsvToJson}
          className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          Convert Now
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-mono">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* JSON Pane */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>JSON Array</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDownload(jsonInput, 'data.json', 'application/json')}
                className="hover:text-indigo-600 text-[11px]"
              >
                Download .json
              </button>
              <CopyButton textToCopy={jsonInput} label="Copy" size="sm" />
            </div>
          </div>
          <textarea
            rows={12}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          ></textarea>
        </div>

        {/* CSV Pane */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>CSV Table Text</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDownload(csvOutput, 'data.csv', 'text/csv')}
                className="hover:text-indigo-600 text-[11px]"
              >
                Download .csv
              </button>
              <CopyButton textToCopy={csvOutput} label="Copy" size="sm" />
            </div>
          </div>
          <textarea
            rows={12}
            value={csvOutput}
            onChange={(e) => setCsvOutput(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          ></textarea>
        </div>
      </div>
    </div>
  );
};
