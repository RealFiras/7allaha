import React, { useState, useRef, useEffect } from 'react';
import { 
  Maximize2, 
  Upload, 
  Download, 
  Lock, 
  Unlock, 
  RotateCcw, 
  CheckCircle2, 
  Sliders, 
  Image as ImageIcon, 
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

export const ImageResizer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  // Resize Settings
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [percentage, setPercentage] = useState<number>(100);
  const [targetFormat, setTargetFormat] = useState<'original' | 'image/png' | 'image/jpeg' | 'image/webp'>('original');
  const [quality, setQuality] = useState<number>(90);

  // Processed Output
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeImageRef = useRef<HTMLImageElement | null>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    // Revoke old URL if existing
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);

    setSelectedFile(file);
    setOriginalSize(file.size);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new window.Image();
    img.onload = () => {
      activeImageRef.current = img;
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setTargetWidth(img.width);
      setTargetHeight(img.height);
      setPercentage(100);
      setAspectRatio(img.width / img.height);
    };
    img.src = url;

    trackEvent('image_resizer_upload', { format: file.type, size: file.size });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // When width input changes
  const handleWidthChange = (val: number) => {
    const w = Math.max(1, Math.min(val, 10000));
    setTargetWidth(w);
    if (lockAspectRatio && aspectRatio > 0) {
      const h = Math.round(w / aspectRatio);
      setTargetHeight(Math.max(1, h));
      if (originalWidth > 0) {
        setPercentage(Math.round((w / originalWidth) * 100));
      }
    } else if (originalWidth > 0) {
      setPercentage(Math.round((w / originalWidth) * 100));
    }
  };

  // When height input changes
  const handleHeightChange = (val: number) => {
    const h = Math.max(1, Math.min(val, 10000));
    setTargetHeight(h);
    if (lockAspectRatio && aspectRatio > 0) {
      const w = Math.round(h * aspectRatio);
      setTargetWidth(Math.max(1, w));
      if (originalHeight > 0) {
        setPercentage(Math.round((h / originalHeight) * 100));
      }
    }
  };

  // When percentage preset or slider changes
  const handlePercentageChange = (pct: number) => {
    setPercentage(pct);
    if (originalWidth > 0 && originalHeight > 0) {
      const w = Math.round((originalWidth * pct) / 100);
      const h = Math.round((originalHeight * pct) / 100);
      setTargetWidth(Math.max(1, w));
      setTargetHeight(Math.max(1, h));
    }
  };

  // Apply common dimension preset
  const applyPreset = (w: number, h: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
    setLockAspectRatio(false);
    if (originalWidth > 0) {
      setPercentage(Math.round((w / originalWidth) * 100));
    }
  };

  // Perform the client-side canvas resizing
  useEffect(() => {
    if (!previewUrl || !selectedFile || targetWidth <= 0 || targetHeight <= 0) return;

    let isCancelled = false;
    setIsProcessing(true);

    const timer = setTimeout(() => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (isCancelled) return;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // Enable high-quality bicubic/bilinear smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        let effectiveMime = selectedFile.type || 'image/png';
        if (targetFormat !== 'original') {
          effectiveMime = targetFormat;
        }

        // If target is JPEG, fill background with white (prevents black background on transparent images)
        if (effectiveMime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const q = quality / 100;
        canvas.toBlob(
          (blob) => {
            if (isCancelled) return;
            if (blob) {
              setResizedSize(blob.size);
              const blobUrl = URL.createObjectURL(blob);
              setResizedUrl(blobUrl);
            }
            setIsProcessing(false);
          },
          effectiveMime,
          q
        );
      };
      img.src = previewUrl;
    }, 50);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [previewUrl, selectedFile, targetWidth, targetHeight, targetFormat, quality]);

  const handleDownload = () => {
    if (!resizedUrl || !selectedFile) return;

    let ext = 'png';
    if (targetFormat === 'image/jpeg') ext = 'jpg';
    else if (targetFormat === 'image/webp') ext = 'webp';
    else {
      const parts = selectedFile.name.split('.');
      ext = parts.length > 1 ? parts.pop() || 'png' : 'png';
    }

    const baseName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || 'resized-image';
    const filename = `${baseName}-${targetWidth}x${targetHeight}.${ext}`;

    const link = document.createElement('a');
    link.href = resizedUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    trackToolUsage('image-resizer', 'تغيير مقاس الصور', 'download');
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResizedUrl(null);
    setOriginalWidth(0);
    setOriginalHeight(0);
    setTargetWidth(0);
    setTargetHeight(0);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs transition-colors space-y-8" id="image-resizer-tool">
      
      {/* Step 1: Upload Zone */}
      {!selectedFile ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/30 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            اسحب وأفلت الصورة هنا، أو انقر للاختيار من جهازك
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            يدعم جميع الصيغ الشائعة (PNG, JPG, JPEG, WebP, GIF, SVG). تتم المعالجة بالكامل داخل متصفحك دون رفع أي بيانات إلى الخادم لحماية خصوصيتك 100%.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xs transition-all">
            <Maximize2 className="w-4 h-4" />
            <span>اختر صورة لبدء تغيير المقاس</span>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 dark:text-slate-500 block font-semibold">الملف الحالي</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs block">
                  {selectedFile.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 text-xs font-bold transition-all cursor-pointer"
              >
                تغيير الصورة
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer"
              >
                حذف
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Dimensions & Controls */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Dimensions Input Box */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    المقاس الجديد (بالبكسل Pixels)
                  </span>

                  <button
                    type="button"
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      lockAspectRatio
                        ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                    title={lockAspectRatio ? 'النسبة مقفلة تلقائياً' : 'النسبة حرة'}
                  >
                    {lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{lockAspectRatio ? 'النسبة مقفلة' : 'النسبة حرة'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                      العرض (Width px)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={targetWidth || ''}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/40 text-base font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                      الارتفاع (Height px)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={targetHeight || ''}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/40 text-base font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50"
                    />
                  </div>
                </div>

                {/* Percentage Quick Presets */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span>النسبة المئوية من الحجم الأصلي:</span>
                    <span className="text-teal-600 dark:text-teal-400 font-mono text-sm">{percentage}%</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[25, 50, 75, 100, 150, 200].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handlePercentageChange(pct)}
                        className={`flex-1 min-w-[50px] py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          percentage === pct
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social & Web Presets */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase">
                  مقاسات شائعة جاهزة بضغطة زر:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset(1920, 1080)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-right border border-slate-200/60 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span className="block text-slate-900 dark:text-white">Full HD</span>
                    <span className="text-[10px] text-slate-400 font-mono">1920 × 1080</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset(1080, 1080)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-right border border-slate-200/60 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span className="block text-slate-900 dark:text-white">انستقرام مربع</span>
                    <span className="text-[10px] text-slate-400 font-mono">1080 × 1080</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset(1200, 630)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-right border border-slate-200/60 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span className="block text-slate-900 dark:text-white">فيسبوك / تويتر</span>
                    <span className="text-[10px] text-slate-400 font-mono">1200 × 630</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset(800, 800)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-right border border-slate-200/60 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span className="block text-slate-900 dark:text-white">صورة منتج متجر</span>
                    <span className="text-[10px] text-slate-400 font-mono">800 × 800</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset(500, 500)}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-right border border-slate-200/60 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span className="block text-slate-900 dark:text-white">صورة شخصية Avatar</span>
                    <span className="text-[10px] text-slate-400 font-mono">500 × 500</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetWidth(originalWidth);
                      setTargetHeight(originalHeight);
                      setLockAspectRatio(true);
                      setPercentage(100);
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-right border border-slate-200/60 dark:border-slate-700 text-xs font-bold text-teal-600 dark:text-teal-400 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="block">استعادة الأصلي</span>
                      <span className="text-[10px] font-mono">{originalWidth} × {originalHeight}</span>
                    </div>
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Format & Quality */}
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  صيغة الحفظ وجودة الضغط
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'original', label: 'الصيغة الأصلية' },
                    { id: 'image/png', label: 'PNG (بدون فقدان)' },
                    { id: 'image/jpeg', label: 'JPG / JPEG' },
                    { id: 'image/webp', label: 'WebP (حديثة)' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setTargetFormat(fmt.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                        targetFormat === fmt.id
                          ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-violet-400'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>

                {(targetFormat === 'image/jpeg' || targetFormat === 'image/webp') && (
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                      <span>جودة الصورة:</span>
                      <span className="text-violet-600 dark:text-violet-400 font-mono text-sm">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value))}
                      className="w-full accent-violet-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Preview & Download Card */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    المعاينة والنتيجة الفورية
                  </span>

                  {isProcessing && (
                    <span className="text-xs font-bold text-teal-600 animate-pulse flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
                      جاري المعالجة...
                    </span>
                  )}
                </div>

                {/* Visual Image Preview with Checkerboard background */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] min-h-[260px] flex items-center justify-center p-4">
                  {resizedUrl ? (
                    <img
                      src={resizedUrl}
                      alt="Resized Preview"
                      className="max-h-[300px] w-auto max-w-full object-contain rounded-lg shadow-sm"
                    />
                  ) : previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Original Preview"
                      className="max-h-[300px] w-auto max-w-full object-contain rounded-lg shadow-sm opacity-80"
                    />
                  ) : null}
                </div>

                {/* Comparison Details Banner */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">المقاس الأصلي</span>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono block mt-0.5">
                      {originalWidth} × {originalHeight} px
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {formatBytes(originalSize)}
                    </span>
                  </div>

                  <div className="border-r border-slate-200 dark:border-slate-700 pr-3">
                    <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 block">المقاس الجديد</span>
                    <span className="text-sm font-black text-teal-600 dark:text-teal-400 font-mono block mt-0.5">
                      {targetWidth} × {targetHeight} px
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {resizedSize > 0 ? formatBytes(resizedSize) : 'حساب...'}
                    </span>
                  </div>
                </div>

                {/* Action Download Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!resizedUrl || isProcessing}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-violet-600 hover:from-teal-700 hover:to-violet-700 active:scale-[0.99] text-white font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  <span>تنزيل الصورة بالمقاس الجديد ({targetWidth} × {targetHeight} px)</span>
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
