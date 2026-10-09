import React, { useState } from 'react';
import { CopyButton } from '../../components/common/CopyButton';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';

interface ConversionDimension {
  id: string;
  name: string;
  baseUnit: string;
  units: Record<string, { label: string; toBase: (v: number) => number; fromBase: (b: number) => number }>;
}

const DIMENSIONS: ConversionDimension[] = [
  {
    id: 'length',
    name: 'Length & Distance',
    baseUnit: 'm',
    units: {
      m: { label: 'Meters (m)', toBase: v => v, fromBase: b => b },
      km: { label: 'Kilometers (km)', toBase: v => v * 1000, fromBase: b => b / 1000 },
      cm: { label: 'Centimeters (cm)', toBase: v => v / 100, fromBase: b => b * 100 },
      mm: { label: 'Millimeters (mm)', toBase: v => v / 1000, fromBase: b => b * 1000 },
      mi: { label: 'Miles (mi)', toBase: v => v * 1609.344, fromBase: b => b / 1609.344 },
      yd: { label: 'Yards (yd)', toBase: v => v * 0.9144, fromBase: b => b / 0.9144 },
      ft: { label: 'Feet (ft)', toBase: v => v * 0.3048, fromBase: b => b / 0.3048 },
      in: { label: 'Inches (in)', toBase: v => v * 0.0254, fromBase: b => b / 0.0254 },
    },
  },
  {
    id: 'weight',
    name: 'Weight & Mass',
    baseUnit: 'kg',
    units: {
      kg: { label: 'Kilograms (kg)', toBase: v => v, fromBase: b => b },
      g: { label: 'Grams (g)', toBase: v => v / 1000, fromBase: b => b * 1000 },
      mg: { label: 'Milligrams (mg)', toBase: v => v / 1000000, fromBase: b => b * 1000000 },
      lb: { label: 'Pounds (lbs)', toBase: v => v * 0.45359237, fromBase: b => b / 0.45359237 },
      oz: { label: 'Ounces (oz)', toBase: v => v * 0.0283495, fromBase: b => b / 0.0283495 },
      t: { label: 'Metric Tons (t)', toBase: v => v * 1000, fromBase: b => b / 1000 },
    },
  },
  {
    id: 'temperature',
    name: 'Temperature',
    baseUnit: 'c',
    units: {
      c: { label: 'Celsius (°C)', toBase: v => v, fromBase: b => b },
      f: { label: 'Fahrenheit (°F)', toBase: v => (v - 32) * (5 / 9), fromBase: b => (b * 9) / 5 + 32 },
      k: { label: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: b => b + 273.15 },
    },
  },
  {
    id: 'speed',
    name: 'Speed & Velocity',
    baseUnit: 'mps',
    units: {
      mps: { label: 'Meters / second (m/s)', toBase: v => v, fromBase: b => b },
      kph: { label: 'Kilometers / hour (km/h)', toBase: v => v / 3.6, fromBase: b => b * 3.6 },
      mph: { label: 'Miles / hour (mph)', toBase: v => v * 0.44704, fromBase: b => b / 0.44704 },
      knot: { label: 'Knots (kn)', toBase: v => v * 0.514444, fromBase: b => b / 0.514444 },
    },
  },
  {
    id: 'data',
    name: 'Data Storage',
    baseUnit: 'mb',
    units: {
      b: { label: 'Bytes (B)', toBase: v => v / (1024 * 1024), fromBase: b => b * 1024 * 1024 },
      kb: { label: 'Kilobytes (KB)', toBase: v => v / 1024, fromBase: b => b * 1024 },
      mb: { label: 'Megabytes (MB)', toBase: v => v, fromBase: b => b },
      gb: { label: 'Gigabytes (GB)', toBase: v => v * 1024, fromBase: b => b / 1024 },
      tb: { label: 'Terabytes (TB)', toBase: v => v * 1024 * 1024, fromBase: b => b / (1024 * 1024) },
    },
  },
  {
    id: 'area',
    name: 'Area',
    baseUnit: 'sqm',
    units: {
      sqm: { label: 'Square Meters (m²)', toBase: v => v, fromBase: b => b },
      sqkm: { label: 'Square Kilometers (km²)', toBase: v => v * 1000000, fromBase: b => b / 1000000 },
      sqft: { label: 'Square Feet (ft²)', toBase: v => v * 0.092903, fromBase: b => b / 0.092903 },
      acre: { label: 'Acres (ac)', toBase: v => v * 4046.86, fromBase: b => b / 4046.86 },
      ha: { label: 'Hectares (ha)', toBase: v => v * 10000, fromBase: b => b / 10000 },
    },
  },
];

export const UnitConverter: React.FC = () => {
  const [selectedDimension, setSelectedDimension] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [inputValue, setInputValue] = useState<number>(10);

  const currentDim = DIMENSIONS.find(d => d.id === selectedDimension) || DIMENSIONS[0];

  const handleDimensionChange = (dimId: string) => {
    setSelectedDimension(dimId);
    const newDim = DIMENSIONS.find(d => d.id === dimId)!;
    const keys = Object.keys(newDim.units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  };

  const handleSwap = () => {
    const prevFrom = fromUnit;
    setFromUnit(toUnit);
    setToUnit(prevFrom);
  };

  // Compute conversion
  const fromConfig = currentDim.units[fromUnit];
  const toConfig = currentDim.units[toUnit];

  let converted = 0;
  if (fromConfig && toConfig && !isNaN(inputValue)) {
    const baseVal = fromConfig.toBase(inputValue);
    converted = toConfig.fromBase(baseVal);
  }

  // Generate full cross-unit table for all other units in dimension
  const baseValueForTable = fromConfig ? fromConfig.toBase(inputValue) : 0;

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
        {DIMENSIONS.map((dim) => (
          <button
            key={dim.id}
            type="button"
            onClick={() => handleDimensionChange(dim.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedDimension === dim.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {dim.name}
          </button>
        ))}
      </div>

      {/* Main Converter Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* From Input */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-semibold text-slate-500">From</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full text-2xl font-black px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
            >
              {Object.entries(currentDim.units).map(([key, u]) => (
                <option key={key} value={key}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-100 transition-transform hover:scale-105 cursor-pointer"
              title="Swap Units"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To Output */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-500">To</label>
              <CopyButton textToCopy={converted.toString()} label="Copy" size="sm" />
            </div>
            <div className="w-full text-2xl font-black px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-300 overflow-x-auto no-scrollbar">
              {Number(converted.toFixed(6)).toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
            >
              {Object.entries(currentDim.units).map(([key, u]) => (
                <option key={key} value={key}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cross-unit reference table */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          All Equivalent Units ({inputValue} {fromConfig?.label})
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          {Object.entries(currentDim.units).map(([key, u]) => {
            const tableVal = u.fromBase(baseValueForTable);
            return (
              <div
                key={key}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60"
              >
                <div className="text-slate-400 text-[11px] font-medium">{u.label}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5 truncate">
                  {Number(tableVal.toFixed(4)).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
