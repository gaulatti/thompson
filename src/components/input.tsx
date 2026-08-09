import type { ControlSize } from '@gaulatti/bleecker/core';
import { radii } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { StyleSheet, TextInput, type TextInputProps, type TextStyle } from 'react-native';

import { useThompsonTheme } from '../theme';

export interface InputProps extends TextInputProps {
  error?: boolean;
  inputSize?: ControlSize;
}

const sizes: Record<ControlSize, TextStyle> = {
  sm: { fontSize: 13, minHeight: 36, paddingHorizontal: 12 },
  md: { fontSize: 14, minHeight: 40, paddingHorizontal: 14 },
  lg: { fontSize: 15, minHeight: 44, paddingHorizontal: 16 }
};

export const Input = React.forwardRef<TextInput, InputProps>(function Input(
  { editable = true, error = false, inputSize = 'md', placeholderTextColor, style, ...props },
  ref
) {
  const { theme } = useThompsonTheme();
  return (
    <TextInput
      ref={ref}
      accessibilityState={{ disabled: !editable }}
      editable={editable}
      placeholderTextColor={placeholderTextColor ?? theme.colors.mutedForeground}
      style={[
        styles.base,
        sizes[inputSize],
        { backgroundColor: editable ? theme.colors.card : theme.colors.muted, borderColor: error ? theme.colors.destructive : theme.colors.input, color: theme.colors.textPrimary, fontFamily: theme.fonts.regular },
        style
      ]}
      {...props}
    />
  );
});

export interface TextareaProps extends InputProps {}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(function Textarea({ inputSize = 'md', numberOfLines = 4, style, ...props }, ref) {
  return <Input ref={ref} inputSize={inputSize} multiline numberOfLines={numberOfLines} style={[styles.textarea, style]} textAlignVertical='top' {...props} />;
});

const styles = StyleSheet.create({
  base: { borderRadius: radii.ui, borderWidth: 1, paddingVertical: 8 },
  textarea: { minHeight: 112, paddingTop: 12 }
});
