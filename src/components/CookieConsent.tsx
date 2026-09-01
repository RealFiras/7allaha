import React, { useState, useEffect } from 'react';
import { Shield, Check, X, Info, Settings } from 'lucide-react';
import { getConsentStatus, setConsentStatus } from '../lib/analytics';
import { useLanguage } from '../context/LanguageContext';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const status = getConsentStatus();
    if (status === 'unset') {
      // Delay showing banner slightly for smooth UX
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setConsentStatus('granted');
    setVisible(false);
    setShowSettings(false);
  };

  const handleDenyAll = () => {
    setConsentStatus('denied');
    setVisible(false);
    setShowSettings(false);
  };

  const handleSaveCustom = () => {
    setConsentStatus(analyticsEnabled ? 'granted' : 'denied');
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label={language === 'ar' ? 'إشعار الخصوصية وملفات تعريف الارتباط' : 'Privacy & Cookie Consent'}
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-100 p-5 rounded-2xl shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/60 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>{language === 'ar' ? 'الخصوصية وتحليلات الأداء (GA4)' : 'Privacy & Performance Analytics'}</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-1 font-tajawal">
              {language === 'ar'
                ? 'نستخدم Google Analytics 4 مجهول الهوية لفهم كيفية استخدام أدوات منصة حلّها وتحسين تجربة المنصة، دون جمع أي بيانات شخصية حساسة.'
                : 'We use anonymized Google Analytics 4 to understand how 7allaha tools are used and enhance user experience, without collecting or storing personal data.'}
            </p>
          </div>
        </div>

        {/* Custom Settings Expanded */}
        {showSettings && (
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">
                  {language === 'ar' ? 'ملفات تعريف الارتباط الضرورية' : 'Essential Cookies'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {language === 'ar' ? 'لحفظ المظهر والمفضلة وتشغيل الأدوات' : 'For theme, favorites, and tool state'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold">
                {language === 'ar' ? 'دائماً نشطة' : 'Always Active'}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">
                  {language === 'ar' ? 'تحليلات الاستخدام (Analytics)' : 'Analytics (GA4)'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {language === 'ar' ? 'إحصاءات مجهولة لتحسين دقة الأدوات' : 'Anonymized stats to improve tools'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 bg-slate-900 border-slate-700 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs text-slate-400 hover:text-slate-200 underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>
              {showSettings
                ? (language === 'ar' ? 'إخفاء الإعدادات' : 'Hide Options')
                : (language === 'ar' ? 'تخصيص الخيارات' : 'Customize')}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDenyAll}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'رفض التحليلات' : 'Decline'}
            </button>
            <button
              type="button"
              onClick={showSettings ? handleSaveCustom : handleAcceptAll}
              className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>
                {showSettings
                  ? (language === 'ar' ? 'حفظ التفضيل' : 'Save')
                  : (language === 'ar' ? 'موافق ومتابعة' : 'Accept')}
              </span>
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
};

