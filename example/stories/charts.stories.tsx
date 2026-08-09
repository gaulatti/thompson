import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { AreaChart, BarChart, DonutChart, FunnelChart, LineChart, RadarChart, Stack } from '../../src';

const timeSeries = [
  { month: 'Jan', revenue: 32, volume: 20 },
  { month: 'Feb', revenue: 48, volume: 35 },
  { month: 'Mar', revenue: 41, volume: 44 },
  { month: 'Apr', revenue: 67, volume: 52 },
  { month: 'May', revenue: 74, volume: 61 },
  { month: 'Jun', revenue: 88, volume: 70 }
];
const series = [{ key: 'revenue', name: 'Revenue' }, { key: 'volume', name: 'Volume' }];

function ChartGallery() {
  return (
    <Stack gap='group'>
      <LineChart data={timeSeries} height={220} series={series} xAxisKey='month' />
      <AreaChart data={timeSeries} height={220} series={series} xAxisKey='month' />
      <BarChart data={timeSeries} height={220} series={series} xAxisKey='month' />
      <DonutChart data={[{ name: 'Direct', value: 44 }, { name: 'Search', value: 31 }, { name: 'Social', value: 25 }]} centerLabel='Traffic' centerValue='18.4k' height={260} />
      <RadarChart data={[{ subject: 'Speed', score: 82 }, { subject: 'Quality', score: 94 }, { subject: 'Reach', score: 69 }, { subject: 'Trust', score: 88 }]} height={280} series={[{ key: 'score', name: 'Score', fill: true }]} subjectKey='subject' />
      <FunnelChart data={[{ name: 'Viewed', value: 1000 }, { name: 'Engaged', value: 620 }, { name: 'Converted', value: 210 }]} height={240} />
    </Stack>
  );
}

const meta = { title: 'Data Visualization/Charts', component: ChartGallery } satisfies Meta<typeof ChartGallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Gallery: Story = {};
