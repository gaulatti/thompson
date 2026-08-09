import type { IconButtonSize, IconButtonVariant } from '@gaulatti/bleecker/core';
import { radii } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { Pressable, type PressableProps, StyleSheet, type ViewStyle } from 'react-native';

import { useThompsonTheme } from '../theme';

export type { IconButtonSize, IconButtonVariant } from '@gaulatti/bleecker/core';

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  children: React.ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
}

const dimensions: Record<IconButtonSize, number> = { sm: 32, md: 40, lg: 44 };

export const IconButton = React.forwardRef<React.ElementRef<typeof Pressable>, IconButtonProps>(function IconButton(
  { children, disabled, size = 'md', style, variant = 'default', ...props },
  ref
) {
  const { theme } = useThompsonTheme();
  const variants: Record<IconButtonVariant, ViewStyle> = {
    default: { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1, ...theme.shadows.surface },
    subtle: { backgroundColor: theme.colors.muted, borderColor: 'transparent', borderWidth: 1 },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 1 }
  };
  return (
    <Pressable
      ref={ref}
      accessibilityRole='button'
      disabled={disabled}
      style={(state) => [styles.base, { height: dimensions[size], width: dimensions[size] }, variants[variant], state.pressed && styles.pressed, disabled && styles.disabled, typeof style === 'function' ? style(state) : style]}
      {...props}
    >
      {children}
    </Pressable>
  );
});

const styles = StyleSheet.create({ base: { alignItems: 'center', borderRadius: radii.button, justifyContent: 'center' }, disabled: { opacity: 0.45 }, pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] } });
