import React, { useState } from 'react';
import { Braces, Check, Copy, Trash2, Download, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';

const SAMPLE_JSON = `{
  "site": "أدواتي",
  "url": "https://adawaty.com",
  "isFree": true,
  "stats": {
    "totalTools": 14,
    "activeUsers": 50000,
    "categories": ["حاسبات", "تحويل", "نصوص", "أمان", "إسلاميات"]
  }
}`;

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_JSON);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(true);

  const formatJson = (spaces = 2) => {
    if (!input.trim()) {
      setError(null);
      setIsValid(true);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, spaces);
      setInput(formatted);
      setError(null);
      setIsValid(true);
    } catch (e: any) {
      setError(e.message || 'صيغة JSON غير صحيحة');
      setIsValid(false);
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setError(null);
      setIsValid(true);
    } catch (e: any) {
      setError(e.message || 'صيغة JSON غير صحيحة');
      setIsValid(false);
    }
  };

  const validateJson = () => {
    if (!input.trim()) {
      setError('الرجاء إدخال كود JSON أولاً');
      setIsValid(false);
      return;
    }
    try {
      JSON.parse(input);
      setError(null);
      setIsValid(true);
    } catch (e: any) {
      setError(e.message || 'صيغة JSON غير صحيحة');
      setIsValid(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInput(SAMPLE_JSON);
    setError(null);
    setIsValid(true);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-4">
        
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => formatJson(2)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Braces className="w-4 h-4" />
              <span>تنسيق وتجميل (2 Spaces)</span>
            </button>
            <button
              type="button"
              onClick={() => formatJson(4)}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              4 Spaces
            </button>
            <button
              type="button"
              onClick={minifyJson}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              ضغط (Minify)
            </button>
            <button
              type="button"
              onClick={validateJson}
              className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تدقيق وصحة الكود</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadSample}
              className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 font-bold rounded-lg transition-colors"
            >
              تحميل نموذج
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="p-2 text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-lg transition-colors"
              title="تنزيل كملف .json"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setInput('')}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="مسح الكود"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Validation Banner */}
        {error ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs font-bold text-red-700 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>خطأ في صياغة الـ JSON: {error}</span>
          </div>
        ) : isValid && input.trim() ? (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>كود JSON سليم وصحيح 100% (Valid JSON)</span>
          </div>
        ) : null}

        {/* JSON Editor */}
        <div className="relative">
          <textarea
            rows={14}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="الصق شفرة الـ JSON هنا..."
            dir="ltr"
            className="w-full p-4 font-mono text-sm leading-relaxed bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y selection:bg-blue-600"
          />
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
          <span>الحجم: {new Blob([input]).size} بايت</span>
          <span>ترميز UTF-8</span>
        </div>

      </div>
    </div>
  );
};
