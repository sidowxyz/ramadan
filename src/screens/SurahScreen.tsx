import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { colors, fonts, radius, space } from '../theme';
import { Button, Chip, Segmented, Text } from '../components/ui';
import { IslamicPattern, ScreenHeader, StarNumber } from '../components/Islamic';
import { useAppWidth } from '../components/layout';
import { useDay } from '../state/DayContext';
import {
  getChapter,
  getChapterAudio,
  getVerses,
  plainText,
  TranslationKey,
  TRANSLATIONS,
  useQuery,
  Verse,
} from '../lib/quranApi';

const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ';

const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export function SurahScreen({ id }: { id: number }) {
  const width = useAppWidth();
  const { addPage, setLastSurah, translation, setTranslation } = useDay();
  const chapter = useQuery(() => getChapter(id), [id]);
  const audioUrl = useQuery(() => getChapterAudio(id), [id]);

  const [verses, setVerses] = useState<Verse[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);

  const player = useAudioPlayer(audioUrl.data ? { uri: audioUrl.data } : null);
  const status = useAudioPlayerStatus(player);

  // Each surah/translation switch bumps the generation, so a slow response
  // from the previous one can't leak into the new list.
  const generation = useRef(0);

  const loadPage = async (page: number) => {
    const gen = generation.current;
    setLoadingMore(true);
    setError(null);
    try {
      const r = await getVerses(id, page, translation);
      if (gen !== generation.current) return;
      setVerses((v) => (page === 1 ? r.verses : [...v, ...r.verses]));
      setNextPage(r.pagination.next_page);
    } catch (e) {
      if (gen === generation.current) setError(String((e as Error).message ?? e));
    } finally {
      if (gen === generation.current) setLoadingMore(false);
    }
  };

  useEffect(() => {
    generation.current += 1;
    setVerses([]);
    setNextPage(null);
    setLogged(false);
    loadPage(1);
  }, [id, translation]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (chapter.data) setLastSurah({ id, name: chapter.data.name_simple });
  }, [chapter.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const c = chapter.data;
  const failed = chapter.error || error;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title={c ? c.name_simple : 'Surah'} subtitle={c ? c.translated_name.name : undefined} />

        {failed ? (
          <View style={styles.errorCard}>
            <Ionicons name="cloud-offline-outline" size={26} color={colors.peachInk} />
            <Text style={{ fontFamily: fonts.semi, fontSize: 16, textAlign: 'center' }}>Can't reach the Qur'an server</Text>
            <Text variant="caption" style={{ fontSize: 13, lineHeight: 19, textAlign: 'center' }}>
              Make sure the Quran proxy is running on your PC (node server/qf-proxy.mjs) and your phone is on the same
              Wi-Fi.
            </Text>
            <Button
              label="Try again"
              small
              icon="refresh"
              onPress={() => {
                chapter.retry();
                audioUrl.retry();
                loadPage(verses.length === 0 ? 1 : (nextPage ?? 1));
              }}
            />
          </View>
        ) : null}

        {c ? (
          <View style={styles.hero}>
            <IslamicPattern width={width} height={300} />
            <RNText style={styles.arabicName}>{c.name_arabic}</RNText>
            <RNText style={styles.heroName}>{c.name_simple}</RNText>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <View style={styles.heroChip}>
                <RNText style={styles.heroChipText}>{c.revelation_place === 'makkah' ? 'Makki' : 'Madani'}</RNText>
              </View>
              <View style={styles.heroChip}>
                <RNText style={styles.heroChipText}>{c.verses_count} verses</RNText>
              </View>
            </View>

            <View style={styles.player}>
              <Pressable
                onPress={() => (status.playing ? player.pause() : player.play())}
                disabled={!audioUrl.data}
                accessibilityLabel={status.playing ? 'Pause recitation' : 'Play recitation'}
                style={[styles.playBtn, !audioUrl.data && { opacity: 0.5 }]}
              >
                <Ionicons name={status.playing ? 'pause' : 'play'} size={20} color={colors.primary} style={{ marginLeft: status.playing ? 0 : 2 }} />
              </Pressable>
              <View style={{ flex: 1, gap: 6 }}>
                <RNText style={styles.playerLabel}>Mishary al-Afasy</RNText>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      { width: `${status.duration ? (status.currentTime / status.duration) * 100 : 0}%` },
                    ]}
                  />
                </View>
              </View>
              <RNText style={styles.playerTime}>
                {fmtTime(status.currentTime || 0)}
                {status.duration ? ` / ${fmtTime(status.duration)}` : ''}
              </RNText>
            </View>
          </View>
        ) : chapter.loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: space.xl }} />
        ) : null}

        {c ? (
          <View style={{ marginTop: space.md }}>
            <Segmented
              options={Object.values(TRANSLATIONS).map((t) => t.label)}
              value={TRANSLATIONS[translation].label}
              onChange={(label) =>
                setTranslation((Object.keys(TRANSLATIONS) as TranslationKey[]).find((k) => TRANSLATIONS[k].label === label)!)
              }
              tone="lilac"
            />
          </View>
        ) : null}

        {c && c.bismillah_pre ? <RNText style={styles.bismillah}>{BISMILLAH}</RNText> : null}

        <View style={{ gap: space.sm + 2, marginTop: space.md }}>
          {verses.map((v) => (
            <View key={v.id} style={styles.verse}>
              <View style={styles.verseTop}>
                <StarNumber n={v.verse_number} size={34} />
                <Chip label={`Juz ${v.juz_number} · Page ${v.page_number}`} />
              </View>
              <RNText style={styles.verseArabic}>{v.text_uthmani}</RNText>
              {v.translations?.[0] ? (
                <Text style={styles.verseEn}>{plainText(v.translations[0].text)}</Text>
              ) : null}
            </View>
          ))}
        </View>

        {loadingMore ? <ActivityIndicator color={colors.primary} style={{ marginTop: space.md }} /> : null}

        {nextPage && verses.length > 0 && !loadingMore ? (
          <Button
            label="Load more verses"
            variant="light"
            icon="chevron-down"
            style={{ marginTop: space.md }}
            onPress={() => loadPage(nextPage)}
          />
        ) : null}

        {!nextPage && verses.length > 0 ? (
          <View style={styles.end}>
            <Text variant="caption" style={{ fontSize: 13 }}>End of {c?.name_simple}</Text>
            <Button
              label={logged ? 'Logged · JazakAllahu khayran' : 'Log a page read'}
              icon={logged ? 'checkmark' : 'add'}
              tone={logged ? 'mint' : undefined}
              onPress={() => {
                if (!logged) addPage();
                setLogged(true);
              }}
            />
          </View>
        ) : null}

        <View style={styles.nav}>
          {id > 1 ? (
            <Button label={`Surah ${id - 1}`} variant="light" icon="arrow-back" small onPress={() => router.replace(`/surah/${id - 1}`)} />
          ) : (
            <View />
          )}
          {id < 114 ? (
            <Button label={`Surah ${id + 1}`} variant="light" icon="arrow-forward" small onPress={() => router.replace(`/surah/${id + 1}`)} />
          ) : null}
        </View>

        <Text variant="caption" style={styles.credit}>
          Translation: {TRANSLATIONS[translation].name}. Text and audio via Quran Foundation / Quran.com.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingTop: 48, paddingBottom: 48 },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    padding: space.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  arabicName: { fontSize: 40, lineHeight: 64, color: colors.butter },
  heroName: { fontFamily: fonts.semi, fontSize: 20, color: colors.white },
  heroChip: { backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: radius.pill, paddingVertical: 5, paddingHorizontal: 12 },
  heroChipText: { fontFamily: fonts.medium, fontSize: 12, color: colors.white },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.lg,
    padding: 12,
    marginTop: space.lg,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerLabel: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  track: { height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' },
  fill: { height: 4, borderRadius: 2, backgroundColor: colors.butter },
  playerTime: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  bismillah: { fontSize: 28, lineHeight: 52, textAlign: 'center', color: colors.ink, marginTop: space.lg },
  verse: { backgroundColor: colors.card, borderRadius: radius.lg, padding: space.md + 2, gap: 10 },
  verseTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  verseArabic: { fontSize: 28, lineHeight: 56, textAlign: 'right', writingDirection: 'rtl', color: colors.ink },
  verseEn: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, color: colors.inkSoft },
  end: { alignItems: 'center', gap: space.sm, marginTop: space.lg },
  errorCard: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.peach,
    borderRadius: radius.lg,
    padding: space.lg,
    marginBottom: space.md,
  },
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.lg },
  credit: { textAlign: 'center', fontSize: 11, marginTop: space.lg },
});
