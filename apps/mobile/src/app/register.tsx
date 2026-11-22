import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { allergensFor, marketOrDefault, type AllergenId } from '@nutritale/markets';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { Field } from '@/components/field';
import { RiseIn } from '@/components/rise-in';
import { en } from '@/copy/en';
import { emailError, newPasswordError } from '@/lib/validation';
import { colors, fonts, roles, text } from '@/theme';

/**
 * Register, step 1 of 2 (prototype Main.dc.html, register panel). Allergies are asked here, in step 1.
 * The allergy chips are the user's market list from @nutritale/markets (South Africa until country
 * detection exists), so other countries get their own list as data only.
 * Accounts are not built yet: valid fields open the app; nothing is sent or stored.
 */
export default function Register() {
  const router = useRouter();
  const copy = en.register;
  const market = marketOrDefault(null);
  const allergens = useMemo(() => allergensFor(market), [market]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selected, setSelected] = useState<ReadonlySet<AllergenId>>(new Set());
  const [tried, setTried] = useState(false);

  const nameErr = tried && name.trim().length === 0 ? copy.errName : undefined;
  const emailErr = tried ? emailError(email) : undefined;
  const passwordErr = tried ? newPasswordError(password) : undefined;

  const toggle = (id: AllergenId) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const submit = () => {
    setTried(true);
    if (name.trim() && !emailError(email) && !newPasswordError(password)) router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.topRow}>
            <BackButton onPress={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))} />
            <View
              accessibilityRole="progressbar"
              accessibilityLabel={copy.progressLabel}
              accessibilityValue={{ min: 1, max: 2, now: 1 }}
              style={styles.track}
            >
              <View style={styles.fill} />
            </View>
            <Text style={styles.step}>{copy.step}</Text>
          </View>

          <RiseIn index={0}>
            <Text accessibilityRole="header" style={[text.display30, styles.title]}>
              {copy.title}
            </Text>
          </RiseIn>

          <RiseIn index={1}>
            <View style={styles.form}>
              <Field
                label={copy.firstName}
                value={name}
                onChangeText={setName}
                error={nameErr}
                autoComplete="given-name"
                textContentType="givenName"
                autoCapitalize="words"
                returnKeyType="next"
              />
              <Field
                label={copy.email}
                value={email}
                onChangeText={setEmail}
                error={emailErr}
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
                hint={copy.passwordHint}
                password
                autoComplete="new-password"
                textContentType="newPassword"
              />
            </View>
          </RiseIn>

          <RiseIn index={2}>
            <Text accessibilityRole="header" style={[text.sectionTitle, styles.allergyTitle]}>
              {copy.allergiesTitle}
            </Text>
            <Text style={[text.small, styles.allergyBody]}>{copy.allergiesBody}</Text>
          </RiseIn>

          <RiseIn index={3}>
            <View accessibilityLabel={copy.allergiesGroup} style={styles.chips}>
              {allergens.map((a) => (
                <Chip key={a.id} label={a.name} tick selected={selected.has(a.id)} onPress={() => toggle(a.id)} />
              ))}
            </View>
          </RiseIn>

          <View style={styles.spacer} />
          <Button label={copy.submit} onPress={submit} accessibilityHint={en.signIn.mockHint} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: roles.background },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 24 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  track: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.mint, overflow: 'hidden' },
  fill: { width: '50%', height: 8, borderRadius: 4, backgroundColor: colors.forest },
  step: { fontFamily: fonts.numericSemibold, fontSize: 13, color: roles.textSecondary },
  title: { marginTop: 24 },
  form: { marginTop: 22, gap: 16 },
  allergyTitle: { marginTop: 26, marginBottom: 4 },
  allergyBody: { marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  spacer: { flexGrow: 1, minHeight: 24 },
});
