import type { ReactNode } from 'react';
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { duration, enterEasing, stagger } from '@/theme';

type Props = { index?: number; children: ReactNode };

/**
 * Rises a block in with the shared `enter` token, staggered per index.
 * Animates only opacity and transform. With reduced motion on, it renders with no animation.
 */
export function RiseIn({ index = 0, children }: Props) {
  const reduce = useReduceMotion();
  const entering = reduce
    ? undefined
    : FadeInDown.duration(duration.enter)
        .delay(index * stagger.default)
        .easing(enterEasing)
        .reduceMotion(ReduceMotion.System);
  return <Animated.View entering={entering}>{children}</Animated.View>;
}
