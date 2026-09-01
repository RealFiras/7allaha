import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Star, 
  ArrowLeft, 
  Flame, 
  Zap, 
  Share2, 
  Check, 
  HelpCircle,
  TrendingUp,
  LayoutGrid,
  Heart,
  BookOpen,
  Wrench
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { Breadcrumb } from './components/Breadcrumb';
import { SeoArticle } from './components/SeoArticle';
import { DynamicIcon } from './components/DynamicIcon';
import { SocialShare } from './components/SocialShare';
import { AdBanner } from './components/AdBanner';
import { RecentlyUsed, saveRecentlyUsedTool } from './components/RecentlyUsed';

import { TOOLS, CATEGORIES } from './data/toolsData';
import { ToolDefinition, ToolCategory } from './types';

// Original Tools
import { BmiCalculator } from './tools/BmiCalculator';
import { EmiCalculator } from './tools/EmiCalculator';
import { AgeCalculator } from './tools/AgeCalculator';
import { PercentageCalculator } from './tools/PercentageCalculator';
import { UnitConverter } from './tools/UnitConverter';
import { CurrencyConverter } from './tools/CurrencyConverter';
import { WordCounter } from './tools/WordCounter';
import { JsonFormatter } from './tools/JsonFormatter';
import { Base64Tool } from './tools/Base64Tool';
import { TextDiffTool } from './tools/TextDiffTool';
import { PasswordGenerator } from './tools/PasswordGenerator';
import { QrGenerator } from './tools/QrGenerator';
import { PrayerTimes } from './tools/PrayerTimes';
import { HijriConverter } from './tools/HijriConverter';

// New High-Demand Tools
import { ZakatCalculator } from './tools/ZakatCalculator';
import { InvoiceGenerator } from './tools/InvoiceGenerator';
import { ImageResizer } from './tools/ImageResizer';
import { ImageConverter } from './tools/ImageConverter';
import { BackgroundRemover } from './tools/BackgroundRemover';
import { NameGenerator } from './tools/NameGenerator';
import { CalorieCalculator } from './tools/CalorieCalculator';
import { PomodoroTimer } from './tools/PomodoroTimer';
import { TimezoneConverter } from './tools/TimezoneConverter';

// Static & Content Pages
import { BlogListPage } from './pages/BlogListPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { FaqPage } from './pages/FaqPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CookieConsent } from './components/CookieConsent';
import { trackPageView, trackToolUsage } from './lib/analytics';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Favorites state stored in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('adawaty_favorites');
      return saved ? JSON.parse(saved) : ['bmi-calculator', 'zakat-calculator', 'invoice-generator', 'calorie-calculator'];
    } catch {
      return ['bmi-calculator', 'zakat-calculator', 'invoice-generator', 'calorie-calculator'];
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('adawaty_favorites', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Synchronize hash routing with state and track pageviews
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const route = hash || 'home';
      setCurrentRoute(route);
      trackPageView(`/${route}`);

      // Track recently used if it's a tool route
      if (route.startsWith('tool/')) {
        const toolId = route.replace('tool/', '');
        saveRecentlyUsedTool(toolId);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = `#/${route}`;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut (Cmd+K / Ctrl+K) for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools for homepage
  const filteredTools = TOOLS.filter((tool) => {
    const matchCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const featuredTools = TOOLS.filter((t) => t.isPopular || t.isFeatured);

  // Render active tool component
  const renderToolComponent = (toolId: string) => {
    switch (toolId) {
      case 'bmi-calculator':
        return <BmiCalculator />;
      case 'emi-calculator':
        return <EmiCalculator />;
      case 'age-calculator':
        return <AgeCalculator />;
      case 'percentage-calculator':
        return <PercentageCalculator />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'currency-converter':
        return <CurrencyConverter />;
      case 'word-counter':
        return <WordCounter />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'base64':
      case 'base64-encode-decode':
      case 'base64-tool':
        return <Base64Tool />;
      case 'text-diff':
        return <TextDiffTool />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'qr-generator':
      case 'qr-code-generator':
        return <QrGenerator />;
      case 'prayer-times':
        return <PrayerTimes />;
      case 'hijri-converter':
        return <HijriConverter />;
      case 'zakat-calculator':
        return <ZakatCalculator />;
      case 'invoice-generator':
        return <InvoiceGenerator />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'image-converter':
        return <ImageConverter />;
      case 'background-remover':
        return <BackgroundRemover />;
      case 'name-generator':
        return <NameGenerator />;
      case 'calorie-calculator':
        return <CalorieCalculator />;
      case 'pomodoro-timer':
        return <PomodoroTimer />;
      case 'timezone-converter':
        return <TimezoneConverter />;
      default:
        return null;
    }
  };

  const handleShareTool = (tool: ToolDefinition) => {
    if (navigator.share) {
      navigator.share({
        title: tool.name,
        text: tool.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Resolve current active tool if in tool page
  const isToolRoute = currentRoute.startsWith('tool/');
  const currentToolId = isToolRoute ? currentRoute.replace('tool/', '') : null;
  const currentTool = currentToolId ? TOOLS.find((t) => t.id === currentToolId) : null;

  // Resolve blog post route
  const isBlogDetailRoute = currentRoute.startsWith('blog/');
  const currentBlogSlug = isBlogDetailRoute ? currentRoute.replace('blog/', '') : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-tajawal antialiased selection:bg-teal-600 selection:text-white transition-colors duration-200" dir="rtl">
      
      {/* Top Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={navigateTo}
        currentRoute={currentRoute}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Route 1: Homepage */}
        {currentRoute === 'home' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            
            {/* Hero Section with Teal-to-Violet gradient */}
            <div className="relative overflow-hidden bg-white dark:bg-slate-900 py-14 px-6 sm:px-12 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm text-center space-y-6 transition-colors">
              {/* Subtle background glow effect */}
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-3xl -z-0 pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto space-y-5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-teal-50 to-violet-50 dark:from-teal-950/60 dark:to-violet-950/60 text-teal-800 dark:text-teal-300 rounded-full text-xs font-bold border border-teal-100/80 dark:border-teal-900/50 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>حلّها — منصة الأدوات الذكية والمجانية 100%</span>
                </span>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                  أي مشكلة... <span className="bg-gradient-to-r from-teal-600 via-teal-500 to-violet-600 bg-clip-text text-transparent">حلّها بثانية</span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                  أدوات مجانية يومية بضغطة زر
                </p>

                {/* Hero Search Box */}
                <div className="max-w-xl mx-auto relative pt-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث عن أداة (مثال: زكاة المال، فواتير، ضغط صور، سعرات حرارية، بومودورو)..."
                      className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-bold text-sm sm:text-base border border-slate-200 dark:border-slate-700 focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-950 shadow-xs focus:outline-none transition-all"
                    />
                    <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Quick trending tags */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-400 dark:text-slate-500">الأكثر طلباً:</span>
                  {featuredTools.slice(0, 5).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => navigateTo(`tool/${t.id}`)}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 hover:text-teal-600 dark:hover:text-teal-400 text-slate-600 dark:text-slate-300 transition-colors font-medium border border-slate-200/60 dark:border-slate-700 cursor-pointer"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Google AdSense Responsive Banner Slot */}
            <AdBanner format="horizontal" />

            {/* Recently Used Tools Quick Access */}
            <RecentlyUsed onSelectTool={(id) => navigateTo(`tool/${id}`)} />

            {/* Categories & Filter Bar */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <h2 className="text-xl sm:text-2xl font-black text-violet-600 dark:text-violet-400">
                    تصفح تصنيفات الأدوات ({TOOLS.length} أداة)
                  </h2>
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-bold cursor-pointer"
                  >
                    إلغاء البحث ({filteredTools.length} نتيجة)
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as ToolCategory)}
                      className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap border cursor-pointer ${
                        isActive
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <DynamicIcon name={cat.iconName || cat.icon || 'Sparkles'} className="w-4 h-4" />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tools Grid */}
              {filteredTools.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4 shadow-xs">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-violet-600 dark:text-violet-400">
                    لم نتمكن من العثور على نتائج لـ "{searchQuery}"
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
                    جرب البحث بكلمات أخرى أو تصفح الأقسام الكاملة من الأزرار أعلاه.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredTools.map((tool) => {
                    const isFav = favorites.includes(tool.id);
                    return (
                      <div
                        key={tool.id}
                        onClick={() => navigateTo(`tool/${tool.id}`)}
                        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                      >
                        {(tool.isPopular || tool.isFeatured) && (
                          <div className="absolute top-0 left-0 bg-violet-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-br-xl shadow-xs">
                            شائع
                          </div>
                        )}

                        <div>
                          {/* Card Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-xs">
                              <DynamicIcon name={tool.iconName || tool.icon || 'Sparkles'} className="w-6 h-6" />
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(tool.id);
                              }}
                              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                isFav
                                  ? 'text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-950/50'
                                  : 'text-slate-300 dark:text-slate-600 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                              title={isFav ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                            >
                              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                            </button>
                          </div>

                          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {tool.name}
                          </h3>

                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-tajawal line-clamp-2 mt-1.5 leading-relaxed">
                            {tool.shortDescription}
                          </p>
                        </div>

                        {/* Card Footer */}
                        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                          <span>استخدم الأداة</span>
                          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1.5 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Ad after tools grid */}
            <AdBanner format="horizontal" />

            {/* Why Choose 7allaha Banner */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 shadow-xs transition-colors">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-violet-600 dark:text-violet-400">
                  لماذا يثق بنا المستخدم العربي في منصة حلّها؟
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                  تم تطوير موقع حلّها (7allaha) لتوفير تجربة عربية فائقة السرعة وعالية الدقة لجميع الأدوات اليومية، بدون أي إعلانات منبثقة مزعجة أو رسوم خفية، وبحماية تامة لبياناتك الشخصية داخل جهازك.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-center">
                  <div className="p-4 bg-teal-50/60 dark:bg-teal-950/40 rounded-2xl border border-teal-100/50 dark:border-teal-900/50">
                    <span className="text-2xl font-black text-teal-600 dark:text-teal-400 block">100%</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">مجاني مدى الحياة</span>
                  </div>
                  <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/50">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">0 ثانية</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">معالجة فورية</span>
                  </div>
                  <div className="p-4 bg-violet-50/60 dark:bg-violet-950/40 rounded-2xl border border-violet-100/50 dark:border-violet-900/50">
                    <span className="text-2xl font-black text-violet-600 dark:text-violet-400 block">21+</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">أداة متنوعة</span>
                  </div>
                  <div className="p-4 bg-amber-50/60 dark:bg-amber-950/40 rounded-2xl border border-amber-100/50 dark:border-amber-900/50">
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block">آمن 100%</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">خصوصية تامة</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Route 2: Specific Tool Page */}
        {isToolRoute && currentTool && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
            
            {/* Breadcrumb Navigation */}
            <Breadcrumb
              items={[
                { label: 'الأدوات', href: '#/' },
                { label: currentTool.name },
              ]}
            />

            {/* Tool Header Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <DynamicIcon name={currentTool.iconName || currentTool.icon || 'Sparkles'} className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {currentTool.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-tajawal mt-1 leading-relaxed">
                    {currentTool.shortDescription}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Favorite */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleFavorite(currentTool.id)}
                  className={`p-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                    favorites.includes(currentTool.id)
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  title="المفضلة"
                >
                  <Star className={`w-4 h-4 ${favorites.includes(currentTool.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{favorites.includes(currentTool.id) ? 'محفوظ' : 'حفظ'}</span>
                </button>
              </div>
            </div>

            {/* Social Share Bar */}
            <SocialShare title={currentTool.name} />

            {/* Interactive Tool Implementation */}
            <div className="w-full">
              {renderToolComponent(currentTool.id)}
            </div>

            {/* In-article AdSense Banner Placeholder */}
            <AdBanner format="in-feed" />

            {/* Rich SEO Content & FAQ Accordion Component */}
            <SeoArticle tool={currentTool} />

            {/* Related Tools Recommendation with Direct Links */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-xl font-bold text-violet-600 dark:text-violet-400">
                  أدوات وحاسبات مرتبطة بـ ({currentTool.name}):
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(currentTool.relatedToolIds && currentTool.relatedToolIds.length > 0
                  ? currentTool.relatedToolIds.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean)
                  : TOOLS.filter((t) => t.id !== currentTool.id).slice(0, 3)
                ).map((relTool) => relTool && (
                  <div
                    key={relTool.id}
                    onClick={() => navigateTo(`tool/${relTool.id}`)}
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <DynamicIcon name={relTool.iconName || relTool.icon || 'Sparkles'} className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate block group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        {relTool.name}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate block">
                        {relTool.shortDescription}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom ad on tool pages */}
            <AdBanner format="rectangle" />

          </div>
        )}

        {/* Route 3: Blog List Page */}
        {currentRoute === 'blog' && (
          <BlogListPage onSelectPost={(slug) => navigateTo(`blog/${slug}`)} />
        )}

        {/* Route 4: Single Blog Post Page */}
        {isBlogDetailRoute && currentBlogSlug && (
          <BlogPostPage slug={currentBlogSlug} onNavigate={navigateTo} />
        )}

        {/* Route 5: General FAQ Page */}
        {currentRoute === 'faq' && (
          <FaqPage onNavigate={navigateTo} />
        )}

        {/* Route 6: Favorites */}
        {currentRoute === 'favorites' && (
          <FavoritesPage
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSelectTool={(id) => navigateTo(`tool/${id}`)}
          />
        )}

        {/* Route 7: About */}
        {currentRoute === 'about' && <AboutPage />}

        {/* Route 8: Contact */}
        {currentRoute === 'contact' && <ContactPage />}

        {/* Route 9: Privacy Policy */}
        {currentRoute === 'privacy-policy' && <PrivacyPolicyPage />}

        {/* Route 10: Terms of Service */}
        {currentRoute === 'terms' && <TermsPage />}

      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Global Quick Search Modal (Cmd+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={(id) => navigateTo(`tool/${id}`)}
      />

      {/* GDPR / Privacy Cookie Consent Banner */}
      <CookieConsent onNavigate={navigateTo} />

    </div>
  );
}

export default App;
