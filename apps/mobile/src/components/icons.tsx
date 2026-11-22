import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '@/theme';

/**
 * Small line icons drawn with the prototype's own SVG paths (24 x 24 grid, stroke 2, round caps).
 * Decorative: the control around them carries the accessible name.
 */
type IconProps = { size?: number; color?: string; strokeWidth?: number };

function stroke(color: string, strokeWidth: number) {
  return { stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const;
}

export function SearchIcon({ size = 20, color = colors.forest, strokeWidth = 2 }: IconProps) {
  const s = stroke(color, strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle {...s} cx={11} cy={11} r={7} />
      <Path {...s} d="M20 20l-3.5-3.5" />
    </Svg>
  );
}

export function ClockIcon({ size = 28, color = colors.warn, strokeWidth = 2 }: IconProps) {
  const s = stroke(color, strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle {...s} cx={12} cy={13} r={8} />
      <Path {...s} d="M12 9v4l2.5 2" />
      <Path {...s} d="M9 2h6" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 20, color = colors.forest, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path {...stroke(color, strokeWidth)} d="M15 18l-6-6 6-6" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 28, color = colors.white, strokeWidth = 2 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path {...stroke(color, strokeWidth)} d="M9 6l6 6-6 6" />
    </Svg>
  );
}

/** Leaf used on "Photo coming soon" placeholders. */
export function LeafIcon({ size = 44, color = colors.sageDeep, strokeWidth = 1.6 }: IconProps) {
  const s = stroke(color, strokeWidth);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path {...s} d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z" />
      <Path {...s} d="M5 19L13 11" />
    </Svg>
  );
}
