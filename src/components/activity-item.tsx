import React from 'react';
import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';
import { spacing } from '@gaulatti/bleecker/tokens';

import { useThompsonTheme } from '../theme';
import { Avatar } from './avatar';
import { Text } from './typography';

export interface ActivityItemProps extends Omit<PressableProps, 'children'> { init: string; time: string; title: string; }
export function ActivityItem({ init, style, time, title, ...props }: ActivityItemProps) {
  const { theme } = useThompsonTheme();
  return <Pressable style={(state) => [styles.item, { borderBottomColor: theme.colors.border }, state.pressed && styles.pressed, typeof style === 'function' ? style(state) : style]} {...props}><Avatar fallback={init} size='sm' /><View style={styles.copy}><Text size='sm' weight='500'>{title}</Text><Text family='secondary' size='xs' tone='secondary'>{time}</Text></View></Pressable>;
}
const styles = StyleSheet.create({ copy: { flex: 1, gap: spacing.detail }, item: { borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.control, padding: spacing.component }, pressed: { opacity: 0.65 } });
