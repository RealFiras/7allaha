#!/usr/bin/env node
// Generate SEO articles via Groq for tools that need more coverage
// Usage: node scripts/generate-seo-articles.mjs

import fs from 'fs';
import path from 'path';

const GROQ_KEY = process.env.VITE_GROQ_API_KEY || fs.readFileSync('.env.local','utf8').match(/VITE_GROQ_API_KEY="([^"]+)"/)?.[1] || '';
if (!GROQ_KEY) { console.error('Missing GROQ key'); process.exit(1); }

const TOOLS_NEEDING_ARTICLES = [
  { id: 'word-counter', name: 'عداد الكلمات والحروف', keywords: 'عدد الكلمات, عدد الحروف' },
  { id: 'unit-converter', name: 'محول الوحدات', keywords: 'تحويل وحدات, متر, كيلو' },
  { id: 'image-converter', name: 'محول صيغ الصور', keywords: 'تحويل صور, PNG JPG WebP' },
  { id: 'image-resizer', name: 'تغيير حجم الصور', keywords: 'تصغير صور, تكبير صور' },
  { id: 'password-generator', name: 'مولد كلمات المرور', keywords: 'كلمة مرور قوية, أمان' },
  { id: 'base64', name: 'تشفير Base64', keywords: 'Base64 encode decode' },
  { id: 'json-formatter', name: 'منسق JSON', keywords: 'تنسيق JSON, JSON formatter' },
  { id: 'text-diff', name: 'مقارنة النصوص', keywords: 'مقارنة نصوص, diff' },
  { id: 'prayer-times', name: 'مواقيت الصلاة', keywords: 'أوقات الصلاة, أذان' },
  { id: 'hijri-converter', name: 'محول التاريخ الهجري', keywords: 'هجري ميلادي, أم القرى' },
  { id: 'calorie-calculator', name: 'حاسبة السعرات', keywords: 'سعرات حرارية, احتياج يومي' },
  { id: 'pomodoro-timer', name: 'مؤقت بومودورو', keywords: 'بومودورو, إنتاجية' },
];

async function groq(prompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: 'allam-2-7b',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7, max_tokens: 1200,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const j = await res.json();
  return j.choices[0].message.content.trim();
}

const outFile = 'src/data/seoBlogData2.ts';
let articles = [];

for (let i = 0; i < TOOLS_NEEDING_ARTICLES.length; i++) {
  const t = TOOLS_NEEDING_ARTICLES[i];
  console.log(`[${i+1}/${TOOLS_NEEDING_ARTICLES.length}] Generating for ${t.name}...`);
  try {
    const prompt = `اكتب مقال SEO عربي مختصر (150-200 كلمة) بعنوان جذاب عن "${t.name}" — الكلمات المفتاحية: ${t.keywords}. اجعله مفيداً وعملياً مع نصيحة واحدة. لا تضع مقدمة طويلة.`;
    const content = await groq(prompt);
    const slug = `${t.id}-guide-${Date.now()}-${i}`;
    articles.push({
      id: `seo2-${i+1}`,
      slug,
      title: content.split('\n')[0].replace(/^#+\s*/, '').slice(0, 80) || `دليل ${t.name}`,
      excerpt: content.slice(0, 160).replace(/\n/g,' '),
      content: content,
      category: 'أدوات',
      author: 'فريق حلّها — AI',
      authorRole: 'مولد تلقائي Groq',
      publishDate: new Date().toLocaleDateString('ar-EG'),
      readingTimeMinutes: 3,
      tags: t.keywords.split(',').map(s=>s.trim()),
      relatedToolIds: [t.id],
      metaTitle: `${t.name} — دليل شامل | حلّها`,
      metaDescription: content.slice(0, 155),
    });
    await new Promise(r=>setTimeout(r, 800)); // rate limit kindness
  } catch (e) {
    console.error(`  failed for ${t.id}:`, e.message.slice(0,200));
  }
}

const fileContent = `import { BlogPost } from '../types';\n\nexport const SEO_BLOG_POSTS_2: BlogPost[] = ${JSON.stringify(articles, null, 2)};\n`;
fs.writeFileSync(outFile, fileContent, 'utf8');
console.log(`\nDone — ${articles.length} articles written to ${outFile}`);
