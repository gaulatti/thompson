import React from 'react';
import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';

export interface PanelColumnProps extends ViewProps { grow?: boolean; }
export function PanelColumn({ grow = false, style, ...props }: PanelColumnProps) { return <View style={[styles.column, grow && styles.grow, style]} {...props} />; }

export interface PanelLayoutProps extends ViewProps { horizontal?: boolean; padding?: number; }
export function PanelLayout({ children, horizontal = true, padding = 0, style, ...props }: PanelLayoutProps) {
  if (!horizontal) return <View style={[styles.column, { padding }, style]} {...props}>{children}</View>;
  return <ScrollView horizontal contentContainerStyle={[styles.row, { padding }, style]} {...props}>{children}</ScrollView>;
}
const styles = StyleSheet.create({ column: { flexDirection: 'column', minHeight: 0 }, grow: { flex: 1 }, row: { flexDirection: 'row', flexGrow: 1, minHeight: 0 } });
