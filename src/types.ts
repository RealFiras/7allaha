export type ToolCategory = 'all' | 'images' | 'calculators' | 'converters' | 'text' | 'security' | 'islamic';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  nameEn?: string;
  description: string;
  iconName: string;
  icon?: string;
  color: string;
  badgeBg: string;
}

export interface FaqItem {
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  path: string;
  name: string;
  nameEn?: string;
  shortDescription: string;
  shortDescriptionEn?: string;
  category: ToolCategory;
  iconName: string;
  icon?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  
  // SEO & Content fields (Minimum 300 words rich Arabic content)
  seoTitle: string;
  seoTitleEn?: string;
  whatIsIt: string;
  whatIsItEn?: string;
  howToUse: string[];
  howToUseEn?: string[];
  whoIsItFor: string[];
  whoIsItForEn?: string[];
  features: string[];
  featuresEn?: string[];
  faqs: FaqItem[];
  relatedToolIds: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string; // Rich markdown or structured paragraphs
  category: string;
  categoryEn?: string;
  author: string;
  authorRole: string;
  publishDate: string;
  readingTimeMinutes: number;
  coverImage?: string;
  tags: string[];
  relatedToolIds: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface GeneralFaqCategory {
  id: string;
  title: string;
  titleEn?: string;
  iconName: string;
  items: FaqItem[];
}
