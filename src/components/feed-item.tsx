import React from 'react';
import { Linking, Pressable, StyleSheet, View, type PressableProps } from 'react-native';
import { radii, spacing } from '@gaulatti/bleecker/tokens';

import { useThompsonTheme } from '../theme';
import { Avatar } from './avatar';
import { Text } from './typography';

export interface FeedItemProps extends Omit<PressableProps, 'children'> {
  author: string;
  avatarSrc?: string;
  categories?: string[];
  content: string;
  init?: string;
  language: string;
  postedAt: Date | string;
  relevance: number;
  sourceUrl: string;
  title?: string;
}

function postedLabel(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown time';
  const minutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
}

export function FeedItem({ author, avatarSrc, categories = [], content, init, language, postedAt, relevance, sourceUrl, style, title, ...props }: FeedItemProps) {
  const { theme } = useThompsonTheme();
  const host = (() => { try { return new URL(sourceUrl).hostname; } catch { return 'Open source'; } })();
  return (
    <Pressable style={(state) => [styles.item, { borderBottomColor: theme.colors.border }, state.pressed && styles.pressed, typeof style === 'function' ? style(state) : style]} {...props}>
      <Avatar fallback={init ?? author} size='sm' src={avatarSrc} />
      <View style={styles.body}>
        <View style={styles.meta}><Text numberOfLines={1} size='sm' weight='600' style={styles.author}>{author}</Text><Text family='secondary' size='xs' tone='secondary'>· {postedLabel(postedAt)}</Text><View style={[styles.score, { backgroundColor: `${theme.colors.sea}14` }]}><Text size='xs' tone='accent' weight='600'>{Math.round(relevance)}</Text></View></View>
        {title ? <Text numberOfLines={2} weight='600'>{title}</Text> : null}
        <Text family='secondary' numberOfLines={5} size='sm' tone='secondary'>{content}</Text>
        <View style={styles.tags}><View style={[styles.tag, { backgroundColor: theme.colors.muted }]}><Text size='xs' tone='secondary'>{language || 'n/a'}</Text></View>{categories.slice(0, 3).map((category) => <View key={category} style={[styles.tag, { backgroundColor: theme.colors.muted }]}><Text size='xs' tone='secondary'>{category}</Text></View>)}</View>
        <Pressable accessibilityRole='link' onPress={() => void Linking.openURL(sourceUrl)}><Text size='xs' tone='accent' weight='600'>{host} ↗</Text></Pressable>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({ author: { flex: 1 }, body: { flex: 1, gap: spacing.control, minWidth: 0 }, item: { borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.control, padding: spacing.component }, meta: { alignItems: 'center', flexDirection: 'row', gap: spacing.detail }, pressed: { opacity: 0.7 }, score: { borderRadius: radii.pill, paddingHorizontal: 8, paddingVertical: 2 }, tag: { borderRadius: radii.pill, paddingHorizontal: 8, paddingVertical: 3 }, tags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.detail } });
