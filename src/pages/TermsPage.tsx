import React from 'react';
import { Scale } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

export const TermsPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <Breadcrumb items={[{ label: t.footerTerms }]} />

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-8 transition-colors">
        
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
            <Scale className="w-4 h-4" />
            <span>
              {language === 'ar' ? 'اتفاقية الاستخدام القانونية' : 'Legal Terms of Service Agreement'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {language === 'ar' ? 'شروط وأحكام الاستخدام' : 'Terms of Service'}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {language === 'ar' ? 'تاريخ السريان: 2025' : 'Effective Date: 2025'}
          </p>
        </div>

        {language === 'ar' ? (
          <div className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 font-tajawal text-sm sm:text-base leading-relaxed space-y-6">
            <p>
              مرحباً بك في منصة <strong className="text-slate-900 dark:text-white">"حلّها" (7allaha)</strong>. تنظم هذه الشروط والأحكام استخدامك لموقعنا الإلكتروني وجميع الأدوات والخدمات المتاحة من خلاله. من خلال الوصول إلى هذا الموقع أو استخدام أي من أدواته، فإنك توافق صراحة على الالتزام بهذه الشروط بالكامل.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              1. ترخيص الاستخدام المجاني
            </h2>
            <p>
              يُمنح جميع زوار منصة "حلّها" ترخيصاً مجانياً وغير حصري لاستخدام جميع الأدوات المتاحة لأغراضهم الشخصية أو المهنية أو التعليمية دون أي قيود، مع مراعاة عدم استخدام الموقع في أي أنشطة غير قانونية أو انتهاك لأي حقوق فكرية.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              2. إخلاء المسؤولية الطبية والمالية والقانونية
            </h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong className="text-slate-900 dark:text-white">حاسبة كتلة الجسم (BMI):</strong> تُقدم نتائج حاسبة كتلة الجسم كمعلومات إرشادية وتثقيفية عامة فقط، ولا تعتبر بأي حال من الأحوال بديلاً عن الاستشارة الطبية المتخصصة أو التشخيص السريري.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">حاسبة القروض (EMI) وحاسبة الزكاة ومحول العملات:</strong> الحسابات المالية وأسعار الصرف تُقدم لأغراض التخطيط والتقدير العام. قد تختلف النسب الفعلية لدى البنوك والمصارف بناءً على الرسوم الإضافية والسياسات الائتمانية.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">مواقيت الصلاة:</strong> تعتمد مواقيت الصلاة على خوارزميات فلكية دقيقة طبقاً للتقاويم المعتمدة، ويُستحب دائماً مراعاة الأذان المحلي في منطقتك.
              </li>
            </ul>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              3. حقوق الملكية الفكرية
            </h2>
            <p>
              العلامة التجارية "حلّها" والتصميم والشفرة البرمجية والشعار وجميع النصوص والمقالات التوضيحية المكتوبة محمية بموجب قوانين حقوق النشر والملكية الفكرية. لا يحق نسخ أو إعادة نشر المحتوى التحريري بدون إذن خطي مسبق.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              4. التعديل على الخدمات والشروط
            </h2>
            <p>
              نحتفظ بالحق في تحديث أو تحسين أو تعديل أي أداة على الموقع، أو تعديل هذه الشروط في أي وقت دون إشعار مسبق لضمان جودة الخدمة وتطويرها.
            </p>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                إذا كانت لديك أي أسئلة حول شروط الاستخدام، يرجى مراسلتنا عبر صفحة <a href="#/contact" className="text-teal-600 dark:text-teal-400 underline font-bold">اتصل بنا</a>.
              </p>
            </div>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
            <p>
              Welcome to <strong className="text-slate-900 dark:text-white">7allaha ("حلّها")</strong>. These Terms of Service govern your access to and usage of our website and all utilities provided. By using our website or tools, you expressly agree to abide by these terms.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              1. Free License of Use
            </h2>
            <p>
              All visitors are granted a free, non-exclusive license to use all tools for personal, professional, or educational purposes without restrictions, provided the tools are not used for malicious, unauthorized, or unlawful activities.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              2. Disclaimers (Health, Financial, & Legal)
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-slate-900 dark:text-white">Body Mass Index (BMI) Calculator:</strong> Results are provided purely for informational and educational purposes and do not substitute clinical medical advice or diagnosis.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Financial & Zakat Calculators:</strong> Loan EMI estimates, currency conversions, and Zakat estimates are computed for general planning. Actual financial institution values and fees may vary.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Prayer Times:</strong> Astronomical calculation algorithms conform to standard Islamic authorities; always confirm local mosque calls where available.
              </li>
            </ul>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              3. Intellectual Property
            </h2>
            <p>
              The 7allaha brand, design systems, algorithms, source code, logos, and written guides are protected under intellectual property and copyright laws. Unauthorized scraping or republishing of textual guides is strictly prohibited without written consent.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              4. Service Modifications
            </h2>
            <p>
              We reserve the right to upgrade, refine, or adjust any tool or feature at any time without prior notice to maintain top operational performance and security.
            </p>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                If you have questions regarding our terms, feel free to contact us via our <a href="#/contact" className="text-teal-600 dark:text-teal-400 underline font-bold">Contact Us</a> page.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


