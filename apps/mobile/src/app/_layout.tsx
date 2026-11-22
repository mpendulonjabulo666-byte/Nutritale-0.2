import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { fontAssets, roles } from '@/theme';

// Keep the splash screen up until the brand fonts are ready, so text never jumps from system font to brand font.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Already hidden (for example after a fast refresh). Nothing to do.
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const ready = fontsLoaded || fontError !== null;

  useEffect(() => {
    if (fontError) console.warn('Brand fonts failed to load; using system fonts.', fontError);
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready, fontError]);

  // If the fonts fail, still open the app with system fonts rather than staying on the splash screen.
  if (!ready) return null;

  return (
    <>
      {/* Every Reanimated animation follows the phone's reduced-motion setting. */}
      <ReducedMotionConfig mode={ReduceMotion.System} />
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: roles.background } }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
