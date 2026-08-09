import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import { Checkbox, DatePicker, Field, FileInput, Input, RadioGroup, Select, Slider, Stack, Switch, Text, Textarea, Toggle, type PickedFile } from '../../src';

function FormsGallery() {
  const [checked, setChecked] = React.useState(true);
  const [notifications, setNotifications] = React.useState(false);
  const [plan, setPlan] = React.useState('standard');
  const [pressed, setPressed] = React.useState(false);
  return (
    <Stack gap='group'>
      <Field label='Email address' description='Used for account notifications.' required>
        <Input autoCapitalize='none' keyboardType='email-address' placeholder='you@example.com' />
      </Field>
      <Field label='Biography' optional>
        <Textarea placeholder='Tell us a little about yourself.' />
      </Field>
      <Field label='Invalid field' error='This value needs attention.'>
        <Input error value='Incorrect value' />
      </Field>
      <Checkbox checked={checked} description='Keep this device signed in.' label='Remember me' onCheckedChange={setChecked} />
      <Switch checked={notifications} label='Push notifications' onCheckedChange={setNotifications} />
      <RadioGroup
        value={plan}
        onValueChange={setPlan}
        options={[
          { label: 'Standard', description: 'For individual projects.', value: 'standard' },
          { label: 'Studio', description: 'For collaborative teams.', value: 'studio' }
        ]}
      />
      <Toggle pressed={pressed} onPressedChange={setPressed} variant='outline'>Pinned</Toggle>
    </Stack>
  );
}

const meta = {
  title: 'Components/Forms',
  component: FormsGallery
} satisfies Meta<typeof FormsGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {};

export const TextInputs: Story = {
  render: () => (
    <Stack gap='component'>
      <Field label='Small input'><Input inputSize='sm' placeholder='Small' /></Field>
      <Field label='Default input' required description='Supporting copy can clarify what belongs here.'><Input placeholder='Default' /></Field>
      <Field label='Large input' optional><Input inputSize='lg' placeholder='Large' /></Field>
      <Field label='Disabled'><Input editable={false} value='Read only value' /></Field>
      <Field label='Biography'><Textarea placeholder='Write a short biography…' /></Field>
      <Field label='Validation' error='Enter a valid email address.'><Input error value='not-an-email' /></Field>
    </Stack>
  )
};

function SelectionDemo() {
  const [checked, setChecked] = React.useState(false);
  const [enabled, setEnabled] = React.useState(true);
  const [value, setValue] = React.useState('monthly');
  return (
    <Stack gap='group'>
      <Checkbox checked={checked} label='Remember this device' description='Keep your session active for 30 days.' onCheckedChange={setChecked} />
      <Checkbox checked={false} disabled label='Unavailable option' />
      <Switch checked={enabled} label='Email notifications' onCheckedChange={setEnabled} />
      <RadioGroup
        value={value}
        onValueChange={setValue}
        options={[
          { value: 'monthly', label: 'Monthly', description: 'Flexible billing.' },
          { value: 'annual', label: 'Annual', description: 'Save 20%.' },
          { value: 'legacy', label: 'Legacy', description: 'No longer available.', disabled: true }
        ]}
      />
    </Stack>
  );
}

export const SelectionControls: Story = { render: () => <SelectionDemo /> };

function NativeInputsDemo() {
  const [date, setDate] = React.useState<Date>();
  const [status, setStatus] = React.useState('draft');
  const [priority, setPriority] = React.useState(35);
  const [files, setFiles] = React.useState<PickedFile[]>([]);
  return <Stack gap='group'>
    <Field label='Publication date'><DatePicker onChange={setDate} value={date} /></Field>
    <Field label='Status'><Select onValueChange={setStatus} options={[{ label: 'Draft', value: 'draft' }, { label: 'Scheduled', value: 'scheduled' }, { label: 'Published', value: 'published' }]} value={status} /></Field>
    <Field label='Priority' description={`Current value: ${priority}`}><Slider onValueChange={setPriority} step={5} value={priority} /></Field>
    <Field label='Attachment'><FileInput files={files} onFilesChange={setFiles} onPick={async () => ({ name: 'brief.pdf', uri: 'file:///brief.pdf', mimeType: 'application/pdf' })} /></Field>
    <Text size='xs' tone='secondary'>These controls use native date, gesture, sheet, and picker-adapter behavior.</Text>
  </Stack>;
}

export const NativeInputs: Story = { render: () => <NativeInputsDemo /> };
