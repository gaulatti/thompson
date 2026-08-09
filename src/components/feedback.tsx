import type { AlertType, LoadingSize } from '@gaulatti/bleecker/core';
import { radii, spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { useThompsonTheme } from '../theme';
import { Heading, Text } from './typography';

export type { AlertType } from '@gaulatti/bleecker/core';
export type { LoadingSize } from '@gaulatti/bleecker/core';

export interface LoadingSpinnerProps extends ViewProps {
  label?: string;
  size?: LoadingSize;
}

export function LoadingSpinner({ label, size = 'md', style, ...props }: LoadingSpinnerProps) {
  const { theme } = useThompsonTheme();
  return (
    <View accessibilityLabel={label} accessibilityRole='progressbar' style={[styles.spinner, style]} {...props}>
      <ActivityIndicator color={theme.colors.sea} size={size === 'sm' ? 'small' : 'large'} style={size === 'lg' && styles.spinnerLarge} />
      {label ? <Text size='sm' tone='secondary'>{label}</Text> : null}
    </View>
  );
}

export interface EmptyProps extends ViewProps {
  action?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
}

export function Empty({ action, description, icon, style, title, ...props }: EmptyProps) {
  const { theme } = useThompsonTheme();
  return (
    <View style={[styles.empty, { borderColor: theme.colors.border }, style]} {...props}>
      {icon}
      <Heading level={3}>{title}</Heading>
      {description ? <Text tone='secondary' style={styles.centered}>{description}</Text> : null}
      {action}
    </View>
  );
}

export interface ErrorStateProps extends Omit<EmptyProps, 'title'> {
  onRetry?: () => void;
  retryLabel?: string;
  title?: React.ReactNode;
}

export function ErrorState({ action, description = 'We couldn\'t load this data. Please try again.', onRetry, retryLabel = 'Try again', title = 'Something went wrong', ...props }: ErrorStateProps) {
  const retryAction = action ?? (onRetry ? <Pressable accessibilityRole='button' onPress={onRetry}><Text tone='accent' weight='600'>{retryLabel}</Text></Pressable> : undefined);
  return <Empty accessibilityLiveRegion='polite' action={retryAction} description={description} title={title} {...props} />;
}

export type AlertVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'error';

export interface AlertProps extends ViewProps {
  description?: React.ReactNode;
  duration?: number;
  message?: React.ReactNode;
  onClose?: () => void;
  title?: React.ReactNode;
  type?: AlertType;
  variant?: AlertVariant;
}

export function Alert({ description, duration = 0, message, onClose, style, title, type, variant = 'default', ...props }: AlertProps) {
  const { theme } = useThompsonTheme();
  React.useEffect(() => {
    if (!onClose || duration <= 0) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  const resolvedVariant: AlertVariant = type === 'error' ? 'error' : type ?? variant;
  const accent = {
    default: theme.colors.textSecondary,
    success: theme.colors.sea,
    warning: theme.colorScheme === 'dark' ? theme.colors.accentGold : theme.colors.sunset,
    destructive: theme.colors.destructive,
    error: theme.colors.destructive,
    info: theme.colorScheme === 'dark' ? theme.colors.accentGold : theme.colors.desert
  }[resolvedVariant];
  return (
    <View accessibilityRole='alert' style={[styles.alert, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderLeftColor: accent }, style]} {...props}>
      {title ? <Text weight='600'>{title}</Text> : null}
      {message ? <Text weight='500'>{message}</Text> : null}
      {description ? <Text size='sm' tone='secondary'>{description}</Text> : null}
      {onClose ? <Pressable accessibilityLabel='Close alert' accessibilityRole='button' hitSlop={10} onPress={onClose} style={styles.alertClose}><Text tone='secondary' weight='600'>×</Text></Pressable> : null}
    </View>
  );
}

export interface LoadingOverlayProps {
  label?: string;
  visible: boolean;
}

export function LoadingOverlay({ label = 'Loading...', visible }: LoadingOverlayProps) {
  const { theme } = useThompsonTheme();
  return (
    <Modal animationType='fade' presentationStyle='overFullScreen' transparent visible={visible}>
      <View accessibilityViewIsModal style={styles.overlay}>
        <View style={[styles.overlayCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, theme.shadows.overlay]}>
          <LoadingSpinner label={label} size='lg' />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  alert: { borderLeftWidth: 3, borderRadius: radii.card, borderWidth: 1, gap: spacing.detail, padding: spacing.component, position: 'relative' },
  alertClose: { position: 'absolute', right: spacing.inline, top: spacing.inline },
  centered: { textAlign: 'center' },
  empty: { alignItems: 'center', borderRadius: radii.card, borderWidth: 1, gap: spacing.control, justifyContent: 'center', padding: spacing.container },
  overlay: { alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.32)', flex: 1, justifyContent: 'center', padding: spacing.group },
  overlayCard: { borderRadius: radii.card, borderWidth: 1, paddingHorizontal: spacing.container, paddingVertical: spacing.group },
  spinner: { alignItems: 'center', flexDirection: 'row', gap: spacing.inline, justifyContent: 'center' },
  spinnerLarge: { transform: [{ scale: 1.25 }] }
});
