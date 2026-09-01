import React, { useState, useEffect } from 'react';
import { Clock, Globe, Copy, Check, Sparkles, Moon, Sun, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

interface CityTimezone {
  name: string;
  country: string;
  flag: string;
  offset: number; // Offset from UTC in hours
  isArab: boolean;
}

const CITIES: CityTimezone[] = [
  { name: 'مكة المكرمة', country: 'السعودية', flag: '🇸🇦', offset: 3, isArab: true },
  { name: 'الرياض', country: 'السعودية', flag: '🇸🇦', offset: 3, isArab: true },
  { name: 'القاهرة', country: 'مصر', flag: '🇪🇬', offset: 2, isArab: true },
  { name: 'دبي / أبوظبي', country: 'الإمارات', flag: '🇦🇪', offset: 4, isArab: true },
  { name: 'الكويت', country: 'الكويت', flag: '🇰🇼', offset: 3, isArab: true },
  { name: 'الدوحة', country: 'قطر', flag: '🇶🇦', offset: 3, isArab: true },
  { name: 'عمان', country: 'الأردن', flag: '🇯🇴', offset: 3, isArab: true },
  { name: 'بغداد', country: 'العراق', flag: '🇮🇶', offset: 3, isArab: true },
  { name: 'القدس الشريف', country: 'فلسطين', flag: '🇵🇸', offset: 2, isArab: true },
  { name: 'الجزائر', country: 'الجزائر', flag: '🇩🇿', offset: 1, isArab: true },
  { name: 'الرباط', country: 'المغرب', flag: '🇲🇦', offset: 1, isArab: true },
  { name: 'لندن (UTC / GMT)', country: 'بريطانيا', flag: '🇬🇧', offset: 0, isArab: false },
  { name: 'نيويورك (EST)', country: 'أمريكا', flag: '🇺🇸', offset: -5, isArab: false },
  { name: 'طوكيو (JST)', country: 'اليابان', flag: '🇯🇵', offset: 9, isArab: false },
];

export const TimezoneConverter: React.FC = () => {
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0); // Mecca / Riyadh by default
  const [baseHour, setBaseHour] = useState<number>(14); // 2:00 PM
  const [baseMinute, setBaseMinute] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const baseCity = CITIES[selectedCityIndex];

  // Calculate local time for a specific city based on chosen base city hour
  const getCityTime = (city: CityTimezone) => {
    const diff = city.offset - baseCity.offset;
    let targetHour = (baseHour + diff) % 24;
    if (targetHour < 0) targetHour += 24;

    const period = targetHour >= 12 ? 'م' : 'ص';
    const displayHour12 = targetHour % 12 === 0 ? 12 : targetHour % 12;
    const formattedMinutes = String(baseMinute).padStart(2, '0');

    const isBusinessHour = targetHour >= 9 && targetHour <= 17;

    return {
      hour24: targetHour,
      timeString: `${displayHour12}:${formattedMinutes} ${period}`,
      isBusinessHour,
      isDay: targetHour >= 6 && targetHour < 19,
    };
  };

  const handleCopyComparison = () => {
    const lines = CITIES.map((c) => {
      const t = getCityTime(c);
      return `${c.flag} ${c.name} (${c.country}): ${t.timeString}`;
    });
    const text = `مقارنة التوقيت عبر أدواتي:\nوقت الأساس: ${baseCity.name} الساعة ${getCityTime(baseCity).timeString}\n\n${lines.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    trackToolUsage('timezone-converter', 'محول التوقيت العالمي', 'copy_comparison');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Control Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-7 shadow-xs space-y-6 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
              محول فروق التوقيت وجدولة الاجتماعات
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCopyComparison}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم نسخ التواقيت!' : 'نسخ جدول الأوقات'}</span>
          </button>
        </div>

        {/* Base City and Time Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              اختر مدينة التوقيت الأساسية:
            </label>
            <select
              value={selectedCityIndex}
              onChange={(e) => setSelectedCityIndex(parseInt(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-xs cursor-pointer"
            >
              {CITIES.map((c, i) => (
                <option key={i} value={i}>
                  {c.flag} {c.name} - {c.country} (GMT{c.offset >= 0 ? `+${c.offset}` : c.offset})
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-8 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-700 dark:text-gray-300">
                اسحب لتغيير الساعة في ({baseCity.name}):
              </span>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                {getCityTime(baseCity).timeString}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="23"
              value={baseHour}
              onChange={(e) => setBaseHour(parseInt(e.target.value))}
              className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>12:00 منتصف الليل</span>
              <span>12:00 ظهراً</span>
              <span>11:00 مساءً</span>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized City Time Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CITIES.map((city, idx) => {
          const t = getCityTime(city);
          const isBase = idx === selectedCityIndex;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                isBase
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 shadow-xs ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{city.flag}</span>
                  <div>
                    <span className="text-xs font-extrabold text-gray-900 dark:text-white block">
                      {city.name}
                    </span>
                    <span className="text-[11px] text-gray-400">{city.country}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                  {t.isDay ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>GMT{city.offset >= 0 ? `+${city.offset}` : city.offset}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xl font-black text-gray-900 dark:text-white font-mono">
                  {t.timeString}
                </span>

                {t.isBusinessHour ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                    ساعات عمل
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 text-[10px] font-bold">
                    خارج العمل
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
