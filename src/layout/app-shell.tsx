import React from 'react';
import { Pressable, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useThompsonTheme } from '../theme';
import { Text } from '../components/typography';

export interface AppShellTab {
  accessibilityLabel?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode | ((active: boolean) => React.ReactNode);
  id: string;
  label: string;
}

export interface AppShellProps extends Omit<ViewProps, 'children'> {
  activeTab?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  offsetHeader?: boolean;
  onTabChange?: (id: string) => void;
  safeAreaEdges?: Edge[];
  tabs?: AppShellTab[];
}

export function AppShell({ activeTab, children, contentStyle, footer, header, offsetHeader: _offsetHeader = true, onTabChange, safeAreaEdges = ['top', 'left', 'right'], style, tabs = [], ...props }: AppShellProps) {
  const { theme } = useThompsonTheme();
  return (
    <SafeAreaView edges={safeAreaEdges} style={[styles.shell, { backgroundColor: theme.colors.background }, style]} {...props}>
      {header}
      <View style={[styles.content, { backgroundColor: theme.colors.background }, contentStyle]}>{children}</View>
      {footer}
      {tabs.length > 0 ? <AppShellTabBar activeTab={activeTab} onTabChange={onTabChange} tabs={tabs} /> : null}
    </SafeAreaView>
  );
}

export interface AppShellTabBarProps extends Omit<ViewProps, 'children'> {
  activeTab?: string;
  onTabChange?: (id: string) => void;
  tabs: AppShellTab[];
}

export function AppShellTabBar({ activeTab, onTabChange, style, tabs, ...props }: AppShellTabBarProps) {
  const { theme } = useThompsonTheme();
  return (
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: theme.colors.card }}>
      <View accessibilityRole='tablist' style={[styles.tabBar, { borderTopColor: theme.colors.border }, style]} {...props}>
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <Pressable
              key={tab.id}
              accessibilityLabel={tab.accessibilityLabel ?? tab.label}
              accessibilityRole='tab'
              accessibilityState={{ selected: active }}
              onPress={() => onTabChange?.(tab.id)}
              style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
            >
              <View>{typeof tab.icon === 'function' ? tab.icon(active) : tab.icon}{tab.badge}</View>
              <Text size='xs' tone={active ? 'accent' : 'secondary'} weight={active ? '600' : '500'}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ content: { flex: 1, minHeight: 0 }, pressed: { opacity: 0.55 }, shell: { flex: 1 }, tab: { alignItems: 'center', flex: 1, gap: 3, justifyContent: 'center', minHeight: 58, paddingHorizontal: 4, paddingTop: 5 }, tabBar: { borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row' } });
