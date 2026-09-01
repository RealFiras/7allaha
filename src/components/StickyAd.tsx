import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AdBanner } from './AdBanner';

export const StickyAd: React.FC = () => {
  const [closed, setClosed] = useState(false);
  if (closed) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-2 sm:py-3 flex items-center justify-center gap-2">
      <div className="flex-1 max-w-3xl">
        <AdBanner format="horizontal" className="my-0" />
      </div>
      <button onClick={() => setClosed(true)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 shrink-0" aria-label="إغلاق الإعلان">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
