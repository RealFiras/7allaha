import React, { useState } from 'react';
import { Coins, Sparkles, Copy, Check, RotateCcw, Info, CheckCircle2, DollarSign } from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

export const ZakatCalculator: React.FC = () => {
  // Inputs
  const [cashAmount, setCashAmount] = useState<string>('0');
  const [bankSavings, setBankSavings] = useState<string>('0');
  const [goldGrams24, setGoldGrams24] = useState<string>('0');
  const [goldGrams21, setGoldGrams21] = useState<string>('0');
  const [silverGrams, setSilverGrams] = useState<string>('0');
  const [stocksValue, setStocksValue] = useState<string>('0');
  const [tradeGoods, setTradeGoods] = useState<string>('0');
  const [debtsOwedToYou, setDebtsOwedToYou] = useState<string>('0');
  const [debtsYouOwe, setDebtsYouOwe] = useState<string>('0');

  // Prices
  const [goldPricePerGram24, setGoldPricePerGram24] = useState<string>('75'); // Default estimate in USD/Currency
  const [silverPricePerGram, setSilverPricePerGram] = useState<string>('0.90');
  const [currencySymbol, setCurrencySymbol] = useState<string>('ر.س');

  const [copied, setCopied] = useState(false);

  // Parsing helper
  const parseNum = (v: string) => {
    const n = parseFloat(v);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  const cash = parseNum(cashAmount);
  const bank = parseNum(bankSavings);
  const g24 = parseNum(goldGrams24);
  const g21 = parseNum(goldGrams21);
  const silver = parseNum(silverGrams);
  const stocks = parseNum(stocksValue);
  const trade = parseNum(tradeGoods);
  const debtsToYou = parseNum(debtsOwedToYou);
  const debtsOwed = parseNum(debtsYouOwe);

  const goldPrice24 = parseNum(goldPricePerGram24);
  const goldPrice21 = goldPrice24 * (21 / 24);
  const silverPrice = parseNum(silverPricePerGram);

  // Values calculation
  const totalGoldValue = (g24 * goldPrice24) + (g21 * goldPrice21);
  const totalSilverValue = silver * silverPrice;
  const totalLiquidCash = cash + bank;
  const totalCommercialAndInvestments = stocks + trade + debtsToYou;

  // Gross Wealth subject to Zakat
  const grossWealth = totalLiquidCash + totalGoldValue + totalSilverValue + totalCommercialAndInvestments;
  // Net Wealth after immediate deductible debts
  const netZakatPool = Math.max(0, grossWealth - debtsOwed);

  // Nisab threshold (85 grams of pure 24k gold)
  const nisabThreshold = 85 * goldPrice24;
  const isNisabReached = netZakatPool >= nisabThreshold && nisabThreshold > 0;

  // 2.5% Zakat rate for lunar year
  const zakatDue = isNisabReached ? netZakatPool * 0.025 : 0;

  const handleReset = () => {
    setCashAmount('0');
    setBankSavings('0');
    setGoldGrams24('0');
    setGoldGrams21('0');
    setSilverGrams('0');
    setStocksValue('0');
    setTradeGoods('0');
    setDebtsOwedToYou('0');
    setDebtsYouOwe('0');
    trackEvent('zakat_reset');
  };

  const handleCopy = () => {
    const text = `حساب الزكاة عبر موقع أدواتي:\nإجمالي الأموال الخاضعة للزكاة: ${netZakatPool.toLocaleString('ar-SA')} ${currencySymbol}\nمقدار الزكاة الواجبة (2.5%): ${zakatDue.toLocaleString('ar-SA')} ${currencySymbol}\nحد النصاب الشرعي: ${nisabThreshold.toLocaleString('ar-SA')} ${currencySymbol}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    trackToolUsage('zakat-calculator', 'حاسبة الزكاة الذكية', 'copy_result');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Currency Selector */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
              إعدادات النصاب وسعر الذهب والعملة
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">العملة:</span>
            <select
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              <option value="ر.س">ريال سعودي (ر.س)</option>
              <option value="د.إ">درهم إماراتي (د.إ)</option>
              <option value="ج.م">جنيه مصري (ج.م)</option>
              <option value="د.ك">دينار كويتي (د.ك)</option>
              <option value="د.أ">دينار أردني (د.أ)</option>
              <option value="ر.ع">ريال عماني (ر.ع)</option>
              <option value="ر.ق">ريال قطري (ر.ق)</option>
              <option value="$">دولار أمريكي ($)</option>
              <option value="€">يورو (€)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
              سعر غرام الذهب عيار 24 بالعملة الحالية
            </label>
            <input
              type="number"
              value={goldPricePerGram24}
              onChange={(e) => setGoldPricePerGram24(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm"
              placeholder="75"
            />
            <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 block">
              قيمة نصاب الذهب (85 غرام عيار 24) = {(85 * goldPrice24).toLocaleString()} {currencySymbol}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
              سعر غرام الفضة النقية بالعملة الحالية
            </label>
            <input
              type="number"
              value={silverPricePerGram}
              onChange={(e) => setSilverPricePerGram(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm"
              placeholder="0.90"
            />
            <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 block">
              قيمة نصاب الفضة (595 غرام) = {(595 * silverPrice).toLocaleString()} {currencySymbol}
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              أدخل قيم الأموال والممتلكات المدخرة
            </h3>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة تعيين</span>
            </button>
          </div>

          {/* Section 1: Cash & Bank */}
          <div className="space-y-4">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              1. السيولة النقدية والودائع المصرفية
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  النقود السائلة في اليد والخزينة ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  الودائع والأرصدة البنكية المدخرة ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={bankSavings}
                  onChange={(e) => setBankSavings(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Gold & Silver */}
          <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              2. الذهب والفضة الاستثمارية
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  ذهب عيار 24 (بالغرام)
                </label>
                <input
                  type="number"
                  value={goldGrams24}
                  onChange={(e) => setGoldGrams24(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  ذهب عيار 21 (بالغرام)
                </label>
                <input
                  type="number"
                  value={goldGrams21}
                  onChange={(e) => setGoldGrams21(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  الفضة الخالصة (بالغرام)
                </label>
                <input
                  type="number"
                  value={silverGrams}
                  onChange={(e) => setSilverGrams(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Commercial & Investments */}
          <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              3. عروض التجارة والأسهم والديون
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  قيمة البضائع وعروض التجارة ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={tradeGoods}
                  onChange={(e) => setTradeGoods(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  القيمة السوقية للأسهم والصناديق ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={stocksValue}
                  onChange={(e) => setStocksValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  ديون مرجوة السداد لك عند الآخرين ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={debtsOwedToYou}
                  onChange={(e) => setDebtsOwedToYou(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                  ديون واجبة عليك تستحق السداد حالاً (-) ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={debtsYouOwe}
                  onChange={(e) => setDebtsYouOwe(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20 text-gray-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-6 sm:p-7 rounded-3xl border shadow-sm space-y-6 transition-all ${
            isNisabReached
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
              : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
          }`}>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                مقدار الزكاة الواجب إخراجها (2.5%)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {zakatDue.toLocaleString('ar-SA', { maximumFractionDigits: 2 })} {currencySymbol}
              </div>
            </div>

            {/* Status indicator */}
            <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-start gap-2.5 ${
              isNisabReached
                ? 'bg-emerald-100/70 dark:bg-emerald-900/50 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
            }`}>
              {isNisabReached ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span>بلغ المال النصاب الشرعي!</span>
                    <p className="text-[11px] font-normal opacity-90 mt-0.5">
                      تجب الزكاة بنسبة 2.5% إذا حال الحول (مرور عام هجري كامل) على امتلاك النصاب.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span>لم يبلغ المال النصاب بعد</span>
                    <p className="text-[11px] font-normal opacity-90 mt-0.5">
                      النصاب المطلوب هو {nisabThreshold.toLocaleString()} {currencySymbol}. لا تجب الزكاة شرعاً حتى يبلغ المال النصاب ويحول عليه الحول.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Summary breakdown */}
            <div className="space-y-2.5 text-xs border-t border-gray-200/80 dark:border-gray-800 pt-4 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span>إجمالي السيولة النقدية:</span>
                <span className="font-bold">{totalLiquidCash.toLocaleString()} {currencySymbol}</span>
              </div>
              <div className="flex justify-between">
                <span>قيمة الذهب والفضة:</span>
                <span className="font-bold">{(totalGoldValue + totalSilverValue).toLocaleString()} {currencySymbol}</span>
              </div>
              <div className="flex justify-between">
                <span>عروض التجارة والاستثمارات:</span>
                <span className="font-bold">{totalCommercialAndInvestments.toLocaleString()} {currencySymbol}</span>
              </div>
              {debtsOwed > 0 && (
                <div className="flex justify-between text-red-600 dark:text-red-400">
                  <span>الديون المخصومة:</span>
                  <span className="font-bold">- {debtsOwed.toLocaleString()} {currencySymbol}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-800 font-extrabold text-sm text-gray-900 dark:text-white">
                <span>صافي الوعاء الزكوي:</span>
                <span>{netZakatPool.toLocaleString()} {currencySymbol}</span>
              </div>
            </div>

            {/* Action buttons */}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم نسخ التقرير!' : 'نسخ ملخص الزكاة'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
