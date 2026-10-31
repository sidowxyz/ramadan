import { Pressable, ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, space } from '../theme';
import { B, Button, Card, CircleButton, Fraction, ProgressRing, SectionTitle, SegmentBar, Text } from '../components/ui';
import { FeatureLink, IslamicPattern } from '../components/Islamic';
import { useAppWidth } from '../components/layout';
import { QURAN_GOAL, useDay } from '../state/DayContext';
import { formatTime, hijriToday, LOCATION, untilLabel, upcomingIndex } from '../lib/prayerTimes';
import { MORNING_EVENING } from '../data/adhkar';
import { MUSHAF_PAGES, readingPage } from '../data/quran';

export function DeenScreen() {
  const width = useAppWidth();
  const { now, times, prayed, togglePrayer, pages, addPage, dhikrCounts, tasbihTotal } = useDay();
  const upIndex = upcomingIndex(times, now);
  const upcoming = upIndex >= 0 ? times.prayers[upIndex] : null;
  const prayedCount = prayed.filter(Boolean).length;

  const page = readingPage(pages);
  const adhkarDone = MORNING_EVENING.filter((d) => (dhikrCounts[d.id] ?? 0) >= d.count).length;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" style={{ fontSize: 14 }}>{hijriToday()}</Text>
            <Text variant="hero" style={{ marginTop: 4 }}>
              Your <B>Deen</B>
            </Text>
          </View>
          <CircleButton icon="compass-outline" label="Qibla" onPress={() => router.push('/qibla')} />
        </View>

        {/* Prayer times */}
        <View style={styles.prayerCard}>
          <IslamicPattern width={width} height={420} />
          <View style={styles.crescent} pointerEvents="none">
            <Ionicons name="moon" size={64} color={colors.butter} style={{ transform: [{ rotate: '-25deg' }] }} />
          </View>

          <View style={styles.locationChip}>
            <Ionicons name="location-outline" size={13} color={colors.white} />
            <RNText style={styles.locationText}>{LOCATION.name}</RNText>
          </View>

          <RNText style={styles.kicker}>{upcoming ? 'Next prayer' : 'Next prayer · tomorrow'}</RNText>
          <RNText style={styles.nextName}>{upcoming ? upcoming.name : 'Fajr'}</RNText>
          <View style={styles.nextRow}>
            <RNText style={styles.nextTime}>{upcoming ? formatTime(upcoming.at) : '—'}</RNText>
            {upcoming ? (
              <View style={styles.countdown}>
                <Ionicons name="time-outline" size={13} color={colors.primary} />
                <RNText style={styles.countdownText}>{untilLabel(upcoming.at, now)}</RNText>
              </View>
            ) : null}
          </View>

          <View style={styles.times}>
            {times.prayers.map((p, i) => {
              const on = prayed[i];
              const isNext = i === upIndex;
              return (
                <Pressable
                  key={p.name}
                  onPress={() => togglePrayer(i)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={`${p.name} prayed`}
                  style={[styles.timeCol, isNext && styles.timeColNext]}
                >
                  <RNText style={styles.timeName}>{p.name}</RNText>
                  <RNText style={styles.timeValue}>{formatTime(p.at)}</RNText>
                  <View style={[styles.tick, on && styles.tickOn, !on && isNext && styles.tickNext]}>
                    {on ? <Ionicons name="checkmark" size={13} color={colors.primary} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.cardFoot}>
            <RNText style={styles.footText}>
              Sunrise {formatTime(times.sunrise)} · {LOCATION.method}
            </RNText>
            <RNText style={styles.footText}>
              {prayedCount}/{times.prayers.length} prayed
            </RNText>
          </View>
        </View>

        {/* Tools */}
        <View style={styles.tools}>
          <FeatureLink href="/quran" icon="book" label="Qur'an" bg={colors.lilac} color={colors.lilacInk} />
          <FeatureLink href="/azkar" icon="sunny" label="Azkar" bg={colors.mint} color={colors.mintInk} />
          <FeatureLink href="/qibla" icon="compass" label="Qibla" bg={colors.sky} color={colors.skyInk} />
          <FeatureLink href="/tasbeeh" icon="ellipsis-horizontal-circle" label="Tasbeeh" bg={colors.peach} color={colors.peachInk} />
          <FeatureLink href="/duas" icon="hand-left" label="Duas" bg={colors.pink} color={colors.pinkInk} />
        </View>

        {/* Today */}
        <SectionTitle title="Today" />
        <Card tone="lilac">
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="caption">Qur'an today</Text>
              <Fraction value={pages} total={QURAN_GOAL} unit="pages" size={32} />
              <View style={{ width: 140, marginTop: 6 }}>
                <SegmentBar total={QURAN_GOAL} filled={pages} color={colors.lilacInk} track="rgba(255,255,255,0.7)" height={8} />
              </View>
            </View>
            <ProgressRing progress={page / MUSHAF_PAGES} size={84} stroke={8} color={colors.lilacInk} track="rgba(255,255,255,0.7)">
              <Text style={{ fontFamily: fonts.semi, fontSize: 15 }}>{Math.round((page / MUSHAF_PAGES) * 100)}%</Text>
              <Text variant="caption" style={{ fontSize: 9 }}>Khatm</Text>
            </ProgressRing>
          </View>
          <View style={styles.cardActions}>
            <Button label="Continue reading" icon="book-outline" small onPress={() => router.push('/quran')} />
            <Button label="+1 page" tone="white" small onPress={addPage} />
          </View>
        </Card>

        <View style={styles.pair}>
          <Pressable style={[styles.mini, { backgroundColor: colors.mint }]} onPress={() => router.push('/azkar')}>
            <Ionicons name="sunny" size={22} color={colors.mintInk} />
            <Text style={styles.miniTitle}>Azkar</Text>
            <Fraction value={adhkarDone} total={MORNING_EVENING.length} size={22} />
            <Text variant="caption">morning & evening</Text>
          </Pressable>
          <Pressable style={[styles.mini, { backgroundColor: colors.peach }]} onPress={() => router.push('/tasbeeh')}>
            <Ionicons name="ellipsis-horizontal-circle" size={22} color={colors.peachInk} />
            <Text style={styles.miniTitle}>Tasbeeh</Text>
            <Fraction value={tasbihTotal} size={22} />
            <Text variant="caption">counted today</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingTop: 48, paddingBottom: 130 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: space.lg },

  prayerCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: space.lg - 4,
    overflow: 'hidden',
  },
  crescent: { position: 'absolute', top: 18, right: 22, opacity: 0.95 },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  locationText: { fontFamily: fonts.medium, fontSize: 12, color: colors.white },
  kicker: { fontFamily: fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: space.md },
  nextName: { fontFamily: fonts.semi, fontSize: 26, color: colors.white, marginTop: 2 },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nextTime: { fontFamily: fonts.light, fontSize: 58, lineHeight: 66, letterSpacing: -2, color: colors.white },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.butter,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  countdownText: { fontFamily: fonts.semi, fontSize: 12, color: colors.primary },

  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: space.md,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  timeCol: { flex: 1, alignItems: 'center', gap: 5, paddingVertical: 10, borderRadius: radius.md },
  timeColNext: { backgroundColor: 'rgba(255,255,255,0.12)' },
  timeName: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  timeValue: { fontFamily: fonts.semi, fontSize: 14, color: colors.white },
  tick: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tickOn: { backgroundColor: colors.white, borderColor: colors.white },
  tickNext: { borderColor: colors.butter, borderWidth: 2 },
  cardFoot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.md },
  footText: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.6)' },

  tools: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.lg, gap: 4 },

  cardActions: { flexDirection: 'row', gap: space.sm, marginTop: space.md },
  pair: { flexDirection: 'row', gap: space.sm + 2, marginTop: space.sm + 2 },
  mini: { flex: 1, borderRadius: radius.lg, padding: space.md, gap: 4 },
  miniTitle: { fontFamily: fonts.semi, fontSize: 16, color: colors.ink, marginTop: 6 },
});
