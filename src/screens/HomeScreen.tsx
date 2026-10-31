import { Pressable, ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, space, Tone, tones } from '../theme';
import {
  ActionRow,
  Card,
  Chip,
  CircleButton,
  Fraction,
  IconName,
  IconTile,
  ProgressRing,
  SectionTitle,
  SegmentBar,
  Text,
} from '../components/ui';
import { Mascot } from '../components/Mascot';
import { DAILY_TASKS, MoodId, QURAN_GOAL, useDay, WATER_GOAL } from '../state/DayContext';
import { stepsCaption } from '../lib/useSteps';
import { formatKm, walkingStats } from '../lib/walking';
import { MOODS } from '../data/moods';
import { formatTime, hijriToday, untilLabel, upcomingIndex } from '../lib/prayerTimes';

type ActionId = 'breathe' | 'gratitude' | 'adhkar' | 'walk';

const ACTIONS: Record<ActionId, { icon: IconName; tone: Tone; title: string; subtitle: string }> = {
  breathe: { icon: 'leaf', tone: 'mint', title: 'Breathing break', subtitle: 'Two minutes to slow down: in for 4, out for 6.' },
  gratitude: { icon: 'heart', tone: 'pink', title: 'Gratitude notes', subtitle: 'Write three things you are grateful for today.' },
  adhkar: { icon: 'moon', tone: 'lilac', title: 'Evening adhkar', subtitle: 'A few quiet minutes of remembrance.' },
  walk: { icon: 'walk', tone: 'sky', title: 'Short walk', subtitle: 'Ten minutes outside to reset your energy.' },
};

const MOOD_ACTION: Record<MoodId, ActionId> = {
  good: 'gratitude',
  calm: 'adhkar',
  grateful: 'gratitude',
  tired: 'walk',
  low: 'breathe',
  stressed: 'breathe',
};

const STREAK_DAYS = 4; // sample until history is stored

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning,' : h < 17 ? 'Good afternoon,' : 'Good evening,';
}

export function HomeScreen() {
  const {
    now,
    times,
    prayed,
    togglePrayer,
    water,
    addWater,
    pages,
    addPage,
    mood,
    setMood,
    sleepMins,
    steps,
    stepsStatus,
    stepsGoal,
    done,
  } = useDay();
  const walk = walkingStats(steps ?? 0);

  // "Upcoming" is by the clock; "due" is the latest prayer whose time has come but isn't ticked yet.
  const upIndex = upcomingIndex(times, now);
  const upcoming = upIndex >= 0 ? times.prayers[upIndex] : null;
  const passedCount = upIndex >= 0 ? upIndex : times.prayers.length;
  let dueIndex = -1;
  for (let i = passedCount - 1; i >= 0; i--) {
    if (!prayed[i]) {
      dueIndex = i;
      break;
    }
  }
  const due = dueIndex >= 0 ? times.prayers[dueIndex] : null;

  const scoreWord =
    done >= DAILY_TASKS ? 'MashaAllah!' : done >= 5 ? 'Good going' : done >= 3 ? 'Keep going' : 'Bismillah';

  const tip = due
    ? `${due.name} time has come. A few calm minutes for your salah.`
    : water < WATER_GOAL
      ? `${WATER_GOAL - water} more glasses of water to go.`
      : pages < QURAN_GOAL
        ? `${QURAN_GOAL - pages} more pages of Qur’an today.`
        : !mood
          ? 'Take a moment to check in with how you feel.'
          : upcoming
            ? `${upcoming.name} is next at ${formatTime(upcoming.at)}.`
            : 'Everything done. Rest well tonight.';

  const suggestion = mood ? ACTIONS[MOOD_ACTION[mood]] : null;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1. Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <RNText style={styles.avatarText}>H</RNText>
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="caption" style={{ fontSize: 14 }}>{greeting()}</Text>
            <Text style={styles.name}>Hodan</Text>
          </View>
          <CircleButton icon="notifications-outline" dot label="Notifications" />
        </View>
        <Text variant="caption" style={styles.date}>
          {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · {hijriToday()}
        </Text>

        {/* 2. Today */}
        <Card>
          <View style={styles.score}>
            <View style={{ flex: 1 }}>
              <Text variant="caption" style={{ fontSize: 13 }}>Today</Text>
              <Fraction value={done} total={DAILY_TASKS} size={56} />
              <Text style={styles.scoreWord}>{scoreWord}</Text>
              <Chip label={`${STREAK_DAYS}-day streak`} icon="flame" tone="peach" style={{ marginTop: 10 }} />
            </View>
            <ProgressRing progress={done / DAILY_TASKS} size={124} stroke={10} color={colors.primary} track={colors.sky}>
              <Mascot size={78} />
            </ProgressRing>
          </View>
          <View style={styles.tip}>
            <Ionicons name="sparkles" size={16} color={colors.primary} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        </Card>

        {/* 3. Next prayer — the full list lives on the Deen tab */}
        <Pressable
          onPress={() => router.navigate('/deen')}
          accessibilityRole="button"
          accessibilityLabel="Open prayer times"
          style={({ pressed }) => [styles.prayerStrip, pressed && { opacity: 0.9 }]}
        >
          <View style={styles.prayerStripIcon}>
            <Ionicons name="moon" size={20} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <RNText style={styles.prayerStripKicker}>
              {upcoming ? `Next prayer · ${upcoming.name}` : 'Next prayer · Fajr tomorrow'}
            </RNText>
            <RNText style={styles.prayerStripTime}>
              {upcoming ? formatTime(upcoming.at) : '—'}
              {upcoming ? <RNText style={styles.prayerStripUntil}>  {untilLabel(upcoming.at, now)}</RNText> : null}
            </RNText>
          </View>
          {due ? (
            <Pressable
              onPress={() => togglePrayer(dueIndex)}
              accessibilityLabel={`Mark ${due.name} as prayed`}
              style={styles.prayerStripBtn}
              hitSlop={6}
            >
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <RNText style={styles.prayerStripBtnText}>{due.name}</RNText>
            </Pressable>
          ) : (
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
          )}
        </Pressable>

        {/* 4. Walking — the full step gauge lives on Wellbeing */}
        <Pressable
          onPress={() => router.navigate('/wellbeing')}
          accessibilityRole="button"
          accessibilityLabel="Open walking details"
          style={({ pressed }) => [styles.walk, pressed && { opacity: 0.9 }]}
        >
          <View style={styles.walkTop}>
            <ProgressRing
              progress={(steps ?? 0) / stepsGoal}
              size={64}
              stroke={6}
              color={colors.accent}
              track={colors.peach}
            >
              <Ionicons name="footsteps" size={22} color={colors.accent} />
            </ProgressRing>
            <View style={{ flex: 1 }}>
              <Text variant="caption">Walking · goal {stepsGoal.toLocaleString('en-US')}</Text>
              <RNText style={styles.walkSteps}>
                {steps !== null ? steps.toLocaleString('en-US') : '—'}
                <RNText style={styles.walkUnit}> steps</RNText>
              </RNText>
              <Text variant="caption" style={{ fontSize: 11 }}>{stepsCaption(stepsStatus)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.inkFaint} />
          </View>
          <View style={styles.walkStats}>
            <WalkStat value={formatKm(walk.km)} unit="km" />
            <View style={styles.walkDivider} />
            <WalkStat value={`${walk.kcal}`} unit="kcal" />
            <View style={styles.walkDivider} />
            <WalkStat value={`${walk.minutes}`} unit="min" />
          </View>
        </Pressable>

        {/* 5a. Habits */}
        <SectionTitle title="Habits" />
        <View style={styles.habits}>
          <Habit
            tone="sky"
            icon="water"
            title="Water"
            value={water}
            total={WATER_GOAL}
            onPress={addWater}
            label="Add a glass of water"
          />
          <Habit
            tone="lilac"
            icon="book"
            title="Qur'an"
            value={pages}
            total={QURAN_GOAL}
            onPress={addPage}
            label="Add a page of Qur'an"
          />
          <View style={[styles.habit, { backgroundColor: colors.peach }]}>
            <IconTile icon="bed" tone="white" size={36} round />
            <Text style={styles.habitTitle}>Sleep</Text>
            <RNText style={styles.habitValue}>
              {Math.floor(sleepMins / 60)}
              <RNText style={styles.habitUnit}>h </RNText>
              {sleepMins % 60}
              <RNText style={styles.habitUnit}>m</RNText>
            </RNText>
          </View>
        </View>

        {/* 5b. Mood */}
        <SectionTitle title="How are you feeling?" action={mood ? 'Reset' : undefined} onAction={() => setMood(null)} />
        <Card>
          <View style={styles.moods}>
            {MOODS.map((m) => {
              const on = mood === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => setMood(m.id)}
                  accessibilityLabel={m.label}
                  style={{ alignItems: 'center', gap: 6 }}
                >
                  <View
                    style={[
                      styles.mood,
                      { backgroundColor: tones[m.tone].bg },
                      on && styles.moodOn,
                      mood && !on && { opacity: 0.4 },
                    ]}
                  >
                    <RNText style={{ fontSize: 24 }}>{m.emoji}</RNText>
                  </View>
                  <RNText style={[styles.moodLabel, on && { color: colors.ink }]}>{m.label}</RNText>
                </Pressable>
              );
            })}
          </View>
          {suggestion ? (
            <View style={{ marginTop: space.md }}>
              <ActionRow
                icon={suggestion.icon}
                tone={suggestion.tone}
                title={suggestion.title}
                subtitle={suggestion.subtitle}
                badge="For you"
              />
            </View>
          ) : null}
        </Card>
      </ScrollView>
    </View>
  );
}

function WalkStat({ value, unit }: { value: string; unit: string }) {
  return (
    <RNText style={[styles.walkStat, { flex: 1 }]}>
      {value}
      <RNText style={styles.walkStatUnit}> {unit}</RNText>
    </RNText>
  );
}

function Habit({
  tone,
  icon,
  title,
  value,
  total,
  onPress,
  label,
}: {
  tone: Tone;
  icon: IconName;
  title: string;
  value: number;
  total: number;
  onPress: () => void;
  label: string;
}) {
  const complete = value >= total;
  return (
    <Pressable onPress={onPress} accessibilityLabel={label} style={[styles.habit, { backgroundColor: tones[tone].bg }]}>
      <View style={styles.rowBetween}>
        <IconTile icon={icon} tone="white" size={36} round />
        <View style={styles.habitPlus}>
          <Ionicons name={complete ? 'checkmark' : 'add'} size={14} color={tones[tone].ink} />
        </View>
      </View>
      <Text style={styles.habitTitle}>{title}</Text>
      <Fraction value={value} total={total} size={22} />
      <SegmentBar total={total} filled={value} color={tones[tone].ink} height={6} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingTop: 48, paddingBottom: 130 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.peach,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.semi, fontSize: 20, color: colors.peachInk },
  name: { fontFamily: fonts.semi, fontSize: 22, color: colors.ink },
  date: { fontSize: 13, marginTop: 10, marginBottom: space.md },

  score: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  scoreWord: { fontFamily: fonts.semi, fontSize: 17, color: colors.ink, marginTop: -2 },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.cardSoft,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: space.md,
  },
  tipText: { flex: 1, fontFamily: fonts.medium, fontSize: 13, lineHeight: 18, color: colors.ink },

  prayerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: space.md,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  prayerStripIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prayerStripKicker: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  prayerStripTime: { fontFamily: fonts.semi, fontSize: 22, letterSpacing: -0.5, color: colors.white },
  prayerStripUntil: { fontFamily: fonts.medium, fontSize: 12, letterSpacing: 0, color: colors.skyDeep },
  prayerStripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  prayerStripBtnText: { fontFamily: fonts.semi, fontSize: 13, color: colors.primary },

  walk: { marginTop: space.md, backgroundColor: colors.card, borderRadius: radius.lg, padding: space.md + 2 },
  walkTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  walkSteps: { fontFamily: fonts.semi, fontSize: 26, letterSpacing: -0.5, color: colors.ink },
  walkUnit: { fontFamily: fonts.regular, fontSize: 14, letterSpacing: 0, color: colors.inkSoft },
  walkStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardSoft,
    borderRadius: radius.md,
    paddingVertical: 12,
    marginTop: 14,
  },
  walkDivider: { width: 1, height: 22, backgroundColor: colors.line },
  walkStat: { fontFamily: fonts.semi, fontSize: 16, color: colors.ink, textAlign: 'center' },
  walkStatUnit: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkSoft },

  habits: { flexDirection: 'row', gap: space.sm },
  habit: { flex: 1, borderRadius: radius.lg, padding: 12, gap: 8 },
  habitTitle: { fontFamily: fonts.semi, fontSize: 14, color: colors.ink, marginTop: 2 },
  habitPlus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitValue: { fontFamily: fonts.light, fontSize: 22, letterSpacing: -0.5, color: colors.ink },
  habitUnit: { fontSize: 13, color: colors.inkSoft },

  moods: { flexDirection: 'row', justifyContent: 'space-between' },
  mood: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  moodOn: { borderWidth: 2.5, borderColor: colors.primary },
  moodLabel: { fontFamily: fonts.medium, fontSize: 10, color: colors.inkSoft },
});
