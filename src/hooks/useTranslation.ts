import { useState, useCallback } from 'react';

const translationCache = new Map<string, string>();
const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

export async function translateText(text: string, targetLang: string): Promise<string> {
  if (targetLang === 'en' || !text.trim()) return text;

  const cacheKey = `${targetLang}:${text.slice(0, 50)}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    const res = await fetch(url);
    const data = await res.json() as { responseData?: { translatedText?: string } };
    const translated = data.responseData?.translatedText ?? text;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch {
    return text; // Fall back to English on error
  }
}

export function useTranslation() {
  const [translating, setTranslating] = useState(false);

  const translate = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (targetLang === 'en') return text;
    setTranslating(true);
    const result = await translateText(text, targetLang);
    setTranslating(false);
    return result;
  }, []);

  return { translate, translating };
}
