import React, { useState, useEffect } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { RotateCcw, History, Delete } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

export const BasicCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState(0);
  const [clearOnNext, setClearOnNext] = useState(false);

  const handleDigit = (digit: string) => {
    if (display === '0' || clearOnNext) {
      setDisplay(digit);
      setClearOnNext(false);
    } else {
      if (display.length < 16) {
        setDisplay(display + digit);
      }
    }
  };

  const handleDecimal = () => {
    if (clearOnNext) {
      setDisplay('0.');
      setClearOnNext(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (op: string) => {
    setEquation(`${display} ${op} `);
    setClearOnNext(true);
  };

  const handleCalculate = () => {
    if (!equation) return;
    try {
      const fullExpression = `${equation}${display}`.replace(/×/g, '*').replace(/÷/g, '/');
      // Safe arithmetic evaluator
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${fullExpression})`)();
      const formatted = Number.isFinite(result) ? String(Math.round(result * 100000000) / 100000000) : 'Error';
      
      const record = `${equation}${display} = ${formatted}`;
      setHistory(prev => [record, ...prev].slice(0, 8));
      setDisplay(formatted);
      setEquation('');
      setClearOnNext(true);
      trackEvent('tool_complete', { tool: 'basic-calculator' });
    } catch {
      setDisplay('Error');
      setClearOnNext(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setClearOnNext(false);
  };

  const handleBackspace = () => {
    if (clearOnNext || display === 'Error') {
      setDisplay('0');
      setClearOnNext(false);
      return;
    }
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    if (display !== '0' && display !== 'Error') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
    }
  };

  const handlePercentage = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setDisplay(String(val / 100));
    }
  };

  // Memory functions
  const handleMemoryAdd = () => setMemory(prev => prev + (parseFloat(display) || 0));
  const handleMemorySub = () => setMemory(prev => prev - (parseFloat(display) || 0));
  const handleMemoryRecall = () => {
    setDisplay(String(memory));
    setClearOnNext(true);
  };
  const handleMemoryClear = () => setMemory(0);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['0','1','2','3','4','5','6','7','8','9'].includes(e.key)) {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('-');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {/* Main Calculator Body */}
      <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
        {/* Display Screen */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-right font-mono">
          <div className="text-xs text-slate-400 min-h-5 overflow-hidden text-ellipsis">
            {equation || '\u00A0'}
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight overflow-x-auto no-scrollbar py-1">
            {display}
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
            <span>{memory !== 0 ? `M = ${memory}` : 'Memory: Empty'}</span>
            <CopyButton textToCopy={display} label="Copy Value" size="sm" />
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2.5 text-sm sm:text-base font-bold select-none">
          {/* Memory Row */}
          <button
            type="button"
            onClick={handleMemoryClear}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            MC
          </button>
          <button
            type="button"
            onClick={handleMemoryRecall}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            MR
          </button>
          <button
            type="button"
            onClick={handleMemoryAdd}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            M+
          </button>
          <button
            type="button"
            onClick={handleMemorySub}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            M-
          </button>

          {/* Special Function Row */}
          <button
            type="button"
            onClick={handleClear}
            className="p-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors cursor-pointer"
          >
            C
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center justify-center cursor-pointer"
          >
            <Delete className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handlePercentage}
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            %
          </button>
          <button
            type="button"
            onClick={() => handleOperator('÷')}
            className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            ÷
          </button>

          {/* Numbers 7, 8, 9, * */}
          <button
            type="button"
            onClick={() => handleDigit('7')}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            7
          </button>
          <button
            type="button"
            onClick={() => handleDigit('8')}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            8
          </button>
          <button
            type="button"
            onClick={() => handleDigit('9')}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            9
          </button>
          <button
            type="button"
            onClick={() => handleOperator('×')}
            className="p-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            ×
          </button>

          {/* Numbers 4, 5, 6, - */}
          <button
            type="button"
            onClick={() => handleDigit('4')}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            4
          </button>
          <button
            type="button"
            onClick={() => handleDigit('5')}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            5
          </button>
          <button
            type="button"
            onClick={() => handleDigit('6')}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            6
          </button>
          <button
            type="button"
            onClick={() => handleOperator('-')}
            className="p-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            -
          </button>

          {/* Numbers 1, 2, 3, + */}
          <button
            type="button"
            onClick={() => handleDigit('1')}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            1
          </button>
          <button
            type="button"
            onClick={() => handleDigit('2')}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            2
          </button>
          <button
            type="button"
            onClick={() => handleDigit('3')}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            3
          </button>
          <button
            type="button"
            onClick={() => handleOperator('+')}
            className="p-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            +
          </button>

          {/* Bottom row: +/-, 0, ., = */}
          <button
            type="button"
            onClick={handleToggleSign}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            ±
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDecimal}
            className="p-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors cursor-pointer"
          >
            .
          </button>
          <button
            type="button"
            onClick={handleCalculate}
            className="p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            =
          </button>
        </div>
      </div>

      {/* History Tape Sidebar */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <History className="w-4 h-4" />
              <span>Calculation Tape</span>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {history.length > 0 ? (
              history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const resultPart = item.split('=')[1]?.trim();
                    if (resultPart) setDisplay(resultPart);
                  }}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-indigo-400 cursor-pointer transition-colors"
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No past calculations yet. Use the numpad or click numbers to start.
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1">Keyboard Shortcuts:</p>
          <p>• Digits 0–9, Enter / = to calculate</p>
          <p>• +, -, *, / for operations</p>
          <p>• Backspace to delete, Esc to clear</p>
        </div>
      </div>
    </div>
  );
};
