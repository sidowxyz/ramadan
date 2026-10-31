import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, space } from '../theme';
import { Chip, Text } from '../components/ui';
import { ScreenHeader } from '../components/Islamic';
import { DUAS } from '../data/duas';

const FILTERS = ['All', 'Daily life', 'From the Qur’an', 'Saved'] as const;

export function DuasScreen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [saved, setSaved] = useState<string[]>([]);

  const list = DUAS.filter((d) =>
    filter === 'All' ? true : filter === 'Saved' ? saved.includes(d.id) : d.category === filter,
  );

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Duas" subtitle={`${DUAS.length} everyday supplications`} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ marginBottom: space.md }}>
          {FILTERS.map((f) => {
            const on = f === filter;
            return (
              <Pressable key={f} onPress={() => setFilter(f)} style={[styles.filter, on && styles.filterOn]}>
                <RNText style={[styles.filterText, on && { color: colors.white }]}>
                  {f}
                  {f === 'Saved' && saved.length ? ` · ${saved.length}` : ''}
                </RNText>
              </Pressable>
            );
          })}
        </ScrollView>

        {list.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={28} color={colors.inkFaint} />
            <Text variant="caption" style={{ fontSize: 14, textAlign: 'center' }}>
              Tap the heart on a dua to keep it here.
            </Text>
          </View>
        ) : null}

        <View style={{ gap: space.sm + 2 }}>
          {list.map((d) => {
            const isSaved = saved.includes(d.id);
            return (
              <View key={d.id} style={styles.card}>
                <View style={styles.rowBetween}>
                  <Text style={{ fontFamily: fonts.semi, fontSize: 16 }}>{d.title}</Text>
                  <Pressable
                    onPress={() => setSaved((s) => (isSaved ? s.filter((x) => x !== d.id) : [...s, d.id]))}
                    hitSlop={8}
                    accessibilityLabel={isSaved ? 'Remove from saved' : 'Save dua'}
                  >
                    <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={22} color={isSaved ? colors.pinkInk : colors.inkFaint} />
                  </Pressable>
                </View>
                <RNText style={styles.arabic}>{d.arabic}</RNText>
                <Text style={styles.translit}>{d.transliteration}</Text>
                <Text variant="caption" style={{ fontSize: 13, lineHeight: 19 }}>{d.meaning}</Text>
                <Chip label={d.source} tone="pink" icon="bookmark-outline" style={{ marginTop: 4 }} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingTop: 48, paddingBottom: 48 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filter: { paddingVertical: 9, paddingHorizontal: 16, borderRadius: radius.pill, backgroundColor: colors.white },
  filterOn: { backgroundColor: colors.dark },
  filterText: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  empty: { alignItems: 'center', gap: 8, padding: space.xl },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: space.md + 2, gap: 8 },
  arabic: { fontSize: 24, lineHeight: 44, textAlign: 'right', writingDirection: 'rtl', color: colors.ink, marginVertical: 4 },
  translit: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.ink },
});
