import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useFonts } from 'expo-font';
import { EncodeSans_400Regular } from '@expo-google-fonts/encode-sans/400Regular';
import { EncodeSans_500Medium } from '@expo-google-fonts/encode-sans/500Medium';
import { EncodeSans_600SemiBold } from '@expo-google-fonts/encode-sans/600SemiBold';
import { EncodeSans_700Bold } from '@expo-google-fonts/encode-sans/700Bold';
import { LibreFranklin_400Regular } from '@expo-google-fonts/libre-franklin/400Regular';
import { LibreFranklin_500Medium } from '@expo-google-fonts/libre-franklin/500Medium';

import {
  AdminShell,
  Button,
  Card,
  DashboardGrid,
  IconBadge,
  PageHeader,
  Separator,
  Stack,
  StatCard,
  Status,
  Switch,
  Text,
  ThompsonProvider,
  useThompsonTheme
} from '../src';
import { CatalogPage, catalogNavigation, type CatalogRoute } from './catalog-pages';

function DocumentIcon() {
  return <Svg height={23} viewBox='0 0 24 24' width={23}><Path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8M8 17h8M8 9h2' fill='none' stroke='#fff' strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.8} /></Svg>;
}

function ThompsonAdminDemo() {
  const [active, setActive] = React.useState<CatalogRoute>('dashboard');
  const { setThemeMode, themeMode } = useThompsonTheme();
  const dark = themeMode === 'dark';
  return <AdminShell
    brand={{ name: 'thompson' }}
    navigationItems={catalogNavigation.map((item) => ({ ...item, active: item.id === active }))}
    onNavigationItemPress={(item) => setActive(item.id as CatalogRoute)}
    sidebarFooter={<Stack gap='control'><View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}><Text tone='secondary'>Dark appearance</Text><Switch checked={dark} onCheckedChange={(checked) => setThemeMode(checked ? 'dark' : 'light')} /></View><Button fullWidth variant='destructive'>Logout</Button></Stack>}
  >
    {active === 'dashboard' ? <Stack gap='group'>
      <PageHeader title='Dashboard' description='A complete native application frame vended by Thompson.' />
      <DashboardGrid columns={2}>
        <StatCard icon={<IconBadge size='sm' style={{ backgroundColor: '#2C5784', borderColor: '#2C5784' }}><DocumentIcon /></IconBadge>} title='Total Articles' value='6993' />
        <StatCard icon={<IconBadge size='sm' style={{ backgroundColor: '#A65D57', borderColor: '#A65D57' }}><DocumentIcon /></IconBadge>} title='Total Events' value='24' />
        <StatCard icon={<IconBadge size='sm' style={{ backgroundColor: '#C6A760', borderColor: '#C6A760' }}><DocumentIcon /></IconBadge>} title='Published' value='6992' />
        <StatCard icon={<IconBadge size='sm' style={{ backgroundColor: '#FF9677', borderColor: '#FF9677' }}><DocumentIcon /></IconBadge>} title='Drafts' value='1' />
      </DashboardGrid>
      <Card><Stack><Text size='lg' weight='600'>Recent Articles</Text>{[
        'Ford launches the electric Fathom pickup from $28,350',
        'A shared component system reaches native',
        'Tokens and contracts remain synchronized with Bleecker'
      ].map((title, index) => <React.Fragment key={title}>{index ? <Separator /> : null}<View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}><Text weight='500'>{title}</Text><Text family='secondary' size='sm' tone='secondary'>published</Text></View><Status value='Published' /></View></React.Fragment>)}</Stack></Card>
    </Stack> : <CatalogPage route={active} />}
  </AdminShell>;
}

export default function App() {
  const [loaded, error] = useFonts({ EncodeSans_400Regular, EncodeSans_500Medium, EncodeSans_600SemiBold, EncodeSans_700Bold, LibreFranklin_400Regular, LibreFranklin_500Medium });
  if (!loaded && !error) return null;
  return <SafeAreaProvider><ThompsonProvider><ThompsonAdminDemo /></ThompsonProvider></SafeAreaProvider>;
}
