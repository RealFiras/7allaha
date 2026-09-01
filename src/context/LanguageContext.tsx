import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'ar' | 'en';

const STORAGE_KEY = '7allaha_lang';
const LEGACY_STORAGE_KEY = 'adawaty_lang';

const translations = {
  ar: {
    appName: 'حلّها',
    appSlogan: 'أي مشكلة... حلّها بثانية',
    badge100Free: 'مجاني 100%',
    backToTop: 'العودة للأعلى',
    breadcrumbHome: 'الرئيسية',
    browseByCategory: 'تصفح حسب التصنيف',
    categoriesMenuTitle: 'جميع التصنيفات',
    clearHistory: 'مسح السجل',
    close: 'إغلاق',
    favDesc: 'أدواتك المحفوظة في مكان واحد للوصول السريع في أي وقت.',
    favEmptyDesc: 'اضغط على النجمة بجانب أي أداة لحفظها هنا والوصول إليها بسرعة لاحقاً.',
    favEmptyTitle: 'لا توجد أدوات محفوظة بعد',
    favRemoveBtn: 'إزالة من المفضلة',
    favTitle: 'أدواتي المفضلة',
    footerPrivacy: 'سياسة الخصوصية',
    footerRights: 'جميع الحقوق محفوظة لمنصة حلّها',
    footerTerms: 'شروط الاستخدام',
    freeToolsSub: 'أداة مجانية',
    howToUseStep: 'كيفية الاستخدام خطوة بخطوة',
    liveSearchResults: 'نتائج البحث',
    madeWithLove: 'صُنع بحب لخدمة المستخدم العربي',
    navAbout: 'من نحن',
    navBlog: 'المدونة',
    navContact: 'اتصل بنا',
    navFaq: 'الأسئلة الشائعة',
    navFavorites: 'المفضلة',
    navHome: 'الرئيسية',
    navSearchPlaceholder: 'ابحث عن أداة...',
    navSearchShort: 'بحث',
    navTools: 'الأدوات',
    noToolsFound: 'لم نجد أي أداة مطابقة لـ',
    pressEscToClose: 'اضغط Esc للإغلاق',
    recentlyUsedTitle: 'الأدوات المستخدمة حديثاً',
    relatedToolsTitle: 'أدوات ذات صلة',
    searchModalPlaceholder: 'اكتب اسم الأداة... (مثال: حاسبة الزكاة)',
    shareTool: 'مشاركة الأداة',
    toggleThemeDark: 'الوضع الداكن',
    toggleThemeLight: 'الوضع الفاتح',
    tryAnotherKeyword: 'جرب كلمة بحث أخرى أو تصفح الأقسام الكاملة.',
    useToolBtn: 'استخدم الأداة',
    viewAllTools: 'عرض جميع الأدوات',
    whoIsItForTitle: 'لمن هذه الأداة؟',
  },
  en: {
    appName: '7allaha',
    appSlogan: 'Any problem... solve it in a second',
    badge100Free: '100% Free',
    backToTop: 'Back to Top',
    breadcrumbHome: 'Home',
    browseByCategory: 'Browse by Category',
    categoriesMenuTitle: 'All Categories',
    clearHistory: 'Clear History',
    close: 'Close',
    favDesc: 'All your saved tools in one place for quick access anytime.',
    favEmptyDesc: 'Tap the star next to any tool to save it here for quick access later.',
    favEmptyTitle: 'No saved tools yet',
    favRemoveBtn: 'Remove from Favorites',
    favTitle: 'My Favorite Tools',
    footerPrivacy: 'Privacy Policy',
    footerRights: 'All rights reserved to 7allaha',
    footerTerms: 'Terms of Service',
    freeToolsSub: 'free tools',
    howToUseStep: 'Step-by-Step Usage Guide',
    liveSearchResults: 'Search Results',
    madeWithLove: 'Made with love for Arabic users',
    navAbout: 'About Us',
    navBlog: 'Blog',
    navContact: 'Contact Us',
    navFaq: 'FAQ',
    navFavorites: 'Favorites',
    navHome: 'Home',
    navSearchPlaceholder: 'Search for a tool...',
    navSearchShort: 'Search',
    navTools: 'Tools',
    noToolsFound: 'No matching tool found for',
    pressEscToClose: 'Press Esc to close',
    recentlyUsedTitle: 'Recently Used Tools',
    relatedToolsTitle: 'Related Tools',
    searchModalPlaceholder: 'Type a tool name... (e.g. Zakat Calculator)',
    shareTool: 'Share Tool',
    toggleThemeDark: 'Dark Mode',
    toggleThemeLight: 'Light Mode',
    tryAnotherKeyword: 'Try another keyword or browse the categories.',
    useToolBtn: 'Use Tool',
    viewAllTools: 'View All Tools',
    whoIsItForTitle: 'Who Is It For?',
  },
} as const;

export type Translations = typeof translations.ar;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const defaultContextValue: LanguageContextValue = {
  language: 'ar',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: translations.ar,
};

const LanguageContext = createContext<LanguageContextValue>(defaultContextValue);

function readStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    // ignore
  }
  return 'ar';
}

function applyDocumentLanguage(language: Language) {
  try {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  } catch {
    // ignore
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => readStoredLanguage());

  useEffect(() => {
    applyDocumentLanguage(language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    applyDocumentLanguage(lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: translations[language],
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}