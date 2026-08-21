import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import {
  AttentionSurface,
  AuthShell,
  Button,
  Card,
  DetailLayout,
  Eyebrow,
  FeedColumn,
  FeedColumns,
  FeedGrid,
  Heading,
  PageFrame,
  Stack,
  Text
} from '../../src';

function SampleItems({ prefix }: { prefix: string }) {
  return <Stack gap='control'>{[1, 2, 3, 4, 5, 6].map((item) => <Card key={item} variant='subtle'><Text weight='600'>{prefix} {item}</Text><Text family='secondary' size='sm' tone='secondary'>Independent vertical content for gesture verification.</Text></Card>)}</Stack>;
}

function ParityGallery() {
  return (
    <PageFrame gutter='compact' safeAreaEdges={[]} verticalSpacing='compact' width='content'>
      <Stack gap='group'>
        <Eyebrow rule>Native parity</Eyebrow>
        <AttentionSurface hue={207} intensity={7}><Heading level={4}>Category-aware urgency</Heading><Text tone='secondary'>Deterministic in both themes.</Text></AttentionSurface>
        <FeedGrid minColumnWidth={240}>
          <Card><Text>Adaptive grid item</Text></Card>
          <Card><Text>Adaptive grid item</Text></Card>
        </FeedGrid>
      </Stack>
    </PageFrame>
  );
}

const meta = {
  title: 'Parity/Native layouts',
  component: ParityGallery
} satisfies Meta<typeof ParityGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const AttentionStates: Story = {
  render: () => <Stack gap='component'>{([0, 3, 7, 10] as const).map((intensity) => <AttentionSurface hue={207} intensity={intensity} interactive key={intensity}><Eyebrow rule>Intensity {intensity}</Eyebrow><Text>Press and keyboard-focus this surface.</Text></AttentionSurface>)}<AttentionSurface disabled hue={42} intensity={5} interactive><Text>Disabled attention surface</Text></AttentionSurface></Stack>
};

export const EyebrowVariants: Story = {
  render: () => <Stack gap='component'><Eyebrow tone='accent'>Accent</Eyebrow><Eyebrow rule tone='muted'>Muted with rule</Eyebrow><View style={{ backgroundColor: '#1a374d', padding: 16 }}><Eyebrow rule tone='inverse'>Inverse with rule</Eyebrow></View></Stack>
};

export const AuthCenteredPhone: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <View style={{ height: 640, width: 340 }}><AuthShell breakpoint={Number.MAX_SAFE_INTEGER} brand={<Eyebrow>Red Lion</Eyebrow>} footer='Secure native access'><Stack><Heading level={2}>Welcome back</Heading><Text tone='secondary'>Centered phone access flow.</Text><Button>Continue</Button></Stack></AuthShell></View>
};

export const AuthSplitTablet: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <View style={{ height: 640, width: 900 }}><AuthShell aside={<Stack><Eyebrow tone='inverse'>Thompson</Eyebrow><Heading level={2} style={{ color: '#fff' }}>A composed tablet access flow.</Heading></Stack>} asideLabel='Product introduction' breakpoint={0} layout='split' side='start'><Stack><Heading level={2}>Sign in</Heading><Text tone='secondary'>The access and aside panels render side by side.</Text><Button>Continue</Button></Stack></AuthShell></View>
};

export const DetailPhone: Story = {
  render: () => <DetailLayout breakpoint={Number.MAX_SAFE_INTEGER} sideRail={<Card variant='subtle'><Eyebrow>Context</Eyebrow><Text>Rail collapses into the vertical flow.</Text></Card>}><Stack><Heading level={2}>Primary detail</Heading><SampleItems prefix='Section' /></Stack></DetailLayout>
};

export const DetailTabletPinnedRail: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <View style={{ height: 620, padding: 24, width: 900 }}><DetailLayout breakpoint={0} side='start' sideRail={<SampleItems prefix='Rail' />} sideRailLabel='Related details' sticky viewportHeight={572}><SampleItems prefix='Primary' /></DetailLayout></View>
};

export const FeedPhonePaging: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <View style={{ height: 620, padding: 12, width: 340 }}><FeedColumns minColumnWidth={340}>{['World', 'Business', 'Science'].map((title, index) => <FeedColumn accent={['#5ba3f5', '#d4af37', '#d47b75'][index]} count={6} key={title} title={title}><SampleItems prefix={title} /></FeedColumn>)}</FeedColumns></View>
};

export const FeedTabletColumns: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <View style={{ height: 620, padding: 12, width: 900 }}><FeedColumns minColumnWidth={280}>{['World', 'Business', 'Science'].map((title, index) => <FeedColumn accent={['#5ba3f5', '#d4af37', '#d47b75'][index]} count={6} key={title} title={title}><SampleItems prefix={title} /></FeedColumn>)}</FeedColumns></View>
};

export const AdaptiveFeedGrid: Story = {
  render: () => <FeedGrid minColumnWidth={220}>{[1, 2, 3, 4].map((item) => <Card key={item}><Heading level={4}>Item {item}</Heading><Text tone='secondary'>Minimum usable width is preserved.</Text></Card>)}</FeedGrid>
};

export const PageFrameVariants: Story = {
  render: () => <Stack gap='component'>{(['reading', 'content', 'wide', 'full'] as const).map((width) => <PageFrame gutter='compact' key={width} safeAreaEdges={[]} verticalSpacing='compact' width={width}><Card variant='outlined'><Text>{width} width</Text></Card></PageFrame>)}</Stack>
};
