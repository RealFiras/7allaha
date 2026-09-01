import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface AdBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ format = 'horizontal', className = '' }) => {
  const { language } = useLanguage();

  return (
    <div className={`w-full overflow-hidden my-6 ${className}`}>
      <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 text-center transition-colors">
        <div className="flex items-center justify-between w-full max-w-2xl px-2 mb-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          <span>{language === 'ar' ? 'إعلان ممول • Sponsored Ad' : 'Sponsored Ad'}</span>
          <span>Google AdSense</span>
        </div>

        {/* Ad Placeholder Box (Ready for AdSense Script Auto-fill) */}
        <div
          className={`w-full flex flex-col items-center justify-center rounded-xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800/80 text-gray-400 dark:text-gray-500 text-xs ${
            format === 'horizontal'
              ? 'h-24 sm:h-28 max-w-4xl'
              : format === 'rectangle'
              ? 'h-64 max-w-sm'
              : 'h-32 max-w-3xl'
          }`}
        >
          <span className="font-semibold text-gray-400 dark:text-gray-500">
            {language === 'ar' ? 'مساحة إعلانية متوافقة مع Google AdSense' : 'Google AdSense Compatible Ad Slot'}
          </span>
          <span className="text-[11px] text-gray-300 dark:text-gray-600 mt-1">
            {language === 'ar'
              ? '(يتم ملء هذه المساحة تلقائياً بعد تفعيل حساب الناشر)'
              : '(Auto-filled upon publisher account verification)'}
          </span>
        </div>
      </div>
    </div>
  );
};

