import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { Button, Card, Heading, Stack, Text, ThompsonProvider } from '../../src';

type Target = 'iOS' | 'Android';
type Theme = 'light' | 'dark';
type Density = 'compact' | 'regular';

function TargetFixture({ density, platform, theme }: { density: Density; platform: Target; theme: Theme }) {
  const size = density === 'compact' ? 'sm' : 'md';
  return (
    <ThompsonProvider defaultTheme={theme}>
      <Card accessibilityLabel={`${platform} ${theme} ${density} Kolibri parity fixture`}>
        <Stack gap='control'>
          <Heading level={4}>{platform} · {theme} · {density}</Heading>
          <Text family='secondary' size='sm' tone='secondary'>Sanitized Button consumer fixture; native behavior remains Thompson-owned.</Text>
          <Button accessibilityLabel='Confirm' onPress={() => undefined} size={size}>Confirm</Button>
          <Button accessibilityLabel='Confirm disabled' disabled size={size}>Disabled</Button>
          <Button accessibilityLabel='Confirm loading' loading size={size}>Loading</Button>
          <Text size='xs' tone='muted'>Press the enabled control for its native pressed state. Accessibility focus remains OS-owned.</Text>
        </Stack>
      </Card>
    </ThompsonProvider>
  );
}

function KolibriButtonMatrix() {
  const targets: Array<{ density: Density; platform: Target; theme: Theme }> = [];
  for (const platform of ['iOS', 'Android'] as const) {
    for (const theme of ['light', 'dark'] as const) {
      for (const density of ['compact', 'regular'] as const) targets.push({ density, platform, theme });
    }
  }
  return <View style={{ gap: 16 }}>{targets.map((target) => <TargetFixture key={`${target.platform}-${target.theme}-${target.density}`} {...target} />)}</View>;
}

const meta = {
  title: 'Parity/Kolibri Button contract',
  component: KolibriButtonMatrix
} satisfies Meta<typeof KolibriButtonMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlatformThemeSizeMatrix: Story = {};
