import type { IconBadgeSize, IconBadgeVariant } from '@gaulatti/bleecker/core';
import { spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { useThompsonTheme } from '../theme';
import { Text } from './typography';

export type { IconBadgeSize, IconBadgeVariant } from '@gaulatti/bleecker/core';
export type NativeIconBadgeSize = IconBadgeSize | 'sm';

export interface IconBadgeProps extends ViewProps {
  size?: NativeIconBadgeSize;
  variant?: IconBadgeVariant;
}

const dimensions: Record<NativeIconBadgeSize, number> = { sm: 44, md: 56, lg: 64 };

export function IconBadge({ children, size = 'lg', style, variant = 'primary', ...props }: IconBadgeProps) {
  const { theme } = useThompsonTheme();
  const variants: Record<IconBadgeVariant, ViewStyle> = {
    primary: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.accentBlue : theme.colors.deepSea, borderColor: theme.colorScheme === 'dark' ? theme.colors.accentBlue : theme.colors.deepSea },
    subtle: { backgroundColor: `${theme.colors.sea}10`, borderColor: `${theme.colors.sea}25` },
    outlined: { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
  };
  return <View style={[styles.base, { height: dimensions[size], width: dimensions[size] }, variants[variant], style]} {...props}>{typeof children === 'string' || typeof children === 'number' ? <Text weight='600' style={{ color: variant === 'primary' ? '#fff' : theme.colors.sea }}>{children}</Text> : children}</View>;
}

const styles = StyleSheet.create({ base: { alignItems: 'center', borderRadius: spacing.control - 2, borderWidth: 1, justifyContent: 'center' } });
