import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppWidth } from '../components/layout';
import { colors, fonts, space } from '../theme';
import { B, Text } from '../components/ui';
import { Mascot } from '../components/Mascot';
import { Bubble } from '../components/Decor';

type Part = string | { b: string };

const slides: { bg: string; title: Part[]; body: string; emojis: string[] }[] = [
  {
    bg: colors.skyDeep,
    title: ['Your daily ', { b: 'boost' }, ' for ', { b: 'heart, mind' }, ' & ', { b: 'body' }],
    body: 'Check in, breathe, move. One small step at a time.',
    emojis: ['❤️', '💧', '🌿', '😊'],
  },
  {
    bg: '#D2CCF5',
    title: ['Keep your ', { b: 'Deen' }, ' close, wherever ', { b: 'life' }, ' takes you'],
    body: 'Prayer times, Qur’an goals and adhkar, with reminders that never judge.',
    emojis: ['🌙', '📖', '🤲', '⭐'],
  },
  {
    bg: '#F0C7E1',
    title: ['Watch your ', { b: 'garden' }, ' grow with every ', { b: 'habit' }],
    body: 'Pray, drink water, walk, check in. Each small step helps your Growth Garden bloom.',
    emojis: ['🌱', '🌸', '👣', '⭐'],
  },
];

const bubbleSpots = [
  { top: '6%', left: '6%' },
  { top: '0%', right: '24%' },
  { top: '42%', left: '2%' },
  { top: '30%', right: '4%' },
] as const;

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const width = useAppWidth();
  const { height } = useWindowDimensions();
  const short = height < 700;
  const ref = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [index, setIndex] = useState(0);
  const last = index === slides.length - 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Only sync once the scroll has settled on a page, so an in-flight
    // scrollTo from the Next button isn't overridden mid-animation.
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / width);
    if (Math.abs(x - i * width) < 2 && i !== index) setIndex(i);
  };

  const next = () => {
    if (last) return onDone();
    ref.current?.scrollTo({ x: width * (index + 1), animated: true });
    setIndex(index + 1);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {slides.map((s, i) => (
          <View key={i} style={{ width, height, padding: 8 }}>
            <View style={[styles.card, { backgroundColor: s.bg }]}>
              <View style={styles.bars}>
                {slides.map((_, j) => (
                  <View key={j} style={[styles.bar, j <= i && styles.barOn]} />
                ))}
              </View>
              <Text style={styles.count}>
                {i + 1} - {slides.length}
              </Text>
              <Text variant="hero" style={[styles.title, short && styles.titleShort]}>
                {s.title.map((p, k) => (typeof p === 'string' ? p : <B key={k}>{p.b}</B>))}
              </Text>
              <Text style={styles.body}>{s.body}</Text>

              <View style={styles.hero}>
                {s.emojis.map((e, k) => (
                  <Bubble key={k} emoji={e} size={k % 2 ? 54 : 64} style={bubbleSpots[k]} />
                ))}
                <Mascot size={short ? 190 : 250} bounce={i === index} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <Pressable style={styles.skip} onPress={onDone} hitSlop={8}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <Pressable onPress={next} style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]}>
        <Text style={styles.ctaText}>{last ? 'GET STARTED' : 'NEXT'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  card: { flex: 1, borderRadius: 40, paddingTop: 52, paddingHorizontal: space.lg, overflow: 'hidden' },
  bars: { flexDirection: 'row', gap: 6, marginRight: 60 },
  bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.6)' },
  barOn: { backgroundColor: colors.ink },
  count: { fontFamily: fonts.medium, fontSize: 18, color: colors.ink, marginTop: 22 },
  title: { fontSize: 36, lineHeight: 42, marginTop: 14 },
  titleShort: { fontSize: 28, lineHeight: 34 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.ink, opacity: 0.75, marginTop: 10 },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 104 },
  skip: { position: 'absolute', top: 50, right: 30 },
  skipText: { fontFamily: fonts.semi, fontSize: 14, color: colors.ink },
  cta: {
    position: 'absolute',
    left: 28,
    right: 28,
    bottom: 32,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontFamily: fonts.semi, fontSize: 16, letterSpacing: 1, color: colors.ink },
});
