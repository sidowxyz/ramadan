import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan';

// Default location until the user picks one (or we read device location).
export const LOCATION = {
  name: 'Mogadishu',
  lat: 2.0469,
  lng: 45.3182,
  timeZone: 'Africa/Mogadishu',
  method: 'Muslim World League',
};

export const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type PrayerName = (typeof PRAYER_NAMES)[number];

export type DayTimes = {
  prayers: { name: PrayerName; at: Date }[];
  sunrise: Date;
};

export function computeTimes(date = new Date()): DayTimes {
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Shafi;
  const t = new PrayerTimes(new Coordinates(LOCATION.lat, LOCATION.lng), date, params);
  return {
    prayers: [
      { name: 'Fajr', at: t.fajr },
      { name: 'Dhuhr', at: t.dhuhr },
      { name: 'Asr', at: t.asr },
      { name: 'Maghrib', at: t.maghrib },
      { name: 'Isha', at: t.isha },
    ],
    sunrise: t.sunrise,
  };
}

// Times are shown in the prayer location's clock, not the device's.
export function formatTime(d: Date) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: LOCATION.timeZone,
    }).format(d);
  } catch {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}

export function untilLabel(d: Date, now = new Date()) {
  const diff = Math.round((d.getTime() - now.getTime()) / 60000);
  if (diff <= 0) return 'Now';
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `in ${h ? `${h}h ` : ''}${m}m`;
}

// Index of the next prayer by clock time, or -1 when all of today's have passed.
export function upcomingIndex(times: DayTimes, now = new Date()) {
  return times.prayers.findIndex((p) => p.at.getTime() > now.getTime());
}

export function hijriToday() {
  try {
    return new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date())
      .replace(' AH', '');
  } catch {
    return '';
  }
}
