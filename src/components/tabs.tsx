import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';

import { useThompsonTheme } from '../theme';
import { Text } from './typography';

export interface TabItem { external?: boolean; href?: string; id: string; label: string; panelId?: string; }
export type TabRenderLink = (props: { item: TabItem & { href: string }; className?: string; children: React.ReactNode }) => React.ReactNode;
export interface TabsProps extends Omit<ViewProps, 'children'> {
  activeTab?: string;
  onChange?: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
  stretch?: boolean;
  tabs: TabItem[];
  variant?: 'underline' | 'segmented' | 'enclosed';
}

export function Tabs({ activeTab, onChange, size = 'md', stretch = false, style, tabs, variant = 'underline', ...props }: TabsProps) {
  const { theme } = useThompsonTheme();
  const items = tabs.map((tab) => {
    const active = tab.id === activeTab;
    return (
      <Pressable key={tab.id} accessibilityRole='tab' accessibilityState={{ selected: active }} onPress={() => onChange?.(tab.id)} style={({ pressed }) => [styles.tab, styles[size], stretch && styles.stretch, variant !== 'underline' && styles.rounded, variant === 'enclosed' && { borderColor: theme.colors.border, borderWidth: 1 }, active && (variant === 'underline' ? { borderBottomColor: theme.colors.sea } : { backgroundColor: theme.colors.card }), pressed && styles.pressed]}>
        <Text size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'} tone={active ? 'accent' : 'secondary'} weight='600'>{tab.label}</Text>
      </Pressable>
    );
  });
  if (stretch) return <View accessibilityRole='tablist' style={[styles.row, variant !== 'underline' && { backgroundColor: theme.colors.muted }, style]} {...props}>{items}</View>;
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.row, variant !== 'underline' && { backgroundColor: theme.colors.muted }, style]} {...props}>{items}</ScrollView>;
}

const styles = StyleSheet.create({ enclosed: {}, lg: { minHeight: 48, paddingHorizontal: 18 }, md: { minHeight: 40, paddingHorizontal: 14 }, pressed: { opacity: 0.68 }, rounded: { borderRadius: 8 }, row: { alignItems: 'center', flexDirection: 'row', gap: 4 }, sm: { minHeight: 32, paddingHorizontal: 10 }, stretch: { flex: 1 }, tab: { alignItems: 'center', borderBottomColor: 'transparent', borderBottomWidth: 2, justifyContent: 'center' } });
