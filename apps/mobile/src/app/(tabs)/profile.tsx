import { useRouter } from 'expo-router';
import { PlaceholderScreen } from '@/components/placeholder-screen';
import { Button } from '@/components/button';

export default function Profile() {
  const router = useRouter();
  return (
    <PlaceholderScreen
      title="Profile"
      intro="Your diet, allergies and settings."
      plannedItems={['Diet and allergy chips', 'People I cook for', 'Reminders and data saver', 'Reduce motion', 'Privacy and delete account']}
    >
      {/* Sign-out always returns to the public welcome screen, never to sign-in. */}
      <Button label="Sign out" variant="secondary" onPress={() => router.replace('/welcome')} />
    </PlaceholderScreen>
  );
}
