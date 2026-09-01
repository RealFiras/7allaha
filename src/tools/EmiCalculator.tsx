import React, { useState, useMemo } from 'react';
import { Coins, Calendar, TrendingDown, DollarSign, RotateCcw, PieChart, Table } from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

export const EmiCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);

  const calculations = useMemo(() => {
    const P = loanAmount;
    const annualRate = interestRate;
    const totalMonths = tenureType === 'years' ? tenureYears * 12 : tenureYears;

    if (P <= 0 || annualRate <= 0 || totalMonths <= 0) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayment: 0,
        interestRatio: 0,
        schedule: [],
      };
    }

    const r = annualRate / 12 / 100;
    const n = totalMonths;

    // EMI formula: [P * r * (1 + r)^n] / [(1 + r)^n - 1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const interestRatio = (totalInterest / totalPayment) * 100;

    // Generate schedule
    let balance = P;
    const schedule: Array<{
      month: number;
      principalPaid: number;
      interestPaid: number;
      remainingBalance: number;
    }> = [];

    for (let m = 1; m <= n; m++) {
      const monthInterest = balance * r;
      const monthPrincipal = emi - monthInterest;
      balance = Math.max(0, balance - monthPrincipal);

      schedule.push({
        month: m,
        principalPaid: Math.round(monthPrincipal),
        interestPaid: Math.round(monthInterest),
        remainingBalance: Math.round(balance),
      });
    }

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      interestRatio: parseFloat(interestRatio.toFixed(1)),
      schedule,
    };
  }, [loanAmount, interestRate, tenureYears, tenureType]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ar-SA').format(val);
  };

  const handleReset = () => {
    setLoanAmount(100000);
    setInterestRate(5.5);
    setTenureYears(5);
    setTenureType('years');
    trackEvent('emi_reset');
  };

  return (
    <div className="space-y-8">
      {/* Interactive Main Box */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm p-6 sm:p-8 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Form (Left on RTL) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Loan Amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  مبلغ القرض (أصل التمويل)
                </label>
                <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  {formatCurrency(loanAmount)} ريال / درهم / جنيه
                </div>
              </div>
              <input
                type="range"
                min="5000"
                max="2000000"
                step="5000"
                value={loanAmount}
                onChange={(e) => {
                  setLoanAmount(Number(e.target.value));
                  trackToolUsage('emi-calculator', 'حاسبة القروض والتمويل', 'change_amount');
                }}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                <span>5,000</span>
                <span>500,000</span>
                <span>1,000,000</span>
                <span>2,000,000+</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  معدل الفائدة السنوي (%)
                </label>
                <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                  {interestRate}% سنوياً
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                <span>1%</span>
                <span>7.5%</span>
                <span>15%</span>
                <span>25%</span>
              </div>
            </div>

            {/* Loan Tenure */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  مدة سداد القرض
                </label>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setTenureType('years')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                      tenureType === 'years'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    بالسنوات
                  </button>
                  <button
                    type="button"
                    onClick={() => setTenureType('months')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                      tenureType === 'months'
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    بالأشهر
                  </button>
                </div>
              </div>

              <input
                type="range"
                min={tenureType === 'years' ? 1 : 6}
                max={tenureType === 'years' ? 30 : 360}
                step={tenureType === 'years' ? 1 : 6}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                <span>{tenureYears} {tenureType === 'years' ? 'سنوات' : 'شهراً'}</span>
                <span className="text-gray-400 dark:text-gray-500 font-normal">
                  ({tenureType === 'years' ? tenureYears * 12 : tenureYears} قسط شهري)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط الأرقام</span>
              </button>
            </div>
          </div>

          {/* Result Card (Right on RTL) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-gray-950 to-gray-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xl border border-gray-800">
            <div className="space-y-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                القسط الشهري المستحق (EMI)
              </span>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400">
                  {formatCurrency(calculations.monthlyEmi)}
                </span>
                <span className="text-sm font-semibold text-gray-300">شهرياً</span>
              </div>

              {/* Summary Items */}
              <div className="space-y-3 pt-4 border-t border-gray-800 text-sm">
                <div className="flex justify-between items-center text-gray-300">
                  <span>أصل مبلغ القرض:</span>
                  <span className="font-bold text-white">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span>إجمالي الفوائد المستحقة:</span>
                  <span className="font-bold text-amber-400">+{formatCurrency(calculations.totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-300 pt-2 border-t border-gray-800 font-bold">
                  <span className="text-white">المبلغ الإجمالي المدفوع:</span>
                  <span className="text-lg text-emerald-400">{formatCurrency(calculations.totalPayment)}</span>
                </div>
              </div>

              {/* Visual Breakdown Bar */}
              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>الأصل ({(100 - calculations.interestRatio).toFixed(1)}%)</span>
                  <span>الفوائد ({calculations.interestRatio}%)</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden flex bg-gray-800">
                  <div 
                    className="bg-blue-500 transition-all duration-300"
                    style={{ width: `${100 - calculations.interestRatio}%` }}
                    title="أصل القرض"
                  />
                  <div 
                    className="bg-amber-400 transition-all duration-300"
                    style={{ width: `${calculations.interestRatio}%` }}
                    title="الفائدة"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowFullSchedule(!showFullSchedule);
                trackEvent('emi_schedule_toggled', { show: !showFullSchedule });
              }}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Table className="w-4 h-4" />
              <span>{showFullSchedule ? 'إخفاء جدول السداد' : 'معاينة جدول السداد الشهري'}</span>
            </button>
          </div>

        </div>

        {/* Amortization Table */}
        {showFullSchedule && (
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-base flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>جدول استهلاك وسداد القرض (Amortization Schedule)</span>
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                إجمالي الأقساط: {calculations.schedule.length} قسط
              </span>
            </div>

            <div className="max-h-72 overflow-y-auto border border-gray-200 dark:border-gray-800 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 sticky top-0 font-bold border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-3">رقم القسط</th>
                    <th className="p-3">أصل المبلغ المدفوع</th>
                    <th className="p-3">الفائدة الشهرية</th>
                    <th className="p-3">الرصيد المتبقي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
                  {calculations.schedule.slice(0, 48).map((row) => (
                    <tr key={row.month} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-3 text-gray-500 dark:text-gray-400 font-bold">شهر {row.month}</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(row.principalPaid)}</td>
                      <td className="p-3 text-amber-600 dark:text-amber-400">{formatCurrency(row.interestPaid)}</td>
                      <td className="p-3 text-gray-700 dark:text-gray-300 font-bold">{formatCurrency(row.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {calculations.schedule.length > 48 && (
              <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
                تم عرض أول 48 شهراً لتسهيل المعاينة.
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

