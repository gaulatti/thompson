import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, useWindowDimensions, View, type ScrollViewProps, type ViewProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandLockup, type BrandLockupProps } from '../components/brand-lockup';
import { Sidebar, type SidebarItem } from '../components/sidebar';
import { Text } from '../components/typography';
import { useThompsonTheme } from '../theme';

import { AppShell, type AppShellProps } from './app-shell';
import { Header } from './header';
import { shellHeaderMinHeight } from './metrics';

export interface AdminShellProps extends Omit<AppShellProps, 'contentStyle' | 'header'> {
  actions?: React.ReactNode;
  brand?: BrandLockupProps;
  breakpoint?: number;
  contentStyle?: ViewStyle;
  drawerOpen?: boolean;
  header?: React.ReactNode | ((controls: { closeNavigation(): void; navigationOpen: boolean; openNavigation(): void }) => React.ReactNode);
  navigationItems?: SidebarItem[];
  onDrawerOpenChange?: (open: boolean) => void;
  onNavigationItemPress?: (item: SidebarItem) => void;
  scrollProps?: Omit<ScrollViewProps, 'children'>;
  scrollable?: boolean;
  sidebar?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  sidebarVisible?: boolean;
}

export function AdminShell({
  actions,
  brand,
  breakpoint = 768,
  children,
  contentStyle,
  drawerOpen,
  header,
  navigationItems = [],
  onDrawerOpenChange,
  onNavigationItemPress,
  scrollProps,
  scrollable = true,
  sidebar,
  sidebarFooter,
  sidebarVisible,
  ...props
}: AdminShellProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { theme } = useThompsonTheme();
  const wide = width >= breakpoint;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = drawerOpen ?? internalOpen;
  const setOpen = React.useCallback((value: boolean) => {
    if (drawerOpen === undefined) setInternalOpen(value);
    onDrawerOpenChange?.(value);
  }, [drawerOpen, onDrawerOpenChange]);
  const showPersistentSidebar = sidebarVisible ?? wide;
  const handleItemPress = (item: SidebarItem) => {
    onNavigationItemPress?.(item);
    if (!item.items?.length) setOpen(false);
  };
  const navigation = sidebar ?? (navigationItems.length ? <Sidebar footer={sidebarFooter} items={navigationItems} onItemClick={handleItemPress} /> : null);
  const drawerNavigation = sidebar ?? (navigationItems.length ? <Sidebar footer={sidebarFooter} items={navigationItems} onItemClick={handleItemPress} style={styles.drawerSidebar} /> : null);
  const navigationControls = { closeNavigation: () => setOpen(false), navigationOpen: open, openNavigation: () => setOpen(true) };
  const shellHeader = typeof header === 'function' ? header(navigationControls) : header ?? (brand ? <Header actions={actions} brand={brand} onMenuPress={!wide && navigation ? navigationControls.openNavigation : undefined} /> : null);
  const content = scrollable ? (
    <ScrollView keyboardShouldPersistTaps='handled' {...scrollProps} contentContainerStyle={[styles.scrollContent, scrollProps?.contentContainerStyle, contentStyle]}>
      {children}
    </ScrollView>
  ) : <View style={[styles.content, contentStyle]}>{children}</View>;

  return (
    <AppShell {...props} header={shellHeader} contentStyle={styles.row}>
      {showPersistentSidebar ? navigation : null}
      <View style={styles.content}>{content}</View>
      {!wide && navigation ? (
        <Modal animationType='fade' onRequestClose={() => setOpen(false)} transparent visible={open}>
          <Pressable accessibilityLabel='Close navigation' accessibilityRole='button' onPress={() => setOpen(false)} style={styles.backdrop}>
            <Pressable accessibilityRole='none' onPress={(event) => event.stopPropagation()} style={[styles.drawer, { backgroundColor: theme.colors.card }]}>
              <View style={[styles.drawerSafeArea, { paddingBottom: insets.bottom, paddingTop: insets.top }]}> 
                <View style={styles.drawerHeader}>
                  {brand ? <BrandLockup {...brand} /> : <Text size='lg' weight='600'>Navigation</Text>}
                  <Pressable accessibilityLabel='Close navigation' accessibilityRole='button' hitSlop={8} onPress={() => setOpen(false)} style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
                    <View style={styles.closeGlyph}><View style={[styles.closeLine, styles.closeForward, { backgroundColor: theme.colors.sea }]} /><View style={[styles.closeLine, styles.closeBackward, { backgroundColor: theme.colors.sea }]} /></View>
                  </Pressable>
                </View>
                <View style={styles.drawerNavigation}>{drawerNavigation}</View>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </AppShell>
  );
}

export interface AdminContentProps extends ViewProps {}
export function AdminContent({ style, ...props }: AdminContentProps) { return <View style={[styles.content, style]} {...props} />; }

const styles = StyleSheet.create({ backdrop: { backgroundColor: 'rgba(26,55,77,0.46)', flex: 1 }, close: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 }, closeBackward: { transform: [{ rotate: '-45deg' }] }, closeForward: { transform: [{ rotate: '45deg' }] }, closeGlyph: { alignItems: 'center', height: 20, justifyContent: 'center', width: 20 }, closeLine: { borderRadius: 2, height: 1.5, position: 'absolute', width: 20 }, content: { flex: 1, minHeight: 0 }, drawer: { height: '100%', maxWidth: 360, width: '84%' }, drawerHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: shellHeaderMinHeight, paddingHorizontal: 18 }, drawerNavigation: { flex: 1 }, drawerSafeArea: { flex: 1 }, drawerSidebar: { borderRightWidth: 0, width: '100%' }, pressed: { opacity: 0.55 }, row: { flexDirection: 'row' }, scrollContent: { flexGrow: 1, padding: 18, paddingBottom: 32, paddingTop: 26 } });
