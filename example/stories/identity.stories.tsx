import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Avatar, AvatarGroup, Card, Heading, Stack, StatusBadge, Text } from '../../src';

function IdentityGallery() {
  const people = [
    { fallback: 'Ada Lovelace' },
    { fallback: 'Grace Hopper' },
    { fallback: 'Alan Turing' },
    { fallback: 'Katherine Johnson' },
    { fallback: 'Margaret Hamilton' },
    { fallback: 'Edsger Dijkstra' }
  ];

  return (
    <Stack gap='group'>
      <Stack gap='control'>
        <Heading level={3}>Avatar scale</Heading>
        <Stack horizontal gap='control' style={{ alignItems: 'center' }}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => <Avatar key={size} fallback='Thompson Native' size={size} />)}
        </Stack>
      </Stack>
      <Stack gap='control'>
        <Heading level={3}>Groups and overflow</Heading>
        <AvatarGroup avatars={people} max={4} size='lg' />
      </Stack>
      <Card>
        <Stack gap='component'>
          <Text size='sm' tone='secondary'>Presence and operational status</Text>
          <Stack gap='control'>
            <StatusBadge label='Live' description='Connected now' variant='live' />
            <StatusBadge label='Offline' description='Last seen 12m ago' variant='offline' />
            <StatusBadge label='Warning' description='Needs attention' variant='warning' />
            <StatusBadge label='Information' variant='info' />
            <StatusBadge label='Draft' variant='default' />
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}

const meta = {
  title: 'Components/Identity',
  component: IdentityGallery
} satisfies Meta<typeof IdentityGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AvatarsAndStatus: Story = {};
