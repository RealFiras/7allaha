import { GeneralFaqCategory } from '../types';

export const GENERAL_FAQS: GeneralFaqCategory[] = [
  {
    id: 'general',
    title: 'عن منصة حلّها والخدمات المقدمة',
    titleEn: 'About 7allaha & Offered Services',
    iconName: 'HelpCircle',
    items: [
      {
        question: 'ما هي منصة حلّها (7allaha)؟',
        questionEn: 'What is the 7allaha platform?',
        answer: 'حلّها هي منصة رقمية عربية مجانية وشاملة توفر مجموعة واسعة من الأدوات والحاسبات والمحولات الفورية للمستخدمين العرب، تشمل الحاسبات المالية، الأدوات الصحية، محولات القياس والعملات، أدوات معالجة النصوص، وتوليد الفواتير وضغط الصور والرموز الرقمية.',
        answerEn: '7allaha is a free, all-in-one digital tools platform offering instant calculators, converters, financial formulas, health trackers, text processors, invoice makers, and utilities with zero registration required.',
      },
      {
        question: 'هل جميع الأدوات في الموقع مجانية بالكامل؟',
        questionEn: 'Are all tools on the platform 100% free?',
        answer: 'نعم، 100% من الأدوات والحاسبات والخدمات على منصة حلّها مجانية تماماً ولا تتطلب أي اشتراك شهري أو رسوم مخفية أو تسجيل حساب مستخدم.',
        answerEn: 'Yes, 100% of the tools, calculators, and services on 7allaha are completely free with no subscriptions, hidden fees, or user signups.',
      },
      {
        question: 'هل يعمل الموقع كتطبيق على الهواتف الذكية (PWA)؟',
        questionEn: 'Does the website work as a Progressive Web App (PWA)?',
        answer: 'نعم، يدعم الموقع تقنية الويب التقدمية (PWA)، ويمكنك تثبيته مباشرة على شاشة هاتفك الرئيسية (Android أو iPhone) من خلال قائمة خيارات المتصفح "إضافة إلى الشاشة الرئيسية" ليعمل بسرعة فائقة.',
        answerEn: 'Yes, the site is a Progressive Web App (PWA) and can be added directly to your mobile home screen (iOS or Android) via "Add to Home Screen" for instant app-like loading.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'الأمان وحماية الخصوصية ومعالجة البيانات',
    titleEn: 'Security, Privacy & Data Protection',
    iconName: 'ShieldCheck',
    items: [
      {
        question: 'أين تتم معالجة بياناتي وصوري ونصوصي المدخلة؟',
        questionEn: 'Where is my input data, text, or photos processed?',
        answer: 'تتم كافة العمليات الحسابية وتشفير النصوص وضغط وتحويل الصور وتوليد الفواتير محلياً بنسبة 100% داخل متصفحك (Client-Side). لا يتم رفع أي صورة أو نص أو تفاصيل مالية إلى أي خادم خارجي على الإطلاق.',
        answerEn: 'All computations, text conversions, image processing, and invoice generation occur 100% client-side inside your web browser. No personal data, images, or financial details are ever uploaded to remote servers.',
      },
      {
        question: 'هل يقوم الموقع بتخزين بياناتي الشخصية؟',
        questionEn: 'Does 7allaha store my personal data?',
        answer: 'لا نقوم بحفظ أو تسجيل أي معلومات خاصة بك على خوادمنا. البيانات الوحيدة التي يتم حفظها هي تفضيلاتك العامة مثل (المظهر، قائمة الأدوات المفضلة، آخر الأدوات المستخدمة) داخل متصفحك الشخصي عبر LocalStorage.',
        answerEn: 'We do not save any personal data on our servers. Only your client preferences (theme, favorite tools, recently used tools) are stored in your device LocalStorage.',
      },
      {
        question: 'هل الموقع متوافق مع معايير حماية البيانات العالمية (GDPR) وإرشادات Google AdSense؟',
        questionEn: 'Is the platform compliant with GDPR and Google AdSense guidelines?',
        answer: 'نعم، نلتزم بأعلى معايير الخصوصية الرقمية وشفافية ملفات تعريف الارتباط وسياسات برنامج Google AdSense، ونوفر لزوارنا خيارات واضحة للموافقة على الكوكيز وحماية هوياتهم الرقمية.',
        answerEn: 'Yes, we adhere to strict digital privacy standards, GDPR cookie consent compliance, and Google AdSense publisher policies.',
      },
    ],
  },
  {
    id: 'accuracy',
    title: 'دقة الحسابات والمعادلات العلمية والشرعية',
    titleEn: 'Accuracy of Equations & Scientific Calculations',
    iconName: 'Calculator',
    items: [
      {
        question: 'ما مدى دقة حاسبة القروض والفوائد (EMI)؟',
        questionEn: 'How accurate is the loan installment calculator (EMI)?',
        answer: 'تعتمد حاسبة القروض في حلّها على المعادلة الرياضية المصرفية القياسية المعتمدة في البنوك المركزية لحساب الأقساط الشهرية الثابتة وجداول استهلاك الدين وإجمالي الفوائد بدقة رياضية متناهية.',
        answerEn: 'Our EMI calculator uses standard banking formulas endorsed by central financial authorities to compute equal monthly installments and amortization schedules with banking-grade precision.',
      },
      {
        question: 'كيف يتم حساب النصاب في حاسبة الزكاة؟',
        questionEn: 'How is the Nisab threshold calculated in the Zakat calculator?',
        answer: 'تعتمد حاسبة الزكاة على المقادير الشرعية الثابتة (نصاب الذهب 85 غراماً من عيار 24، ونصاب الفضة 595 غراماً)، مع إمكانية تحديث سعر الغرام الحالي للحصول على قيمة النصاب بالعملة المحلية وتطبيق نسبة الـ 2.5% المقررة شرعاً على الحول.',
        answerEn: 'The Zakat calculator uses standard Islamic thresholds (85g 24K gold or 595g silver) multiplied by live or custom market prices, applying the standard 2.5% rate on wealth held for a lunar year.',
      },
      {
        question: 'هل نتائج حاسبة كتلة الجسم (BMI) والسعرات (BMR/TDEE) معتمدة طبياً؟',
        questionEn: 'Are the BMI and Calorie (BMR/TDEE) results clinically recognized?',
        answer: 'نعم، تعتمد حاسبة BMI على تصنيفات منظمة الصحة العالمية (WHO)، وتعتمد حاسبة السعرات على معادلة Mifflin-St Jeor الأكثر دقة سريرياً، مع التأكيد الدائم أن النتائج إرشادية وتثقيفية ويُفضل مراجعة أخصائي التغذية للخطط العلاجية المتخصصة.',
        answerEn: 'Yes, our BMI tool follows WHO classification standards, and our calorie engine uses the clinically validated Mifflin-St Jeor formula for educational guidance.',
      },
    ],
  },
  {
    id: 'media-tools',
    title: 'أدوات الصور والفواتير والإنتاجية',
    titleEn: 'Image Processing, Invoicing & Productivity Tools',
    iconName: 'Layers',
    items: [
      {
        question: 'كيف يعمل ضاغط ومحول الصور دون استهلاك باقة الإنترنت؟',
        questionEn: 'How does the image converter work without consuming internet data?',
        answer: 'يستخدم محول الصور محرك الرسم المدمج في متصفحك (HTML5 Canvas API) لقراءة وتشفير البكسلات وتغيير حجم الصورة وجودتها وصيغتها فورياً دون الحاجة لرفع الملف أو استهلاك الباقة.',
        answerEn: 'The image converter uses your browser HTML5 Canvas API locally to decode, resize, compress, and re-encode images instantly without uploading bytes to any server.',
      },
      {
        question: 'هل يمكنني طباعة الفواتير المولدة وحفظها كـ PDF؟',
        questionEn: 'Can I print generated invoices and save them as PDF?',
        answer: 'نعم، يتيح لك مولد الفواتير تخصيص بيانات شركتك وشعارك وعملائك ونسبة الضريبة (VAT) وطباعة الفاتورة أو حفظها كملف PDF عالي الجودة بنقرة واحدة.',
        answerEn: 'Yes, the invoice generator lets you customize business details, logos, client info, and VAT rates, then print or save as crisp PDF with a single click.',
      },
      {
        question: 'كيف تفيدني تقنية بومودورو في زيادة الإنتاجية؟',
        questionEn: 'How does the Pomodoro technique boost productivity?',
        answer: 'تقنية بومودورو تقسم وقت العمل إلى فترات تركيز مدتها 25 دقيقة تليها استراحة قصيرة مدتها 5 دقائق، مما يمنع الإرهاق الذهني ويحافظ على أعلى مستويات التركيز والإنجاز طوال اليوم.',
        answerEn: 'The Pomodoro technique organizes work into 25-minute focused sprints followed by 5-minute pauses, avoiding mental burnout and maximizing daily focus.',
      },
    ],
  },
];

