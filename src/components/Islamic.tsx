import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, fonts, space } from '../theme';
import { CircleButton, IconName } from './ui';

// Eight-point star (Rub el Hizb): two squares, one turned 45 degrees.
function starPath(c: number, s: number) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? s : s * 0.8;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    pts.push(`${c + r * Math.cos(a)} ${c + r * Math.sin(a)}`);
  }
  return `M ${pts.join(' L ')} Z`;
}

// Faint repeating star lattice for dark Islamic cards.
export function IslamicPattern({ width, height, opacity = 0.02 }: { width: number; height: number; opacity?: number }) {
  const cell = 46;
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <G opacity={opacity}>
        {Array.from({ length: rows * cols }, (_, i) => {
          const x = (i % cols) * cell;
          const y = Math.floor(i / cols) * cell;
          return (
            <G key={i} transform={`translate(${x - cell / 2} ${y - cell / 2})`}>
              <Rect x={cell * 0.25} y={cell * 0.25} width={cell * 0.5} height={cell * 0.5} stroke="#fff" strokeWidth={1} fill="none" />
              <Rect
                x={cell * 0.25}
                y={cell * 0.25}
                width={cell * 0.5}
                height={cell * 0.5}
                stroke="#fff"
                strokeWidth={1}
                fill="none"
                transform={`rotate(45 ${cell / 2} ${cell / 2})`}
              />
            </G>
          );
        })}
      </G>
    </Svg>
  );
}

export function StarIcon({
  icon,
  bg,
  color,
  size = 62,
}: {
  icon: IconName;
  bg: string;
  color: string;
  size?: number;
}) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Path d={starPath(size / 2, size / 2)} fill={bg} />
      </Svg>
      <Ionicons name={icon} size={size * 0.38} color={color} />
    </View>
  );
}

// Number inside an eight-point star, for surah and verse numbers.
export function StarNumber({ n, size = 40, bg = colors.lilac, color = colors.lilacInk }: { n: number; size?: number; bg?: string; color?: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Path d={starPath(size / 2, size / 2)} fill={bg} />
      </Svg>
      <Text style={{ fontFamily: fonts.semi, fontSize: size * (n > 99 ? 0.26 : 0.32), color }}>{n}</Text>
    </View>
  );
}

// Header for full screens opened from the Deen tab (outside the tab bar).
export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.header}>
      <CircleButton icon="chevron-back" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/deen'))} />
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={{ width: 48 }} />
    </View>
  );
}

export function FeatureLink({
  icon,
  label,
  bg,
  color,
  href,
}: {
  icon: IconName;
  label: string;
  bg: string;
  color: string;
  href: '/quran' | '/azkar' | '/qibla' | '/tasbeeh' | '/duas';
}) {
  return (
    <Pressable
      onPress={() => router.push(href)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [{ alignItems: 'center', gap: 6, flex: 1 }, pressed && { transform: [{ scale: 0.95 }] }]}
    >
      <StarIcon icon={icon} bg={bg} color={color} />
      <Text style={styles.featureLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: space.lg },
  title: { fontFamily: fonts.semi, fontSize: 18, color: colors.ink },
  subtitle: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkSoft, marginTop: 2 },
  featureLabel: { fontFamily: fonts.semi, fontSize: 12, color: colors.ink },
});
