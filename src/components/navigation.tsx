import React from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { spacing } from '@gaulatti/bleecker/tokens';

import { useThompsonTheme } from '../theme';
import { IconButton, type IconButtonProps } from './icon-button';
import { Text } from './typography';
import { Toggle, type ToggleProps } from './toggle';

export interface NavItem { external?: boolean; href: string; label: string; }
export interface RenderLinkProps<TItem extends NavItem> { children: React.ReactNode; className?: string; item: TItem; onClick?: () => void; }
export type RenderLink<TItem extends NavItem = NavItem> = (props: RenderLinkProps<TItem>) => React.ReactNode;
export function renderDefaultLink<TItem extends NavItem>({ children, item, onClick }: RenderLinkProps<TItem>) { return <Pressable accessibilityRole='link' accessibilityLabel={item.label} onPress={onClick}>{children}</Pressable>; }
export interface NavMenuProps<TItem extends NavItem = NavItem> extends Omit<ViewProps, 'children'> { direction?: 'horizontal' | 'vertical'; items: TItem[]; onItemClick?: (item?: TItem) => void; renderLink?: RenderLink<TItem>; }
export function NavMenu<TItem extends NavItem>({ direction = 'horizontal', items, onItemClick, renderLink = renderDefaultLink, style, ...props }: NavMenuProps<TItem>) { return <View accessibilityRole='menu' style={[styles.row, direction === 'vertical' && styles.vertical, style]} {...props}>{items.map((item) => <React.Fragment key={`${item.href}:${item.label}`}>{renderLink({ children: <Text tone='secondary' weight='500'>{item.label}</Text>, item, onClick: () => onItemClick?.(item) })}</React.Fragment>)}</View>; }

export interface BreadcrumbItem extends NavItem { current?: boolean; }
export interface BreadcrumbProps extends Omit<ViewProps, 'children'> { collapsedAfter?: number; items: BreadcrumbItem[]; separator?: React.ReactNode; }
export function Breadcrumb({ collapsedAfter = 0, items, separator = <Text tone='muted'>/</Text>, style, ...props }: BreadcrumbProps) { const visible = collapsedAfter > 0 && items.length > collapsedAfter + 1 ? [items[0], { href: '', label: '…' }, ...items.slice(-collapsedAfter)] : items; return <ScrollView horizontal contentContainerStyle={[styles.row, style]} {...props}>{visible.map((item, index) => <React.Fragment key={`${item.href}:${index}`}><Pressable disabled={item.current || !item.href}><Text size='sm' tone={item.current ? 'primary' : 'secondary'} weight={item.current ? '600' : '400'}>{item.label}</Text></Pressable>{index < visible.length - 1 ? separator : null}</React.Fragment>)}</ScrollView>; }

export interface PaginationProps extends ViewProps { currentPage: number; hasNextPage?: boolean; hasPrevPage?: boolean; onPageChange: (page: number) => void; totalPages?: number; }
export function Pagination({ currentPage, hasNextPage, hasPrevPage, onPageChange, style, totalPages, ...props }: PaginationProps) { const previous = hasPrevPage ?? currentPage > 1; const next = hasNextPage ?? (totalPages ? currentPage < totalPages : true); return <View accessibilityRole='toolbar' style={[styles.row, style]} {...props}><IconButton accessibilityLabel='Previous page' disabled={!previous} onPress={() => onPageChange(currentPage - 1)}><Text>‹</Text></IconButton><Text size='sm' tone='secondary'>Page {currentPage}{totalPages ? ` of ${totalPages}` : ''}</Text><IconButton accessibilityLabel='Next page' disabled={!next} onPress={() => onPageChange(currentPage + 1)}><Text>›</Text></IconButton></View>; }

export type ToggleGroupType = 'single' | 'multiple';
export interface ToggleGroupProps extends ViewProps { disabled?: boolean; onValueChange?: (value: string | string[]) => void; size?: ToggleProps['size']; type: ToggleGroupType; value?: string | string[]; variant?: ToggleProps['variant']; }
interface ToggleGroupContextValue { disabled?: boolean; onToggle(value: string): void; selected: string[]; size?: ToggleProps['size']; variant?: ToggleProps['variant']; }
const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);
export function ToggleGroup({ children, disabled, onValueChange, size, style, type, value, variant, ...props }: ToggleGroupProps) { const selected = Array.isArray(value) ? value : value ? [value] : []; const onToggle = (next: string) => { if (type === 'single') onValueChange?.(selected.includes(next) ? '' : next); else onValueChange?.(selected.includes(next) ? selected.filter((item) => item !== next) : [...selected, next]); }; return <ToggleGroupContext.Provider value={{ disabled, onToggle, selected, size, variant }}><View style={[styles.row, style]} {...props}>{children}</View></ToggleGroupContext.Provider>; }
export interface ToggleGroupItemProps extends Omit<ToggleProps, 'pressed' | 'onPressedChange'> { value: string; }
export function ToggleGroupItem({ disabled, size, value, variant, ...props }: ToggleGroupItemProps) { const group = React.useContext(ToggleGroupContext); return <Toggle disabled={disabled ?? group?.disabled} onPressedChange={() => group?.onToggle(value)} pressed={group?.selected.includes(value)} size={size ?? group?.size} variant={variant ?? group?.variant} {...props} />; }

export interface ThemeToggleProps extends Omit<IconButtonProps, 'children'> {}
export function ThemeToggle(props: ThemeToggleProps) { const { cycleTheme, themeMode } = useThompsonTheme(); return <IconButton accessibilityLabel={`Theme: ${themeMode}`} onPress={cycleTheme} {...props}><Text>{themeMode === 'light' ? '☼' : themeMode === 'dark' ? '☾' : '◐'}</Text></IconButton>; }

export interface KbdProps extends ViewProps { keys?: string[]; }
export function Kbd({ children, keys, style, ...props }: KbdProps) { const { theme } = useThompsonTheme(); const labels = keys ?? (typeof children === 'string' ? [children] : []); return <View style={[styles.row, style]} {...props}>{labels.map((key) => <View key={key} style={[styles.key, { backgroundColor: theme.colors.muted, borderColor: theme.colors.border }]}><Text size='xs' weight='600'>{key}</Text></View>)}</View>; }

export interface LabelProps extends ViewProps { children: React.ReactNode; disabled?: boolean; required?: boolean; }
export function Label({ children, disabled, required, style, ...props }: LabelProps) { return <View style={[styles.row, disabled && styles.disabled, style]} {...props}>{typeof children === 'string' ? <Text size='sm' weight='600'>{children}</Text> : children}{required ? <Text size='sm' tone='danger'>*</Text> : null}</View>; }

const styles = StyleSheet.create({ disabled: { opacity: 0.5 }, key: { borderRadius: 5, borderWidth: 1, minWidth: 24, paddingHorizontal: 6, paddingVertical: 3 }, row: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.control }, vertical: { alignItems: 'stretch', flexDirection: 'column' } });
