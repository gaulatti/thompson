import React from 'react';
import { Image, type ImageSourcePropType, Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { useThompsonTheme } from '../theme';
import { Logo } from '../assets/logo';
import { Text } from './typography';

export interface BrandLockupProps extends Omit<ViewProps, 'children'> {
  href?: string;
  logo?: React.ReactNode;
  logoAlt?: string;
  logoSource?: ImageSourcePropType;
  logoSrc?: string;
  name: string;
  onPress?: () => void;
  size?: 'sm' | 'lg';
}

export function BrandLockup({ href: _href, logo, logoAlt, logoSource, logoSrc, name, onPress, size = 'sm', style, ...props }: BrandLockupProps) {
  const { theme } = useThompsonTheme();
  const dimension = size === 'lg' ? 40 : 28;
  const imageSource = logoSource ?? (logoSrc ? { uri: logoSrc } : undefined);
  const content = (
    <View style={[styles.row, style]} {...props}>
      {logo ?? (imageSource ? <Image accessibilityLabel={logoAlt ?? name} source={imageSource} style={{ height: dimension, width: dimension }} resizeMode='contain' /> : <Logo accessibilityLabel={logoAlt ?? 'gaulatti'} size={dimension} />)}
      <View style={[styles.divider, { backgroundColor: theme.colors.sand, height: dimension }]} />
      <Text weight='700' style={[styles.name, size === 'lg' && styles.nameLarge]}>{name}</Text>
    </View>
  );
  return onPress ? <Pressable accessibilityRole='button' onPress={onPress}>{content}</Pressable> : content;
}

const styles = StyleSheet.create({ divider: { opacity: 0.55, width: StyleSheet.hairlineWidth }, name: { fontSize: 22, letterSpacing: -1, lineHeight: 27 }, nameLarge: { fontSize: 31, letterSpacing: -1.2, lineHeight: 38 }, row: { alignItems: 'center', flexDirection: 'row', gap: 12 } });
