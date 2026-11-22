import { useEffect } from 'react';
import Animated, { Easing, ReduceMotion, useAnimatedProps, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { colors, fonts } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const R = 15.9; // as in the prototype: 2 * PI * 15.9 is about 100
const CIRCUMFERENCE = 2 * Math.PI * R;

type Props = { have: number; total: number; size?: number; accessibilityLabel: string };

/**
 * Pantry match ring from the prototype (brief section 8): mint track, forest arc, "3/5" in the middle.
 * The arc fills once on mount (celebrate-style, 1 s, 0.4 s delay as in the prototype), or appears
 * filled at once with reduced motion.
 */
export function MatchRing({ have, total, size = 46, accessibilityLabel }: Props) {
  const reduce = useReduceMotion();
  const fraction = total > 0 ? Math.min(1, Math.max(0, have / total)) : 0;
  const target = CIRCUMFERENCE * (1 - fraction);
  const offset = useSharedValue(reduce ? target : CIRCUMFERENCE);

  useEffect(() => {
    offset.value = reduce
      ? target
      : withDelay(400, withTiming(target, { duration: 1000, easing: Easing.bezier(0.2, 0.8, 0.2, 1), reduceMotion: ReduceMotion.System }));
  }, [offset, reduce, target]);

  const arcProps = useAnimatedProps(() => ({ strokeDashoffset: offset.value }));

  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <Circle cx={18} cy={18} r={R} fill="none" stroke={colors.mint} strokeWidth={4} />
      <AnimatedCircle
        cx={18}
        cy={18}
        r={R}
        fill="none"
        stroke={colors.forest}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={[CIRCUMFERENCE, CIRCUMFERENCE]}
        animatedProps={arcProps}
        transform="rotate(-90 18 18)"
      />
      <SvgText x={18} y={21.5} textAnchor="middle" fontFamily={fonts.numericSemibold} fontSize={10} fill={colors.forest}>
        {`${have}/${total}`}
      </SvgText>
    </Svg>
  );
}
