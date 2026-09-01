import React, { useState } from 'react';
import { BookOpen, Clock, Calendar, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';
import { Breadcrumb } from '../components/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

interface BlogListPageProps {
  onSelectPost: (slug: string) => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({ onSelectPost }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const { language, t } = useLanguage();

  // Extract all unique tags
  const allTags = Array.from(new Set(BLOG_POSTS.flatMap((p) => p.tags)));

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const postTitle = (language === 'en' && post.titleEn) ? post.titleEn : post.title;
    const postExcerpt = (language === 'en' && post.excerptEn) ? post.excerptEn : post.excerpt;

    const matchesSearch =
      postTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      postExcerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Breadcrumb items={[{ label: t.navBlog }]} />

      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
          <BookOpen className="w-4 h-4" />
          <span>{language === 'ar' ? 'مدونة حلّها المعرفية والتعليمية' : '7allaha Educational & Knowledge Blog'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {language === 'ar' ? 'مقالات ودلائل إرشادية متخصصة' : 'Specialized Articles & Guides'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-tajawal leading-relaxed">
          {language === 'ar'
            ? 'دليلك المالي والصحي والتقني لفهم الحسابات المعقدة، مضاعفة إنتاجيتك، واختيار أفضل الحلول الرقمية لعملك وصحتك.'
            : 'Your financial, health, and technical guide to understanding calculations, tripling productivity, and choosing the best digital tools.'}
        </p>
      </div>

      {/* Search & Tag Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="relative">
          <Search className={`w-5 h-5 text-slate-400 absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث في المقالات والمواضيع (مثال: قروض، BMI، زكاة، بومودورو، ضغط صور)...'
                : 'Search articles and guides (e.g. loans, BMI, Zakat, Pomodoro, image compression)...'
            }
            className={`w-full ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500`}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-400">
            {language === 'ar' ? 'المواضيع الشائعة:' : 'Popular Topics:'}
          </span>
          <button
            type="button"
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              selectedTag === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {language === 'ar' ? 'الكل' : 'All'}
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => {
          const title = (language === 'en' && post.titleEn) ? post.titleEn : post.title;
          const excerpt = (language === 'en' && post.excerptEn) ? post.excerptEn : post.excerpt;
          const category = (language === 'en' && post.categoryEn) ? post.categoryEn : post.category;

          return (
            <article
              key={post.id}
              onClick={() => onSelectPost(post.slug)}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 transition-all flex flex-col justify-between space-y-5 cursor-pointer group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-extrabold border border-teal-200 dark:border-teal-800">
                    {category}
                  </span>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {language === 'ar'
                        ? `قراءة ${post.readingTimeMinutes} دقائق`
                        : `${post.readingTimeMinutes} min read`}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
                  {title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-tajawal line-clamp-3">
                  {excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{post.publishDate}</span>
                </div>

                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1 transition-transform">
                  <span>{language === 'ar' ? 'اقرأ المقال بالكامل' : 'Read full article'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
