import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RiseIn } from '@/components/rise-in';
import { cardShadow, colors, fonts, radius, roles, spacing } from '@/theme';

type Props = {
  title: string;
  intro: string;
  /** What this screen will hold, from docs/DESIGN_BRIEF.md section 5. */
  plannedItems: string[];
  children?: ReactNode;
};

export function PlaceholderScreen({ title, intro, plannedItems, children }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <RiseIn index={0}>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.intro}>{intro}</Text>
        </RiseIn>
        <RiseIn index={1}>
          <View style={styles.card}>
            <Text style={styles.label}>COMING IN V1</Text>
            {plannedItems.map((item) => (
              <Text key={item} style={styles.item}>
                {'•'} {item}
              </Text>
            ))}
          </View>
        </RiseIn>
        {children ? <RiseIn index={2}>{children}</RiseIn> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: roles.background },
  // Bottom padding so the tab bar never covers the last item (brief section 4).
  content: { paddingHorizontal: spacing.screenSide, paddingTop: spacing.xxl, paddingBottom: 120, gap: spacing.xl },
  title: { fontSize: 32, color: colors.forest, fontFamily: fonts.display },
  intro: { fontSize: 16, lineHeight: 24, color: roles.text, marginTop: spacing.xs, fontFamily: fonts.body },
  card: {
    backgroundColor: roles.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.mint,
    padding: spacing.xl,
    gap: spacing.xs,
    ...cardShadow,
  },
  label: { fontSize: 13, letterSpacing: 1, color: roles.textSecondary, fontFamily: fonts.numericSemibold },
  item: { fontSize: 16, lineHeight: 24, color: roles.text, fontFamily: fonts.body },
});
