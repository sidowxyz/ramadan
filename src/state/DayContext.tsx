import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { computeTimes, DayTimes } from '../lib/prayerTimes';
import { StepsStatus, useSteps } from '../lib/useSteps';
import { milestoneXp, STEP_GOALS } from '../lib/walking';
import type { MoodId } from '../data/moods';
import type { TranslationKey } from '../lib/quranApi';

export type { MoodId };

export const WATER_GOAL = 8;
export const QURAN_GOAL = 5;
const XP_PER_TASK = 10;
const STARTING_XP = 120; // sample history until XP is stored
export const DAILY_TASKS = 5 + 3; // five prayers + water + Qur'an + mood

type DayState = {
  now: Date;
  times: DayTimes;
  prayed: boolean[];
  togglePrayer: (i: number) => void;
  water: number;
  addWater: () => void;
  pages: number;
  addPage: () => void;
  mood: MoodId | null;
  setMood: (m: MoodId | null) => void;
  sleepMins: number;
  adjustSleep: (deltaMins: number) => void;
  steps: number | null;
  stepsStatus: StepsStatus;
  stepsGoal: number;
  cycleStepsGoal: () => void;
  dhikrCounts: Record<string, number>;
  countDhikr: (id: string, max: number) => void;
  tasbihTotal: number;
  addTasbih: () => void;
  lastSurah: { id: number; name: string } | null;
  setLastSurah: (s: { id: number; name: string }) => void;
  translation: TranslationKey;
  setTranslation: (t: TranslationKey) => void;
  xp: number;
  done: number;
};

export const XP_PER_LEVEL = 100;
export const levelFor = (xp: number) => Math.floor(xp / XP_PER_LEVEL) + 1;

const Ctx = createContext<DayState | null>(null);

// In-memory for now; this is the seam where the backend sync will plug in.
export function DayProvider({ children }: { children: React.ReactNode }) {
  const [now, setNow] = useState(() => new Date());
  const times = useMemo(() => computeTimes(now), [now.toDateString()]); // eslint-disable-line react-hooks/exhaustive-deps

  // Demo start: everything already passed is prayed except the most recent one.
  const [prayed, setPrayed] = useState(() => {
    const passed = times.prayers.map((p) => p.at.getTime() <= now.getTime());
    const last = passed.lastIndexOf(true);
    return passed.map((v, i) => v && i !== last);
  });
  const [water, setWater] = useState(5);
  const [pages, setPages] = useState(2);
  const [mood, setMood] = useState<MoodId | null>(null);
  const [sleepMins, setSleepMins] = useState(7 * 60 + 30);
  const { steps, status: stepsStatus } = useSteps();
  const [stepsGoal, setStepsGoal] = useState(6000);
  const [dhikrCounts, setDhikrCounts] = useState<Record<string, number>>({});
  const [tasbihTotal, setTasbihTotal] = useState(0);
  const [lastSurah, setLastSurah] = useState<{ id: number; name: string } | null>(null);
  const [translation, setTranslation] = useState<TranslationKey>('en');

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const done =
    prayed.filter(Boolean).length + (water >= WATER_GOAL ? 1 : 0) + (pages >= QURAN_GOAL ? 1 : 0) + (mood ? 1 : 0);

  const value: DayState = {
    now,
    times,
    prayed,
    togglePrayer: (i) => setPrayed((p) => p.map((v, j) => (j === i ? !v : v))),
    water,
    addWater: () => setWater((w) => Math.min(WATER_GOAL, w + 1)),
    pages,
    addPage: () => setPages((n) => Math.min(QURAN_GOAL, n + 1)),
    mood,
    setMood,
    sleepMins,
    adjustSleep: (d) => setSleepMins((s) => Math.max(0, Math.min(14 * 60, s + d))),
    steps,
    stepsStatus,
    stepsGoal,
    cycleStepsGoal: () => setStepsGoal((g) => STEP_GOALS[(STEP_GOALS.indexOf(g) + 1) % STEP_GOALS.length]),
    dhikrCounts,
    countDhikr: (id, max) => setDhikrCounts((c) => ({ ...c, [id]: Math.min(max, (c[id] ?? 0) + 1) })),
    tasbihTotal,
    addTasbih: () => setTasbihTotal((t) => t + 1),
    lastSurah,
    setLastSurah,
    translation,
    setTranslation,
    // Every completed daily task earns XP, plus walking milestones.
    xp: STARTING_XP + done * XP_PER_TASK + milestoneXp(steps, stepsGoal),
    done,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDay() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDay must be used inside DayProvider');
  return v;
}
