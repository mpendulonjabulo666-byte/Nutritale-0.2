import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function Pantry() {
  return (
    <PlaceholderScreen
      title="My Pantry"
      intro="No items yet. Add your first ingredient."
      plannedItems={['Categories', 'Quantity steppers', 'Expiry badges with words, not colour alone', '"Out of stock" state']}
    />
  );
}
