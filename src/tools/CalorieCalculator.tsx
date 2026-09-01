import React, { useState } from 'react';
import { Flame, Activity, Sparkles, Copy, Check, Info, Target, PieChart, RotateCcw } from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

export const CalorieCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('28');
  const [height, setHeight] = useState<string>('175');
  const [weight, setWeight] = useState<string>('75');
  const [activityLevel, setActivityLevel] = useState<number>(1.55); // Moderate
  const [goal, setGoal] = useState<number>(0); // 0 = maintain, -500 = fat loss, +500 = muscle gain
  const [copied, setCopied] = useState(false);

  const numAge = parseFloat(age) || 0;
  const numHeight = parseFloat(height) || 0;
  const numWeight = parseFloat(weight) || 0;

  // Mifflin-St Jeor equation
  // Men: BMR = 10W + 6.25H - 5A + 5
  // Women: BMR = 10W + 6.25H - 5A - 161
  let bmr = 0;
  if (numWeight > 0 && numHeight > 0 && numAge > 0) {
    if (gender === 'male') {
      bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge + 5;
    } else {
      bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge - 161;
    }
  }

  const tdee = Math.round(bmr * activityLevel);
  const targetCalories = Math.max(1200, Math.round(tdee + goal));

  // Macronutrient split (Balanced: 30% Protein, 40% Carbs, 30% Fat)
  const proteinCalories = targetCalories * 0.30;
  const carbsCalories = targetCalories * 0.40;
  const fatCalories = targetCalories * 0.30;

  const proteinGrams = Math.round(proteinCalories / 4);
  const carbsGrams = Math.round(carbsCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  const handleCopy = () => {
    const text = `نتائج حاسبة السعرات الحرارية من أدواتي:\nمعدل الأيض الأساسي (BMR): ${Math.round(bmr)} سعرة\nسعرات ثبات الوزن (TDEE): ${tdee} سعرة\nالسعرات المستهدفة للهدف: ${targetCalories} سعرة/يوم\nالماكروز اليومية:\n- بروتين: ${proteinGrams} غرام (${Math.round(proteinCalories)} سعرة)\n- كربوهيدرات: ${carbsGrams} غرام (${Math.round(carbsCalories)} سعرة)\n- دهون صحية: ${fatGrams} غرام (${Math.round(fatCalories)} سعرة)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    trackToolUsage('calorie-calculator', 'حاسبة السعرات الحرارية اليومية', 'copy_result');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Panel */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
                بيانات الجسم والنشاط اليومي
              </h2>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">الجنس:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                  gender === 'male'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                ذكر
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                  gender === 'female'
                    ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                }`}
              >
                أنثى
              </button>
            </div>
          </div>

          {/* Age, Height, Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                العمر (بالسنوات):
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="10"
                max="100"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                الطول (سم):
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="80"
                max="250"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                الوزن (كجم):
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="30"
                max="300"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-sm"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              مستوى النشاط الحركي والرياضي:
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-xs cursor-pointer"
            >
              <option value="1.2">خامل / مكتبي (قليل أو بدون تمرين)</option>
              <option value="1.375">نشاط خفيف (تمرين 1 - 3 أيام بالأسبوع)</option>
              <option value="1.55">نشاط متوسط (تمرين 3 - 5 أيام بالأسبوع)</option>
              <option value="1.725">نشاط عالي (تمرين شاق 6 - 7 أيام بالأسبوع)</option>
              <option value="1.9">نشاط فائق (رياضي محترف / عمل بدني شاق)</option>
            </select>
          </div>

          {/* Target Goal */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
              هدفك البدني الحالي:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { label: 'خسارة دهون (-500 سعرة)', value: -500, color: 'hover:border-red-500' },
                { label: 'ثبات الوزن (TDEE)', value: 0, color: 'hover:border-blue-500' },
                { label: 'بناء عضلات (+400 سعرة)', value: 400, color: 'hover:border-emerald-500' },
              ].map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGoal(g.value)}
                  className={`p-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${
                    goal === g.value
                      ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-7 shadow-sm space-y-6 transition-colors">
            <div className="space-y-1 text-center sm:text-right">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                السعرات الحرارية اليومية المستهدفة
              </span>
              <div className="text-4xl font-black text-orange-600 dark:text-orange-400">
                {targetCalories.toLocaleString('ar-SA')}{' '}
                <span className="text-base font-bold text-gray-500 dark:text-gray-400">سعرة / يوم</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-[11px] font-bold text-gray-400 block">معدل الأيض الأساسي BMR</span>
                <span className="text-base font-extrabold text-gray-900 dark:text-white">
                  {Math.round(bmr).toLocaleString('ar-SA')} سعرة
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                <span className="text-[11px] font-bold text-gray-400 block">سعرات ثبات الوزن TDEE</span>
                <span className="text-base font-extrabold text-gray-900 dark:text-white">
                  {tdee.toLocaleString('ar-SA')} سعرة
                </span>
              </div>
            </div>

            {/* Macronutrients Breakdown */}
            <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-gray-900 dark:text-white">
                  توزيع الماكروز المقترح (Macros)
                </span>
                <span className="text-gray-400 text-[11px]">30% بروتين | 40% كارب | 30% دهون</span>
              </div>

              {/* Progress bar visualizer */}
              <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden flex">
                <div style={{ width: '30%' }} className="bg-blue-500" title="بروتين 30%" />
                <div style={{ width: '40%' }} className="bg-amber-500" title="كربوهيدرات 40%" />
                <div style={{ width: '30%' }} className="bg-emerald-500" title="دهون صحية 30%" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200 dark:border-blue-900">
                  <span className="text-blue-700 dark:text-blue-300 font-bold block">بروتين</span>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{proteinGrams} غ</span>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900">
                  <span className="text-amber-700 dark:text-amber-300 font-bold block">كارب</span>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{carbsGrams} غ</span>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                  <span className="text-emerald-700 dark:text-emerald-300 font-bold block">دهون</span>
                  <span className="text-sm font-black text-gray-900 dark:text-white">{fatGrams} غ</span>
                </div>
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم نسخ التقرير!' : 'نسخ ملخص السعرات والماكروز'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
