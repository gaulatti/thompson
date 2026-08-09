import { spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './typography';

export interface FieldProps extends ViewProps {
  children: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  label?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
}

export function Field({ children, description, error, label, optional = false, required = false, style, ...props }: FieldProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {label ? <View style={styles.labelRow}><Text size='sm' weight='600'>{label}{required ? <Text tone='danger'> *</Text> : null}</Text>{optional ? <Text size='xs' tone='secondary'>Optional</Text> : null}</View> : null}
      {description ? <Text family='secondary' size='xs' tone='secondary'>{description}</Text> : null}
      {children}
      {error ? <Text accessibilityLiveRegion='polite' size='xs' tone='danger'>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({ container: { gap: spacing.inline }, labelRow: { alignItems: 'baseline', flexDirection: 'row', justifyContent: 'space-between' } });
