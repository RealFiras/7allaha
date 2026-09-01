import React, { useState, useEffect } from 'react';
import { 
  Binary, 
  ArrowLeftRight, 
  Copy, 
  Check, 
  Trash2, 
  Upload, 
  Download, 
  FileText, 
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [textMode, setTextMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState<string>('مرحباً بك في موقع أدواتي! أداة تشفير وفك تشفير سريعة وآمنة.');
  const [outputText, setOutputText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // File to Base64 state
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Safe UTF-8 Base64 Encoder (supports Arabic and special characters)
  const utf8ToBase64 = (str: string): string => {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  };

  // Safe UTF-8 Base64 Decoder (supports Arabic and special characters)
  const base64ToUtf8 = (str: string): string => {
    const cleanStr = str.trim().replace(/\s+/g, '');
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(cleanStr), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  };

  const processText = (text: string, currentMode: 'encode' | 'decode') => {
    if (!text.trim()) {
      setOutputText('');
      setError(null);
      return;
    }

    try {
      if (currentMode === 'encode') {
        const encoded = utf8ToBase64(text);
        setOutputText(encoded);
        setError(null);
      } else {
        const decoded = base64ToUtf8(text);
        setOutputText(decoded);
        setError(null);
      }
    } catch (err: any) {
      setError('تعذر فك التشفير: تأكد من أن النص المدخل يمثل كود Base64 صالحاً وسليماً');
      setOutputText('');
    }
  };

  // Initial calculation on mount
  useEffect(() => {
    processText(inputText, textMode);
  }, []);

  const handleInputChange = (val: string) => {
    setInputText(val);
    processText(val, textMode);
  };

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setTextMode(newMode);
    processText(inputText, newMode);
  };

  const handleSwap = () => {
    const newMode = textMode === 'encode' ? 'decode' : 'encode';
    const nextInput = outputText || inputText;
    setTextMode(newMode);
    setInputText(nextInput);
    processText(nextInput, newMode);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  const handleSample = (sample: string) => {
    setInputText(sample);
    processText(sample, textMode);
  };

  const handleFileProcess = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('حجم الملف كبير جداً، الحد الأقصى الموصى به هو 10 ميجابايت');
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');
    setFileType(file.type || 'ملف غير معروف');
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.onerror = () => {
      setError('حدث خطأ أثناء قراءة الملف');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = textMode === 'encode' ? 'encoded-base64.txt' : 'decoded-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-700 shadow-xs p-6 sm:p-8 space-y-6">
        
        {/* Header Title & Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Binary className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                أداة تشفير وفك تشفير Base64
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              دعم كامل للغة العربية UTF-8 مع تحويل الصور والملفات محلياً 100%
            </p>
          </div>

          {/* Mode Navigation Pills */}
          <div className="flex items-center p-1 bg-gray-100/80 dark:bg-slate-800 rounded-2xl border border-gray-200/60 dark:border-slate-700 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'text'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              نصوص UTF-8
            </button>
            <button
              type="button"
              onClick={() => setMode('file')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'file'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              صور وملفات
            </button>
          </div>
        </div>

        {/* MODE 1: Text Encode & Decode */}
        {mode === 'text' && (
          <div className="space-y-6">
            
            {/* Action Bar (Encode / Decode / Swap / Clear) */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-gray-200/60 dark:border-slate-700">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleModeChange('encode')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    textMode === 'encode'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700/70'
                  }`}
                >
                  تشفير (Encode to Base64)
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('decode')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    textMode === 'decode'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700/70'
                  }`}
                >
                  فك التشفير (Decode to Text)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:text-blue-600 border border-gray-200 dark:border-slate-600 hover:border-blue-200 transition-colors flex items-center gap-1.5 shadow-xs"
                  title="استبدال النص الناتج ليصبح في صندوق الإدخال"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>عكس المدخل والمخرج</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                  title="مسح الصناديق"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Samples for Convenience */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>نماذج سريعة:</span>
              </span>
              <button
                type="button"
                onClick={() => handleSample('أهلاً بالعالم! تحويل فوري بدعم كامل للغة العربية.')}
                 className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/70 hover:text-blue-600 text-gray-600 dark:text-slate-300 font-medium transition-colors border border-gray-200/50 dark:border-slate-600"
              >
                نص عربي
              </button>
              <button
                type="button"
                onClick={() => handleSample('{"user": "Adawaty", "status": "active", "code": 200}')}
                 className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/70 hover:text-blue-600 text-gray-600 dark:text-slate-300 font-medium transition-colors border border-gray-200/50 dark:border-slate-600"
              >
                كود JSON
              </button>
              <button
                type="button"
                onClick={() => handleSample('Hello World! Base64 UTF-8 Fast Encode.')}
                 className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/70 hover:text-blue-600 text-gray-600 dark:text-slate-300 font-medium transition-colors border border-gray-200/50 dark:border-slate-600"
              >
                English Text
              </button>
            </div>

            {/* Dual Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Input Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <span>{textMode === 'encode' ? '1. النص المدخل (نص عادي أو عربي):' : '1. كود Base64 المراد فكه:'}</span>
                  </label>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {inputText.length} حرف
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={inputText}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={textMode === 'encode' ? 'اكتب أو الصق أي نص هنا للتشفير الفوري...' : 'الصق شفرة Base64 هنا لفك التشفير...'}
                  dir={textMode === 'decode' ? 'ltr' : 'auto'}
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 text-gray-800 dark:text-slate-100 text-sm font-tajawal focus:outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-slate-500 bg-gray-50/50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              {/* Output Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <span>{textMode === 'encode' ? '2. النتيجة المشفرة (Base64 Output):' : '2. النص الأصلي المسترجع:'}</span>
                  </label>
                  {outputText && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(outputText)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadText}
                        className="text-xs text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 font-bold flex items-center gap-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 px-2 py-1 rounded-lg transition-colors"
                        title="تحميل كملف نصي"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <textarea
                  rows={8}
                  readOnly
                  value={outputText}
                  dir={textMode === 'encode' ? 'ltr' : 'auto'}
                  placeholder="ستظهر النتيجة الفورية هنا بمجرد الكتابة..."
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-800/60 text-gray-800 dark:text-slate-100 text-sm font-mono focus:outline-none select-all"
                />
              </div>

            </div>

            {/* Error Message banner */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

          </div>
        )}

        {/* MODE 2: File & Image to Base64 */}
        {mode === 'file' && (
          <div className="space-y-6">
            
            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all relative cursor-pointer ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
                   : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 bg-gray-50/60 dark:bg-slate-800/60 hover:bg-blue-50/20'
              }`}
            >
              <input
                type="file"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3 max-w-sm mx-auto pointer-events-none">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  اسحب أي ملف هنا أو انقر للتصفح من جهازك
                </h3>
                <p className="text-xs text-gray-500 font-normal">
                  يدعم جميع أنواع الملفات: الصور (PNG, JPG, SVG, WebP, GIF)، المستندات (PDF, TXT)، الأيقونات والخطوط.
                </p>
              </div>
            </div>

            {/* File Converted Results */}
            {fileBase64 && (
              <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-slate-800 animate-in fade-in duration-200">
                
                {/* File Meta Pill */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-gray-200/70 dark:border-slate-700">
                  <div>
                    <span className="text-gray-400 block mb-0.5">اسم الملف:</span>
                    <strong className="text-gray-800 dark:text-slate-100 font-bold truncate block">{fileName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">الحجم الأصلي:</span>
                    <strong className="text-gray-800 dark:text-slate-100 font-bold">{fileSize}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">نوع الامتداد (MIME):</span>
                    <strong className="text-gray-800 dark:text-slate-100 font-mono font-bold truncate block">{fileType}</strong>
                  </div>
                </div>

                {/* Image Preview Box */}
                {fileType.startsWith('image/') && (
                  <div className="text-center p-6 bg-gray-50/80 dark:bg-slate-800/60 rounded-2xl border border-gray-200/60 dark:border-slate-700 max-w-md mx-auto space-y-2">
                    <img
                      src={fileBase64}
                      alt="معاينة الصورة"
                      className="max-h-48 max-w-full mx-auto rounded-xl shadow-xs border border-gray-200 dark:border-slate-700 bg-white"
                    />
                    <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium block">
                      معاينة الصورة المضمنة مباشرة من كود الـ Base64
                    </span>
                  </div>
                )}

                {/* Base64 Data URL Output */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700 dark:text-slate-200">
                      كود Base64 Data URL الكامل (جاهز للاستخدام في HTML و CSS):
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopy(fileBase64)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'تم نسخ الكود!' : 'نسخ كود Base64'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    readOnly
                    value={fileBase64}
                    dir="ltr"
                    className="w-full p-4 font-mono text-xs bg-gray-900 text-emerald-400 rounded-2xl border border-gray-800 select-all focus:outline-none"
                  />
                </div>

                {/* HTML & CSS Snippets */}
                {fileType.startsWith('image/') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200/60 dark:border-slate-700 space-y-1">
                      <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400">كود HTML المضمن:</span>
                      <code className="text-[11px] font-mono text-blue-600 block truncate" dir="ltr">
                        {`<img src="${fileBase64.slice(0, 45)}..." alt="Adawaty Image" />`}
                      </code>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200/60 dark:border-slate-700 space-y-1">
                      <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400">كود CSS Background:</span>
                      <code className="text-[11px] font-mono text-emerald-600 block truncate" dir="ltr">
                        {`background-image: url("${fileBase64.slice(0, 45)}...");`}
                      </code>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
