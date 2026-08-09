import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';
import { View } from 'react-native';

import { RichTextEditor, type RichTextDocument } from '../../src/components/rich-text-editor';

const initialValue: RichTextDocument = { root: { children: [{ children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: 'Start writing the article…', type: 'text', version: 1 }], direction: null, format: '', indent: 0, type: 'paragraph', version: 1 }], direction: null, format: '', indent: 0, type: 'root', version: 1 } };

function EditorDemo() {
  const [value, setValue] = React.useState(initialValue);
  return <View style={{ flex: 1, padding: 18 }}><RichTextEditor onChange={setValue} value={value} /></View>;
}

const meta = { title: 'Components/Rich Text Editor', component: EditorDemo, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof EditorDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Editor: Story = {};
