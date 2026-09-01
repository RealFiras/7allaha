import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Star, Cake, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackToolUsage } from '../lib/analytics';

const ARABIC_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const ZODIAC_SIGNS = [
  { name: 'برج الجدي', symbol: '♑', startMonth: 12, startDay: 22, endMonth: 1, endDay: 19 },
  { name: 'برج الدلو', symbol: '♒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 18 },
  { name: 'برج الحوت', symbol: '♓', startMonth: 2, startDay: 19, endMonth: 3, endDay: 20 },
  { name: 'برج الحمل', symbol: '♈', startMonth: 3, startDay: 21, endMonth: 4, endDay: 19 },
  { name: 'برج الثور', symbol: '♉', startMonth: 4, startDay: 20, endMonth: 5, endDay: 20 },
  { name: 'برج الجوزاء', symbol: '♊', startMonth: 5, startDay: 21, endMonth: 6, endDay: 20 },
  { name: 'برج السرطان', symbol: '♋', startMonth: 6, startDay: 21, endMonth: 7, endDay: 22 },
  { name: 'برج الأسد', symbol: '♌', startMonth: 7, startDay: 23, endMonth: 8, endDay: 22 },
  { name: 'برج العذراء', symbol: '♍', startMonth: 8, startDay: 23, endMonth: 9, endDay: 22 },
  { name: 'برج الميزان', symbol: '♎', startMonth: 9, startDay: 23, endMonth: 10, endDay: 22 },
  { name: 'برج العقرب', symbol: '♏', startMonth: 10, startDay: 23, endMonth: 11, endDay: 21 },
  { name: 'برج القوس', symbol: '♐', startMonth: 11, startDay: 22, endMonth: 12, endDay: 21 },
];

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalWeeks: number;
    totalHours: number;
    totalMinutes: number;
    birthDayName: string;
    zodiac: { name: string; symbol: string };
    nextBirthdayDays: number;
    nextBirthdayMonths: number;
    nextBirthdayDayName: string;
  } | null>(null);

  const calculateAge = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const now = new Date();

    if (birth > now) return;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Totals
    const diffMs = now.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    // Day of week born
    const birthDayName = ARABIC_DAYS[birth.getDay()];

    // Zodiac sign
    const bMonth = birth.getMonth() + 1;
    const bDay = birth.getDate();
    let userZodiac = ZODIAC_SIGNS[0];
    for (const z of ZODIAC_SIGNS) {
      if (
        (bMonth === z.startMonth && bDay >= z.startDay) ||
        (bMonth === z.endMonth && bDay <= z.endDay)
      ) {
        userZodiac = z;
        break;
      }
    }

    // Next birthday countdown
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }

    const nextDiffMs = nextBday.getTime() - now.getTime();
    const nextTotalDays = Math.ceil(nextDiffMs / (1000 * 60 * 60 * 24));
    const nextBdayMonths = Math.floor(nextTotalDays / 30.4);
    const nextBdayRemainingDays = Math.floor(nextTotalDays % 30.4);
    const nextBirthdayDayName = ARABIC_DAYS[nextBday.getDay()];

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      birthDayName,
      zodiac: userZodiac,
      nextBirthdayDays: nextBdayRemainingDays,
      nextBirthdayMonths: nextBdayMonths,
      nextBirthdayDayName,
    });

    trackToolUsage('age-calculator', 'حاسبة العمر الدقيقة', 'calculate');
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-8">
      {/* Input Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm p-6 sm:p-8 transition-colors">
        <form onSubmit={calculateAge} className="space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 text-center">
              اختر تاريخ ميلادك <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white font-bold text-lg text-center"
            />
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="submit"
              className="py-3.5 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-base shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              <span>احسب عمري الآن</span>
            </button>
          </div>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Primary Age Highlight */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 text-center shadow-lg">
              <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block mb-2">
                عمرك الحالي بالتفصيل
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 my-2">
                <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/20">
                  <span className="text-3xl sm:text-4xl font-black block">{result.years}</span>
                  <span className="text-xs text-blue-100 font-medium">سنة</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/20">
                  <span className="text-3xl sm:text-4xl font-black block">{result.months}</span>
                  <span className="text-xs text-blue-100 font-medium">أشهر</span>
                </div>
                <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/20">
                  <span className="text-3xl sm:text-4xl font-black block">{result.days}</span>
                  <span className="text-xs text-blue-100 font-medium">يوم</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 mt-3">
                ولدت يوم <span className="font-bold underline">{result.birthDayName}</span> • {result.zodiac.symbol} {result.zodiac.name}
              </p>
            </div>

            {/* Birthday Countdown & Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Birthday Countdown */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
                  <Cake className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block">عيد ميلادك القادم</span>
                  <div className="text-base font-extrabold text-emerald-950 dark:text-emerald-200 mt-0.5">
                    متبقي {result.nextBirthdayMonths} شهر و {result.nextBirthdayDays} يوم
                  </div>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400/80">
                    سيصادف يوم {result.nextBirthdayDayName}
                  </span>
                </div>
              </div>

              {/* Zodiac Sign Card */}
              <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/20 text-2xl font-bold">
                  {result.zodiac.symbol}
                </div>
                <div>
                  <span className="text-xs font-bold text-purple-800 dark:text-purple-400 block">البرج الشمسي</span>
                  <div className="text-base font-extrabold text-purple-950 dark:text-purple-200 mt-0.5">
                    {result.zodiac.name}
                  </div>
                  <span className="text-xs text-purple-700 dark:text-purple-400/80">
                    بناءً على التقويم الفلكي الغربي
                  </span>
                </div>
              </div>

            </div>

            {/* Total Units Lived Grid */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">
                إجمالي ما عشته حتى هذه اللحظة:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                  <span className="text-lg font-black text-gray-800 dark:text-gray-100 block">
                    {result.totalDays.toLocaleString('ar-SA')}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">إجمالي الأيام</span>
                </div>
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                  <span className="text-lg font-black text-gray-800 dark:text-gray-100 block">
                    {result.totalWeeks.toLocaleString('ar-SA')}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">إجمالي الأسابيع</span>
                </div>
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                  <span className="text-lg font-black text-gray-800 dark:text-gray-100 block">
                    {result.totalHours.toLocaleString('ar-SA')}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">إجمالي الساعات</span>
                </div>
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                  <span className="text-lg font-black text-gray-800 dark:text-gray-100 block">
                    {result.totalMinutes.toLocaleString('ar-SA')}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">إجمالي الدقائق</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

