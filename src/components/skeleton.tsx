import { radii, spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { Animated, StyleSheet, View, type ViewProps } from 'react-native';

import { useThompsonTheme } from '../theme';

export interface SkeletonProps extends ViewProps {
  circle?: boolean;
  height?: number;
  width?: number | `${number}%`;
}

export function Skeleton({ circle = false, height = 16, style, width = '100%', ...props }: SkeletonProps) {
  const { theme } = useThompsonTheme();
  const opacity = React.useRef(new Animated.Value(0.45)).current;
  React.useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { duration: 700, toValue: 0.9, useNativeDriver: true }),
      Animated.timing(opacity, { duration: 700, toValue: 0.45, useNativeDriver: true })
    ]));
    animation.start();
    return () => animation.stop();
  }, [opacity]);
  return <Animated.View style={[{ backgroundColor: theme.colors.sand, borderRadius: circle ? radii.pill : radii.ui, height, opacity, width }, style]} {...props} />;
}

export interface SkeletonCardProps extends ViewProps { rows?: number; }

export function SkeletonCard({ rows = 3, style, ...props }: SkeletonCardProps) {
  const { theme } = useThompsonTheme();
  return <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, style]} {...props}><View style={styles.row}><Skeleton circle height={40} width={40} /><View style={styles.copy}><Skeleton height={16} width='34%' /><Skeleton height={12} width='52%' /></View></View>{Array.from({ length: rows }, (_, index) => <Skeleton key={index} height={12} />)}</View>;
}

export interface SkeletonTableProps extends ViewProps { columns?: number; rows?: number; }
export function SkeletonTable({ columns = 4, rows = 5, style, ...props }: SkeletonTableProps) {
  return <View style={[styles.table, style]} {...props}>{Array.from({ length: rows + 1 }, (_, row) => <View key={row} style={styles.tableRow}>{Array.from({ length: columns }, (_, column) => <Skeleton key={column} height={row === 0 ? 12 : 16} width={`${Math.max(36, 82 - column * 7)}%`} />)}</View>)}</View>;
}

const styles = StyleSheet.create({ card: { borderRadius: radii.card, borderWidth: 1, gap: spacing.control, padding: spacing.group }, copy: { flex: 1, gap: spacing.inline }, row: { alignItems: 'center', flexDirection: 'row', gap: spacing.control }, table: { gap: spacing.control }, tableRow: { flexDirection: 'row', gap: spacing.control }, });
