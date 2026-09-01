import React, { useState, useEffect } from 'react';
import { BadgeDollarSign, ArrowLeftRight, RefreshCw, TrendingUp, Check, Copy } from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'دولار أمريكي (US Dollar)', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'يورو أوروبي (Euro)', symbol: '€', flag: '🇪🇺' },
  { code: 'SAR', name: 'ريال سعودي (Saudi Riyal)', symbol: 'ر.س', flag: '🇸🇦' },
  { code: 'AED', name: 'درهم إماراتي (UAE Dirham)', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'EGP', name: 'جنيه مصري (Egyptian Pound)', symbol: 'ج.م', flag: '🇪🇬' },
  { code: 'KWD', name: 'دينار كويتي (Kuwaiti Dinar)', symbol: 'د.ك', flag: '🇰🇼' },
  { code: 'QAR', name: 'ريال قطري (Qatari Riyal)', symbol: 'ر.ق', flag: '🇶🇦' },
  { code: 'JOD', name: 'دينار أردني (Jordanian Dinar)', symbol: 'د.أ', flag: '🇯🇴' },
  { code: 'BHD', name: 'دينار بحريني (Bahraini Dinar)', symbol: 'د.ب', flag: '🇧🇭' },
  { code: 'OMR', name: 'ريال عماني (Omani Rial)', symbol: 'ر.ع', flag: '🇴🇲' },
  { code: 'GBP', name: 'جنيه إسترليني (British Pound)', symbol: '£', flag: '🇬🇧' },
  { code: 'TRY', name: 'ليرة تركية (Turkish Lira)', symbol: '₺', flag: '🇹🇷' },
  { code: 'MAD', name: 'درهم مغربي (Moroccan Dirham)', symbol: 'د.م', flag: '🇲🇦' },
  { code: 'CAD', name: 'دولار كندي (Canadian Dollar)', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'JPY', name: 'ين ياباني (Japanese Yen)', symbol: '¥', flag: '🇯🇵' },
  { code: 'CHF', name: 'فرنك سويسري (Swiss Franc)', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'AUD', name: 'دولار أسترالي (Australian Dollar)', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CNY', name: 'يوان صيني (Chinese Yuan)', symbol: '¥', flag: '🇨🇳' },
];

// Fallback rates against 1 USD (in case API is unreachable)
const BASE_FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  SAR: 3.75,
  AED: 3.67,
  EGP: 48.5,
  KWD: 0.31,
  QAR: 3.64,
  JOD: 0.71,
  BHD: 0.38,
  OMR: 0.385,
  GBP: 0.78,
  TRY: 34.2,
  MAD: 9.85,
  CAD: 1.36,
  JPY: 151.5,
  CHF: 0.88,
  AUD: 1.52,
  CNY: 7.23,
};

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('SAR');
  const [rates, setRates] = useState<Record<string, number>>(BASE_FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('اليوم');
  const [copied, setCopied] = useState<boolean>(false);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=USD');
      if (res.ok) {
        const data = await res.json();
        const apiRates = data.rates || {};
        
        const updated: Record<string, number> = {
          ...BASE_FALLBACK_RATES,
          ...apiRates,
          USD: 1,
          SAR: 3.75,
          AED: 3.6725,
          QAR: 3.64,
          KWD: 0.308,
          BHD: 0.376,
          OMR: 0.384,
          JOD: 0.709,
        };
        setRates(updated);
        setLastUpdated(data.date || 'اليوم');
        trackEvent('currency_rates_refreshed', { source: 'api' });
      }
    } catch (e) {
      console.log('Using default rates buffer');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const swap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
    trackEvent('currency_swapped', { from: toCode, to: temp });
  };

  // Conversion logic via USD pivot
  const rateFrom = rates[fromCode] || BASE_FALLBACK_RATES[fromCode] || 1;
  const rateTo = rates[toCode] || BASE_FALLBACK_RATES[toCode] || 1;
  const unitRate = rateTo / rateFrom;

  const numAmount = parseFloat(amount) || 0;
  const convertedTotal = numAmount * unitRate;

  const fromCurr = CURRENCIES.find((c) => c.code === fromCode) || CURRENCIES[0];
  const toCurr = CURRENCIES.find((c) => c.code === toCode) || CURRENCIES[2];

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedTotal.toFixed(2));
    setCopied(true);
    trackToolUsage('currency-converter', 'محول العملات المباشر', 'copy_result');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAmountChange = (val: string) => {
    setAmount(val);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors">
        
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>أسعار الصرف الحية (آخر تحديث: {lastUpdated})</span>
          </div>
          <button
            type="button"
            onClick={fetchRates}
            disabled={isLoading}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>تحديث الأسعار</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          
          {/* From */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">
              المبلغ والعملة المصدر
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 font-black text-gray-900 dark:text-white text-2xl mb-2"
              placeholder="100"
            />
            <select
              value={fromCode}
              onChange={(e) => {
                setFromCode(e.target.value);
                trackEvent('currency_selected_from', { code: e.target.value });
              }}
              className="w-full px-3 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  {c.flag} {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="md:col-span-1 flex justify-center py-2">
            <button
              type="button"
              onClick={swap}
              className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center transition-all hover:scale-110 shadow-xs cursor-pointer"
              title="تبديل العملات"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">
              القيمة المحولة والعملة الهدف
            </label>
            <div className="w-full px-4 py-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-black text-2xl flex items-center justify-between overflow-x-auto mb-2">
              <span>{convertedTotal.toFixed(2)}</span>
              <span className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded-lg font-bold">
                {toCurr.symbol}
              </span>
            </div>
            <select
              value={toCode}
              onChange={(e) => {
                setToCode(e.target.value);
                trackEvent('currency_selected_to', { code: e.target.value });
              }}
              className="w-full px-3 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-bold text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  {c.flag} {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Rate Summary Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase block">سعر الصرف المباشر</span>
            <div className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mt-0.5">
              1 {fromCurr.code} = {unitRate.toFixed(4)} {toCurr.code}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
              1 {toCurr.code} = {(1 / unitRate).toFixed(4)} {fromCurr.code}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ!' : 'نسخ القيمة المحولة'}</span>
          </button>
        </div>

        {/* Popular amounts table */}
        <div className="pt-2">
          <span className="text-xs font-bold text-gray-600 dark:text-gray-400 block mb-2">
            جدول تحويلات سريعة ({fromCurr.code} إلى {toCurr.code}):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 10, 50, 100, 500, 1000, 5000, 10000].map((amt) => (
              <div key={amt} className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-800 text-right">
                <span className="text-xs text-gray-400 block">{amt} {fromCurr.code}</span>
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  {(amt * unitRate).toFixed(2)} <span className="text-xs text-gray-500 dark:text-gray-400">{toCurr.symbol}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

