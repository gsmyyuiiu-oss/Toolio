import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { trackEvent } from '../../utils/analytics';

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [isRad, setIsRad] = useState(false);
  const [clearOnNext, setClearOnNext] = useState(false);

  const inputDigit = (d: string) => {
    if (display === '0' || clearOnNext) {
      setDisplay(d);
      setClearOnNext(false);
    } else {
      setDisplay(display + d);
    }
  };

  const handleFunc = (fn: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const factor = isRad ? 1 : Math.PI / 180;

    switch (fn) {
      case 'sin':
        res = Math.sin(val * factor);
        break;
      case 'cos':
        res = Math.cos(val * factor);
        break;
      case 'tan':
        res = Math.tan(val * factor);
        break;
      case 'sqrt':
        res = Math.sqrt(val);
        break;
      case 'log':
        res = Math.log10(val);
        break;
      case 'ln':
        res = Math.log(val);
        break;
      case 'sqr':
        res = Math.pow(val, 2);
        break;
      case 'cube':
        res = Math.pow(val, 3);
        break;
      case 'inv':
        res = val !== 0 ? 1 / val : 0;
        break;
      case 'fact': {
        let f = 1;
        const n = Math.min(Math.max(0, Math.floor(val)), 100);
        for (let i = 2; i <= n; i++) f *= i;
        res = f;
        break;
      }
      default:
        return;
    }

    const formatted = String(Math.round(res * 100000000) / 100000000);
    setDisplay(formatted);
    setClearOnNext(true);
    trackEvent('tool_complete', { tool: 'scientific-calculator', function: fn });
  };

  const handleConstant = (c: 'pi' | 'e') => {
    const val = c === 'pi' ? String(Math.PI) : String(Math.E);
    setDisplay(val);
    setClearOnNext(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setClearOnNext(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
      {/* Top Display */}
      <div className="mb-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right font-mono">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <button
            type="button"
            onClick={() => setIsRad(!isRad)}
            className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold hover:bg-slate-700 cursor-pointer"
          >
            {isRad ? 'RAD' : 'DEG'}
          </button>
          <span>Scientific Engine</span>
        </div>
        <div className="text-3xl sm:text-4xl font-black text-white tracking-tight overflow-x-auto no-scrollbar py-1">
          {display}
        </div>
        <div className="mt-2 pt-2 border-t border-slate-800 flex justify-end">
          <CopyButton textToCopy={display} label="Copy Output" size="sm" />
        </div>
      </div>

      {/* Scientific Function Grid */}
      <div className="grid grid-cols-5 gap-2 text-xs sm:text-sm font-semibold select-none">
        {/* Row 1 */}
        <button onClick={() => handleFunc('sin')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer">sin</button>
        <button onClick={() => handleFunc('cos')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer">cos</button>
        <button onClick={() => handleFunc('tan')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer">tan</button>
        <button onClick={() => handleConstant('pi')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 cursor-pointer">π</button>
        <button onClick={handleClear} className="p-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 cursor-pointer">AC</button>

        {/* Row 2 */}
        <button onClick={() => handleFunc('sqrt')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer">√x</button>
        <button onClick={() => handleFunc('sqr')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer">x²</button>
        <button onClick={() => handleFunc('cube')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer">x³</button>
        <button onClick={() => handleConstant('e')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 cursor-pointer">e</button>
        <button onClick={() => handleFunc('inv')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer">1/x</button>

        {/* Row 3 */}
        <button onClick={() => handleFunc('log')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer">log₁₀</button>
        <button onClick={() => handleFunc('ln')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 cursor-pointer">ln</button>
        <button onClick={() => handleFunc('fact')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer">x!</button>
        <button onClick={() => inputDigit('(')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">(</button>
        <button onClick={() => inputDigit(')')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">)</button>

        {/* Standard Digits */}
        <button onClick={() => inputDigit('7')} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer">7</button>
        <button onClick={() => inputDigit('8')} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer">8</button>
        <button onClick={() => inputDigit('9')} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer">9</button>
        <button onClick={() => setDisplay(display + ' * ')} className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 cursor-pointer">×</button>
        <button onClick={() => setDisplay(display + ' / ')} className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 cursor-pointer">÷</button>

        <button onClick={() => inputDigit('4')} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer">4</button>
        <button onClick={() => inputDigit('5')} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer">5</button>
        <button onClick={() => inputDigit('6')} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer">6</button>
        <button onClick={() => setDisplay(display + ' + ')} className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 cursor-pointer">+</button>
        <button onClick={() => setDisplay(display + ' - ')} className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 cursor-pointer">−</button>

        <button onClick={() => inputDigit('1')} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer">1</button>
        <button onClick={() => inputDigit('2')} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer">2</button>
        <button onClick={() => inputDigit('3')} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer">3</button>
        <button onClick={() => inputDigit('0')} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer">0</button>
        <button onClick={() => inputDigit('.')} className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white cursor-pointer">.</button>
      </div>
    </div>
  );
};
