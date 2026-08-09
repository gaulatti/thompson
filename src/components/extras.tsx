import React from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View, type FlatListProps, type ImageSourcePropType, type ViewProps } from 'react-native';
import { radii, spacing } from '@gaulatti/bleecker/tokens';

import { useThompsonTheme } from '../theme';
import { Button } from './button';
import { Card } from './card';
import { Field } from './field';
import { Input } from './input';
import { Text } from './typography';

export type BauhausBackgroundType = 'nazca' | 'autostrada' | 'pompeii' | 'monitor';
export interface BauhausBackgroundProps extends ViewProps { defaultImageUrl?: string; imageUrl?: string; type?: BauhausBackgroundType; }
export function BauhausBackground(props: BauhausBackgroundProps) { const { theme } = useThompsonTheme(); return <View pointerEvents='none' {...props} style={[StyleSheet.absoluteFill, props.style]}><View style={[styles.circle, { backgroundColor: `${theme.colors.sea}18` }]} /><View style={[styles.square, { backgroundColor: `${theme.colors.sunset}18` }]} /></View>; }

export interface HeroCarouselItem { action?: React.ReactNode; description?: string; id: string; image?: ImageSourcePropType; title: string; }
export type HeroCarouselItemKind = 'post' | 'project';
export interface HeroCarouselRenderLinkProps { children: React.ReactNode; href: string; item: HeroCarouselItem; }
export type HeroCarouselRenderLink = (props: HeroCarouselRenderLinkProps) => React.ReactNode;
export interface HeroCarouselProps extends ViewProps { items: HeroCarouselItem[]; }
export function HeroCarousel({ items, style, ...props }: HeroCarouselProps) { return <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={style} {...props}>{items.map((item) => <Card key={item.id} style={styles.hero}>{item.image ? <Image source={item.image} style={styles.heroImage} /> : null}<Text size='lg' weight='600'>{item.title}</Text>{item.description ? <Text tone='secondary'>{item.description}</Text> : null}{item.action}</Card>)}</ScrollView>; }

export interface MediaItem { id: string; source: ImageSourcePropType; title?: string; }
export interface MediaLibraryItem extends MediaItem {}
export interface MediaLibraryProps extends Omit<FlatListProps<MediaItem>, 'data' | 'renderItem'> { items: MediaItem[]; onSelect?: (item: MediaItem) => void; selectedIds?: string[]; }
export function MediaLibrary({ items, onSelect, selectedIds = [], style, ...props }: MediaLibraryProps) { const { theme } = useThompsonTheme(); return <FlatList columnWrapperStyle={styles.mediaGrid} data={items} keyExtractor={(item) => item.id} numColumns={3} renderItem={({ item }) => <Pressable accessibilityRole='button' accessibilityState={{ selected: selectedIds.includes(item.id) }} onPress={() => onSelect?.(item)} style={[styles.media, selectedIds.includes(item.id) && { borderColor: theme.colors.sea }]}><Image source={item.source} style={styles.mediaImage} />{item.title ? <Text numberOfLines={1} size='xs'>{item.title}</Text> : null}</Pressable>} style={style} {...props} />; }

export interface ToastItem { description?: string; id: string; title: string; variant?: 'default' | 'success' | 'error'; }
export interface ToasterProps extends ViewProps { items?: ToastItem[]; }
let toastSequence = 0;
let toastItems: ToastItem[] = [];
const toastListeners = new Set<(items: ToastItem[]) => void>();
const emitToasts = () => toastListeners.forEach((listener) => listener(toastItems));
const dismissToast = (id?: string) => { toastItems = id ? toastItems.filter((item) => item.id !== id) : []; emitToasts(); };
const addToast = (item: Omit<ToastItem, 'id'>, duration = 4000) => {
  const id = `thompson-toast-${++toastSequence}`;
  toastItems = [...toastItems, { ...item, id }];
  emitToasts();
  if (duration > 0) setTimeout(() => dismissToast(id), duration);
  return id;
};

export function Toaster({ items, style, ...props }: ToasterProps) {
  const [managedItems, setManagedItems] = React.useState(toastItems);
  React.useEffect(() => { if (items) return; toastListeners.add(setManagedItems); return () => { toastListeners.delete(setManagedItems); }; }, [items]);
  const visibleItems = items ?? managedItems;
  return <View pointerEvents='box-none' style={[styles.toaster, style]} {...props}>{visibleItems.map((item) => <Pressable accessibilityLabel={`Dismiss ${item.title}`} accessibilityRole='button' key={item.id} onPress={() => dismissToast(item.id)}><Card variant='elevated'><Text weight='600' tone={item.variant === 'error' ? 'danger' : 'primary'}>{item.title}</Text>{item.description ? <Text size='sm' tone='secondary'>{item.description}</Text> : null}</Card></Pressable>)}</View>;
}

export const toast = {
  custom: (item: Omit<ToastItem, 'id'>, duration?: number) => addToast(item, duration),
  dismiss: dismissToast,
  error: (title: string, description?: string) => addToast({ description, title, variant: 'error' }),
  success: (title: string, description?: string) => addToast({ description, title, variant: 'success' })
};

export interface LoginScreenProps { description?: string; error?: string; loading?: boolean; onSubmit?: (credentials: { email: string; password: string }) => void; title?: string; }
export function LoginScreen({ description = 'Sign in to continue.', error, loading, onSubmit, title = 'Welcome back' }: LoginScreenProps) { const [email, setEmail] = React.useState(''); const [password, setPassword] = React.useState(''); return <View style={styles.login}><BauhausBackground /><Card variant='elevated' style={styles.loginCard}><Text size='lg' weight='600'>{title}</Text><Text tone='secondary'>{description}</Text><Field label='Email'><Input autoCapitalize='none' keyboardType='email-address' onChangeText={setEmail} value={email} /></Field><Field label='Password'><Input onChangeText={setPassword} secureTextEntry value={password} /></Field>{error ? <Text tone='danger'>{error}</Text> : null}<Button fullWidth loading={loading} onPress={() => onSubmit?.({ email, password })}>Sign in</Button></Card></View>; }

const styles = StyleSheet.create({ circle: { borderRadius: 999, height: 240, position: 'absolute', right: -80, top: -60, width: 240 }, hero: { gap: spacing.component, marginRight: spacing.component, width: 300 }, heroImage: { borderRadius: radii.ui, height: 150, width: '100%' }, login: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.group }, loginCard: { gap: spacing.component, maxWidth: 440, width: '100%' }, media: { borderColor: 'transparent', borderRadius: radii.ui, borderWidth: 2, flex: 1, gap: 4, overflow: 'hidden', padding: 3 }, mediaGrid: { gap: spacing.control }, mediaImage: { aspectRatio: 1, borderRadius: radii.ui, width: '100%' }, square: { bottom: 40, height: 180, left: -70, position: 'absolute', transform: [{ rotate: '18deg' }], width: 180 }, toaster: { gap: spacing.control, left: spacing.component, position: 'absolute', right: spacing.component, top: spacing.group, zIndex: 100 } });
