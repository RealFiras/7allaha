import React, { useState, useEffect } from 'react';
import { History, ArrowLeft, Trash2, Sparkles } from 'lucide-react';
import { TOOLS } from '../data/toolsData';
import { DynamicIcon } from './DynamicIcon';
import { ToolDefinition } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface RecentlyUsedProps {
  onSelectTool: (id: string) => void;
}

const RECENTLY_USED_STORAGE_KEY = '7allaha_recently_used_tools';

export const saveRecentlyUsedTool = (toolId: string) => {
  try {
    const raw = localStorage.getItem(RECENTLY_USED_STORAGE_KEY) || localStorage.getItem('adawaty_recently_used_tools');
    let list: string[] = raw ? JSON.parse(raw) : [];
    // Remove if already exists to push to front
    list = list.filter((id) => id !== toolId);
    list.unshift(toolId);
    // Keep max 8
    list = list.slice(0, 8);
    localStorage.setItem(RECENTLY_USED_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving recently used tool:', e);
  }
};

export const RecentlyUsed: React.FC<RecentlyUsedProps> = ({ onSelectTool }) => {
  const [recentTools, setRecentTools] = useState<ToolDefinition[]>([]);
  const { language, t } = useLanguage();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENTLY_USED_STORAGE_KEY) || localStorage.getItem('adawaty_recently_used_tools');
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        const matched = ids
          .map((id) => TOOLS.find((t) => t.id === id))
          .filter((t): t is ToolDefinition => Boolean(t));
        setRecentTools(matched);
      }
    } catch (e) {
      console.error('Error loading recently used tools:', e);
    }
  }, []);

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(RECENTLY_USED_STORAGE_KEY);
      localStorage.removeItem('adawaty_recently_used_tools');
      setRecentTools([]);
    } catch (e) {
      console.error(e);
    }
  };

  if (recentTools.length === 0) return null;

  return (
    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-violet-600 dark:text-violet-400">
              {t.recentlyUsedTitle}
            </h2>
            <span className="text-xs text-slate-400">
              {language === 'ar' ? 'سجل وصولك السريع للأدوات السابقة' : 'Quick access to your previously opened tools'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={clearHistory}
          className="text-xs text-slate-400 hover:text-rose-500 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          title={t.clearHistory}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.clearHistory}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {recentTools.map((tool) => {
          const name = language === 'en' ? (tool.nameEn || tool.name) : tool.name;
          const desc = language === 'en' ? (tool.shortDescriptionEn || tool.shortDescription) : tool.shortDescription;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelectTool(tool.id)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-xs transition-all text-start flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <DynamicIcon name={tool.iconName} className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate block group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate block">
                  {desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

