import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Card, Heading, Metric, Progress, Stack, Text } from '../../src';

function DataDisplayGallery() {
  return (
    <Stack gap='group'>
      <Stack horizontal gap='control'>
        <Card style={{ flex: 1 }}><Text size='xs' tone='secondary'>Revenue</Text><Metric currency='USD' format='currency' value={12842.5} /></Card>
        <Card style={{ flex: 1 }}><Text size='xs' tone='secondary'>Audience</Text><Metric format='compact' value={2480000} /></Card>
      </Stack>
      <Card variant='elevated'>
        <Stack gap='component'>
          <Heading level={3}>Goal progress</Heading>
          <Progress showLabel size='sm' value={24} />
          <Progress showLabel value={58} variant='success' />
          <Progress showLabel size='lg' value={76} variant='warning' />
          <Progress showLabel value={92} variant='destructive' />
        </Stack>
      </Card>
      <Stack horizontal gap='group' style={{ flexWrap: 'wrap' }}>
        <Stack><Text size='xs' tone='secondary'>Percent</Text><Metric format='percent' value={0.274} /></Stack>
        <Stack><Text size='xs' tone='secondary'>Custom</Text><Metric prefix='~' suffix=' ms' value={82.4} decimals={1} /></Stack>
      </Stack>
    </Stack>
  );
}

const meta = {
  title: 'Components/Data Display',
  component: DataDisplayGallery
} satisfies Meta<typeof DataDisplayGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MetricsAndProgress: Story = {};
