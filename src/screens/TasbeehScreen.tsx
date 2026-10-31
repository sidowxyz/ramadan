import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts, radius, space } from '../theme';
import { Chip, CircleButton, Fraction, ProgressRing, Text } from '../components/ui';
import { IslamicPattern, ScreenHeader } from '../components/Islamic';
import { useAppWidth } from '../components/layout';
import { useDay } from '../state/DayContext';
import { TASBIH } from '../data/adhkar';

const TARGETS = [33, 99, 100];

export function TasbeehScreen() {
  const width = useAppWidth();
  const { tasbihTotal, addTasbih } = useDay();
  const [phrase, setPhrase] = useState(TASBIH[0].id);
  const [target, setTarget] = useState(33);
  const [beads, setBeads] = useState(0);
  const [rounds, setRounds] = useState(0);
  const current = TASBIH.find((t) => t.id === phrase)!;
  const ring = Math.min(300, width - 64);

  const count = () => {
    addTasbih();
    if (beads + 1 >= target) {
      setBeads(0);
      setRounds((r) => r + 1);
    } else {
      setBeads(beads + 1);
    }
  };
  const reset = () => {
    setBeads(0);
    setRounds(0);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Tasbeeh" subtitle={`${tasbihTotal} counted today`} />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {TASBIH.map((t) => {
            const on = t.id === phrase;
            return (
              <Pressable
                key={t.id}
                onPress={() => {
                  setPhrase(t.id);
                  reset();
                }}
                style={[styles.pill, on && styles.pillOn]}
              >
                <RNText style={[styles.pillText, on && { color: colors.white }]}>{t.label}</RNText>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          onPress={count}
          accessibilityLabel={`Count ${current.label}`}
          style={({ pressed }) => [styles.stage, pressed && { transform: [{ scale: 0.98 }] }]}
        >
          <IslamicPattern width={width} height={480} />
          <ProgressRing progress={beads / target} size={ring} stroke={16} color={colors.butter} track="rgba(255,255,255,0.14)">
            <View style={{ alignItems: 'center', gap: 4 }}>
              <RNText style={styles.arabic}>{current.arabic}</RNText>
              <Fraction value={beads} total={target} size={64} color={colors.white} />
              <Text style={styles.hint}>Tap anywhere to count</Text>
            </View>
          </ProgressRing>
        </Pressable>

        <View style={styles.controls}>
          <Chip label={`Round ${rounds + 1}`} tone="mint" icon="repeat" />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {TARGETS.map((t) => (
              <Pressable
                key={t}
                onPress={() => {
                  setTarget(t);
                  reset();
                }}
                style={[styles.target, t === target && styles.targetOn]}
              >
                <RNText style={[styles.targetText, t === target && { color: colors.white }]}>{t}</RNText>
              </Pressable>
            ))}
          </View>
          <CircleButton icon="refresh" size={42} label="Reset tasbeeh" onPress={reset} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingTop: 48, paddingBottom: 48 },
  pill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radius.pill, backgroundColor: colors.white },
  pillOn: { backgroundColor: colors.dark },
  pillText: { fontFamily: fonts.medium, fontSize: 13, color: colors.ink },
  stage: {
    marginTop: space.md,
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: space.xl,
    alignItems: 'center',
    overflow: 'hidden',
  },
  arabic: { fontSize: 30, lineHeight: 46, color: colors.white, writingDirection: 'rtl' },
  hint: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.md },
  target: {
    minWidth: 44,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetOn: { backgroundColor: colors.primary },
  targetText: { fontFamily: fonts.semi, fontSize: 13, color: colors.ink },
});
