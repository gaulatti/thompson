import { spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { StyleSheet, View, type LayoutChangeEvent, type ViewProps } from 'react-native';

export interface FeedGridProps extends Omit<ViewProps, 'children' | 'onLayout'> {
  children?: React.ReactNode;
  columnGap?: number;
  maxColumns?: number;
  minColumnWidth?: number | string;
  onLayout?: (event: LayoutChangeEvent) => void;
}

function numericMinimum(value: number | string, width: number): number {
  if (typeof value === 'number') return Math.max(1, value);
  const percent = /^([0-9]+(?:\.[0-9]+)?)%$/.exec(value.trim());
  if (percent) return Math.max(1, width * Number(percent[1]) / 100);
  throw new Error('FeedGrid minColumnWidth must be native points or a percentage string');
}

/** An adaptive native grid that never shrinks items below their usable width. */
export function FeedGrid({
  children,
  columnGap = spacing.control,
  maxColumns = 4,
  minColumnWidth = 340,
  onLayout,
  style,
  ...props
}: FeedGridProps) {
  const [width, setWidth] = React.useState(0);
  const innerWidth = Math.max(0, width - spacing.component * 2);
  const minimum = numericMinimum(minColumnWidth, innerWidth);
  const columns = innerWidth > 0 ? Math.max(1, Math.min(maxColumns, Math.floor((innerWidth + columnGap) / (minimum + columnGap)))) : 1;
  const itemWidth = innerWidth > 0 ? (innerWidth - columnGap * (columns - 1)) / columns : '100%';

  return (
    <View
      {...props}
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
        onLayout?.(event);
      }}
      style={[styles.grid, { gap: columnGap }, style]}
    >
      {React.Children.toArray(children).map((child, index) => (
        <View key={React.isValidElement(child) && child.key != null ? child.key : index} style={{ width: itemWidth }}>{child}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.component, width: '100%' } });
