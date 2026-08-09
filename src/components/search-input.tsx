import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

import { Input, type InputProps } from './input';
import { Text } from './typography';
import { useThompsonTheme } from '../theme';

export interface SearchInputProps extends InputProps { leadingIcon?: React.ReactNode; onClear?: () => void; }

export const SearchInput = React.forwardRef<React.ElementRef<typeof Input>, SearchInputProps>(function SearchInput({ leadingIcon, onClear, style, value, ...props }, ref) {
  const { theme } = useThompsonTheme();
  const hasValue = typeof value === 'string' && value.length > 0;
  return (
    <View style={styles.wrapper}>
      <View pointerEvents='none' style={styles.search}>{leadingIcon ?? <Svg height={17} width={17} viewBox='0 0 24 24'><Circle cx={11} cy={11} fill='none' r={6.5} stroke={theme.colors.textSecondary} strokeWidth={1.8} /><Line x1={16} x2={21} y1={16} y2={21} stroke={theme.colors.textSecondary} strokeLinecap='round' strokeWidth={1.8} /></Svg>}</View>
      <Input ref={ref} accessibilityRole='search' returnKeyType='search' style={[styles.input, style]} value={value} {...props} />
      {hasValue && onClear ? <Pressable accessibilityLabel='Clear search' accessibilityRole='button' hitSlop={8} onPress={onClear} style={styles.clear}><Text tone='secondary'>×</Text></Pressable> : null}
    </View>
  );
});

const styles = StyleSheet.create({ clear: { alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 10, top: 7 }, input: { paddingLeft: 40, paddingRight: 36 }, search: { left: 13, position: 'absolute', top: 11, zIndex: 1 }, wrapper: { position: 'relative' } });
