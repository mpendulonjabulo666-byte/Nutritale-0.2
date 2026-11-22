import { StyleSheet } from 'react-native';
import { colors, roles } from '@nutritale/shared';
import { fonts } from './fonts';

/**
 * Text presets from docs/DESIGN_BRIEF.md section 2.4 and the prototype.
 * Headings: Playfair Display. Body: DM Sans (16 minimum for body). Labels and numbers: Space Grotesk.
 */
export const text = StyleSheet.create({
  display34: { fontFamily: fonts.display, fontSize: 34, lineHeight: 39, color: colors.forest },
  display32: { fontFamily: fonts.display, fontSize: 32, lineHeight: 38, color: colors.forest },
  display30: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, color: colors.forest },
  display28: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, color: colors.forest },
  display22: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28, color: roles.text },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: roles.text },
  bodySecondary: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: roles.textSecondary },
  small: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: roles.textSecondary },
  smallStrong: { fontFamily: fonts.bodySemibold, fontSize: 14, lineHeight: 20, color: roles.text },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, color: roles.textSecondary },
  cardTitle: { fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 21, color: roles.text },
  sectionTitle: { fontFamily: fonts.bodyBold, fontSize: 17, lineHeight: 24, color: roles.text },
  label: { fontFamily: fonts.numericSemibold, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: roles.textSecondary },
  numeric: { fontFamily: fonts.numericSemibold, fontSize: 13, color: colors.forest },
  link: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.forest },
  error: { fontFamily: fonts.bodySemibold, fontSize: 14, lineHeight: 20, color: roles.alertText },
});
