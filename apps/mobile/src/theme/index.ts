import { Platform } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { colors, duration, easing, radius, roles, shadow, spacing, stagger } from '@nutritale/shared';

export { colors, duration, radius, roles, spacing, stagger };

/** Reanimated easing built from the shared cubic-bezier(.2,.8,.2,1). */
export const enterEasing = Easing.bezier(...easing.standard);

/** Soft forest-tinted card shadow from the shared tokens. Keep shadows few on Android. */
export const cardShadow = {
  shadowColor: shadow.card.color,
  shadowOpacity: shadow.card.opacity,
  shadowOffset: { width: 0, height: shadow.card.offsetY },
  shadowRadius: shadow.card.radius,
  elevation: shadow.card.elevation,
} as const;

/**
 * Display font stand-in. The brief's fonts (Playfair Display, DM Sans, Space Grotesk) are not loaded yet
 * (needs expo-font + font files, job J03). Until then, use a system serif for headings.
 */
export const displayFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });
