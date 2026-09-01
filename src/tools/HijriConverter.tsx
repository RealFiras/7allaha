import React, { useState } from 'react';
import { Calendar, Moon, ArrowLeftRight, Clock, Sparkles, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const HIJRI_MONTHS = [
  'مُحَرَّم',
  'صَفَر',
  'رَبِيع الأَوَّل',
  'رَبِيع الآخِر',
  'جُمَادَى الأُولَى',
  'جُمَادَى الآخِرَة',
  'رَجَب',
  'شَعْبَان',
  'رَمَضَان',
  'شَوَّال',
  'ذُو القَعْدَة',
  'ذُو الحِجَّة',
];

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

// Accurate Umm Al-Qura / Tabular conversion formulas
function gregorianToHijri(date: Date, adjustment = 0) {
  const gDate = new Date(date.getTime() + adjustment * 86400000);
  
  // Intl format using islamic-umalqura calendar
  const formatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
  
  const parts = formatter.formatToParts(gDate);
  let hDay = 1, hMonth = 1, hYear = 1446;
  
  for (const part of parts) {
    if (part.type === 'day') hDay = parseInt(part.value, 10);
    if (part.type === 'month') hMonth = parseInt(part.value, 10);
    if (part.type === 'year') hYear = parseInt(part.value, 10);
  }

  // Day of week
  const dayName = ARABIC_DAYS[gDate.getDay()];
  const monthName = HIJRI_MONTHS[hMonth - 1] || HIJRI_MONTHS[0];

  return {
    day: hDay,
    month: hMonth,
    monthName,
    year: hYear,
    dayName,
    fullFormatted: `${dayName} ${hDay} ${monthName} ${hYear} هـ`,
  };
}

// Approximate Hijri to Gregorian
function hijriToGregorian(hYear: number, hMonth: number, hDay: number) {
  // Astronomical approximation algorithm
  const julianDay = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 30 * hMonth - Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385;
  
  // Convert Julian Day to Gregorian
  const l = julianDay + 68569;
  const n = Math.floor((4 * l) / 146097);
  const l2 = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor((4000 * (l2 + 1)) / 1461001);
  const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
  const j = Math.floor((80 * l3) / 2447);
  const gDay = l3 - Math.floor((2447 * j) / 80);
  const l4 = Math.floor(j / 11);
  const gMonth = j + 2 - 12 * l4;
  const gYear = 100 * (n - 49) + i + l4;

  const date = new Date(gYear, gMonth - 1, gDay);
  const dayName = ARABIC_DAYS[date.getDay()];

  return {
    date,
    day: gDay,
    month: gMonth,
    year: gYear,
    dayName,
    fullFormatted: `${dayName} ${gDay}-${gMonth}-${gYear} م`,
  };
}

export const HijriConverter: React.FC = () => {
  const [conversionType, setConversionType] = useState<'g2h' | 'h2g'>('g2h');
  const [gDateInput, setGDateInput] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Hijri inputs
  const [hDayInput, setHDayInput] = useState<number>(1);
  const [hMonthInput, setHMonthInput] = useState<number>(9); // Ramadan default
  const [hYearInput, setHYearInput] = useState<number>(1446);
  const [adjustment, setAdjustment] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Today Hijri
  const todayHijri = gregorianToHijri(new Date(), adjustment);

  // Results
  const g2hResult = gregorianToHijri(new Date(gDateInput), adjustment);
  const h2gResult = hijriToGregorian(hYearInput, hMonthInput, hDayInput);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Today's live date banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Moon className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-200 uppercase block">تاريخ اليوم في تقويم أم القرى</span>
              <div className="text-lg sm:text-xl font-black">
                {todayHijri.fullFormatted}
              </div>
            </div>
          </div>
          <span className="text-xs bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-xl font-bold">
            الموافق: {new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' })}
          </span>
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2 border-b border-slate-100 pb-4">
          <button
            type="button"
            onClick={() => setConversionType('g2h')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              conversionType === 'g2h'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>من ميلادي إلى هجري (G to H)</span>
          </button>

          <button
            type="button"
            onClick={() => setConversionType('h2g')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              conversionType === 'h2g'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>من هجري إلى ميلادي (H to G)</span>
          </button>
        </div>

        {/* Conversion Form 1: Gregorian to Hijri */}
        {conversionType === 'g2h' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  اختر التاريخ الميلادي
                </label>
                <input
                  type="date"
                  value={gDateInput}
                  onChange={(e) => setGDateInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  تعديل رؤية الهلال (اختياري)
                </label>
                <select
                  value={adjustment}
                  onChange={(e) => setAdjustment(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value={-2}>-2 يوم</option>
                  <option value={-1}>-1 يوم</option>
                  <option value={0}>0 (حساب أم القرى القياسي)</option>
                  <option value={1}>+1 يوم</option>
                  <option value={2}>+2 يوم</option>
                </select>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-right">
                <span className="text-xs font-bold text-emerald-800 uppercase block">التاريخ الهجري المقابل:</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-950">
                  {g2hResult.fullFormatted}
                </div>
                <span className="text-xs text-emerald-700 block">
                  اليوم: <strong className="font-bold">{g2hResult.dayName}</strong> • الشهر: {g2hResult.monthName} ({g2hResult.month}) • السنة: {g2hResult.year} هجرية
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(g2hResult.fullFormatted)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ التاريخ'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Conversion Form 2: Hijri to Gregorian */}
        {conversionType === 'h2g' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  اليوم في الشهر
                </label>
                <select
                  value={hDayInput}
                  onChange={(e) => setHDayInput(Number(e.target.value))}
                  className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  الشهر الهجري
                </label>
                <select
                  value={hMonthInput}
                  onChange={(e) => setHMonthInput(Number(e.target.value))}
                  className="w-full px-3 py-3 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {HIJRI_MONTHS.map((m, idx) => (
                    <option key={idx} value={idx + 1}>
                      {idx + 1} - {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  السنة الهجرية
                </label>
                <input
                  type="number"
                  value={hYearInput}
                  onChange={(e) => setHYearInput(Number(e.target.value))}
                  min="1"
                  max="2000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 text-sm"
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-right">
                <span className="text-xs font-bold text-blue-800 uppercase block">التاريخ الميلادي المقابل:</span>
                <div className="text-2xl sm:text-3xl font-black text-blue-950">
                  {h2gResult.fullFormatted}
                </div>
                <span className="text-xs text-blue-700 block">
                  اليوم: <strong className="font-bold">{h2gResult.dayName}</strong> • {h2gResult.date.toLocaleDateString('ar-EG', { dateStyle: 'long' })}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(h2gResult.fullFormatted)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ التاريخ'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Major Islamic Occasions Reference Table */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 block mb-3">
            أبرز المناسبات والأعياد الإسلامية ومواعيدها بالتقويم الهجري:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs font-tajawal">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-800 block">رأس السنة الهجرية</strong>
              <span className="text-emerald-700 font-bold">1 محرم</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-800 block">يوم عاشوراء</strong>
              <span className="text-emerald-700 font-bold">10 محرم</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-800 block">المولد النبوي الشريف</strong>
              <span className="text-emerald-700 font-bold">12 ربيع الأول</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-800 block">ليلة الإسراء والمعراج</strong>
              <span className="text-emerald-700 font-bold">27 رجب</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-800 block">بداية شهر رمضان</strong>
              <span className="text-emerald-700 font-bold">1 رمضان</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-800 block">عيد الفطر المبارك</strong>
              <span className="text-emerald-700 font-bold">1 شوال</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-800 block">يوم عرفة</strong>
              <span className="text-emerald-700 font-bold">9 ذو الحجة</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-800 block">عيد الأضحى المبارك</strong>
              <span className="text-emerald-700 font-bold">10 ذو الحجة</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
