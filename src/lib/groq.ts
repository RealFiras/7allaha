// Groq API client for AI tools — uses VITE_GROQ_API_KEY
// Model: allam-2-7b (fast + high quality, free tier generous)

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getApiKey(): string {
  const key = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GROQ_API_KEY || '';
  if (!key || key === 'YOUR_GROQ_API_KEY') throw new Error('مفتاح Groq غير مضبوط — أضف VITE_GROQ_API_KEY في .env.local');
  return key;
}

export async function groqChat(prompt: string, systemPrompt?: string): Promise<string> {
  const key = getApiKey();
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'allam-2-7b',
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

// Convenience helpers
export const groqSummarize = (text: string) =>
  groqChat(`لخص النص التالي بإيجاز بالعربية:\n\n${text}`, 'أنت مساعد تلخيص محترف.');

export const groqImprove = (text: string) =>
  groqChat(`حسّن النص التالي لغوياً وأسلوبياً مع الحفاظ على المعنى:\n\n${text}`, 'أنت مدقق لغوي عربي محترف.');

export const groqGenerateIdeas = (topic: string) =>
  groqChat(`اقترح 5 أسماء إبداعية عربية/إنجليزية لـ: ${topic}`, 'أنت خبير تسمية علامات تجارية.');
