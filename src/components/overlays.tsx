import React from 'react';
import { Modal as NativeModal, Pressable, ScrollView, StyleSheet, View, type ModalProps as NativeModalProps, type PressableProps, type ViewProps } from 'react-native';
import { radii, spacing } from '@gaulatti/bleecker/tokens';

import { useThompsonTheme } from '../theme';
import { Button } from './button';
import { IconButton } from './icon-button';
import { Text } from './typography';

export interface ModalProps extends Omit<NativeModalProps, 'children' | 'visible'> { children: React.ReactNode; description?: string; footer?: React.ReactNode; onOpenChange?: (open: boolean) => void; open?: boolean; title?: string; visible?: boolean; }
export function Modal({ children, description, footer, onOpenChange, open, title, visible, ...props }: ModalProps) { const { theme } = useThompsonTheme(); const shown = open ?? visible ?? false; return <NativeModal animationType='fade' onRequestClose={() => onOpenChange?.(false)} transparent visible={shown} {...props}><Pressable onPress={() => onOpenChange?.(false)} style={styles.backdrop}><Pressable onPress={(event) => event.stopPropagation()} style={[styles.dialog, { backgroundColor: theme.colors.card }, theme.shadows.overlay]}>{title ? <Text size='lg' weight='600'>{title}</Text> : null}{description ? <Text size='sm' tone='secondary'>{description}</Text> : null}<ScrollView>{children}</ScrollView>{footer}</Pressable></Pressable></NativeModal>; }

export type SheetSide = 'bottom' | 'left' | 'right' | 'top';
export interface SheetProps extends ModalProps { side?: SheetSide; }
export function Sheet({ children, side = 'bottom', ...props }: SheetProps) { const { theme } = useThompsonTheme(); const shown = props.open ?? props.visible ?? false; return <NativeModal animationType='slide' onRequestClose={() => props.onOpenChange?.(false)} transparent visible={shown}><Pressable onPress={() => props.onOpenChange?.(false)} style={[styles.backdrop, side === 'bottom' && styles.bottom, side === 'top' && styles.top, side === 'left' && styles.left, side === 'right' && styles.right]}><Pressable onPress={(event) => event.stopPropagation()} style={[styles.sheet, side === 'left' || side === 'right' ? styles.sideSheet : styles.bottomSheet, { backgroundColor: theme.colors.card }]}>{props.title ? <Text size='lg' weight='600'>{props.title}</Text> : null}{props.description ? <Text tone='secondary'>{props.description}</Text> : null}{children}{props.footer}</Pressable></Pressable></NativeModal>; }
export const Drawer = Sheet;

export interface DialogCloseButtonProps extends Omit<PressableProps, 'children'> { onClose?: () => void; }
export function DialogCloseButton({ onClose, onPress, ...props }: DialogCloseButtonProps) { return <IconButton accessibilityLabel='Close' variant='ghost' onPress={(event) => { onClose?.(); onPress?.(event); }} {...props}><Text size='lg'>×</Text></IconButton>; }

export interface AlertDialogProps extends Omit<ModalProps, 'children' | 'footer'> { cancelLabel?: string; confirmLabel?: string; destructive?: boolean; onCancel?: () => void; onConfirm?: () => void; }
export function AlertDialog({ cancelLabel = 'Cancel', confirmLabel = 'Continue', destructive, onCancel, onConfirm, ...props }: AlertDialogProps) { return <Modal {...props} footer={<View style={styles.actions}><Button variant='ghost' onPress={onCancel}>{cancelLabel}</Button><Button variant={destructive ? 'destructive' : 'primary'} onPress={onConfirm}>{confirmLabel}</Button></View>}><View /></Modal>; }

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';
export type PopoverAlign = 'start' | 'center' | 'end';
export interface PopoverProps extends ViewProps { align?: PopoverAlign; content: React.ReactNode; onOpenChange?: (open: boolean) => void; open?: boolean; side?: PopoverSide; sideOffset?: number; trigger: React.ReactNode; }
export function Popover({ align = 'end', content, onOpenChange, open, side = 'bottom', sideOffset = 4, style, trigger, ...props }: PopoverProps) { const { theme } = useThompsonTheme(); const [internal, setInternal] = React.useState(false); const shown = open ?? internal; const toggle = () => { setInternal(!shown); onOpenChange?.(!shown); }; const placement: ViewProps['style'] = side === 'top' ? { bottom: '100%', marginBottom: sideOffset } : side === 'left' ? { marginRight: sideOffset, right: '100%', top: 0 } : side === 'right' ? { left: '100%', marginLeft: sideOffset, top: 0 } : { marginTop: sideOffset, top: '100%' }; const alignment: ViewProps['style'] = side === 'top' || side === 'bottom' ? align === 'start' ? { left: 0 } : align === 'end' ? { right: 0 } : { alignSelf: 'center' } : undefined; return <View style={[styles.anchor, style]} {...props}><Pressable onPress={toggle}>{trigger}</Pressable>{shown ? <View style={[styles.popover, placement, alignment, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, theme.shadows.raised]}>{content}</View> : null}</View>; }
export const HoverCard = Popover;

export type TooltipSide = PopoverSide;
export interface TooltipProps extends ViewProps { content: React.ReactNode; delayDuration?: number; side?: TooltipSide; }
export function Tooltip({ children, content, style, ...props }: TooltipProps) { const { theme } = useThompsonTheme(); const [shown, setShown] = React.useState(false); return <View style={[styles.anchor, style]} {...props}><Pressable onLongPress={() => setShown(true)} onPressOut={() => setShown(false)}>{children}</Pressable>{shown ? <View style={[styles.tooltip, { backgroundColor: theme.colors.foreground }]}>{typeof content === 'string' ? <Text size='xs' style={{ color: theme.colors.background }}>{content}</Text> : content}</View> : null}</View>; }

export interface MenuItem { disabled?: boolean; icon?: React.ReactNode; id: string; label: string; onPress?: () => void; }
interface DropdownMenuContextValue { close(): void; open: boolean; setOpen(open: boolean): void; }
const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);
export interface DropdownMenuProps extends ViewProps { items?: MenuItem[]; onOpenChange?: (open: boolean) => void; open?: boolean; trigger?: React.ReactNode; }
export function DropdownMenu({ children, items, onOpenChange, open: controlledOpen, trigger, ...props }: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (value: boolean) => { if (controlledOpen === undefined) setInternalOpen(value); onOpenChange?.(value); };
  if (items && trigger) return <Popover open={open} onOpenChange={setOpen} trigger={trigger} content={<View>{items.map((item) => <Pressable key={item.id} disabled={item.disabled} onPress={() => { item.onPress?.(); setOpen(false); }} style={styles.menuItem}>{item.icon}<Text size='sm'>{item.label}</Text></Pressable>)}</View>} {...props} />;
  return <DropdownMenuContext.Provider value={{ close: () => setOpen(false), open, setOpen }}><View {...props}>{children}</View></DropdownMenuContext.Provider>;
}
export interface DropdownMenuTriggerProps extends Omit<PressableProps, 'children'> { asChild?: boolean; children: React.ReactNode; }
export function DropdownMenuTrigger({ asChild, children, onPress, ...props }: DropdownMenuTriggerProps) { const menu = React.useContext(DropdownMenuContext); const handlePress = (event: Parameters<NonNullable<PressableProps['onPress']>>[0]) => { menu?.setOpen(!menu.open); onPress?.(event); }; if (asChild && React.isValidElement(children)) { const child = children as React.ReactElement<{ onPress?: PressableProps['onPress'] }>; return React.cloneElement(child, { onPress: (event) => { child.props.onPress?.(event); handlePress(event); } }); } return <Pressable accessibilityRole='button' onPress={handlePress} {...props}>{children}</Pressable>; }
export interface DropdownMenuContentProps extends ViewProps { title?: string; }
export function DropdownMenuContent({ children, title = 'Actions', ...props }: DropdownMenuContentProps) { const menu = React.useContext(DropdownMenuContext); return <Sheet open={menu?.open} onOpenChange={(value) => menu?.setOpen(value)} title={title}><View {...props}>{children}</View></Sheet>; }
export interface DropdownMenuItemProps extends Omit<PressableProps, 'children'> { children: React.ReactNode; inset?: boolean; }
export function DropdownMenuItem({ children, inset, onPress, style, ...props }: DropdownMenuItemProps) { const menu = React.useContext(DropdownMenuContext); return <Pressable accessibilityRole='menuitem' onPress={(event) => { onPress?.(event); menu?.close(); }} style={(state) => [styles.menuItem, inset && styles.inset, state.pressed && styles.pressed, typeof style === 'function' ? style(state) : style]} {...props}>{typeof children === 'string' ? <Text size='sm'>{children}</Text> : children}</Pressable>; }
export interface DropdownMenuCheckboxItemProps extends DropdownMenuItemProps { checked?: boolean; onCheckedChange?: (checked: boolean) => void; }
export function DropdownMenuCheckboxItem({ checked = false, children, onCheckedChange, onPress, ...props }: DropdownMenuCheckboxItemProps) { return <DropdownMenuItem accessibilityRole='checkbox' accessibilityState={{ checked }} onPress={(event) => { onCheckedChange?.(!checked); onPress?.(event); }} {...props}><Text size='sm'>{checked ? '✓  ' : '    '}{children}</Text></DropdownMenuItem>; }
export interface DropdownMenuRadioItemProps extends DropdownMenuItemProps { selected?: boolean; value: string; }
export function DropdownMenuRadioItem({ children, selected, ...props }: DropdownMenuRadioItemProps) { return <DropdownMenuItem accessibilityRole='radio' accessibilityState={{ selected }} {...props}><Text size='sm'>{selected ? '●  ' : '○  '}{children}</Text></DropdownMenuItem>; }
export function DropdownMenuLabel(props: ViewProps) { return <View {...props} style={[styles.menuLabel, props.style]} />; }
export function DropdownMenuSeparator(props: ViewProps) { const { theme } = useThompsonTheme(); return <View {...props} style={[styles.menuSeparator, { backgroundColor: theme.colors.border }, props.style]} />; }
export function DropdownMenuShortcut(props: React.ComponentProps<typeof Text>) { return <Text size='xs' tone='secondary' {...props} />; }
export const DropdownMenuGroup = View;
export const DropdownMenuPortal = React.Fragment;
export const DropdownMenuSub = View;
export const DropdownMenuSubContent = View;
export const DropdownMenuSubTrigger = DropdownMenuItem;
export const DropdownMenuRadioGroup = View;

export const ContextMenu = DropdownMenu;
export const ContextMenuTrigger = DropdownMenuTrigger;
export const ContextMenuContent = DropdownMenuContent;
export const ContextMenuItem = DropdownMenuItem;
export interface NotificationItem { description?: string; id: string; onClick?: () => void; timestamp?: string; title: string; unread?: boolean; }
export interface NotificationBadgeProps extends ViewProps { count?: number; items?: NotificationItem[]; onMarkAllRead?: () => void; }
export function NotificationBadge({ count = 0, items = [], onMarkAllRead, style, ...props }: NotificationBadgeProps) { return <View style={style} {...props}><DropdownMenu items={[...items.map((item) => ({ id: item.id, label: `${item.unread ? '• ' : ''}${item.title}${item.timestamp ? ` · ${item.timestamp}` : ''}`, onPress: item.onClick })), ...(onMarkAllRead ? [{ id: 'mark-all', label: 'Mark all read', onPress: onMarkAllRead }] : [])]} trigger={<View><IconButton accessibilityLabel='Notifications'><Text>♢</Text></IconButton>{count > 0 ? <View style={styles.badge}><Text size='xs' style={{ color: '#fff' }}>{count > 99 ? '99+' : count}</Text></View> : null}</View>} /></View>; }

const styles = StyleSheet.create({ actions: { alignItems: 'center', flexDirection: 'row', gap: spacing.control, justifyContent: 'flex-end' }, anchor: { position: 'relative' }, backdrop: { alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', flex: 1, justifyContent: 'center', padding: spacing.component }, badge: { alignItems: 'center', backgroundColor: '#c45d3e', borderRadius: 99, minWidth: 17, paddingHorizontal: 3, position: 'absolute', right: -3, top: -3 }, bottom: { justifyContent: 'flex-end', padding: 0 }, bottomSheet: { borderTopLeftRadius: radii.dialog, borderTopRightRadius: radii.dialog, maxHeight: '85%', width: '100%' }, dialog: { borderRadius: radii.dialog, gap: spacing.component, maxHeight: '80%', padding: spacing.group, width: '92%' }, inset: { paddingLeft: spacing.group }, left: { alignItems: 'flex-start', padding: 0 }, menuItem: { alignItems: 'center', flexDirection: 'row', gap: spacing.control, minHeight: 48, paddingHorizontal: spacing.component }, menuLabel: { minHeight: 34, justifyContent: 'center', paddingHorizontal: spacing.component }, menuSeparator: { height: StyleSheet.hairlineWidth, marginVertical: spacing.detail }, popover: { borderRadius: radii.ui, borderWidth: 1, minWidth: 180, padding: spacing.control, position: 'absolute', zIndex: 20 }, pressed: { opacity: 0.6 }, right: { alignItems: 'flex-end', padding: 0 }, sheet: { gap: spacing.component, padding: spacing.group }, sideSheet: { height: '100%', width: '82%' }, tooltip: { borderRadius: 5, bottom: '100%', paddingHorizontal: 8, paddingVertical: 5, position: 'absolute', zIndex: 30 }, top: { justifyContent: 'flex-start', padding: 0 } });
