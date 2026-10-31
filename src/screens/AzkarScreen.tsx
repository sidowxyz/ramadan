import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, radius, space } from '../theme';
import { Chip, Segmented, Text } from '../components/ui';
import { ScreenHeader } from '../components/Islamic';
import { useDay } from '../state/DayContext';
import { AFTER_PRAYER, MORNING_EVENING } from '../data/adhkar';

export function AzkarScreen() {
  const { dhikrCounts, countDhikr } = useDay();
  const [set, setSet] = useState('Morning & evening');
  const adhkar = set === 'After prayer' ? AFTER_PRAYER : MORNING_EVENING;
  const doneCount = adhkar.filter((d) => (dhikrCounts[d.id] ?? 0) >= d.count).length;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Azkar" subtitle={`${doneCount} of ${adhkar.length} done`} />
        <Segmented options={['Morning & evening', 'After prayer']} value={set} onChange={setSet} tone="mint" />
        <Text variant="caption" style={{ textAlign: 'center', marginVertical: space.md }}>
          Tap a card each time you say it.
        </Text>

        <View style={{ gap: space.sm + 2 }}>
          {adhkar.map((d) => {
            const n = dhikrCounts[d.id] ?? 0;
            const complete = n >= d.count;
            return (
              <Pressable
                key={d.id}
                onPress={() => countDhikr(d.id, d.count)}
                accessibilityLabel={`${d.transliteration}, ${n} of ${d.count}`}
                style={({ pressed }) => [styles.card, complete && styles.cardDone, pressed && { opacity: 0.85 }]}
              >
                <View style={styles.rowBetween}>
                  <Chip label={`×${d.count}`} tone={complete ? 'mint' : 'white'} />
                  <Text variant="caption">{d.source}</Text>
                </View>
                <RNText style={styles.arabic}>{d.arabic}</RNText>
                <Text style={{ fontFamily: fonts.medium, fontSize: 14 }}>{d.transliteration}</Text>
                <Text variant="caption" style={{ fontSize: 13, lineHeight: 19 }}>{d.meaning}</Text>
                <View style={[styles.rowBetween, { marginTop: 6 }]}>
                  <View style={styles.track}>
                    <View
                      style={[
                        styles.fill,
                        { width: `${(n / d.count) * 100}%`, backgroundColor: complete ? colors.mintInk : colors.primary },
                      ]}
                    />
                  </View>
                  <Text style={styles.count}>{complete ? 'Done' : `${n}/${d.count}`}</Text>
                </View>
              </Pressable>
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
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: space.md + 2, gap: 6 },
  cardDone: { backgroundColor: '#F1F8F2' },
  arabic: { fontSize: 24, lineHeight: 44, textAlign: 'right', writingDirection: 'rtl', color: colors.ink, marginVertical: 6 },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.cardSoft, overflow: 'hidden', marginRight: 12 },
  fill: { height: 6, borderRadius: 3 },
  count: { fontFamily: fonts.semi, fontSize: 13, color: colors.ink, minWidth: 44, textAlign: 'right' },
});
