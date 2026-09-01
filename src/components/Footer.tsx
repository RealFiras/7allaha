import React from 'react';
import { 
  Check, 
  Heart, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  ArrowUp,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (path: string) => {
    const clean = path.startsWith('/') ? path.slice(1) : path;
    onNavigate(clean || 'home');
  };

  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-14 pb-8 mt-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-100 dark:border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4 text-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-md">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-2xl text-teal-600 dark:text-teal-400 tracking-tight block">
                    {t.appName}
                  </span>
                  <span className="text-violet-500 font-bold text-base">✓</span>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium font-tajawal">{t.appSlogan}</span>
              </div>
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm font-tajawal">
              {language === 'ar' 
                ? 'منصة ذكية وشاملة توفر أدوات مجانية يومية بضغطة زر: حاسبات دقيقة، محولات قياس وعملات، زكاة وفواتير، نصوص وتشفير، ومواقيت صلاة تعمل مباشرة داخل متصفحك.'
                : 'Smart all-in-one platform providing free everyday tools at the click of a button: calculators, converters, invoice & zakat, text & encryption, prayer times directly in your browser.'}
            </p>

            {/* Theme, Language and Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-teal-600" />}
                <span>{theme === 'dark' ? (language === 'ar' ? 'الوضع المظلم' : 'Dark Mode') : (language === 'ar' ? 'الوضع الفاتح' : 'Light Mode')}</span>
              </button>

              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors cursor-pointer border border-teal-200 dark:border-teal-800"
              >
                <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{language === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              <span className="text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full border border-teal-200 dark:border-teal-900 font-bold">
                {t.badge100Free}
              </span>
            </div>
          </div>

          {/* Quick Tools Col 1: Calculators & Converters */}
          <div className="space-y-3 text-start">
            <h4 className="text-slate-900 dark:text-slate-100 font-bold text-sm tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{language === 'ar' ? 'حاسبات وتحويل' : 'Calculators & Conversion'}</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400 list-none p-0">
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/bmi-calculator')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'حاسبة مؤشر كتلة الجسم (BMI)' : 'BMI Calculator'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/emi-calculator')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'حاسبة أقساط القروض (EMI)' : 'Loan EMI Calculator'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/age-calculator')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'حاسبة العمر بالتفصيل' : 'Age Calculator'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/percentage-calculator')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'حاسبة النسبة المئوية والخصم' : 'Percentage & Discount Calculator'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/unit-converter')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'محول وحدات القياس الشامل' : 'Unit Converter'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/currency-converter')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'محول أسعار العملات الحية' : 'Currency Converter'}
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Tools Col 2: Text & Security */}
          <div className="space-y-3 text-start">
            <h4 className="text-slate-900 dark:text-slate-100 font-bold text-sm tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>{language === 'ar' ? 'نصوص، أمان وإسلاميات' : 'Text, Security & Tools'}</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400 list-none p-0">
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/zakat-calculator')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'حاسبة الزكاة الشرعية' : 'Zakat Calculator'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/invoice-generator')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'مولد الفواتير الاحترافية' : 'Invoice Generator'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/word-counter')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'عداد الكلمات والنصوص' : 'Word Counter'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/password-generator')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'مولد كلمات المرور القوية' : 'Password Generator'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/qr-code-generator')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'صانع رموز QR Code' : 'QR Code Generator'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('tool/prayer-times')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'مواقيت الصلاة والأذان' : 'Prayer Times'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Company Links */}
          <div className="space-y-3 text-start">
            <h4 className="text-slate-900 dark:text-slate-100 font-bold text-sm tracking-wide flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>{language === 'ar' ? 'المعرفة والروابط المهمة' : 'Knowledge & Links'}</span>
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400 list-none p-0">
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('blog')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer font-bold text-teal-600 dark:text-teal-400"
                >
                  {t.navBlog}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('faq')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {t.navFaq}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('about')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('contact')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {t.navContact}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('privacy-policy')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLinkClick('terms')}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-start cursor-pointer"
                >
                  {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} {t.footerRights}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <span>{t.madeWithLove}</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              title={t.backToTop}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">{t.backToTop}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};


