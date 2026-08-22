import { radii, spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type DimensionValue,
  type LayoutChangeEvent,
  type ScrollViewProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native';

import { Text } from '../components/typography';
import { useThompsonTheme } from '../theme';

export interface FeedColumnProps extends Omit<ViewProps, 'children' | 'style'> {
  accent?: string;
  bodyStyle?: ScrollViewProps['contentContainerStyle'];
  children: React.ReactNode;
  count?: number;
  filter?: React.ReactNode;
  scrollProps?: Omit<ScrollViewProps, 'children' | 'contentContainerStyle'>;
  style?: StyleProp<ViewStyle>;
  title: string;
  viewportRef?: React.Ref<ScrollView>;
  width?: DimensionValue;
}

/** An independently vertically scrollable native feed lane. */
export function FeedColumn({
  accent,
  bodyStyle,
  children,
  count,
  filter,
  scrollProps,
  style,
  title,
  viewportRef,
  width = 372,
  ...props
}: FeedColumnProps) {
  const { theme } = useThompsonTheme();
  const resolvedAccent = accent ?? theme.colors.sea;
  return (
    <View
      {...props}
      accessibilityLabel={props.accessibilityLabel ?? title}
      style={[styles.column, { backgroundColor: theme.colors.deepSea, borderColor: `${resolvedAccent}66`, width }, style]}
    >
      <View style={[styles.header, { borderBottomColor: 'rgba(255,255,255,0.08)' }]}>
        <View style={styles.titleRow}>
          <View accessible={false} style={[styles.marker, { backgroundColor: resolvedAccent, shadowColor: resolvedAccent }]} />
          <Text numberOfLines={1} style={[styles.title, { color: resolvedAccent }]}>{title}</Text>
          {count !== undefined ? <View style={styles.count}><Text size='xs' style={styles.inverse} weight='600'>{count}</Text></View> : null}
        </View>
        {filter}
      </View>
      <ScrollView
        {...scrollProps}
        ref={viewportRef}
        contentContainerStyle={[styles.body, bodyStyle]}
        directionalLockEnabled
        nestedScrollEnabled
        showsVerticalScrollIndicator={scrollProps?.showsVerticalScrollIndicator ?? true}
        style={[styles.viewport, scrollProps?.style]}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export interface FeedColumnsProps extends Omit<ScrollViewProps, 'children' | 'horizontal' | 'onLayout'> {
  children: React.ReactNode;
  columnGap?: number;
  maxVisibleColumns?: number;
  minColumnWidth?: number;
  onLayout?: (event: LayoutChangeEvent) => void;
}

/**
 * Coordinates a set of feed lanes. Phones receive full-column magnetic paging;
 * wider devices reveal as many side-by-side lanes as their width permits.
 */
export function FeedColumns({
  children,
  columnGap = spacing.control,
  contentContainerStyle,
  maxVisibleColumns = 4,
  minColumnWidth = 340,
  onLayout,
  style,
  ...props
}: FeedColumnsProps) {
  const window = useWindowDimensions();
  const [measuredWidth, setMeasuredWidth] = React.useState(0);
  const availableWidth = measuredWidth || window.width;
  const visibleColumns = Math.max(1, Math.min(maxVisibleColumns, Math.floor((availableWidth + columnGap) / (minColumnWidth + columnGap))));
  const columnWidth = (availableWidth - columnGap * (visibleColumns - 1)) / visibleColumns;
  const paged = visibleColumns === 1;
  const items = React.Children.toArray(children).map((child, index) => (
    <View key={React.isValidElement(child) && child.key != null ? child.key : index} style={{ width: columnWidth }}>
      {React.isValidElement<FeedColumnProps>(child) && child.type === FeedColumn
        ? React.cloneElement(child, { width: '100%' })
        : child}
    </View>
  ));

  return (
    <ScrollView
      {...props}
      horizontal
      contentContainerStyle={[styles.columnsContent, { gap: columnGap }, contentContainerStyle]}
      decelerationRate={paged ? 'fast' : 'normal'}
      directionalLockEnabled
      disableIntervalMomentum={paged}
      nestedScrollEnabled
      onLayout={(event) => {
        setMeasuredWidth(event.nativeEvent.layout.width);
        onLayout?.(event);
      }}
      showsHorizontalScrollIndicator={props.showsHorizontalScrollIndicator ?? false}
      snapToAlignment='start'
      snapToInterval={paged ? columnWidth + columnGap : undefined}
      style={[styles.columns, style]}
    >
      {items}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.control },
  column: { borderRadius: radii.card, borderWidth: 1, flex: 1, minHeight: 0, overflow: 'hidden' },
  columns: { flex: 1, minHeight: 0, width: '100%' },
  columnsContent: { alignItems: 'stretch' },
  count: { backgroundColor: 'rgba(0,0,0,0.16)', borderColor: 'rgba(255,255,255,0.08)', borderRadius: radii.pill, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4 },
  header: { borderBottomWidth: StyleSheet.hairlineWidth, gap: spacing.control, padding: spacing.component },
  inverse: { color: 'rgba(255,255,255,0.86)' },
  marker: { borderRadius: 4, elevation: 2, height: 8, shadowOpacity: 0.8, shadowRadius: 7, width: 8 },
  title: { flex: 1, fontSize: 11, letterSpacing: 1.32, textTransform: 'uppercase' },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: 10, minHeight: 28 },
  viewport: { flex: 1, minHeight: 0 }
});
