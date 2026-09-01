import React, { useState } from 'react';
import { Percent, Tag, TrendingUp, TrendingDown, ArrowRight, RotateCcw, Copy, Check } from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

export const PercentageCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discount' | 'basic' | 'isWhatPercent' | 'change'>('discount');
  const [copied, setCopied] = useState<string | null>(null);

  // Mode 1: Discount
  const [originalPrice, setOriginalPrice] = useState<string>('250');
  const [discountPercent, setDiscountPercent] = useState<string>('20');

  // Mode 2: Basic Percentage (What is X% of Y?)
  const [percentVal, setPercentVal] = useState<string>('15');
  const [totalVal, setTotalVal] = useState<string>('500');

  // Mode 3: X is what percent of Y?
  const [valX, setValX] = useState<string>('45');
  const [valY, setValY] = useState<string>('180');

  // Mode 4: Percentage Change (from V1 to V2)
  const [val1, setVal1] = useState<string>('1000');
  const [val2, setVal2] = useState<string>('1250');

  const copyResult = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    trackToolUsage('percentage-calculator', 'حاسبة النسبة المئوية والخصم', `copy_${id}`);
    setTimeout(() => setCopied(null), 2000);
  };

  // Calculations
  const discountCalc = () => {
    const price = parseFloat(originalPrice) || 0;
    const disc = parseFloat(discountPercent) || 0;
    const savings = (price * disc) / 100;
    const finalPrice = price - savings;
    return {
      savings: savings.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
    };
  };

  const basicCalc = () => {
    const p = parseFloat(percentVal) || 0;
    const t = parseFloat(totalVal) || 0;
    const res = (p * t) / 100;
    return res.toFixed(2);
  };

  const isWhatPercentCalc = () => {
    const x = parseFloat(valX) || 0;
    const y = parseFloat(valY) || 0;
    if (y === 0) return '0';
    const res = (x / y) * 100;
    return res.toFixed(2);
  };

  const changeCalc = () => {
    const v1 = parseFloat(val1) || 0;
    const v2 = parseFloat(val2) || 0;
    if (v1 === 0) return { diff: 0, percent: '0', isIncrease: true };
    const diff = v2 - v1;
    const percent = ((diff / Math.abs(v1)) * 100).toFixed(2);
    return {
      diff: Math.abs(diff).toFixed(2),
      percent: Math.abs(parseFloat(percent)).toFixed(2),
      isIncrease: diff >= 0,
    };
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm p-4 sm:p-8 space-y-6 transition-colors">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('discount');
              trackEvent('percentage_tab_switch', { tab: 'discount' });
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'discount'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>حاسبة التخفيضات والخصم</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('basic');
              trackEvent('percentage_tab_switch', { tab: 'basic' });
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'basic'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>نسبة X% من رقم</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('isWhatPercent');
              trackEvent('percentage_tab_switch', { tab: 'isWhatPercent' });
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'isWhatPercent'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span>رقم يمثل كم % من رقم</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('change');
              trackEvent('percentage_tab_switch', { tab: 'change' });
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'change'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>نسبة الزيادة / النقصان</span>
          </button>
        </div>

        {/* Tab 1: Discount */}
        {activeTab === 'discount' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  السعر الأصلي قبل الخصم
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="مثال: 250"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white font-bold text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  نسبة الخصم المئوية (%)
                </label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  placeholder="مثال: 20"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white font-bold text-lg"
                />
              </div>
            </div>

            {/* Quick preset discount pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">نسب شائعة:</span>
              {[5, 10, 15, 20, 25, 30, 50, 70].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setDiscountPercent(p.toString())}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs font-bold text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  {p}%
                </button>
              ))}
            </div>

            {/* Result Box */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase block">السعر النهائي بعد الخصم</span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-900 dark:text-emerald-100 mt-1">
                  {discountCalc().finalPrice}
                </div>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 block">
                  وفرت بمقدار: <strong className="font-bold">{discountCalc().savings}</strong> ({discountPercent}%)
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyResult(discountCalc().finalPrice, 'discount')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied === 'discount' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied === 'discount' ? 'تم النسخ!' : 'نسخ السعر النهائي'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Basic X% of Y */}
        {activeTab === 'basic' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  النسبة المئوية (%)
                </label>
                <input
                  type="number"
                  value={percentVal}
                  onChange={(e) => setPercentVal(e.target.value)}
                  placeholder="مثال: 15"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-bold text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  من إجمالي الرقم
                </label>
                <input
                  type="number"
                  value={totalVal}
                  onChange={(e) => setTotalVal(e.target.value)}
                  placeholder="مثال: 500"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-bold text-lg"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase block">
                  {percentVal}% من العدد {totalVal} تساوي:
                </span>
                <div className="text-3xl sm:text-4xl font-black text-blue-900 dark:text-blue-100 mt-1">
                  {basicCalc()}
                </div>
                <span className="text-xs text-blue-700 dark:text-blue-400 mt-1 block">
                  المعادلة: ({percentVal} ÷ 100) × {totalVal} = {basicCalc()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyResult(basicCalc(), 'basic')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied === 'basic' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied === 'basic' ? 'تم النسخ!' : 'نسخ النتيجة'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: X is what percent of Y */}
        {activeTab === 'isWhatPercent' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  العدد الجزئي (X)
                </label>
                <input
                  type="number"
                  value={valX}
                  onChange={(e) => setValX(e.target.value)}
                  placeholder="مثال: 45"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-bold text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  العدد الكلي (Y)
                </label>
                <input
                  type="number"
                  value={valY}
                  onChange={(e) => setValY(e.target.value)}
                  placeholder="مثال: 180"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-bold text-lg"
                />
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase block">
                  العدد {valX} يمثل من {valY}:
                </span>
                <div className="text-3xl sm:text-4xl font-black text-indigo-950 dark:text-indigo-100 mt-1">
                  {isWhatPercentCalc()}%
                </div>
                <span className="text-xs text-indigo-700 dark:text-indigo-400 mt-1 block">
                  المعادلة: ({valX} ÷ {valY}) × 100 = {isWhatPercentCalc()}%
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyResult(`${isWhatPercentCalc()}%`, 'whatPercent')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copied === 'whatPercent' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied === 'whatPercent' ? 'تم النسخ!' : 'نسخ النسبة'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Percentage Change */}
        {activeTab === 'change' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  القيمة الأولى (الأصلية)
                </label>
                <input
                  type="number"
                  value={val1}
                  onChange={(e) => setVal1(e.target.value)}
                  placeholder="مثال: 1000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-bold text-lg"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  القيمة الثانية (الجديدة)
                </label>
                <input
                  type="number"
                  value={val2}
                  onChange={(e) => setVal2(e.target.value)}
                  placeholder="مثال: 1250"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-bold text-lg"
                />
              </div>
            </div>

            {(() => {
              const res = changeCalc();
              return (
                <div
                  className={`border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    res.isIncrease
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-100'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-100'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase block">
                      {res.isIncrease ? 'زيادة وارتفاع بنسبة:' : 'انخفاض وتراجع بنسبة:'}
                    </span>
                    <div className="text-3xl sm:text-4xl font-black flex items-center gap-2">
                      {res.isIncrease ? (
                        <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                      )}
                      <span>{res.percent}%</span>
                    </div>
                    <span className="text-xs block opacity-80">
                      الفارق الرقمي المطلق: {res.diff}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyResult(`${res.percent}%`, 'change')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer ${
                      res.isIncrease ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                    }`}
                  >
                    {copied === 'change' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied === 'change' ? 'تم النسخ!' : 'نسخ نسبة التغير'}</span>
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

