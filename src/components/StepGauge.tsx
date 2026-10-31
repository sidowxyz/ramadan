import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, fonts } from '../theme';
import { MILESTONES } from '../lib/walking';
import { Mascot } from './Mascot';

const START = -135; // degrees, 0 = 12 o'clock, clockwise
const SWEEP = 270;

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const s = polar(cx, cy, r, from);
  const e = polar(cx, cy, r, to);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${e.x} ${e.y}`;
}

const short = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n % 1000 ? 1 : 0)}k` : `${n}`);

// WalkWin-style step dial: thick arc, milestone checkpoints worth XP outside,
// step counts inside, and the mascot walking in the middle.
export function StepGauge({ steps, goal, size }: { steps: number; goal: number; size: number }) {
  const stroke = 18;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 40;
  const max = goal * MILESTONES[MILESTONES.length - 1].at;
  const angleFor = (v: number) => START + (SWEEP * Math.min(v, max)) / max;
  const end = angleFor(steps);
  const height = cy + r * Math.SQRT1_2 + stroke + 8;

  const ticks = Array.from({ length: 31 }, (_, i) => START + (SWEEP / 30) * i);

  return (
    <View style={{ width: size, height }}>
      <Svg width={size} height={height}>
        {ticks.map((t) => {
          const a = polar(cx, cy, r - stroke / 2 - 8, t);
          const b = polar(cx, cy, r - stroke / 2 - 14, t);
          return <Path key={t} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke={colors.line} strokeWidth={1.5} strokeLinecap="round" />;
        })}
        <Path d={arcPath(cx, cy, r, START, START + SWEEP)} stroke={colors.peach} strokeWidth={stroke} strokeLinecap="round" fill="none" />
        {steps > 0 ? (
          <Path d={arcPath(cx, cy, r, START, Math.max(end, START + 0.5))} stroke={colors.accent} strokeWidth={stroke} strokeLinecap="round" fill="none" />
        ) : null}
        {MILESTONES.map((m) => {
          const reached = steps >= m.at * goal;
          const p = polar(cx, cy, r, angleFor(m.at * goal));
          return (
            <Circle
              key={m.at}
              cx={p.x}
              cy={p.y}
              r={7}
              fill={colors.white}
              stroke={reached ? colors.accent : colors.peach}
              strokeWidth={reached ? 0 : 3}
            />
          );
        })}
        {MILESTONES.filter((m) => steps >= m.at * goal).map((m) => {
          const p = polar(cx, cy, r, angleFor(m.at * goal));
          return (
            <Path
              key={`c${m.at}`}
              d={`M ${p.x - 3.5} ${p.y} L ${p.x - 1} ${p.y + 2.8} L ${p.x + 3.8} ${p.y - 2.8}`}
              stroke={colors.accent}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          );
        })}
      </Svg>

      {MILESTONES.map((m) => {
        const a = angleFor(m.at * goal);
        const out = polar(cx, cy, r + stroke / 2 + 16, a);
        const inn = polar(cx, cy, r - stroke / 2 - 30, a);
        const reached = steps >= m.at * goal;
        return (
          <Fragment key={m.at}>
            <View pointerEvents="none" style={[styles.label, { left: out.x - 24, top: out.y - 10 }]}>
              <Text style={[styles.xp, reached && { color: colors.accent }]}>+{m.xp} XP</Text>
            </View>
            <View pointerEvents="none" style={[styles.label, { left: inn.x - 24, top: inn.y - 8 }]}>
              <Text style={styles.stepMark}>{short(Math.round(m.at * goal))}</Text>
            </View>
          </Fragment>
        );
      })}

      <View style={[styles.center, { top: cy - 52 }]} pointerEvents="none">
        <Mascot size={104} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { position: 'absolute', width: 48, alignItems: 'center' },
  xp: { fontFamily: fonts.bold, fontSize: 12, color: colors.inkFaint },
  stepMark: { fontFamily: fonts.medium, fontSize: 11, color: colors.inkSoft },
  center: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
});
