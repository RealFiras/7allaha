import fs from 'fs';
const GROQ_KEY = fs.readFileSync('.env.local','utf8').match(/VITE_GROQ_API_KEY="([^"]+)"/)?.[1] || '';
const TOOLS = [
  { id: 'salary-calculator', name: 'حاسبة الراتب', kw: 'حاسبة الراتب, صافي الراتب, GOSI' },
  { id: 'resume-builder', name: 'منشئ السيرة الذاتية', kw: 'سيرة ذاتية, CV, توظيف' },
  { id: 'savings-calculator', name: 'حاسبة الادخار', kw: 'ادخار, توفير, فائدة مركبة' },
  { id: 'ai-text-tool', name: 'مساعد النص الذكي', kw: 'تلخيص نصوص, ذكاء اصطناعي' },
  { id: 'emi-calculator', name: 'حاسبة القروض', kw: 'قرض, قسط شهري, تمويل' },
  { id: 'bmi-calculator', name: 'حاسبة BMI', kw: 'كتلة الجسم, وزن مثالي' },
  { id: 'zakat-calculator', name: 'حاسبة الزكاة', kw: 'زكاة المال, نصاب الذهب' },
  { id: 'currency-converter', name: 'محول العملات', kw: 'سعر الصرف, ريال دولار' },
  { id: 'invoice-generator', name: 'مولد الفواتير', kw: 'فاتورة, فاتورة ضريبية' },
  { id: 'age-calculator', name: 'حاسبة العمر', kw: 'حساب العمر, تاريخ الميلاد' },
  { id: 'percentage-calculator', name: 'حاسبة النسبة', kw: 'نسبة مئوية, خصم' },
  { id: 'qr-generator', name: 'مولد QR', kw: 'باركود, QR Code' },
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
    arts.push({id:`seo3-${i+1}`,slug:`${t.id}-tips-${Date.now()}-${i}`,title:c.split('\n')[0].replace(/^#+\s*/,'').slice(0,80),excerpt:c.slice(0,160).replace(/\n/g,' '),content:c,category:'ادوات',author:'فريق حلها - AI',authorRole:'Groq',publishDate:new Date().toLocaleDateString('ar-EG'),readingTimeMinutes:3,tags:t.kw.split(',').map(s=>s.trim()),relatedToolIds:[t.id],metaTitle:`${t.name} - نصائح | حلها`,metaDescription:c.slice(0,155)});
  }catch(e){ console.error(' fail',e.message.slice(0,120)); }
  await new Promise(r=>setTimeout(r,6500));
}
fs.writeFileSync('src/data/seoBlogData3.ts', `import { BlogPost } from '../types';\n\nexport const SEO_BLOG_POSTS_3: BlogPost[] = ${JSON.stringify(arts,null,2)};\n`);
console.log(`Done ${arts.length} -> seoBlogData3.ts`);
