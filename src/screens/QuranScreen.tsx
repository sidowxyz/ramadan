import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text as RNText, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, space } from '../theme';
import { Button, Card, Fraction, MiniBars, ProgressRing, SectionTitle, SegmentBar, Text } from '../components/ui';
import { IslamicPattern, ScreenHeader, StarNumber } from '../components/Islamic';
import { getChapters, useQuery } from '../lib/quranApi';
import { useAppWidth } from '../components/layout';
import { QURAN_GOAL, useDay } from '../state/DayContext';
import { juzForPage, MUSHAF_PAGES, readingPage } from '../data/quran';

const PAST_WEEK_PAGES = [5, 3, 5, 2, 4, 5]; // sample until reading history is stored

export function QuranScreen() {
  const width = useAppWidth();
  const { pages, addPage, lastSurah } = useDay();
  const chapters = useQuery(getChapters, []);
  const [query, setQuery] = useState('');
  const [place, setPlace] = useState<'All' | 'Makki' | 'Madani'>('All');

  // Match "baqarah", "al baqara", "cow" or "2", ignoring dashes, accents and "al-".
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '')
      .replace(/^al/, '');
  const q = norm(query);
  const shown = (chapters.data ?? []).filter(
    (ch) =>
      (place === 'All' || (place === 'Makki') === (ch.revelation_place === 'makkah')) &&
      (!q ||
        String(ch.id) === query.trim() ||
        norm(ch.name_simple).includes(q) ||
        norm(ch.translated_name.name).includes(q)),
  );
  const page = readingPage(pages);
  const pct = page / MUSHAF_PAGES;
  const week = [...PAST_WEEK_PAGES, pages];

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Qur'an" subtitle="Your reading journey" />

        <View style={styles.hero}>
          <IslamicPattern width={width} height={360} />
          <ProgressRing progress={pct} size={170} stroke={12} color={colors.butter} track="rgba(255,255,255,0.15)">
            <RNText style={styles.pct}>{Math.round(pct * 100)}%</RNText>
            <RNText style={styles.pctLabel}>to khatm</RNText>
          </ProgressRing>
          <RNText style={styles.page}>Page {page}</RNText>
          <RNText style={styles.sub}>
            Juz {juzForPage(page)} · {MUSHAF_PAGES - page} pages left
          </RNText>
          <Button
            label={lastSurah ? `Continue ${lastSurah.name}` : 'Start reading'}
            icon="book"
            variant="light"
            style={{ alignSelf: 'stretch', marginTop: space.md }}
            onPress={() => router.push(`/surah/${lastSurah?.id ?? 1}`)}
          />
        </View>

        <SectionTitle title="Today's goal" />
        <Card tone="lilac">
          <View style={styles.rowBetween}>
            <Fraction value={pages} total={QURAN_GOAL} unit="pages" size={34} />
            <Button label="+1 page" tone="white" small icon="add" onPress={addPage} />
          </View>
          <View style={{ marginTop: space.md }}>
            <SegmentBar total={QURAN_GOAL} filled={pages} color={colors.lilacInk} track="rgba(255,255,255,0.7)" height={10} />
          </View>
        </Card>

        <SectionTitle title="This week" action={`${week.reduce((a, b) => a + b, 0)} pages`} />
        <Card>
          <MiniBars values={week.map((v) => Math.max(v, 0.3))} color={colors.lilacInk} height={80} />
          <View style={{ flexDirection: 'row', gap: 4, marginTop: 8 }}>
            {['6d', '5d', '4d', '3d', '2d', '1d', 'Today'].map((d) => (
              <Text key={d} variant="caption" style={{ flex: 1, textAlign: 'center', fontSize: 10 }}>{d}</Text>
            ))}
          </View>
        </Card>

        <SectionTitle title="Surahs" action={chapters.data ? `${chapters.data.length} available` : undefined} />
        {chapters.loading ? <ActivityIndicator color={colors.primary} /> : null}
        {chapters.error ? (
          <View style={styles.note}>
            <Ionicons name="cloud-offline-outline" size={18} color={colors.peachInk} />
            <Text style={{ flex: 1, fontSize: 13, lineHeight: 19 }}>
              Can't reach the Qur'an server. Start it on your PC with node server/qf-proxy.mjs.
            </Text>
            <Button label="Retry" small tone="white" onPress={chapters.retry} />
          </View>
        ) : null}
        {chapters.data ? (
          <View style={{ gap: space.sm, marginBottom: space.md }}>
            <View style={styles.search}>
              <Ionicons name="search" size={18} color={colors.inkSoft} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by name, meaning or number"
                placeholderTextColor={colors.inkFaint}
                style={styles.searchInput}
                autoCorrect={false}
              />
              {query ? (
                <Pressable onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Clear search">
                  <Ionicons name="close-circle" size={18} color={colors.inkFaint} />
                </Pressable>
              ) : null}
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {(['All', 'Makki', 'Madani'] as const).map((f) => (
                <Pressable key={f} onPress={() => setPlace(f)} style={[styles.filter, place === f && styles.filterOn]}>
                  <RNText style={[styles.filterText, place === f && { color: colors.white }]}>{f}</RNText>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
        {chapters.data && shown.length === 0 ? (
          <Text variant="caption" style={{ textAlign: 'center', fontSize: 14, padding: space.lg }}>
            No surah matches “{query}”.
          </Text>
        ) : null}
        <View style={{ gap: space.sm }}>
          {shown.map((ch) => (
            <Pressable
              key={ch.id}
              onPress={() => router.push(`/surah/${ch.id}`)}
              style={({ pressed }) => [styles.surah, pressed && { opacity: 0.8 }]}
            >
              <StarNumber n={ch.id} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.semi, fontSize: 15 }}>{ch.name_simple}</Text>
                <Text variant="caption">
                  {ch.translated_name.name} · {ch.verses_count} verses · {ch.revelation_place === 'makkah' ? 'Makki' : 'Madani'}
                </Text>
              </View>
              <RNText style={styles.surahArabic}>{ch.name_arabic}</RNText>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingTop: 48, paddingBottom: 48 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: space.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  pct: { fontFamily: fonts.light, fontSize: 40, letterSpacing: -1, color: colors.white },
  pctLabel: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  page: { fontFamily: fonts.semi, fontSize: 24, color: colors.white, marginTop: space.md },
  sub: { fontFamily: fonts.medium, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.peach,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: space.sm,
  },
  surah: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 12,
    paddingRight: 16,
  },
  surahArabic: { fontSize: 22, lineHeight: 36, color: colors.primary },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink },
  filter: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: radius.pill, backgroundColor: colors.white },
  filterOn: { backgroundColor: colors.dark },
  filterText: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
});
