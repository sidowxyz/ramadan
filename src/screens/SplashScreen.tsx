import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts } from '../theme';
import { Text } from '../components/ui';
import { Mascot } from '../components/Mascot';
import { Bubble, Cloud, Sparkle } from '../components/Decor';

export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <Pressable style={styles.root} onPress={onDone}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <Cloud width={220} opacity={0.35} style={{ top: 40, right: -50 }} />
        <Cloud width={170} opacity={0.35} style={{ top: 160, left: -60 }} />
        <Sparkle size={22} style={{ top: 110, left: 44 }} />
        <Sparkle size={14} style={{ top: 250, right: 50 }} />
        <Sparkle size={18} style={{ bottom: 230, left: 70 }} />

        <View style={styles.center}>
          <View>
            <Bubble emoji="❤️" style={{ top: -30, left: -40 }} />
            <Bubble emoji="🌙" size={52} style={{ top: -50, right: -30 }} />
            <Bubble emoji="📖" size={48} style={{ bottom: 40, left: -56 }} />
            <Bubble emoji="💧" size={56} style={{ bottom: 30, right: -52 }} />
            <Mascot size={220} />
          </View>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.word}>NAFIS</Text>
          <Text variant="caption" style={{ fontSize: 13 }}>Deen · Nafs · Jir</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: 8 },
  card: { flex: 1, borderRadius: 40, backgroundColor: colors.skyDeep, overflow: 'hidden' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { alignItems: 'center', paddingBottom: 48, gap: 6 },
  word: { fontFamily: fonts.semi, fontSize: 28, letterSpacing: 10, color: colors.ink },
});
