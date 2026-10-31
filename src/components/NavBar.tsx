import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { colors } from '../theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const items: Record<string, { label: string; icon: IconName; iconOn: IconName }> = {
  home: { label: 'Home', icon: 'home-outline', iconOn: 'home' },
  deen: { label: 'Deen', icon: 'moon-outline', iconOn: 'moon' },
  wellbeing: { label: 'Wellbeing', icon: 'heart-outline', iconOn: 'heart' },
  me: { label: 'Me', icon: 'person-outline', iconOn: 'person' },
};

// Dark rounded dock with circular buttons; the active one fills with sky.
export function NavBar({ state, navigateToTab }: BottomTabBarProps) {
  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <View style={styles.bar}>
        {state.routes.map((route, i) => {
          const item = items[route.name];
          if (!item) return null;
          const active = state.index === i;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={item.label}
              onPress={() => navigateToTab(route.key)}
              style={[styles.item, active && styles.itemActive]}
            >
              <Ionicons
                name={active ? item.iconOn : item.icon}
                size={21}
                color={active ? colors.ink : colors.white}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12, bottom: 12 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 34,
    backgroundColor: colors.dark,
  },
  item: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.darkSoft,
  },
  itemActive: { backgroundColor: colors.skyDeep, width: 64 },
});
