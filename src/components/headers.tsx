import { spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Heading, Text } from './typography';

export interface PageHeaderProps extends ViewProps {
  actions?: React.ReactNode;
  backLabel?: string;
  breadcrumbs?: React.ReactNode;
  description?: string;
  onBack?: () => void;
  title: string;
}

export function PageHeader({ actions, backLabel = 'Back', breadcrumbs, description, onBack, style, title, ...props }: PageHeaderProps) {
  return <View style={[styles.header, style]} {...props}>{breadcrumbs}{onBack ? <Pressable accessibilityRole='button' onPress={onBack}><Text size='sm' tone='accent'>‹ {backLabel}</Text></Pressable> : null}<View style={styles.pageRow}><View style={styles.copy}><Heading level={1}>{title}</Heading>{description ? <Text tone='secondary'>{description}</Text> : null}</View>{actions}</View></View>;
}

export interface SectionHeaderProps extends ViewProps {
  description?: string;
  eyebrow?: string;
  title: string;
}

export function SectionHeader({ description, eyebrow, style, title, ...props }: SectionHeaderProps) {
  return <View style={[styles.header, style]} {...props}>{eyebrow ? <Text size='xs' tone='accent' weight='600' style={styles.eyebrow}>{eyebrow}</Text> : null}<Heading level={2}>{title}</Heading>{description ? <Text tone='secondary'>{description}</Text> : null}</View>;
}

const styles = StyleSheet.create({ copy: { flex: 1, gap: spacing.inline }, eyebrow: { letterSpacing: 1.2, textTransform: 'uppercase' }, header: { gap: spacing.control }, pageRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.component, justifyContent: 'space-between' } });
