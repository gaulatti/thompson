import { spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { useThompsonTheme } from '../theme';

export interface StackProps extends ViewProps {
  gap?: keyof typeof spacing;
  horizontal?: boolean;
}

export function Stack({ gap = 'component', horizontal = false, style, ...props }: StackProps) {
  return <View style={[horizontal ? styles.row : styles.column, { gap: spacing[gap] }, style]} {...props} />;
}

export interface SeparatorProps extends ViewProps {
  decorative?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({ decorative = true, orientation = 'horizontal', style, ...props }: SeparatorProps) {
  const { theme } = useThompsonTheme();
  return <View accessibilityRole={decorative ? 'none' : undefined} style={[orientation === 'horizontal' ? styles.horizontal : styles.vertical, { backgroundColor: theme.colors.border }, style]} {...props} />;
}

const styles = StyleSheet.create({
  column: { flexDirection: 'column' },
  horizontal: { height: StyleSheet.hairlineWidth, width: '100%' },
  row: { alignItems: 'center', flexDirection: 'row' },
  vertical: { height: '100%', width: StyleSheet.hairlineWidth }
});
