import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  Bookmark, 
  Sparkles,
  Heart,
  Info,
  Mail,
  Home,
  Sun,
  Moon,
  BookOpen,
  HelpCircle,
  Globe
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/toolsData';
import { DynamicIcon } from './DynamicIcon';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentRoute?: string;
  currentPath?: string;
  onNavigate: (path: string) => void;
  onSelectCategory?: (catId: string) => void;
  favoritesCount: number;
  onOpenFavorites?: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  currentPath,
  onNavigate,
  onSelectCategory,
  favoritesCount,
  onOpenFavorites,
  onOpenSearch,
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const activeRoute = currentRoute || (currentPath ? currentPath.replace(/^\//, '') || 'home' : 'home');

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (path: string) => {
    const clean = path.startsWith('/') ? path.slice(1) : path;
    onNavigate(clean || 'home');
    setIsToolsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    onNavigate('home');
    setIsToolsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleOpenFavs = () => {
    if (onOpenFavorites) {
      onOpenFavorites();
    } else {
      onNavigate('favorites');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 sm:px-8 shadow-xs flex items-center justify-between transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
            id="brand-logo"
          >
            <div className="w-10 h-10 bg-teal-600 dark:bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div className="flex flex-col text-start">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-teal-600 dark:text-teal-400 tracking-tight leading-none">
                  {t.appName}
                </span>
                <span className="text-violet-500 font-bold text-base">✓</span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-wider uppercase mt-0.5">
                7allaha
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              type="button"
              onClick={() => handleLinkClick('home')}
              className={`transition-colors py-1 cursor-pointer ${
                activeRoute === 'home' || activeRoute === ''
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}
            >
              {t.navHome}
            </button>

            {/* Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`flex items-center gap-1 transition-colors py-1 cursor-pointer ${
                  activeRoute.startsWith('tool/') || isToolsOpen
                    ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}
                aria-expanded={isToolsOpen}
              >
                <span>{t.navTools}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180 text-teal-600 dark:text-teal-400' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isToolsOpen && (
                <div className={`absolute top-full ${language === 'ar' ? 'right-0 text-right' : 'left-0 text-left'} mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}>
                  <div className="text-xs font-bold text-violet-500 dark:text-violet-400 px-3 py-1.5 uppercase tracking-wider">
                    {t.browseByCategory} ({TOOLS.length})
                  </div>
                  <div className="space-y-1 mt-1">
                    {CATEGORIES.map((cat) => {
                      const count = TOOLS.filter((t) => t.category === cat.id).length;
                      const catName = language === 'en' ? (cat.nameEn || cat.name) : cat.name;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleCategoryClick(cat.id)}
                          className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors text-start group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${cat.badgeBg || 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400'} flex items-center justify-center`}>
                              <DynamicIcon name={cat.iconName || cat.icon || 'Sparkles'} className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                {catName}
                              </div>
                              <div className="text-xs text-slate-400 dark:text-slate-500 font-tajawal">
                                {count} {t.freeToolsSub}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-2">
                    <button
                      type="button"
                      onClick={() => handleLinkClick('home')}
                      className="w-full text-center text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 py-1.5 block cursor-pointer"
                    >
                      {t.viewAllTools}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleLinkClick('blog')}
              className={`transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
                activeRoute === 'blog' || activeRoute.startsWith('blog/')
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}
            >
              <span>{t.navBlog}</span>
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('faq')}
              className={`transition-colors py-1 cursor-pointer ${
                activeRoute === 'faq'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}
            >
              {t.navFaq}
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('about')}
              className={`transition-colors py-1 cursor-pointer ${
                activeRoute === 'about'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}
            >
              {t.navAbout}
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('contact')}
              className={`transition-colors py-1 cursor-pointer ${
                activeRoute === 'contact'
                  ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}
            >
              {t.navContact}
            </button>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            title={t.navSearchPlaceholder}
          >
            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">{t.navSearchShort}</span>
            <kbd className="hidden lg:inline-block bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded text-[10px] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Language Switcher Button (Arabic / English) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-200 dark:border-teal-800 transition-all cursor-pointer"
            title={language === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
            aria-label="تبديل اللغة Language Switch"
          >
            <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-amber-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-amber-500 dark:hover:text-amber-300 transition-all cursor-pointer"
            title={theme === 'dark' ? t.toggleThemeLight : t.toggleThemeDark}
            aria-label="تبديل الوضع الليلي والنهاري"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 transition-transform hover:-rotate-12 text-slate-700" />
            )}
          </button>

          {/* Favorites Button */}
          <button
            type="button"
            onClick={handleOpenFavs}
            className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
              activeRoute === 'favorites'
                ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400'
                : 'text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={t.navFavorites}
          >
            <Bookmark className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Support / Free badge CTA */}
          <button
            type="button"
            onClick={() => handleLinkClick('contact')}
            className="hidden sm:inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>{t.badge100Free}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            aria-label="القائمة الرئيسية"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 left-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl z-50">
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleLinkClick('home')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 text-start cursor-pointer"
            >
              <Home className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>{t.navHome}</span>
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('favorites')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 text-start cursor-pointer"
            >
              <Bookmark className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <span>{t.navFavorites} ({favoritesCount})</span>
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 text-start cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>{language === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-bold">
                {language === 'ar' ? 'Switch to EN' : 'التحويل للعربية'}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 text-start cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-teal-600" />
                )}
                <span>{theme === 'dark' ? (language === 'ar' ? 'الوضع المظلم (نشط)' : 'Dark mode (Active)') : (language === 'ar' ? 'الوضع الفاتح (نشط)' : 'Light mode (Active)')}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal">
                {language === 'ar' ? 'تبديل' : 'Toggle'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('blog')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 text-start cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <span>{t.navBlog}</span>
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('faq')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 text-start cursor-pointer"
            >
              <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>{t.navFaq}</span>
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('about')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 text-start cursor-pointer"
            >
              <Info className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <span>{t.navAbout}</span>
            </button>

            <button
              type="button"
              onClick={() => handleLinkClick('contact')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-slate-800 dark:text-slate-200 hover:bg-teal-50 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400 text-start cursor-pointer"
            >
              <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>{t.navContact}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 px-3 py-1.5 uppercase">
              {t.categoriesMenuTitle}
            </div>
            <div className="grid grid-cols-1 gap-1 mt-1">
              {CATEGORIES.map((cat) => {
                const catName = language === 'en' ? (cat.nameEn || cat.name) : cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.id)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-start cursor-pointer"
                  >
                    <div className={`w-7 h-7 rounded-lg ${cat.badgeBg || 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400'} flex items-center justify-center`}>
                      <DynamicIcon name={cat.iconName || cat.icon || 'Sparkles'} className="w-4 h-4" />
                    </div>
                    <span>{catName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

