import React from 'react';
import { Star, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { Breadcrumb } from '../components/Breadcrumb';
import { DynamicIcon } from '../components/DynamicIcon';
import { TOOLS } from '../data/toolsData';
import { useLanguage } from '../context/LanguageContext';

interface FavoritesPageProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectTool: (id: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  favorites,
  onToggleFavorite,
  onSelectTool,
}) => {
  const { language, t } = useLanguage();
  const favoriteTools = TOOLS.filter((t) => favorites.includes(t.id));
  const Arrow = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      <Breadcrumb items={[{ label: t.favTitle }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
            <span>{t.favTitle}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-tajawal">
            {t.favDesc}
          </p>
        </div>

        <span className="text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-full">
          {favoriteTools.length} {language === 'ar' ? 'أدوات محفوظة' : 'saved tools'}
        </span>
      </div>

      {favoriteTools.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center space-y-4 shadow-xs transition-colors">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto">
            <Star className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t.favEmptyTitle}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto font-tajawal">
            {t.favEmptyDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteTools.map((tool) => {
            const name = language === 'en' ? (tool.nameEn || tool.name) : tool.name;
            const desc = language === 'en' ? (tool.shortDescriptionEn || tool.shortDescription) : tool.shortDescription;
            return (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-600 transition-all cursor-pointer relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <DynamicIcon name={tool.iconName || tool.icon || 'Sparkles'} className="w-6 h-6" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(tool.id);
                      }}
                      className="p-2 text-amber-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title={t.favRemoveBtn}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-tajawal line-clamp-2 mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                  <span>{t.useToolBtn}</span>
                  <Arrow className={`w-4 h-4 transform ${language === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


