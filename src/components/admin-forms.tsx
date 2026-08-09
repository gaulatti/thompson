import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, type ImageSourcePropType, type ViewProps } from 'react-native';
import { spacing } from '@gaulatti/bleecker/tokens';

import { Button } from './button';
import { DatePicker, Select, type SelectOption } from './advanced-inputs';
import { Field } from './field';
import { Input, Textarea } from './input';
import { Sheet } from './overlays';
import { SearchInput } from './search-input';
import { Switch } from './controls';
import { Text } from './typography';

export type SchemaFieldType = 'boolean' | 'date' | 'number' | 'select' | 'text' | 'textarea';
export interface SchemaField { defaultValue?: unknown; description?: string; disabled?: boolean; label: string; name: string; options?: SelectOption[]; placeholder?: string; required?: boolean; type: SchemaFieldType; }
export interface SchemaFormProps extends Omit<ViewProps, 'onSubmit'> { disabled?: boolean; fields: readonly SchemaField[]; initialValues?: Record<string, unknown>; onSubmit: (values: Record<string, unknown>) => void | Promise<void>; submitLabel?: string; validate?: (values: Record<string, unknown>) => Record<string, string>; }

export function SchemaForm({ disabled, fields, initialValues = {}, onSubmit, style, submitLabel = 'Save', validate, ...props }: SchemaFormProps) {
  const defaults = React.useMemo(() => Object.fromEntries(fields.map((field) => [field.name, initialValues[field.name] ?? field.defaultValue ?? (field.type === 'boolean' ? false : '')])), [fields, initialValues]);
  const [values, setValues] = React.useState<Record<string, unknown>>(defaults);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => setValues(defaults), [defaults]);
  const change = (name: string, value: unknown) => { setValues((current) => ({ ...current, [name]: value })); setErrors((current) => { const next = { ...current }; delete next[name]; return next; }); };
  const submit = async () => {
    const requiredErrors = Object.fromEntries(fields.filter((field) => field.required && (values[field.name] === '' || values[field.name] === null || values[field.name] === undefined)).map((field) => [field.name, `${field.label} is required.`]));
    const nextErrors = { ...requiredErrors, ...validate?.(values) };
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    setSaving(true);
    try { await onSubmit(values); } finally { setSaving(false); }
  };
  return <View style={[styles.form, style]} {...props}>{fields.map((field) => {
    const fieldDisabled = disabled || field.disabled;
    const error = errors[field.name];
    return <Field key={field.name} description={error ?? field.description} error={Boolean(error)} label={field.label} required={field.required}>
      {field.type === 'textarea' ? <Textarea editable={!fieldDisabled} onChangeText={(value) => change(field.name, value)} placeholder={field.placeholder} value={String(values[field.name] ?? '')} /> : null}
      {field.type === 'text' || field.type === 'number' ? <Input editable={!fieldDisabled} keyboardType={field.type === 'number' ? 'numeric' : 'default'} onChangeText={(value) => change(field.name, field.type === 'number' ? Number(value) : value)} placeholder={field.placeholder} value={String(values[field.name] ?? '')} /> : null}
      {field.type === 'select' ? <Select disabled={fieldDisabled} onValueChange={(value) => change(field.name, value)} options={field.options ?? []} placeholder={field.placeholder} value={String(values[field.name] ?? '')} /> : null}
      {field.type === 'boolean' ? <Switch checked={Boolean(values[field.name])} disabled={fieldDisabled} label={field.placeholder} onCheckedChange={(value) => change(field.name, value)} /> : null}
      {field.type === 'date' ? <DatePicker disabled={fieldDisabled} onChange={(value) => change(field.name, value)} placeholder={field.placeholder} value={values[field.name] instanceof Date ? values[field.name] as Date : undefined} /> : null}
    </Field>;
  })}<Button disabled={disabled} fullWidth loading={saving} onPress={() => void submit()}>{submitLabel}</Button></View>;
}

export interface ArrayFieldProps<T> extends ViewProps { createItem: () => T; items: readonly T[]; labelForItem?: (item: T, index: number) => string; onChange: (items: T[]) => void; renderItem: (item: T, index: number, onChange: (item: T) => void) => React.ReactNode; }
export function ArrayField<T>({ createItem, items, labelForItem, onChange, renderItem, style, ...props }: ArrayFieldProps<T>) {
  const [expanded, setExpanded] = React.useState<number | null>(items.length ? 0 : null);
  const move = (index: number, direction: number) => { const target = index + direction; if (target < 0 || target >= items.length) return; const next = [...items]; [next[index], next[target]] = [next[target], next[index]]; onChange(next); setExpanded(target); };
  return <View style={[styles.form, style]} {...props}>
    {items.map((item, index) => <View key={index} style={styles.arrayItem}>
      <Pressable accessibilityRole='button' onPress={() => setExpanded(expanded === index ? null : index)} style={styles.arrayHeader}>
        <Text weight='600' style={styles.grow}>{labelForItem?.(item, index) ?? `Item ${index + 1}`}</Text><Text>{expanded === index ? '−' : '+'}</Text>
      </Pressable>
      {expanded === index ? <View style={styles.arrayBody}>
        {renderItem(item, index, (nextItem) => onChange(items.map((value, itemIndex) => itemIndex === index ? nextItem : value)))}
        <View style={styles.actions}><Button disabled={index === 0} size='xs' variant='ghost' onPress={() => move(index, -1)}>Move up</Button><Button disabled={index === items.length - 1} size='xs' variant='ghost' onPress={() => move(index, 1)}>Move down</Button><Button size='xs' variant='destructive' onPress={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button></View>
      </View> : null}
    </View>)}
    <Button size='sm' variant='outline' onPress={() => { onChange([...items, createItem()]); setExpanded(items.length); }}>Add item</Button>
  </View>;
}

export interface RelationshipOption { description?: string; id: string; image?: ImageSourcePropType; label: string; }
export interface RelationshipFieldProps extends ViewProps { disabled?: boolean; loadOptions: (query: string) => Promise<RelationshipOption[]>; multiple?: boolean; onChange: (value: RelationshipOption[]) => void; placeholder?: string; value?: RelationshipOption[]; }
export function RelationshipField({ disabled, loadOptions, multiple = false, onChange, placeholder = 'Select relationship', style, value = [], ...props }: RelationshipFieldProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [options, setOptions] = React.useState<RelationshipOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => { if (!open) return; let active = true; setLoading(true); const timer = setTimeout(() => void loadOptions(query).then((items) => active && setOptions(items)).finally(() => active && setLoading(false)), 250); return () => { active = false; clearTimeout(timer); }; }, [loadOptions, open, query]);
  const choose = (item: RelationshipOption) => { if (multiple) { if (!value.some((selected) => selected.id === item.id)) onChange([...value, item]); } else { onChange([item]); setOpen(false); } };
  const move = (index: number, direction: number) => { const target = index + direction; if (target < 0 || target >= value.length) return; const next = [...value]; [next[index], next[target]] = [next[target], next[index]]; onChange(next); };
  return <View style={[styles.form, style]} {...props}>{value.map((item, index) => <View key={item.id} style={styles.relationship}>{item.image ? <Image source={item.image} style={styles.thumbnail} /> : null}<View style={styles.grow}><Text weight='500'>{item.label}</Text>{item.description ? <Text size='xs' tone='secondary'>{item.description}</Text> : null}</View>{multiple ? <><Button disabled={index === 0} size='xs' variant='ghost' onPress={() => move(index, -1)}>↑</Button><Button disabled={index === value.length - 1} size='xs' variant='ghost' onPress={() => move(index, 1)}>↓</Button></> : null}<Button size='xs' variant='ghost' onPress={() => onChange(value.filter((selected) => selected.id !== item.id))}>×</Button></View>)}{!disabled ? <Button size='sm' variant='outline' onPress={() => setOpen(true)}>{value.length ? 'Change selection' : placeholder}</Button> : null}<Sheet open={open} onOpenChange={setOpen} title={placeholder}><SearchInput autoFocus onChangeText={setQuery} placeholder='Search…' value={query} />{loading ? <Text tone='secondary'>Loading…</Text> : <ScrollView keyboardShouldPersistTaps='handled'>{options.map((item) => <Pressable accessibilityRole='button' key={item.id} onPress={() => choose(item)} style={styles.option}>{item.image ? <Image source={item.image} style={styles.thumbnail} /> : null}<View style={styles.grow}><Text weight='500'>{item.label}</Text>{item.description ? <Text size='xs' tone='secondary'>{item.description}</Text> : null}</View>{value.some((selected) => selected.id === item.id) ? <Text tone='accent'>✓</Text> : null}</Pressable>)}</ScrollView>}</Sheet></View>;
}

const styles = StyleSheet.create({ actions: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.control }, arrayBody: { gap: spacing.component, padding: spacing.component }, arrayHeader: { alignItems: 'center', flexDirection: 'row', minHeight: 48, paddingHorizontal: spacing.control }, arrayItem: { borderColor: 'rgba(128,128,128,0.22)', borderRadius: 9, borderWidth: 1, overflow: 'hidden' }, form: { gap: spacing.component }, grow: { flex: 1 }, option: { alignItems: 'center', flexDirection: 'row', gap: spacing.control, minHeight: 64, paddingVertical: spacing.control }, relationship: { alignItems: 'center', borderColor: 'rgba(128,128,128,0.22)', borderRadius: 8, borderWidth: 1, flexDirection: 'row', gap: spacing.control, minHeight: 56, padding: spacing.control }, thumbnail: { borderRadius: 6, height: 44, width: 52 } });
