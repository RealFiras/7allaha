import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { ToolDefinition } from '../types';
import { TOOLS } from '../data/toolsData';
import { DynamicIcon } from './DynamicIcon';
import { useLanguage } from '../context/LanguageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools?: ToolDefinition[];
  onSelectTool: (toolId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tools = TOOLS,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toolList = tools || TOOLS;
  const qLower = query.toLowerCase().trim();
  const filteredTools = toolList.filter((tool) => {
    if (!qLower) return true;
    const nameMatch = tool.name.toLowerCase().includes(qLower) || (tool.nameEn && tool.nameEn.toLowerCase().includes(qLower));
    const descMatch = tool.shortDescription.toLowerCase().includes(qLower) || (tool.shortDescriptionEn && tool.shortDescriptionEn.toLowerCase().includes(qLower));
    const kwMatch = tool.keywords.some((k) => k.toLowerCase().includes(qLower));
    return nameMatch || descMatch || kwMatch;
  });

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchModalPlaceholder}
            className="w-full text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent text-base focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 font-semibold transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredTools.length > 0 ? (
            <div className="space-y-1">
              {filteredTools.map((tool) => {
                const displayName = language === 'en' ? (tool.nameEn || tool.name) : tool.name;
                const displayDesc = language === 'en' ? (tool.shortDescriptionEn || tool.shortDescription) : tool.shortDescription;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      onSelectTool(tool.id);
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl hover:bg-teal-50/70 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between text-start group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <DynamicIcon name={tool.iconName} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {displayName}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {displayDesc}
                        </div>
                      </div>
                    </div>
                    <ArrowIcon className={`w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-400 ${language === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-all`} />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-2">
              <p className="text-sm">{t.noToolsFound} "{query}"</p>
              <p className="text-xs">{t.tryAnotherKeyword}</p>
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>{t.liveSearchResults} ({filteredTools.length})</span>
          <span>{t.pressEscToClose}</span>
        </div>
      </div>
    </div>
  );
};


