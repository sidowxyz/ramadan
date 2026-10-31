import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text as RNText,
  TextProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, space, Tone, tones } from '../theme';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

// ---------- Text ----------

type Variant = 'hero' | 'number' | 'title' | 'heading' | 'body' | 'caption';

const textStyles: Record<Variant, TextStyle> = {
  hero: { fontFamily: fonts.light, fontSize: 32, lineHeight: 40, letterSpacing: -0.6, color: colors.ink },
  number: { fontFamily: fonts.light, fontSize: 44, letterSpacing: -1.5, color: colors.ink },
  title: { fontFamily: fonts.semi, fontSize: 22, letterSpacing: -0.3, color: colors.ink },
  heading: { fontFamily: fonts.semi, fontSize: 17, color: colors.ink },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: colors.ink },
  caption: { fontFamily: fonts.medium, fontSize: 12, color: colors.inkSoft },
};

export function Text({
  variant = 'body',
  style,
  ...rest
}: TextProps & { variant?: Variant }) {
  return <RNText {...rest} style={[textStyles[variant], style]} />;
}

// Bold span inside a light headline: "Your daily <B>boost</B>".
export function B({ children }: { children: React.ReactNode }) {
  return <RNText style={{ fontFamily: fonts.bold }}>{children}</RNText>;
}

// Big light number with a muted denominator: 5/8, 6,430 / 10,000.
export function Fraction({
  value,
  total,
  unit,
  size = 44,
  color = colors.ink,
}: {
  value: string | number;
  total?: string | number;
  unit?: string;
  size?: number;
  color?: string;
}) {
  return (
    <RNText style={{ fontFamily: fonts.light, fontSize: size, letterSpacing: -size * 0.03, color }}>
      {value}
      {total !== undefined ? <RNText style={{ color: colors.inkFaint }}>/{total}</RNText> : null}
      {unit ? (
        <RNText style={{ fontFamily: fonts.regular, fontSize: size * 0.42, letterSpacing: 0, color: colors.inkSoft }}>
          {' '}
          {unit}
        </RNText>
      ) : null}
    </RNText>
  );
}

// ---------- Surfaces ----------

export function Card({
  children,
  style,
  tone,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: Tone;
}) {
  return (
    <View style={[styles.card, tone ? { backgroundColor: tones[tone].bg } : null, style]}>{children}</View>
  );
}

export function IconTile({
  icon,
  emoji,
  tone = 'sky',
  size = 44,
  round,
}: {
  icon?: IconName;
  emoji?: string;
  tone?: Tone;
  size?: number;
  round?: boolean;
}) {
  const t = tones[tone];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round ? size / 2 : size * 0.32,
        backgroundColor: t.bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {emoji ? (
        <RNText style={{ fontSize: size * 0.5 }}>{emoji}</RNText>
      ) : icon ? (
        <Ionicons name={icon} size={size * 0.48} color={t.ink} />
      ) : null}
    </View>
  );
}

export function CircleButton({
  icon,
  onPress,
  dot,
  size = 48,
  bg = colors.white,
  color = colors.ink,
  label,
}: {
  icon: IconName;
  onPress?: () => void;
  dot?: boolean;
  size?: number;
  bg?: string;
  color?: string;
  label?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      style={({ pressed }) => [
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg, opacity: pressed ? 0.7 : 1 },
        styles.center,
      ]}
    >
      <Ionicons name={icon} size={size * 0.42} color={color} />
      {dot ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

// ---------- Buttons & chips ----------

type ButtonVariant = 'primary' | 'dark' | 'light';

export function Button({
  label,
  onPress,
  variant = 'primary',
  tone,
  icon,
  small,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  tone?: Tone;
  icon?: IconName;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const bg = tone
    ? tones[tone].bg
    : variant === 'primary'
      ? colors.primary
      : variant === 'dark'
        ? colors.dark
        : colors.white;
  const fg = tone ? tones[tone].ink : variant === 'light' ? colors.ink : colors.white;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        { backgroundColor: bg, opacity: pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={small ? 15 : 18} color={fg} /> : null}
      <RNText style={{ fontFamily: fonts.semi, fontSize: small ? 13 : 16, color: fg }}>{label}</RNText>
    </Pressable>
  );
}

export function Chip({
  label,
  tone = 'white',
  icon,
  style,
}: {
  label: string;
  tone?: Tone;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}) {
  const t = tones[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }, style]}>
      {icon ? <Ionicons name={icon} size={13} color={t.ink} /> : null}
      <RNText style={{ fontFamily: fonts.medium, fontSize: 12, color: t.ink }}>{label}</RNText>
    </View>
  );
}

export function Segmented({
  options,
  value,
  onChange,
  tone = 'pink',
}: {
  options: string[];
  value: string;
  onChange?: (v: string) => void;
  tone?: Tone;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: space.sm }}>
      {options.map((o) => {
        const active = o === value;
        return (
          <Pressable
            key={o}
            onPress={() => onChange?.(o)}
            style={[
              styles.segment,
              active ? { backgroundColor: tones[tone].bg, borderColor: tones[tone].bg } : null,
            ]}
          >
            <RNText style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.ink }}>{o}</RNText>
          </Pressable>
        );
      })}
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.section}>
      <Text variant="title" style={{ fontSize: 20 }}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text variant="caption">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ---------- Rows ----------

export function ActionRow({
  icon,
  tone,
  title,
  subtitle,
  badge,
  onPress,
}: {
  icon: IconName;
  tone: Tone;
  title: string;
  subtitle: string;
  badge?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.actionRow, pressed && { opacity: 0.8 }]}>
      <IconTile icon={icon} tone={tone} size={56} />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: fonts.semi, fontSize: 15 }}>{title}</Text>
          {badge ? <Chip label={badge} tone="butter" /> : null}
        </View>
        <Text variant="caption" numberOfLines={2} style={{ fontSize: 13 }}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.play}>
        <Ionicons name="play" size={14} color={colors.ink} style={{ marginLeft: 2 }} />
      </View>
    </Pressable>
  );
}

export function ListRow({
  icon,
  label,
  value,
  last,
  onPress,
}: {
  icon: IconName;
  label: string;
  value?: string;
  last?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.row, !last && styles.rowLine]}>
      <Ionicons name={icon} size={20} color={colors.ink} />
      <Text style={{ flex: 1, fontFamily: fonts.medium }}>{label}</Text>
      {value ? <Text variant="caption" style={{ fontSize: 14 }}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
    </Pressable>
  );
}

// ---------- Data display ----------

export function ProgressRing({
  progress,
  size = 48,
  stroke = 5,
  color = colors.primary,
  track = colors.line,
  children,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={[{ width: size, height: size }, styles.center]}>
      <Svg
        width={size}
        height={size}
        style={[StyleSheet.absoluteFill, { transform: [{ rotate: '-90deg' }] }]}
      >
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        {p > 0 ? (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c * p} ${c}`}
            fill="none"
          />
        ) : null}
      </Svg>
      {children}
    </View>
  );
}

// 0deg = 12 o'clock, clockwise.
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

// Half-circle score gauge: solid filled band, hatched remainder.
export function SemiGauge({
  progress,
  size = 280,
  stroke = 44,
  color = colors.skyDeep,
  children,
}: {
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - stroke / 2 - 2;
  const p = Math.max(0, Math.min(1, progress));
  const end = -90 + 180 * p;
  const s = polar(cx, cy, r, -90);
  const e = polar(cx, cy, r, end);
  const hatches: number[] = [];
  for (let a = end + 2; a <= 90; a += 4.5) hatches.push(a);
  const height = size / 2 + 4;

  return (
    <View style={{ width: size, height, alignItems: 'center' }}>
      <Svg width={size} height={height}>
        {hatches.map((a) => {
          const inner = polar(cx, cy, r - stroke / 2, a);
          const outer = polar(cx, cy, r + stroke / 2, Math.min(90, a + 4));
          return (
            <Path
              key={a}
              d={`M ${inner.x} ${inner.y} L ${outer.x} ${outer.y}`}
              stroke={colors.line}
              strokeWidth={1.5}
            />
          );
        })}
        {p > 0 ? (
          <Path
            d={`M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
          />
        ) : null}
        {p > 0 && p < 1 ? (
          <Path
            d={`M ${polar(cx, cy, r - stroke / 2 - 4, end).x} ${polar(cx, cy, r - stroke / 2 - 4, end).y} L ${polar(cx, cy, r + stroke / 2 + 4, end).x} ${polar(cx, cy, r + stroke / 2 + 4, end).y}`}
            stroke={colors.primary}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ) : null}
      </Svg>
      <View style={{ position: 'absolute', bottom: 0, alignItems: 'center' }}>{children}</View>
    </View>
  );
}

export type StreakDay = { label: string; state: 'done' | 'today' | 'future' };

export function StreakRow({ days }: { days: StreakDay[] }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {days.map((d, i) => (
        <View
          key={i}
          style={[
            styles.streak,
            d.state === 'done' && { backgroundColor: colors.peach },
            d.state === 'today' && { backgroundColor: colors.dark },
          ]}
        >
          {d.state === 'done' ? (
            <RNText style={{ fontSize: 16 }}>🔥</RNText>
          ) : (
            <RNText
              style={{
                fontFamily: fonts.medium,
                fontSize: 13,
                color: d.state === 'today' ? colors.white : colors.ink,
              }}
            >
              {d.label}
            </RNText>
          )}
        </View>
      ))}
    </View>
  );
}

// Vertical-pill progress, as in the water tile reference.
export function SegmentBar({
  total,
  filled,
  color,
  track = 'rgba(255,255,255,0.7)',
  height = 30,
}: {
  total: number;
  filled: number;
  color: string;
  track?: string;
  height?: number;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={{ flex: 1, height, borderRadius: 6, backgroundColor: i < filled ? color : track }}
        />
      ))}
    </View>
  );
}

export function MiniBars({ values, color, height = 40 }: { values: number[]; color: string; height?: number }) {
  const max = Math.max(...values);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height }}>
      {values.map((v, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: (v / max) * height,
            borderRadius: 4,
            backgroundColor: color,
            opacity: i === values.length - 1 ? 1 : 0.45,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: space.md + 4 },
  dot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  button: {
    height: 58,
    borderRadius: radius.pill,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonSmall: { height: 38, paddingHorizontal: 16, alignSelf: 'flex-start' },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  segment: {
    flex: 1,
    height: 42,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.lg + 4,
    marginBottom: space.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 12,
    paddingRight: 16,
  },
  play: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: colors.line },
  streak: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
