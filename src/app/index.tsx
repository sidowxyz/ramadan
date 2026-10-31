import { useCallback } from 'react';
import { router } from 'expo-router';
import { SplashScreen } from '../screens/SplashScreen';

export default function Index() {
  const done = useCallback(() => router.replace('/onboarding'), []);
  return <SplashScreen onDone={done} />;
}
