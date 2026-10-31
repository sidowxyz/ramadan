import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';

// 'today'       iPhone: full count since midnight from the motion chip.
// 'session'     Android: only steps taken while the app is open (Expo Go limit;
//               full-day counts need Health Connect in a custom build).
// 'denied'      the user refused motion / activity permission.
// 'unavailable' no pedometer (web, simulators, some devices).
export type StepsStatus = 'loading' | 'today' | 'session' | 'denied' | 'unavailable';

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export function useSteps() {
  const [steps, setSteps] = useState<number | null>(null);
  const [status, setStatus] = useState<StepsStatus>('loading');

  useEffect(() => {
    if (Platform.OS === 'web') {
      setStatus('unavailable');
      return;
    }

    let cancelled = false;
    let sub: { remove: () => void } | null = null;

    const listen = async () => {
      sub?.remove();
      sub = null;
      if (Platform.OS === 'ios') {
        // Base = steps since midnight; the watcher adds steps from this moment on.
        const base = (await Pedometer.getStepCountAsync(startOfToday(), new Date())).steps;
        if (cancelled) return;
        setSteps(base);
        setStatus('today');
        sub = Pedometer.watchStepCount((r) => setSteps(base + r.steps));
      } else {
        setSteps((s) => s ?? 0);
        setStatus('session');
        let carried: number | null = null;
        sub = Pedometer.watchStepCount((r) => {
          setSteps((s) => {
            // Each subscription starts from 0, so carry over what we already counted.
            if (carried === null) carried = s ?? 0;
            return carried + r.steps;
          });
        });
      }
    };

    (async () => {
      try {
        if (!(await Pedometer.isAvailableAsync())) {
          if (!cancelled) setStatus('unavailable');
          return;
        }
        const perm = await Pedometer.requestPermissionsAsync();
        if (cancelled) return;
        if (!perm.granted) {
          setStatus('denied');
          return;
        }
        await listen();
      } catch {
        if (!cancelled) setStatus('unavailable');
      }
    })();

    // Re-sync when the app returns to the foreground (updates pause in the background).
    const appState = AppState.addEventListener('change', (s) => {
      if (s === 'active' && !cancelled) listen().catch(() => {});
    });

    return () => {
      cancelled = true;
      sub?.remove();
      appState.remove();
    };
  }, []);

  return { steps, status };
}

export function stepsCaption(status: StepsStatus) {
  switch (status) {
    case 'loading':
      return 'Connecting…';
    case 'today':
      return 'Counted by your phone';
    case 'session':
      return 'Since you opened NAFIS';
    case 'denied':
      return 'Allow motion access in Settings';
    default:
      return 'Open NAFIS on your phone to count';
  }
}
