import type { SelectionOrientation } from '@gaulatti/bleecker/core';
import { radii, spacing } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { Pressable, StyleSheet, Switch as NativeSwitch, View, type SwitchProps as NativeSwitchProps, type ViewProps } from 'react-native';

import { useThompsonTheme } from '../theme';
import { Text } from './typography';

export type { SelectionOrientation } from '@gaulatti/bleecker/core';

export interface CheckboxProps extends Omit<ViewProps, 'children'> {
  checked: boolean;
  description?: React.ReactNode;
  disabled?: boolean;
  label?: React.ReactNode;
  onCheckedChange?(checked: boolean): void;
}

export function Checkbox({ accessibilityLabel, checked, description, disabled = false, label, onCheckedChange, style, ...props }: CheckboxProps) {
  const { theme } = useThompsonTheme();
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : undefined)}
      accessibilityRole='checkbox'
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      style={({ pressed }) => [styles.controlRow, pressed && styles.pressed, disabled && styles.disabled, style]}
      {...props}
    >
      <View style={[styles.checkbox, { backgroundColor: checked ? theme.colors.sea : theme.colors.card, borderColor: checked ? theme.colors.sea : theme.colors.input }]}>
        {checked ? <Text size='xs' weight='700' style={styles.checkmark}>✓</Text> : null}
      </View>
      {label || description ? <View style={styles.controlCopy}>{label ? <Text size='sm' weight='500'>{label}</Text> : null}{description ? <Text size='xs' tone='secondary'>{description}</Text> : null}</View> : null}
    </Pressable>
  );
}

export interface SwitchProps extends Omit<NativeSwitchProps, 'onValueChange' | 'value'> {
  checked?: boolean;
  label?: string;
  onCheckedChange?(checked: boolean): void;
  onValueChange?(checked: boolean): void;
  value?: boolean;
}

export function Switch({ checked, label, onCheckedChange, onValueChange, style, value, ...props }: SwitchProps) {
  const { theme } = useThompsonTheme();
  return (
    <View style={[styles.controlRow, style]}>
      <NativeSwitch
        accessibilityLabel={props.accessibilityLabel ?? label}
        ios_backgroundColor={theme.colors.muted}
        thumbColor={theme.colors.card}
        trackColor={{ false: theme.colors.muted, true: theme.colors.sea }}
        value={checked ?? value ?? false}
        onValueChange={(next) => { onCheckedChange?.(next); onValueChange?.(next); }}
        {...props}
      />
      {label ? <Text size='sm'>{label}</Text> : null}
    </View>
  );
}

export interface RadioOption {
  description?: string;
  disabled?: boolean;
  label: string;
  value: string;
}

export interface RadioGroupProps extends ViewProps {
  disabled?: boolean;
  onChange?(value: string): void;
  onValueChange?(value: string): void;
  options: readonly RadioOption[];
  orientation?: SelectionOrientation;
  value?: string;
}

export function RadioGroup({ disabled = false, onChange, onValueChange, options, orientation = 'vertical', style, value, ...props }: RadioGroupProps) {
  const { theme } = useThompsonTheme();
  return (
    <View accessibilityRole='radiogroup' style={[styles.radioGroup, orientation === 'horizontal' && styles.radioGroupHorizontal, style]} {...props}>
      {options.map((option) => {
        const selected = option.value === value;
        const isDisabled = disabled || option.disabled;
        return (
          <Pressable
            key={option.value}
            accessibilityLabel={option.label}
            accessibilityRole='radio'
            accessibilityState={{ checked: selected, disabled: isDisabled }}
            disabled={isDisabled}
            onPress={() => { onChange?.(option.value); onValueChange?.(option.value); }}
            style={({ pressed }) => [styles.controlRow, pressed && styles.pressed, isDisabled && styles.disabled]}
          >
            <View style={[styles.radio, { borderColor: selected ? theme.colors.sea : theme.colors.input }]}>
              {selected ? <View style={[styles.radioDot, { backgroundColor: theme.colors.sea }]} /> : null}
            </View>
            <View style={styles.controlCopy}><Text size='sm' weight='500'>{option.label}</Text>{option.description ? <Text size='xs' tone='secondary'>{option.description}</Text> : null}</View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: { alignItems: 'center', borderRadius: 5, borderWidth: 1, height: 20, justifyContent: 'center', width: 20 },
  checkmark: { color: '#ffffff', lineHeight: 15 },
  controlCopy: { flex: 1, gap: 2 },
  controlRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.inline, minHeight: 44 },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.72 },
  radio: { alignItems: 'center', borderRadius: radii.pill, borderWidth: 1.5, height: 20, justifyContent: 'center', width: 20 },
  radioDot: { borderRadius: radii.pill, height: 10, width: 10 },
  radioGroup: { gap: spacing.detail },
  radioGroupHorizontal: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.component }
});
