import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Button, Stack } from '../../src';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Continue',
    size: 'md',
    variant: 'primary'
  },
  argTypes: {
    onPress: { action: 'pressed' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'subtle', 'ghost', 'link', 'destructive'] }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
export const FullWidth: Story = { args: { fullWidth: true } };

export const AllVariants: Story = {
  render: () => (
    <Stack gap='control'>
      <Button variant='primary'>Primary</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='subtle'>Subtle</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button variant='link'>Link</Button>
      <Button variant='destructive'>Destructive</Button>
    </Stack>
  )
};
