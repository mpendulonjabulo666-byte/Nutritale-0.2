import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/button';
import { Field } from '@/components/field';
import { RiseIn } from '@/components/rise-in';
import { en } from '@/copy/en';
import { emailError } from '@/lib/validation';
import { roles, text } from '@/theme';

/**
 * Sign in (prototype Main.dc.html, sign-in panel). Errors appear next to the field after the first
 * attempt and are announced. Accounts are not built yet: a valid email and any password open the app.
 */
export default function SignIn() {
  const router = useRouter();
  const copy = en.signIn;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tried, setTried] = useState(false);
  const [showResetNote, setShowResetNote] = useState(false);

  const emailErr = tried ? emailError(email) : undefined;
  const passwordErr = tried && password.length === 0 ? copy.errPasswordEmpty : undefined;

  const submit = () => {
    setTried(true);
    if (!emailError(email) && password.length > 0) router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <BackButton onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))} />
          <RiseIn index={0}>
            <Text accessibilityRole="header" style={[text.display32, styles.title]}>
              {copy.title}
            </Text>
            <Text style={[text.bodySecondary, styles.subtitle]}>{copy.subtitle}</Text>
          </RiseIn>
          <RiseIn index={1}>
            <View style={styles.form}>
              <Field
                label={copy.email}
                value={email}
                onChangeText={setEmail}
                error={emailErr}
                placeholder={copy.emailPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
              />
              <Field
                label={copy.password}
                value={password}
                onChangeText={setPassword}
                error={passwordErr}
                password
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={submit}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => setShowResetNote(true)}
                style={styles.forgot}
              >
                <Text style={text.link}>{copy.forgot}</Text>
              </Pressable>
              {showResetNote ? (
                <Text accessibilityLiveRegion="polite" style={[text.small, styles.resetNote]}>
                  {copy.forgotNotBuilt}
                </Text>
              ) : null}
            </View>
          </RiseIn>
          <View style={styles.flex} />
          <Button label={copy.submit} onPress={submit} accessibilityHint={copy.mockHint} />
          <View style={styles.newHere}>
            <Text style={text.small}>{copy.newHere}</Text>
            <Pressable accessibilityRole="button" onPress={() => router.replace('/register')} style={styles.inlineLink}>
              <Text style={[text.link, styles.underline]}>{copy.createAccount}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: roles.background },
  flex: { flexGrow: 1 },
  content: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 24 },
  title: { marginTop: 28 },
  subtitle: { marginTop: 8 },
  form: { marginTop: 32, gap: 18 },
  // Brief section 9, issue 10: text links raised to 44 px tall.
  forgot: { alignSelf: 'flex-end', minHeight: 44, justifyContent: 'center' },
  resetNote: { marginTop: -10 },
  newHere: { marginTop: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 },
  inlineLink: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 },
  underline: { textDecorationLine: 'underline' },
});
