import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { roles } from '@/theme';

export default function RootLayout() {
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
