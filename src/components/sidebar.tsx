import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { spacing } from '@gaulatti/bleecker/tokens';

import { useThompsonTheme } from '../theme';
import { Text } from './typography';

export interface SidebarItem { active?: boolean; badge?: React.ReactNode; disabled?: boolean; expanded?: boolean; href?: string; icon?: React.ReactNode; id: string; items?: SidebarItem[]; label: string; }
export interface SidebarProps extends Omit<ViewProps, 'children'> { collapsed?: boolean; footer?: React.ReactNode; header?: React.ReactNode; items: SidebarItem[]; onItemClick?: (item: SidebarItem) => void; }

function SidebarRow({ collapsed, item, level = 0, onItemClick }: { collapsed: boolean; item: SidebarItem; level?: number; onItemClick?: (item: SidebarItem) => void }) {
  const { theme } = useThompsonTheme();
  const [open, setOpen] = React.useState(item.expanded ?? item.items?.some((child) => child.active) ?? false);
  const hasChildren = Boolean(item.items?.length);
  React.useEffect(() => { if (item.expanded) setOpen(true); }, [item.expanded]);
  return (
    <>
      <Pressable disabled={item.disabled} onPress={() => { if (hasChildren) setOpen((value) => !value); else onItemClick?.(item); }} style={({ pressed }) => [styles.item, { marginLeft: level * 14 }, item.active && { backgroundColor: `${theme.colors.sea}12` }, pressed && styles.pressed, item.disabled && styles.disabled]}>
        {item.icon}<Text numberOfLines={1} tone={item.active ? 'accent' : 'secondary'} weight={item.active ? '600' : '500'} style={collapsed ? undefined : styles.label}>{collapsed ? null : item.label}</Text>{!collapsed ? item.badge : null}{!collapsed && hasChildren ? <Text size='xs' tone='secondary'>{open ? '⌄' : '›'}</Text> : null}
      </Pressable>
      {!collapsed && open ? item.items?.map((child) => <SidebarRow key={child.id} collapsed={false} item={child} level={level + 1} onItemClick={onItemClick} />) : null}
    </>
  );
}

export function Sidebar({ collapsed = false, footer, header, items, onItemClick, style, ...props }: SidebarProps) {
  const { theme } = useThompsonTheme();
  return <View style={[styles.sidebar, { backgroundColor: theme.colors.card, borderRightColor: theme.colors.border, width: collapsed ? 64 : 256 }, style]} {...props}>{header ? <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>{header}</View> : null}<ScrollView contentContainerStyle={styles.nav}>{items.map((item) => <SidebarRow key={item.id} collapsed={collapsed} item={item} onItemClick={onItemClick} />)}</ScrollView>{footer ? <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>{footer}</View> : null}</View>;
}
const styles = StyleSheet.create({ disabled: { opacity: 0.45 }, footer: { borderTopWidth: StyleSheet.hairlineWidth, padding: spacing.component }, header: { borderBottomWidth: StyleSheet.hairlineWidth, padding: spacing.component }, item: { alignItems: 'center', borderRadius: 8, flexDirection: 'row', gap: spacing.control, minHeight: 47, paddingHorizontal: 14 }, label: { flex: 1, fontSize: 15, lineHeight: 21 }, nav: { gap: 3, padding: 18 }, pressed: { opacity: 0.65 }, sidebar: { borderRightWidth: StyleSheet.hairlineWidth, flexShrink: 0, height: '100%' } });
