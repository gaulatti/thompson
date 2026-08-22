import { radii, spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type TargetedEvent,
  type NativeSyntheticEvent,
  type View,
  type ViewStyle
} from 'react-native';

import { useThompsonTheme } from '../theme';
import { createAttentionColor } from '../utils/attention-color';

/** Web element names remain accepted for mechanically translated interfaces. */
export type AttentionSurfaceElement = 'article' | 'button' | 'div' | 'li' | 'section' | 'pressable' | 'view';
export type AttentionSurfaceDensity = 'compact' | 'comfortable';

export interface AttentionSurfaceProps extends Omit<PressableProps, 'children' | 'style'> {
  as?: AttentionSurfaceElement;
  children?: React.ReactNode;
  density?: AttentionSurfaceDensity;
  hue: number;
  intensity: number;
  interactive?: boolean;
  style?: StyleProp<ViewStyle> | PressableProps['style'];
}

export const AttentionSurface = React.forwardRef<View, AttentionSurfaceProps>(function AttentionSurface(
  {
    as = 'article',
    children,
    density = 'comfortable',
    disabled = false,
    hue,
    intensity,
    interactive,
    onBlur,
    onFocus,
    style,
    ...props
  },
  ref
) {
  const { theme } = useThompsonTheme();
  const [focused, setFocused] = React.useState(false);
  const attention = createAttentionColor({ colorScheme: theme.colorScheme, hue, intensity });
  const isInteractive = interactive ?? (as === 'button' || as === 'pressable' || Boolean(props.onPress));
  const handleFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
    setFocused(true);
    onFocus?.(event);
  };
  const handleBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <Pressable
      {...props}
      ref={ref}
      accessibilityRole={isInteractive ? 'button' : undefined}
      accessibilityState={{ ...props.accessibilityState, disabled: isInteractive ? Boolean(disabled) : undefined }}
      disabled={disabled || !isInteractive}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={(state) => [
        styles.base,
        density === 'compact' ? styles.compact : styles.comfortable,
        attention.style,
        state.pressed && { backgroundColor: attention.pressedColor, transform: [{ scale: 0.997 }] },
        focused && { borderColor: theme.colors.ring, borderWidth: 2 },
        disabled && styles.disabled,
        typeof style === 'function' ? style(state) : style
      ]}
    >
      {children}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: { borderRadius: radii.card - 1 },
  comfortable: { padding: spacing.group - spacing.detail },
  compact: { padding: spacing.component },
  disabled: { opacity: 0.48 }
});
