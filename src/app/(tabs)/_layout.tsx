import { Tabs } from 'expo-router/js-tabs';
import { NavBar } from '../../components/NavBar';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <NavBar {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="deen" />
      <Tabs.Screen name="wellbeing" />
      <Tabs.Screen name="me" />
    </Tabs>
  );
}
