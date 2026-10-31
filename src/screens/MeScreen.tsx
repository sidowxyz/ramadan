import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text as RNText, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, space, Tone, tones } from '../theme';
import {
  Button,
  Card,
  Chip,
  CircleButton,
  Fraction,
  IconName,
  IconTile,
  ListRow,
  ProgressRing,
  SectionTitle,
  SegmentBar,
  Text,
} from '../components/ui';
import { Mascot } from '../components/Mascot';
import { Garden, GardenPlant, STAGES, stageFor } from '../components/Garden';
import { levelFor, QURAN_GOAL, useDay, WATER_GOAL, XP_PER_LEVEL } from '../state/DayContext';
import { sampleDay } from '../data/moods';
import { LOCATION } from '../lib/prayerTimes';

const STREAK_DAYS = 5;

// Sample history for the six days before today, until check-ins are stored.
const PAST_PRAYERS = [5, 5, 4, 5, 3, 5];
const PAST_WATER_MET = [1, 0, 1, 1, 0, 1];
const PAST_PAGES = [5, 3, 5, 2, 4, 5];

export function MeScreen() {
  const { prayed, water, pages, mood, sleepMins, steps, stepsGoal, xp } = useDay();
  const [plantId, setPlantId] = useState<string | null>('deen');
  const [prayerAlerts, setPrayerAlerts] = useState(true);
  const [checkinAlerts, setCheckinAlerts] = useState(true);

  const level = levelFor(xp);
  const inLevel = xp % XP_PER_LEVEL;
  const rank = STAGES[Math.min(level - 1, STAGES.length - 1)];
  const prayedToday = prayed.filter(Boolean).length;

  const plants: GardenPlant[] = [
    { id: 'deen', label: 'Deen', progress: prayedToday / 5, color: '#9C8CF0', detail: `${prayedToday} of 5 prayers today` },
    { id: 'quran', label: "Qur'an", progress: pages / QURAN_GOAL, color: '#5DB6D6', detail: `${pages} of ${QURAN_GOAL} pages today` },
    {
      id: 'mind',
      label: 'Mind',
      progress: (mood ? 0.6 : 0) + (sleepMins >= 420 ? 0.4 : 0),
      color: '#EE8FC6',
      detail: `${mood ? 'Checked in' : 'No check-in yet'} · ${sleepMins >= 420 ? 'rested' : 'short on sleep'}`,
    },
    {
      id: 'body',
      label: 'Body',
      // Water and steps share the plant; without a pedometer it grows from water alone.
      progress:
        steps !== null
          ? (Math.min(1, water / WATER_GOAL) + Math.min(1, steps / stepsGoal)) / 2
          : water / WATER_GOAL,
      color: '#F2A066',
      detail:
        `${water} of ${WATER_GOAL} glasses of water` +
        (steps !== null ? ` · ${steps.toLocaleString('en-US')} of ${stepsGoal.toLocaleString('en-US')} steps` : ''),
    },
  ];
  const blooming = plants.filter((p) => stageFor(p.progress) === 4).length;
  const plant = plants.find((p) => p.id === plantId);

  const past = Array.from({ length: 6 }, (_, i) => sampleDay(i + 1));
  const week: { icon: IconName; tone: Tone; label: string; value: number; total: number }[] = [
    { icon: 'moon', tone: 'lilac', label: 'Prayers', value: PAST_PRAYERS.reduce((a, b) => a + b, 0) + prayedToday, total: 35 },
    { icon: 'book', tone: 'sky', label: "Qur'an pages", value: PAST_PAGES.reduce((a, b) => a + b, 0) + pages, total: 35 },
    { icon: 'water', tone: 'mint', label: 'Water goal days', value: PAST_WATER_MET.reduce((a, b) => a + b, 0) + (water >= WATER_GOAL ? 1 : 0), total: 7 },
    { icon: 'happy', tone: 'pink', label: 'Mood check-ins', value: past.length + (mood ? 1 : 0), total: 7 },
    { icon: 'bed', tone: 'peach', label: 'Nights of 7h+ sleep', value: past.filter((d) => d.sleep >= 7).length + (sleepMins >= 420 ? 1 : 0), total: 7 },
  ];
  const prayerPct = Math.round((week[0].value / week[0].total) * 100);

  const badges = [
    { emoji: '🌱', label: 'First check-in', unlocked: true },
    { emoji: '⭐', label: '100 XP', unlocked: xp >= 100 },
    { emoji: '🔥', label: '7-day streak', unlocked: STREAK_DAYS >= 7 },
    { emoji: '🌸', label: 'Full garden', unlocked: blooming === plants.length },
    { emoji: '📖', label: 'First khatm', unlocked: false },
  ];

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.banner}>
          <View style={styles.bannerButtons}>
            <CircleButton icon="share-social-outline" label="Share profile" />
            <CircleButton icon="settings-outline" label="Settings" />
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Mascot size={88} bounce={false} />
            </View>
            <Button label="Edit profile" variant="light" small icon="create-outline" style={{ marginTop: 52 }} />
          </View>
          <Text variant="title" style={{ marginTop: space.sm }}>Hodan</Text>
          <Text variant="caption" style={{ fontSize: 14 }}>
            {LOCATION.name} · Soomaali · Joined Oct 2026
          </Text>

          {/* Level */}
          <View style={styles.level}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.levelKicker}>LEVEL {level}</Text>
                <Text style={styles.levelRank}>{rank}</Text>
              </View>
              <View style={styles.levelBadge}>
                <Ionicons name="trophy" size={24} color={colors.primary} />
              </View>
            </View>
            <View style={{ marginTop: space.md }}>
              <Fraction value={inLevel} total={XP_PER_LEVEL} unit="XP" size={34} color={colors.white} />
            </View>
            <View style={{ marginTop: 10 }}>
              <SegmentBar total={10} filled={Math.floor(inLevel / 10)} color={colors.white} track="rgba(255,255,255,0.18)" height={8} />
            </View>
            <Text style={styles.levelNext}>
              {XP_PER_LEVEL - inLevel} XP to level {level + 1}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.grid}>
            <Stat icon="flame" tone="peach" value={`${STREAK_DAYS} days`} label="Streak" />
            <Stat icon="trophy" tone="butter" value={`Level ${level}`} label={rank} badge="Record" />
            <Stat icon="leaf" tone="mint" value={`${blooming}/${plants.length}`} label="Plants blooming" />
            <Stat icon="flash" tone="lilac" value={`${xp}`} label="Total XP" />
          </View>

          {/* Growth Garden */}
          <SectionTitle title="Growth Garden" action={`${blooming}/${plants.length} blooming`} />
          <Garden plants={plants} selected={plantId} onSelect={setPlantId} />
          {plant ? (
            <Card style={{ marginTop: space.sm + 2 }}>
              <View style={styles.rowBetween}>
                <Text variant="heading">{plant.label}</Text>
                <Chip label={STAGES[stageFor(plant.progress)]} tone="mint" icon="leaf" />
              </View>
              <Text variant="caption" style={{ fontSize: 14, marginTop: 4 }}>{plant.detail}</Text>
              <View style={styles.note}>
                <Ionicons name="sunny-outline" size={16} color={colors.mintInk} />
                <Text variant="caption" style={{ flex: 1, fontSize: 12, lineHeight: 17 }}>
                  Plants never wilt. A missed day only pauses their growth.
                </Text>
              </View>
            </Card>
          ) : null}

          {/* Badges */}
          <SectionTitle title="Badges" action={`${badges.filter((b) => b.unlocked).length}/${badges.length}`} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -space.md }}
            contentContainerStyle={{ paddingHorizontal: space.md, gap: space.md }}
          >
            {badges.map((b) => (
              <View key={b.label} style={{ alignItems: 'center', width: 72, gap: 6 }}>
                <View style={[styles.badge, !b.unlocked && styles.badgeLocked]}>
                  <RNText style={{ fontSize: 28, opacity: b.unlocked ? 1 : 0.35 }}>{b.emoji}</RNText>
                  {!b.unlocked ? (
                    <View style={styles.lock}>
                      <Ionicons name="lock-closed" size={11} color={colors.white} />
                    </View>
                  ) : null}
                </View>
                <Text variant="caption" style={{ textAlign: 'center', fontSize: 11 }}>{b.label}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Weekly insights */}
          <SectionTitle title="This week" action="Last 7 days" />
          <View style={{ gap: space.sm }}>
            {week.map((w) => {
              const pct = Math.min(1, w.value / w.total);
              return (
                <View key={w.label} style={styles.insightRow}>
                  <IconTile icon={w.icon} tone={w.tone} size={48} />
                  <View style={{ flex: 1 }}>
                    <Text variant="caption">{w.label}</Text>
                    <Fraction value={w.value} total={w.total} size={22} />
                  </View>
                  <ProgressRing progress={pct} size={48} stroke={4} color={tones[w.tone].ink} track={tones[w.tone].bg}>
                    <Text style={{ fontFamily: fonts.semi, fontSize: 11 }}>{Math.round(pct * 100)}%</Text>
                  </ProgressRing>
                </View>
              );
            })}
          </View>
          <View style={styles.insightNote}>
            <IconTile icon="sparkles" tone="white" size={40} round />
            <Text style={{ flex: 1, fontSize: 14, lineHeight: 20 }}>
              You prayed {prayerPct}% of your prayers this week.{' '}
              {prayerPct >= 80 ? 'MashaAllah, keep it up.' : 'Every prayer counts. Keep going gently.'}
            </Text>
          </View>

          {/* Invite */}
          <View style={styles.invite}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontFamily: fonts.semi, fontSize: 18 }}>Invite a friend</Text>
              <Text variant="caption" style={{ fontSize: 13 }}>Grow your gardens together</Text>
              <Chip label="+50 XP each" tone="white" icon="star" />
              <Button label="Share invite" variant="dark" small icon="share-social" style={{ marginTop: 6 }} />
            </View>
            <Mascot size={100} bounce={false} />
          </View>

          {/* Settings */}
          <SectionTitle title="Settings" />
          <Card style={{ paddingVertical: 0 }}>
            <ToggleRow icon="notifications-outline" label="Prayer reminders" value={prayerAlerts} onChange={setPrayerAlerts} />
            <ToggleRow icon="happy-outline" label="Daily check-in reminder" value={checkinAlerts} onChange={setCheckinAlerts} last />
          </Card>
          <Card style={{ paddingVertical: 0, marginTop: space.sm + 2 }}>
            <ListRow icon="language-outline" label="Language" value="Soomaali" />
            <ListRow icon="location-outline" label="Prayer location" value={LOCATION.name} />
            <ListRow icon="moon-outline" label="Prayer method" value="MWL" />
            <ListRow icon="shield-checkmark-outline" label="Privacy & data" />
            <ListRow icon="help-circle-outline" label="Help & support" last />
          </Card>
          <Card style={{ paddingVertical: 0, marginTop: space.sm + 2 }}>
            <ListRow icon="refresh-outline" label="Replay onboarding" onPress={() => router.replace('/onboarding')} />
            <Pressable style={styles.signOut}>
              <Ionicons name="log-out-outline" size={20} color={colors.peachInk} />
              <Text style={{ fontFamily: fonts.medium, color: colors.peachInk }}>Sign out</Text>
            </Pressable>
          </Card>
          <Text variant="caption" style={{ textAlign: 'center', marginTop: space.lg }}>NAFIS v1.0.0 · Deen · Nafs · Jir</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ icon, tone, value, label, badge }: { icon: IconName; tone: Tone; value: string; label: string; badge?: string }) {
  return (
    <View style={styles.stat}>
      {badge ? <Chip label={badge} tone={tone} style={styles.statBadge} /> : null}
      <IconTile icon={icon} tone={tone} size={42} round />
      <View>
        <Text style={{ fontFamily: fonts.semi, fontSize: 18 }}>{value}</Text>
        <Text variant="caption">{label}</Text>
      </View>
    </View>
  );
}

function ToggleRow({
  icon,
  label,
  value,
  onChange,
  last,
}: {
  icon: IconName;
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <View style={[styles.toggle, !last && { borderBottomWidth: 1, borderBottomColor: colors.line }]}>
      <Ionicons name={icon} size={20} color={colors.ink} />
      <Text style={{ flex: 1, fontFamily: fonts.medium }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.line, true: colors.primary }}
        thumbColor={colors.white}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space.md },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  banner: {
    height: 150,
    backgroundColor: colors.skyDeep,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    paddingTop: 48,
    paddingHorizontal: space.md,
  },
  bannerButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: -52 },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.peach,
    borderWidth: 5,
    borderColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  level: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: space.lg - 4, marginTop: space.lg },
  levelKicker: { fontFamily: fonts.semi, fontSize: 12, letterSpacing: 1.5, color: 'rgba(255,255,255,0.7)' },
  levelRank: { fontFamily: fonts.semi, fontSize: 24, color: colors.white, marginTop: 2 },
  levelBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.butter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNext: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 10 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm + 2, marginTop: space.md },
  stat: { flexBasis: '47%', flexGrow: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: space.md, gap: 14 },
  statBadge: { position: 'absolute', top: 12, right: 12 },

  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.mint,
    borderRadius: radius.sm,
    padding: 10,
    marginTop: space.md,
  },

  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.butter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLocked: { backgroundColor: colors.line },
  lock: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg,
  },

  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 12,
    paddingRight: 16,
  },
  insightNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.mint,
    borderRadius: radius.lg,
    padding: 14,
    marginTop: space.sm + 2,
  },

  invite: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.peach,
    borderRadius: radius.lg,
    padding: space.md + 4,
    marginTop: space.lg,
    overflow: 'hidden',
  },

  toggle: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  signOut: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
});
