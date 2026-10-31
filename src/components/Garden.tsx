import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path } from 'react-native-svg';
import { colors, fonts, radius } from '../theme';

export const STAGES = ['Seed', 'Sprout', 'Seedling', 'Budding', 'Blooming'] as const;

export type GardenPlant = { id: string; label: string; progress: number; color: string; detail: string };

export const stageFor = (progress: number) => Math.max(0, Math.min(4, Math.round(progress * 4)));

const STEM = '#4E8F5A';
const LEAF = '#6DB077';
const SOIL = '#8C6A4F';

function Leaf({ x, y, side, size }: { x: number; y: number; side: 1 | -1; size: number }) {
  return (
    <Ellipse
      cx={x + side * size * 0.5}
      cy={y}
      rx={size * 0.55}
      ry={size * 0.24}
      fill={LEAF}
      transform={`rotate(${side * -28} ${x + side * size * 0.5} ${y})`}
    />
  );
}

export function Plant({ stage, color, size = 64 }: { stage: number; color: string; size?: number }) {
  const ground = 92;
  const heights = [0, 18, 34, 48, 56];
  const top = ground - heights[stage];
  return (
    <Svg width={size} height={size * 1.6} viewBox="0 0 60 100">
      <Ellipse cx={30} cy={ground + 2} rx={16} ry={4} fill={SOIL} opacity={0.35} />
      {stage === 0 ? <Ellipse cx={30} cy={ground - 2} rx={4} ry={3} fill={SOIL} /> : null}
      {stage > 0 ? <Line x1={30} y1={ground} x2={30} y2={top} stroke={STEM} strokeWidth={3} strokeLinecap="round" /> : null}
      {stage >= 1 ? (
        <G>
          <Leaf x={30} y={top + 6} side={-1} size={stage === 1 ? 12 : 15} />
          <Leaf x={30} y={top + 6} side={1} size={stage === 1 ? 12 : 15} />
        </G>
      ) : null}
      {stage >= 2 ? (
        <G>
          <Leaf x={30} y={ground - 14} side={-1} size={17} />
          <Leaf x={30} y={ground - 20} side={1} size={17} />
        </G>
      ) : null}
      {stage === 3 ? <Ellipse cx={30} cy={top - 3} rx={5} ry={7} fill={color} /> : null}
      {stage === 4 ? (
        <G>
          {[0, 72, 144, 216, 288].map((a) => {
            const r = (a * Math.PI) / 180;
            return <Circle key={a} cx={30 + Math.cos(r) * 7} cy={top - 4 + Math.sin(r) * 7} r={6} fill={color} />;
          })}
          <Circle cx={30} cy={top - 4} r={4.5} fill="#F6C343" />
        </G>
      ) : null}
    </Svg>
  );
}

export function Garden({
  plants,
  selected,
  onSelect,
}: {
  plants: GardenPlant[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.scene}>
      <View style={styles.sun} />
      <View style={[styles.cloud, { top: 22, left: 24 }]} />
      <View style={[styles.cloud, { top: 34, left: 60, width: 46 }]} />
      <Svg width="100%" height={70} viewBox="0 0 300 70" preserveAspectRatio="none" style={styles.hill}>
        <Path d="M0 30 Q75 0 150 22 T300 18 L300 70 L0 70 Z" fill="#CBE7C2" />
      </Svg>
      <View style={styles.row}>
        {plants.map((p) => {
          const stage = stageFor(p.progress);
          const on = p.id === selected;
          return (
            <Pressable
              key={p.id}
              onPress={() => onSelect(p.id)}
              accessibilityLabel={`${p.label} plant, ${STAGES[stage]}`}
              style={[styles.plant, on && styles.plantOn]}
            >
              <Plant stage={stage} color={p.color} size={60} />
              <Text style={styles.label}>{p.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    height: 230,
    borderRadius: radius.lg,
    backgroundColor: colors.sky,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  sun: {
    position: 'absolute',
    top: 18,
    right: 26,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FBE38A',
  },
  cloud: {
    position: 'absolute',
    width: 60,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  hill: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  row: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 6, paddingBottom: 8 },
  plant: { alignItems: 'center', borderRadius: 16, paddingHorizontal: 2, paddingBottom: 4 },
  plantOn: { backgroundColor: 'rgba(255,255,255,0.55)' },
  label: { fontFamily: fonts.semi, fontSize: 11, color: colors.ink, marginTop: -6 },
});
