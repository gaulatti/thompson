import React from 'react';
import { StyleSheet, Text as NativeText, View, type TextProps, type TextStyle } from 'react-native';

import { useThompsonTheme } from '../theme';

export type EyebrowTone = 'accent' | 'muted' | 'inverse';

export interface EyebrowProps extends TextProps {
  /** Web tags are accepted for contract parity and rendered as native text. */
  as?: 'div' | 'p' | 'span' | 'text';
  rule?: boolean;
  tone?: EyebrowTone;
}

export function Eyebrow({ as: _as = 'p', children, rule = false, style, tone = 'accent', ...props }: EyebrowProps) {
  const { theme } = useThompsonTheme();
  const colors: Record<EyebrowTone, string> = {
    accent: theme.colors.sea,
    muted: theme.colors.textSecondary,
    inverse: 'rgba(255,255,255,0.78)'
  };
  const text = <NativeText {...props} style={[styles.text, { color: colors[tone], fontFamily: theme.fonts.semibold }, style]}>{children}</NativeText>;

  if (!rule) return text;
  return <View style={styles.row}><View accessible={false} style={[styles.rule, { backgroundColor: colors[tone] }]} />{text}</View>;
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  rule: { height: StyleSheet.hairlineWidth, opacity: 0.6, width: 28 },
  text: { fontSize: 11, letterSpacing: 1.32, lineHeight: 16, textTransform: 'uppercase' } satisfies TextStyle
});
