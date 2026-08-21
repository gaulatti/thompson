import React from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '../components/typography';
import { useThompsonTheme } from '../theme';

export type AuthShellLayout = 'centered' | 'split';
export type AuthShellSide = 'start' | 'end';

export interface AuthShellProps extends Omit<ViewProps, 'children' | 'style'> {
  aside?: React.ReactNode;
  asideLabel?: string;
  asideStyle?: StyleProp<ViewStyle>;
  brand?: React.ReactNode;
  breakpoint?: number;
  children: React.ReactNode;
  contentStyle?: ScrollViewProps['contentContainerStyle'];
  footer?: React.ReactNode;
  layout?: AuthShellLayout;
  side?: AuthShellSide;
  style?: StyleProp<ViewStyle>;
}

/** A safe-area shell for sign-in, recovery, invitation, and other access flows. */
export function AuthShell({
  aside,
  asideLabel,
  asideStyle,
  brand,
  breakpoint = 768,
  children,
  contentStyle,
  footer,
  layout = 'centered',
  side = 'end',
  style,
  ...props
}: AuthShellProps) {
  const { width } = useWindowDimensions();
  const { theme } = useThompsonTheme();
  const split = layout === 'split' && Boolean(aside);
  const wide = split && width >= breakpoint;
  const access = (
    <ScrollView
      contentContainerStyle={[styles.accessScroll, wide && styles.wideAccessScroll, contentStyle]}
      keyboardShouldPersistTaps='handled'
      style={[styles.access, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.accessInner}>
        {brand ? <View accessibilityRole='header'>{brand}</View> : null}
        <View style={styles.content}>{children}</View>
        {footer ? <View accessibilityRole='summary'>{typeof footer === 'string' || typeof footer === 'number' ? <Text family='secondary' size='xs' tone='secondary'>{footer}</Text> : footer}</View> : null}
      </View>
    </ScrollView>
  );
  const asidePanel = split ? (
    <View accessibilityLabel={asideLabel} style={[styles.aside, { backgroundColor: theme.colors.deepSea }, asideStyle]}>
      <View accessibilityElementsHidden importantForAccessibility='no-hide-descendants' style={[styles.orbit, styles.orbitLarge]} />
      <View accessibilityElementsHidden importantForAccessibility='no-hide-descendants' style={[styles.orbit, styles.orbitSmall]} />
      <View style={styles.asideContent}>{aside}</View>
    </View>
  ) : null;

  const ordered = side === 'start' && split ? [asidePanel, access] : [access, asidePanel];
  return (
    <SafeAreaView
      {...props}
      edges={['top', 'bottom', 'left', 'right']}
      style={[styles.shell, { backgroundColor: split ? theme.colors.background : theme.colors.muted }, wide ? styles.row : styles.column, style]}
    >
      {ordered.map((item, index) => item ? <React.Fragment key={index}>{item}</React.Fragment> : null)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  access: { flex: 1, minHeight: 0 },
  accessInner: { alignSelf: 'center', flex: 1, maxWidth: 448, width: '100%' },
  accessScroll: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 24 },
  aside: { flex: 1, minHeight: 240, overflow: 'hidden' },
  asideContent: { flex: 1, justifyContent: 'flex-end', padding: 32, zIndex: 1 },
  column: { flexDirection: 'column' },
  content: { flex: 1, justifyContent: 'center', paddingVertical: 40 },
  orbit: { borderColor: 'rgba(255,255,255,0.1)', borderRadius: 999, borderWidth: 1, position: 'absolute', right: -72, top: -72 },
  orbitLarge: { height: 320, width: 320 },
  orbitSmall: { height: 208, right: -32, top: -32, width: 208 },
  row: { flexDirection: 'row' },
  shell: { flex: 1, minHeight: 0 },
  wideAccessScroll: { paddingHorizontal: 48, paddingVertical: 32 }
});
