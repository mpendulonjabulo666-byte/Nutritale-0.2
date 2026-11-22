import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/button';
import { LeafIcon } from '@/components/icons';
import { RiseIn } from '@/components/rise-in';
import { en } from '@/copy/en';
import { colors, fonts, roles, text } from '@/theme';

/**
 * Public, signed-out entry (prototype Main.dc.html, welcome panel). Sign-out always returns here,
 * and nobody lands straight on sign-in (brief section 4).
 */
export default function Welcome() {
  const router = useRouter();
  const copy = en.welcome;
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.hero}>
        <RiseIn index={0}>
          {/* Placeholder mark: the owner's logo file is not in the repo yet. Decorative. */}
          <View style={styles.mark} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <LeafIcon size={64} color={colors.forest} />
          </View>
        </RiseIn>
        <RiseIn index={1}>
          <Text style={styles.brand}>{copy.brand}</Text>
        </RiseIn>
        <RiseIn index={2}>
          <Text accessibilityRole="header" style={[text.display34, styles.center, styles.title]}>
            {copy.title}
          </Text>
        </RiseIn>
        <RiseIn index={3}>
          <Text style={[text.bodySecondary, styles.center, styles.body]}>{copy.body}</Text>
        </RiseIn>
      </View>
      <RiseIn index={4}>
        <View style={styles.actions}>
          <Button label={copy.create} onPress={() => router.push('/register')} />
          <Button label={copy.signIn} variant="outline" onPress={() => router.push('/sign-in')} />
        </View>
      </RiseIn>
      <RiseIn index={5}>
        <Text style={[text.caption, styles.center, styles.legal]} accessibilityHint={copy.legalNote}>
          {copy.legal}
        </Text>
      </RiseIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: roles.background, paddingHorizontal: 28, paddingTop: 24, paddingBottom: 24 },
  hero: { flex: 1, justifyContent: 'center' },
  mark: {
    alignSelf: 'center',
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    marginTop: 28,
    textAlign: 'center',
    fontFamily: fonts.numericSemibold,
    fontSize: 13,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: roles.textSecondary,
  },
  center: { textAlign: 'center' },
  title: { marginTop: 10 },
  body: { marginTop: 14, marginHorizontal: 8 },
  actions: { gap: 12 },
  legal: { marginTop: 18 },
});
