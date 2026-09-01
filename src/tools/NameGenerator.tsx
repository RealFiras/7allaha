import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Bookmark, BookmarkCheck, Filter, Globe, Lightbulb } from 'lucide-react';
import { trackToolUsage, trackEvent } from '../lib/analytics';

const NAME_DATA = {
  tech: {
    ar: ['سحاب', 'منصة تِك', 'مِفتاح', 'سراج الرقمية', 'أفق كود', 'رؤية تك', 'مدار', 'إبداع تك', 'نبض التقنية', 'جسور تك', 'وميض', 'طليعة'],
    en: ['Cloudify', 'Nexar', 'DevPulse', 'StackZen', 'ByteForge', 'Syncora', 'CodeVibe', 'OmniTech', 'ApexLogic', 'DataNest', 'Quantix', 'VortexAI'],
  },
  ecommerce: {
    ar: ['سوقنا', 'دكان بلس', 'صفقة', 'سلة العرب', 'مخزنك', 'زاد المتجر', 'مشترياتي', 'تسوّق تك', 'ريادة مول', 'مزن شوب', 'وفرلي', 'بوابة العروض'],
    en: ['Cartly', 'ShopWave', 'Zendrop', 'BazaarHub', 'DealNest', 'OmniStore', 'BuySphere', 'TrendMart', 'QuickCart', 'SwiftShip', 'PrimeBay', 'VibeMarket'],
  },
  health: {
    ar: ['عافية', 'بلسم', 'نبض صحي', 'شفاء', 'رعاية بلس', 'ترياق', 'حياة صحية', 'لياقة', 'غذاء ونقاء', 'أثير الصحة', 'زاد الطبيعة', 'صحتك اليوم'],
    en: ['NutriZen', 'VitalPulse', 'HealSphere', 'FitNest', 'PureLife', 'GlowMed', 'CuraHub', 'BioVibe', 'AuraHealth', 'WellGen', 'OptimaFit', 'ZenCure'],
  },
  creative: {
    ar: ['ريشة', 'بصمة', 'إلهام ديزاين', 'فن وابتكار', 'رسمة', 'طراز', 'هوية', 'ألوان ميديا', 'نواة الإبداع', 'لوحة', 'شغف', 'فكرة ونور'],
    en: ['PixelCraft', 'VibeStudio', 'ArtisanLab', 'ChromaZen', 'DesignFlow', 'LuminaArt', 'InkNest', 'BloomMedia', 'PrismForge', 'CreataVibe', 'AuraStudio', 'CanvasX'],
  },
  general: {
    ar: ['صدارة', 'إنجاز', 'طموح', 'أوج للأعمال', 'وثبة', 'روافد', 'منارة', 'بصائر', 'ركيزة', 'نماء', 'أركان', 'سند'],
    en: ['Vanguard', 'ApexVentures', 'PrimeScope', 'TrueHorizon', 'ZenithCorp', 'NovaBridge', 'StrataLab', 'OmniCore', 'NextEra', 'AxisGroup', 'PinnaclePro', 'Ascendia'],
  },
};

export const NameGenerator: React.FC = () => {
  const [industry, setIndustry] = useState<'tech' | 'ecommerce' | 'health' | 'creative' | 'general'>('tech');
  const [language, setLanguage] = useState<'all' | 'ar' | 'en'>('all');
  const [prefix, setPrefix] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [generatedNames, setGeneratedNames] = useState<string[]>([
    'سحاب تك', 'Nexar Studio', 'رؤية كود', 'Syncora Pro', 'مدار التقنية', 'ByteForge Hub'
  ]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const generateNames = () => {
    const listAr = NAME_DATA[industry].ar;
    const listEn = NAME_DATA[industry].en;

    let pool: string[] = [];
    if (language === 'ar') pool = listAr;
    else if (language === 'en') pool = listEn;
    else pool = [...listAr, ...listEn];

    // Shuffle and pick 10
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const results = shuffled.slice(0, 10).map((name) => {
      let finalName = name;
      if (prefix) finalName = `${prefix.trim()} ${finalName}`;
      if (suffix) finalName = `${finalName} ${suffix.trim()}`;
      return finalName;
    });

    setGeneratedNames(results);
    trackToolUsage('name-generator', 'مولد أسماء المشاريع والشركات', 'generate_names');
  };

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const toggleFavorite = (name: string) => {
    if (favorites.includes(name)) {
      setFavorites(favorites.filter((f) => f !== name));
    } else {
      setFavorites([...favorites, name]);
      trackEvent('name_favorited', { name });
    }
  };

  return (
    <div className="space-y-8">
      {/* Configuration Panel */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
              تحديد مجال المشروع واللغة
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Industry */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              مجال وفئة المشروع:
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-xs cursor-pointer"
            >
              <option value="tech">تقنية وبرمجيات (Tech & SaaS)</option>
              <option value="ecommerce">تجارة إلكترونية ومتاجر (E-commerce)</option>
              <option value="health">صحة ولياقة ورعاية (Health & Fitness)</option>
              <option value="creative">تصميم وإبداع وإعلام (Creative & Media)</option>
              <option value="general">شركات وأعمال عامة (Business & Startups)</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              لغة الأسماء المطلوبة:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-xs cursor-pointer"
            >
              <option value="all">مزيج (عربي وإنجليزي عالمي)</option>
              <option value="ar">أسماء عربية أصيلة وعصرية</option>
              <option value="en">أسماء بالإنجليزية (Global / SaaS)</option>
            </select>
          </div>

          {/* Optional Prefix */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              بادئة مخصصة (Prefix اختياري):
            </label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="مثال: شركة، Smart، منصة"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold"
            />
          </div>

          {/* Optional Suffix */}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              لاحقة مخصصة (Suffix اختياري):
            </label>
            <input
              type="text"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              placeholder="مثال: تك، Hub، بلس، برو"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={generateNames}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>توليد دفعة جديدة من الأسماء الإبداعية</span>
        </button>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
            الأسماء المقترحة ({generatedNames.length})
          </h3>
          <span className="text-xs text-gray-400">انقر لنسخ الاسم أو حفظه في المفضلة</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {generatedNames.map((name, idx) => {
            const isFav = favorites.includes(name);
            const isCopied = copiedName === name;

            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-4 shadow-xs flex items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
              >
                <span className="text-sm font-extrabold text-gray-900 dark:text-white truncate">
                  {name}
                </span>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => copyName(name)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    title="نسخ الاسم"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleFavorite(name)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isFav
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-500'
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-amber-50 text-gray-400 hover:text-amber-500'
                    }`}
                    title={isFav ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                  >
                    {isFav ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Favorites Section */}
      {favorites.length > 0 && (
        <div className="bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-black">
            <BookmarkCheck className="w-4 h-4" />
            <span>الأسماء المفضلة المحفوظة ({favorites.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites.map((fav, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"
              >
                <span>{fav}</span>
                <button
                  type="button"
                  onClick={() => toggleFavorite(fav)}
                  className="text-gray-400 hover:text-red-500 text-xs cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
