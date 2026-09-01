import React, { useState } from 'react';
import { FileText, Download, Copy, Check, Sparkles } from 'lucide-react';
import { groqChat } from '../lib/groq';

export const ResumeBuilder: React.FC = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [exp, setExp] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!name || !title) return;
    setLoading(true);
    try {
      const prompt = `أنشئ سيرة ذاتية احترافية بالعربية:\nالاسم: ${name}\nالمسمى: ${title}\nالمهارات: ${skills}\nالخبرة: ${exp}\n\nصيغة منظمة بعناوين واضحة.`;
      const res = await groqChat(prompt, 'أنت خبير كتابة سير ذاتية احترافية.');
      setOutput(res);
    } catch (e: unknown) {
      setOutput(e instanceof Error ? e.message : String(e));
    } finally { setLoading(false); }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `CV-${name || 'resume'}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center"><FileText className="w-5 h-5" /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">منشئ السيرة الذاتية (AI)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">سيرة احترافية جاهزة للطباعة بـ Groq AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">الاسم الكامل</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: أحمد محمد" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="space-y-1.5"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">المسمى الوظيفي</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: مطور ويب" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="space-y-1.5 sm:col-span-2"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">المهارات (مفصولة بفواصل)</label><input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, إدارة مشاريع" className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="space-y-1.5 sm:col-span-2"><label className="text-xs font-bold text-slate-700 dark:text-slate-300">الخبرة باختصار</label><textarea rows={3} value={exp} onChange={(e) => setExp(e.target.value)} placeholder="3 سنوات في..." className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
        </div>

        <button onClick={handleGenerate} disabled={loading || !name || !title} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />} توليد السيرة
        </button>

        {output && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">النتيجة:</span>
              <div className="flex gap-1.5">
                <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 text-xs font-bold flex items-center gap-1">{copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'تم النسخ' : 'نسخ'}</button>
                <button onClick={handleDownload} className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold flex items-center gap-1"><Download className="w-3.5 h-3.5" /> تحميل</button>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm leading-relaxed whitespace-pre-wrap">{output}</div>
          </div>
        )}
      </div>
    </div>
  );
};
