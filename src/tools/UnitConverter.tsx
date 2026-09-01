import React, { useState } from 'react';
import { Ruler, Scale, Thermometer, Maximize, ArrowLeftRight, Copy, Check } from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

type UnitCategory = 'length' | 'weight' | 'temp' | 'area';

interface UnitOption {
  id: string;
  name: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const LENGTH_UNITS: UnitOption[] = [
  { id: 'm', name: 'متر (Meter)', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
  { id: 'km', name: 'كيلومتر (Kilometer)', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  { id: 'cm', name: 'سنتيمتر (Centimeter)', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
  { id: 'mm', name: 'مليمتر (Millimeter)', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  { id: 'in', name: 'بوصة / إنش (Inch)', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  { id: 'ft', name: 'قدم (Foot)', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
  { id: 'yd', name: 'ياردة (Yard)', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
  { id: 'mi', name: 'ميل (Mile)', symbol: 'mi', toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
];

const WEIGHT_UNITS: UnitOption[] = [
  { id: 'kg', name: 'كيلوجرام (Kilogram)', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
  { id: 'g', name: 'جرام (Gram)', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  { id: 'mg', name: 'مليجرام (Milligram)', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
  { id: 'lb', name: 'باوند / رطل (Pound)', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
  { id: 'oz', name: 'أونصة (Ounce)', symbol: 'oz', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
  { id: 'ton', name: 'طن متري (Metric Ton)', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
];

const TEMP_UNITS: UnitOption[] = [
  { id: 'c', name: 'مئوية سيلسيوس (Celsius)', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
  { id: 'f', name: 'فهرنهايت (Fahrenheit)', symbol: '°F', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => (v * 9) / 5 + 32 },
  { id: 'k', name: 'كلفن (Kelvin)', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
];

const AREA_UNITS: UnitOption[] = [
  { id: 'sqm', name: 'متر مربع (m²)', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
  { id: 'sqkm', name: 'كيلومتر مربع (km²)', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
  { id: 'sqft', name: 'قدم مربع (ft²)', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
  { id: 'dunam', name: 'دونم (Dunam)', symbol: 'دونم', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  { id: 'hectare', name: 'هكتار (Hectare)', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  { id: 'feddan', name: 'فدان (Feddan)', symbol: 'فدان', toBase: (v) => v * 4200.83, fromBase: (v) => v / 4200.83 },
  { id: 'acre', name: 'إيكر (Acre)', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
];

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [copied, setCopied] = useState<boolean>(false);

  const getUnitsList = (cat: UnitCategory) => {
    switch (cat) {
      case 'length': return LENGTH_UNITS;
      case 'weight': return WEIGHT_UNITS;
      case 'temp': return TEMP_UNITS;
      case 'area': return AREA_UNITS;
    }
  };

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const list = getUnitsList(newCat);
    setFromUnit(list[0].id);
    setToUnit(list[1].id);
    trackEvent('unit_category_change', { category: newCat });
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    trackEvent('unit_swapped', { category, from: toUnit, to: temp });
  };

  const units = getUnitsList(category);
  const fromObj = units.find((u) => u.id === fromUnit) || units[0];
  const toObj = units.find((u) => u.id === toUnit) || units[1];

  const numVal = parseFloat(value) || 0;
  const baseVal = fromObj.toBase(numVal);
  const resultVal = toObj.fromBase(baseVal);

  const formattedResult = Number.isInteger(resultVal)
    ? resultVal.toString()
    : parseFloat(resultVal.toFixed(6)).toString();

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedResult);
    setCopied(true);
    trackToolUsage('unit-converter', 'محول وحدات القياس الشامل', 'copy_result');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors">
        
        {/* Category selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => handleCategoryChange('length')}
            className={`p-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              category === 'length'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>الطول والمسافة</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('weight')}
            className={`p-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              category === 'weight'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>الوزن والكتلة</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('temp')}
            className={`p-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              category === 'temp'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80'
            }`}
          >
            <Thermometer className="w-4 h-4" />
            <span>درجة الحرارة</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('area')}
            className={`p-3 rounded-xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              category === 'area'
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80'
            }`}
          >
            <Maximize className="w-4 h-4" />
            <span>المساحة والأراضي</span>
          </button>
        </div>

        {/* Input & Unit Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center pt-2">
          
          {/* From Unit */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              التحويل من
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-extrabold text-xl mb-2"
              placeholder="أدخل القيمة"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-semibold text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2">
            <button
              type="button"
              onClick={swapUnits}
              className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
              title="تبديل الوحدات"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* To Unit */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
              التحويل إلى (النتيجة)
            </label>
            <div className="w-full px-4 py-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-black text-xl flex items-center justify-between overflow-x-auto mb-2">
              <span>{formattedResult}</span>
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                {toObj.symbol}
              </span>
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-semibold text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Copy Result Bar */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-800 text-sm">
          <div className="text-gray-700 dark:text-gray-300 font-semibold">
            {value} {fromObj.symbol} = <span className="text-blue-600 dark:text-blue-400 font-bold">{formattedResult} {toObj.symbol}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ النتيجة'}</span>
          </button>
        </div>

        {/* Quick Reference Grid of all other units */}
        <div className="pt-2">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2">
            مقارنة فورية مع باقي الوحدات لنفس القيمة ({value} {fromObj.symbol}):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {units
              .filter((u) => u.id !== fromUnit)
              .map((u) => {
                const res = u.fromBase(baseVal);
                const display = Number.isInteger(res) ? res : parseFloat(res.toFixed(4));
                return (
                  <div key={u.id} className="p-2.5 bg-white dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-800 text-right">
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 block truncate">{u.name}</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {display} <span className="text-xs text-gray-500 dark:text-gray-400">{u.symbol}</span>
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    </div>
  );
};

