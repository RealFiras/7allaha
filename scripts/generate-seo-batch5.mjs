import fs from 'fs';
const GROQ_KEY = fs.readFileSync('.env.local','utf8').match(/VITE_GROQ_API_KEY="([^"]+)"/)?.[1] || '';
const TOOLS = [
  { id: 'pomodoro-timer', name: 'مؤقت بومودورو للإنتاجية', kw: 'بومودورو, تركيز, إنتاجية' },
  { id: 'name-generator', name: 'مولد الأسماء الإبداعي', kw: 'أسماء, علامة تجارية, اسم مشروع' },
  { id: 'image-converter', name: 'محول صيغ الصور السريع', kw: 'WebP, JPG, تحويل صور' },
  { id: 'unit-converter', name: 'تحويل الوحدات اليومي', kw: 'متر كيلو, وحدات قياس' },
  { id: 'salary-calculator', name: 'التخطيط للراتب والادخار', kw: 'راتب, ادخار, ميزانية' },
  { id: 'resume-builder', name: 'نصائح السيرة الذاتية', kw: 'CV احترافي, مقابلة' },
  { id: 'savings-calculator', name: 'الاستثمار والادخار الذكي', kw: 'استثمار, توفير' },
  { id: 'ai-text-tool', name: 'الذكاء الاصطناعي للكتابة', kw: 'كتابة AI, Groq' },
  { id: 'zakat-calculator', name: 'الزكاة على الاستثمارات', kw: 'زكاة أسهم, زكاة عقار' },
  { id: 'emi-calculator', name: 'التمويل العقاري والقروض', kw: 'تمويل عقاري, قرض سيارة' },
  { id: 'bmi-calculator', name: 'الصحة والوزن المثالي', kw: 'رجيم, وزن صحي' },
  { id: 'qr-generator', name: 'QR للدفع والمنيو', kw: 'QR دفع, مطعم' },
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
    arts.push({id:`seo5-${i+1}`,slug:`${t.id}-expert-${Date.now()}-${i}`,title:c.split('\n')[0].replace(/^#+\s*/,'').slice(0,80),excerpt:c.slice(0,160).replace(/\n/g,' '),content:c,category:'ادوات',author:'فريق حلها - AI',authorRole:'Groq',publishDate:new Date().toLocaleDateString('ar-EG'),readingTimeMinutes:3,tags:t.kw.split(',').map(s=>s.trim()),relatedToolIds:[t.id],metaTitle:`${t.name} - دليل خبير | حلها`,metaDescription:c.slice(0,155)});
  }catch(e){ console.error(' fail',e.message.slice(0,120)); }
  await new Promise(r=>setTimeout(r,6500));
}
fs.writeFileSync('src/data/seoBlogData5.ts', `import { BlogPost } from '../types';\n\nexport const SEO_BLOG_POSTS_5: BlogPost[] = ${JSON.stringify(arts,null,2)};\n`);
console.log(`Done ${arts.length} -> seoBlogData5.ts`);
