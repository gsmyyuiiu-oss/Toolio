import React, { useState } from 'react';
import {
  Hash, Calculator, Sparkles, BookOpen, Check, Copy,
  ArrowRight, Info, HelpCircle, Layers, Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

interface SigFigResult {
  input: string;
  count: number;
  significantDigits: string;
  scientificNotation: string;
  decimals: number;
  explanation: string[];
}

function analyzeSigFigs(raw: string): SigFigResult | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Clean out commas or spaces
  const cleaned = trimmed.replace(/,/g, '');

  // Match scientific notation like 1.23e4 or standard floats/ints
  const sciMatch = cleaned.match(/^([+-]?\d*(?:\.\d*)?)[eE]([+-]?\d+)$/);

  let mantissa = cleaned;
  let exponent = 0;

  if (sciMatch) {
    mantissa = sciMatch[1];
    exponent = parseInt(sciMatch[2], 10);
  }

  // Remove leading sign
  const sign = mantissa.startsWith('-') || mantissa.startsWith('+') ? mantissa[0] : '';
  let numStr = mantissa.replace(/^[+-]/, '');

  if (!numStr || numStr === '.') return null;

  const hasDecimal = numStr.includes('.');
  const parts = numStr.split('.');
  const intPart = parts[0] || '';
  const fracPart = parts[1] || '';

  const explanation: string[] = [];

  // Find first non-zero digit
  let firstNonZero = -1;
  let digitsOnly = '';

  for (let i = 0; i < numStr.length; i++) {
    const char = numStr[i];
    if (char >= '0' && char <= '9') {
      if (firstNonZero === -1 && char !== '0') {
        firstNonZero = digitsOnly.length;
      }
      digitsOnly += char;
    }
  }

  if (firstNonZero === -1) {
    // Number is zero (e.g. 0, 0.0, 0.00)
    if (hasDecimal) {
      const count = fracPart.length + (intPart === '0' ? 0 : intPart.length);
      explanation.push('Zeros after a decimal point in zero numbers count as significant precision indicators.');
      return {
        input: trimmed,
        count: fracPart.length,
        significantDigits: fracPart.split('').join(' '),
        scientificNotation: `0.${'0'.repeat(Math.max(0, fracPart.length - 1))} × 10⁰`,
        decimals: fracPart.length,
        explanation
      };
    } else {
      return {
        input: trimmed,
        count: 1,
        significantDigits: '0',
        scientificNotation: '0 × 10⁰',
        decimals: 0,
        explanation: ['Zero with no decimal point has 1 significant figure.']
      };
    }
  }

  explanation.push('Non-zero digits (1-9) are always significant.');

  let count = 0;
  let sigDigitsList: string[] = [];

  if (hasDecimal) {
    // All digits from first non-zero to end are significant
    const relevant = digitsOnly.slice(firstNonZero);
    count = relevant.length;
    sigDigitsList = relevant.split('');
    explanation.push('In numbers with a decimal point, all trailing zeros count as significant digits.');
    if (firstNonZero > 0) {
      explanation.push('Leading zeros before the first non-zero digit are merely placeholders and NOT significant.');
    }
  } else {
    // No decimal point: trailing zeros are ambiguous (traditionally not significant unless marked)
    // Strip trailing zeros from count
    let lastNonZero = digitsOnly.length - 1;
    while (lastNonZero >= 0 && digitsOnly[lastNonZero] === '0') {
      lastNonZero--;
    }
    const relevant = digitsOnly.slice(firstNonZero, lastNonZero + 1);
    count = relevant.length;
    sigDigitsList = relevant.split('');
    if (lastNonZero < digitsOnly.length - 1) {
      explanation.push('Trailing zeros without a decimal point are NOT counted as significant (placeholders).');
    }
    explanation.push('Zeros between non-zero digits are captive zeros and are always significant.');
  }

  // Format in scientific notation
  const numVal = parseFloat(cleaned);
  const sci = !isNaN(numVal) ? numVal.toExponential(Math.max(0, count - 1)) : '';

  return {
    input: trimmed,
    count,
    significantDigits: sigDigitsList.join(' · '),
    scientificNotation: sci,
    decimals: hasDecimal ? fracPart.length : 0,
    explanation
  };
}

// Round to specified sig figs
function roundToSigFigs(num: number, sigFigs: number): string {
  if (num === 0 || isNaN(num) || !isFinite(num)) return '0';
  const mult = Math.pow(10, sigFigs - Math.floor(Math.log10(Math.abs(num))) - 1);
  const rounded = Math.round(num * mult) / mult;
  return rounded.toPrecision(sigFigs);
}

export const SignificantFiguresCalculator: React.FC<Props> = ({ tool }) => {
  const [inputVal, setInputVal] = useState<string>('0.0045080');
  const [roundTargetNum, setRoundTargetNum] = useState<string>('124.678');
  const [desiredSigFigs, setDesiredSigFigs] = useState<number>(3);
  const [copied, setCopied] = useState<boolean>(false);

  // Analysis of current input
  const analysis = analyzeSigFigs(inputVal);

  // Rounding calculation
  const numToRound = parseFloat(roundTargetNum);
  const roundedResult = !isNaN(numToRound) ? roundToSigFigs(numToRound, desiredSigFigs) : 'Invalid';

  // Quick preset buttons
  const presets = ['0.0045080', '10200', '10200.', '3.00 × 10⁸', '0.050', '98.60'];

  const handleCopy = () => {
    if (!analysis) return;
    const txt = `Significant Figures Analysis for "${analysis.input}":
Count: ${analysis.count} Sig Figs
Significant Digits: ${analysis.significantDigits}
Scientific Notation: ${analysis.scientificNotation}
Decimals: ${analysis.decimals}`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-sky-500/10 via-cyan-500/10 to-teal-500/10 border border-sky-200/60 dark:border-sky-900/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-sky-500" />
            Chemistry & Physics Sig Fig Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Significant Figures Calculator & Counter
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Count significant digits, convert to scientific notation, round measurements to desired precision, and see step-by-step rules.
          </p>
        </div>

        <button
          onClick={handleCopy}
          disabled={!analysis}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50 whitespace-nowrap"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Sig Figs!' : 'Copy Analysis'}
        </button>
      </div>

      {/* Main Analysis Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Enter Any Number or Scientific Notation
          </label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. 0.0045080, 1.25e-4, 5000..."
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-2xl font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Quick Example Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Try Examples:</span>
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => setInputVal(p.replace(' × 10⁸', 'e8'))}
              className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Analysis Result Cards */}
        {analysis ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Total Count Hero */}
            <div className="p-6 rounded-3xl bg-sky-50 dark:bg-sky-950/30 border-2 border-sky-500/40 text-center relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Significant Figures
              </span>
              <p className="text-5xl font-black text-sky-600 dark:text-sky-400 mt-2">
                {analysis.count}
              </p>
              <span className="text-xs font-bold text-slate-400 mt-1 block">
                significant digits
              </span>
            </div>

            {/* Digits Isolated */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Significant Digits
              </span>
              <p className="text-2xl font-black font-mono text-slate-800 dark:text-white mt-3 truncate px-2">
                {analysis.significantDigits || '—'}
              </p>
              <span className="text-xs text-slate-400 mt-1 block">
                Active measured precision
              </span>
            </div>

            {/* Scientific Notation */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Scientific Notation
              </span>
              <p className="text-2xl font-black font-mono text-slate-800 dark:text-white mt-3 truncate px-2">
                {analysis.scientificNotation}
              </p>
              <span className="text-xs text-slate-400 mt-1 block">
                Normalized representation
              </span>
            </div>

            {/* Decimals */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Decimals Places
              </span>
              <p className="text-3xl font-black text-slate-800 dark:text-white mt-3">
                {analysis.decimals}
              </p>
              <span className="text-xs text-slate-400 mt-1 block">
                Digits right of decimal point
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-sm">
            Please enter a valid numeric value above to inspect significant figures.
          </div>
        )}

        {/* Step by step rules applied */}
        {analysis && analysis.explanation.length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-500" />
              Applied Measurement Rules
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {analysis.explanation.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Round to Sig Figs Tool Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm uppercase tracking-wider">
          <Sliders className="w-4 h-4" /> Round Any Number to Desired Significant Figures
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Number to Round
            </label>
            <input
              type="text"
              value={roundTargetNum}
              onChange={(e) => setRoundTargetNum(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border font-mono font-bold text-lg"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Sig Figs: <span className="text-sky-500 font-black">{desiredSigFigs}</span>
              </label>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={desiredSigFigs}
              onChange={(e) => setDesiredSigFigs(Number(e.target.value))}
              className="w-full accent-sky-500 mt-2"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>1 Sig Fig</span>
              <span>5 Sig Figs</span>
              <span>10 Sig Figs</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-200 dark:border-sky-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-sky-600 dark:text-sky-400">
              Rounded Value ({desiredSigFigs} Sig Figs)
            </span>
            <p className="text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
              {roundedResult}
            </p>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(roundedResult);
              setCopied(true);
              confetti({ particleCount: 25, spread: 45 });
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow transition cursor-pointer flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Result
          </button>
        </div>
      </div>
    </div>
  );
};
