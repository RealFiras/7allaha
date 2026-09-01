import React, { useState, useRef } from 'react';
import { 
  Eraser, 
  Upload, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  Palette,
  Check
} from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import { trackToolUsage, trackEvent } from '../lib/analytics';

export const BackgroundRemover: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bgMode, setBgMode] = useState<'transparent' | 'white' | 'black' | 'custom'>('transparent');
  const [customBgColor, setCustomBgColor] = useState<string>('#3B82F6');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('يرجى اختيار ملف صورة صالح (PNG, JPG, WebP).');
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);

    const origUrl = URL.createObjectURL(file);
    setOriginalUrl(origUrl);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setIsLoading(true);
    setProgressStatus('جاري تحميل وتجهيز نموذج الذكاء الاصطناعي (AI)...');

    trackEvent('bg_remover_started', { size: file.size, type: file.type });

    try {
      // Run client-side background removal using WASM/ONNX in browser
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            const percent = Math.round((current / total) * 100);
            setProgressStatus(`جاري معالجة الصورة وتحميل النموذج (${percent}%)...`);
          } else {
            setProgressStatus('جاري عزل العناصر بدقة الذكاء الاصطناعي...');
          }
        },
      });

      const url = URL.createObjectURL(blob);
      setProcessedBlob(blob);
      setProcessedUrl(url);
      setIsLoading(false);
      setProgressStatus('');

      trackToolUsage('background-remover', 'إزالة خلفية الصور بالذكاء الاصطناعي', 'processed');
    } catch (err: any) {
      console.error('Background removal error:', err);
      setIsLoading(false);
      setErrorMsg(
        'حدث تعذر أثناء معالجة الصورة في المتصفح. تأكد من أن المتصفح يدعم WebAssembly / WebGL، أو جرب صورة أخرى.'
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImage(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
    if (!processedBlob || !selectedFile) return;

    // If bgMode is transparent, download processedBlob directly
    if (bgMode === 'transparent') {
      const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'image';
      const filename = `${baseName}-no-bg.png`;

      const link = document.createElement('a');
      link.href = processedUrl || URL.createObjectURL(processedBlob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      trackToolUsage('background-remover', 'إزالة خلفية الصور', 'download');
      return;
    }

    // If user chose a solid background color, draw it on canvas first
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let fill = '#FFFFFF';
      if (bgMode === 'black') fill = '#000000';
      else if (bgMode === 'custom') fill = customBgColor;

      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'image';
        const filename = `${baseName}-${bgMode}-bg.png`;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        trackToolUsage('background-remover', 'إزالة خلفية الصور', 'download_solid_bg');
      }, 'image/png');
    };
    img.src = processedUrl!;
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setSelectedFile(null);
    setOriginalUrl(null);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setErrorMsg(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors space-y-8" id="background-remover-tool">
      
      {/* Step 1: Upload Zone */}
      {!selectedFile ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 dark:hover:border-violet-400 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all hover:bg-violet-50/40 dark:hover:bg-violet-950/20 group space-y-4"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto shadow-xs group-hover:scale-110 transition-transform">
            <Eraser className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              اسحب وأفلت الصورة هنا، أو انقر للاختيار من جهازك
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              عزل فوري للخلفية بالذكاء الاصطناعي بدقة متناهية للأشخاص والمنتجات والسيارات. مجاني 100% وبدون حد أقصى للاستخدام وبخصوصية تامة داخل متصفحك.
            </p>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-teal-600 hover:from-violet-700 hover:to-teal-700 text-white font-bold text-sm shadow-xs transition-all">
            <Sparkles className="w-4 h-4" />
            <span>اختر صورة لبدء إزالة الخلفية</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                <Eraser className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 dark:text-slate-500 block font-semibold">الصورة قيد المعالجة</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs block">
                  {selectedFile.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                تغيير الصورة
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                حذف
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0])}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Loading Indicator with Model Notice */}
          {isLoading && (
            <div className="p-8 sm:p-12 bg-gradient-to-br from-violet-50/50 via-white to-teal-50/50 dark:from-violet-950/30 dark:via-slate-900 dark:to-teal-950/30 rounded-3xl border border-violet-100 dark:border-violet-900/50 text-center space-y-4 shadow-sm animate-in fade-in">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-violet-200 dark:border-violet-900 animate-pulse"></div>
                <div className="w-16 h-16 rounded-full border-4 border-violet-600 border-t-transparent animate-spin flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {progressStatus || 'جاري معالجة الصورة وعزل الخلفية بالذكاء الاصطناعي...'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  ملاحظة: عند الاستخدام الأول قد يستغرق المتصفح ثوانٍ معدودة لتنزيل نموذج الذكاء الاصطناعي (AI Model) وتشغيله محلياً على كرت الشاشة لديك.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Processed Results View: Side-by-Side Comparison */}
          {processedUrl && !isLoading && (
            <div className="space-y-8 animate-in fade-in">
              
              {/* Background Style Options Bar */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    خلفية العرض والتنزيل:
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBgMode('transparent')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      bgMode === 'transparent'
                        ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>شفاف (PNG)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBgMode('white')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      bgMode === 'white'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>أبيض</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBgMode('black')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      bgMode === 'black'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>أسود</span>
                  </button>

                  <div className="flex items-center gap-1.5 pl-2 border-r border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setBgMode('custom')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        bgMode === 'custom'
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>لون مخصص</span>
                    </button>
                    {bgMode === 'custom' && (
                      <input
                        type="color"
                        value={customBgColor}
                        onChange={(e) => setCustomBgColor(e.target.value)}
                        className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-600 p-0"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Side-by-Side Before / After Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Before Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      الصورة الأصلية (قبل)
                    </span>
                  </div>

                  <div className="h-[320px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-3">
                    {originalUrl && (
                      <img
                        src={originalUrl}
                        alt="Original before removal"
                        className="max-h-[300px] w-auto max-w-full object-contain rounded-lg"
                      />
                    )}
                  </div>
                </div>

                {/* After Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      بدون خلفية (بعد المعالجة)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      PNG شفاف 100%
                    </span>
                  </div>

                  <div
                    className={`h-[320px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3 transition-colors ${
                      bgMode === 'transparent'
                        ? 'bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:16px_16px] dark:bg-[radial-gradient(#475569_1.5px,transparent_1.5px)] bg-slate-100 dark:bg-slate-950'
                        : bgMode === 'white'
                        ? 'bg-white'
                        : bgMode === 'black'
                        ? 'bg-black'
                        : ''
                    }`}
                    style={bgMode === 'custom' ? { backgroundColor: customBgColor } : undefined}
                  >
                    <img
                      src={processedUrl}
                      alt="Processed background removed"
                      className="max-h-[300px] w-auto max-w-full object-contain rounded-lg drop-shadow-md"
                    />
                  </div>
                </div>

              </div>

              {/* Download Action Banner */}
              <div className="p-6 bg-gradient-to-r from-violet-50 to-teal-50 dark:from-violet-950/40 dark:to-teal-950/40 rounded-3xl border border-violet-100/80 dark:border-violet-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-right">
                  <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    تم تفريغ الصورة بنجاح وبجودة فائقة
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    الصورة جاهزة للاستخدام في التصاميم، المتاجر الإلكترونية، العروض التقديمية، وشبكات التواصل.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-teal-600 hover:from-violet-700 hover:to-teal-700 active:scale-[0.99] text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل الصورة المفرغة (PNG)</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
