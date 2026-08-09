import type { Meta, StoryObj } from '@storybook/react-native';
import React from 'react';

import {
  AlertDialog,
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sheet,
  Stack,
  Text,
  Toaster,
  toast
} from '../../src';

function OverlayGallery() {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(true);
  return <Stack gap='group'>
    <Button onPress={() => setSheetOpen(true)}>Open bottom sheet</Button>
    <Button variant='outline' onPress={() => setDialogOpen(true)}>Open alert dialog</Button>
    <Button variant='subtle' onPress={() => toast.success('Saved', 'The native toast store is working.')}>Show toast</Button>
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant='outline'>Compound action menu</Button></DropdownMenuTrigger>
      <DropdownMenuContent title='Article actions'>
        <DropdownMenuLabel><Text size='xs' tone='secondary' weight='600'>PUBLISHING</Text></DropdownMenuLabel>
        <DropdownMenuItem>Publish now</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>Featured</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Text tone='danger'>Delete</Text></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title='Native sheet'><Text tone='secondary'>Sheets anchor to the selected edge and respect mobile touch targets.</Text></Sheet>
    <AlertDialog destructive onConfirm={() => setDialogOpen(false)} onOpenChange={setDialogOpen} open={dialogOpen} title='Delete this article?' description='This action cannot be undone.' />
    <Toaster />
  </Stack>;
}

const meta = { title: 'Components/Overlays', component: OverlayGallery } satisfies Meta<typeof OverlayGallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {};
