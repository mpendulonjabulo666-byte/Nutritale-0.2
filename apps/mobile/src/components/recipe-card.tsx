import { StyleSheet, Text, View } from 'react-native';
import { en } from '@/copy/en';
import { LeafIcon } from '@/components/icons';
import { MatchRing } from '@/components/match-ring';
import type { MockRecipe } from '@/data/mock';
import { cardShadow, colors, fonts, radius, roles, text } from '@/theme';

/**
 * Pantry-matched recipe card from the Home prototype: 250 wide, radius 22, white with the soft
 * forest shadow. Photo area 170 tall ("Photo coming soon" until photo licences are confirmed),
 * time badge, title, "You have 3 of 5 · Vegan" and the match ring.
 */
export function RecipeCard({ recipe }: { recipe: MockRecipe }) {
  const percent = Math.round((recipe.have / recipe.total) * 100);
  return (
    <View style={styles.card}>
      <View style={styles.photo}>
        <LeafIcon />
        <Text style={text.caption}>{en.common.photoComingSoon}</Text>
        {recipe.time ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{recipe.time}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <View style={styles.titleCol}>
          <Text style={text.cardTitle} numberOfLines={3}>
            {recipe.title}
          </Text>
          <Text style={[text.caption, styles.meta]}>
            {en.home.youHave(recipe.have, recipe.total)} {'·'} {recipe.diet}
          </Text>
        </View>
        <MatchRing have={recipe.have} total={recipe.total} accessibilityLabel={en.home.matchLabel(percent)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 250,
    flexGrow: 1, // cards in a row share the tallest card's height, as in the prototype
    borderRadius: radius.cardLarge,
    backgroundColor: roles.surface,
    ...cardShadow,
  },
  photo: {
    height: 170,
    borderTopLeftRadius: radius.cardLarge,
    borderTopRightRadius: radius.cardLarge,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  badge: {
    position: 'absolute',
    left: 12,
    top: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  badgeText: { fontFamily: fonts.numericSemibold, fontSize: 13, color: colors.forest },
  body: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  titleCol: { flex: 1 },
  meta: { marginTop: 4 },
});
