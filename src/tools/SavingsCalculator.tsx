import React, { useState } from 'react';
import { PiggyBank, TrendingUp, Copy, Check } from 'lucide-react';

export const SavingsCalculator: React.FC = () => {
  const [goal, setGoal] = useState(50000);
  const [current, setCurrent] = useState(5000);
  const [monthly, setMonthly] = useState(1000);
  const [rate, setRate] = useState(3);
  const [copied, setCopied] = useState(false);

  const needed = Math.max(0, goal - current);
  const monthsSimple = monthly > 0 ? Math.ceil(needed / monthly) : 0;
  // With compound interest (monthly)
  let monthsWithInterest = 0;
  let balance = current;
  const monthlyRate = rate / 100 / 12;
  while (balance < goal && monthsWithInterest < 600) {
    balance = balance * (1 + monthlyRate) + monthly;
    monthsWithInterest++;
  }
  const years = Math.floor(monthsWithInterest / 12);
  const remMonths = monthsWithInterest % 12;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center"><PiggyBank className="w-5 h-5" /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">حاسبة هدف الادخار</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">كم تحتاج شهرياً للوصول لهدفك مع الفائدة المركبة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">الهدف (ر.س)</label><input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none focus:ring-2 focus:ring-amber-500" /></div>
          <div className="space-y-1.5"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">المدخر الحالي</label><input type="number" value={current} onChange={(e) => setCurrent(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none focus:ring-2 focus:ring-amber-500" /></div>
          <div className="space-y-1.5"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">ادخار شهري</label><input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none focus:ring-2 focus:ring-amber-500" /></div>
          <div className="space-y-1.5"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">عائد سنوي %</label><input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} step={0.5} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold outline-none focus:ring-2 focus:ring-amber-500" /></div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm opacity-90"><TrendingUp className="w-4 h-4" /> ستصل لهدفك خلال</div>
          <div className="text-3xl font-black">{monthsWithInterest === 600 ? 'أكثر من 50 سنة' : `${years} سنة و ${remMonths} شهر`}<span className="text-sm font-bold opacity-80"> ({monthsWithInterest} شهر)</span></div>
          <div className="text-xs opacity-80">بدون فائدة: {monthsSimple} شهر • المبلغ المتبقي: {needed.toLocaleString()} ر.س</div>
          <button onClick={() => { navigator.clipboard.writeText(`أحتاج ${monthsWithInterest} شهر للوصول لـ ${goal.toLocaleString()} ر.س`); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="mt-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'تم النسخ' : 'نسخ النتيجة'}
          </button>
        </div>
      </div>
    </div>
  );
};
