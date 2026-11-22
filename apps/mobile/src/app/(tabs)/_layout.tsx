import { Tabs } from 'expo-router';
import { FloatingTabBar } from '@/components/floating-tab-bar';
import { roles } from '@/theme';

const TABS = [
  { name: 'home', title: 'Home' },
  { name: 'pantry', title: 'Pantry' },
  { name: 'discover', title: 'Discover' },
  { name: 'shopping', title: 'Shopping' },
  { name: 'profile', title: 'Profile' },
] as const;

/**
 * Five tabs in the floating bar from design/prototype/Home.dc.html (brief section 4).
 * Icon and label always visible; the active tab gets a mint pill. Screens use
 * useTabBarClearance() for bottom padding so the bar never covers content.
 */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: roles.background } }}
    >
      {TABS.map(({ name, title }) => (
        <Tabs.Screen key={name} name={name} options={{ title }} />
      ))}
    </Tabs>
  );
}
