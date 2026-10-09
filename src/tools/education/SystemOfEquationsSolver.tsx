import React, { useState } from 'react';
import {
  Equal, Divide, Calculator, Sparkles, BookOpen, Check,
  Copy, Layers, ArrowRight, Info, HelpCircle, Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

type SolverMode = '2x2' | '3x3';

export const SystemOfEquationsSolver: React.FC<Props> = ({ tool }) => {
  const [mode, setMode] = useState<SolverMode>('2x2');
  const [copied, setCopied] = useState<boolean>(false);

  // 2x2 System:
  // a1*x + b1*y = c1
  // a2*x + b2*y = c2
  const [a1, setA1] = useState<number>(2);
  const [b1, setB1] = useState<number>(3);
  const [c1, setC1] = useState<number>(8);
  const [a2, setA2] = useState<number>(1);
  const [b2, setB2] = useState<number>(-1);
  const [c2, setC2] = useState<number>(-1);

  // 3x3 System:
  // a*x + b*y + c*z = d
  const [eq1, setEq1] = useState<[number, number, number, number]>([1, 1, 1, 6]);
  const [eq2, setEq2] = useState<[number, number, number, number]>([0, 2, 5, -4]);
  const [eq3, setEq3] = useState<[number, number, number, number]>([2, 5, -1, 27]);

  // Solve 2x2 using Cramer's Rule
  // D = a1*b2 - a2*b1
  // Dx = c1*b2 - c2*b1
  // Dy = a1*c2 - a2*c1
  const det2 = a1 * b2 - a2 * b1;
  const det2X = c1 * b2 - c2 * b1;
  const det2Y = a1 * c2 - a2 * c1;

  let solution2x2Text = '';
  let x2Val: number | null = null;
  let y2Val: number | null = null;

  if (det2 !== 0) {
    x2Val = det2X / det2;
    y2Val = det2Y / det2;
    solution2x2Text = `Unique Solution: x = ${Number(x2Val.toFixed(4))}, y = ${Number(y2Val.toFixed(4))}`;
  } else {
    if (det2X === 0 && det2Y === 0) {
      solution2x2Text = 'Infinitely Many Solutions (Coincident lines / linearly dependent)';
    } else {
      solution2x2Text = 'No Solution (Inconsistent system / Parallel lines)';
    }
  }

  // Solve 3x3 using Determinants (Cramer's Rule)
  const det3x3 = (m: number[][]) => {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
    );
  };

  const D3 = det3x3([
    [eq1[0], eq1[1], eq1[2]],
    [eq2[0], eq2[1], eq2[2]],
    [eq3[0], eq3[1], eq3[2]]
  ]);

  const Dx3 = det3x3([
    [eq1[3], eq1[1], eq1[2]],
    [eq2[3], eq2[1], eq2[2]],
    [eq3[3], eq3[1], eq3[2]]
  ]);

  const Dy3 = det3x3([
    [eq1[0], eq1[3], eq1[2]],
    [eq2[0], eq2[3], eq2[2]],
    [eq3[0], eq3[3], eq3[2]]
  ]);

  const Dz3 = det3x3([
    [eq1[0], eq1[1], eq1[3]],
    [eq2[0], eq2[1], eq2[3]],
    [eq3[0], eq3[1], eq3[3]]
  ]);

  let solution3x3Text = '';
  let x3Val: number | null = null;
  let y3Val: number | null = null;
  let z3Val: number | null = null;

  if (D3 !== 0) {
    x3Val = Dx3 / D3;
    y3Val = Dy3 / D3;
    z3Val = Dz3 / D3;
    solution3x3Text = `Unique Solution: x = ${Number(x3Val.toFixed(4))}, y = ${Number(y3Val.toFixed(4))}, z = ${Number(z3Val.toFixed(4))}`;
  } else {
    solution3x3Text = 'Determinant Δ = 0: Infinitely many solutions or no solution.';
  }

  const handleCopy = () => {
    const text = mode === '2x2' ? solution2x2Text : solution3x3Text;
    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-200/60 dark:border-violet-900/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs font-bold mb-2">
            <Equal className="w-3.5 h-3.5 text-violet-500" />
            Cramer’s Rule & Linear Algebra Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            System of Equations Solver (2×2 & 3×3)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Solve linear systems of equations with two or three unknown variables. Instant determinants, step-by-step matrix elimination, and real-time fraction precision.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-violet-500/25 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Solution!' : 'Copy Solution'}
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-3">
        <button
          onClick={() => setMode('2x2')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition cursor-pointer ${
            mode === '2x2'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 hover:border-violet-400'
          }`}
        >
          2 Unknowns (2×2 System: x, y)
        </button>
        <button
          onClick={() => setMode('3x3')}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition cursor-pointer ${
            mode === '3x3'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-white dark:bg-slate-900 border text-slate-700 dark:text-slate-300 hover:border-violet-400'
          }`}
        >
          3 Unknowns (3×3 System: x, y, z)
        </button>
      </div>

      {/* 2x2 System Mode */}
      {mode === '2x2' ? (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Input Coefficients for Linear Equations
            </h3>

            {/* Equation 1 */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border">
              <span className="text-xs font-bold text-slate-400 w-16">Eq. 1:</span>
              <input
                type="number"
                value={a1}
                onChange={(e) => setA1(Number(e.target.value))}
                className="w-20 px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-bold text-center"
              />
              <span className="font-bold text-slate-700 dark:text-slate-300">x +</span>
              <input
                type="number"
                value={b1}
                onChange={(e) => setB1(Number(e.target.value))}
                className="w-20 px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-bold text-center"
              />
              <span className="font-bold text-slate-700 dark:text-slate-300">y =</span>
              <input
                type="number"
                value={c1}
                onChange={(e) => setC1(Number(e.target.value))}
                className="w-24 px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-bold text-center text-violet-600 dark:text-violet-400"
              />
            </div>

            {/* Equation 2 */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border">
              <span className="text-xs font-bold text-slate-400 w-16">Eq. 2:</span>
              <input
                type="number"
                value={a2}
                onChange={(e) => setA2(Number(e.target.value))}
                className="w-20 px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-bold text-center"
              />
              <span className="font-bold text-slate-700 dark:text-slate-300">x +</span>
              <input
                type="number"
                value={b2}
                onChange={(e) => setB2(Number(e.target.value))}
                className="w-20 px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-bold text-center"
              />
              <span className="font-bold text-slate-700 dark:text-slate-300">y =</span>
              <input
                type="number"
                value={c2}
                onChange={(e) => setC2(Number(e.target.value))}
                className="w-24 px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-bold text-center text-violet-600 dark:text-violet-400"
              />
            </div>

            {/* Result Display Hero */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-6 rounded-3xl bg-violet-50 dark:bg-violet-950/30 border-2 border-violet-500/40 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Value of Variable x
                </span>
                <p className="text-5xl font-black text-violet-600 dark:text-violet-400 mt-2">
                  {x2Val !== null ? Number(x2Val.toFixed(4)) : '—'}
                </p>
                <span className="text-xs font-mono text-slate-400 mt-1 block">
                  x = {det2X} / {det2}
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-500/40 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Value of Variable y
                </span>
                <p className="text-5xl font-black text-purple-600 dark:text-purple-400 mt-2">
                  {y2Val !== null ? Number(y2Val.toFixed(4)) : '—'}
                </p>
                <span className="text-xs font-mono text-slate-400 mt-1 block">
                  y = {det2Y} / {det2}
                </span>
              </div>
            </div>

            {/* Cramer's Rule Step-by-Step Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400 block">
                Matrix Determinants (Cramer's Rule):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <strong>Δ (Main Det)</strong> = ({a1}×{b2}) - ({a2}×{b1}) = <strong>{det2}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <strong>Δx (X Det)</strong> = ({c1}×{b2}) - ({c2}×{b1}) = <strong>{det2X}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                  <strong>Δy (Y Det)</strong> = ({a1}×{c2}) - ({a2}×{c1}) = <strong>{det2Y}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 3x3 System Mode */
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Input 3×3 Coefficients: a·x + b·y + c·z = d
            </h3>

            {/* Equations 1, 2, 3 */}
            {[
              { label: 'Eq. 1', state: eq1, setter: setEq1 },
              { label: 'Eq. 2', state: eq2, setter: setEq2 },
              { label: 'Eq. 3', state: eq3, setter: setEq3 }
            ].map((row, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-2 p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border">
                <span className="text-xs font-bold text-slate-400 w-14">{row.label}:</span>
                <input
                  type="number"
                  value={row.state[0]}
                  onChange={(e) => {
                    const c = [...row.state] as [number, number, number, number];
                    c[0] = Number(e.target.value);
                    row.setter(c);
                  }}
                  className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 border rounded-xl font-bold text-center"
                />
                <span className="font-bold text-slate-500">x +</span>
                <input
                  type="number"
                  value={row.state[1]}
                  onChange={(e) => {
                    const c = [...row.state] as [number, number, number, number];
                    c[1] = Number(e.target.value);
                    row.setter(c);
                  }}
                  className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 border rounded-xl font-bold text-center"
                />
                <span className="font-bold text-slate-500">y +</span>
                <input
                  type="number"
                  value={row.state[2]}
                  onChange={(e) => {
                    const c = [...row.state] as [number, number, number, number];
                    c[2] = Number(e.target.value);
                    row.setter(c);
                  }}
                  className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 border rounded-xl font-bold text-center"
                />
                <span className="font-bold text-slate-500">z =</span>
                <input
                  type="number"
                  value={row.state[3]}
                  onChange={(e) => {
                    const c = [...row.state] as [number, number, number, number];
                    c[3] = Number(e.target.value);
                    row.setter(c);
                  }}
                  className="w-20 px-2 py-1.5 bg-white dark:bg-slate-900 border rounded-xl font-bold text-center text-violet-600 dark:text-violet-400"
                />
              </div>
            ))}

            {/* 3x3 Results Hero Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-6 rounded-3xl bg-violet-50 dark:bg-violet-950/30 border-2 border-violet-500/40 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Value of x
                </span>
                <p className="text-4xl font-black text-violet-600 dark:text-violet-400 mt-2">
                  {x3Val !== null ? Number(x3Val.toFixed(4)) : '—'}
                </p>
                <span className="text-xs font-mono text-slate-400 mt-1 block">
                  Δx/Δ = {Dx3}/{D3}
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-500/40 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Value of y
                </span>
                <p className="text-4xl font-black text-purple-600 dark:text-purple-400 mt-2">
                  {y3Val !== null ? Number(y3Val.toFixed(4)) : '—'}
                </p>
                <span className="text-xs font-mono text-slate-400 mt-1 block">
                  Δy/Δ = {Dy3}/{D3}
                </span>
              </div>

              <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 border-2 border-indigo-500/40 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Value of z
                </span>
                <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                  {z3Val !== null ? Number(z3Val.toFixed(4)) : '—'}
                </p>
                <span className="text-xs font-mono text-slate-400 mt-1 block">
                  Δz/Δ = {Dz3}/{D3}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
