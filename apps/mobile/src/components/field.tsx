import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { en } from '@/copy/en';
import { colors, fonts, radius, roles, text } from '@/theme';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  /** Shown under the field, announced, and marks the field invalid. */
  error?: string;
  /** Help text under the field (for example the password rule). */
  hint?: string;
  /** Adds a Show / Hide button and hides the text by default. */
  password?: boolean;
};

/**
 * Labelled text field from the prototype's sign-in and register screens: 52 tall, radius 14,
 * sageDeep border (3:1), forest border on focus, alert border and message on error.
 * Paste works (React Native's default); password managers fill it through autoComplete.
 */
export function Field({ label, error, hint, password = false, ...input }: Props) {
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // iOS has no live regions: announce new errors explicitly (brief section 8).
  useEffect(() => {
    if (error && Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(error);
  }, [error]);

  const borderColor = error ? colors.alert : focused ? colors.forest : colors.sageDeep;
  const borderWidth = error || focused ? 2 : 1.5;
  const helper = [error, hint].filter(Boolean).join('. ');

  return (
    <View style={styles.wrap}>
      <Text style={text.smallStrong}>{label}</Text>
      <View>
        <TextInput
          {...input}
          accessibilityLabel={label}
          accessibilityHint={helper || undefined}
          aria-invalid={error ? true : undefined}
          secureTextEntry={password && !revealed}
          onFocus={(e) => {
            setFocused(true);
            input.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            input.onBlur?.(e);
          }}
          placeholderTextColor={roles.textSecondary}
          style={[styles.input, { borderColor, borderWidth }, password && styles.inputWithToggle]}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: revealed }}
            accessibilityLabel={revealed ? en.common.hide : en.common.show}
            accessibilityHint={en.common.showPasswordHint}
            onPress={() => setRevealed((v) => !v)}
            style={styles.toggle}
          >
            <Text style={text.link}>{revealed ? en.common.hide : en.common.show}</Text>
          </Pressable>
        ) : null}
      </View>
      {hint && !error ? <Text style={text.caption}>{hint}</Text> : null}
      {error ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={text.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  input: {
    minHeight: 52,
    borderRadius: radius.input,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    fontFamily: fonts.body,
    fontSize: 16,
    color: roles.text,
  },
  inputWithToggle: { paddingRight: 72 },
  toggle: {
    position: 'absolute',
    right: 4,
    top: 4,
    minHeight: 44,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});
