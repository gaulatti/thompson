import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';

import {
  Button,
  Card,
  FilterSheet,
  PageHeader,
  RelationshipField,
  ResourceList,
  SchemaForm,
  SelectionBar,
  Stack,
  Text,
  type RelationshipOption
} from '../../src';

const relationshipOptions: RelationshipOption[] = [
  { id: '1', label: 'World desk', description: 'International reporting' },
  { id: '2', label: 'Technology desk', description: 'Products, policy, and platforms' },
  { id: '3', label: 'Culture desk', description: 'Arts and criticism' }
];

function AdminPatternsGallery() {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [relationships, setRelationships] = React.useState<RelationshipOption[]>([]);
  return <ScrollView contentContainerStyle={{ gap: 20, padding: 18 }} keyboardShouldPersistTaps='handled'>
    <PageHeader actions={<Button size='sm' variant='outline' onPress={() => setFiltersOpen(true)}>Filters</Button>} description='Reusable application patterns extracted from production mobile administration.' title='Articles' />
    {selected.length ? <SelectionBar count={selected.length} onCancel={() => setSelected([])} primaryAction={<Button size='sm' variant='destructive'>Delete</Button>} /> : null}
    <Card padding='none'>
      <ResourceList
        items={[
          { id: '1', metadata: 'published', status: { label: 'Published', variant: 'info' }, title: 'Ford launches the electric Fathom pickup' },
          { id: '2', metadata: 'draft', status: { label: 'Draft' }, title: 'A shared component system reaches native' },
          { id: '3', metadata: 'scheduled', status: { label: 'Scheduled', variant: 'warning' }, title: 'Tokens and contracts remain synchronized' }
        ]}
        onItemLongPress={(item) => setSelected([item.id])}
        onSelectionChange={setSelected}
        scrollEnabled={false}
        selectedIds={selected}
      />
    </Card>
    <Card>
      <Stack>
        <Text size='lg' weight='600'>Schema form</Text>
        <SchemaForm
          fields={[
            { label: 'Title', name: 'title', required: true, type: 'text' },
            { label: 'Summary', name: 'summary', type: 'textarea' },
            { label: 'Status', name: 'status', options: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }], type: 'select' },
            { label: 'Featured', name: 'featured', type: 'boolean' }
          ]}
          onSubmit={() => undefined}
        />
      </Stack>
    </Card>
    <Card>
      <Stack><Text size='lg' weight='600'>Relationship field</Text><RelationshipField loadOptions={async (query) => relationshipOptions.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))} multiple onChange={setRelationships} value={relationships} /></Stack>
    </Card>
    <FilterSheet activeCount={1} onClear={() => undefined} onOpenChange={setFiltersOpen} open={filtersOpen}><View style={{ gap: 12 }}><Text weight='600'>Status</Text><Text tone='secondary'>Filter controls are presented in a native bottom sheet.</Text></View></FilterSheet>
  </ScrollView>;
}

const meta = { title: 'Patterns/Admin', component: AdminPatternsGallery, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof AdminPatternsGallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Gallery: Story = {};
