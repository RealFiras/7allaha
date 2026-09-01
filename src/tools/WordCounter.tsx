import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Copy, 
  Trash2, 
  Download, 
  Sparkles, 
  Check, 
  Volume2, 
  BookOpen, 
  Layers 
} from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>(
    'أهلاً بك في منصة أدواتي! يمكنك تجربة هذا النص لحساب عدد الكلمات والأحرف بدقة، أو كتابة نصك الخاص لمعرفة الإحصاءات الفورية ووقت القراءة المقدر.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    if (!text.trim()) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        topWords: [] as Array<{ word: string; count: number }>,
      };
    }

    const charsWithSpaces = text.length;
    const charsNoSpaces = text.replace(/\s+/g, '').length;
    
    // Words count (splitting by whitespace and filtering empty)
    const wordsArray = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const words = wordsArray.length;

    // Sentences count (split by punctuation . ! ? ؟)
    const sentences = text.split(/[.!?؟]+/).filter((s) => s.trim().length > 0).length;

    // Paragraphs count (split by new lines)
    const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;

    // Reading time: avg 200 words/min
    const readingTimeMinutes = Math.ceil((words / 200) * 10) / 10;
    // Speaking time: avg 130 words/min
    const speakingTimeMinutes = Math.ceil((words / 130) * 10) / 10;

    // Top words density analysis (excluding tiny common words)
    const frequencyMap: Record<string, number> = {};
    const stopWords = new Set(['في', 'من', 'على', 'إلى', 'عن', 'هو', 'هي', 'أن', 'لا', 'ما', 'مع', 'هذا', 'هذه', 'كل', 'أو', 'ثم', 'كان', 'the', 'and', 'to', 'of', 'a', 'in', 'is', 'it']);

    wordsArray.forEach((raw) => {
      const clean = raw.replace(/[.,/#!$%^&*;:{}=\-_`~()؟،]/g, '').trim().toLowerCase();
      if (clean.length > 2 && !stopWords.has(clean)) {
        frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
      }
    });

    const topWords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({ word, count }));

    return {
      words,
      charsWithSpaces,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
      topWords,
    };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    trackToolUsage('word-counter', 'عداد الكلمات والحروف وتحليل النصوص', 'copy_text');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    trackEvent('word_counter_clear');
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adawaty-text.txt';
    a.click();
    URL.revokeObjectURL(url);
    trackToolUsage('word-counter', 'عداد الكلمات والحروف وتحليل النصوص', 'download_file');
  };

  // Text manipulation helpers
  const removeDiacritics = () => {
    const cleaned = text.replace(/[\u064B-\u065F\u0670]/g, '');
    setText(cleaned);
    trackToolUsage('word-counter', 'عداد الكلمات والحروف وتحليل النصوص', 'remove_diacritics');
  };

  const removeExtraSpaces = () => {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    setText(cleaned);
    trackToolUsage('word-counter', 'عداد الكلمات والحروف وتحليل النصوص', 'remove_spaces');
  };

  return (
    <div className="space-y-8">
      {/* Stats Header Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs text-center transition-colors">
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400 block">{stats.words}</span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">عدد الكلمات</span>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs text-center transition-colors">
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block">{stats.charsWithSpaces}</span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">أحرف (مع المسافات)</span>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs text-center transition-colors">
          <span className="text-3xl font-black text-gray-800 dark:text-gray-100 block">{stats.charsNoSpaces}</span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">أحرف (بدون مسافات)</span>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs text-center transition-colors">
          <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block">{stats.sentences}</span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">الجمل</span>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs text-center col-span-2 sm:col-span-1 transition-colors">
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 block">{stats.paragraphs}</span>
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">الفقرات</span>
        </div>
      </div>

      {/* Editor & Actions */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm p-6 sm:p-8 space-y-4 transition-colors">
        
        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={removeDiacritics}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              حذف التشكيل العربي
            </button>
            <button
              type="button"
              onClick={removeExtraSpaces}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              حذف المسافات الزائدة
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
              title="تنزيل كملف نصي"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
              title="مسح النص"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="الصق أو اكتب النص هنا لتحليله فورياً..."
          className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-100 leading-relaxed font-tajawal text-base sm:text-lg resize-y focus:outline-none"
        />

        {/* Reading & Speaking Time Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-blue-700 dark:text-blue-300 font-bold block">زمن القراءة الصامتة</span>
              <span className="text-base font-extrabold text-blue-950 dark:text-blue-100">
                {stats.readingTimeMinutes} دقيقة قراءة تقريباً
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold block">زمن الإلقاء الصوتي</span>
              <span className="text-base font-extrabold text-emerald-950 dark:text-emerald-100">
                {stats.speakingTimeMinutes} دقيقة إلقاء تقريباً
              </span>
            </div>
          </div>
        </div>

        {/* Keyword Frequency Density */}
        {stats.topWords.length > 0 && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-2.5">
              الكلمات الأكثر تكراراً وكثافة في النص:
            </span>
            <div className="flex flex-wrap gap-2">
              {stats.topWords.map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <span>"{item.word}"</span>
                  <span className="bg-blue-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

