import type { AvatarSize } from '@gaulatti/bleecker/core';
import { radii } from '@gaulatti/bleecker/tokens';
import React from 'react';
import { Image, type ImageSourcePropType, StyleSheet, View, type ViewProps } from 'react-native';

import { useThompsonTheme } from '../theme';
import { Text } from './typography';

export type { AvatarSize } from '@gaulatti/bleecker/core';

export interface AvatarProps extends ViewProps {
  accessibilityLabel?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  source?: ImageSourcePropType;
  src?: string;
}

const sizes: Record<AvatarSize, { box: number; font: 'xs' | 'sm' | 'md' | 'lg' }> = {
  xs: { box: 24, font: 'xs' },
  sm: { box: 32, font: 'xs' },
  md: { box: 40, font: 'sm' },
  lg: { box: 48, font: 'md' },
  xl: { box: 64, font: 'lg' }
};

function getInitials(value: string) {
  return value.trim().split(/\s+/).slice(0, 2).map((word) => word[0]?.toUpperCase() ?? '').join('');
}

export function Avatar({ accessibilityLabel, alt, fallback, size = 'md', source, src, style, ...props }: AvatarProps) {
  const { theme } = useThompsonTheme();
  const dimension = sizes[size].box;
  const label = accessibilityLabel ?? alt ?? fallback ?? '';
  const imageSource = source ?? (src ? { uri: src } : undefined);
  return (
    <View accessibilityLabel={label} accessibilityRole='image' style={[styles.avatar, { backgroundColor: theme.colors.muted, height: dimension, width: dimension }, style]} {...props}>
      {imageSource ? <Image accessibilityLabel={label} source={imageSource} style={styles.image} /> : <Text size={sizes[size].font} weight='600'>{fallback ? getInitials(fallback) : null}</Text>}
    </View>
  );
}

export interface AvatarGroupProps extends ViewProps {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ avatars, max = 4, size = 'md', style, ...props }: AvatarGroupProps) {
  const { theme } = useThompsonTheme();
  const visible = avatars.slice(0, max);
  const overflow = Math.max(0, avatars.length - max);
  const overlap = sizes[size].box * -0.22;
  return (
    <View accessibilityLabel={`${avatars.length} people`} style={[styles.group, style]} {...props}>
      {visible.map((avatar, index) => <Avatar key={`${avatar.src ?? avatar.fallback ?? 'avatar'}-${index}`} {...avatar} size={size} style={[{ borderColor: theme.colors.background, borderWidth: 2, marginLeft: index === 0 ? 0 : overlap }, avatar.style]} />)}
      {overflow > 0 ? <View style={[styles.overflow, { backgroundColor: theme.colors.muted, borderColor: theme.colors.background, height: sizes[size].box, marginLeft: overlap, width: sizes[size].box }]}><Text size={sizes[size].font} weight='600'>+{overflow}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({ avatar: { alignItems: 'center', borderRadius: radii.pill, justifyContent: 'center', overflow: 'hidden' }, group: { alignItems: 'center', flexDirection: 'row' }, image: { height: '100%', width: '100%' }, overflow: { alignItems: 'center', borderRadius: radii.pill, borderWidth: 2, justifyContent: 'center' } });
