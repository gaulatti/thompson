/**
 * Provider-neutral vocabulary for durable asynchronous workflows: offline
 * connectivity, a durable outbox, retry scheduling, partial success, conflict
 * resolution, and the distinction between work a server has *accepted* and work
 * it has *delivered*.
 *
 * Everything here is pure and presentational. It performs no persistence, no
 * networking, no background scheduling, and hardcodes no product copy, provider
 * name, or domain identifier. Consumers own all state and callbacks.
 */

export type ConnectionStatus = 'online' | 'offline' | 'reconnecting';

/**
 * Lifecycle of a single durable-queue item.
 *
 * - `pending`    queued locally, not yet attempted
 * - `active`     an attempt is in flight
 * - `retry-wait` an attempt failed and another is scheduled
 * - `failed`     attempts are exhausted or paused; needs a person
 * - `accepted`   the server acknowledged receipt but has not confirmed delivery
 * - `delivered`  the server confirmed the final product outcome
 * - `canceled`   withdrawn before completion
 * - `expired`    no longer eligible to run
 */
export type QueueItemState =
  | 'pending'
  | 'active'
  | 'retry-wait'
  | 'failed'
  | 'accepted'
  | 'delivered'
  | 'canceled'
  | 'expired';

export const QUEUE_ITEM_STATES: readonly QueueItemState[] = [
  'pending',
  'active',
  'retry-wait',
  'failed',
  'accepted',
  'delivered',
  'canceled',
  'expired'
] as const;

/** States that will not change again without a new consumer action. */
export const TERMINAL_QUEUE_STATES: readonly QueueItemState[] = ['delivered', 'canceled', 'expired'] as const;

/** States where the consumer may offer a retry. */
export const RETRYABLE_QUEUE_STATES: readonly QueueItemState[] = ['retry-wait', 'failed'] as const;

/** States where work is still moving toward completion. */
export const IN_FLIGHT_QUEUE_STATES: readonly QueueItemState[] = ['pending', 'active', 'retry-wait'] as const;

export type QueueStateTone = 'neutral' | 'progress' | 'warning' | 'danger' | 'success' | 'settled';

export function isQueueItemState(value: string): value is QueueItemState {
  return (QUEUE_ITEM_STATES as readonly string[]).includes(value);
}

export function isTerminalQueueState(state: QueueItemState): boolean {
  return (TERMINAL_QUEUE_STATES as readonly QueueItemState[]).includes(state);
}

export function isRetryableQueueState(state: QueueItemState): boolean {
  return (RETRYABLE_QUEUE_STATES as readonly QueueItemState[]).includes(state);
}

export function isInFlightQueueState(state: QueueItemState): boolean {
  return (IN_FLIGHT_QUEUE_STATES as readonly QueueItemState[]).includes(state);
}

/**
 * Terminology guard. Only a `delivered` item may be described to a person as
 * delivered; `accepted` means received, not delivered.
 */
export function canClaimDelivered(state: QueueItemState): boolean {
  return state === 'delivered';
}

const QUEUE_STATE_LABELS: Record<QueueItemState, string> = {
  pending: 'Pending',
  active: 'Syncing',
  'retry-wait': 'Retry scheduled',
  failed: 'Failed',
  accepted: 'Accepted',
  delivered: 'Delivered',
  canceled: 'Canceled',
  expired: 'Expired'
};

const QUEUE_STATE_HINTS: Record<QueueItemState, string> = {
  pending: 'Waiting to send',
  active: 'Sending now',
  'retry-wait': 'A new attempt is scheduled',
  failed: 'Needs your attention',
  accepted: 'Received, not yet delivered',
  delivered: 'Confirmed delivered',
  canceled: 'Withdrawn before completion',
  expired: 'No longer eligible to send'
};

const QUEUE_STATE_TONES: Record<QueueItemState, QueueStateTone> = {
  pending: 'neutral',
  active: 'progress',
  'retry-wait': 'warning',
  failed: 'danger',
  accepted: 'progress',
  delivered: 'success',
  canceled: 'settled',
  expired: 'warning'
};

export function queueStateLabel(state: QueueItemState): string {
  return QUEUE_STATE_LABELS[state];
}

export function queueStateHint(state: QueueItemState): string {
  return QUEUE_STATE_HINTS[state];
}

export function queueStateTone(state: QueueItemState): QueueStateTone {
  return QUEUE_STATE_TONES[state];
}

export interface QueueSummary {
  total: number;
  pending: number;
  active: number;
  retrying: number;
  failed: number;
  accepted: number;
  delivered: number;
  canceled: number;
  expired: number;
  /** `pending + active + retry-wait` — work still moving. */
  inFlight: number;
  /** `failed` — work a person must act on. */
  needsAttention: number;
}

export function summarizeQueue(states: readonly QueueItemState[]): QueueSummary {
  const summary: QueueSummary = {
    total: states.length,
    pending: 0,
    active: 0,
    retrying: 0,
    failed: 0,
    accepted: 0,
    delivered: 0,
    canceled: 0,
    expired: 0,
    inFlight: 0,
    needsAttention: 0
  };
  for (const state of states) {
    if (state === 'pending') summary.pending += 1;
    else if (state === 'active') summary.active += 1;
    else if (state === 'retry-wait') summary.retrying += 1;
    else if (state === 'failed') summary.failed += 1;
    else if (state === 'accepted') summary.accepted += 1;
    else if (state === 'delivered') summary.delivered += 1;
    else if (state === 'canceled') summary.canceled += 1;
    else if (state === 'expired') summary.expired += 1;
  }
  summary.inFlight = summary.pending + summary.active + summary.retrying;
  summary.needsAttention = summary.failed;
  return summary;
}

/**
 * Short human sentence for a {@link QueueSummary}. Names only the non-zero
 * groups; empty queues read as "Queue empty".
 */
export function summarizeQueueLabel(summary: QueueSummary): string {
  if (summary.total === 0) return 'Queue empty';
  const parts: string[] = [];
  if (summary.pending) parts.push(`${summary.pending} pending`);
  if (summary.active) parts.push(`${summary.active} syncing`);
  if (summary.retrying) parts.push(`${summary.retrying} waiting to retry`);
  if (summary.failed) parts.push(`${summary.failed} failed`);
  if (summary.accepted) parts.push(`${summary.accepted} accepted`);
  if (summary.delivered) parts.push(`${summary.delivered} delivered`);
  if (summary.canceled) parts.push(`${summary.canceled} canceled`);
  if (summary.expired) parts.push(`${summary.expired} expired`);
  return parts.join(' · ');
}

const CONNECTION_MESSAGES: Record<ConnectionStatus, string> = {
  online: 'Online',
  offline: 'Offline — changes will sync when you reconnect',
  reconnecting: 'Reconnecting…'
};

export function connectionMessage(status: ConnectionStatus): string {
  return CONNECTION_MESSAGES[status];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseInstant(iso: string, field: string): number {
  const value = Date.parse(iso);
  if (Number.isNaN(value)) throw new RangeError(`durable-workflow: ${field} is not a valid ISO timestamp: ${iso}`);
  return value;
}

/**
 * Relative freshness phrase for a timestamp, e.g. `just now`, `5m ago`,
 * `3h ago`, `2d ago`, or an absolute `Sep 4` once older than a week. Clock skew
 * that puts `asOf` ahead of `now` is clamped to `just now`. Throws on an
 * unparseable timestamp rather than guessing.
 */
export function formatFreshness(asOf: string, now: string): string {
  const asOfMs = parseInstant(asOf, 'asOf');
  const nowMs = parseInstant(now, 'now');
  const seconds = Math.max(0, Math.round((nowMs - asOfMs) / 1000));
  if (seconds < 45) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const date = new Date(asOfMs);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

/**
 * Countdown phrase for a scheduled retry, e.g. `Retrying now`, `Retrying in
 * 12s`, `Retrying in 3m`, `Retrying in 1h`. A time in the past reads as
 * `Retrying now`.
 */
export function formatRetryCountdown(nextRetryAt: string, now: string): string {
  const targetMs = parseInstant(nextRetryAt, 'nextRetryAt');
  const nowMs = parseInstant(now, 'now');
  const seconds = Math.round((targetMs - nowMs) / 1000);
  if (seconds <= 0) return 'Retrying now';
  if (seconds < 60) return `Retrying in ${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `Retrying in ${minutes}m`;
  const hours = Math.round(minutes / 60);
  return `Retrying in ${hours}h`;
}

/** Whether a scheduled retry time has arrived. */
export function isRetryDue(nextRetryAt: string, now: string): boolean {
  return parseInstant(nextRetryAt, 'nextRetryAt') <= parseInstant(now, 'now');
}

export interface AttemptProgress {
  attempt: number;
  maxAttempts: number;
}

/** `Attempt 2 of 5` style phrase; returns `''` when there is nothing useful to say. */
export function formatAttempt({ attempt, maxAttempts }: AttemptProgress): string {
  if (!Number.isFinite(attempt) || attempt < 1) return '';
  if (!Number.isFinite(maxAttempts) || maxAttempts < 1) return `Attempt ${attempt}`;
  return `Attempt ${Math.min(attempt, maxAttempts)} of ${maxAttempts}`;
}

export interface PartialSuccess {
  total: number;
  succeeded: number;
  failed: number;
}

/**
 * `12 of 15 done · 3 failed` style phrase describing a batch that partly
 * completed. `failed` is derived when omitted.
 */
export function summarizePartialSuccess(input: { total: number; succeeded: number; failed?: number }): string {
  const total = Math.max(0, Math.trunc(input.total));
  const succeeded = Math.max(0, Math.min(total, Math.trunc(input.succeeded)));
  const failed = input.failed === undefined ? total - succeeded : Math.max(0, Math.trunc(input.failed));
  if (total === 0) return 'Nothing to send';
  if (failed === 0) return `All ${total} done`;
  if (succeeded === 0) return `All ${total} failed`;
  return `${succeeded} of ${total} done · ${failed} failed`;
}
