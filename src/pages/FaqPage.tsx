import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, Sparkles, ShieldCheck, Mail } from 'lucide-react';
import { GENERAL_FAQS } from '../data/faqData';
import { Breadcrumb } from '../components/Breadcrumb';
import { DynamicIcon } from '../components/DynamicIcon';
import { useLanguage } from '../context/LanguageContext';
import { AdBanner } from '../components/AdBanner';

interface FaqPageProps {
  onNavigate: (route: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndexes, setOpenIndexes] = useState<Record<string, boolean>>({
    'general-0': true,
    'privacy-0': true,
    'accuracy-0': true,
  });
  const { language, t } = useLanguage();

  const toggleAccordion = (key: string) => {
    setOpenIndexes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumb items={[{ label: t.navFaq }]} />

      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
          <HelpCircle className="w-4 h-4" />
          <span>{language === 'ar' ? 'مركز المساعدة والإجابات السريعة' : 'Help Center & Quick Answers'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'ar' ? 'الأسئلة الأكثر شيوعاً حول منصة حلّها' : 'Frequently Asked Questions about 7allaha'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-tajawal leading-relaxed">
          {language === 'ar'
            ? 'إجابات واضحة ودقيقة عن خصوصية بياناتك، دقة المعادلات والحسابات، طريقة الاستخدام، وتوافق الموقع مع مختلف الأجهزة.'
            : 'Clear answers regarding your data privacy, computational accuracy, usability, and multi-device compatibility.'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors">
        <div className="relative">
          <Search className={`w-5 h-5 text-slate-400 absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث عن سؤال أو استفسار محدد (مثال: حفظ البيانات، الزكاة، الفواتير، PWA)...'
                : 'Search FAQ (e.g. data privacy, calculations, PWA, invoice)...'
            }
            className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500`}
          />
        </div>
      </div>

      {/* FAQ Categories & Items */}
      <div className="space-y-6">
        {GENERAL_FAQS.map((category) => {
          const catTitle = language === 'en' ? (category.titleEn || category.title) : category.title;
          const filteredItems = category.items.filter((item) => {
            const q = language === 'en' ? (item.questionEn || item.question) : item.question;
            const a = language === 'en' ? (item.answerEn || item.answer) : item.answer;
            return (
              q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              a.toLowerCase().includes(searchQuery.toLowerCase())
            );
          });

          if (filteredItems.length === 0) return null;

          return (
            <div
              key={category.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4 transition-colors"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <DynamicIcon name={category.iconName} className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-violet-600 dark:text-violet-400">
                  {catTitle}
                </h2>
              </div>

              <div className="space-y-3">
                {filteredItems.map((faq, i) => {
                  const itemKey = `${category.id}-${i}`;
                  const isOpen = Boolean(openIndexes[itemKey]);
                  const q = language === 'en' ? (faq.questionEn || faq.question) : faq.question;
                  const a = language === 'en' ? (faq.answerEn || faq.answer) : faq.answer;

                  return (
                    <div
                      key={i}
                      className="border border-slate-200/70 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(itemKey)}
                        className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-850 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-tajawal leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                          {a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ad before CTA */}
      <AdBanner format="horizontal" />

      {/* Still need help CTA */}
      <div className="bg-gradient-to-r from-teal-600 to-violet-700 text-white rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-start">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black">
            {language === 'ar' ? 'لم تجد إجابة لاستفسارك؟' : "Couldn't find your answer?"}
          </h3>
          <p className="text-teal-100 text-xs sm:text-sm max-w-md font-tajawal leading-relaxed">
            {language === 'ar'
              ? 'يسعد فريق الدعم الفني بمساعدتك والإجابة على أي اقتراح أو سؤال في أقرب وقت.'
              : 'Our support team is happy to answer your questions or receive tool suggestions.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('contact')}
          className="px-6 py-3.5 bg-white text-teal-700 hover:bg-teal-50 active:scale-95 rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Mail className="w-4 h-4" />
          <span>{language === 'ar' ? 'تواصل مع الدعم الفني' : 'Contact Support'}</span>
        </button>
      </div>
    </div>
  );
};

