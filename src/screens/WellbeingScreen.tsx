import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, fonts, radius, space, tones } from '../theme';
import {
  B,
  Button,
  Card,
  Chip,
  CircleButton,
  Fraction,
  IconTile,
  MiniBars,
  SectionTitle,
  SegmentBar,
  Segmented,
  Text,
} from '../components/ui';
import { useAppWidth } from '../components/layout';
import { useDay, WATER_GOAL } from '../state/DayContext';
import { stepsCaption } from '../lib/useSteps';
import { formatKm, walkingStats } from '../lib/walking';
import { StepGauge } from '../components/StepGauge';
import { MoodId, moodById, MOODS, sampleDay } from '../data/moods';

const MOVE_GOAL = 30;

const DAY = 24 * 60 * 60 * 1000;
const fmtDay = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-GB', opts);
const fmtSleep = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

type HistoryDay = { date: Date; mood: MoodId | null; sleepMins: number; today: boolean };

export function WellbeingScreen() {
  const width = useAppWidth();
  const { now, mood, setMood, water, addWater, sleepMins, adjustSleep, steps, stepsStatus, stepsGoal } = useDay();
  const walk = walkingStats(steps ?? 0);
  const [range, setRange] = useState('Week');
  const [mindfulSecs, setMindfulSecs] = useState(0);
  const [moveMins, setMoveMins] = useState(15);

  const days = range === 'Week' ? 7 : 30;
  const history = useMemo<HistoryDay[]>(
    () =>
      Array.from({ length: days }, (_, i) => {
        const ago = days - 1 - i;
        const s = sampleDay(ago);
        return {
          date: new Date(now.getTime() - ago * DAY),
          mood: ago === 0 ? mood : s.mood,
          sleepMins: ago === 0 ? sleepMins : Math.round(s.sleep * 60),
          today: ago === 0,
        };
      }),
    [days, mood, sleepMins, now.toDateString()], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => setSelected(null), [range]);
  const sel = history[selected ?? history.length - 1];

  const logged = history.filter((d) => d.mood);
  const counts = new Map<MoodId, number>();
  logged.forEach((d) => counts.set(d.mood!, (counts.get(d.mood!) ?? 0) + 1));
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const week = history.slice(-7);
  const avgSleep = Math.round(week.reduce((s, d) => s + d.sleepMins, 0) / week.length);

  // A simple, honest pattern: average mood on nights of 7h+ sleep vs less.
  const rested = logged.filter((d) => d.sleepMins >= 420);
  const short = logged.filter((d) => d.sleepMins < 420);
  const avg = (xs: HistoryDay[]) => xs.reduce((s, d) => s + moodById(d.mood!).score, 0) / (xs.length || 1);
  const sleepHelps = rested.length > 0 && short.length > 0 && avg(rested) > avg(short) + 0.3;

  const chartWidth = width - space.md * 2 - (space.md + 4) * 2;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text variant="caption" style={{ fontSize: 14 }}>{fmtDay(now, { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
            <Text variant="hero" style={{ marginTop: 4 }}>
              Your <B>wellbeing</B>
            </Text>
          </View>
          <CircleButton icon="calendar-outline" label="Calendar" />
        </View>

        <Segmented options={['Week', 'Month']} value={range} onChange={setRange} />

        {/* Mood history */}
        <Card style={{ marginTop: space.md }}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <IconTile emoji="🙂" tone="pink" size={40} round />
              <Text variant="heading">Mood this {range.toLowerCase()}</Text>
            </View>
            {top ? <Chip label={`Mostly ${moodById(top[0]).label.toLowerCase()}`} tone={moodById(top[0]).tone} /> : null}
          </View>

          <View style={{ marginTop: space.lg }}>
            <MoodChart
              history={history}
              width={chartWidth}
              selected={selected ?? history.length - 1}
              onSelect={setSelected}
            />
          </View>

          <View style={styles.dayDetail}>
            <RNText style={{ fontSize: 28 }}>{sel.mood ? moodById(sel.mood).emoji : '➕'}</RNText>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.semi, fontSize: 15 }}>
                {sel.today ? 'Today' : fmtDay(sel.date, { weekday: 'long', day: 'numeric', month: 'short' })}
                {sel.mood ? ` · ${moodById(sel.mood).label}` : ''}
              </Text>
              <Text variant="caption">
                {sel.mood ? `Slept ${fmtSleep(sel.sleepMins)}` : 'No check-in yet. How are you feeling?'}
              </Text>
            </View>
          </View>

          {!mood ? (
            <View style={styles.quickMoods}>
              {MOODS.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => setMood(m.id)}
                  accessibilityLabel={`Check in ${m.label}`}
                  style={[styles.quickMood, { backgroundColor: tones[m.tone].bg }]}
                >
                  <RNText style={{ fontSize: 22 }}>{m.emoji}</RNText>
                </Pressable>
              ))}
            </View>
          ) : null}
        </Card>

        {sleepHelps ? (
          <View style={styles.insight}>
            <IconTile icon="bulb" tone="white" size={40} round />
            <Text style={{ flex: 1, fontSize: 14, lineHeight: 20 }}>
              <B>Pattern:</B> your mood tends to be better after 7 or more hours of sleep.
            </Text>
          </View>
        ) : null}

        {/* Breathing */}
        <SectionTitle title="Breathe" action={mindfulSecs ? `${Math.floor(mindfulSecs / 60)}m ${mindfulSecs % 60}s today` : undefined} />
        <Breathing onSecond={() => setMindfulSecs((s) => s + 1)} />

        {/* Journal */}
        <SectionTitle title="Journal" />
        <Journal moodEmoji={mood ? moodById(mood).emoji : null} />

        {/* Health */}
        <SectionTitle title="Health tracking" />
        <Card style={{ marginBottom: space.sm + 2 }}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <IconTile icon="footsteps" tone="peach" size={40} round />
              <View>
                <Text variant="heading">Walking</Text>
                <Text variant="caption">{stepsCaption(stepsStatus)}</Text>
              </View>
            </View>
            {steps !== null ? (
              <Chip label={`${Math.round(Math.min(1, steps / stepsGoal) * 100)}%`} tone="peach" />
            ) : null}
          </View>
          <View style={{ alignItems: 'center', marginTop: space.md }}>
            <StepGauge steps={steps ?? 0} goal={stepsGoal} size={Math.min(330, width - 72)} />
            <RNText style={styles.stepsBig}>{steps !== null ? steps.toLocaleString('en-US') : '—'}</RNText>
            <Text variant="caption" style={{ fontSize: 14 }}>
              steps · goal {stepsGoal.toLocaleString('en-US')}
            </Text>
          </View>
          <View style={styles.walkStats}>
            {[
              { label: 'Distance', value: formatKm(walk.km), unit: 'km' },
              { label: 'Calories', value: `${walk.kcal}`, unit: 'kcal' },
              { label: 'Active', value: `${walk.minutes}`, unit: 'min' },
            ].map((s) => (
              <View key={s.label} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
                <Text variant="caption">{s.label}</Text>
                <RNText style={styles.walkValue}>
                  {s.value}
                  <RNText style={styles.walkUnit}> {s.unit}</RNText>
                </RNText>
              </View>
            ))}
          </View>
        </Card>
        <Card>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <IconTile icon="bed" tone="peach" size={40} round />
              <Text variant="heading">Sleep</Text>
            </View>
            <Chip label={`Avg ${fmtSleep(avgSleep)}`} tone="peach" />
          </View>
          <View style={[styles.rowBetween, { marginTop: space.md }]}>
            <View>
              <RNText style={styles.sleepBig}>
                {Math.floor(sleepMins / 60)}
                <RNText style={styles.sleepUnit}>h </RNText>
                {sleepMins % 60}
                <RNText style={styles.sleepUnit}>m</RNText>
              </RNText>
              <Text variant="caption">Last night</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <CircleButton icon="remove" size={42} bg={colors.cardSoft} label="Less sleep" onPress={() => adjustSleep(-15)} />
              <CircleButton icon="add" size={42} bg={colors.cardSoft} label="More sleep" onPress={() => adjustSleep(15)} />
            </View>
          </View>
          <View style={{ marginTop: space.md }}>
            <MiniBars values={week.map((d) => d.sleepMins)} color={colors.peachInk} height={70} />
            <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
              {week.map((d, i) => (
                <Text key={i} variant="caption" style={{ flex: 1, textAlign: 'center', fontSize: 11 }}>
                  {fmtDay(d.date, { weekday: 'narrow' })}
                </Text>
              ))}
            </View>
          </View>
        </Card>

        <View style={[styles.grid, { marginTop: space.sm + 2 }]}>
          <Pressable style={[styles.tile, { backgroundColor: colors.sky }]} onPress={addWater} accessibilityLabel="Add a glass of water">
            <View style={styles.rowBetween}>
              <IconTile icon="water" tone="white" size={40} round />
              <Fraction value={water} total={WATER_GOAL} size={22} />
            </View>
            <Text style={styles.tileTitle}>Water</Text>
            <SegmentBar total={WATER_GOAL} filled={water} color={colors.skyInk} height={20} />
          </Pressable>

          <View style={[styles.tile, { backgroundColor: colors.butter }]}>
            <View style={styles.rowBetween}>
              <IconTile icon="barbell" tone="white" size={40} round />
              <Pressable onPress={() => setMoveMins((m) => m + 5)} style={styles.plus} accessibilityLabel="Add 5 active minutes">
                <Ionicons name="add" size={18} color={colors.ink} />
              </Pressable>
            </View>
            <Text style={styles.tileTitle}>Movement</Text>
            <Fraction value={moveMins} total={MOVE_GOAL} unit="min" size={22} />
          </View>

          <View style={[styles.tile, { backgroundColor: colors.lilac }]}>
            <View style={styles.rowBetween}>
              <IconTile icon="leaf" tone="white" size={40} round />
              <Chip label="Breathing" tone="white" />
            </View>
            <Text style={styles.tileTitle}>Mindful</Text>
            <Fraction value={Math.floor(mindfulSecs / 60)} unit="min today" size={22} />
          </View>
        </View>

        {/* Support */}
        <View style={styles.support}>
          <IconTile icon="chatbubbles" tone="white" size={44} round />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={{ fontFamily: fonts.semi, fontSize: 16 }}>Need someone to talk to?</Text>
            <Text variant="caption" style={{ fontSize: 13, lineHeight: 19 }}>
              NAFIS is not a replacement for professional care. If you are struggling, reach out to a doctor, a counsellor
              or someone you trust. In an emergency, contact your local emergency services.
            </Text>
            <Button label="Find support" variant="dark" small style={{ marginTop: 8 }} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ---------- Mood chart ----------

function MoodChart({
  history,
  width,
  selected,
  onSelect,
}: {
  history: HistoryDay[];
  width: number;
  selected: number;
  onSelect: (i: number) => void;
}) {
  const H = 150;
  const n = history.length;
  const gap = n > 10 ? 3 : 10;
  const bw = (width - gap * (n - 1)) / n;
  const pts = history.map((d, i) => {
    const score = d.mood ? moodById(d.mood).score : 0;
    const h = Math.max(6, (score / 5) * (H - 14));
    return { x: i * (bw + gap) + bw / 2, y: H - h, h, d };
  });
  const line = pts
    .filter((p) => p.d.mood)
    .reduce((acc, p, i, arr) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = arr[i - 1];
      const dx = (p.x - prev.x) / 2;
      return `${acc} C ${prev.x + dx} ${prev.y} ${p.x - dx} ${p.y} ${p.x} ${p.y}`;
    }, '');

  return (
    <View>
      <View style={{ width, height: H }}>
        <Svg width={width} height={H}>
          {pts.map((p, i) => (
            <Rect
              key={i}
              x={p.x - bw / 2}
              y={p.y}
              width={bw}
              height={p.h}
              rx={Math.min(8, bw / 2)}
              fill={
                i === selected
                  ? colors.primary
                  : p.d.mood
                    ? tones[moodById(p.d.mood).tone].bg
                    : colors.cardSoft
              }
            />
          ))}
          {line ? <Path d={line} stroke={colors.lilacInk} strokeOpacity={0.55} strokeWidth={2.5} fill="none" /> : null}
        </Svg>
        <View style={[StyleSheet.absoluteFill, { flexDirection: 'row', gap }]}>
          {history.map((d, i) => (
            <Pressable
              key={i}
              style={{ flex: 1 }}
              onPress={() => onSelect(i)}
              accessibilityLabel={d.today ? 'Today' : fmtDay(d.date, { weekday: 'long', day: 'numeric' })}
            />
          ))}
        </View>
      </View>
      {n <= 10 ? (
        <View style={{ flexDirection: 'row', gap, marginTop: 8 }}>
          {history.map((d, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <RNText style={{ fontSize: 16 }}>{d.mood ? moodById(d.mood).emoji : '·'}</RNText>
              <RNText
                style={{
                  fontFamily: i === selected ? fonts.bold : fonts.medium,
                  fontSize: 11,
                  color: i === selected ? colors.ink : colors.inkSoft,
                }}
              >
                {d.today ? 'Today' : fmtDay(d.date, { weekday: 'short' })}
              </RNText>
            </View>
          ))}
        </View>
      ) : (
        <View style={[styles.rowBetween, { marginTop: 8 }]}>
          <Text variant="caption">{fmtDay(history[0].date, { day: 'numeric', month: 'short' })}</Text>
          <Text variant="caption">Today</Text>
        </View>
      )}
    </View>
  );
}

// ---------- Breathing ----------

const PHASES = [
  { label: 'Breathe in', secs: 4, scale: 1 },
  { label: 'Breathe out', secs: 6, scale: 0.55 },
];

const CYCLE = PHASES.reduce((s, p) => s + p.secs, 0);

function Breathing({ onSecond }: { onSecond: () => void }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds into this session
  const [cycles, setCycles] = useState(0);
  const scale = useRef(new Animated.Value(0.55)).current;
  const onSecondRef = useRef(onSecond);
  onSecondRef.current = onSecond;

  // Everything is derived from elapsed seconds, so ticks can't drift out of sync.
  const pos = elapsed % CYCLE;
  const phase = pos < PHASES[0].secs ? 0 : 1;
  const left = phase === 0 ? PHASES[0].secs - pos : CYCLE - pos;

  useEffect(() => {
    if (!running) return;
    const p = PHASES[phase];
    Animated.timing(scale, {
      toValue: p.scale,
      duration: p.secs * 1000,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: false,
    }).start();
  }, [running, phase, scale]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      onSecondRef.current();
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (elapsed > 0 && elapsed % CYCLE === 0) setCycles((c) => c + 1);
  }, [elapsed]);

  const toggle = () => {
    if (running) {
      setRunning(false);
      scale.stopAnimation();
      Animated.timing(scale, { toValue: 0.55, duration: 600, useNativeDriver: false }).start();
      setElapsed(0);
    } else {
      setRunning(true);
    }
  };

  return (
    <View style={styles.breath}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={{ fontFamily: fonts.semi, fontSize: 17 }}>Calm breathing</Text>
          <Text variant="caption">In for 4, out for 6</Text>
        </View>
        <Chip label={`${cycles} ${cycles === 1 ? 'breath' : 'breaths'}`} tone="white" />
      </View>

      <View style={styles.breathStage}>
        <View style={styles.breathRing} />
        <Animated.View style={[styles.breathOrb, { transform: [{ scale }] }]} />
        <View style={styles.breathText}>
          <Text style={{ fontFamily: fonts.semi, fontSize: 18 }}>{running ? PHASES[phase].label : 'Ready'}</Text>
          <Text style={{ fontFamily: fonts.light, fontSize: 40, lineHeight: 50, letterSpacing: -1 }}>
            {running ? left : '·'}
          </Text>
        </View>
      </View>

      <Button
        label={running ? 'Stop' : 'Start breathing'}
        icon={running ? 'stop' : 'play'}
        variant={running ? 'dark' : 'light'}
        onPress={toggle}
      />
    </View>
  );
}

// ---------- Journal ----------

type Entry = { id: number; date: Date; emoji: string | null; text: string; grateful: string[] };

const PROMPTS = [
  "What's on your heart today?",
  'What made you smile today?',
  'What is one thing you want to let go of?',
];

function Journal({ moodEmoji }: { moodEmoji: string | null }) {
  const [text, setText] = useState('');
  const [grateful, setGrateful] = useState(['', '', '']);
  const [prompt, setPrompt] = useState(0);
  const [entries, setEntries] = useState<Entry[]>([
    {
      id: 1,
      date: new Date(Date.now() - DAY),
      emoji: '😌',
      text: 'Long day at work, but a calm walk after Maghrib helped a lot.',
      grateful: ['My mother’s call', 'A good cup of shaah', 'Finishing my reading'],
    },
  ]);

  const canSave = text.trim().length > 0 || grateful.some((g) => g.trim());
  const save = () => {
    if (!canSave) return;
    setEntries((e) => [
      { id: Date.now(), date: new Date(), emoji: moodEmoji, text: text.trim(), grateful: grateful.filter((g) => g.trim()) },
      ...e,
    ]);
    setText('');
    setGrateful(['', '', '']);
  };

  return (
    <View style={{ gap: space.sm + 2 }}>
      <Card>
        <View style={styles.rowBetween}>
          <Chip label="Today's prompt" tone="pink" />
          <CircleButton
            icon="shuffle"
            size={36}
            bg={colors.cardSoft}
            label="New prompt"
            onPress={() => setPrompt((p) => (p + 1) % PROMPTS.length)}
          />
        </View>
        <Text style={styles.prompt}>{PROMPTS[prompt]}</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Write freely. Only you can see this."
          placeholderTextColor={colors.inkFaint}
          multiline
          style={styles.input}
        />
        <Text variant="caption" style={{ marginTop: space.md, marginBottom: 8 }}>
          Three things I'm grateful for
        </Text>
        {grateful.map((g, i) => (
          <View key={i} style={styles.gratRow}>
            <RNText style={styles.gratNum}>{i + 1}</RNText>
            <TextInput
              value={g}
              onChangeText={(v) => setGrateful((arr) => arr.map((x, j) => (j === i ? v : x)))}
              placeholder="Alhamdulillah for…"
              placeholderTextColor={colors.inkFaint}
              style={styles.gratInput}
            />
          </View>
        ))}
        <Button
          label="Save entry"
          icon="lock-closed"
          onPress={save}
          style={{ marginTop: space.md, opacity: canSave ? 1 : 0.4 }}
        />
      </Card>

      {entries.map((e) => (
        <View key={e.id} style={styles.entry}>
          <View style={styles.rowBetween}>
            <Text style={{ fontFamily: fonts.semi, fontSize: 14 }}>
              {fmtDay(e.date, { weekday: 'long', day: 'numeric', month: 'short' })}
            </Text>
            {e.emoji ? <RNText style={{ fontSize: 20 }}>{e.emoji}</RNText> : null}
          </View>
          {e.text ? (
            <Text variant="body" style={{ color: colors.inkSoft, fontSize: 14 }} numberOfLines={3}>
              {e.text}
            </Text>
          ) : null}
          {e.grateful.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {e.grateful.map((g, i) => (
                <Chip key={i} label={g} tone="mint" icon="heart" />
              ))}
            </View>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingTop: 48, paddingBottom: 130 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: space.lg },

  dayDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.cardSoft,
    borderRadius: radius.md,
    padding: 12,
    marginTop: space.md,
  },
  quickMoods: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.sm + 2 },
  quickMood: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  insight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.mint,
    borderRadius: radius.lg,
    padding: 14,
    marginTop: space.sm + 2,
  },

  breath: { backgroundColor: colors.sky, borderRadius: radius.lg, padding: space.md + 4, gap: space.md },
  breathStage: { height: 230, alignItems: 'center', justifyContent: 'center' },
  breathRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    borderStyle: 'dashed',
  },
  breathOrb: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  breathText: { alignItems: 'center' },

  prompt: { fontFamily: fonts.semi, fontSize: 22, lineHeight: 29, letterSpacing: -0.3, color: colors.ink, marginTop: space.md },
  input: {
    minHeight: 100,
    marginTop: space.sm + 2,
    backgroundColor: colors.cardSoft,
    borderRadius: radius.md,
    padding: 14,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink,
    textAlignVertical: 'top',
  },
  gratRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingVertical: 6,
  },
  gratNum: { width: 22, fontFamily: fonts.semi, fontSize: 14, color: colors.pinkInk },
  gratInput: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink, paddingVertical: 8 },
  entry: { backgroundColor: colors.card, borderRadius: radius.lg, padding: space.md + 2, gap: 8 },

  stepsBig: { fontFamily: fonts.semi, fontSize: 40, lineHeight: 48, letterSpacing: -1, color: colors.ink },
  walkStats: {
    flexDirection: 'row',
    backgroundColor: colors.cardSoft,
    borderRadius: radius.md,
    paddingVertical: 12,
    marginTop: space.md,
  },
  walkValue: { fontFamily: fonts.semi, fontSize: 18, color: colors.ink },
  walkUnit: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkSoft },
  sleepBig: { fontFamily: fonts.light, fontSize: 40, letterSpacing: -1, color: colors.ink },
  sleepUnit: { fontSize: 20, color: colors.inkSoft },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm + 2 },
  tile: { flexBasis: '47%', flexGrow: 1, borderRadius: radius.lg, padding: 14, gap: 12 },
  tileTitle: { fontFamily: fonts.semi, fontSize: 16, color: colors.ink },
  plus: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  support: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.pink,
    borderRadius: radius.lg,
    padding: space.md + 2,
    marginTop: space.lg,
  },
});
