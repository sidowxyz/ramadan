import type { Tone } from '../theme';

export type MoodId = 'good' | 'calm' | 'grateful' | 'tired' | 'low' | 'stressed';

// score drives the mood chart height (1 = hardest day, 5 = best day).
export const MOODS: { id: MoodId; emoji: string; label: string; tone: Tone; score: number }[] = [
  { id: 'good', emoji: '😊', label: 'Good', tone: 'butter', score: 5 },
  { id: 'calm', emoji: '😌', label: 'Calm', tone: 'sky', score: 4 },
  { id: 'grateful', emoji: '🥰', label: 'Grateful', tone: 'pink', score: 5 },
  { id: 'tired', emoji: '😴', label: 'Tired', tone: 'lilac', score: 2.5 },
  { id: 'low', emoji: '😔', label: 'Low', tone: 'peach', score: 2 },
  { id: 'stressed', emoji: '😰', label: 'Stressed', tone: 'mint', score: 1.5 },
];

export const moodById = (id: MoodId) => MOODS.find((m) => m.id === id)!;

// Sample history until check-ins are stored: deterministic per day offset.
const PATTERN: MoodId[] = ['calm', 'good', 'tired', 'grateful', 'calm', 'stressed', 'good', 'calm', 'low', 'good', 'grateful'];
const SLEEP_PATTERN = [7.2, 7.8, 6.1, 7.5, 7.0, 5.8, 8.1, 7.4, 6.4, 7.9, 7.6];

export function sampleDay(daysAgo: number) {
  return {
    mood: PATTERN[(daysAgo * 7 + 3) % PATTERN.length],
    sleep: SLEEP_PATTERN[(daysAgo * 5 + 1) % SLEEP_PATTERN.length],
  };
}
