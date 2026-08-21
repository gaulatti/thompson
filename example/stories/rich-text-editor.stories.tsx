import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { RichTextEditor, type RichTextDocument, type RichTextNode } from '../../src';

const text = (value: string, format = 0): RichTextNode => ({ detail: 0, format, mode: 'normal', style: '', text: value, type: 'text', version: 1 });
const paragraph = (value: string, format = 0): RichTextNode => ({ children: [text(value, format)], direction: null, format: '', indent: 0, type: 'paragraph', version: 1 });
const documentWith = (...children: RichTextNode[]): RichTextDocument => ({ root: { children, direction: null, format: '', indent: 0, type: 'root', version: 1 } });

const ordinary = documentWith(paragraph('Start writing the article…'), paragraph('Bold newsroom context', 1));
const simple = documentWith(paragraph('Before the embed'), { type: 'block', version: 1, fields: { blockType: 'youtubeVideo', videoId: 'dQw4w9WgXcQ' } }, { type: 'block', version: 1, fields: { blockType: 'pullQuote', quote: 'A representative pull quote', attribution: 'Fictional source' } });
const complex = documentWith(
  { type: 'block', version: 1, fields: { blockType: 'keyPoints', title: 'Key Points', points: ['First point', 'Second point'] } },
  { type: 'block', version: 1, fields: { blockType: 'relatedLinks', title: 'Related Coverage', links: [{ label: 'Earlier report', url: 'https://example.com/report' }] } },
  { type: 'block', version: 1, fields: { blockType: 'dataTable', caption: 'Example data', headers: [{ value: 'Name' }, { value: 'Value' }], rows: [{ cells: [{ value: 'Alpha' }, { value: '10' }] }] } },
  { type: 'block', version: 1, fields: { blockType: 'liveUpdate', timestamp: '2026-08-20T20:00:00.000Z', headline: 'Latest update', html: '<p>Verified details.</p>' } }
);
const unknown = documentWith(paragraph('Known content remains intact.'), { type: 'future-node', version: 9, payload: { preserved: true } }, { type: 'block', version: 1, fields: { blockType: 'futureComponent', value: 'Preserve me' } });
const malformed = { root: { children: 'not-an-array', type: 'root', version: 1 } } as unknown as RichTextDocument;

function EditorDemo({ initialValue = ordinary }: { initialValue?: RichTextDocument }) {
  const [value, setValue] = React.useState(initialValue);
  return <View style={{ flex: 1, padding: 18 }}><RichTextEditor articleComponents onChange={setValue} value={value} /></View>;
}

const meta = { title: 'Components/Rich Text Editor', component: EditorDemo, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof EditorDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const OrdinaryFormatting: Story = {};
export const SimpleComponents: Story = { args: { initialValue: simple } };
export const ComplexComponents: Story = { args: { initialValue: complex } };
export const UnknownContent: Story = { args: { initialValue: unknown } };
export const MalformedContent: Story = { args: { initialValue: malformed } };
