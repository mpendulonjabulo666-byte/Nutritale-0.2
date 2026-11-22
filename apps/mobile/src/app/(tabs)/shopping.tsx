import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function Shopping() {
  return (
    <PlaceholderScreen
      title="Shopping list"
      intro="Nothing to buy yet. Missing recipe ingredients will appear here."
      plannedItems={['Grouped list with real checkboxes', 'Progress bar', 'Add and remove items', '"All bought, move to pantry"']}
    />
  );
}
