import React from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { DataTable, type DataTableColumn, type DataTableProps } from './data-table';
import { Text } from './typography';

export interface SortState { field: string; order: 'asc' | 'desc'; }
export interface SortableTableHeaderProps extends ViewProps { align?: 'left' | 'center' | 'right'; currentSort?: SortState; field: string; label: string; onSort?: (sort: SortState) => void; sortable?: boolean; }
export function SortableTableHeader({ align = 'left', currentSort, field, label, onSort, sortable = true, style, ...props }: SortableTableHeaderProps) {
  const active = currentSort?.field === field;
  const nextOrder = active && currentSort.order === 'asc' ? 'desc' : 'asc';
  return <Pressable accessibilityRole='button' disabled={!sortable} onPress={() => onSort?.({ field, order: nextOrder })} style={[styles.header, { justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start' }, style]} {...props}><Text size='xs' tone={active ? 'accent' : 'secondary'} weight='600'>{label.toUpperCase()} {active ? currentSort.order === 'asc' ? '↑' : '↓' : ''}</Text></Pressable>;
}

export interface TableProps<T = Record<string, unknown>> extends DataTableProps<T> {}
export interface ColumnDef<TData> extends DataTableColumn<TData> {}
export const Table = DataTable;
export { DataTable };
export type { DataTableColumn, DataTableProps };

const styles = StyleSheet.create({ header: { alignItems: 'center', flexDirection: 'row', minHeight: 44 } });
