import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, space, Tone, tones } from '../theme';
import { B, Button, CircleButton, Text } from '../components/ui';

const languages = [
  { id: 'so', label: 'Soomaali' },
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'العربية' },
];

const goals: { id: string; label: string; sub: string; emoji: string; tone: Tone }[] = [
  { id: 'deen', label: 'Deen', sub: 'Prayer, Qur’an, adhkar', emoji: '🌙', tone: 'lilac' },
  { id: 'mind', label: 'Mind', sub: 'Mood, calm, gratitude', emoji: '🧘', tone: 'pink' },
  { id: 'body', label: 'Body', sub: 'Water, sleep, walking', emoji: '🏃', tone: 'mint' },
];

export function SetupScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [lang, setLang] = useState('so');
  const [picked, setPicked] = useState<string[]>(['deen', 'mind']);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <CircleButton icon="chevron-back" onPress={onBack} label="Back" />
          <View style={styles.bars}>
            <View style={[styles.bar, styles.barOn]} />
            <View style={[styles.bar, styles.barOn]} />
            <View style={styles.bar} />
          </View>
        </View>

        <Text variant="hero" style={{ marginTop: space.lg }}>
          Let's set up{'\n'}<B>your NAFIS</B>
        </Text>
        <Text variant="caption" style={{ fontSize: 14, marginTop: 8 }}>
          You can change all of this later in settings.
        </Text>

        <Text variant="heading" style={styles.h}>Language</Text>
        <View style={{ flexDirection: 'row', gap: space.sm }}>
          {languages.map((l) => {
            const on = lang === l.id;
            return (
              <Pressable key={l.id} onPress={() => setLang(l.id)} style={[styles.lang, on && styles.langOn]}>
                <RNText style={[styles.langText, on && { color: colors.white }]}>{l.label}</RNText>
              </Pressable>
            );
          })}
        </View>

        <Text variant="heading" style={styles.h}>What do you want to grow?</Text>
        <View style={styles.grid}>
          {goals.map((g) => {
            const on = picked.includes(g.id);
            return (
              <Pressable
                key={g.id}
                onPress={() => toggle(g.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                style={[styles.goal, { backgroundColor: on ? colors.primary : tones[g.tone].bg }]}
              >
                <View style={styles.goalTop}>
                  <RNText style={{ fontSize: 34 }}>{g.emoji}</RNText>
                  <View style={[styles.check, on && styles.checkOn]}>
                    {on ? <Ionicons name="checkmark" size={16} color={colors.primary} /> : null}
                  </View>
                </View>
                <Text style={[styles.goalLabel, on && { color: colors.white }]}>{g.label}</Text>
                <Text variant="caption" style={on ? { color: 'rgba(255,255,255,0.75)' } : null}>
                  {g.sub}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Continue" onPress={onDone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.lg, paddingTop: 48, paddingBottom: 24 },
  top: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  bars: { flex: 1, flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  barOn: { backgroundColor: colors.ink },
  h: { marginTop: space.lg + 4, marginBottom: space.md },
  lang: {
    flex: 1,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langOn: { backgroundColor: colors.dark },
  langText: { fontFamily: fonts.medium, fontSize: 15, color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm + 4 },
  goal: { flexBasis: '46%', flexGrow: 1, borderRadius: radius.lg, padding: space.md + 2, gap: 4, minHeight: 150 },
  goalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' },
  goalLabel: { fontFamily: fonts.semi, fontSize: 17, marginTop: space.md },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(20,32,31,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.white, borderColor: colors.white },
  footer: { paddingHorizontal: space.lg, paddingBottom: 28, paddingTop: 8 },
});
