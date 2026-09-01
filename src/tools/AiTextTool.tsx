import React, { useState } from 'react';
import { Sparkles, Copy, Check, Trash2, Wand2 } from 'lucide-react';
import { groqSummarize, groqImprove } from '../lib/groq';

type AiMode = 'summarize' | 'improve';

export const AiTextTool: React.FC = () => {
  const [mode, setMode] = useState<AiMode>('summarize');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setOutput('');
    try {
      const result = mode === 'summarize' ? await groqSummarize(input) : await groqImprove(input);
      setOutput(result);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('مفتاح Groq')) setError('أضف VITE_GROQ_API_KEY في .env.local ثم أعد البناء');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">مساعد النص الذكي (Groq AI)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">تلخيص وتحسين نصوص فوري بـ Groq Llama 3.3</p>
          </div>
        </div>

        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
          <button onClick={() => setMode('summarize')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'summarize' ? 'bg-white dark:bg-slate-700 shadow-xs text-violet-600' : 'text-slate-600 dark:text-slate-400'}`}>
            تلخيص
          </button>
          <button onClick={() => setMode('improve')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'improve' ? 'bg-white dark:bg-slate-700 shadow-xs text-violet-600' : 'text-slate-600 dark:text-slate-400'}`}>
            تحسين لغوي
          </button>
        </div>

        <textarea
          rows={6}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'summarize' ? 'الصق النص الطويل هنا للتلخيص...' : 'اكتب نصاً لتحسينه لغوياً...'}
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />

        <div className="flex gap-2">
          <button onClick={handleRun} disabled={loading || !input.trim()} className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loading ? 'جاري المعالجة...' : mode === 'summarize' ? 'لخّص الآن' : 'حسّن النص'}
          </button>
          <button onClick={() => { setInput(''); setOutput(''); setError(null); }} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-600 text-slate-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300">{error}</div>}

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">النتيجة:</span>
              <button onClick={handleCopy} className="text-xs font-bold text-violet-600 flex items-center gap-1">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-sm leading-relaxed whitespace-pre-wrap">{output}</div>
          </div>
        )}
      </div>
    </div>
  );
};
