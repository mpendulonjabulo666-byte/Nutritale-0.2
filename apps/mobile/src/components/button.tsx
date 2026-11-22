import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { pressScale } from '@nutritale/shared';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { colors, duration, fonts, radius, roles } from '@/theme';

type Props = {
  label: string;
  onPress: () => void;
  /** primary: forest fill. secondary: white with sageDeep border. outline: transparent with forest border (prototype Welcome). */
  variant?: 'primary' | 'secondary' | 'outline';
  accessibilityHint?: string;
};

/** Button from the prototype: 56 px tall (target >= 44), radius 16, press feedback scale 0.97 over the `fast` token. */
export function Button({ label, onPress, variant = 'primary', accessibilityHint }: Props) {
  const reduce = useReduceMotion();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const to = (value: number) => {
    if (reduce) return;
    scale.value = withTiming(value, { duration: duration.fast, reduceMotion: ReduceMotion.System });
  };
  const primary = variant === 'primary';
  const variantStyle = primary ? styles.primary : variant === 'outline' ? styles.outline : styles.secondary;
  return (
    <Animated.View style={animated}>
      <Pressable
        accessibilityRole="button"
        accessibilityHint={accessibilityHint}
        onPress={onPress}
        onPressIn={() => to(pressScale)}
        onPressOut={() => to(1)}
        style={[styles.base, variantStyle]}
      >
        <Text style={[styles.text, { color: primary ? roles.onPrimary : colors.forest }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 56, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  primary: { backgroundColor: colors.forest },
  secondary: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.sageDeep },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.forest },
  text: { fontSize: 17, fontFamily: fonts.bodySemibold },
});
