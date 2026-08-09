import type { CardPadding, CardVariant } from '@gaulatti/bleecker/core';
import { radii, spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { type StyleProp, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { useThompsonTheme } from '../theme';

export type { CardPadding, CardVariant } from '@gaulatti/bleecker/core';

export interface CardProps extends ViewProps {
  padding?: CardPadding;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
}

const paddings: Record<CardPadding, number> = { none: 0, sm: spacing.component, md: spacing.group, lg: spacing.container };

export function Card({ padding = 'md', style, variant = 'surface', ...props }: CardProps) {
  const { theme } = useThompsonTheme();
  const variants: Record<CardVariant, ViewStyle> = {
    surface: { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1, ...theme.shadows.surface },
    outlined: { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 },
    elevated: { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1, ...theme.shadows.raised },
    subtle: { backgroundColor: theme.colors.muted, borderColor: theme.colors.border, borderWidth: 1 },
    transparent: { backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 1 }
  };
  return <View style={[styles.base, { padding: paddings[padding] }, variants[variant], style]} {...props} />;
}

const styles = StyleSheet.create({ base: { borderRadius: radii.card + 2 } });
