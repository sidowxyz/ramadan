// Everyday walking estimates. They're averages for an adult walking pace,
// not measurements, and the UI labels them as estimates.
const STRIDE_M = 0.75; // metres per step
const KCAL_PER_STEP = 0.04;
const STEPS_PER_MIN = 100;

export const STEP_GOALS = [4000, 6000, 8000, 10000];

export function walkingStats(steps: number) {
  return {
    km: (steps * STRIDE_M) / 1000,
    kcal: Math.round(steps * KCAL_PER_STEP),
    minutes: Math.round(steps / STEPS_PER_MIN),
  };
}

// Checkpoints along the gauge, as a share of the daily goal, each worth XP.
export const MILESTONES = [
  { at: 0.25, xp: 5 },
  { at: 0.5, xp: 10 },
  { at: 1, xp: 20 },
  { at: 1.5, xp: 30 },
];

export const milestoneSteps = (goal: number) => MILESTONES.map((m) => Math.round(m.at * goal));

export function milestoneXp(steps: number | null, goal: number) {
  if (steps === null) return 0;
  return MILESTONES.filter((m) => steps >= m.at * goal).reduce((s, m) => s + m.xp, 0);
}

export const formatKm = (km: number) => (km < 10 ? km.toFixed(2) : km.toFixed(1));
export const formatMinutes = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`);
