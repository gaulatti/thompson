import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Button, Card, PageHeader, SectionHeader, Separator, Stack, Text } from '../../src';

function HeaderGallery() {
  return (
    <Stack gap='group'>
      <PageHeader
        breadcrumbs={<Text size='xs' tone='muted'>Workspace / Projects</Text>}
        title='Project overview'
        description='A page title, context, navigation, and a primary action.'
        onBack={() => undefined}
        actions={<Button size='sm'>New project</Button>}
      />
      <Separator />
      <SectionHeader eyebrow='Activity' title='Recent changes' description='Section headers establish hierarchy inside a page.' />
      <Card variant='subtle'>
        <Stack gap='inline'>
          <Text weight='600'>Native catalog created</Text>
          <Text size='sm' tone='secondary'>Thompson now mirrors Bleecker’s shared foundations.</Text>
        </Stack>
      </Card>
    </Stack>
  );
}

const meta = {
  title: 'Patterns/Headers',
  component: HeaderGallery
} satisfies Meta<typeof HeaderGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageAndSection: Story = {};
