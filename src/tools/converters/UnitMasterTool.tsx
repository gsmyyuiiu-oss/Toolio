import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight, Copy, Check, RotateCcw, Sparkles,
  TrendingUp, Table, Calculator
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolDefinition } from '../../types';

interface Props {
  tool: ToolDefinition;
}

interface UnitDimension {
  id: string;
  name: string;
  baseUnit: string;
  units: { id: string; name: string; symbol: string; toBase: (v: number) => number; fromBase: (v: number) => number }[];
}

const DIMENSIONS: Record<string, UnitDimension> = {
  length: {
    id: 'length',
    name: 'Length & Distance',
    baseUnit: 'm',
    units: [
      { id: 'm', name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mi', name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'yd', name: 'Yards', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'ft', name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'nmi', name: 'Nautical Miles', symbol: 'nmi', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 }
    ]
  },
  weight: {
    id: 'weight',
    name: 'Weight & Mass',
    baseUnit: 'kg',
    units: [
      { id: 'kg', name: 'Kilograms', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', name: 'Grams', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mg', name: 'Milligrams', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { id: 'lb', name: 'Pounds', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', name: 'Ounces', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { id: 't', name: 'Metric Tons', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'st', name: 'Stones', symbol: 'st', toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
      { id: 'ct', name: 'Carats', symbol: 'ct', toBase: (v) => v * 0.0002, fromBase: (v) => v / 0.0002 }
    ]
  },
  temperature: {
    id: 'temperature',
    name: 'Temperature',
    baseUnit: 'C',
    units: [
      { id: 'C', name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'F', name: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'K', name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
      { id: 'R', name: 'Rankine', symbol: '°R', toBase: (v) => ((v - 491.67) * 5) / 9, fromBase: (v) => ((v + 273.15) * 9) / 5 }
    ]
  },
  speed: {
    id: 'speed',
    name: 'Speed',
    baseUnit: 'm_s',
    units: [
      { id: 'km_h', name: 'Kilometers per Hour', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mph', name: 'Miles per Hour', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'm_s', name: 'Meters per Second', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kn', name: 'Knots', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      { id: 'mach', name: 'Mach (at sea level)', symbol: 'Mach', toBase: (v) => v * 340.29, fromBase: (v) => v / 340.29 }
    ]
  },
  storage: {
    id: 'storage',
    name: 'Digital Data Storage',
    baseUnit: 'B',
    units: [
      { id: 'B', name: 'Bytes', symbol: 'B', toBase: (v) => v, fromBase: (v) => v },
      { id: 'KB', name: 'Kilobytes (Decimal)', symbol: 'KB', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'MB', name: 'Megabytes (Decimal)', symbol: 'MB', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      { id: 'GB', name: 'Gigabytes (Decimal)', symbol: 'GB', toBase: (v) => v * 1000000000, fromBase: (v) => v / 1000000000 },
      { id: 'TB', name: 'Terabytes (Decimal)', symbol: 'TB', toBase: (v) => v * 1e12, fromBase: (v) => v / 1e12 },
      { id: 'KiB', name: 'Kibibytes (Binary)', symbol: 'KiB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'MiB', name: 'Mebibytes (Binary)', symbol: 'MiB', toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
      { id: 'GiB', name: 'Gibibytes (Binary)', symbol: 'GiB', toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 }
    ]
  },
  pressure: {
    id: 'pressure',
    name: 'Pressure',
    baseUnit: 'Pa',
    units: [
      { id: 'Pa', name: 'Pascals', symbol: 'Pa', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kPa', name: 'Kilopascals', symbol: 'kPa', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'bar', name: 'Bars', symbol: 'bar', toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
      { id: 'psi', name: 'Pounds per Sq Inch', symbol: 'psi', toBase: (v) => v * 6894.757, fromBase: (v) => v / 6894.757 },
      { id: 'atm', name: 'Standard Atmospheres', symbol: 'atm', toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
      { id: 'torr', name: 'Torr / mmHg', symbol: 'Torr', toBase: (v) => v * 133.322, fromBase: (v) => v / 133.322 }
    ]
  },
  energy: {
    id: 'energy',
    name: 'Energy',
    baseUnit: 'J',
    units: [
      { id: 'J', name: 'Joules', symbol: 'J', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kJ', name: 'Kilojoules', symbol: 'kJ', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cal', name: 'Calories', symbol: 'cal', toBase: (v) => v * 4.184, fromBase: (v) => v / 4.184 },
      { id: 'kcal', name: 'Kilocalories', symbol: 'kcal', toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
      { id: 'Wh', name: 'Watt-hours', symbol: 'Wh', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { id: 'kWh', name: 'Kilowatt-hours', symbol: 'kWh', toBase: (v) => v * 3600000, fromBase: (v) => v / 3600000 },
      { id: 'btu', name: 'British Thermal Units', symbol: 'BTU', toBase: (v) => v * 1055.06, fromBase: (v) => v / 1055.06 }
    ]
  },
  power: {
    id: 'power',
    name: 'Power',
    baseUnit: 'W',
    units: [
      { id: 'W', name: 'Watts', symbol: 'W', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kW', name: 'Kilowatts', symbol: 'kW', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'MW', name: 'Megawatts', symbol: 'MW', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      { id: 'hp', name: 'Mechanical Horsepower', symbol: 'hp', toBase: (v) => v * 745.69987, fromBase: (v) => v / 745.69987 }
    ]
  },
  cooking: {
    id: 'cooking',
    name: 'Cooking Volume',
    baseUnit: 'ml',
    units: [
      { id: 'tsp', name: 'Teaspoons (US)', symbol: 'tsp', toBase: (v) => v * 4.92892, fromBase: (v) => v / 4.92892 },
      { id: 'tbsp', name: 'Tablespoons (US)', symbol: 'tbsp', toBase: (v) => v * 14.7868, fromBase: (v) => v / 14.7868 },
      { id: 'cup', name: 'Cups (US)', symbol: 'cup', toBase: (v) => v * 236.588, fromBase: (v) => v / 236.588 },
      { id: 'fl_oz', name: 'Fluid Ounces (US)', symbol: 'fl oz', toBase: (v) => v * 29.5735, fromBase: (v) => v / 29.5735 },
      { id: 'ml', name: 'Milliliters', symbol: 'ml', toBase: (v) => v, fromBase: (v) => v },
      { id: 'l', name: 'Liters', symbol: 'L', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 }
    ]
  },
  typography: {
    id: 'typography',
    name: 'Typography & Pixels',
    baseUnit: 'px',
    units: [
      { id: 'px', name: 'Pixels (at 96 DPI)', symbol: 'px', toBase: (v) => v, fromBase: (v) => v },
      { id: 'rem', name: 'Root REM (16px base)', symbol: 'rem', toBase: (v) => v * 16, fromBase: (v) => v / 16 },
      { id: 'pt', name: 'Points (1/72 in)', symbol: 'pt', toBase: (v) => v * 1.33333, fromBase: (v) => v / 1.33333 },
      { id: 'pc', name: 'Picas (12 pt)', symbol: 'pc', toBase: (v) => v * 16, fromBase: (v) => v / 16 }
    ]
  }
};

export const UnitMasterTool: React.FC<Props> = ({ tool }) => {
  const [selectedDimensionKey, setSelectedDimensionKey] = useState<string>('length');
  const [inputValue, setInputValue] = useState<number>(100);
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('ft');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Auto configure active dimension based on tool slug
  useEffect(() => {
    const slug = tool.slug;
    if (slug.includes('weight') || slug.includes('mass')) {
      setSelectedDimensionKey('weight');
      setFromUnitId('kg');
      setToUnitId('lb');
    } else if (slug.includes('temperature')) {
      setSelectedDimensionKey('temperature');
      setFromUnitId('C');
      setToUnitId('F');
    } else if (slug.includes('speed')) {
      setSelectedDimensionKey('speed');
      setFromUnitId('km_h');
      setToUnitId('mph');
    } else if (slug.includes('storage')) {
      setSelectedDimensionKey('storage');
      setFromUnitId('GB');
      setToUnitId('MB');
    } else if (slug.includes('pressure')) {
      setSelectedDimensionKey('pressure');
      setFromUnitId('bar');
      setToUnitId('psi');
    } else if (slug.includes('energy')) {
      setSelectedDimensionKey('energy');
      setFromUnitId('kcal');
      setToUnitId('kJ');
    } else if (slug.includes('power')) {
      setSelectedDimensionKey('power');
      setFromUnitId('kW');
      setToUnitId('hp');
    } else if (slug.includes('cooking')) {
      setSelectedDimensionKey('cooking');
      setFromUnitId('cup');
      setToUnitId('ml');
    } else if (slug.includes('rem') || slug.includes('typography')) {
      setSelectedDimensionKey('typography');
      setFromUnitId('px');
      setToUnitId('rem');
      setInputValue(24);
    } else {
      setSelectedDimensionKey('length');
      setFromUnitId('m');
      setToUnitId('ft');
    }
  }, [tool.slug]);

  const dimension = DIMENSIONS[selectedDimensionKey] || DIMENSIONS.length;
  const fromUnit = dimension.units.find((u) => u.id === fromUnitId) || dimension.units[0];
  const toUnit = dimension.units.find((u) => u.id === toUnitId) || dimension.units[1];

  // Calculation
  const baseVal = fromUnit.toBase(inputValue);
  const convertedVal = toUnit.fromBase(baseVal);

  const handleSwap = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${convertedVal} ${toUnit.symbol}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Dimension Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {Object.values(DIMENSIONS).map((dim) => (
          <button
            key={dim.id}
            onClick={() => {
              setSelectedDimensionKey(dim.id);
              setFromUnitId(dim.units[0].id);
              setToUnitId(dim.units[1]?.id || dim.units[0].id);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${selectedDimensionKey === dim.id ? 'bg-teal-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
          >
            {dim.name}
          </button>
        ))}
      </div>

      {/* Main Two-Way Conversion Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          {/* From Input Box */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              From ({fromUnit.name})
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(Number(e.target.value))}
              className="w-full px-4 py-3 text-2xl font-black bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-teal-500"
            />
            <select
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
            >
              {dimension.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center md:col-span-1">
            <button
              onClick={handleSwap}
              className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 flex items-center justify-center shadow-sm hover:scale-110 transition cursor-pointer"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To Result Box */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              To Result ({toUnit.name})
            </label>
            <div className="w-full px-4 py-3 text-2xl font-black bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 rounded-2xl text-teal-600 dark:text-teal-400 truncate flex items-center justify-between">
              <span>{convertedVal.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
              <button
                onClick={handleCopy}
                className="text-xs font-semibold px-2 py-1 bg-white dark:bg-slate-800 rounded-lg border flex items-center gap-1 cursor-pointer hover:bg-slate-100"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {isCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <select
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border rounded-xl"
            >
              {dimension.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cross-Unit Equivalent Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <Table className="w-4 h-4 text-teal-500" />
          Equivalent Conversion Table for {inputValue} {fromUnit.symbol}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {dimension.units.map((u) => {
            const val = u.fromBase(baseVal);
            return (
              <div
                key={u.id}
                className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800"
              >
                <p className="text-xs text-slate-400 font-medium">{u.name}</p>
                <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5 truncate">
                  {val.toLocaleString(undefined, { maximumFractionDigits: 4 })} {u.symbol}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
