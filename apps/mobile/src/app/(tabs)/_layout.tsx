import { Tabs } from 'expo-router';
import { BookOpen, Compass, House, ShoppingBasket, UserRound, type LucideIcon } from 'lucide-react-native';
import { colors, radius, roles, spacing } from '@/theme';

type TabDef = { name: string; title: string; Icon: LucideIcon };

const TABS: TabDef[] = [
  { name: 'home', title: 'Home', Icon: House },
  { name: 'pantry', title: 'Pantry', Icon: BookOpen },
  { name: 'discover', title: 'Discover', Icon: Compass },
  { name: 'shopping', title: 'Shopping', Icon: ShoppingBasket },
  { name: 'profile', title: 'Profile', Icon: UserRound },
];

/**
 * Five tabs, icon and text label always visible (brief section 4).
 * Active tab: mint fill, forest tint, bold label. Items are at least 58 x 60.
 * A fully custom floating bar (brief prototype) is job J03.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: roles.textSecondary,
        tabBarActiveBackgroundColor: colors.mint,
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
        tabBarItemStyle: { minWidth: 58, minHeight: 60, borderRadius: radius.chip, marginHorizontal: 2, marginVertical: 6 },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.mint,
          height: 60 + spacing.xxl + 12,
          paddingTop: 0,
        },
      }}
    >
      {TABS.map(({ name, title, Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarAccessibilityLabel: `${title} tab`,
            tabBarIcon: ({ color, size }) => <Icon color={color} size={size} strokeWidth={2} aria-hidden />,
          }}
        />
      ))}
    </Tabs>
  );
}
