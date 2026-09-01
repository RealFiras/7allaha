import React, { useState, useEffect } from 'react';
import { KeyRound, RefreshCw, Copy, Check, ShieldCheck, ShieldAlert, Sparkles, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = /[il1Lo0O]/g;

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);
  const [batchCount, setBatchCount] = useState<number>(1);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateSinglePassword = (): string => {
    let pool = '';
    if (includeUpper) pool += UPPERCASE_CHARS;
    if (includeLower) pool += LOWERCASE_CHARS;
    if (includeNumbers) pool += NUMBER_CHARS;
    if (includeSymbols) pool += SYMBOL_CHARS;

    if (!pool) pool = LOWERCASE_CHARS + NUMBER_CHARS;

    let res = '';
    const array = new Uint32Array(length * 2);
    window.crypto.getRandomValues(array);

    let i = 0;
    while (res.length < length && i < array.length) {
      const char = pool[array[i] % pool.length];
      if (excludeSimilar && char.match(SIMILAR_CHARS)) {
        i++;
        continue;
      }
      res += char;
      i++;
    }

    // Fallback if needed
    while (res.length < length) {
      res += pool[Math.floor(Math.random() * pool.length)];
    }

    return res;
  };

  const generateAllPasswords = () => {
    const list: string[] = [];
    for (let i = 0; i < batchCount; i++) {
      list.push(generateSinglePassword());
    }
    setPasswords(list);
  };

  useEffect(() => {
    generateAllPasswords();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeSimilar, batchCount]);

  // Calculate Strength
  const primaryPass = passwords[0] || '';
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 14) score += 2;
    if (pass.length >= 20) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 2;

    if (score <= 3) {
      return { label: 'ضعيفة وغير آمنة', color: 'text-red-600', bg: 'bg-red-500', percent: 25 };
    }
    if (score <= 5) {
      return { label: 'متوسطة المقاومة', color: 'text-amber-600', bg: 'bg-amber-500', percent: 50 };
    }
    if (score <= 7) {
      return { label: 'قوية وموثوقة', color: 'text-emerald-600', bg: 'bg-emerald-500', percent: 80 };
    }
    return { label: 'فائقة الأمان (درجة عسكرية)', color: 'text-blue-600', bg: 'bg-blue-600', percent: 100 };
  };

  const strength = calculateStrength(primaryPass);

  const handleCopy = (pass: string, idx: number) => {
    navigator.clipboard.writeText(pass);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Main Display Box */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">
              كلمة المرور المولدة عشوائياً:
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${strength.color}`}>
                {strength.label}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-emerald-400 break-all select-all">
              {primaryPass}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(primaryPass, 0)}
                className="p-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl transition-all shadow-xs"
                title="نسخ كلمة المرور"
              >
                {copiedIndex === 0 ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={generateAllPasswords}
                className="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition-all hover:rotate-180 duration-300"
                title="توليد كلمة سر جديدة"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Strength Bar */}
          <div className="space-y-1">
            <div className="h-2 rounded-full overflow-hidden bg-slate-800">
              <div
                className={`h-full ${strength.bg} transition-all duration-300`}
                style={{ width: `${strength.percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Options & Sliders */}
        <div className="space-y-6 pt-2">
          
          {/* Length Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800">
                طول كلمة المرور (عدد الخانات)
              </label>
              <span className="text-base font-extrabold text-blue-600 bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                {length} حرفاً
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>6 (بسيطة)</span>
              <span>16 (موصى بها)</span>
              <span>32</span>
              <span>64 (قصوى)</span>
            </div>
          </div>

          {/* Checkboxes Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">أحرف كبيرة (A-Z)</span>
                <span className="text-slate-400">تتضمن ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">أحرف صغيرة (a-z)</span>
                <span className="text-slate-400">تتضمن abcdefghijklmnopqrstuvwxyz</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">أرقام (0-9)</span>
                <span className="text-slate-400">تتضمن 0123456789</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">رموز خاصة (@#$%)</span>
                <span className="text-slate-400">تتضمن !@#$%^&*()_+-=</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors sm:col-span-2">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">استبعاد الأحرف المتشابهة بصرياً</span>
                <span className="text-slate-400">تجنب الالتباس بين (l, 1, I, O, 0)</span>
              </div>
            </label>

          </div>

          {/* Batch Generation selector */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600">
              توليد قائمة كلمات مرور متعددة للاختيار:
            </span>
            <div className="flex gap-1.5">
              {[1, 3, 5, 10].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setBatchCount(cnt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    batchCount === cnt
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cnt} {cnt === 1 ? 'كلمة' : 'كلمات'}
                </button>
              ))}
            </div>
          </div>

          {/* Batch List */}
          {batchCount > 1 && (
            <div className="space-y-2 pt-2">
              {passwords.map((pass, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-mono text-slate-800 font-bold select-all truncate">
                    {pass}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(pass, idx)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors flex-shrink-0"
                    title="نسخ"
                  >
                    {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
