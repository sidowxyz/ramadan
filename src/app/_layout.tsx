import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import {
  useFonts,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { colors } from '../theme';
import { MAX_APP_WIDTH, useIsWide } from '../components/layout';
import { DayProvider } from '../state/DayContext';

export default function RootLayout() {
  const wide = useIsWide();
  const [loaded] = useFonts({
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  if (!loaded) return null;

  return (
    <View style={[styles.page, wide && styles.pageWide]}>
      <View style={[styles.column, wide && styles.columnWide]}>
        <DayProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
        </DayProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  pageWide: { alignItems: 'center', backgroundColor: '#DFE6E3' },
  column: { flex: 1, width: '100%', overflow: 'hidden' },
  columnWide: { maxWidth: MAX_APP_WIDTH, backgroundColor: colors.bg },
});
