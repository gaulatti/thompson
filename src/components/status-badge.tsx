import type { StatusBadgeVariant } from '@gaulatti/bleecker/core';
import { radii, spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { useThompsonTheme } from '../theme';
import { Text } from './typography';

export type { StatusBadgeVariant } from '@gaulatti/bleecker/core';

export interface StatusBadgeProps extends ViewProps {
  description?: string;
  label: string;
  variant?: StatusBadgeVariant;
}

export function statusVariantFor(value: string): StatusBadgeVariant {
  const normalized = value.trim().toLowerCase();
  if (['live', 'active', 'success', 'complete', 'completed'].includes(normalized)) return 'live';
  if (normalized === 'published') return 'info';
  if (['scheduled', 'pending', 'warning'].includes(normalized)) return 'warning';
  if (['draft', 'inactive', 'archived', 'offline', 'failed', 'error'].includes(normalized)) return 'offline';
  return 'default';
}

export interface StatusProps extends Omit<StatusBadgeProps, 'label' | 'variant'> { value: string; variant?: StatusBadgeVariant; }
export function Status({ value, variant, ...props }: StatusProps) { return <StatusBadge label={value || 'Unknown'} variant={variant ?? statusVariantFor(value)} {...props} />; }

export function StatusBadge({ description, label, style, variant = 'default', ...props }: StatusBadgeProps) {
  const { theme } = useThompsonTheme();
  const color = {
    live: '#10b981',
    offline: theme.colors.terracotta,
    warning: theme.colors.desert,
    info: theme.colors.sea,
    default: theme.colors.textSecondary
  }[variant];
  return (
    <View accessibilityLabel={`${label}${description ? `, ${description}` : ''}`} style={[styles.row, style]} {...props}>
      <View style={[styles.badge, { backgroundColor: `${color}18`, borderColor: `${color}40` }]}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text size='xs' weight='600' style={{ color }}>{label}</Text>
      </View>
      {description ? <Text size='xs' tone='secondary'>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', borderRadius: radii.ui, borderWidth: 1, flexDirection: 'row', gap: 6, minHeight: 24, paddingHorizontal: 10, paddingVertical: 2 },
  dot: { borderRadius: radii.pill, height: 6, width: 6 },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.inline }
});
