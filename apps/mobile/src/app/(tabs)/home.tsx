import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip } from '@/components/chip';
import { useTabBarClearance } from '@/components/floating-tab-bar';
import { ChevronRightIcon, ClockIcon, SearchIcon } from '@/components/icons';
import { RecipeCard } from '@/components/recipe-card';
import { RiseIn } from '@/components/rise-in';
import { en } from '@/copy/en';
import { homeCategories, itemsToUseSoon, pantry, recipes } from '@/data/mock';
import { colors, fonts, radius, roles, spacing, text } from '@/theme';

function greeting(hour: number): string {
  if (hour < 12) return en.home.greetingMorning;
  if (hour < 18) return en.home.greetingAfternoon;
  return en.home.greetingEvening;
}

/**
 * Home (prototype Home.dc.html, brief screen 2): search first, the "Use soon" warning,
 * category chips, pantry-matched recipe cards with a match ring, and the pantry summary.
 * Mock data until the API exists.
 */
export default function Home() {
  const router = useRouter();
  const copy = en.home;
  const bottom = useTabBarClearance();
  const [category, setCategory] = useState<string>(homeCategories[0]);
  const soon = itemsToUseSoon();
  const soonLine = soon.map((item) => copy.inDays(item.name, item.expiresInDays ?? 0)).join(' · ');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottom }]}>
        <RiseIn index={0}>
          <View style={styles.header}>
            <Text style={text.small}>{greeting(new Date().getHours())}</Text>
            <Text accessibilityRole="header" style={[text.display28, styles.headerTitle]}>
              {copy.title}
            </Text>
          </View>
        </RiseIn>

        <RiseIn index={1}>
          <Pressable
            accessibilityRole="search"
            accessibilityLabel={copy.searchPlaceholder}
            accessibilityHint={copy.searchHint}
            onPress={() => router.push('/discover')}
            style={({ pressed }) => [styles.search, pressed && styles.pressed]}
          >
            <SearchIcon />
            <Text style={text.bodySecondary}>{copy.searchPlaceholder}</Text>
          </Pressable>
        </RiseIn>

        {soon.length > 0 ? (
          <RiseIn index={2}>
            <View style={styles.soon}>
              <ClockIcon />
              <View style={styles.soonText}>
                <Text accessibilityRole="header" style={styles.soonTitle}>
                  {copy.useSoonTitle}
                </Text>
                <Text style={styles.soonLine}>{soonLine}</Text>
              </View>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={`${en.common.view}: ${copy.useSoonTitle}`}
                onPress={() => router.push('/pantry')}
                style={styles.soonView}
              >
                <Text style={styles.soonViewText}>{en.common.view}</Text>
              </Pressable>
            </View>
          </RiseIn>
        ) : null}

        <RiseIn index={3}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            accessibilityLabel={copy.categories}
            contentContainerStyle={styles.chips}
          >
            {homeCategories.map((label) => (
              <Chip key={label} label={label} selected={label === category} onPress={() => setCategory(label)} />
            ))}
          </ScrollView>
        </RiseIn>

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text accessibilityRole="header" style={text.display22}>
              {copy.cookFromPantry}
            </Text>
            <Pressable accessibilityRole="link" onPress={() => router.push('/discover')} style={styles.seeAll}>
              <Text style={text.link}>{en.common.seeAll}</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cards}>
            {recipes.map((recipe, i) => (
              <RiseIn key={recipe.id} index={3 + i}>
                <RecipeCard recipe={recipe} />
              </RiseIn>
            ))}
          </ScrollView>
        </View>

        <RiseIn index={5}>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push('/pantry')}
            style={({ pressed }) => [styles.pantry, pressed && styles.pressed]}
          >
            <View style={styles.pantryText}>
              <Text style={styles.pantryLabel}>{copy.pantryLabel}</Text>
              <Text style={styles.pantrySummary}>{copy.pantrySummary(pantry.length, soon.length)}</Text>
              <Text style={styles.pantryNudge}>{copy.pantryNudge}</Text>
            </View>
            <ChevronRightIcon />
          </Pressable>
        </RiseIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const side = spacing.screenSide;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: roles.background },
  content: { paddingTop: 30 },
  pressed: { transform: [{ scale: 0.97 }] },
  header: { paddingHorizontal: side },
  headerTitle: { marginTop: 2 },
  search: {
    marginTop: 18,
    marginHorizontal: side,
    minHeight: 54,
    borderRadius: radius.button,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.sageDeep,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  soon: {
    marginTop: 20,
    marginHorizontal: side,
    padding: 16,
    borderRadius: radius.card,
    backgroundColor: roles.warnSurface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  soonText: { flex: 1 },
  soonTitle: { fontFamily: fonts.bodyBold, fontSize: 15, color: roles.warnText },
  soonLine: { marginTop: 2, fontFamily: fonts.body, fontSize: 14, color: roles.text },
  soonView: { minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  soonViewText: { fontFamily: fonts.bodyBold, fontSize: 14, color: roles.warnText },
  chips: { gap: 8, paddingHorizontal: side, paddingTop: 22, paddingBottom: 4 },
  section: { marginTop: 22 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: side },
  seeAll: { minHeight: 44, justifyContent: 'center' },
  cards: { gap: 14, paddingHorizontal: side, paddingTop: 12, paddingBottom: 16 },
  pantry: {
    marginTop: 8,
    marginHorizontal: side,
    padding: 18,
    borderRadius: radius.card,
    backgroundColor: colors.forest,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pantryText: { flex: 1 },
  pantryLabel: {
    fontFamily: fonts.numericSemibold,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.sage,
  },
  pantrySummary: { marginTop: 6, fontFamily: fonts.display, fontSize: 22, lineHeight: 28, color: colors.white },
  pantryNudge: { marginTop: 6, fontFamily: fonts.body, fontSize: 14, color: colors.mint },
});
