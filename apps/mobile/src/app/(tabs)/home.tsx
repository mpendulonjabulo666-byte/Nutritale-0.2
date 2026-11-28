import { Bell, Search } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RiseIn } from '@/components/rise-in';
import { cardShadow, colors, displayFont, radius, roles, spacing } from '@/theme';

const GOLD = '#C9A24E';
const DEEP = '#0F3624';

/** Mock data only. Real recipes come from the API later. Photos need a confirmed licence (decision D11), so tiles are plain colour. */
const RECIPES = [
  { id: 'r1', name: 'Veggie Stir-Fry', rating: '4.8', tint: '#DCEFE2' },
  { id: 'r2', name: 'Chicken Salad', rating: '4.7', tint: '#F6E3B8' },
  { id: 'r3', name: 'Lentil Soup', rating: '4.6', tint: '#F3D9CF' },
];

export default function Home() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brand} accessibilityRole="header">
          NutriTale
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Notifications" style={styles.bell}>
          <Bell size={22} color="#F3E6C0" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <RiseIn index={0}>
          <View style={styles.search}>
            <Search size={20} color={roles.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Search ingredients, food or recipes"
              placeholderTextColor={roles.textSecondary}
              accessibilityLabel="Search ingredients, food or recipes"
            />
          </View>
        </RiseIn>
        <RiseIn index={1}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Discover Delicious & Healthy Recipes</Text>
            <Text style={styles.heroSub}>Good food. Great life.</Text>
            <Pressable accessibilityRole="button" style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Explore recipes</Text>
            </Pressable>
          </View>
        </RiseIn>
        <RiseIn index={2}>
          <View style={styles.row}>
            <View style={[styles.stat, cardShadow]}>
              <Text style={styles.statTop}>Your pantry</Text>
              <Text style={styles.statNum}>12 ingredients</Text>
            </View>
            <View style={[styles.stat, styles.warn, cardShadow]}>
              <Text style={styles.statTop}>Use soon</Text>
              <Text style={styles.statNum}>2 items</Text>
            </View>
          </View>
        </RiseIn>
        <RiseIn index={3}>
          <View style={styles.sectionHead}>
            <Text style={styles.section} accessibilityRole="header">
              Popular recipes
            </Text>
            <Text style={styles.seeAll} accessibilityRole="link">
              See all
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cards}>
            {RECIPES.map((r) => (
              <View key={r.id} style={[styles.card, cardShadow]}>
                <View style={[styles.photo, { backgroundColor: r.tint }]} />
                <Text style={styles.cardName}>{r.name}</Text>
                <Text style={styles.cardRating}>★ {r.rating}</Text>
              </View>
            ))}
          </ScrollView>
        </RiseIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DEEP },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.screenSide, paddingVertical: spacing.md },
  brand: { fontSize: 28, fontWeight: '700', color: '#F3E6C0', fontFamily: displayFont },
  bell: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  content: { backgroundColor: roles.background, padding: spacing.screenSide, gap: spacing.lg, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexGrow: 1 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderRadius: radius.button, borderWidth: 1, borderColor: colors.mint, paddingHorizontal: 14, minHeight: 52 },
  input: { flex: 1, fontSize: 16, color: roles.text, minHeight: 48 },
  hero: { backgroundColor: DEEP, borderRadius: 20, padding: spacing.lg, gap: spacing.sm },
  heroTitle: { fontSize: 24, lineHeight: 32, fontWeight: '700', color: '#F3E6C0', fontFamily: displayFont },
  heroSub: { fontSize: 16, color: '#E4EBE5' },
  heroBtn: { alignSelf: 'flex-start', backgroundColor: GOLD, borderRadius: radius.button, minHeight: 44, paddingHorizontal: 18, justifyContent: 'center', marginTop: spacing.sm },
  heroBtnText: { fontSize: 16, fontWeight: '700', color: DEEP },
  row: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.mint, padding: spacing.md, gap: 4 },
  warn: { backgroundColor: '#FBF1D8' },
  statTop: { fontSize: 14, color: roles.textSecondary },
  statNum: { fontSize: 17, fontWeight: '700', color: colors.forest },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  section: { fontSize: 22, fontWeight: '700', color: colors.forest, fontFamily: displayFont, flexShrink: 1 },
  seeAll: { fontSize: 16, fontWeight: '600', color: colors.forest, minHeight: 44, textAlignVertical: 'center' },
  cards: { gap: spacing.md, paddingBottom: spacing.xl },
  card: { width: 170, backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.mint, padding: spacing.sm, gap: 6 },
  photo: { height: 110, borderRadius: 12 },
  cardName: { fontSize: 16, fontWeight: '700', color: roles.text },
  cardRating: { fontSize: 14, color: roles.textSecondary },
});
