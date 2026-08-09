import React from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
import { spacing } from '@gaulatti/bleecker/tokens';

import { BrandLockup, type BrandLockupProps } from '../components/brand-lockup';
import { Text } from '../components/typography';
import { useThompsonTheme } from '../theme';

export interface FooterSection { items: Array<{ href: string; label: string; onPress?: () => void }>; title: string; }
export interface FooterProps extends ViewProps { bottomLeft?: React.ReactNode; bottomRight?: React.ReactNode; brand: BrandLockupProps & { description?: string }; sections: FooterSection[]; showBottomAccent?: boolean; }
export function Footer({ bottomLeft, bottomRight, brand, sections, showBottomAccent = true, style, ...props }: FooterProps) { const { theme } = useThompsonTheme(); return <View style={[styles.footer, { backgroundColor: theme.colors.muted, borderTopColor: theme.colors.border }, style]} {...props}><BrandLockup {...brand} size='lg' />{brand.description ? <Text tone='secondary'>{brand.description}</Text> : null}{sections.map((section) => <View key={section.title} style={styles.section}><Text size='xs' tone='accent' weight='600'>{section.title.toUpperCase()}</Text>{section.items.map((item) => <Pressable key={`${item.href}:${item.label}`} onPress={item.onPress}><Text size='sm' tone='secondary'>{item.label}</Text></Pressable>)}</View>)}<View style={[styles.bottom, { borderTopColor: theme.colors.border }]}>{typeof bottomLeft === 'string' ? <Text size='xs' tone='secondary'>{bottomLeft}</Text> : bottomLeft}{typeof bottomRight === 'string' ? <Text size='xs' tone='secondary'>{bottomRight}</Text> : bottomRight}</View>{showBottomAccent ? <View style={[styles.accent, { backgroundColor: theme.colors.sea }]} /> : null}</View>; }
const styles = StyleSheet.create({ accent: { bottom: 0, height: 2, left: 0, position: 'absolute', right: 0 }, bottom: { borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.component }, footer: { borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.group, padding: spacing.group }, section: { gap: spacing.control } });
