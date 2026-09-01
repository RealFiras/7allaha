import React from 'react';
import { Clock, Calendar, ArrowRight, ArrowLeft, UserCheck, Tag, Wrench } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';
import { TOOLS } from '../data/toolsData';
import { Breadcrumb } from '../components/Breadcrumb';
import { SocialShare } from '../components/SocialShare';
import { AdBanner } from '../components/AdBanner';
import { DynamicIcon } from '../components/DynamicIcon';
import { useLanguage } from '../context/LanguageContext';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate }) => {
  const { language, t } = useLanguage();
  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  const postTitle = (language === 'en' && post.titleEn) ? post.titleEn : post.title;
  const postCategory = (language === 'en' && post.categoryEn) ? post.categoryEn : post.category;

  // Resolve related tools
  const relatedTools = (post.relatedToolIds || [])
    .map((id) => TOOLS.find((toolItem) => toolItem.id === id))
    .filter(Boolean);

  const ArrowBackIcon = language === 'ar' ? ArrowRight : ArrowLeft;

  // Simple Markdown paragraph formatter
  const renderFormattedContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-8 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('#### ')) {
        elements.push(
          <h4 key={index} className="text-lg font-bold text-violet-600 dark:text-violet-400 mt-6 mb-2">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        elements.push(
          <li key={index} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-tajawal pr-4 list-disc mr-4 mb-2">
            {trimmed.replace(/^(\*|-)\s+/, '')}
          </li>
        );
      } else if (trimmed.startsWith('---')) {
        elements.push(<hr key={index} className="my-8 border-slate-200 dark:border-slate-800" />);
      } else {
        elements.push(
          <p key={index} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-tajawal leading-relaxed mb-4">
            {trimmed}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Breadcrumb
        items={[
          { label: t.navBlog, href: '#/blog' },
          { label: postTitle },
        ]}
      />

      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate('blog')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors cursor-pointer"
      >
        <ArrowBackIcon className="w-4 h-4" />
        <span>{language === 'ar' ? 'العودة لكافة المقالات' : 'Back to all articles'}</span>
      </button>

      {/* Main Article Card */}
      <article className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-12 shadow-xs space-y-8 transition-colors">
        
        {/* Header Metadata */}
        <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-extrabold border border-teal-200 dark:border-teal-800">
              {postCategory}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {language === 'ar'
                  ? `قراءة ${post.readingTimeMinutes} دقائق`
                  : `${post.readingTimeMinutes} min read`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {language === 'ar' ? `نُشر بتاريخ: ${post.publishDate}` : `Published: ${post.publishDate}`}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
            {postTitle}
          </h1>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black text-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {post.author}
              </span>
              <span className="text-[11px] text-slate-400 block">{post.authorRole}</span>
            </div>
          </div>
        </div>

        {/* Social Share Bar */}
        <SocialShare title={postTitle} />

        {/* AdSense Top In-Content Slot */}
        <AdBanner format="in-feed" />

        {/* Article Body Content */}
        <div className="prose prose-slate max-w-none">
          {renderFormattedContent(post.content)}
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 ml-2">
            <Tag className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الكلمات المفتاحية:' : 'Keywords:'}</span>
          </div>
          {post.tags.map((tagItem, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
            >
              #{tagItem}
            </span>
          ))}
        </div>

        {/* Related Tools Callout Box */}
        {relatedTools.length > 0 && (
          <div className="bg-teal-50/70 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800/80 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {language === 'ar'
                  ? 'أدوات وحاسبات مرتبطة بهذا المقال (جربها مجاناً في حلّها):'
                  : 'Tools related to this article (Try them free on 7allaha):'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {relatedTools.map((tool) => tool && (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onNavigate(`tool/${tool.id}`)}
                  className={`p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-200/80 dark:border-slate-800 hover:border-teal-500 hover:shadow-xs transition-all ${language === 'ar' ? 'text-right' : 'text-left'} flex items-center gap-3 cursor-pointer group`}
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                    <DynamicIcon name={tool.iconName} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate block group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      {language === 'en' && tool.nameEn ? tool.nameEn : tool.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {language === 'ar' ? 'استخدم الأداة الآن' : 'Use tool now'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </article>

      {/* Bottom AdSense Banner */}
      <AdBanner format="horizontal" />
    </div>
  );
};

