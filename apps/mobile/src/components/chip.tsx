import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radius, roles } from '@/theme';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Show a tick before the label when selected (prototype allergy chips). */
  tick?: boolean;
};

/**
 * Pill chip from the prototype (brief section 8): 44 tall, radius 22, DM Sans 15 semibold.
 * Selected: forest fill, white text. Not selected: white, sageDeep border.
 * Selection is also exposed to screen readers, never by colour alone.
 */
export function Chip({ label, selected, onPress, tick = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected ? styles.on : styles.off, pressed && styles.pressed]}
    >
      <Text style={[styles.label, { color: selected ? colors.white : roles.text }]}>
        {tick && selected ? `✓ ${label}` : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    paddingHorizontal: 18,
    borderRadius: radius.chip,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  on: { backgroundColor: colors.forest, borderColor: colors.forest },
  off: { backgroundColor: colors.white, borderColor: colors.sageDeep },
  pressed: { transform: [{ scale: 0.97 }] },
  label: { fontFamily: fonts.bodySemibold, fontSize: 15 },
});
