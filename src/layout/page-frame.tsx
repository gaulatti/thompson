import React from 'react';
import { StyleSheet, useWindowDimensions, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

export type PageFrameElement = 'article' | 'div' | 'main' | 'section' | 'view';
export type PageFrameGutter = 'none' | 'compact' | 'comfortable' | 'spacious';
export type PageFrameVerticalSpacing = 'none' | 'compact' | 'comfortable' | 'spacious';
export type PageFrameWidth = 'reading' | 'content' | 'wide' | 'full';

export interface PageFrameProps extends Omit<ViewProps, 'children' | 'style'> {
  /** Web tags remain accepted and map to a native View accessibility boundary. */
  as?: PageFrameElement;
  children: React.ReactNode;
  gutter?: PageFrameGutter;
  safeAreaEdges?: Edge[];
  style?: StyleProp<ViewStyle>;
  verticalSpacing?: PageFrameVerticalSpacing;
  width?: PageFrameWidth;
}

const maximumWidths: Record<PageFrameWidth, number | undefined> = {
  reading: 768,
  content: 1152,
  wide: 1440,
  full: undefined
};

const verticalSpacing: Record<PageFrameVerticalSpacing, { phone: number; wide: number }> = {
  none: { phone: 0, wide: 0 },
  compact: { phone: 24, wide: 32 },
  comfortable: { phone: 40, wide: 64 },
  spacious: { phone: 56, wide: 96 }
};

/** A centered native page boundary with safe areas and semantic measures. */
export function PageFrame({
  as: _as = 'div',
  children,
  gutter = 'comfortable',
  safeAreaEdges = ['left', 'right'],
  style,
  verticalSpacing: spacing = 'comfortable',
  width = 'content',
  ...props
}: PageFrameProps) {
  const dimensions = useWindowDimensions();
  const wide = dimensions.width >= 768;
  const gutters: Record<PageFrameGutter, number> = {
    none: 0,
    compact: wide ? 20 : 16,
    comfortable: wide ? 40 : 20,
    spacious: wide ? 64 : 24
  };
  const paddingVertical = verticalSpacing[spacing][wide ? 'wide' : 'phone'];
  const frameStyle: ViewStyle = {
    maxWidth: maximumWidths[width],
    paddingHorizontal: gutters[gutter],
    paddingVertical
  };

  if (safeAreaEdges.length > 0) {
    return <SafeAreaView {...props} edges={safeAreaEdges} style={[styles.frame, frameStyle, style]}>{children}</SafeAreaView>;
  }
  return <View {...props} style={[styles.frame, frameStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({ frame: { alignSelf: 'center', width: '100%' } });
