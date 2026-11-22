import { Redirect } from 'expo-router';

/**
 * Entry point. There is no auth yet, so everyone is signed out and lands on the public welcome screen
 * (brief section 4: never straight on sign-in). When auth lands, signed-in users go to /home instead.
 */
export default function Index() {
  return <Redirect href="/welcome" />;
}
