import React from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
import { spacing } from '@gaulatti/bleecker/tokens';

import { type NavItem, type RenderLink, renderDefaultLink } from './navigation';
import { Text } from './typography';

export interface NavigationMenuLink extends NavItem { description?: string; }
export interface NavigationMenuGroup { items: NavigationMenuLink[]; label: string; }
export type NavigationMenuEntry = NavigationMenuLink | NavigationMenuGroup;
export interface NavigationMenuProps<TLink extends NavigationMenuLink = NavigationMenuLink> extends ViewProps { entries: Array<TLink | NavigationMenuGroup>; onItemClick?: (item: TLink) => void; renderLink?: RenderLink<TLink>; }

function isGroup(entry: NavigationMenuEntry): entry is NavigationMenuGroup { return 'items' in entry; }

export function NavigationMenu<TLink extends NavigationMenuLink>({ entries, onItemClick, renderLink = renderDefaultLink, style, ...props }: NavigationMenuProps<TLink>) {
  const [openGroup, setOpenGroup] = React.useState<string>();
  const link = (item: TLink) => renderLink({ children: <View style={styles.copy}><Text weight='500'>{item.label}</Text>{item.description ? <Text size='xs' tone='secondary'>{item.description}</Text> : null}</View>, item, onClick: () => onItemClick?.(item) });
  return <View accessibilityRole='menu' style={[styles.menu, style]} {...props}>{entries.map((entry) => isGroup(entry) ? <View key={entry.label}><Pressable accessibilityRole='button' accessibilityState={{ expanded: openGroup === entry.label }} onPress={() => setOpenGroup(openGroup === entry.label ? undefined : entry.label)} style={styles.groupTrigger}><Text weight='600' style={styles.copy}>{entry.label}</Text><Text>{openGroup === entry.label ? '−' : '+'}</Text></Pressable>{openGroup === entry.label ? <View style={styles.group}>{entry.items.map((item) => <React.Fragment key={item.href}>{link(item as TLink)}</React.Fragment>)}</View> : null}</View> : <React.Fragment key={entry.href}>{link(entry as TLink)}</React.Fragment>)}</View>;
}

const styles = StyleSheet.create({ copy: { flex: 1, gap: spacing.detail }, group: { gap: spacing.inline, paddingBottom: spacing.control, paddingLeft: spacing.component }, groupTrigger: { alignItems: 'center', flexDirection: 'row', minHeight: 44 }, menu: { gap: spacing.inline } });
