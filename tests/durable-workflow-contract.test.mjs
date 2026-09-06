import assert from 'node:assert/strict';
import test from 'node:test';

import {
  QUEUE_ITEM_STATES,
  canClaimDelivered,
  connectionMessage,
  formatAttempt,
  formatFreshness,
  formatRetryCountdown,
  isInFlightQueueState,
  isQueueItemState,
  isRetryDue,
  isRetryableQueueState,
  isTerminalQueueState,
  queueStateHint,
  queueStateLabel,
  queueStateTone,
  summarizePartialSuccess,
  summarizeQueue,
  summarizeQueueLabel
} from '../dist/components/durable-workflow-contract.js';

const NOW = '2026-09-06T12:00:00.000Z';

test('exposes the eight documented queue states with labels, hints, and tones', () => {
  assert.deepEqual([...QUEUE_ITEM_STATES], ['pending', 'active', 'retry-wait', 'failed', 'accepted', 'delivered', 'canceled', 'expired']);
  for (const state of QUEUE_ITEM_STATES) {
    assert.equal(typeof queueStateLabel(state), 'string');
    assert.equal(typeof queueStateHint(state), 'string');
    assert.ok(['neutral', 'progress', 'warning', 'danger', 'success', 'settled'].includes(queueStateTone(state)));
  }
  assert.equal(isQueueItemState('delivered'), true);
  assert.equal(isQueueItemState('shipped'), false);
});

test('state predicates classify lifecycle correctly', () => {
  assert.deepEqual(QUEUE_ITEM_STATES.filter(isTerminalQueueState), ['delivered', 'canceled', 'expired']);
  assert.deepEqual(QUEUE_ITEM_STATES.filter(isRetryableQueueState), ['retry-wait', 'failed']);
  assert.deepEqual(QUEUE_ITEM_STATES.filter(isInFlightQueueState), ['pending', 'active', 'retry-wait']);
});

test('terminology guard: only delivered work may be called delivered', () => {
  assert.equal(canClaimDelivered('delivered'), true);
  for (const state of QUEUE_ITEM_STATES.filter((value) => value !== 'delivered')) {
    assert.equal(canClaimDelivered(state), false);
  }
  assert.equal(queueStateLabel('accepted'), 'Accepted');
  assert.match(queueStateHint('accepted'), /not yet delivered/i);
});

test('summarizeQueue counts every group and derives inFlight and needsAttention', () => {
  const states = ['pending', 'pending', 'active', 'retry-wait', 'failed', 'accepted', 'delivered', 'canceled', 'expired'];
  const summary = summarizeQueue(states);
  assert.equal(summary.total, 9);
  assert.equal(summary.pending, 2);
  assert.equal(summary.inFlight, 4); // 2 pending + 1 active + 1 retry-wait
  assert.equal(summary.needsAttention, 1); // failed
  assert.equal(summarizeQueueLabel(summary), '2 pending · 1 syncing · 1 waiting to retry · 1 failed · 1 accepted · 1 delivered · 1 canceled · 1 expired');
});

test('summarizeQueueLabel reads empty queues plainly', () => {
  assert.equal(summarizeQueueLabel(summarizeQueue([])), 'Queue empty');
});

test('connectionMessage never claims sync while offline', () => {
  assert.equal(connectionMessage('online'), 'Online');
  assert.match(connectionMessage('offline'), /when you reconnect/);
  assert.equal(connectionMessage('reconnecting'), 'Reconnecting…');
});

test('formatFreshness buckets relative time and clamps clock skew', () => {
  assert.equal(formatFreshness('2026-09-06T11:59:30.000Z', NOW), 'just now');
  assert.equal(formatFreshness('2026-09-06T11:55:00.000Z', NOW), '5m ago');
  assert.equal(formatFreshness('2026-09-06T09:00:00.000Z', NOW), '3h ago');
  assert.equal(formatFreshness('2026-09-04T12:00:00.000Z', NOW), '2d ago');
  assert.equal(formatFreshness('2026-08-20T12:00:00.000Z', NOW), 'Aug 20');
  assert.equal(formatFreshness('2026-09-06T12:05:00.000Z', NOW), 'just now'); // future / skew
});

test('formatFreshness fails fast on unparseable timestamps', () => {
  assert.throws(() => formatFreshness('not-a-date', NOW), RangeError);
  assert.throws(() => formatFreshness(NOW, 'nope'), RangeError);
});

test('formatRetryCountdown and isRetryDue describe scheduled retries', () => {
  assert.equal(formatRetryCountdown('2026-09-06T12:00:12.000Z', NOW), 'Retrying in 12s');
  assert.equal(formatRetryCountdown('2026-09-06T12:03:00.000Z', NOW), 'Retrying in 3m');
  assert.equal(formatRetryCountdown('2026-09-06T13:00:00.000Z', NOW), 'Retrying in 1h');
  assert.equal(formatRetryCountdown('2026-09-06T11:59:00.000Z', NOW), 'Retrying now');
  assert.equal(isRetryDue('2026-09-06T11:59:00.000Z', NOW), true);
  assert.equal(isRetryDue('2026-09-06T12:01:00.000Z', NOW), false);
});

test('formatAttempt clamps and degrades gracefully', () => {
  assert.equal(formatAttempt({ attempt: 2, maxAttempts: 5 }), 'Attempt 2 of 5');
  assert.equal(formatAttempt({ attempt: 9, maxAttempts: 5 }), 'Attempt 5 of 5');
  assert.equal(formatAttempt({ attempt: 3, maxAttempts: Number.NaN }), 'Attempt 3');
  assert.equal(formatAttempt({ attempt: 0, maxAttempts: 5 }), '');
});

test('summarizePartialSuccess distinguishes full, partial, and total failure', () => {
  assert.equal(summarizePartialSuccess({ total: 0, succeeded: 0 }), 'Nothing to send');
  assert.equal(summarizePartialSuccess({ total: 15, succeeded: 15 }), 'All 15 done');
  assert.equal(summarizePartialSuccess({ total: 15, succeeded: 0 }), 'All 15 failed');
  assert.equal(summarizePartialSuccess({ total: 15, succeeded: 12 }), '12 of 15 done · 3 failed');
  assert.equal(summarizePartialSuccess({ total: 15, succeeded: 12, failed: 2 }), '12 of 15 done · 2 failed');
});
