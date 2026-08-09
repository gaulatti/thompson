import React from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
import { radii, spacing } from '@gaulatti/bleecker/tokens';

import { useThompsonTheme } from '../theme';
import { Text } from './typography';

export interface FilterChipProps extends Omit<ViewProps, 'children'> { label: string; onRemove?: () => void; value?: string; }
export function FilterChip({ label, onRemove, style, value, ...props }: FilterChipProps) {
  const { theme } = useThompsonTheme();
  return <View style={[styles.chip, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, style]} {...props}><Text size='xs' tone='secondary'>{label}</Text>{value ? <Text size='xs' weight='600'>{value}</Text> : null}{onRemove ? <Pressable accessibilityLabel={`Remove ${label} filter`} hitSlop={8} onPress={onRemove}><Text size='sm' tone='secondary'>×</Text></Pressable> : null}</View>;
}

export interface FilterGroupProps extends Omit<ViewProps, 'children'> { filters: FilterChipProps[]; onClearAll?: () => void; }
export function FilterGroup({ filters, onClearAll, style, ...props }: FilterGroupProps) {
  if (filters.length === 0) return null;
  return <View style={[styles.group, style]} {...props}>{filters.map((filter, index) => <FilterChip key={`${filter.label}:${filter.value ?? index}`} {...filter} />)}{onClearAll ? <Pressable onPress={onClearAll}><Text size='xs' tone='accent' weight='600'>Clear all</Text></Pressable> : null}</View>;
}
const styles = StyleSheet.create({ chip: { alignItems: 'center', borderRadius: radii.ui, borderWidth: 1, flexDirection: 'row', gap: 6, minHeight: 30, paddingHorizontal: 10 }, group: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.control } });
