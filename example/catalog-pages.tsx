import React from 'react';
import { View } from 'react-native';

import {
  Alert,
  AlertDialog,
  AreaChart,
  BarChart,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Empty,
  Field,
  FileInput,
  Heading,
  IconBadge,
  Input,
  LineChart,
  LoadingSpinner,
  Metric,
  PageHeader,
  Progress,
  RadioGroup,
  ResourceList,
  SchemaForm,
  SectionHeader,
  Select,
  Separator,
  Sheet,
  SkeletonCard,
  Slider,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  Toaster,
  Toggle,
  toast,
  type PickedFile
} from '../src';

export const catalogNavigation = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'typography', label: 'Typography' },
  { id: 'surfaces', label: 'Surfaces' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'forms', label: 'Forms' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'data-display', label: 'Data Display' },
  { id: 'overlays', label: 'Overlays' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'charts', label: 'Charts' },
  { id: 'admin-patterns', label: 'Admin Patterns' }
] as const;

export type CatalogRoute = (typeof catalogNavigation)[number]['id'];

function CatalogHeader({ description, title }: { description: string; title: string }) {
  return <PageHeader description={description} title={title} />;
}

function TypographyPage() {
  return <Stack gap='group'><CatalogHeader description='The native expression of Bleecker’s shared type system.' title='Typography' /><Card><Stack gap='component'><Heading level={1}>Heading one</Heading><Heading level={2}>Heading two</Heading><Heading level={3}>Heading three</Heading><Heading level={4}>Heading four</Heading><Separator /><Text>Primary body copy balances density and readability.</Text><Text tone='secondary'>Secondary color retains the primary interface face.</Text><Text family='secondary' tone='secondary'>Libre Franklin is reserved for supporting copy and metadata.</Text><Text tone='danger'>Destructive and validation text.</Text></Stack></Card><Card variant='subtle'><Stack horizontal gap='group' style={{ flexWrap: 'wrap' }}><Metric format='currency' value={12842.5} /><Metric format='compact' value={2480000} /><Metric format='percent' value={0.274} /></Stack></Card></Stack>;
}

function SurfacesPage() {
  return <Stack gap='group'><CatalogHeader description='Warm, restrained containers with deliberate elevation.' title='Surfaces' />{(['surface', 'outlined', 'elevated', 'subtle', 'transparent'] as const).map((variant) => <Card key={variant} variant={variant}><Stack><Heading level={4}>{variant[0].toUpperCase() + variant.slice(1)}</Heading><Text tone='secondary'>Borders carry hierarchy; shadows are reserved for raised surfaces.</Text></Stack></Card>)}<Stack horizontal gap='control'><IconBadge variant='primary'>P</IconBadge><IconBadge variant='subtle'>S</IconBadge><IconBadge variant='outlined'>O</IconBadge></Stack></Stack>;
}

function ButtonsPage() {
  return <Stack gap='group'><CatalogHeader description='Semantic actions across native sizes and states.' title='Buttons' /><Card><Stack gap='control'>{(['primary', 'secondary', 'outline', 'subtle', 'ghost', 'link', 'destructive'] as const).map((variant) => <Button key={variant} variant={variant}>{variant[0].toUpperCase() + variant.slice(1)}</Button>)}</Stack></Card><Card><Stack horizontal gap='control' style={{ flexWrap: 'wrap' }}><Button size='xs'>Extra small</Button><Button size='sm'>Small</Button><Button>Default</Button><Button disabled>Disabled</Button><Button loading>Loading</Button></Stack></Card></Stack>;
}

function FormsPage() {
  const [checked, setChecked] = React.useState(true);
  const [date, setDate] = React.useState<Date>();
  const [enabled, setEnabled] = React.useState(false);
  const [files, setFiles] = React.useState<PickedFile[]>([]);
  const [plan, setPlan] = React.useState('standard');
  const [priority, setPriority] = React.useState(35);
  const [status, setStatus] = React.useState('draft');
  const [toggled, setToggled] = React.useState(false);
  return <Stack gap='group'><CatalogHeader description='Text, selection, date, range, sheet, and picker behavior.' title='Forms' /><Card><Stack gap='group'><Field description='Used for account notifications.' label='Email address' required><Input autoCapitalize='none' keyboardType='email-address' placeholder='you@example.com' /></Field><Field label='Biography' optional><Textarea placeholder='Tell us a little about yourself.' /></Field><Field error='Enter a valid email address.' label='Validation'><Input error value='not-an-email' /></Field><Checkbox checked={checked} description='Keep this device signed in.' label='Remember me' onCheckedChange={setChecked} /><Switch checked={enabled} label='Push notifications' onCheckedChange={setEnabled} /><RadioGroup onValueChange={setPlan} options={[{ label: 'Standard', description: 'For individual projects.', value: 'standard' }, { label: 'Studio', description: 'For collaborative teams.', value: 'studio' }]} value={plan} /><Toggle onPressedChange={setToggled} pressed={toggled} variant='outline'>Pinned</Toggle></Stack></Card><Card><Stack gap='group'><Field label='Publication date'><DatePicker onChange={setDate} value={date} /></Field><Field label='Status'><Select onValueChange={setStatus} options={[{ label: 'Draft', value: 'draft' }, { label: 'Scheduled', value: 'scheduled' }, { label: 'Published', value: 'published' }]} value={status} /></Field><Field description={`Current value: ${priority}`} label='Priority'><Slider onValueChange={setPriority} step={5} value={priority} /></Field><Field label='Attachment'><FileInput files={files} onFilesChange={setFiles} onPick={async () => ({ mimeType: 'application/pdf', name: 'brief.pdf', uri: 'file:///brief.pdf' })} /></Field></Stack></Card></Stack>;
}

function FeedbackPage() {
  return <Stack gap='group'><CatalogHeader description='Communicate state clearly without overwhelming the interface.' title='Feedback' /><Alert description='A neutral message for general context.' title='Default' /><Alert description='Your changes are live.' title='Saved' variant='success' /><Alert description='This action may need attention.' title='Check this' variant='warning' /><Alert description='Review the form and try again.' title='Could not save' variant='destructive' /><Card><Stack gap='component'><Progress showLabel value={68} /><Progress showLabel value={42} variant='warning' /><LoadingSpinner label='Loading dashboard' /><SkeletonCard rows={3} /></Stack></Card><Empty action={<Button size='sm'>Create project</Button>} description='Create a project to start organizing your work.' title='No projects yet' /></Stack>;
}

function DataDisplayPage() {
  return <Stack gap='group'><CatalogHeader description='Metrics and structured content for mobile dashboards.' title='Data Display' /><Stack horizontal gap='control'><Card style={{ flex: 1 }}><Text family='secondary' size='xs' tone='secondary'>Revenue</Text><Metric currency='USD' format='currency' value={12842.5} /></Card><Card style={{ flex: 1 }}><Text family='secondary' size='xs' tone='secondary'>Audience</Text><Metric format='compact' value={2480000} /></Card></Stack><Card variant='elevated'><Stack gap='component'><Heading level={3}>Goal progress</Heading><Progress showLabel size='sm' value={24} /><Progress showLabel value={58} variant='success' /><Progress showLabel size='lg' value={76} variant='warning' /><Progress showLabel value={92} variant='destructive' /></Stack></Card><Card padding='none'><ResourceList items={[{ id: '1', metadata: '8 minutes ago', status: { label: 'Published', variant: 'info' }, title: 'A native catalog becomes the default example' }, { id: '2', metadata: '1 hour ago', status: { label: 'Draft' }, title: 'Component contracts stay synchronized' }]} scrollEnabled={false} /></Card></Stack>;
}

function OverlaysPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  return <Stack gap='group'><CatalogHeader description='Native modal surfaces and transient feedback.' title='Overlays' /><Card><Stack gap='control'><Button onPress={() => setSheetOpen(true)}>Open bottom sheet</Button><Button onPress={() => setDialogOpen(true)} variant='outline'>Open alert dialog</Button><Button onPress={() => toast.success('Saved', 'The native toast store is working.')} variant='subtle'>Show toast</Button></Stack></Card><Sheet onOpenChange={setSheetOpen} open={sheetOpen} title='Native sheet'><Text tone='secondary'>Sheets use native modal behavior and mobile touch targets.</Text></Sheet><AlertDialog description='This action cannot be undone.' destructive onConfirm={() => setDialogOpen(false)} onOpenChange={setDialogOpen} open={dialogOpen} title='Delete this article?' /><Toaster /></Stack>;
}

function NavigationPage() {
  const [tab, setTab] = React.useState('overview');
  return <Stack gap='group'><CatalogHeader description='Wayfinding primitives inside the application frame.' title='Navigation' /><Card><Stack gap='group'><SectionHeader description='Section headers establish hierarchy inside a page.' eyebrow='Activity' title='Recent changes' /><Tabs activeTab={tab} onChange={setTab} stretch tabs={[{ id: 'overview', label: 'Overview' }, { id: 'activity', label: 'Activity' }, { id: 'settings', label: 'Settings' }]} variant='segmented' /><Card variant='subtle'><Text weight='600'>{tab[0].toUpperCase() + tab.slice(1)}</Text><Text tone='secondary'>The selected panel is controlled by the application.</Text></Card></Stack></Card></Stack>;
}

const timeSeries = [{ month: 'Jan', revenue: 32, volume: 20 }, { month: 'Feb', revenue: 48, volume: 35 }, { month: 'Mar', revenue: 41, volume: 44 }, { month: 'Apr', revenue: 67, volume: 52 }, { month: 'May', revenue: 74, volume: 61 }, { month: 'Jun', revenue: 88, volume: 70 }];
const series = [{ key: 'revenue', name: 'Revenue' }, { key: 'volume', name: 'Volume' }];
function ChartsPage() {
  return <Stack gap='group'><CatalogHeader description='Native SVG visualizations using Bleecker-aligned contracts.' title='Charts' /><Card><SectionHeader title='Revenue trend' /><LineChart data={timeSeries} height={220} series={series} xAxisKey='month' /></Card><Card><SectionHeader title='Audience volume' /><AreaChart data={timeSeries} height={220} series={series} xAxisKey='month' /></Card><Card><SectionHeader title='Monthly comparison' /><BarChart data={timeSeries} height={220} series={series} xAxisKey='month' /></Card></Stack>;
}

function AdminPatternsPage() {
  const [selected, setSelected] = React.useState<string[]>([]);
  return <Stack gap='group'><CatalogHeader description='Production administration patterns extracted from Matteotti.' title='Admin Patterns' /><Card padding='none'><ResourceList items={[{ id: '1', metadata: 'published', status: { label: 'Published', variant: 'info' }, title: 'Ford launches the electric Fathom pickup' }, { id: '2', metadata: 'draft', status: { label: 'Draft' }, title: 'A shared component system reaches native' }, { id: '3', metadata: 'scheduled', status: { label: 'Scheduled', variant: 'warning' }, title: 'Tokens and contracts remain synchronized' }]} onItemLongPress={(item) => setSelected([item.id])} onSelectionChange={setSelected} scrollEnabled={false} selectedIds={selected} /></Card><Card><Stack><Heading level={3}>Schema form</Heading><SchemaForm fields={[{ label: 'Title', name: 'title', required: true, type: 'text' }, { label: 'Summary', name: 'summary', type: 'textarea' }, { label: 'Status', name: 'status', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }], type: 'select' }, { label: 'Featured', name: 'featured', type: 'boolean' }]} onSubmit={() => undefined} /></Stack></Card>{selected.length ? <View><Button onPress={() => setSelected([])} variant='destructive'>Clear selection</Button></View> : null}</Stack>;
}

export function CatalogPage({ route }: { route: Exclude<CatalogRoute, 'dashboard'> }) {
  if (route === 'typography') return <TypographyPage />;
  if (route === 'surfaces') return <SurfacesPage />;
  if (route === 'buttons') return <ButtonsPage />;
  if (route === 'forms') return <FormsPage />;
  if (route === 'feedback') return <FeedbackPage />;
  if (route === 'data-display') return <DataDisplayPage />;
  if (route === 'overlays') return <OverlaysPage />;
  if (route === 'navigation') return <NavigationPage />;
  if (route === 'charts') return <ChartsPage />;
  return <AdminPatternsPage />;
}
