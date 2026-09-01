import React, { useState } from 'react';
import { Banknote, Copy, Check, RotateCcw } from 'lucide-react';

export const SalaryCalculator: React.FC = () => {
  const [gross, setGross] = useState<number>(8000);
  const [gosiRate] = useState<number>(9.75); // Saudi GOSI employee share
  const [allowances, setAllowances] = useState<number>(1500);
  const [deductions, setDeductions] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const gosi = Math.round((gross * gosiRate) / 100);
  const net = gross + allowances - gosi - deductions;
  const annual = net * 12;

  const handleCopy = () => {
    navigator.clipboard.writeText(`الراتب الصافي: ${net.toLocaleString()} ر.س / شهرياً`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">حاسبة الراتب الصافي (السعودية)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">احسب صافي راتبك بعد خصم التأمينات والبدلات</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الراتب الأساسي (ر.س)</label>
            <input type="number" value={gross} onChange={(e) => setGross(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">البدلات (سكن/نقل)</label>
            <input type="number" value={allowances} onChange={(e) => setAllowances(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">خصومات أخرى</label>
            <input type="number" value={deductions} onChange={(e) => setDeductions(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">نسبة التأمينات (GOSI %)</label>
            <input value={`${gosiRate}% ثابت (حصة الموظف)`} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-80">الراتب الصافي شهرياً</span>
            <button onClick={handleCopy} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-4xl font-black">{net.toLocaleString()} <span className="text-lg font-bold opacity-80">ر.س</span></div>
          <div className="grid grid-cols-3 gap-3 text-xs pt-4 border-t border-white/20">
            <div><span className="opacity-70 block">خصم التأمينات</span><span className="font-bold">-{gosi.toLocaleString()} ر.س</span></div>
            <div><span className="opacity-70 block">السنوي الصافي</span><span className="font-bold">{annual.toLocaleString()} ر.س</span></div>
            <div><span className="opacity-70 block">الإجمالي</span><span className="font-bold">{(gross + allowances).toLocaleString()} ر.س</span></div>
          </div>
        </div>

        <button onClick={() => { setGross(8000); setAllowances(1500); setDeductions(0); }} className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" /> إعادة تعيين
        </button>
      </div>
    </div>
  );
};
