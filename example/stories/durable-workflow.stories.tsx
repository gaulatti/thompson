import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { ScrollView } from 'react-native';

import {
  ConflictChoice,
  ConnectionBanner,
  DurableQueuePanel,
  FreshnessStamp,
  PartialSuccessNotice,
  QueueRow,
  QueueSummaryBar,
  RetryAction,
  Stack,
  Text,
  type DurableQueueItem,
  type QueueItemState
} from '../../src';

/** Fixed clock so relative labels render deterministically in fixtures. */
const NOW = '2026-09-06T12:00:00.000Z';

const ALL_STATES: QueueItemState[] = ['pending', 'active', 'retry-wait', 'failed', 'accepted', 'delivered', 'canceled', 'expired'];

const QUEUE: DurableQueueItem[] = [
  { id: '1', title: 'Field notes — river access', description: 'Draft edited offline', state: 'pending' },
  { id: '2', title: 'Photo set (12)', state: 'active', attempt: 1, maxAttempts: 5 },
  { id: '3', title: 'Interview audio', state: 'retry-wait', attempt: 2, maxAttempts: 5, nextRetryAt: '2026-09-06T12:00:40.000Z' },
  { id: '4', title: 'Location correction', description: 'Server rejected the change', state: 'failed', attempt: 5, maxAttempts: 5 },
  { id: '5', title: 'Morning summary', state: 'accepted' },
  { id: '6', title: 'Yesterday’s recap', state: 'delivered' }
];

function Gallery() {
  return (
    <ScrollView contentContainerStyle={{ gap: 20, padding: 18 }}>
      <Text weight='600'>Connection</Text>
      <Stack gap='detail'>
        <ConnectionBanner status='offline' hideWhenOnline={false} onReconnect={() => undefined} />
        <ConnectionBanner status='reconnecting' hideWhenOnline={false} />
        <ConnectionBanner status='online' hideWhenOnline={false} />
      </Stack>

      <Text weight='600'>Freshness</Text>
      <Stack gap='detail'>
        <FreshnessStamp asOf='2026-09-06T11:59:40.000Z' now={NOW} />
        <FreshnessStamp asOf='2026-09-06T09:00:00.000Z' now={NOW} />
        <FreshnessStamp asOf='2026-08-20T12:00:00.000Z' now={NOW} />
      </Stack>

      <Text weight='600'>Queue summary</Text>
      <QueueSummaryBar states={QUEUE.map((item) => item.state)} />

      <Text weight='600'>Every queue-row state</Text>
      <Stack gap='detail'>
        {ALL_STATES.map((state) => (
          <QueueRow
            key={state}
            attempt={state === 'retry-wait' || state === 'failed' ? 3 : undefined}
            maxAttempts={5}
            nextRetryAt={state === 'retry-wait' ? '2026-09-06T12:00:30.000Z' : undefined}
            now={NOW}
            onCancel={() => undefined}
            onRetry={() => undefined}
            state={state}
            title={`Item — ${state}`}
          />
        ))}
      </Stack>

      <Text weight='600'>Retry action</Text>
      <Stack gap='detail'>
        <RetryAction attempt={2} maxAttempts={5} now={NOW} onRetry={() => undefined} />
        <RetryAction attempt={3} maxAttempts={5} nextRetryAt='2026-09-06T12:01:00.000Z' now={NOW} onRetry={() => undefined} />
      </Stack>

      <Text weight='600'>Partial success</Text>
      <Stack gap='detail'>
        <PartialSuccessNotice succeeded={12} total={15} onRetryFailed={() => undefined} />
        <PartialSuccessNotice succeeded={15} total={15} />
      </Stack>

      <Text weight='600'>Conflict</Text>
      <ConflictChoice onKeepLocal={() => undefined} onKeepRemote={() => undefined} onMerge={() => undefined} />
    </ScrollView>
  );
}

const meta = {
  title: 'Patterns/Durable Workflow',
  component: Gallery
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const OutboxPanel: Story = {
  render: () => (
    <ScrollView contentContainerStyle={{ padding: 18 }}>
      <DurableQueuePanel
        asOf='2026-09-06T11:57:00.000Z'
        connection='offline'
        items={QUEUE}
        now={NOW}
        onCancel={() => undefined}
        onReconnect={() => undefined}
        onRetry={() => undefined}
      />
    </ScrollView>
  )
};

export const ReducedMotion: Story = {
  render: () => (
    <ScrollView contentContainerStyle={{ gap: 12, padding: 18 }}>
      <Text tone='secondary'>
        The active-item indicator falls back to a static dot when the OS "reduce motion" setting is on. No component uses
        custom motion elsewhere.
      </Text>
      <QueueRow now={NOW} state='active' title='Photo set (12)' attempt={1} maxAttempts={5} />
    </ScrollView>
  )
};
