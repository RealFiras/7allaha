import React, { useState, useMemo } from 'react';
import { GitCompare, Columns, List, Trash2, ArrowLeftRight, Check, Sparkles } from 'lucide-react';

const SAMPLE_TEXT_1 = `منصة أدواتي هي موقع رائع للأدوات المجانية.
توفر حاسبة كتلة الجسم BMI.
توفر محول عملات بأسعار قديمة.
جميع الأدوات سريعة ومجانية للمستخدمين.`;

const SAMPLE_TEXT_2 = `منصة أدواتي هي المنصة العربية الأولى للأدوات المجانية.
توفر حاسبة كتلة الجسم BMI والوزن المثالي.
توفر محول عملات بأسعار حية ومحدثة لحظياً.
توفر أيضاً أدوات أمان وتشفير متقدمة.
جميع الأدوات سريعة ومجانية وتعمل بدون تسجيل.`;

interface DiffLine {
  type: 'same' | 'added' | 'removed' | 'changed';
  leftText?: string;
  rightText?: string;
  leftLineNum?: number;
  rightLineNum?: number;
}

export const TextDiffTool: React.FC = () => {
  const [leftText, setLeftText] = useState<string>(SAMPLE_TEXT_1);
  const [rightText, setRightText] = useState<string>(SAMPLE_TEXT_2);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  const diffResult = useMemo(() => {
    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');
    const maxLen = Math.max(leftLines.length, rightLines.length);

    const lines: DiffLine[] = [];
    let addedCount = 0;
    let removedCount = 0;
    let modifiedCount = 0;

    for (let i = 0; i < maxLen; i++) {
      const l = leftLines[i];
      const r = rightLines[i];

      if (l === undefined) {
        // Line added on right
        lines.push({
          type: 'added',
          rightText: r,
          rightLineNum: i + 1,
        });
        addedCount++;
      } else if (r === undefined) {
        // Line removed from right
        lines.push({
          type: 'removed',
          leftText: l,
          leftLineNum: i + 1,
        });
        removedCount++;
      } else if (l === r) {
        // Exactly same
        lines.push({
          type: 'same',
          leftText: l,
          rightText: r,
          leftLineNum: i + 1,
          rightLineNum: i + 1,
        });
      } else {
        // Modified line
        lines.push({
          type: 'changed',
          leftText: l,
          rightText: r,
          leftLineNum: i + 1,
          rightLineNum: i + 1,
        });
        modifiedCount++;
      }
    }

    return {
      lines,
      addedCount,
      removedCount,
      modifiedCount,
    };
  }, [leftText, rightText]);

  const handleSwap = () => {
    const temp = leftText;
    setLeftText(rightText);
    setRightText(temp);
  };

  const handleLoadSample = () => {
    setLeftText(SAMPLE_TEXT_1);
    setRightText(SAMPLE_TEXT_2);
  };

  const handleClear = () => {
    setLeftText('');
    setRightText('');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'split'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>عرض منفصل (جنباً إلى جنب)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'unified'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>عرض مدمج موحد</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSwap}
              className="px-2.5 py-1.5 text-xs text-blue-600 hover:bg-blue-50 font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>تبديل النصين</span>
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 font-bold rounded-lg transition-colors"
            >
              نموذج تجريبي
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="مسح الحقول"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              النص الأصلي (النسخة 1)
            </label>
            <textarea
              rows={6}
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              placeholder="ضع النص الأصلي هنا..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm font-tajawal leading-relaxed resize-y focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              النص المعدل (النسخة 2)
            </label>
            <textarea
              rows={6}
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              placeholder="ضع النص المعدل هنا لمقارنته..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 text-sm font-tajawal leading-relaxed resize-y focus:outline-none"
            />
          </div>
        </div>

        {/* Stats Pill bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-xs font-bold text-slate-500">إحصائيات الفروقات:</span>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
            +{diffResult.addedCount} أسطر مضافة
          </span>
          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold">
            -{diffResult.removedCount} أسطر محذوفة
          </span>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold">
            ~{diffResult.modifiedCount} أسطر معدلة
          </span>
        </div>

        {/* Difference Visualizer Display */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-700 block">
            معاينة المقارنة الملونة:
          </span>

          {viewMode === 'split' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border border-slate-200 rounded-xl overflow-hidden text-xs font-tajawal">
              {/* Left Column (Original) */}
              <div className="divide-y divide-slate-100 bg-slate-50/50">
                <div className="p-2 bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  الأصل (النسخة السابقة)
                </div>
                {diffResult.lines.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2 min-h-[34px] flex items-start gap-2 ${
                      item.type === 'removed'
                        ? 'bg-rose-100/70 text-rose-900 line-through'
                        : item.type === 'changed'
                        ? 'bg-amber-50 text-amber-900'
                        : 'text-slate-700'
                    }`}
                  >
                    <span className="w-5 text-slate-400 font-mono text-[10px] select-none text-left">
                      {item.leftLineNum || ''}
                    </span>
                    <span className="flex-1">{item.leftText || ''}</span>
                  </div>
                ))}
              </div>

              {/* Right Column (Modified) */}
              <div className="divide-y divide-slate-100 bg-white">
                <div className="p-2 bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  المعدل (النسخة الحالية)
                </div>
                {diffResult.lines.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2 min-h-[34px] flex items-start gap-2 ${
                      item.type === 'added'
                        ? 'bg-emerald-100/70 text-emerald-900 font-semibold'
                        : item.type === 'changed'
                        ? 'bg-blue-50 text-blue-900 font-semibold'
                        : 'text-slate-700'
                    }`}
                  >
                    <span className="w-5 text-slate-400 font-mono text-[10px] select-none text-left">
                      {item.rightLineNum || ''}
                    </span>
                    <span className="flex-1">{item.rightText || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Unified view */
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs font-tajawal">
              {diffResult.lines.map((item, idx) => {
                if (item.type === 'added') {
                  return (
                    <div key={idx} className="p-2.5 bg-emerald-50 text-emerald-900 flex items-center gap-2">
                      <span className="text-emerald-600 font-bold font-mono">+</span>
                      <span>{item.rightText}</span>
                    </div>
                  );
                }
                if (item.type === 'removed') {
                  return (
                    <div key={idx} className="p-2.5 bg-rose-50 text-rose-900 line-through flex items-center gap-2">
                      <span className="text-rose-600 font-bold font-mono">-</span>
                      <span>{item.leftText}</span>
                    </div>
                  );
                }
                if (item.type === 'changed') {
                  return (
                    <div key={idx} className="p-2.5 bg-amber-50 space-y-1">
                      <div className="text-rose-800 line-through flex items-center gap-2">
                        <span className="font-bold text-rose-500">-</span>
                        <span>{item.leftText}</span>
                      </div>
                      <div className="text-emerald-800 font-semibold flex items-center gap-2">
                        <span className="font-bold text-emerald-500">+</span>
                        <span>{item.rightText}</span>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="p-2.5 bg-white text-slate-700 flex items-center gap-2">
                    <span className="text-slate-300 font-mono"> </span>
                    <span>{item.leftText}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
