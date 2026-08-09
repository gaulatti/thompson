import type { MetricFormat } from '@gaulatti/bleecker/core';
import { formatCompactNumber, formatCurrency, formatNumber, formatPercent } from '@gaulatti/bleecker/core';
import React from 'react';
import type { TextProps } from 'react-native';

import { Text } from './typography';

export type { MetricFormat } from '@gaulatti/bleecker/core';

export interface MetricProps extends TextProps {
  currency?: string;
  decimals?: number;
  format?: MetricFormat;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  value: number | null | undefined;
}

export function Metric({ currency = 'USD', decimals, format = 'number', prefix, suffix, value, ...props }: MetricProps) {
  const options = decimals === undefined ? {} : { maximumFractionDigits: decimals, minimumFractionDigits: decimals };
  const formatted = {
    compact: () => formatCompactNumber(value, options),
    currency: () => formatCurrency(value, currency, options),
    number: () => formatNumber(value, options),
    percent: () => formatPercent(value, options)
  }[format]();
  return <Text weight='600' {...props}>{prefix}{formatted}{suffix}</Text>;
}
