import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Alert, Button, Empty, ErrorState, LoadingOverlay, LoadingSpinner, Progress, Skeleton, SkeletonCard, Stack } from '../../src';

function FeedbackGallery() {
  return (
    <Stack gap='group'>
      <Alert message='Your changes have been saved.' type='success' />
      <Alert message='Check the highlighted fields.' type='error' />
      <Progress showLabel value={68} />
      <Progress showLabel value={42} variant='warning' />
      <LoadingSpinner label='Loading dashboard' />
      <SkeletonCard rows={2} />
      <Empty title='No projects yet' description='Create a project to start organizing your work.' action={<Button size='sm'>Create project</Button>} />
      <ErrorState onRetry={() => undefined} />
    </Stack>
  );
}

const meta = {
  title: 'Components/Feedback',
  component: FeedbackGallery
} satisfies Meta<typeof FeedbackGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {};

export const Alerts: Story = {
  render: () => (
    <Stack gap='control'>
      <Alert title='Default' description='A neutral message for general context.' />
      <Alert title='Saved' description='Your changes are live.' variant='success' />
      <Alert title='Check this' description='This action may need attention.' variant='warning' />
      <Alert title='Could not save' description='Review the form and try again.' variant='destructive' />
      <Alert title='Did you know?' description='Native and web share the same foundations.' variant='info' />
    </Stack>
  )
};

export const Loading: Story = {
  render: () => (
    <Stack gap='group'>
      <LoadingSpinner label='Loading dashboard' />
      <Skeleton height={48} />
      <SkeletonCard rows={4} />
    </Stack>
  )
};

export const EmptyState: Story = {
  render: () => <Empty title='No projects yet' description='Create a project to begin organizing your work.' action={<Button size='sm'>Create project</Button>} />
};

export const Error: Story = {
  render: () => <ErrorState onRetry={() => undefined} />
};

function OverlayDemo() {
  const [visible, setVisible] = React.useState(false);
  return (
    <>
      <Button onPress={() => setVisible(true)}>Show loading overlay</Button>
      <LoadingOverlay label='Syncing with Bleecker…' visible={visible} />
      {visible ? <Button variant='ghost' onPress={() => setVisible(false)}>Hide overlay</Button> : null}
    </>
  );
}

export const Overlay: Story = { render: () => <OverlayDemo /> };
