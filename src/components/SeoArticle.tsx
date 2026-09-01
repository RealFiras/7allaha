import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2, Users, Sparkles, ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { ToolDefinition } from '../types';
import { TOOLS } from '../data/toolsData';
import { useLanguage } from '../context/LanguageContext';

interface SeoArticleProps {
  tool: ToolDefinition;
  onSelectTool?: (toolId: string) => void;
}

export const SeoArticle: React.FC<SeoArticleProps> = ({ tool, onSelectTool }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { language, t } = useLanguage();

  const relatedTools = TOOLS.filter((t) => tool.relatedToolIds?.includes(t.id));
  const toolName = language === 'en' ? (tool.nameEn || tool.name) : tool.name;
  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="mt-12 space-y-10 border-t border-slate-200 dark:border-slate-800 pt-10">
      {/* Clean AdSense Ready Placeholder */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-block bg-slate-200 dark:bg-slate-800 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
          {language === 'ar' ? 'مساحة إعلانية مخصصة (Google AdSense Slot)' : 'Advertisement (Google AdSense Slot)'}
        </span>
        <p className="text-slate-400 dark:text-slate-500">
          {language === 'ar' ? 'إعلانات سريعة ومتجاوبة مع الهواتف والشاشات الكبيرة' : 'Responsive, fast-loading ad unit'}
        </p>
      </div>

      {/* Main Educational Article */}
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ar' ? 'دليل الاستخدام والشرح التفصيلي' : 'Comprehensive Guide & Documentation'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
            {language === 'ar'
              ? (tool.seoTitle || `ما هي ${tool.name} وكيف تعمل؟`)
              : (tool.seoTitleEn || `What is ${toolName} & How Does It Work?`)}
          </h2>

          <div className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg font-tajawal">
            {language === 'en' ? (tool.whatIsItEn || tool.whatIsIt) : tool.whatIsIt}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* How to use */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.howToUseStep}</span>
              </h3>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 list-none p-0">
                {(language === 'en' && tool.howToUseEn && tool.howToUseEn.length > 0 ? tool.howToUseEn : tool.howToUse).map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Who is it for */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>{t.whoIsItForTitle}</span>
              </h3>
              <ul className="space-y-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 list-none p-0">
                {(language === 'en' && tool.whoIsItForEn && tool.whoIsItForEn.length > 0 ? tool.whoIsItForEn : tool.whoIsItFor).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Features Highlights */}
          {((language === 'en' && tool.featuresEn && tool.featuresEn.length > 0) || (tool.features && tool.features.length > 0)) && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>
                  {language === 'ar'
                    ? `أبرز مميزات ${tool.name} على منصة حلّها`
                    : `Key Features of ${toolName} on 7allaha`}
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(language === 'en' && tool.featuresEn && tool.featuresEn.length > 0 ? tool.featuresEn : tool.features).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* FAQs Section */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {language === 'ar'
                  ? `الأسئلة الشائعة حول ${tool.name}`
                  : `Frequently Asked Questions about ${toolName}`}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {language === 'ar' ? 'إجابات وافية على أهم التساؤلات المتكررة' : 'Clear answers to common questions'}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {tool.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              const q = language === 'en' ? (faq.questionEn || faq.question) : faq.question;
              const a = language === 'en' ? (faq.answerEn || faq.answer) : faq.answer;
              return (
                <div
                  key={idx}
                  className={`border rounded-xl transition-colors ${
                    isOpen
                      ? 'border-teal-200 dark:border-teal-800/80 bg-teal-50/30 dark:bg-teal-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 flex items-center justify-between text-start font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base gap-3 cursor-pointer"
                  >
                    <span>{q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-teal-100/60 dark:border-teal-900/50 font-tajawal">
                      {a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && onSelectTool && (
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 transition-colors">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            {t.relatedToolsTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => {
              const rName = language === 'en' ? (relTool.nameEn || relTool.name) : relTool.name;
              const rDesc = language === 'en' ? (relTool.shortDescriptionEn || relTool.shortDescription) : relTool.shortDescription;
              return (
                <button
                  key={relTool.id}
                  type="button"
                  onClick={() => onSelectTool(relTool.id)}
                  className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-xs transition-all text-start group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {rName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {rDesc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 mt-3">
                    <span>{t.useToolBtn}</span>
                    <Arrow className={`w-3.5 h-3.5 transform ${language === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


