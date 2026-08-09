import type { ProgressSize, ProgressVariant } from '@gaulatti/bleecker/core';
import { radii, spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { useThompsonTheme } from '../theme';
import { Text } from './typography';

export type { ProgressSize, ProgressVariant } from '@gaulatti/bleecker/core';

export interface ProgressProps extends ViewProps {
  max?: number;
  showLabel?: boolean;
  size?: ProgressSize;
  value?: number;
  variant?: ProgressVariant;
}

const heights: Record<ProgressSize, number> = { sm: 6, md: 8, lg: 12 };

export function Progress({ accessibilityLabel = 'Progress', max = 100, showLabel = false, size = 'md', style, value = 0, variant = 'default', ...props }: ProgressProps) {
  const { theme } = useThompsonTheme();
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const fillColor: Record<ProgressVariant, string> = {
    default: theme.colors.sea,
    success: theme.colors.sea,
    warning: theme.colorScheme === 'dark' ? theme.colors.accentGold : theme.colors.sunset,
    destructive: theme.colors.terracotta
  };
  return (
    <View style={[styles.row, style]} {...props}>
      <View
        accessibilityLabel={accessibilityLabel}
        accessibilityRole='progressbar'
        accessibilityValue={{ max, min: 0, now: value }}
        style={[styles.track, { backgroundColor: theme.colors.muted, height: heights[size] }]}
      >
        <View style={[styles.fill, { backgroundColor: fillColor[variant], width: `${percentage}%` }]} />
      </View>
      {showLabel ? <Text size='xs' tone='secondary' style={styles.label}>{Math.round(percentage)}%</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { borderRadius: radii.pill, height: '100%' },
  label: { minWidth: 40, textAlign: 'right' },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.control, width: '100%' },
  track: { borderRadius: radii.pill, flex: 1, overflow: 'hidden' }
});
