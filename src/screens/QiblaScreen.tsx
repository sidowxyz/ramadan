import { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import Svg, { Circle, Line } from 'react-native-svg';
import { Coordinates, Qibla } from 'adhan';
import { colors, fonts, radius, space } from '../theme';
import { Chip, Text } from '../components/ui';
import { IslamicPattern, ScreenHeader } from '../components/Islamic';
import { useAppWidth } from '../components/layout';
import { LOCATION } from '../lib/prayerTimes';

const KAABA = { lat: 21.4225, lng: 39.8262 };
const ALIGNED_DEG = 5;

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Smallest signed difference between two bearings, in degrees.
const angleDiff = (a: number, b: number) => ((a - b + 540) % 360) - 180;

type Place = { lat: number; lng: number; label: string };

export function QiblaScreen() {
  const width = useAppWidth();
  const [place, setPlace] = useState<Place>({ lat: LOCATION.lat, lng: LOCATION.lng, label: LOCATION.name });
  const [heading, setHeading] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setNote('Open NAFIS on your phone to use the live compass.');
      return;
    }
    let cancelled = false;
    let sub: { remove: () => void } | null = null;
    (async () => {
      try {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        if (!perm.granted) {
          setNote(`Location is off, so this uses ${LOCATION.name}. Allow location for your exact Qibla.`);
          return;
        }
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (cancelled) return;
        setPlace({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: 'Your location' });
        sub = await Location.watchHeadingAsync((h) => {
          setHeading(h.trueHeading >= 0 ? h.trueHeading : h.magHeading);
        });
      } catch {
        if (!cancelled) setNote('Compass not available on this device.');
      }
    })();
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, []);

  const qibla = Qibla(new Coordinates(place.lat, place.lng));
  const km = Math.round(distanceKm(place, KAABA));
  const diff = heading === null ? null : angleDiff(qibla, heading);
  const aligned = diff !== null && Math.abs(diff) <= ALIGNED_DEG;

  const size = Math.min(300, width - 64);
  const c = size / 2;
  const r = c - 14;
  // The dial turns so North matches the real North; without a compass it stays North-up.
  const dialRotation = heading === null ? 0 : -heading;
  const kaabaAngle = ((qibla - 90) * Math.PI) / 180;
  const kaabaX = c + (r - 26) * Math.cos(kaabaAngle);
  const kaabaY = c + (r - 26) * Math.sin(kaabaAngle);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Qibla" subtitle={place.label} />

        <View style={[styles.stage, aligned && { backgroundColor: colors.mintInk }]}>
          <IslamicPattern width={width} height={520} />

          <RNText style={styles.status}>
            {heading === null
              ? 'Qibla direction'
              : aligned
                ? 'You are facing the Qibla'
                : diff! > 0
                  ? `Turn right ${Math.round(diff!)}°`
                  : `Turn left ${Math.round(-diff!)}°`}
          </RNText>

          <View style={{ width: size, height: size, marginTop: space.lg }}>
            {/* Fixed marker: the direction the top of the phone points */}
            <View style={styles.pointer}>
              <Ionicons name="caret-down" size={26} color={colors.butter} />
            </View>

            <View style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${dialRotation}deg` }] }]}>
              <Svg width={size} height={size}>
                <Circle cx={c} cy={c} r={r} stroke="rgba(255,255,255,0.25)" strokeWidth={2} fill="rgba(255,255,255,0.05)" />
                {Array.from({ length: 72 }, (_, i) => {
                  const a = ((i * 5 - 90) * Math.PI) / 180;
                  const major = i % 18 === 0;
                  const inner = r - (major ? 14 : i % 2 === 0 ? 8 : 5);
                  return (
                    <Line
                      key={i}
                      x1={c + r * Math.cos(a)}
                      y1={c + r * Math.sin(a)}
                      x2={c + inner * Math.cos(a)}
                      y2={c + inner * Math.sin(a)}
                      stroke={major ? colors.white : 'rgba(255,255,255,0.4)'}
                      strokeWidth={major ? 2.5 : 1}
                    />
                  );
                })}
                <Line x1={c} y1={c} x2={kaabaX} y2={kaabaY} stroke={colors.butter} strokeWidth={3} strokeLinecap="round" />
                <Circle cx={c} cy={c} r={7} fill={colors.butter} />
              </Svg>
              {(['N', 'E', 'S', 'W'] as const).map((d, i) => {
                const a = ((i * 90 - 90) * Math.PI) / 180;
                return (
                  <RNText
                    key={d}
                    style={[
                      styles.cardinal,
                      { left: c + (r - 34) * Math.cos(a) - 12, top: c + (r - 34) * Math.sin(a) - 11 },
                      d === 'N' && { color: colors.butter },
                    ]}
                  >
                    {d}
                  </RNText>
                );
              })}
              <View style={[styles.kaaba, { left: kaabaX - 20, top: kaabaY - 20 }]}>
                <RNText style={{ fontSize: 22 }}>🕋</RNText>
              </View>
            </View>
          </View>

          <RNText style={styles.bearing}>{Math.round(qibla)}°</RNText>
          <RNText style={styles.bearingLabel}>from North</RNText>
        </View>

        <View style={styles.facts}>
          <View style={styles.fact}>
            <Text variant="caption">Distance to Makkah</Text>
            <Text style={styles.factValue}>{km.toLocaleString('en-US')} km</Text>
          </View>
          <View style={styles.fact}>
            <Text variant="caption">Compass</Text>
            <Text style={styles.factValue}>{heading === null ? 'Off' : `${Math.round(heading)}°`}</Text>
          </View>
        </View>

        {note ? (
          <View style={styles.note}>
            <Ionicons name="information-circle-outline" size={18} color={colors.skyInk} />
            <Text style={{ flex: 1, fontSize: 13, lineHeight: 19 }}>{note}</Text>
          </View>
        ) : (
          <Chip
            label="Hold your phone flat, away from metal and magnets"
            tone="sky"
            icon="phone-portrait-outline"
            style={{ alignSelf: 'center', marginTop: space.md }}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: space.md, paddingTop: 48, paddingBottom: 48 },
  stage: {
    backgroundColor: colors.primary,
    borderRadius: radius.xl,
    paddingVertical: space.lg,
    alignItems: 'center',
    overflow: 'hidden',
  },
  status: { fontFamily: fonts.semi, fontSize: 20, color: colors.white },
  pointer: { position: 'absolute', top: -26, left: 0, right: 0, alignItems: 'center', zIndex: 2 },
  cardinal: { position: 'absolute', width: 24, textAlign: 'center', fontFamily: fonts.semi, fontSize: 16, color: colors.white },
  kaaba: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.butter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bearing: { fontFamily: fonts.light, fontSize: 44, letterSpacing: -1, color: colors.white, marginTop: space.lg },
  bearingLabel: { fontFamily: fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  facts: { flexDirection: 'row', gap: space.sm + 2, marginTop: space.md },
  fact: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: space.md, gap: 4 },
  factValue: { fontFamily: fonts.semi, fontSize: 20, color: colors.ink },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.sky,
    borderRadius: radius.lg,
    padding: 14,
    marginTop: space.md,
  },
});
