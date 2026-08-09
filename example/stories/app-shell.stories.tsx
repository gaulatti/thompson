import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

import {
  AppShell,
  AdminShell,
  Button,
  Card,
  DashboardGrid,
  FeedItem,
  FilterGroup,
  Header,
  IconBadge,
  PageHeader,
  SearchInput,
  Separator,
  Stack,
  StatCard,
  StatusBadge,
  Switch,
  Text,
  type AppShellTab,
  useThompsonTheme
} from '../../src';

const tabs: AppShellTab[] = [
  { id: 'feed', label: 'Feed', icon: (active) => <Text tone={active ? 'accent' : 'muted'}>◉</Text> },
  { id: 'events', label: 'Events', icon: (active) => <Text tone={active ? 'accent' : 'muted'}>▱</Text> },
  { id: 'trends', label: 'Trends', icon: (active) => <Text tone={active ? 'accent' : 'muted'}>↗</Text> },
  { id: 'quakes', label: 'Quakes', icon: (active) => <Text tone={active ? 'accent' : 'muted'}>◎</Text> },
  { id: 'settings', label: 'Settings', icon: (active) => <Text tone={active ? 'accent' : 'muted'}>⚙</Text> }
];

function NativeApplicationShell() {
  const [activeTab, setActiveTab] = React.useState('feed');
  const [query, setQuery] = React.useState('');
  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
      header={
        <Header
          brand={{ name: 'sonar', logo: <IconBadge size='md'><Text style={{ color: '#fff' }}>S</Text></IconBadge> }}
          actions={<StatusBadge label='Live' variant='live' />}
        />
      }
    >
      <ScrollView contentContainerStyle={{ gap: 16, padding: 18 }}>
        <PageHeader title={tabs.find((tab) => tab.id === activeTab)?.label ?? 'Feed'} description='A complete native application frame vended by Thompson.' />
        <SearchInput value={query} onChangeText={setQuery} onClear={() => setQuery('')} placeholder='Search signals' />
        <FilterGroup filters={[{ label: 'Source', value: 'All' }, { label: 'Window', value: '24h' }]} />
        {activeTab === 'feed' ? (
          <Card padding='none'>
            <FeedItem author='Global Monitor' categories={['breaking', 'world']} content='A Thompson feed item replaces the application-local post card while preserving mobile interaction.' language='en' postedAt={new Date(Date.now() - 8 * 60_000)} relevance={94} sourceUrl='https://example.com/story' title='A shared component system reaches native' />
            <FeedItem author='Signal Desk' categories={['technology']} content='Tokens and contracts continue to come directly from Bleecker.' language='en' postedAt={new Date(Date.now() - 74 * 60_000)} relevance={87} sourceUrl='https://example.com/signal' />
          </Card>
        ) : (
          <Card variant='elevated'><Stack><Text weight='600'>{activeTab} screen</Text><Text tone='secondary'>The app owns routing and data. Thompson owns the application frame and UI composition.</Text></Stack></Card>
        )}
      </ScrollView>
    </AppShell>
  );
}

const meta = {
  title: 'Patterns/App Shell',
  component: NativeApplicationShell,
  parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof NativeApplicationShell>;

export default meta;
type Story = StoryObj<typeof meta>;
export const MobileTabs: Story = {};

const adminItems = [
  { id: 'dashboard', label: 'Dashboard', active: true },
  { id: 'articles', label: 'Articles' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'events', label: 'Events' },
  { id: 'heroes', label: 'Heroes' },
  { id: 'media', label: 'Media' },
  { id: 'pages', label: 'Pages' },
  { id: 'settings', label: 'Settings' },
  { id: 'rerender', label: 'Rerender' },
  { id: 'categories', label: 'Categories' },
  { id: 'about', label: 'About' }
];

function NativeAdminShell() {
  const [active, setActive] = React.useState('dashboard');
  const { setThemeMode, themeMode } = useThompsonTheme();
  const dark = themeMode === 'dark';
  const items = adminItems.map((item) => ({ ...item, active: item.id === active }));
  return (
    <AdminShell
      brand={{ name: 'ariston' }}
      navigationItems={items}
      onNavigationItemPress={(item) => setActive(item.id)}
      sidebarFooter={<Stack gap='control'><View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}><Text tone='secondary'>Dark appearance</Text><Switch checked={dark} onCheckedChange={(checked) => setThemeMode(checked ? 'dark' : 'light')} /></View><Button fullWidth variant='destructive'>Logout</Button></Stack>}
    >
      <Stack gap='group'>
        <PageHeader title={active === 'dashboard' ? 'Dashboard' : items.find((item) => item.id === active)?.label ?? active} description='A production-oriented mobile admin shell vended by Thompson.' />
        <DashboardGrid columns={2}>
          <StatCard icon={<IconBadge size='sm'>▤</IconBadge>} title='Total Articles' value='6993' />
          <StatCard icon={<IconBadge size='sm' variant='subtle'>▤</IconBadge>} title='Total Events' value='24' />
          <StatCard icon={<IconBadge size='sm' variant='outlined'>▤</IconBadge>} title='Published' value='6992' />
          <StatCard icon={<IconBadge size='sm' variant='subtle'>▤</IconBadge>} title='Drafts' value='1' />
        </DashboardGrid>
        <Card>
          <Stack>
            <Text size='lg' weight='600'>Recent Articles</Text>
            {[
              'Ford launches the electric Fathom pickup from $28,350',
              'A shared component system reaches native',
              'Tokens and contracts continue to come directly from Bleecker'
            ].map((title, index) => <React.Fragment key={title}>{index ? <Separator /> : null}<View style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 10 }}><View style={{ flex: 1 }}><Text weight='500'>{title}</Text><Text size='sm' tone='secondary'>published</Text></View><StatusBadge label='Published' variant='info' /></View></React.Fragment>)}
          </Stack>
        </Card>
      </Stack>
    </AdminShell>
  );
}

export const AdminDrawer: Story = { render: () => <NativeAdminShell /> };
