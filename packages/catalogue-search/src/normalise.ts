/**
 * Letters only: lower case, diacritics removed (NFD), everything that is not
 * a-z dropped. "Chick Peas" -> "chickpeas", "Jalapeño" -> "jalapeno".
 */
export function letters(input: string): string {
  return String(input ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

/**
 * Simple plural folding on a letters-only string.
 * - "tomatoes" -> "tomato", "peaches" -> "peach" ('es' after o, s, x, z, ch, sh)
 * - "tomatos" -> "tomato", "olives" -> "olive", "chickpeas" -> "chickpea" (trailing 's')
 * - words ending in 'ss', 'us' or 'is' are left alone ("glass", "hummus")
 * - never shortens below 3 letters
 * It is applied the same way to queries and catalogue terms, so a rule that is
 * "wrong" for English still matches as long as both sides fold the same way.
 */
export function foldPlural(word: string): string {
  if (word.length < 4) return word;
  if (/(ss|us|is)$/.test(word)) return word;
  if (/(o|s|x|z|ch|sh)es$/.test(word) && word.length - 2 >= 3) return word.slice(0, -2);
  if (word.endsWith('s') && word.length - 1 >= 3) return word.slice(0, -1);
  return word;
}

/** The comparison key: letters only, plural folded. */
export function normalise(input: string): string {
  return foldPlural(letters(input));
}

/**
 * Optimal-string-alignment Damerau-Levenshtein distance (a swap of two
 * neighbouring letters counts as one edit). Stops early and returns
 * max + 1 once the distance must exceed `max`.
 */
export function editDistance(a: string, b: string, max = Number.POSITIVE_INFINITY): number {
  const m = a.length;
  const n = b.length;
  if (Math.abs(m - n) > max) return max + 1;
  if (m === 0) return n;
  if (n === 0) return m;
  let prevPrev: number[] = new Array<number>(n + 1).fill(0);
  let prev: number[] = new Array<number>(n + 1);
  let cur: number[] = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    let rowMin = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prevPrev[j - 2]! + 1);
      }
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    const t = prevPrev;
    prevPrev = prev;
    prev = cur;
    cur = t;
  }
  return prev[n]!;
}

/** Edits allowed for a fuzzy match: 1 for words of 4 letters or fewer, 2 otherwise. */
export function fuzzyThreshold(key: string): number {
  return key.length <= 4 ? 1 : 2;
}
