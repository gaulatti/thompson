import React from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View, type ScrollViewProps, type ViewProps } from 'react-native';

export type DetailLayoutRatio = 'balanced' | 'primary';
export type DetailLayoutSide = 'start' | 'end';

export interface DetailLayoutProps extends Omit<ViewProps, 'children'> {
  breakpoint?: number;
  children: React.ReactNode;
  contentScrollProps?: Omit<ScrollViewProps, 'children'>;
  ratio?: DetailLayoutRatio;
  side?: DetailLayoutSide;
  sideRail?: React.ReactNode;
  sideRailLabel?: string;
  sideRailScrollProps?: Omit<ScrollViewProps, 'children'>;
  sticky?: boolean;
  viewportHeight?: number;
}

/**
 * A responsive detail composition. On wide native screens, `sticky` keeps the
 * rail in a bounded, independently scrollable viewport, the closest native
 * equivalent to Bleecker's CSS sticky rail.
 */
export function DetailLayout({
  breakpoint = 768,
  children,
  contentScrollProps,
  ratio = 'primary',
  side = 'end',
  sideRail,
  sideRailLabel,
  sideRailScrollProps,
  sticky = true,
  style,
  viewportHeight,
  ...props
}: DetailLayoutProps) {
  const { height, width } = useWindowDimensions();
  const wide = Boolean(sideRail) && width >= breakpoint;
  const primaryWeight = ratio === 'primary' ? 2 : 1;
  const boundedHeight = viewportHeight ?? height;
  const rail = sideRail ? (
    sticky && wide ? (
      <ScrollView
        {...sideRailScrollProps}
        accessibilityLabel={sideRailLabel}
        nestedScrollEnabled
        style={[styles.rail, { flex: 1, maxHeight: boundedHeight }, sideRailScrollProps?.style]}
      >
        {sideRail}
      </ScrollView>
    ) : (
      <View accessibilityLabel={sideRailLabel} style={styles.rail}>{sideRail}</View>
    )
  ) : null;
  const primary = sticky && wide ? (
    <ScrollView
      {...contentScrollProps}
      nestedScrollEnabled
      style={[styles.primary, { flex: primaryWeight, maxHeight: boundedHeight }, contentScrollProps?.style]}
    >
      {children}
    </ScrollView>
  ) : <View style={[styles.primary, wide && { flex: primaryWeight }]}>{children}</View>;
  const ordered = side === 'start' && sideRail ? [rail, primary] : [primary, rail];

  return (
    <View {...props} style={[styles.base, wide ? styles.row : styles.column, style]}>
      {ordered.map((item, index) => item ? <React.Fragment key={index}>{item}</React.Fragment> : null)}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'stretch', gap: 40, minWidth: 0 },
  column: { flexDirection: 'column' },
  primary: { minWidth: 0 },
  rail: { minWidth: 0 },
  row: { alignItems: 'flex-start', flexDirection: 'row', gap: 48 }
});
