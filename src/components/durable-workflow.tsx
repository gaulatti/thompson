/**
 * Controlled, presentational primitives for durable asynchronous workflows.
 *
 * These components render offline state, a durable outbox, retry state,
 * conflicts, partial success, and the accepted-versus-delivered distinction.
 * They own no persistence, networking, background jobs, or product retry
 * policy: every value and callback is supplied by the consumer. See
 * {@link ./durable-workflow-contract} for the shared vocabulary and the
 * terminology guard that keeps *accepted* work from being called *delivered*.
 */
import { radii, spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { AccessibilityInfo, ActivityIndicator, Animated, Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { useThompsonTheme } from '../theme';
import { Stack } from './layout';
import { Text } from './typography';
import {
  connectionMessage,
  formatAttempt,
  formatFreshness,
  formatRetryCountdown,
  isRetryDue,
  queueStateHint,
  queueStateLabel,
  queueStateTone,
  summarizePartialSuccess,
  summarizeQueue,
  summarizeQueueLabel,
  type ConnectionStatus,
  type QueueItemState,
  type QueueStateTone,
  type QueueSummary
} from './durable-workflow-contract';

/* -------------------------------------------------------------------------- */
/* Hooks                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A steadily updating ISO timestamp for keeping relative labels fresh. Pass
 * `intervalMs <= 0` to freeze it (useful in tests and stories).
 */
export function useNow(intervalMs = 30_000): string {
  const [now, setNow] = React.useState(() => new Date().toISOString());
  React.useEffect(() => {
    if (intervalMs <= 0) return;
    const id = setInterval(() => setNow(new Date().toISOString()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** Tracks the OS "reduce motion" accessibility preference. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduced(value);
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduced;
}

/* -------------------------------------------------------------------------- */
/* Shared theming                                                              */
/* -------------------------------------------------------------------------- */

function useToneColor(): (tone: QueueStateTone) => string {
  const { theme } = useThompsonTheme();
  return (tone) =>
    ({
      neutral: theme.colors.textSecondary,
      progress: theme.colors.sea,
      warning: theme.colorScheme === 'dark' ? theme.colors.accentGold : theme.colors.sunset,
      danger: theme.colors.destructive,
      success: '#10b981',
      settled: theme.colors.mutedForeground
    })[tone];
}

/* -------------------------------------------------------------------------- */
/* Connection banner                                                           */
/* -------------------------------------------------------------------------- */

export interface ConnectionBannerProps extends Omit<ViewProps, 'children'> {
  status: ConnectionStatus;
  /** Optional manual "try now" affordance while offline or reconnecting. */
  onReconnect?: () => void;
  reconnectLabel?: string;
  /** Hide entirely when online. Defaults to `true`. */
  hideWhenOnline?: boolean;
}

export function ConnectionBanner({
  status,
  onReconnect,
  reconnectLabel = 'Try now',
  hideWhenOnline = true,
  style,
  ...props
}: ConnectionBannerProps) {
  const { theme } = useThompsonTheme();
  const toneColor = useToneColor();
  if (status === 'online' && hideWhenOnline) return null;
  const tone: QueueStateTone = status === 'offline' ? 'warning' : status === 'reconnecting' ? 'progress' : 'success';
  const color = toneColor(tone);
  const message = connectionMessage(status);
  return (
    <View
      accessibilityLiveRegion='polite'
      accessibilityRole={status === 'online' ? 'text' : 'alert'}
      accessibilityLabel={message}
      style={[styles.banner, { backgroundColor: `${color}18`, borderColor: `${color}40` }, style]}
      {...props}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text size='sm' weight='500' style={styles.bannerText}>
        {message}
      </Text>
      {status !== 'online' && onReconnect ? (
        <Pressable accessibilityRole='button' hitSlop={8} onPress={onReconnect}>
          <Text size='sm' tone='accent' weight='600'>
            {reconnectLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Freshness stamp                                                             */
/* -------------------------------------------------------------------------- */

export interface FreshnessStampProps extends Omit<ViewProps, 'children'> {
  /** ISO timestamp of the data the consumer is showing. */
  asOf: string;
  /** ISO "now"; defaults to a self-updating clock. */
  now?: string;
  prefix?: string;
}

export function FreshnessStamp({ asOf, now, prefix = 'Updated', style, ...props }: FreshnessStampProps) {
  const liveNow = useNow();
  const phrase = formatFreshness(asOf, now ?? liveNow);
  const label = `${prefix} ${phrase}`;
  return (
    <View accessibilityLabel={label} style={[styles.stampRow, style]} {...props}>
      <Text size='xs' tone='muted'>
        {label}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Queue summary                                                               */
/* -------------------------------------------------------------------------- */

export interface QueueSummaryBarProps extends Omit<ViewProps, 'children'> {
  /** Either the raw item states, or a pre-computed summary. */
  states?: readonly QueueItemState[];
  summary?: QueueSummary;
}

export function QueueSummaryBar({ states, summary, style, ...props }: QueueSummaryBarProps) {
  const { theme } = useThompsonTheme();
  const toneColor = useToneColor();
  const resolved = summary ?? summarizeQueue(states ?? []);
  const label = summarizeQueueLabel(resolved);
  const chips: Array<{ key: string; count: number; tone: QueueStateTone }> = [
    { key: 'pending', count: resolved.pending, tone: queueStateTone('pending') },
    { key: 'syncing', count: resolved.active, tone: queueStateTone('active') },
    { key: 'retrying', count: resolved.retrying, tone: queueStateTone('retry-wait') },
    { key: 'failed', count: resolved.failed, tone: queueStateTone('failed') },
    { key: 'accepted', count: resolved.accepted, tone: queueStateTone('accepted') },
    { key: 'delivered', count: resolved.delivered, tone: queueStateTone('delivered') }
  ].filter((chip) => chip.count > 0);
  return (
    <View
      accessible
      accessibilityRole='text'
      accessibilityLabel={`Queue: ${label}`}
      style={[styles.summary, { borderColor: theme.colors.border }, style]}
      {...props}
    >
      <Text size='sm' weight='600'>
        {label}
      </Text>
      {chips.length ? (
        <View style={styles.chipRow}>
          {chips.map((chip) => {
            const color = toneColor(chip.tone);
            return (
              <View key={chip.key} style={[styles.chip, { backgroundColor: `${color}18`, borderColor: `${color}40` }]}>
                <Text size='xs' weight='600' style={{ color }}>
                  {chip.count} {chip.key}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Retry action                                                                */
/* -------------------------------------------------------------------------- */

export interface RetryActionProps {
  onRetry: () => void;
  /** ISO time the next attempt is scheduled for; disables the control until due. */
  nextRetryAt?: string;
  now?: string;
  attempt?: number;
  maxAttempts?: number;
  label?: string;
  disabled?: boolean;
}

export function RetryAction({ onRetry, nextRetryAt, now, attempt, maxAttempts, label = 'Retry now', disabled = false }: RetryActionProps) {
  const liveNow = useNow(1_000);
  const effectiveNow = now ?? liveNow;
  const waiting = nextRetryAt !== undefined && !isRetryDue(nextRetryAt, effectiveNow);
  const isDisabled = disabled || waiting;
  const countdown = nextRetryAt !== undefined ? formatRetryCountdown(nextRetryAt, effectiveNow) : '';
  const attemptText = attempt !== undefined ? formatAttempt({ attempt, maxAttempts: maxAttempts ?? Number.NaN }) : '';
  const hint = [waiting ? countdown : '', attemptText].filter(Boolean).join(' · ');
  return (
    <View style={styles.retryRow}>
      <Pressable
        accessibilityLabel={hint ? `${label}. ${hint}` : label}
        accessibilityRole='button'
        accessibilityState={{ disabled: isDisabled }}
        disabled={isDisabled}
        hitSlop={8}
        onPress={onRetry}
        style={styles.retryButton}
      >
        <Text size='sm' tone={isDisabled ? 'muted' : 'accent'} weight='600'>
          {label}
        </Text>
      </Pressable>
      {hint ? (
        <Text size='xs' tone='secondary'>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Queue row                                                                   */
/* -------------------------------------------------------------------------- */

export interface QueueRowProps extends Omit<ViewProps, 'children'> {
  title: string;
  description?: string;
  state: QueueItemState;
  attempt?: number;
  maxAttempts?: number;
  nextRetryAt?: string;
  now?: string;
  onRetry?: () => void;
  onCancel?: () => void;
  cancelLabel?: string;
}

export function QueueRow({
  title,
  description,
  state,
  attempt,
  maxAttempts,
  nextRetryAt,
  now,
  onRetry,
  onCancel,
  cancelLabel = 'Cancel',
  style,
  ...props
}: QueueRowProps) {
  const { theme } = useThompsonTheme();
  const toneColor = useToneColor();
  const reducedMotion = useReducedMotion();
  const color = toneColor(queueStateTone(state));
  const stateLabel = queueStateLabel(state);
  const hint = queueStateHint(state);
  const attemptText = attempt !== undefined ? formatAttempt({ attempt, maxAttempts: maxAttempts ?? Number.NaN }) : '';
  const showRetry = onRetry && (state === 'failed' || state === 'retry-wait');
  const showCancel = onCancel && (state === 'pending' || state === 'retry-wait' || state === 'failed');

  const pulse = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (state !== 'active' || reducedMotion) {
      pulse.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 600, useNativeDriver: true })
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse, reducedMotion, state]);
  const dotOpacity = state === 'active' && !reducedMotion ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }) : 1;

  return (
    <View
      accessible
      accessibilityLabel={[title, stateLabel, hint, attemptText, description].filter(Boolean).join('. ')}
      style={[styles.row, { borderColor: theme.colors.border }, style]}
      {...props}
    >
      <View style={styles.rowMain}>
        <View style={styles.rowStatus}>
          {state === 'active' ? (
            <ActivityIndicator color={color} size='small' />
          ) : (
            <Animated.View style={[styles.dot, { backgroundColor: color, opacity: dotOpacity }]} />
          )}
        </View>
        <View style={styles.rowBody}>
          <Text numberOfLines={1} weight='600'>
            {title}
          </Text>
          <Text size='xs' style={{ color }} weight='600'>
            {stateLabel}
            {attemptText ? ` · ${attemptText}` : ''}
          </Text>
          {description ? (
            <Text numberOfLines={2} size='sm' tone='secondary'>
              {description}
            </Text>
          ) : (
            <Text size='xs' tone='muted'>
              {hint}
            </Text>
          )}
        </View>
      </View>
      {showRetry || showCancel ? (
        <View style={styles.rowActions}>
          {showRetry ? (
            <RetryAction
              attempt={attempt}
              maxAttempts={maxAttempts}
              nextRetryAt={nextRetryAt}
              now={now}
              onRetry={onRetry}
            />
          ) : null}
          {showCancel ? (
            <Pressable accessibilityRole='button' hitSlop={8} onPress={onCancel}>
              <Text size='sm' tone='muted' weight='600'>
                {cancelLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Partial success                                                             */
/* -------------------------------------------------------------------------- */

export interface PartialSuccessNoticeProps extends Omit<ViewProps, 'children'> {
  total: number;
  succeeded: number;
  failed?: number;
  onRetryFailed?: () => void;
  retryLabel?: string;
}

export function PartialSuccessNotice({
  total,
  succeeded,
  failed,
  onRetryFailed,
  retryLabel = 'Retry failed',
  style,
  ...props
}: PartialSuccessNoticeProps) {
  const { theme } = useThompsonTheme();
  const toneColor = useToneColor();
  const resolvedFailed = failed === undefined ? Math.max(0, total - succeeded) : failed;
  const message = summarizePartialSuccess({ total, succeeded, failed });
  const tone: QueueStateTone = resolvedFailed === 0 ? 'success' : succeeded === 0 ? 'danger' : 'warning';
  const color = toneColor(tone);
  return (
    <View
      accessibilityLiveRegion='polite'
      accessibilityRole='alert'
      accessibilityLabel={message}
      style={[styles.notice, { backgroundColor: `${color}14`, borderColor: `${color}40` }, style]}
      {...props}
    >
      <Text size='sm' weight='600'>
        {message}
      </Text>
      {resolvedFailed > 0 && onRetryFailed ? (
        <Pressable accessibilityRole='button' hitSlop={8} onPress={onRetryFailed}>
          <Text size='sm' tone='accent' weight='600'>
            {retryLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Conflict choice                                                             */
/* -------------------------------------------------------------------------- */

export interface ConflictChoiceProps extends Omit<ViewProps, 'children'> {
  title?: string;
  description?: string;
  onKeepLocal: () => void;
  onKeepRemote: () => void;
  onMerge?: () => void;
  keepLocalLabel?: string;
  keepRemoteLabel?: string;
  mergeLabel?: string;
}

export function ConflictChoice({
  title = 'This item changed in two places',
  description = 'Choose which version to keep. The other version will be discarded.',
  onKeepLocal,
  onKeepRemote,
  onMerge,
  keepLocalLabel = 'Keep mine',
  keepRemoteLabel = 'Keep theirs',
  mergeLabel = 'Merge',
  style,
  ...props
}: ConflictChoiceProps) {
  const { theme } = useThompsonTheme();
  const toneColor = useToneColor();
  const color = toneColor('warning');
  return (
    <View
      accessibilityRole='alert'
      style={[styles.conflict, { backgroundColor: theme.colors.card, borderColor: `${color}40`, borderLeftColor: color }, style]}
      {...props}
    >
      <Text weight='600'>{title}</Text>
      <Text size='sm' tone='secondary'>
        {description}
      </Text>
      <View style={styles.conflictActions}>
        <Pressable accessibilityRole='button' onPress={onKeepLocal} style={[styles.conflictButton, { borderColor: theme.colors.border }]}>
          <Text size='sm' weight='600'>
            {keepLocalLabel}
          </Text>
        </Pressable>
        <Pressable accessibilityRole='button' onPress={onKeepRemote} style={[styles.conflictButton, { borderColor: theme.colors.border }]}>
          <Text size='sm' weight='600'>
            {keepRemoteLabel}
          </Text>
        </Pressable>
        {onMerge ? (
          <Pressable accessibilityRole='button' onPress={onMerge} style={[styles.conflictButton, { borderColor: theme.colors.border }]}>
            <Text size='sm' weight='600'>
              {mergeLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Delivery status                                                             */
/* -------------------------------------------------------------------------- */

export interface DeliveryStatusProps extends Omit<ViewProps, 'children'> {
  state: QueueItemState;
  /** ISO time the server acknowledged receipt. */
  acceptedAt?: string;
  /** ISO time the server confirmed final delivery. */
  deliveredAt?: string;
  now?: string;
}

/**
 * Renders the accepted-versus-delivered distinction explicitly so a consumer
 * never presents merely accepted work as delivered.
 */
export function DeliveryStatus({ state, acceptedAt, deliveredAt, now, style, ...props }: DeliveryStatusProps) {
  const liveNow = useNow();
  const effectiveNow = now ?? liveNow;
  const toneColor = useToneColor();
  const color = toneColor(queueStateTone(state));
  const primary = queueStateLabel(state);
  const detail =
    state === 'delivered' && deliveredAt
      ? `Delivered ${formatFreshness(deliveredAt, effectiveNow)}`
      : state === 'accepted' && acceptedAt
        ? `Accepted ${formatFreshness(acceptedAt, effectiveNow)} — not yet delivered`
        : queueStateHint(state);
  return (
    <View
      accessible
      accessibilityLabel={`${primary}. ${detail}`}
      style={[styles.delivery, style]}
      {...props}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.deliveryBody}>
        <Text size='sm' weight='600' style={{ color }}>
          {primary}
        </Text>
        <Text size='xs' tone='secondary'>
          {detail}
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Composed panel                                                              */
/* -------------------------------------------------------------------------- */

export interface DurableQueueItem {
  id: string;
  title: string;
  description?: string;
  state: QueueItemState;
  attempt?: number;
  maxAttempts?: number;
  nextRetryAt?: string;
}

export interface DurableQueuePanelProps extends Omit<ViewProps, 'children'> {
  connection: ConnectionStatus;
  asOf?: string;
  now?: string;
  items: readonly DurableQueueItem[];
  onReconnect?: () => void;
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
}

/** Convenience composition of the primitives for the common "outbox" screen. */
export function DurableQueuePanel({
  connection,
  asOf,
  now,
  items,
  onReconnect,
  onRetry,
  onCancel,
  style,
  ...props
}: DurableQueuePanelProps) {
  const states = React.useMemo(() => items.map((item) => item.state), [items]);
  return (
    <Stack gap='control' style={style} {...props}>
      <ConnectionBanner status={connection} onReconnect={onReconnect} />
      {asOf ? <FreshnessStamp asOf={asOf} now={now} /> : null}
      <QueueSummaryBar states={states} />
      <Stack gap='detail'>
        {items.map((item) => (
          <QueueRow
            key={item.id}
            attempt={item.attempt}
            description={item.description}
            maxAttempts={item.maxAttempts}
            nextRetryAt={item.nextRetryAt}
            now={now}
            onCancel={onCancel ? () => onCancel(item.id) : undefined}
            onRetry={onRetry ? () => onRetry(item.id) : undefined}
            state={item.state}
            title={item.title}
          />
        ))}
      </Stack>
    </Stack>
  );
}

const styles = StyleSheet.create({
  banner: { alignItems: 'center', borderRadius: radii.ui, borderWidth: 1, flexDirection: 'row', gap: spacing.inline, paddingHorizontal: spacing.control, paddingVertical: spacing.detail },
  bannerText: { flex: 1 },
  chip: { borderRadius: radii.pill, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.detail },
  conflict: { borderLeftWidth: 3, borderRadius: radii.card, borderWidth: 1, gap: spacing.detail, padding: spacing.component },
  conflictActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.detail, marginTop: spacing.detail },
  conflictButton: { borderRadius: radii.ui, borderWidth: 1, paddingHorizontal: spacing.control, paddingVertical: spacing.detail },
  delivery: { alignItems: 'center', flexDirection: 'row', gap: spacing.inline },
  deliveryBody: { flex: 1, gap: 2 },
  dot: { borderRadius: radii.pill, height: 8, width: 8 },
  notice: { borderRadius: radii.card, borderWidth: 1, gap: spacing.detail, padding: spacing.component },
  retryButton: { alignSelf: 'flex-start' },
  retryRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.inline },
  row: { borderRadius: radii.card, borderWidth: 1, gap: spacing.detail, padding: spacing.control },
  rowActions: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.control },
  rowBody: { flex: 1, gap: 2 },
  rowMain: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.control },
  rowStatus: { alignItems: 'center', justifyContent: 'center', minHeight: 20, minWidth: 20 },
  stampRow: { flexDirection: 'row' },
  summary: { borderRadius: radii.card, borderWidth: 1, gap: spacing.detail, padding: spacing.control }
});
