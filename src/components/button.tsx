import type { ButtonContract, ButtonSize, ButtonVariant } from '@gaulatti/bleecker/core';
import { radii } from '@gaulatti/bleecker/tokens';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle
} from 'react-native';

import { useThompsonTheme } from '../theme';

export type { ButtonSize, ButtonVariant } from '@gaulatti/bleecker/core';

export interface ButtonProps extends ButtonContract, Omit<PressableProps, 'children' | 'disabled' | 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
  textStyle?: StyleProp<TextStyle>;
}

const sizes: Record<ButtonSize, { button: ViewStyle; text: TextStyle; spinner: number }> = {
  xs: { button: { minHeight: 28, paddingHorizontal: 10 }, text: { fontSize: 12 }, spinner: 13 },
  sm: { button: { minHeight: 36, paddingHorizontal: 14 }, text: { fontSize: 13 }, spinner: 14 },
  md: { button: { minHeight: 40, paddingHorizontal: 18 }, text: { fontSize: 14 }, spinner: 15 },
  lg: { button: { minHeight: 48, paddingHorizontal: 24 }, text: { fontSize: 15 }, spinner: 17 }
};

export const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(function Button(
  { accessibilityLabel, children, disabled = false, fullWidth = false, loading = false, onPress, size = 'md', style, textStyle, variant = 'primary', ...props },
  ref
) {
  const { theme } = useThompsonTheme();
  const blocked = disabled || loading;
  const palette: Record<ButtonVariant, { backgroundColor: string; borderColor: string; color: string }> = {
    primary: { backgroundColor: theme.colors.sea, borderColor: theme.colors.sea, color: '#ffffff' },
    secondary: { backgroundColor: theme.colors.card, borderColor: theme.colors.sand, color: theme.colors.textPrimary },
    outline: { backgroundColor: 'transparent', borderColor: theme.colors.sea, color: theme.colors.sea },
    subtle: { backgroundColor: theme.colors.muted, borderColor: 'transparent', color: theme.colors.foreground },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent', color: theme.colors.textPrimary },
    link: { backgroundColor: 'transparent', borderColor: 'transparent', color: theme.colors.sea },
    destructive: { backgroundColor: theme.colors.destructive, borderColor: theme.colors.destructive, color: theme.colors.destructiveForeground }
  };
  const colors = palette[variant];
  if (variant === 'primary' && theme.colorScheme === 'dark') colors.color = theme.colors.deepSea;

  return (
    <Pressable
      ref={ref}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='button'
      accessibilityState={{ busy: loading, disabled: blocked }}
      disabled={blocked}
      onPress={onPress}
      style={(state) => [
        styles.base,
        variant !== 'link' && sizes[size].button,
        { backgroundColor: colors.backgroundColor, borderColor: colors.borderColor },
        fullWidth && styles.fullWidth,
        state.pressed && styles.pressed,
        blocked && styles.disabled,
        typeof style === 'function' ? style(state) : style
      ]}
      {...props}
    >
      {loading ? <ActivityIndicator color={colors.color} size={sizes[size].spinner} /> : null}
      {React.Children.map(children, (child) => typeof child === 'string' || typeof child === 'number' ? (
        <Text style={[styles.label, sizes[size].text, { color: colors.color, fontFamily: theme.fonts.semibold }, variant === 'link' && styles.link, textStyle]}>{child}</Text>
      ) : child)}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: { alignItems: 'center', borderRadius: radii.button, borderWidth: 1, flexDirection: 'row', gap: 8, justifyContent: 'center' },
  disabled: { opacity: 0.45 },
  fullWidth: { alignSelf: 'stretch' },
  label: {},
  link: { textDecorationLine: 'underline' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] }
});
