import React from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { BrandLockup, type BrandLockupProps } from '../components/brand-lockup';
import { useThompsonTheme } from '../theme';

import { shellHeaderMinHeight } from './metrics';

function MenuGlyph({ color }: { color: string }) {
  return <View style={styles.glyph}>{[0, 1, 2].map((line) => <View key={line} style={[styles.glyphLine, { backgroundColor: color }]} />)}</View>;
}

export interface HeaderProps extends ViewProps {
  actions?: React.ReactNode;
  brand: BrandLockupProps;
  fullWidth?: boolean;
  menuIcon?: React.ReactNode;
  mobileActions?: React.ReactNode;
  navigation?: React.ReactNode;
  onMenuPress?: () => void;
  showMenuButton?: boolean;
}

export function Header({ actions, brand, fullWidth: _fullWidth, menuIcon, mobileActions, navigation, onMenuPress, showMenuButton = false, style, ...props }: HeaderProps) {
  const { theme } = useThompsonTheme();
  return (
    <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }, style]} {...props}>
      <BrandLockup {...brand} />
      <View style={styles.actions}>
        {mobileActions ?? actions ?? navigation}
        {showMenuButton || onMenuPress ? (
          <Pressable
            accessibilityLabel='Open navigation'
            accessibilityRole='button'
            hitSlop={8}
            onPress={onMenuPress}
            style={({ pressed }) => [styles.menu, pressed && styles.pressed]}
          >
            {menuIcon ?? <MenuGlyph color={theme.colors.sea} />}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ actions: { alignItems: 'center', flexDirection: 'row', gap: 8 }, glyph: { gap: 4, width: 20 }, glyphLine: { borderRadius: 2, height: 1.5, width: 20 }, header: { alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', justifyContent: 'space-between', minHeight: shellHeaderMinHeight, paddingHorizontal: 18 }, menu: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 }, pressed: { opacity: 0.55 } });
