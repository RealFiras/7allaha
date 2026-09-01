import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Link, 
  Type, 
  Wifi, 
  Phone, 
  Mail, 
  MessageSquare,
  Palette, 
  Sparkles,
  Share2,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

type QrType = 'url' | 'text' | 'wifi' | 'phone' | 'email' | 'whatsapp';

export const QrGenerator: React.FC = () => {
  const [type, setType] = useState<QrType>('url');
  
  // Content states
  const [url, setUrl] = useState<string>('https://adawaty.com');
  const [text, setText] = useState<string>('أهلاً بك في منصة أدواتي! أدوات مجانية ذكية وسريعة.');
  const [wifiSsid, setWifiSsid] = useState<string>('Adawaty_Guest');
  const [wifiPassword, setWifiPassword] = useState<string>('Password123');
  const [wifiEncryption, setWifiEncryption] = useState<string>('WPA');
  const [wifiHidden, setWifiHidden] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>('+966500000000');
  const [emailTo, setEmailTo] = useState<string>('contact@adawaty.com');
  const [emailSubject, setEmailSubject] = useState<string>('استفسار من منصة أدواتي');
  const [whatsappPhone, setWhatsappPhone] = useState<string>('966500000000');
  const [whatsappMessage, setWhatsappMessage] = useState<string>('مرحباً، أود الاستفسار بخصوص خدماتكم');

  // Customization
  const [fgColor, setFgColor] = useState<string>('#1e293b');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [size, setSize] = useState<number>(360);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Construct raw string based on selected type
  const getRawContent = (): string => {
    switch (type) {
      case 'url':
        return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      case 'text':
        return text;
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'phone':
        return `tel:${phone}`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
      case 'whatsapp':
        return `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
      default:
        return '';
    }
  };

  useEffect(() => {
    const raw = getRawContent();
    if (!raw.trim()) {
      setQrDataUrl('');
      return;
    }

    setIsGenerating(true);
    QRCode.toDataURL(raw, {
      width: size,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: errorCorrection,
    })
      .then((dataUrl) => {
        setQrDataUrl(dataUrl);
        setIsGenerating(false);
      })
      .catch((err) => {
        console.error(err);
        setIsGenerating(false);
      });
  }, [
    type, 
    url, 
    text, 
    wifiSsid, 
    wifiPassword, 
    wifiEncryption, 
    wifiHidden, 
    phone, 
    emailTo, 
    emailSubject, 
    whatsappPhone, 
    whatsappMessage, 
    fgColor, 
    bgColor, 
    size, 
    errorCorrection
  ]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `adawaty-qr-${type}-${Date.now()}.png`;
    a.click();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getRawContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-700 shadow-xs p-6 sm:p-8 space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                صانع ومولد رموز QR Code الاحترافي
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              توليد باركود فائق الجودة لروابط المواقع، شبكات الواي فاي، جهات الاتصال وواتساب مجاناً
            </p>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>رمز دائم بدون انتهاء صلاحية</span>
          </span>
        </div>

        {/* Type Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-gray-100/80 dark:bg-slate-800 rounded-2xl border border-gray-200/60 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setType('url')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              type === 'url'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>رابط موقع (URL)</span>
          </button>

          <button
            type="button"
            onClick={() => setType('text')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              type === 'text'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Type className="w-4 h-4" />
            <span>نص حر</span>
          </button>

          <button
            type="button"
            onClick={() => setType('wifi')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              type === 'wifi'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>واي فاي (Wi-Fi)</span>
          </button>

          <button
            type="button"
            onClick={() => setType('whatsapp')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              type === 'whatsapp'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>واتساب (WhatsApp)</span>
          </button>

          <button
            type="button"
            onClick={() => setType('phone')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              type === 'phone'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>اتصال هاتفي</span>
          </button>

          <button
            type="button"
            onClick={() => setType('email')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              type === 'email'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>بريد إلكتروني</span>
          </button>
        </div>

        {/* Content Form & Live Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Inputs (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {type === 'url' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                  رابط الموقع الإلكتروني المستهدف:
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://adawaty.com"
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 font-semibold text-gray-800 dark:text-slate-100 text-sm focus:outline-none transition-all"
                />
              </div>
            )}

            {type === 'text' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                  النص أو الرسالة المضمنة في الباركود:
                </label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="اكتب أي نص أو ملاحظة أو كود سري هنا..."
                  className="w-full p-4 rounded-2xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 text-gray-800 dark:text-slate-100 font-tajawal text-sm focus:outline-none transition-all"
                />
              </div>
            )}

            {type === 'wifi' && (
              <div className="space-y-4 bg-gray-50/70 dark:bg-slate-800/60 p-5 rounded-2xl border border-gray-200/60 dark:border-slate-700">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                    اسم شبكة الواي فاي (Network SSID):
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="مثال: Home_Fiber_5G"
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 text-gray-800 dark:text-slate-100 font-semibold text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                    كلمة سر الشبكة (Wi-Fi Password):
                  </label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 text-gray-800 dark:text-slate-100 font-mono text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-slate-200 mb-1">
                      نوع الأمان والتشفير:
                    </label>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3 (الأكثر شيوعاً)</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">بدون كلمة سر (شبكة مفتوحة)</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="rounded text-blue-600 w-4 h-4"
                      />
                      <span>شبكة مخفية (Hidden SSID)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {type === 'whatsapp' && (
              <div className="space-y-4 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                    رقم هاتف الواتساب (مع رمز الدولة وبدون إشارة + أو أصفار أولية):
                  </label>
                  <input
                    type="tel"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="مثال: 966500000000"
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40 text-gray-800 dark:text-slate-100 font-mono text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                    الرسالة الافتراضية الجاهزة للمحادثة:
                  </label>
                  <textarea
                    rows={2}
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    placeholder="الرسالة التي ستظهر تلقائياً عند مسح الرمز..."
                    className="w-full p-3 rounded-xl border border-emerald-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-emerald-500 dark:focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40 text-gray-800 dark:text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            {type === 'phone' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                  رقم الهاتف للاتصال الفوري (مع مفتاح الدولة):
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966500000000"
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40 font-semibold text-gray-800 dark:text-slate-100 text-sm focus:outline-none"
                />
              </div>
            )}

            {type === 'email' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                    البريد الإلكتروني المستلم:
                  </label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800 focus:border-blue-500 text-gray-800 dark:text-slate-100 text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-200">
                    عنوان الرسالة المسبق (Subject):
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="موضوع الرسالة"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800 focus:border-blue-500 text-gray-800 dark:text-slate-100 text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Customization Details (Colors & Error correction) */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-4">
              <span className="text-xs font-bold text-gray-700 dark:text-slate-200 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-blue-600" />
                <span>تخصيص ألوان وتصميم الباركود</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 mb-1">
                    لون الرمز (Foreground)
                  </label>
                  <div className="flex items-center gap-2 border border-gray-200 dark:border-slate-600 p-2 rounded-xl bg-gray-50/50 dark:bg-slate-800/60">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                    />
                    <span className="text-xs font-mono text-gray-700 dark:text-slate-200 uppercase font-bold">{fgColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 mb-1">
                    لون الخلفية (Background)
                  </label>
                  <div className="flex items-center gap-2 border border-gray-200 dark:border-slate-600 p-2 rounded-xl bg-gray-50/50 dark:bg-slate-800/60">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
                    />
                    <span className="text-xs font-mono text-gray-700 dark:text-slate-200 uppercase font-bold">{bgColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-slate-400 mb-1">
                    مستوى تصحيح الأخطاء
                  </label>
                  <select
                    value={errorCorrection}
                    onChange={(e) => setErrorCorrection(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-bold text-gray-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="L">منخفض (7% تعويض)</option>
                    <option value="M">متوسط (15% تعويض)</option>
                    <option value="Q">عالي (25% تعويض)</option>
                    <option value="H">فائق (30% تعويض للطباعة)</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Right Live Preview Box (5 cols) */}
          <div className="lg:col-span-5 bg-gray-50 dark:bg-slate-800/60 border border-gray-200/80 dark:border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              المعاينة الحية للرمز
            </span>

            {/* QR Image Container with Crisp Border */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200/80 dark:border-slate-700 shadow-xs flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="رمز الاستجابة السريعة QR Code"
                  className="w-56 h-56 object-contain rounded-lg"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-gray-300">
                  <QrCode className="w-16 h-16 animate-pulse" />
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 dark:text-slate-400 max-w-xs font-tajawal leading-relaxed">
              رمز QR ثابت (Static) يعمل مدى الحياة دون وسيط ولا حدود لعدد مرات المسح.
            </p>

            {/* Actions */}
            <div className="w-full space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={!qrDataUrl}
                className="w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>تحميل صورة PNG عالية الدقة</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم نسخ المحتوى بنجاح!' : 'نسخ محتوى الرمز'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
