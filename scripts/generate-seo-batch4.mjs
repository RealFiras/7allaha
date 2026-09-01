import fs from 'fs';
const GROQ_KEY = fs.readFileSync('.env.local','utf8').match(/VITE_GROQ_API_KEY="([^"]+)"/)?.[1] || '';
const TOOLS = [
  { id: 'timezone-converter', name: 'محول التوقيت العالمي', kw: 'فرق التوقيت, توقيت مكة' },
  { id: 'background-remover', name: 'إزالة خلفية الصور', kw: 'إزالة خلفية, AI صور' },
  { id: 'image-resizer', name: 'تغيير مقاس الصور', kw: 'تصغير صور, مقاس صور' },
  { id: 'word-counter', name: 'عداد الكلمات المتقدم', kw: 'تحليل نص, إحصائيات كتابة' },
  { id: 'calorie-calculator', name: 'حاسبة السعرات الحرارية', kw: 'سعرات, حمية, تغذية' },
  { id: 'unit-converter', name: 'محول الوحدات الذكي', kw: 'تحويل طول وزن' },
  { id: 'hijri-converter', name: 'التقويم الهجري', kw: 'هجري ميلادي, أم القرى' },
  { id: 'prayer-times', name: 'مواقيت الصلاة الدقيقة', kw: 'أذان, مواقيت, صلاة' },
  { id: 'text-diff', name: 'مقارنة النصوص الذكية', kw: 'فرق نصوص, diff' },
  { id: 'password-generator', name: 'كلمات مرور آمنة', kw: 'أمان, كلمة سر' },
  { id: 'base64', name: 'تشفير Base64 المتقدم', kw: 'تشفير, Base64' },
  { id: 'json-formatter', name: 'تنسيق JSON احترافي', kw: 'JSON, تنسيق كود' },
];
async function groq(prompt){
  const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${GROQ_KEY}`},body:JSON.stringify({model:'allam-2-7b',messages:[{role:'user',content:prompt}],temperature:0.7,max_tokens:1000})});
  if(!r.ok) throw new Error(await r.text());
  return (await r.json()).choices[0].message.content.trim();
}
let arts=[];
for(let i=0;i<TOOLS.length;i++){
  const t=TOOLS[i];
  console.log(`[${i+1}/${TOOLS.length}] ${t.name}`);
  try{
    const c=await groq(`اكتب مقال SEO عربي 150 كلمة عن "${t.name}" - كلمات: ${t.kw}. عنوان جذاب + فقرة مفيدة + نصيحة.`);
    arts.push({id:`seo4-${i+1}`,slug:`${t.id}-advanced-${Date.now()}-${i}`,title:c.split('\n')[0].replace(/^#+\s*/,'').slice(0,80),excerpt:c.slice(0,160).replace(/\n/g,' '),content:c,category:'ادوات',author:'فريق حلها - AI',authorRole:'Groq',publishDate:new Date().toLocaleDateString('ar-EG'),readingTimeMinutes:3,tags:t.kw.split(',').map(s=>s.trim()),relatedToolIds:[t.id],metaTitle:`${t.name} - دليل متقدم | حلها`,metaDescription:c.slice(0,155)});
  }catch(e){ console.error(' fail',e.message.slice(0,120)); }
  await new Promise(r=>setTimeout(r,6500));
}
fs.writeFileSync('src/data/seoBlogData4.ts', `import { BlogPost } from '../types';\n\nexport const SEO_BLOG_POSTS_4: BlogPost[] = ${JSON.stringify(arts,null,2)};\n`);
console.log(`Done ${arts.length} -> seoBlogData4.ts`);
