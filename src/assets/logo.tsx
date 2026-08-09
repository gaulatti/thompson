import React from 'react';
import { Path, Svg, type SvgProps } from 'react-native-svg';

import { useThompsonTheme } from '../theme';

export interface LogoProps extends Omit<SvgProps, 'color'> {
  color?: string;
  size?: number;
}

/** The canonical gaulatti mark used by Bleecker, rendered as native SVG. */
export function Logo({ color, size = 32, ...props }: LogoProps) {
  const { theme } = useThompsonTheme();
  const fill = color ?? theme.colors.foreground;
  return (
    <Svg accessibilityLabel='gaulatti' accessibilityRole='image' height={size * 1.28911} viewBox='0 0 1000 1289.11' width={size} {...props}>
      <Path d='M130.76 132.41h503.79C568.89 51.62 468.71 0 356.48 0 270.92 0 192.36 30.01 130.76 80.07 111.56 95.67 94.01 113.22 78.41 132.41h52.35Z' fill={fill} />
      <Path d='M867.59 421.58v503.79C948.39 859.7 1000 759.53 1000 647.3c0-85.56-30.01-164.12-80.07-225.72-15.6-19.2-33.15-36.35-52.34-52.35v52.35Z' fill={fill} />
      <Path d='M582.21 1156.69H78.41c65.67 80.8 165.84 132.41 278.07 132.41 85.56 0 164.12-30.01 225.72-80.07 19.2-15.6 36.75-33.15 52.35-52.34h-52.35Z' fill={fill} />
      <Path d='M356.49 1003.43C160.11 1003.43.35 843.67.35 647.3S160.11 291.17 356.48 291.17 712.61 450.93 712.61 647.3 552.86 1003.43 356.49 1003.43Zm0-581.85c-124.46 0-225.72 101.26-225.72 225.72s101.26 225.72 225.72 225.72S582.21 771.76 582.21 647.3 480.95 421.58 356.49 421.58Z' fill={fill} />
      <Path d='M681.87 780.25c21.13-43.23 33.02-90.93 33.4-141.07h-.02c0-.8.02-1.59.02-2.38V289.41c-53.33 13.4-97.76 45.8-123.61 88.53l90.21 402.31Z' fill={fill} />
      <Path d='M490.84 320.34c-43.23-21.13-90.93-33.02-141.07-33.4v.02c-.8 0-1.59-.02-2.38-.02H0c13.4 53.33 45.8 97.76 88.53 123.61l402.31-90.21Z' fill={fill} />
    </Svg>
  );
}

export const gaulattiLogoSrc = 'native:gaulatti-logo';
