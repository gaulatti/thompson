import React from 'react';
import NativeDateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import NativeSlider from '@react-native-community/slider';
import { Platform, Pressable, ScrollView, StyleSheet, View, type ScrollViewProps, type ViewProps } from 'react-native';
import { radii, spacing } from '@gaulatti/bleecker/tokens';

import { useThompsonTheme } from '../theme';
import { Button } from './button';
import { FilterGroup, type FilterChipProps } from './filter-chip';
import { Input, type InputProps } from './input';
import { Modal, Sheet } from './overlays';
import { Text } from './typography';

export interface AccordionItem { content: React.ReactNode; disabled?: boolean; id: string; title: React.ReactNode; }
export interface AccordionProps extends ViewProps { allowMultiple?: boolean; defaultValue?: string | string[]; items: AccordionItem[]; onValueChange?: (value: string[]) => void; value?: string | string[]; }
export function Accordion({ allowMultiple = false, defaultValue = [], items, onValueChange, style, value, ...props }: AccordionProps) { const initial = Array.isArray(defaultValue) ? defaultValue : [defaultValue]; const controlled = value === undefined ? undefined : Array.isArray(value) ? value : [value]; const [internal, setInternal] = React.useState(initial); const open = controlled ?? internal; const toggle = (id: string) => { const next = open.includes(id) ? open.filter((item) => item !== id) : allowMultiple ? [...open, id] : [id]; setInternal(next); onValueChange?.(next); }; return <View style={style} {...props}>{items.map((item) => <View key={item.id}><Pressable disabled={item.disabled} onPress={() => toggle(item.id)} style={styles.accordionHeader}>{typeof item.title === 'string' ? <Text weight='600' style={styles.grow}>{item.title}</Text> : item.title}<Text>{open.includes(item.id) ? '−' : '+'}</Text></Pressable>{open.includes(item.id) ? <View style={styles.accordionBody}>{item.content}</View> : null}</View>)}</View>; }

export interface DatePickerProps extends ViewProps { disabled?: boolean; maximumDate?: Date; minimumDate?: Date; onChange?: (date?: Date) => void; placeholder?: string; value?: Date; }
export interface CalendarProps extends ViewProps { disabled?: (date: Date) => boolean; maxDate?: Date; minDate?: Date; onChange?: (date: Date) => void; value?: Date | null; }
export function Calendar({ disabled, maxDate, minDate, onChange, style, value, ...props }: CalendarProps) {
  const current = value ?? new Date();
  return <View style={style} {...props}><NativeDateTimePicker display={Platform.OS === 'ios' ? 'inline' : 'default'} maximumDate={maxDate} minimumDate={minDate} mode='date' onChange={(event, next) => { if (event.type === 'set' && next && !disabled?.(next)) onChange?.(next); }} value={current} /></View>;
}
export function DatePicker({ disabled, maximumDate, minimumDate, onChange, placeholder = 'Select date', style, value, ...props }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState(value ?? new Date());
  React.useEffect(() => { if (value) setDraft(value); }, [value]);
  const selectAndroid = (event: DateTimePickerEvent, next?: Date) => { setOpen(false); if (event.type === 'set' && next) onChange?.(next); };
  return <View style={style} {...props}><Pressable accessibilityRole='button' disabled={disabled} onPress={() => setOpen(true)}><Input editable={false} value={value ? Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(value) : placeholder} /></Pressable>{open && Platform.OS === 'android' ? <NativeDateTimePicker maximumDate={maximumDate} minimumDate={minimumDate} mode='date' onChange={selectAndroid} value={value ?? new Date()} /> : null}<Sheet open={open && Platform.OS !== 'android'} onOpenChange={setOpen} title={placeholder} footer={<View style={styles.sheetActions}>{value ? <Button variant='ghost' onPress={() => { onChange?.(undefined); setOpen(false); }}>Clear</Button> : <View />}<View style={styles.row}><Button variant='ghost' onPress={() => setOpen(false)}>Cancel</Button><Button onPress={() => { onChange?.(draft); setOpen(false); }}>Done</Button></View></View>}><NativeDateTimePicker display='spinner' maximumDate={maximumDate} minimumDate={minimumDate} mode='date' onChange={(_event, next) => next && setDraft(next)} value={draft} /></Sheet></View>;
}
export interface DateRange { from?: Date; to?: Date; }
export interface DateRangePickerProps extends ViewProps { onChange?: (range: DateRange) => void; value?: DateRange; }
export function DateRangePicker({ onChange, style, value = {}, ...props }: DateRangePickerProps) { return <View style={[styles.row, style]} {...props}><View style={styles.grow}><DatePicker value={value.from} onChange={(from) => onChange?.({ ...value, from })} /></View><Text tone='secondary'>to</Text><View style={styles.grow}><DatePicker value={value.to} onChange={(to) => onChange?.({ ...value, to })} /></View></View>; }

export interface OtpInputProps extends ViewProps { length?: number; onChange?: (value: string) => void; value?: string; }
export function OtpInput({ length = 6, onChange, style, value = '', ...props }: OtpInputProps) { return <View style={[styles.row, style]} {...props}>{Array.from({ length }, (_, index) => <Input key={index} keyboardType='number-pad' maxLength={1} onChangeText={(character) => onChange?.(`${value.slice(0, index)}${character}${value.slice(index + 1)}`)} style={styles.otp} value={value[index] ?? ''} />)}</View>; }

export interface SliderProps extends ViewProps { disabled?: boolean; maximumValue?: number; minimumValue?: number; onValueChange?: (value: number) => void; step?: number; value?: number; }
export function Slider({ disabled, maximumValue = 100, minimumValue = 0, onValueChange, step = 1, style, value = minimumValue, ...props }: SliderProps) { const { theme } = useThompsonTheme(); return <View style={style} {...props}><NativeSlider accessibilityRole='adjustable' disabled={disabled} maximumTrackTintColor={theme.colors.muted} maximumValue={maximumValue} minimumTrackTintColor={theme.colors.sea} minimumValue={minimumValue} onValueChange={onValueChange} step={step} thumbTintColor={theme.colors.sea} value={value} /></View>; }

export interface SelectOption { disabled?: boolean; label: string; value: string; }
export interface SelectProps extends ViewProps { disabled?: boolean; onValueChange?: (value: string) => void; options: SelectOption[]; placeholder?: string; value?: string; }
export function Select({ disabled, onValueChange, options, placeholder = 'Select…', style, value, ...props }: SelectProps) { const [open, setOpen] = React.useState(false); const selected = options.find((option) => option.value === value); return <View style={style} {...props}><Pressable accessibilityRole='button' disabled={disabled} onPress={() => setOpen(true)}><Input editable={false} value={selected?.label ?? placeholder} /></Pressable><Sheet open={open} onOpenChange={setOpen} title={placeholder}>{options.map((option) => <Pressable accessibilityRole='button' accessibilityState={{ selected: option.value === value }} key={option.value} disabled={option.disabled} onPress={() => { onValueChange?.(option.value); setOpen(false); }} style={styles.option}><Text tone={option.value === value ? 'accent' : 'primary'} weight={option.value === value ? '600' : '400'}>{option.value === value ? '✓  ' : ''}{option.label}</Text></Pressable>)}</Sheet></View>; }
export const HeaderSelect = Select;

export interface ScrollAreaProps extends ScrollViewProps { horizontal?: boolean; }
export function ScrollArea(props: ScrollAreaProps) { return <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} {...props} />; }

export interface PickedFile { mimeType?: string; name: string; size?: number; uri: string; }
export interface FileInputProps extends Omit<InputProps, 'onChange'> { buttonLabel?: string; fileName?: string; files?: PickedFile[]; multiple?: boolean; onFilesChange?: (files: PickedFile[]) => void; onPick?: () => void | PickedFile | PickedFile[] | Promise<void | PickedFile | PickedFile[]>; }
export function FileInput({ buttonLabel = 'Choose file', fileName, files = [], multiple = false, onFilesChange, onPick, style, ...props }: FileInputProps) {
  const [picking, setPicking] = React.useState(false);
  const pick = async () => { if (!onPick) return; setPicking(true); try { const result = await onPick(); if (!result) return; const selected = Array.isArray(result) ? result : [result]; onFilesChange?.(multiple ? selected : selected.slice(0, 1)); } finally { setPicking(false); } };
  const displayName = fileName ?? (files.map((file) => file.name).join(', ') || 'No file selected');
  return <View style={[styles.row, style]}><View style={styles.grow}><Input editable={false} value={displayName} {...props} /></View><Button loading={picking} onPress={() => void pick()} variant='outline'>{buttonLabel}</Button></View>;
}

export interface FieldHelpTooltipProps extends ViewProps { content: React.ReactNode; }
export function FieldHelpTooltip({ content, style, ...props }: FieldHelpTooltipProps) { return <View style={style} {...props}><Text size='xs' tone='secondary'>ⓘ {content}</Text></View>; }

export interface CollectionFilterOption { field: string; label: string; options?: Array<{ label: string; value: string }>; type: 'select' | 'boolean' | 'date'; }
export interface CollectionSortOption { field: string; label: string; }
export interface CollectionSortState { field: string; order: 'asc' | 'desc'; }
export interface SimpleCollectionFiltersProps extends ViewProps { currentFilters?: never; filters: FilterChipProps[]; onClearAll?: () => void; search?: React.ReactNode; }
export interface StructuredCollectionFiltersProps extends ViewProps { currentFilters: Record<string, boolean | string>; currentSort: CollectionSortState; defaultExpanded?: boolean; filterOptions: CollectionFilterOption[]; filters?: never; onFilterChange: (filters: Record<string, boolean | string>) => void; onSortChange: (sort: CollectionSortState) => void; sortOptions: CollectionSortOption[]; }
export type CollectionFiltersProps = SimpleCollectionFiltersProps | StructuredCollectionFiltersProps;
export function CollectionFilters(props: CollectionFiltersProps) {
  const [open, setOpen] = React.useState('defaultExpanded' in props && Boolean(props.defaultExpanded));
  if ('filters' in props && props.filters) { const { filters, onClearAll, search, style, ...viewProps } = props; return <View style={[styles.column, style]} {...viewProps}>{search}<FilterGroup filters={filters} onClearAll={onClearAll} /></View>; }
  const { currentFilters, currentSort, filterOptions, onFilterChange, onSortChange, sortOptions, style, ...viewProps } = props as StructuredCollectionFiltersProps;
  const change = (field: string, value: boolean | string | undefined) => { const next = { ...currentFilters }; if (value === undefined || value === '') delete next[field]; else next[field] = value; onFilterChange(next); };
  const active = Object.keys(currentFilters).length;
  return <View style={[styles.column, style]} {...viewProps}>
    <View style={styles.filterToolbar}><Button size='sm' variant={active ? 'subtle' : 'outline'} onPress={() => setOpen(true)}>Filters{active ? ` (${active})` : ''}</Button>{active ? <Button size='sm' variant='ghost' onPress={() => onFilterChange({})}>Clear all</Button> : null}<View style={styles.grow}>{sortOptions.length ? <Select onValueChange={(field) => onSortChange({ ...currentSort, field })} options={sortOptions.map((option) => ({ label: option.label, value: option.field }))} value={currentSort.field} /> : null}</View>{sortOptions.length ? <Button size='sm' variant='ghost' onPress={() => onSortChange({ ...currentSort, order: currentSort.order === 'asc' ? 'desc' : 'asc' })}>{currentSort.order === 'asc' ? '↑' : '↓'}</Button> : null}</View>
    {active ? <FilterGroup filters={Object.entries(currentFilters).map(([field, value]) => ({ label: filterOptions.find((option) => option.field === field)?.label ?? field, value: String(value), onRemove: () => change(field, undefined) }))} /> : null}
    <Sheet open={open} onOpenChange={setOpen} title={`Filters${active ? ` (${active})` : ''}`} footer={active ? <Button variant='ghost' onPress={() => onFilterChange({})}>Clear all</Button> : undefined}>
      <View style={styles.column}>{filterOptions.map((option) => <View key={option.field} style={styles.column}><Text size='sm' weight='600'>{option.label}</Text>{option.type === 'date' ? <DatePicker onChange={(date) => change(option.field, date ? date.toISOString().slice(0, 10) : undefined)} value={currentFilters[option.field] ? new Date(String(currentFilters[option.field])) : undefined} /> : <Select onValueChange={(value) => change(option.field, option.type === 'boolean' ? value === '' ? undefined : value === 'true' : value)} options={option.type === 'boolean' ? [{ label: 'All', value: '' }, { label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }] : [{ label: 'All', value: '' }, ...(option.options ?? [])]} value={String(currentFilters[option.field] ?? '')} />}</View>)}</View>
    </Sheet>
  </View>;
}

export interface CommandItem { id: string; keywords?: string[]; label: string; onSelect?: () => void; }
export interface CommandSpotlightAction extends CommandItem { description?: string; icon?: React.ReactNode; shortcut?: string; }
export interface CommandSpotlightProps { items: CommandItem[]; onOpenChange?: (open: boolean) => void; open?: boolean; placeholder?: string; }
export function CommandSpotlight({ items, onOpenChange, open, placeholder = 'Search commands…' }: CommandSpotlightProps) { const [query, setQuery] = React.useState(''); const visible = items.filter((item) => `${item.label} ${item.keywords?.join(' ') ?? ''}`.toLowerCase().includes(query.toLowerCase())); return <Modal open={open} onOpenChange={onOpenChange} title='Command palette'><Input autoFocus onChangeText={setQuery} placeholder={placeholder} value={query} />{visible.map((item) => <Pressable key={item.id} onPress={item.onSelect} style={styles.option}><Text>{item.label}</Text></Pressable>)}</Modal>; }

const styles = StyleSheet.create({ accordionBody: { padding: spacing.component }, accordionHeader: { alignItems: 'center', flexDirection: 'row', minHeight: 48, paddingHorizontal: spacing.control }, column: { gap: spacing.control }, filterToolbar: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.control }, grow: { flex: 1 }, option: { minHeight: 52, justifyContent: 'center', paddingHorizontal: spacing.component }, otp: { flex: 1, minWidth: 36, paddingHorizontal: 0, textAlign: 'center' }, row: { alignItems: 'center', flexDirection: 'row', gap: spacing.control }, sheetActions: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' } });
