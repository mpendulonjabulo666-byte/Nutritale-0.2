import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RiseIn } from '@/components/rise-in';
import { colors, displayFont, radius, spacing } from '@/theme';

const GOLD = '#C9A24E';
const DEEP = '#0F3624';
const BLUE = '#1877F2';

type Props = { label: string; bg: string; fg: string; border?: string; onPress: () => void; hint?: string; icon?: boolean };

/** Full-width auth button. Grows in height and wraps its text at large font sizes; never clips. */
function AuthButton({ label, bg, fg, border, onPress, hint, icon }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={hint}
      onPress={onPress}
      style={[styles.btn, { backgroundColor: bg, borderColor: border ?? bg }]}
    >
      {icon ? <Mail size={20} color={fg} /> : null}
      <Text style={[styles.btnText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

/** Public, signed-out entry (dark forest look from the owner's picture). Sign-out always returns here. */
export default function Welcome() {
  const router = useRouter();
  const [note, setNote] = useState('');
  const enter = () => router.replace('/home');
  const soon = (name: string) => setNote(`${name} sign-in is coming soon. Please use email for now.`);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <RiseIn index={0}>
          <View style={styles.hero}>
            <Image source={require('../../assets/mock/book-mark.png')} style={styles.book} resizeMode="contain" accessibilityLabel="Open recipe book with a green leaf" />
            <Text style={styles.brand} accessibilityRole="header">
              NutriTale
            </Text>
            <Text style={styles.sub}>Eat Healthy · Live Better</Text>
            <View style={styles.rule} />
            <Text style={styles.tagline}>Your ingredients. Your recipes. Your story.</Text>
          </View>
        </RiseIn>
        <RiseIn index={1}>
          <View style={styles.actions}>
            <AuthButton label="Continue with Apple" bg={colors.white} fg={DEEP} onPress={() => soon('Apple')} />
            <AuthButton label="Continue with Google" bg={colors.white} fg={DEEP} onPress={() => soon('Google')} />
            <AuthButton label="Continue with Facebook" bg={BLUE} fg={colors.white} onPress={() => soon('Facebook')} />
            <Text style={styles.or}>or</Text>
            <AuthButton label="Continue with Email" bg="transparent" fg={GOLD} border={GOLD} icon onPress={enter} hint="Placeholder: sign in is not built yet" />
            {note ? (
              <Text accessibilityLiveRegion="polite" style={styles.note}>
                {note}
              </Text>
            ) : null}
          </View>
        </RiseIn>
        <RiseIn index={2}>
          <Text style={styles.account}>
            Don&apos;t have an account?{' '}
            <Text style={styles.link} accessibilityRole="link" onPress={enter}>
              Create account
            </Text>
          </Text>
          <Text style={styles.legal}>Terms of Service  |  Privacy Policy</Text>
        </RiseIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DEEP },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.screenSide, paddingVertical: spacing.xl, gap: spacing.xl },
  hero: { alignItems: 'center', gap: spacing.sm },
  brand: { fontSize: 44, fontWeight: '700', color: '#F3E6C0', fontFamily: displayFont, textAlign: 'center' },
  sub: { fontSize: 15, color: '#E4EBE5', textAlign: 'center' },
  book: { width: '100%', maxWidth: 300, aspectRatio: 600 / 308 },
  rule: { width: 56, height: 2, backgroundColor: GOLD, marginVertical: spacing.sm },
  tagline: { fontSize: 20, lineHeight: 28, color: '#F3E6C0', fontStyle: 'italic', fontFamily: displayFont, textAlign: 'center' },
  actions: { gap: spacing.md },
  btn: { minHeight: 52, borderRadius: radius.button, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 10 },
  btnText: { fontSize: 17, fontWeight: '600', textAlign: 'center', flexShrink: 1 },
  or: { color: '#E4EBE5', textAlign: 'center', fontSize: 15 },
  note: { color: '#F3E6C0', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  account: { color: '#E4EBE5', textAlign: 'center', fontSize: 16, lineHeight: 24 },
  link: { color: GOLD, fontWeight: '700' },
  legal: { color: '#C7D3CA', textAlign: 'center', fontSize: 13, marginTop: spacing.md },
});
