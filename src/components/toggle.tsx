import type { ToggleSize, ToggleVariant } from '@gaulatti/bleecker/core';
import { radii } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { Pressable, type PressableProps, StyleSheet, Text, type ViewStyle } from 'react-native';

import { useThompsonTheme } from '../theme';

export type { ToggleSize, ToggleVariant } from '@gaulatti/bleecker/core';

export interface ToggleProps extends Omit<PressableProps, 'children'> {
  children: React.ReactNode;
  onPressedChange?(pressed: boolean): void;
  pressed?: boolean;
  size?: ToggleSize;
  variant?: ToggleVariant;
}

const sizes: Record<ToggleSize, ViewStyle> = { sm: { minHeight: 32, paddingHorizontal: 10 }, md: { minHeight: 36, paddingHorizontal: 12 }, lg: { minHeight: 40, paddingHorizontal: 16 } };

export function Toggle({ children, disabled, onPress, onPressedChange, pressed = false, size = 'md', style, variant = 'default', ...props }: ToggleProps) {
  const { theme } = useThompsonTheme();
  return (
    <Pressable
      accessibilityRole='button'
      accessibilityState={{ disabled: Boolean(disabled), selected: pressed }}
      disabled={disabled}
      onPress={(event) => { onPressedChange?.(!pressed); onPress?.(event); }}
      style={(state) => [styles.base, sizes[size], variant === 'outline' && { borderColor: pressed ? theme.colors.sea : theme.colors.border, borderWidth: 1 }, { backgroundColor: pressed ? `${theme.colors.sea}18` : 'transparent' }, state.pressed && styles.active, disabled && styles.disabled, typeof style === 'function' ? style(state) : style]}
      {...props}
    >
      {typeof children === 'string' ? <Text style={{ color: pressed ? theme.colors.sea : theme.colors.textSecondary, fontFamily: theme.fonts.medium }}>{children}</Text> : children}
    </Pressable>
  );
}

const styles = StyleSheet.create({ active: { transform: [{ scale: 0.99 }] }, base: { alignItems: 'center', borderRadius: radii.button, flexDirection: 'row', gap: 8, justifyContent: 'center' }, disabled: { opacity: 0.5 } });
