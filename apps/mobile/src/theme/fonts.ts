import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { DMSans_600SemiBold } from '@expo-google-fonts/dm-sans/600SemiBold';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';
import { PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display/600SemiBold';
import { SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk/500Medium';
import { SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk/600SemiBold';

/**
 * Brand fonts (docs/DESIGN_BRIEF.md section 2.4), loaded with expo-font in the root layout.
 * Only the weights the brief uses are imported (per-weight subpaths), so the app bundle
 * carries 7 files, not every weight. Licence: SIL OFL 1.1 (fonts), MIT (packages).
 */
export const fontAssets = {
  PlayfairDisplay_600SemiBold,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
};

/**
 * Font family names to use in styles. In React Native each weight is its own family:
 * set `fontFamily` from here and do NOT also set `fontWeight` (Android can then fall back
 * to the system font or fake a bold).
 */
export const fonts = {
  /** Playfair Display 600: headings (36, 32, 30, 28, 22). */
  display: 'PlayfairDisplay_600SemiBold',
  /** DM Sans: interface and body. */
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemibold: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
  /** Space Grotesk: numbers, labels, times. */
  numeric: 'SpaceGrotesk_500Medium',
  numericSemibold: 'SpaceGrotesk_600SemiBold',
} as const satisfies Record<string, keyof typeof fontAssets>;
