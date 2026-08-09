import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, View, type FlatListProps, type ImageSourcePropType, type ViewProps } from 'react-native';
import { radii, spacing } from '@gaulatti/bleecker/tokens';

import { useThompsonTheme } from '../theme';
import { Button } from './button';
import { Card } from './card';
import { Sheet } from './overlays';
import { StatusBadge, type StatusBadgeVariant } from './status-badge';
import { Text } from './typography';

export interface ResourceListItem {
  actions?: React.ReactNode;
  description?: React.ReactNode;
  id: string;
  leading?: React.ReactNode;
  metadata?: React.ReactNode;
  status?: { label: string; variant?: StatusBadgeVariant };
  title: React.ReactNode;
}

export interface ResourceListProps extends Omit<FlatListProps<ResourceListItem>, 'data' | 'renderItem'> {
  empty?: React.ReactNode;
  items: readonly ResourceListItem[];
  onItemLongPress?: (item: ResourceListItem) => void;
  onItemPress?: (item: ResourceListItem) => void;
  onSelectionChange?: (ids: string[]) => void;
  selectedIds?: string[];
}

export function ResourceList({ empty, items, onItemLongPress, onItemPress, onSelectionChange, selectedIds = [], ...props }: ResourceListProps) {
  const { theme } = useThompsonTheme();
  const toggle = (id: string) => onSelectionChange?.(selectedIds.includes(id) ? selectedIds.filter((value) => value !== id) : [...selectedIds, id]);
  return <FlatList
    data={[...items]}
    keyExtractor={(item) => item.id}
    ListEmptyComponent={<View style={styles.empty}>{empty ?? <Text tone='secondary'>No resources found.</Text>}</View>}
    renderItem={({ item }) => {
      const selected = selectedIds.includes(item.id);
      return <Pressable
        accessibilityRole='button'
        accessibilityState={{ selected }}
        onLongPress={() => { onItemLongPress?.(item); if (onSelectionChange) toggle(item.id); }}
        onPress={() => selectedIds.length && onSelectionChange ? toggle(item.id) : onItemPress?.(item)}
        style={({ pressed }) => [styles.resource, { borderBottomColor: theme.colors.border }, selected && { backgroundColor: `${theme.colors.sea}12` }, pressed && styles.pressed]}
      >
        {item.leading}
        <View style={styles.copy}><View style={styles.resourceTitle}>{typeof item.title === 'string' ? <Text weight='600'>{item.title}</Text> : item.title}{item.status ? <StatusBadge label={item.status.label} variant={item.status.variant} /> : null}</View>{typeof item.description === 'string' ? <Text size='sm' tone='secondary'>{item.description}</Text> : item.description}{typeof item.metadata === 'string' ? <Text size='xs' tone='secondary'>{item.metadata}</Text> : item.metadata}</View>
        {item.actions}
      </Pressable>;
    }}
    {...props}
  />;
}

export interface SelectionBarProps extends ViewProps { count: number; noun?: string; onCancel?: () => void; primaryAction?: React.ReactNode; secondaryAction?: React.ReactNode; }
export function SelectionBar({ count, noun = 'item', onCancel, primaryAction, secondaryAction, style, ...props }: SelectionBarProps) { return <Card accessibilityLiveRegion='polite' style={[styles.selectionBar, style]} {...props}><View style={styles.copy}><Text weight='600'>{count} {noun}{count === 1 ? '' : 's'} selected</Text></View>{secondaryAction}{primaryAction}{onCancel ? <Button size='sm' variant='ghost' onPress={onCancel}>Cancel</Button> : null}</Card>; }

export interface FilterSheetProps { activeCount?: number; children: React.ReactNode; onClear?: () => void; onOpenChange?: (open: boolean) => void; open?: boolean; title?: string; }
export function FilterSheet({ activeCount = 0, children, onClear, onOpenChange, open, title = 'Filters' }: FilterSheetProps) { return <Sheet open={open} onOpenChange={onOpenChange} title={`${title}${activeCount ? ` (${activeCount})` : ''}`} footer={onClear && activeCount ? <Button variant='ghost' onPress={onClear}>Clear all</Button> : undefined}>{children}</Sheet>; }

export interface ActionSheetItem { destructive?: boolean; disabled?: boolean; id: string; label: string; onPress?: () => void; }
export interface ActionSheetProps { items: ActionSheetItem[]; onOpenChange?: (open: boolean) => void; open?: boolean; title?: string; }
export function ActionSheet({ items, onOpenChange, open, title = 'Actions' }: ActionSheetProps) { return <Sheet open={open} onOpenChange={onOpenChange} title={title}>{items.map((item) => <Pressable accessibilityRole='button' disabled={item.disabled} key={item.id} onPress={() => { item.onPress?.(); onOpenChange?.(false); }} style={({ pressed }) => [styles.action, pressed && styles.pressed, item.disabled && styles.disabled]}><Text tone={item.destructive ? 'danger' : 'primary'} weight='500'>{item.label}</Text></Pressable>)}</Sheet>; }

export interface MediaGridItem { id: string; source: ImageSourcePropType; subtitle?: string; title?: string; }
export interface MediaGridProps extends Omit<FlatListProps<MediaGridItem>, 'data' | 'renderItem'> { items: readonly MediaGridItem[]; onItemPress?: (item: MediaGridItem) => void; selectedIds?: string[]; }
export function MediaGrid({ items, onItemPress, selectedIds = [], ...props }: MediaGridProps) { const { theme } = useThompsonTheme(); return <FlatList columnWrapperStyle={styles.mediaRow} data={[...items]} keyExtractor={(item) => item.id} numColumns={2} renderItem={({ item }) => <Pressable accessibilityRole='button' accessibilityState={{ selected: selectedIds.includes(item.id) }} onPress={() => onItemPress?.(item)} style={[styles.mediaItem, selectedIds.includes(item.id) && { borderColor: theme.colors.sea }]}><Image resizeMode='cover' source={item.source} style={[styles.mediaImage, { backgroundColor: theme.colors.muted }]} />{item.title ? <Text numberOfLines={1} size='sm' weight='500'>{item.title}</Text> : null}{item.subtitle ? <Text numberOfLines={1} size='xs' tone='secondary'>{item.subtitle}</Text> : null}</Pressable>} {...props} />; }

export interface MediaDetailSheetProps { actions?: React.ReactNode; details?: Array<{ label: string; value: React.ReactNode }>; item?: MediaGridItem; onOpenChange?: (open: boolean) => void; open?: boolean; }
export function MediaDetailSheet({ actions, details = [], item, onOpenChange, open }: MediaDetailSheetProps) { return <Sheet open={open} onOpenChange={onOpenChange} title={item?.title ?? 'Media details'}>{item ? <Image resizeMode='contain' source={item.source} style={styles.detailImage} /> : null}{details.map((detail) => <View key={detail.label} style={styles.detailRow}><Text size='xs' tone='secondary' weight='600'>{detail.label.toUpperCase()}</Text>{typeof detail.value === 'string' || typeof detail.value === 'number' ? <Text size='sm'>{detail.value}</Text> : detail.value}</View>)}{actions}</Sheet>; }

const styles = StyleSheet.create({ action: { justifyContent: 'center', minHeight: 52, paddingHorizontal: spacing.control }, copy: { flex: 1, gap: spacing.detail }, detailImage: { borderRadius: radii.ui, height: 240, width: '100%' }, detailRow: { gap: spacing.detail, paddingVertical: spacing.inline }, disabled: { opacity: 0.45 }, empty: { alignItems: 'center', padding: spacing.container }, mediaImage: { aspectRatio: 1, borderRadius: radii.ui, width: '100%' }, mediaItem: { borderColor: 'transparent', borderRadius: radii.ui, borderWidth: 2, flex: 1, gap: spacing.detail, padding: 3 }, mediaRow: { gap: spacing.control }, pressed: { opacity: 0.65 }, resource: { alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: spacing.control, minHeight: 72, paddingHorizontal: spacing.control, paddingVertical: spacing.control }, resourceTitle: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.control, justifyContent: 'space-between' }, selectionBar: { alignItems: 'center', flexDirection: 'row', gap: spacing.control } });
