import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Card, Heading, IconBadge, SectionHeader, Separator, Stack, StatusBadge, Text } from '../../src';

function SurfaceGallery() {
  return (
    <Stack gap='group'>
      <SectionHeader eyebrow='Foundations' title='Surface hierarchy' description='The same semantic variants as Bleecker, rendered natively.' />
      {(['surface', 'outlined', 'elevated', 'subtle', 'transparent'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <Stack gap='inline'>
            <StatusBadge label={variant} variant={variant === 'elevated' ? 'live' : 'default'} />
            <Heading level={4}>{variant[0].toUpperCase() + variant.slice(1)}</Heading>
            <Text tone='secondary'>Borders carry hierarchy; shadows are reserved for raised surfaces.</Text>
          </Stack>
        </Card>
      ))}
      <Stack horizontal gap='control'>
        <IconBadge variant='primary'><Text style={{ color: '#fff' }}>P</Text></IconBadge>
        <IconBadge variant='subtle'><Text tone='accent'>S</Text></IconBadge>
        <IconBadge variant='outlined'><Text>O</Text></IconBadge>
      </Stack>
    </Stack>
  );
}

const meta = {
  title: 'Foundations/Surfaces',
  component: SurfaceGallery
} satisfies Meta<typeof SurfaceGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {};

export const Cards: Story = {
  render: () => (
    <Stack gap='component'>
      {(['surface', 'outlined', 'elevated', 'subtle', 'transparent'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <Heading level={4}>{variant[0].toUpperCase() + variant.slice(1)}</Heading>
          <Text size='sm' tone='secondary'>A {variant} container.</Text>
        </Card>
      ))}
    </Stack>
  )
};

export const IconBadges: Story = {
  render: () => (
    <Stack gap='component'>
      {(['md', 'lg'] as const).map((size) => (
        <Stack key={size} horizontal gap='control' style={{ alignItems: 'center' }}>
          <IconBadge size={size} variant='primary'><Text style={{ color: '#fff' }}>P</Text></IconBadge>
          <IconBadge size={size} variant='subtle'><Text tone='accent'>S</Text></IconBadge>
          <IconBadge size={size} variant='outlined'><Text>O</Text></IconBadge>
        </Stack>
      ))}
    </Stack>
  )
};

export const LayoutPrimitives: Story = {
  render: () => (
    <Stack gap='group'>
      <Text>Stacks establish consistent rhythm.</Text>
      <Separator />
      <Stack horizontal gap='component'>
        <Card style={{ flex: 1 }}><Text>Left</Text></Card>
        <Separator orientation='vertical' />
        <Card style={{ flex: 1 }}><Text>Right</Text></Card>
      </Stack>
    </Stack>
  )
};
