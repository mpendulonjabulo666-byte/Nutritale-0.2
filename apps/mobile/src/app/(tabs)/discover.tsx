import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function Discover() {
  return (
    <PlaceholderScreen
      title="Discover"
      intro="Recipes that fit what you have."
      plannedItems={['Recipe discovery', 'Pantry-matched suggestions', 'Favourites', 'Nutrition marked "Estimated" until verified']}
    />
  );
}
