import React from 'react';
import { ScrollView, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { spacing } from '@gaulatti/bleecker/tokens';

import { useThompsonTheme } from '../theme';
import { Text } from './typography';

export interface PanelProps extends Omit<ViewProps, 'children'> {
  accent?: string;
  children: React.ReactNode;
  count?: number;
  dragHandle?: React.ReactNode;
  filter?: React.ReactNode;
  grow?: boolean;
  isDragging?: boolean;
  scrollable?: boolean;
  title: string;
  toolbar?: React.ReactNode;
  variant?: 'monitor';
  width?: number | string;
}

export function Panel({ accent, children, count, dragHandle, filter, grow = false, isDragging: _isDragging, scrollable = true, style, title, toolbar, variant: _variant, width, ...props }: PanelProps) {
  const { theme } = useThompsonTheme();
  const panelStyle: ViewStyle = { borderLeftColor: accent ?? theme.colors.sea, flex: grow ? 1 : undefined, width: width as ViewStyle['width'] };
  const body = scrollable ? <ScrollView contentContainerStyle={styles.scrollContent}>{children}</ScrollView> : <View style={styles.body}>{children}</View>;
  return (
    <View style={[styles.panel, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }, panelStyle, style]} {...props}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <View style={styles.titleRow}>{dragHandle}<View style={[styles.dot, { backgroundColor: accent ?? theme.colors.sea }]} /><Text size='xs' tone='accent' weight='600' style={styles.title}>{title}</Text>{count !== undefined ? <View style={[styles.count, { backgroundColor: theme.colors.muted }]}><Text size='xs' weight='600'>{count}</Text></View> : null}</View>
        {filter ? <View style={styles.slot}>{filter}</View> : null}
        {toolbar ? <View style={[styles.toolbar, { borderTopColor: theme.colors.border }]}>{toolbar}</View> : null}
      </View>
      {body}
    </View>
  );
}
const styles = StyleSheet.create({ body: { flex: 1 }, count: { borderRadius: 5, paddingHorizontal: 8, paddingVertical: 2 }, dot: { borderRadius: 99, height: 7, width: 7 }, header: { borderBottomWidth: StyleSheet.hairlineWidth }, panel: { borderLeftWidth: 2, borderRightWidth: StyleSheet.hairlineWidth, flex: 1, minHeight: 0, overflow: 'hidden' }, scrollContent: { flexGrow: 1 }, slot: { paddingBottom: spacing.component, paddingHorizontal: spacing.component }, title: { flex: 1, letterSpacing: 1, textTransform: 'uppercase' }, titleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.control, minHeight: 56, paddingHorizontal: spacing.component }, toolbar: { alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', justifyContent: 'center', padding: spacing.control } });
