import { EncodeSans_400Regular } from '@expo-google-fonts/encode-sans/400Regular';
import { EncodeSans_500Medium } from '@expo-google-fonts/encode-sans/500Medium';
import { EncodeSans_600SemiBold } from '@expo-google-fonts/encode-sans/600SemiBold';
import { EncodeSans_700Bold } from '@expo-google-fonts/encode-sans/700Bold';
import { LibreFranklin_400Regular } from '@expo-google-fonts/libre-franklin/400Regular';
import { LibreFranklin_500Medium } from '@expo-google-fonts/libre-franklin/500Medium';
import { useFonts } from 'expo-font';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { SBUI } from '@storybook/react-native-ui-common';

import { AdminShell, Button, Stack, Switch, Text, ThompsonProvider, useThompsonTheme, type SidebarItem } from '../../src';
import { CatalogNavigationProvider } from './catalog-navigation';

type StoryTreeItem = {
  children?: string[];
  id: string;
  name: string;
  type: string;
};

function buildNavigation(storyHash: Record<string, StoryTreeItem>, selectedId?: string): SidebarItem[] {
  const visit = (id: string): SidebarItem | null => {
    const node = storyHash[id];
    if (!node || node.type === 'docs') return null;
    if (node.type === 'story') return { active: node.id === selectedId, id: node.id, label: node.name };
    const items = (node.children ?? []).map(visit).filter((item): item is SidebarItem => item !== null);
    if (!items.length) return null;
    return { expanded: items.some((item) => item.active || item.expanded), id: node.id, items, label: node.name };
  };

  const roots = Object.values(storyHash).filter((item) => item.type === 'root' || (!('parent' in item) && item.type !== 'story'));
  const navigation = roots.map((item) => visit(item.id)).filter((item): item is SidebarItem => item !== null);
  if (navigation.length) return navigation;
  return Object.values(storyHash).filter((item) => item.type === 'story').map((item) => ({ active: item.id === selectedId, id: item.id, label: item.name }));
}

function FontGate({ children }: { children: React.ReactNode }) {
  const [loaded, error] = useFonts({ EncodeSans_400Regular, EncodeSans_500Medium, EncodeSans_600SemiBold, EncodeSans_700Bold, LibreFranklin_400Regular, LibreFranklin_500Medium });
  return loaded || error ? children : null;
}

function RendererFooter() {
  const { setThemeMode, themeMode } = useThompsonTheme();
  const dark = themeMode === 'dark';
  return <Stack gap='control'><View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}><Text tone='secondary'>Dark appearance</Text><Switch checked={dark} onCheckedChange={(checked) => setThemeMode(checked ? 'dark' : 'light')} /></View><Button fullWidth variant='subtle'>Thompson Storybook</Button></Stack>;
}

function ThompsonRenderer({ children, setStory, story, storyHash }: Parameters<SBUI>[0]) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigation = React.useMemo(() => buildNavigation(storyHash as Record<string, StoryTreeItem>, story?.id), [story?.id, storyHash]);
  return (
    <AdminShell
      brand={{ name: 'thompson' }}
      drawerOpen={drawerOpen}
      navigationItems={navigation}
      onDrawerOpenChange={setDrawerOpen}
      onNavigationItemPress={(item) => setStory(item.id)}
      scrollable={false}
      sidebarFooter={<RendererFooter />}
    >
      <CatalogNavigationProvider value={() => setDrawerOpen(true)}>
        <View style={{ flex: 1 }}>{children}</View>
      </CatalogNavigationProvider>
    </AdminShell>
  );
}

export const ThompsonStorybookUI: SBUI = (props) => (
  <SafeAreaProvider>
    <FontGate>
      <ThompsonProvider defaultTheme='light'>
        <ThompsonRenderer {...props} />
      </ThompsonProvider>
    </FontGate>
  </SafeAreaProvider>
);
