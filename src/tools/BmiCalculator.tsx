import React, { useState } from 'react';
import { Activity, RotateCcw, Check, HeartPulse, Info, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackToolUsage } from '../lib/analytics';

export const BmiCalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('175');
  const [weight, setWeight] = useState<string>('70');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('28');
  
  const [bmiResult, setBmiResult] = useState<{
    bmi: number;
    category: string;
    categoryColor: string;
    badgeBg: string;
    minIdealWeight: number;
    maxIdealWeight: number;
    weightDiff: number;
    healthTip: string;
  } | null>(null);

  const calculateBmi = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) return;

    const heightInMeters = h / 100;
    const bmiValue = w / (heightInMeters * heightInMeters);
    const roundedBmi = parseFloat(bmiValue.toFixed(1));

    // Ideal weight range for this height (BMI between 18.5 and 24.9)
    const minIdeal = parseFloat((18.5 * heightInMeters * heightInMeters).toFixed(1));
    const maxIdeal = parseFloat((24.9 * heightInMeters * heightInMeters).toFixed(1));

    let category = '';
    let categoryColor = 'text-emerald-600 dark:text-emerald-400';
    let badgeBg = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    let healthTip = '';
    let diff = 0;

    if (roundedBmi < 18.5) {
      category = 'نقص في الوزن (نحافة)';
      categoryColor = 'text-sky-600 dark:text-sky-400';
      badgeBg = 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
      diff = minIdeal - w;
      healthTip = `أنت بحاجة لكسب حوالي ${diff.toFixed(1)} كجم للوصول للنطاق الصحي المعتمد. ركز على الأطعمة الغنية بالبروتين والسعرات الصحية كالمكسرات وزيت الزيتون.`;
    } else if (roundedBmi <= 24.9) {
      category = 'وزن مثالي وصحي';
      categoryColor = 'text-emerald-600 dark:text-emerald-400';
      badgeBg = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      diff = 0;
      healthTip = 'ممتاز! وزنك مثالي ومتناسق مع طولك. حافظ على نشاطك البدني ونظامك الغذائي المتوازن.';
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } else if (roundedBmi <= 29.9) {
      category = 'زيادة في الوزن';
      categoryColor = 'text-amber-600 dark:text-amber-400';
      badgeBg = 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      diff = w - maxIdeal;
      healthTip = `يُفضل إنقاص حوالي ${diff.toFixed(1)} كجم للوصول للوزن المثالي. قلل من السكريات والمشروبات الغازية وامشِ 30 دقيقة يومياً.`;
    } else if (roundedBmi <= 34.9) {
      category = 'سمنة من الدرجة الأولى';
      categoryColor = 'text-orange-600 dark:text-orange-400';
      badgeBg = 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-800';
      diff = w - maxIdeal;
      healthTip = `ينصح باستشارة أخصائي تغذية لوضع خطة حمية مريحة لإنقاص ${diff.toFixed(1)} كجم تدريجياً لتقليل مخاطر ارتفاع ضغط الدم والسكري.`;
    } else {
      category = 'سمنة مفرطة (درجة متقدمة)';
      categoryColor = 'text-red-600 dark:text-red-400';
      badgeBg = 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800';
      diff = w - maxIdeal;
      healthTip = `من المهم مراجعة الطبيب للحفاظ على صحة القلب والمفاصل والبدء ببرنامج متكامل لتخفيف الوزن تحت إشراف طبي.`;
    }

    setBmiResult({
      bmi: roundedBmi,
      category,
      categoryColor,
      badgeBg,
      minIdealWeight: minIdeal,
      maxIdealWeight: maxIdeal,
      weightDiff: parseFloat(Math.abs(diff).toFixed(1)),
      healthTip,
    });

    trackToolUsage('bmi-calculator', 'حاسبة كتلة الجسم (BMI)', 'calculate');
  };

  const handleReset = () => {
    setHeight('175');
    setWeight('70');
    setAge('28');
    setBmiResult(null);
  };

  // Calculate pointer position on gauge (0 to 100%)
  const calculateGaugePosition = (bmi: number) => {
    const min = 15;
    const max = 40;
    const clamped = Math.min(Math.max(bmi, min), max);
    return ((clamped - min) / (max - min)) * 100;
  };

  return (
    <div className="space-y-8">
      {/* Tool Interactive Form Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm p-6 sm:p-8 transition-colors">
        <form onSubmit={calculateBmi} className="space-y-6">
          
          {/* Gender Selector */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`p-3 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                gender === 'male'
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 shadow-xs'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span>👨 ذكر</span>
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`p-3 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                gender === 'female'
                  ? 'border-pink-600 bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 shadow-xs'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span>👩 أنثى</span>
            </button>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Height */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                الطول (سنتيمتر) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  max="250"
                  step="0.5"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="مثال: 175"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white font-semibold text-lg"
                />
                <span className="absolute left-3 top-3.5 text-xs text-gray-400 font-bold">سم</span>
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                الوزن (كيلوجرام) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="20"
                  max="300"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="مثال: 70"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white font-semibold text-lg"
                />
                <span className="absolute left-3 top-3.5 text-xs text-gray-400 font-bold">كجم</span>
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                العمر (سنوات)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="مثال: 28"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white font-semibold text-lg"
                />
                <span className="absolute left-3 top-3.5 text-xs text-gray-400 font-bold">سنة</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-base shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Activity className="w-5 h-5" />
              <span>احسب مؤشر كتلة الجسم الآن</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-3.5 px-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة ضبط</span>
            </button>
          </div>
        </form>

        {/* Results Panel */}
        {bmiResult && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200 space-y-6">
            
            {/* Header Result Card */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-right space-y-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  مؤشر كتلة جسمك (BMI)
                </span>
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">
                    {bmiResult.bmi}
                  </span>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">كجم/م²</span>
                </div>
                <div className="inline-block px-3 py-1 rounded-full border text-sm font-bold mt-1">
                  <span className={bmiResult.categoryColor}>
                    {bmiResult.category}
                  </span>
                </div>
              </div>

              {/* Ideal Weight Box */}
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 text-center sm:text-right w-full md:w-auto min-w-[240px]">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                  الوزن المثالي لطولك ({height} سم)
                </span>
                <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 block">
                  {bmiResult.minIdealWeight} - {bmiResult.maxIdealWeight} كجم
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                  نطاق صحي وفق معايير منظمة الصحة
                </span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 px-1">
                <span>نحافة (أقل من 18.5)</span>
                <span>مثالي (18.5 - 24.9)</span>
                <span>زيادة وزن (25 - 29.9)</span>
                <span>سمنة (30+)</span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="relative h-4 rounded-full overflow-hidden flex shadow-inner">
                <div className="w-[14%] bg-sky-400" title="نحافة" />
                <div className="w-[26%] bg-emerald-500" title="مثالي" />
                <div className="w-[20%] bg-amber-400" title="زيادة وزن" />
                <div className="w-[40%] bg-red-500" title="سمنة" />
              </div>

              {/* Indicator Arrow */}
              <div className="relative h-6">
                <div
                  className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
                  style={{ left: `${calculateGaugePosition(bmiResult.bmi)}%` }}
                >
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-gray-900 dark:border-b-white" />
                  <span className="text-[11px] font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded shadow-xs border border-gray-200 dark:border-gray-700">
                    أنت هنا ({bmiResult.bmi})
                  </span>
                </div>
              </div>
            </div>

            {/* Health Tip Box */}
            <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4 flex items-start gap-3">
              <HeartPulse className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-tajawal">
                <strong className="text-gray-900 dark:text-white block mb-0.5">التوصية الصحية المخصصة لك:</strong>
                {bmiResult.healthTip}
              </div>
            </div>

            {/* WHO Standard Classification Reference Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold">
                  <tr>
                    <th className="p-2.5">التصنيف الصحي</th>
                    <th className="p-2.5">نطاق مؤشر BMI</th>
                    <th className="p-2.5">تقييم المخاطر الصحية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr className={bmiResult.bmi < 18.5 ? 'bg-sky-50 dark:bg-sky-950/50 font-bold' : ''}>
                    <td className="p-2.5 text-sky-700 dark:text-sky-400">نقص في الوزن (نحافة)</td>
                    <td className="p-2.5">أقل من 18.5</td>
                    <td className="p-2.5">احتمال نقص مناعة أو فقر دم</td>
                  </tr>
                  <tr className={bmiResult.bmi >= 18.5 && bmiResult.bmi <= 24.9 ? 'bg-emerald-50 dark:bg-emerald-950/50 font-bold' : ''}>
                    <td className="p-2.5 text-emerald-700 dark:text-emerald-400">وزن طبيعي ومثالي</td>
                    <td className="p-2.5">18.5 – 24.9</td>
                    <td className="p-2.5">أقل مخاطر صحية موصى به</td>
                  </tr>
                  <tr className={bmiResult.bmi >= 25 && bmiResult.bmi <= 29.9 ? 'bg-amber-50 dark:bg-amber-950/50 font-bold' : ''}>
                    <td className="p-2.5 text-amber-700 dark:text-amber-400">وزن زائد</td>
                    <td className="p-2.5">25.0 – 29.9</td>
                    <td className="p-2.5">ارتفاع طفيف في مخاطر القلب</td>
                  </tr>
                  <tr className={bmiResult.bmi >= 30 ? 'bg-red-50 dark:bg-red-950/50 font-bold' : ''}>
                    <td className="p-2.5 text-red-700 dark:text-red-400">سمنة (درجة 1، 2، 3)</td>
                    <td className="p-2.5">30.0 فأكثر</td>
                    <td className="p-2.5">مخاطر مرتفعة تتطلب متابعة</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

