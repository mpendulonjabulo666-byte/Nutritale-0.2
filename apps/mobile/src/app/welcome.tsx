import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/button';
import { RiseIn } from '@/components/rise-in';
import { colors, fonts, roles, spacing } from '@/theme';

/** Public, signed-out entry. Sign-out always returns here. Sign-in and register screens are not built yet. */
export default function Welcome() {
  const router = useRouter();
  const enter = () => router.replace('/home');
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.hero}>
        <RiseIn index={0}>
          <Text style={styles.brand} accessibilityRole="header">
            NutriTale
          </Text>
        </RiseIn>
        <RiseIn index={1}>
          <Text style={styles.tagline}>Cook from what you already have. Find recipes that match your pantry.</Text>
        </RiseIn>
      </View>
      <RiseIn index={2}>
        <View style={styles.actions}>
          <Button label="Get started" onPress={enter} accessibilityHint="Placeholder: registration is not built yet" />
          <Button
            label="I already have an account"
            variant="secondary"
            onPress={enter}
            accessibilityHint="Placeholder: sign in is not built yet"
          />
        </View>
      </RiseIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: roles.background, paddingHorizontal: spacing.screenSide, paddingBottom: spacing.xxl },
  hero: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  brand: { fontSize: 36, color: colors.forest, fontFamily: fonts.display },
  tagline: { fontSize: 17, lineHeight: 26, color: roles.text, fontFamily: fonts.body },
  actions: { gap: spacing.md },
});
