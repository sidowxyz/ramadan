import { useLocalSearchParams } from 'expo-router';
import { SurahScreen } from '../../screens/SurahScreen';

export default function Surah() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <SurahScreen id={Number(id) || 1} />;
}
