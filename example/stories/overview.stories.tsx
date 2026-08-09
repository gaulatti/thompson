import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { useOpenCatalog } from '../.rnstorybook/catalog-navigation';

import {
  Alert,
  AvatarGroup,
  Button,
  Card,
  Heading,
  Metric,
  Progress,
  SectionHeader,
  Stack,
  StatusBadge,
  Text
} from '../../src';

function Overview() {
  const openCatalog = useOpenCatalog();
  return (
    <Stack gap='group'>
      <SectionHeader
        eyebrow='Bleecker × Thompson'
        title='The native system'
        description='React Native components driven by Bleecker’s shared contracts and design tokens.'
      />
      <Alert variant='info' title='One source of truth' description='Change foundations in Bleecker; verify native behavior here.' />
      <Stack horizontal gap='control'>
        <Card style={{ flex: 1 }}>
          <Text size='xs' tone='secondary'>Monthly volume</Text>
          <Metric format='compact' value={2480000} />
          <Progress size='sm' value={74} />
        </Card>
        <Card style={{ flex: 1 }}>
          <Text size='xs' tone='secondary'>Conversion</Text>
          <Metric format='percent' value={0.274} />
          <StatusBadge label='Healthy' variant='live' />
        </Card>
      </Stack>
      <Card variant='elevated'>
        <Stack gap='component'>
          <Stack gap='inline'>
            <Heading level={3}>Ready for a real app</Heading>
            <Text tone='secondary'>Forms, feedback, content, and actions share one warm, restrained visual language.</Text>
          </Stack>
          <AvatarGroup
            avatars={[
              { fallback: 'Ada Lovelace' },
              { fallback: 'Grace Hopper' },
              { fallback: 'Alan Turing' },
              { fallback: 'Katherine Johnson' },
              { fallback: 'Margaret Hamilton' }
            ]}
            max={4}
          />
          <Button fullWidth onPress={openCatalog}>Explore the catalog</Button>
        </Stack>
      </Card>
    </Stack>
  );
}

const meta = {
  title: 'Start Here/Overview',
  component: Overview
} satisfies Meta<typeof Overview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {};
