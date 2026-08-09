import React from 'react';
import { Text as NativeText, type TextProps as NativeTextProps, type TextStyle } from 'react-native';

import { useThompsonTheme } from '../theme';

export type TextTone = 'primary' | 'secondary' | 'muted' | 'danger' | 'accent';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg';
export type TextWeight = '400' | '500' | '600' | '700';
export type TextFamily = 'primary' | 'secondary';

export interface TextProps extends NativeTextProps {
  family?: TextFamily;
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
}

const sizes: Record<TextSize, Pick<TextStyle, 'fontSize' | 'lineHeight'>> = {
  xs: { fontSize: 12, lineHeight: 17 },
  sm: { fontSize: 13, lineHeight: 19 },
  md: { fontSize: 15, lineHeight: 22 },
  lg: { fontSize: 17, lineHeight: 24 }
};

export function Text({ family = 'primary', size = 'md', style, tone = 'primary', weight = '400', ...props }: TextProps) {
  const { theme } = useThompsonTheme();
  const color = {
    primary: theme.colors.textPrimary,
    secondary: theme.colors.textSecondary,
    muted: theme.colors.mutedForeground,
    danger: theme.colors.destructive,
    accent: theme.colors.sea
  }[tone];
  const primaryFamily = { '400': theme.fonts.regular, '500': theme.fonts.medium, '600': theme.fonts.semibold, '700': theme.fonts.bold }[weight];
  const secondaryFamily = weight === '400' ? theme.fonts.secondary : weight === '500' ? theme.fonts.secondaryMedium : primaryFamily;
  return <NativeText style={[theme.text.body, sizes[size], { color, fontFamily: family === 'secondary' ? secondaryFamily : primaryFamily }, style]} {...props} />;
}

export type HeadingLevel = 1 | 2 | 3 | 4;

export interface HeadingProps extends NativeTextProps {
  level?: HeadingLevel;
}

const headings: Record<HeadingLevel, TextStyle> = {
  1: { fontSize: 29, letterSpacing: -0.6, lineHeight: 35 },
  2: { fontSize: 24, letterSpacing: -0.48, lineHeight: 29 },
  3: { fontSize: 20, letterSpacing: -0.3, lineHeight: 25 },
  4: { fontSize: 17, letterSpacing: -0.15, lineHeight: 22 }
};

export function Heading({ level = 2, style, ...props }: HeadingProps) {
  const { theme } = useThompsonTheme();
  return <NativeText accessibilityRole='header' style={[theme.text.heading, { fontFamily: theme.fonts.semibold }, headings[level], style]} {...props} />;
}
