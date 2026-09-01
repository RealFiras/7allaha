import React from 'react';
import { Sparkles, ShieldCheck, Heart, Zap, Award, Target } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <Breadcrumb items={[{ label: t.navAbout }]} />

      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-xs space-y-4 transition-colors">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-100 dark:border-teal-900/60">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>{language === 'ar' ? 'منصة الأدوات الذكية والمجانية' : 'Smart & Free Web Tools Platform'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
          {language === 'ar' ? (
            <>
              عن منصة حلّها (<span className="text-teal-600 dark:text-teal-400">7allaha</span>)
            </>
          ) : (
            <>
              About <span className="text-teal-600 dark:text-teal-400">7allaha</span> Platform
            </>
          )}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-tajawal max-w-2xl mx-auto">
          {language === 'ar'
            ? 'منصتك العربية الأولى للحصول على أدوات ويب خدمية وحاسبات ذكية فائقة السرعة، بدون أي رسوم أو تسجيل مسبق، وباحترام كامل لخصوصيتك.'
            : 'Your premier destination for high-speed online calculators, converters, and digital tools—100% free with zero registration and absolute privacy.'}
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-violet-600 dark:text-violet-400">
            {language === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Mission & Vision'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-tajawal">
            {language === 'ar'
              ? 'نسعى لتمكين كل مستخدم وباحث ومطور عربي من إنجاز مهامه اليومية وحساباته المعقدة بضغطة زر واحدة. نؤمن بأن الأدوات الرقمية المفيدة يجب أن تكون مجانية بالكامل، سريعة التحميل، وتعمل باحترافية على جميع الأجهزة والشاشات.'
              : 'We empower users, students, and professionals to solve everyday calculations and tasks in one click. We believe essential web utilities should be free, ultra-fast, and universally accessible.'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-violet-600 dark:text-violet-400">
            {language === 'ar' ? 'الخصوصية والأمان أولاً' : 'Privacy & Security First'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-tajawal">
            {language === 'ar'
              ? 'جميع عمليات المعالجة والحسابات وتشفير النصوص وتوليد الرموز تجري مباشرة داخل متصفحك (Client-Side). نحن لا نجمع بياناتك الشخصية الحساسة، ولا نخزن نصوصك أو ملفاتك على خوادم خارجية، لضمان أعلى مستويات الأمان.'
              : 'All calculations, text encoding, and file conversions occur directly inside your browser (Client-Side). We never collect sensitive personal information or store your documents on remote servers.'}
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
        <h2 className="text-2xl font-black text-violet-600 dark:text-violet-400 text-center">
          {language === 'ar' ? 'لماذا يفضل المستخدمون منصة "حلّها"؟' : 'Why Users Choose 7allaha?'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {language === 'ar' ? 'سرعة فائقة وخفة تامة' : 'Instant Speed & Light Weight'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-tajawal">
              {language === 'ar'
                ? 'تصميم كودي نقي ومحسن يضمن تحميل فوري للأدوات دون انتظار أو استهلاك لبيانات الاتصال.'
                : 'Clean optimized code ensuring instant tool execution without delays or heavy bandwidth consumption.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {language === 'ar' ? 'دقة علمية وفلكية' : 'Scientific & Mathematical Precision'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-tajawal">
              {language === 'ar'
                ? 'معادلات معتمدة من منظمة الصحة العالمية والهيئات الفلكية وحسابات رياضية دقيقة 100%.'
                : 'Formulas verified against clinical standards, astronomical algorithms, and 100% exact math.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {language === 'ar' ? 'مجاني 100% مدى الحياة' : '100% Free Lifetime'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-tajawal">
              {language === 'ar'
                ? 'لا توجد خطط مدفوعة أو قيود على الاستخدام أو حاجة لتسجيل حساب أو إدخال بطاقة بنكية.'
                : 'No paywalls, hidden limitations, credit cards, or account requirements. Completely free forever.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};



