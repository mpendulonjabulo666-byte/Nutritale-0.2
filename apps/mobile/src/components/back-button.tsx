import { Pressable, StyleSheet } from 'react-native';
import { en } from '@/copy/en';
import { ChevronLeftIcon } from '@/components/icons';
import { colors, radius } from '@/theme';

/** 44 x 44 back button from the prototype (white, radius 14, sageDeep border). Icon-only, so it has a label. */
export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={en.common.back}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <ChevronLeftIcon />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.sageDeep,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ scale: 0.97 }] },
});
