import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Button, Heading, IconButton, Stack, Text, Toggle } from '../../src';

function ActionsGallery() {
  const [bookmarked, setBookmarked] = React.useState(true);
  const [filtered, setFiltered] = React.useState(false);

  return (
    <Stack gap='group'>
      <Stack gap='control'>
        <Heading level={3}>Button sizes</Heading>
        <Stack horizontal gap='control' style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size='xs'>Extra small</Button>
          <Button size='sm'>Small</Button>
          <Button size='md'>Medium</Button>
          <Button size='lg'>Large</Button>
        </Stack>
      </Stack>
      <Stack gap='control'>
        <Heading level={3}>Operational states</Heading>
        <Stack horizontal gap='control' style={{ flexWrap: 'wrap' }}>
          <Button loading>Saving</Button>
          <Button disabled>Unavailable</Button>
          <Button variant='destructive'>Delete</Button>
        </Stack>
      </Stack>
      <Stack gap='control'>
        <Heading level={3}>Icon actions</Heading>
        <Stack horizontal gap='control' style={{ alignItems: 'center' }}>
          <IconButton accessibilityLabel='Add item' size='sm'><Text>＋</Text></IconButton>
          <IconButton accessibilityLabel='Edit item' variant='subtle'><Text>✎</Text></IconButton>
          <IconButton accessibilityLabel='More options' size='lg' variant='ghost'><Text size='lg'>•••</Text></IconButton>
          <IconButton accessibilityLabel='Disabled action' disabled><Text>×</Text></IconButton>
        </Stack>
      </Stack>
      <Stack gap='control'>
        <Heading level={3}>Toggle actions</Heading>
        <Stack horizontal gap='control'>
          <Toggle pressed={bookmarked} onPressedChange={setBookmarked} variant='outline'>Bookmark</Toggle>
          <Toggle pressed={filtered} onPressedChange={setFiltered}>Filter</Toggle>
          <Toggle disabled>Disabled</Toggle>
        </Stack>
      </Stack>
    </Stack>
  );
}

const meta = {
  title: 'Components/Actions',
  component: ActionsGallery
} satisfies Meta<typeof ActionsGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonsIconsAndToggles: Story = {};
