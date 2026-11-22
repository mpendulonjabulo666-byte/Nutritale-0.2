import { useEffect, useState, type ReactNode } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { pressScale, tapTarget } from '@nutritale/shared';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { colors, duration, fonts, radius, roles } from '@/theme';

/**
 * Floating tab bar from design/prototype/Home.dc.html (brief section 4):
 * white bar 72 tall, radius 26, 12 from the sides, soft forest shadow.
 * Every tab shows its icon and label. The active tab gets a mint pill and a bold forest label.
 */
export const TAB_BAR_HEIGHT = 72;
const SIDE_GAP = 12;
const MIN_BOTTOM_GAP = 14;
/** Space between the last scrolled item and the bar (prototype: main padding-bottom 110 = 72 + 14 + 24). */
const CONTENT_GAP = 24;

/** Bottom padding a tab screen's scroll content needs so the bar never covers the last item (WCAG 2.4.11). */
export function useTabBarClearance(): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + Math.max(insets.bottom, MIN_BOTTOM_GAP) + CONTENT_GAP;
}

/** Icons drawn with the prototype's own SVG paths (24 x 24 grid, stroke 2). */
function TabIcon({ name, color }: { name: string; color: string }) {
  const stroke = { stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const;
  let shape: ReactNode;
  switch (name) {
    case 'home':
      shape = <Path {...stroke} d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />;
      break;
    case 'pantry':
      shape = (
        <>
          <Path {...stroke} d="M8 3h8v3H8z" />
          <Path {...stroke} d="M7 6h10l1 3v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9z" />
          <Path {...stroke} d="M6 12h12" />
        </>
      );
      break;
    case 'discover':
      shape = (
        <>
          <Circle {...stroke} cx={12} cy={12} r={9} />
          <Path {...stroke} d="M15.5 8.5l-2 5-5 2 2-5z" />
        </>
      );
      break;
    case 'shopping':
      shape = (
        <>
          <Path {...stroke} d="M5 9h14l-1.5 10.5a1 1 0 0 1-1 .5h-9a1 1 0 0 1-1-.5z" />
          <Path {...stroke} d="M9 9l3-5 3 5" />
        </>
      );
      break;
    case 'profile':
      shape = (
        <>
          <Circle {...stroke} cx={12} cy={8} r={4} />
          <Path {...stroke} d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        </>
      );
      break;
    default:
      shape = <Circle {...stroke} cx={12} cy={12} r={9} />;
  }
  // Decorative: the tab's Pressable carries the accessible name, so the icon needs no label.
  // (Do not pass `accessible`/`importantForAccessibility` to Svg: on web they leak into the DOM.)
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      {shape}
    </Svg>
  );
}

type ItemProps = {
  routeName: string;
  label: string;
  accessibilityLabel: string;
  focused: boolean;
  reduceMotion: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({ routeName, label, accessibilityLabel, focused, reduceMotion, onPress, onLongPress }: ItemProps) {
  // Only transform and opacity animate (brief 6.2 rule 1); with reduced motion, changes are instant.
  const pill = useSharedValue(focused ? 1 : 0);
  const scale = useSharedValue(1);
  useEffect(() => {
    pill.value = reduceMotion ? (focused ? 1 : 0) : withTiming(focused ? 1 : 0, { duration: duration.base, reduceMotion: ReduceMotion.System });
  }, [focused, reduceMotion, pill]);
  const pillStyle = useAnimatedStyle(() => ({ opacity: pill.value }));
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const pressTo = (value: number) => {
    if (reduceMotion) return;
    scale.value = withTiming(value, { duration: duration.fast, reduceMotion: ReduceMotion.System });
  };
  const tint = focused ? colors.forest : roles.textSecondary;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => pressTo(pressScale)}
      onPressOut={() => pressTo(1)}
      style={styles.itemHit}
    >
      <Animated.View style={[styles.item, pressStyle]}>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.pill, pillStyle]} />
        <TabIcon name={routeName} color={tint} />
        <Text
          numberOfLines={1}
          maxFontSizeMultiplier={1.3}
          style={[styles.label, { color: tint, fontFamily: focused ? fonts.bodyBold : fonts.bodySemibold }]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

/** Hide the bar while the keyboard is open, so it never floats above the keyboard (Search has a text field). */
function useKeyboardVisible(): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
}

export function FloatingTabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const reduceMotion = useReduceMotion();
  const keyboardVisible = useKeyboardVisible();
  if (keyboardVisible) return null;

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.bar, { bottom: Math.max(insets.bottom, MIN_BOTTOM_GAP) }]}
    >
      {state.routes.map((route, index) => {
        const focused = index === state.index;
        const options = descriptors[route.key]?.options ?? {};
        const label = typeof options.title === 'string' ? options.title : route.name;
        const onPress = () => {
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigateToTab(route.key);
        };
        const onLongPress = () => {
          emitter.emit({ type: 'tabLongPress', target: route.key });
        };
        return (
          <TabItem
            key={route.key}
            routeName={route.name}
            label={label}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? `${label}, tab, ${index + 1} of ${state.routes.length}`}
            focused={focused}
            reduceMotion={reduceMotion}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: SIDE_GAP,
    right: SIDE_GAP,
    height: TAB_BAR_HEIGHT,
    borderRadius: radius.tabBar,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    // Prototype: 0 10px 30px rgba(23,76,53,.16). One shadow only (Android cost, brief 2.5).
    shadowColor: colors.forest,
    shadowOpacity: 0.16,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  itemHit: { flex: 1, alignItems: 'center' },
  item: {
    minWidth: tapTarget.tabHeight,
    minHeight: tapTarget.tabHeight,
    paddingHorizontal: 6,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  pill: { backgroundColor: colors.mint, borderRadius: 18 },
  label: { fontSize: 12 },
});
