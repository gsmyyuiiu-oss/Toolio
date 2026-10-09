import React, { useState } from 'react';
import {
  GraduationCap, Award, Percent, CheckCircle2, BarChart,
  Divide, Equal, Activity, Calculator, Grid, Sigma, Shapes,
  Triangle, Circle, Ruler, Check, Clock, Timer, BookOpen,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

export const EducationMasterTool: React.FC<Props> = ({ tool }) => {
  // GPA state
  const [courses, setCourses] = useState([
    { name: 'Computer Science', grade: 4.0, credits: 4 },
    { name: 'Calculus III', grade: 3.7, credits: 4 },
    { name: 'Physics Mechanics', grade: 3.3, credits: 3 },
    { name: 'Technical Writing', grade: 4.0, credits: 3 }
  ]);

  // Quadratic equation state: ax^2 + bx + c = 0
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(-5);
  const [quadC, setQuadC] = useState<number>(6);

  // Statistics state
  const [statNumbers, setStatNumbers] = useState<string>('12, 15, 18, 22, 25, 28, 30');

  // Pomodoro
  const [pomoSeconds, setPomoSeconds] = useState<number>(25 * 60);
  const [isPomoActive, setIsPomoActive] = useState<boolean>(false);

  // Citation generator
  const [citeAuthor, setCiteAuthor] = useState<string>('Smith, John');
  const [citeTitle, setCiteTitle] = useState<string>('The Future of Universal Web Software');
  const [citeYear, setCiteYear] = useState<string>('2026');
  const [citePublisher, setCitePublisher] = useState<string>('MIT Press');

  // Calculate GPA
  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
  const totalGradePoints = courses.reduce((acc, c) => acc + c.grade * c.credits, 0);
  const calculatedGpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';

  // Solve Quadratic
  const discriminant = quadB * quadB - 4 * quadA * quadC;
  let root1 = '';
  let root2 = '';
  if (discriminant >= 0) {
    const r1 = (-quadB + Math.sqrt(discriminant)) / (2 * quadA);
    const r2 = (-quadB - Math.sqrt(discriminant)) / (2 * quadA);
    root1 = r1.toFixed(2);
    root2 = r2.toFixed(2);
  } else {
    root1 = 'Complex Root';
    root2 = 'Complex Root';
  }

  // Parse stats
  const parsedNums = statNumbers
    .split(/[, ]+/)
    .map((n) => parseFloat(n))
    .filter((n) => !isNaN(n));
  const mean = parsedNums.length > 0 ? (parsedNums.reduce((a, b) => a + b, 0) / parsedNums.length).toFixed(2) : '0';
  const sorted = [...parsedNums].sort((a, b) => a - b);
  const median = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* GPA Calculator View */}
      {tool.slug.includes('gpa') ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              College GPA & CGPA Calculator
            </h3>
            <div className="px-4 py-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-2xl border border-sky-200 dark:border-sky-800 text-sm font-bold">
              GPA: <span className="text-xl font-black">{calculatedGpa}</span> / 4.00
            </div>
          </div>

          <div className="space-y-3">
            {courses.map((course, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border items-center"
              >
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => {
                    const copy = [...courses];
                    copy[idx].name = e.target.value;
                    setCourses(copy);
                  }}
                  className="col-span-6 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded-lg font-semibold"
                />
                <select
                  value={course.grade}
                  onChange={(e) => {
                    const copy = [...courses];
                    copy[idx].grade = Number(e.target.value);
                    setCourses(copy);
                  }}
                  className="col-span-3 px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded-lg font-bold"
                >
                  <option value={4.0}>A (4.0)</option>
                  <option value={3.7}>A- (3.7)</option>
                  <option value={3.3}>B+ (3.3)</option>
                  <option value={3.0}>B (3.0)</option>
                  <option value={2.7}>B- (2.7)</option>
                  <option value={2.0}>C (2.0)</option>
                </select>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={course.credits}
                  onChange={(e) => {
                    const copy = [...courses];
                    copy[idx].credits = Number(e.target.value);
                    setCourses(copy);
                  }}
                  className="col-span-3 px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border rounded-lg font-bold"
                />
              </div>
            ))}
          </div>
        </div>
      ) : tool.slug.includes('equation') ? (
        /* Equation Solver View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Quadratic Equation Solver (ax² + bx + c = 0)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Coefficient a</label>
              <input
                type="number"
                value={quadA}
                onChange={(e) => setQuadA(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xl font-black"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Coefficient b</label>
              <input
                type="number"
                value={quadB}
                onChange={(e) => setQuadB(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xl font-black"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Constant c</label>
              <input
                type="number"
                value={quadC}
                onChange={(e) => setQuadC(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl text-xl font-black"
              />
            </div>
          </div>

          <div className="p-6 bg-sky-50 dark:bg-sky-950/30 rounded-2xl border border-sky-200 dark:border-sky-900 flex justify-around">
            <div className="text-center">
              <p className="text-xs text-slate-400 font-bold uppercase">Root x₁</p>
              <p className="text-3xl font-black text-sky-600 mt-1">{root1}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400 font-bold uppercase">Root x₂</p>
              <p className="text-3xl font-black text-sky-600 mt-1">{root2}</p>
            </div>
          </div>
        </div>
      ) : (
        /* Statistics & General Solver */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Dataset Statistics & Solvers
          </h3>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Enter Numbers (comma or space separated)
            </label>
            <input
              type="text"
              value={statNumbers}
              onChange={(e) => setStatNumbers(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-2xl font-mono text-base font-bold"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border text-center">
              <p className="text-xs text-slate-400 font-bold">Count (n)</p>
              <p className="text-2xl font-black text-sky-500 mt-1">{parsedNums.length}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border text-center">
              <p className="text-xs text-slate-400 font-bold">Mean (Average)</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{mean}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border text-center">
              <p className="text-xs text-slate-400 font-bold">Median</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{median}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border text-center">
              <p className="text-xs text-slate-400 font-bold">Sum Total</p>
              <p className="text-2xl font-black text-emerald-500 mt-1">
                {parsedNums.reduce((a, b) => a + b, 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
