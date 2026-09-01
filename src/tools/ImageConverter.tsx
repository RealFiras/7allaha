import React, { useState, useRef, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  RefreshCw, 
  FileCheck,
  ArrowLeftRight,
  Layers,
  Check
} from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

export const ImageConverter: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const [targetFormat, setTargetFormat] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [quality, setQuality] = useState<number>(85);
  const [resizeRatio, setResizeRatio] = useState<number>(100);

  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedSize, setProcessedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setSelectedFile(file);
    setOriginalSize(file.size);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new window.Image();
    img.onload = () => {
      setOriginalDimensions({ width: img.width, height: img.height });
    };
    img.src = url;
    trackEvent('image_converter_upload', { format: file.type, size: file.size });
  };

  // Convert & Compress whenever settings or selected file change
  useEffect(() => {
    if (!previewUrl || !selectedFile) return;

    let isMounted = true;
    setIsProcessing(true);

    const timer = setTimeout(() => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (!isMounted) return;
        const canvas = document.createElement('canvas');
        const scale = resizeRatio / 100;
        const targetWidth = Math.max(1, Math.round(img.width * scale));
        const targetHeight = Math.max(1, Math.round(img.height * scale));

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // If converting to JPEG, fill canvas with white background (to avoid black transparency)
        if (targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const q = quality / 100;
        canvas.toBlob(
          (blob) => {
            if (!isMounted) return;
            if (blob) {
              setProcessedSize(blob.size);
              const blobUrl = URL.createObjectURL(blob);
              setProcessedUrl(blobUrl);
            }
            setIsProcessing(false);
          },
          targetFormat,
          q
        );
      };
      img.src = previewUrl;
    }, 40);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [previewUrl, selectedFile, targetFormat, quality, resizeRatio]);

  const handleDownload = () => {
    if (!processedUrl || !selectedFile) return;
    const ext = targetFormat === 'image/webp' ? 'webp' : targetFormat === 'image/jpeg' ? 'jpg' : 'png';
    const originalBase = selectedFile.name.replace(/\.[^/.]+$/, '');
    const filename = `${originalBase}-converted.${ext}`;

    const a = document.createElement('a');
    a.href = processedUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    trackToolUsage('image-converter', 'تحويل صيغ الصور', 'download');
  };

  const savedBytes = Math.max(0, originalSize - processedSize);
  const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors space-y-8" id="image-converter-tool">
      {/* Upload Box */}
      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all hover:bg-teal-50/40 dark:hover:bg-teal-950/20 group space-y-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/bmp, image/svg+xml, image/gif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
            }}
          />
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto shadow-xs group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              اضغط لاختيار صورة أو اسحبها وأفلتها هنا
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              تحويل فوري بين PNG ⇄ JPG ⇄ WebP مع التحكم في الجودة والأبعاد. المعالجة والضغط تتم محلياً في متصفحك 100% بأقصى سرية وأمان.
            </p>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-all">
            <ArrowLeftRight className="w-4 h-4" />
            <span>اختر صورة لبدء التحويل</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 dark:text-slate-500 block font-semibold">الصورة الأصلية</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs block">
                  {selectedFile.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                تغيير الصورة
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setProcessedUrl(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer"
              >
                حذف
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Controls Panel */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Target Format */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  اختر الصيغة المستهدفة للتحويل:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'WebP', desc: 'الأخف للويب', value: 'image/webp' },
                    { label: 'JPG', desc: 'شائعة وخفيفة', value: 'image/jpeg' },
                    { label: 'PNG', desc: 'جودة وشفافية', value: 'image/png' },
                  ].map((fmt) => (
                    <button
                      key={fmt.value}
                      type="button"
                      onClick={() => setTargetFormat(fmt.value as any)}
                      className={`py-3 px-2 rounded-2xl border transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                        targetFormat === fmt.value
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                      }`}
                    >
                      <span className="font-black text-sm">{fmt.label}</span>
                      <span className={`text-[10px] mt-0.5 ${targetFormat === fmt.value ? 'text-teal-100' : 'text-slate-400'}`}>
                        {fmt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Slider (Active for WebP & JPEG) */}
              {targetFormat !== 'image/png' && (
                <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">جودة الصورة والضغط (Quality):</span>
                    <span className="font-black text-teal-600 dark:text-teal-400 font-mono text-sm">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>أقصى ضغط وأصغر حجم</span>
                    <span>أعلى دقة ووضوح</span>
                  </div>
                </div>
              )}

              {/* Scale Slider */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">مقياس الحجم (Scale Ratio):</span>
                  <span className="font-black text-violet-600 dark:text-violet-400 font-mono text-sm">{resizeRatio}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="10"
                  value={resizeRatio}
                  onChange={(e) => setResizeRatio(parseInt(e.target.value))}
                  className="w-full accent-violet-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-400 block font-mono">
                  الأبعاد: {Math.round(originalDimensions.width * (resizeRatio / 100))} × {Math.round(originalDimensions.height * (resizeRatio / 100))} px
                </span>
              </div>

              {/* Savings Stats */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {savedPercent > 0 
                      ? `تم تقليل الحجم بنسبة ${savedPercent}% مع الحفاظ على النقاء!`
                      : 'الصورة جاهزة للتحويل والتنزيل'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] block">الحجم الأصلي:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{formatBytes(originalSize)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] block">الحجم بعد التحويل:</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono">{formatBytes(processedSize)}</span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={isProcessing || !processedUrl}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-violet-600 hover:from-teal-700 hover:to-violet-700 active:scale-[0.99] text-white font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                <span>{isProcessing ? 'جاري المعالجة...' : `تنزيل الصورة بصيغة ${targetFormat.replace('image/', '').toUpperCase()}`}</span>
              </button>
            </div>

            {/* Image Preview Area */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col items-center justify-center transition-colors min-h-[360px]">
              {processedUrl ? (
                <div className="space-y-4 w-full text-center">
                  <div className="max-h-[380px] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] flex items-center justify-center p-4">
                    <img
                      src={processedUrl}
                      alt="معاينة الصورة المحولة"
                      className="max-h-[340px] w-auto max-w-full object-contain rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
                    <span className="font-semibold">{selectedFile.name}</span>
                    <span className="font-black text-teal-600 dark:text-teal-400 font-mono">
                      {targetFormat.replace('image/', '').toUpperCase()} • {formatBytes(processedSize)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                  <span>جاري تحضير المعاينة...</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
