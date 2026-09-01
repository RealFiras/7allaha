import React from 'react';

export const AffiliateBanner: React.FC = () => (
  <div className="w-full my-6 p-4 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30 text-center text-xs">
    <span className="font-bold text-amber-800 dark:text-amber-300">موصى به: </span>
    <a href="https://www.canva.com/join/?ref=7allaha" target="_blank" rel="nofollow sponsored" className="text-blue-600 dark:text-blue-400 underline font-bold">صمم سيرتك باحتراف على Canva</a>
    <span className="text-slate-400 mx-1">•</span>
    <a href="https://www.hostinger.com/?REFERRALCODE=7ALLAHA" target="_blank" rel="nofollow sponsored" className="text-blue-600 dark:text-blue-400 underline font-bold">استضافة موقعك على Hostinger</a>
    <span className="text-[10px] text-slate-400 block mt-1">روابط تابعة — قد نحصل على عمولة دون زيادة سعرك</span>
  </div>
);
