import React from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const { language, t } = useLanguage();
  const Separator = language === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <nav aria-label={language === 'ar' ? 'مسار التنقل' : 'Breadcrumb'} className="flex items-center text-sm text-slate-500 dark:text-slate-400 py-3 overflow-x-auto whitespace-nowrap">
      <ol className="flex items-center gap-1.5 list-none p-0 m-0">
        <li className="flex items-center">
          <a
            href="#/"
            onClick={(e) => {
              if (items[0]?.onClick) {
                e.preventDefault();
                items[0].onClick();
              }
            }}
            className="flex items-center gap-1 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{t.breadcrumbHome}</span>
          </a>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <Separator className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              {isLast ? (
                <span className="font-semibold text-slate-800 dark:text-slate-200" aria-current="page">
                  {item.label}
                </span>
              ) : item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <a href={item.href || '#/'} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};


