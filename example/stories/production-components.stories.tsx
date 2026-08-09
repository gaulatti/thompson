import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView } from 'react-native';

import { Accordion, Button, DataTable, MediaGrid, Modal, Stack, Tabs, Text } from '../../src';

function ProductionComponents() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [tab, setTab] = React.useState('content');
  return <ScrollView contentContainerStyle={{ gap: 20, padding: 18 }}>
    <Tabs activeTab={tab} onChange={setTab} tabs={[{ id: 'content', label: 'Content' }, { id: 'media', label: 'Media' }, { id: 'settings', label: 'Settings' }]} variant='segmented' />
    <Accordion items={[{ id: 'publishing', title: 'Publishing', content: <Text tone='secondary'>Schedule and distribution settings.</Text> }, { id: 'metadata', title: 'Metadata', content: <Text tone='secondary'>Search and social metadata.</Text> }]} />
    <DataTable columns={[{ id: 'title', title: 'Title', width: 210 }, { id: 'status', title: 'Status', width: 110 }]} data={[{ id: '1', title: 'A shared component system reaches native', status: 'Published' }, { id: '2', title: 'Application shells that serve real products', status: 'Draft' }]} getRowId={(row) => row.id} />
    <MediaGrid items={[{ id: '1', source: { uri: 'https://picsum.photos/300/300?1' }, title: 'Newsroom' }, { id: '2', source: { uri: 'https://picsum.photos/300/300?2' }, title: 'Studio' }]} scrollEnabled={false} />
    <Button onPress={() => setModalOpen(true)}>Open modal</Button>
    <Modal footer={<Stack horizontal><Button variant='ghost' onPress={() => setModalOpen(false)}>Cancel</Button><Button onPress={() => setModalOpen(false)}>Continue</Button></Stack>} onOpenChange={setModalOpen} open={modalOpen} title='Confirm changes'><Text tone='secondary'>The centered modal remains available for focused confirmation flows.</Text></Modal>
  </ScrollView>;
}

const meta = { title: 'Components/Production Set', component: ProductionComponents, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof ProductionComponents>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {};
