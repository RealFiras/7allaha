import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, Twitter, Facebook, Send } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../context/LanguageContext';

interface SocialShareProps {
  title: string;
  url?: string;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({ title, url, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const { language, t } = useLanguage();
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://7allaha.com');

  const shareText = encodeURIComponent(
    language === 'ar'
      ? `${title} - استخدم هذه الأداة المجانية على موقع حلّها:`
      : `${title} - Try this free tool on 7allaha:`
  );
  const encodedUrl = encodeURIComponent(currentUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    trackEvent('social_share_copy_link', { title });
    setTimeout(() => setCopied(false), 2000);
  };

  const openShare = (platform: string, shareLink: string) => {
    trackEvent('social_share_clicked', { platform, title });
    window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 mx-1">
        <Share2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <span>{t.shareTool}</span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* WhatsApp */}
        <button
          type="button"
          onClick={() => openShare('whatsapp', `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`)}
          className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
          title="WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
        </button>

        {/* Twitter / X */}
        <button
          type="button"
          onClick={() => openShare('twitter', `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`)}
          className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors cursor-pointer"
          title="Twitter / X"
        >
          <Twitter className="w-4 h-4" />
        </button>

        {/* Telegram */}
        <button
          type="button"
          onClick={() => openShare('telegram', `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`)}
          className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors cursor-pointer"
          title="Telegram"
        >
          <Send className="w-4 h-4" />
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={() => openShare('facebook', `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
          className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors cursor-pointer"
          title="Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5 text-violet-600" />}
          <span>{copied ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ الرابط' : 'Copy Link')}</span>
        </button>
      </div>
    </div>
  );
};

