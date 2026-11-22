import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function Home() {
  return (
    <PlaceholderScreen
      title="Home"
      intro="Search first, then what to use soon and recipes that match your pantry."
      plannedItems={['Ingredient search', '"Use soon" warning', 'Category chips', 'Pantry-matched recipe cards with a match ring']}
    />
  );
}
