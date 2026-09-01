import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <Breadcrumb items={[{ label: t.footerPrivacy }]} />

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-8 transition-colors">
        
        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span>
              {language === 'ar'
                ? 'متوافقة مع معايير Google AdSense و GDPR'
                : 'Compliant with Google AdSense & GDPR Standards'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            {language === 'ar' ? 'آخر تحديث: 2025' : 'Last updated: 2025'}
          </p>
        </div>

        {language === 'ar' ? (
          <div className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 font-tajawal text-sm sm:text-base leading-relaxed space-y-6">
            <p>
              أهلاً بكم في منصة <strong className="text-slate-900 dark:text-white">"حلّها" (7allaha)</strong>، المتاحة عبر الرابط <strong className="text-slate-900 dark:text-white">https://7allaha.com</strong>. نحن نولي سرية وخصوصية بيانات زوارنا ومستخدمينا أهمية قصوى ونعتبرها ركيزة أساسية في خدماتنا.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              1. طبيعة عمل الأدوات ومعالجة البيانات (Client-Side Processing)
            </h2>
            <p>
              تتميز جميع الأدوات المتوفرة على منصة "حلّها" (بما في ذلك حاسبة BMI، منسق JSON، تشفير Base64، مقارنة النصوص، مولد كلمات المرور، وحاسبات القروض والزكاة والعمر) بأنها تعمل بالكامل على جانب العميل (Client-Side) داخل متصفح الإنترنت الخاص بك. وهذا يعني أن أياً من النصوص، أو الأرقام، أو التواريخ، أو الصور التي تدخلها لا يتم إرسالها أو حفظها على خوادمنا نهائياً.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              2. ملفات تعريف الارتباط (Cookies) وإعلانات Google AdSense
            </h2>
            <p>
              نحن نستخدم خدمات إعلانية تابعة لأطراف ثالثة، مثل برنامج <strong className="text-slate-900 dark:text-white">Google AdSense</strong>، لعرض الإعلانات عند زيارتكم لموقعنا:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                تستخدم شركة Google ملفات تعريف الارتباط (مثل ملف تعريف الارتباط DoubleClick DART) لعرض الإعلانات للمستخدمين استناداً إلى زياراتهم لموقعنا ومواقع أخرى على شبكة الإنترنت.
              </li>
              <li>
                يمكن للمستخدمين إلغاء الاشتراك في استخدام ملف تعريف الارتباط DART لخدمة الإعلانات القائمة على الاهتمامات من خلال زيارة <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 underline">سياسة الخصوصية الخاصة بإعلانات Google وشبكة المحتوى</a>.
              </li>
              <li>
                قد تستخدم شركات الإعلانات الخارجية معلومات حول زياراتك لهذا الموقع (باستثناء اسمك، أو عنوان بريدك الإلكتروني، أو رقم هاتفك) لتقديم إعلانات حول السلع والخدمات التي قد تهمك.
              </li>
            </ul>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              3. التخزين المحلي (Local Storage)
            </h2>
            <p>
              قد يستخدم الموقع خاصية التخزين المحلي (LocalStorage) في متصفحك فقط لحفظ تفضيلاتك الشخصية مثل:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>قائمة الأدوات المفضلة والأدوات المستخدمة مؤخراً الخاصة بك لسرعة الوصول إليها.</li>
              <li>تفضيلات اللغة (العربية/الإنجليزية) والمظهر الداكن والفاتح (Dark/Light Mode).</li>
            </ul>
            <p>
              هذه البيانات تظل مخزنة على جهازك الشخصي فقط، ولا يمكن لأي خادم خارجي الوصول إليها، ويمكنك مسحها في أي وقت عبر مسح بيانات التصفح.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              4. ملفات السجل (Log Files)
            </h2>
            <p>
              مثل العديد من مواقع الويب الأخرى، قد يستخدم موقعنا ملفات السجل القياسية لتسجيل المعلومات غير الشخصية، مثل: نوع المتصفح، مزود خدمة الإنترنت (ISP)، طابع التاريخ والوقت، والصفحات التي تمت زيارتها. تُستخدم هذه البيانات حصرياً لتحليل الاتجاهات وإدارة الموقع وتحسين تجربة التصفح دون أي ربط بمعلومات تحدد الهوية الشخصية.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              5. خصوصية الأطفال
            </h2>
            <p>
              حماية خصوصية الأطفال عبر الإنترنت أمر بالغ الأهمية. منصة "حلّها" لا تجمع عن قصد أي معلومات تعريف شخصية من الأطفال دون سن 13 عاماً، ومحتوى الموقع ومحركاته الخدمية آمنة وموجهة للجمهور العام.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              6. الموافقة والتحديثات
            </h2>
            <p>
              باستخدامك لمنصة "حلّها"، فإنك تعلن بموجب هذا عن موافقتك على سياسة الخصوصية الخاصة بنا وبنودها. قد نقوم بتحديث هذه السياسة من وقت لآخر لمواكبة التغييرات التقنية أو القانونية، وسيتم نشر أي تحديث في هذه الصفحة.
            </p>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                لأي استفسار بخصوص سياسة الخصوصية أو بياناتك، يمكنك التواصل معنا عبر صفحة <a href="#/contact" className="text-teal-600 dark:text-teal-400 underline font-bold">اتصل بنا</a> أو عبر البريد: <strong>privacy@7allaha.com</strong>.
              </p>
            </div>
          </div>
        ) : (
          <div className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
            <p>
              Welcome to <strong className="text-slate-900 dark:text-white">7allaha ("حلّها")</strong>, accessible via <strong className="text-slate-900 dark:text-white">https://7allaha.com</strong>. Protecting the privacy and confidentiality of our visitors and users is our highest priority and a foundational principle of our service.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              1. Client-Side Processing & Zero Server Data Storage
            </h2>
            <p>
              All computational utilities and tools provided on 7allaha (including BMI calculators, JSON formatters, Base64 encoders, text comparators, password generators, loan EMI calculators, Zakat calculators, and age calculators) operate entirely on the client-side within your web browser. None of your entered text, numbers, dates, or media files are ever transmitted to or stored on our servers.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              2. Cookies & Google AdSense Advertising
            </h2>
            <p>
              We utilize third-party advertising services, such as <strong className="text-slate-900 dark:text-white">Google AdSense</strong>, to serve advertisements when you visit our website:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Google uses cookies (including the DoubleClick DART cookie) to serve ads to users based on their visit to this website and other sites across the internet.
              </li>
              <li>
                Users may opt out of the use of the DART cookie for interest-based advertising by visiting the <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 underline">Google Ad and Content Network Privacy Policy</a>.
              </li>
              <li>
                External ad vendors may use non-identifying browsing metrics (excluding your name, email address, or phone number) to deliver tailored product and service recommendations.
              </li>
            </ul>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              3. Local Storage Usage
            </h2>
            <p>
              The platform utilizes browser local storage (LocalStorage) strictly to remember client preferences:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your pinned Favorite tools and Recently Used tools for quick access.</li>
              <li>Language preferences (Arabic/English) and theme selection (Dark/Light mode).</li>
            </ul>
            <p>
              This state remains locally stored on your machine and can be cleared at any time through your browser settings.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              4. Server Log Files
            </h2>
            <p>
              Standard server logs record basic non-identifiable technical metrics, such as browser type, operating system, ISP, timestamp, and referring/exit pages. These diagnostics are used solely for infrastructure monitoring and site performance optimization.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              5. Children's Privacy
            </h2>
            <p>
              Safeguarding younger audiences is essential. 7allaha does not knowingly collect any personally identifiable information from children under the age of 13. Our tools and content are safe and built for general audiences.
            </p>

            <h2 className="text-xl font-black text-violet-600 dark:text-violet-400 mt-6">
              6. Consent & Updates
            </h2>
            <p>
              By using 7allaha, you hereby consent to our Privacy Policy and agree to its terms. We may update this policy periodically, and any revisions will be published immediately on this page.
            </p>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                For any questions regarding our Privacy Policy or your data rights, please contact us via our <a href="#/contact" className="text-teal-600 dark:text-teal-400 underline font-bold">Contact Us</a> page or email <strong>privacy@7allaha.com</strong>.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};


