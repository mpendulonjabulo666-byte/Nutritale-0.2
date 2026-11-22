import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Live reduced-motion setting. Reanimated's useReducedMotion only reads the value at app start,
 * so this listens for changes (docs/DESIGN_BRIEF.md section 6.2 rule 3).
 */
export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setReduce(value);
      })
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);
  return reduce;
}
