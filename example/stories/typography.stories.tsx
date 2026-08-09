import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Heading, Metric, Stack, Text } from '../../src';

function TypographyGallery() {
  return (
    <Stack gap='component'>
      <Heading level={1}>Heading one</Heading>
      <Heading level={2}>Heading two</Heading>
      <Heading level={3}>Heading three</Heading>
      <Heading level={4}>Heading four</Heading>
      <Text>Primary body copy balances density and readability.</Text>
      <Text tone='secondary'>Secondary text is quieter without losing contrast.</Text>
      <Text tone='danger'>Destructive and error text.</Text>
      <Metric format='currency' value={12842.5} />
      <Metric format='compact' value={2480000} />
      <Metric format='percent' value={0.274} />
    </Stack>
  );
}

const meta = {
  title: 'Foundations/Typography',
  component: TypographyGallery
} satisfies Meta<typeof TypographyGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
