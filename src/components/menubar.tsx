import React from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
import { spacing } from '@gaulatti/bleecker/tokens';

import { Sheet } from './overlays';
import { Text } from './typography';

export interface MenubarItemBase { disabled?: boolean; label: string; shortcut?: string; }
export interface MenubarActionItem extends MenubarItemBase { icon?: React.ReactNode; onSelect: () => void; type: 'item'; }
export interface MenubarCheckboxItem extends MenubarItemBase { checked: boolean; onCheckedChange: (checked: boolean) => void; type: 'checkbox'; }
export interface MenubarRadioItem extends MenubarItemBase { type: 'radio'; value: string; }
export interface MenubarRadioGroup { items: MenubarRadioItem[]; onValueChange: (value: string) => void; type: 'radioGroup'; value: string; }
export interface MenubarSeparator { type: 'separator'; }
export interface MenubarSubMenu extends MenubarItemBase { items: MenubarMenuItem[]; type: 'sub'; }
export type MenubarMenuItem = MenubarActionItem | MenubarCheckboxItem | MenubarRadioGroup | MenubarSeparator | MenubarSubMenu;
export interface MenubarMenu { items: MenubarMenuItem[]; trigger: string; }
export interface MenubarProps extends ViewProps { menus: MenubarMenu[]; }

function MenuItems({ items, onClose }: { items: MenubarMenuItem[]; onClose: () => void }) {
  return <View>{items.map((item, index) => {
    if (item.type === 'separator') return <View accessibilityRole='none' key={index} style={styles.separator} />;
    if (item.type === 'radioGroup') return <View accessibilityRole='radiogroup' key={index}>{item.items.map((option) => <Pressable accessibilityRole='radio' accessibilityState={{ checked: item.value === option.value, disabled: option.disabled }} disabled={option.disabled} key={option.value} onPress={() => { item.onValueChange(option.value); onClose(); }} style={styles.item}><Text style={styles.mark}>{item.value === option.value ? '●' : '○'}</Text><Text style={styles.grow}>{option.label}</Text>{option.shortcut ? <Text size='xs' tone='secondary'>{option.shortcut}</Text> : null}</Pressable>)}</View>;
    if (item.type === 'sub') return <View key={index} style={styles.sub}><Text size='xs' tone='secondary' weight='600'>{item.label.toUpperCase()}</Text><MenuItems items={item.items} onClose={onClose} /></View>;
    const checked = item.type === 'checkbox' ? item.checked : undefined;
    return <Pressable accessibilityRole={item.type === 'checkbox' ? 'checkbox' : 'menuitem'} accessibilityState={{ checked, disabled: item.disabled }} disabled={item.disabled} key={`${item.label}:${index}`} onPress={() => { if (item.type === 'checkbox') item.onCheckedChange(!item.checked); else item.onSelect(); onClose(); }} style={({ pressed }) => [styles.item, pressed && styles.pressed, item.disabled && styles.disabled]}>{item.type === 'checkbox' ? <Text style={styles.mark}>{item.checked ? '✓' : ''}</Text> : item.icon ?? <View style={styles.mark} />}<Text style={styles.grow}>{item.label}</Text>{item.shortcut ? <Text size='xs' tone='secondary'>{item.shortcut}</Text> : null}</Pressable>;
  })}</View>;
}

export function Menubar({ menus, style, ...props }: MenubarProps) {
  const [active, setActive] = React.useState<number | null>(null);
  const menu = active === null ? undefined : menus[active];
  return <View accessibilityRole='menubar' style={[styles.bar, style]} {...props}>{menus.map((entry, index) => <Pressable accessibilityRole='button' key={entry.trigger} onPress={() => setActive(index)} style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}><Text size='sm' weight='600'>{entry.trigger}</Text></Pressable>)}<Sheet open={Boolean(menu)} onOpenChange={(open) => !open && setActive(null)} title={menu?.trigger ?? 'Menu'}>{menu ? <MenuItems items={menu.items} onClose={() => setActive(null)} /> : null}</Sheet></View>;
}

const styles = StyleSheet.create({ bar: { alignItems: 'center', flexDirection: 'row', gap: spacing.detail }, disabled: { opacity: 0.45 }, grow: { flex: 1 }, item: { alignItems: 'center', flexDirection: 'row', gap: spacing.control, minHeight: 48, paddingHorizontal: spacing.control }, mark: { minWidth: 18 }, pressed: { opacity: 0.6 }, separator: { backgroundColor: 'rgba(128,128,128,0.2)', height: StyleSheet.hairlineWidth, marginVertical: spacing.detail }, sub: { gap: spacing.detail, paddingVertical: spacing.control }, trigger: { borderRadius: 7, minHeight: 40, paddingHorizontal: spacing.control, justifyContent: 'center' } });
