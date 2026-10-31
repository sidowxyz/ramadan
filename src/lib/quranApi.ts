import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// The app never talks to Quran Foundation directly: it calls our proxy, which
// holds the OAuth secret (server/qf-proxy.mjs in dev, a hosted function later).
// In development the proxy runs on the same PC as Metro, so reuse Metro's host.
function proxyBase() {
  const override = process.env.EXPO_PUBLIC_QURAN_API;
  if (override) return override.replace(/\/$/, '');
  if (Platform.OS === 'web') return 'http://localhost:8787/quran';
  const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
  return `http://${host}:8787/quran`;
}

export const TRANSLATIONS = {
  en: { id: 85, label: 'English', name: 'M.A.S. Abdel Haleem' },
  so: { id: 46, label: 'Soomaali', name: 'Mahmud Muhammad Abduh' },
} as const;
export type TranslationKey = keyof typeof TRANSLATIONS;

export const RECITER_ID = 7; // Mishari Rashid al-Afasy

export type Chapter = {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
  revelation_place: 'makkah' | 'madinah';
  bismillah_pre: boolean;
  translated_name: { name: string };
};

export type Verse = {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  page_number: number;
  juz_number: number;
  translations?: { text: string }[];
};

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${proxyBase()}${path}`);
  if (!res.ok) throw new Error(`Quran API ${res.status}`);
  return res.json() as Promise<T>;
}

export const getChapters = () => get<{ chapters: Chapter[] }>('/chapters?language=en').then((r) => r.chapters);

export const getChapter = (id: number) => get<{ chapter: Chapter }>(`/chapters/${id}?language=en`).then((r) => r.chapter);

export const getVerses = (chapter: number, page: number, translation: TranslationKey, perPage = 20) =>
  get<{ verses: Verse[]; pagination: { next_page: number | null; total_records: number } }>(
    `/verses/by_chapter/${chapter}?translations=${TRANSLATIONS[translation].id}&fields=text_uthmani&per_page=${perPage}&page=${page}`,
  );

export const getChapterAudio = (chapter: number) =>
  get<{ audio_file: { audio_url: string } }>(`/chapter_recitations/${RECITER_ID}/${chapter}`).then(
    (r) => r.audio_file.audio_url,
  );

// Translations can carry footnote markup like <sup foot_note=…>1</sup>.
export const plainText = (html: string) =>
  html
    .replace(/<sup[^>]*>.*?<\/sup>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export function useQuery<T>(load: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    load()
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(String(e?.message ?? e)));
    return () => {
      cancelled = true;
    };
  }, [...deps, attempt]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, error, loading: !data && !error, retry: () => setAttempt((a) => a + 1) };
}
