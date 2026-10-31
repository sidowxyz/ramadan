import { router } from 'expo-router';
import { SetupScreen } from '../screens/SetupScreen';

export default function Setup() {
  return <SetupScreen onBack={() => router.back()} onDone={() => router.replace('/home')} />;
}
