import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storiesRoot = path.join(root, 'example/stories');
const required = [
  'Accordion', 'AdminShell', 'Alert', 'AlertDialog', 'AppShell', 'AttentionSurface', 'AuthShell', 'Button', 'Card', 'Checkbox',
  'DataTable', 'DatePicker', 'DropdownMenu', 'Empty', 'ErrorState', 'Field', 'FileInput',
  'DetailLayout', 'Eyebrow', 'FeedColumn', 'FeedColumns', 'FeedGrid', 'Header', 'IconButton', 'Input', 'LoadingSpinner', 'MediaGrid', 'Modal', 'PageFrame', 'PageHeader',
  'Progress', 'RadioGroup', 'RelationshipField', 'ResourceList', 'SchemaForm', 'Select',
  'Sheet', 'Skeleton', 'Slider', 'Switch', 'Tabs', 'Textarea', 'Toaster', 'Toggle'
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

const storyFiles = walk(storiesRoot).filter((file) => file.endsWith('.stories.tsx'));
const source = storyFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const missing = required.filter((name) => !new RegExp(`\\b${name}\\b`).test(source));

console.log(`[check-story-coverage] ${required.length - missing.length}/${required.length} production-critical native components are exercised by Storybook.`);
if (missing.length) {
  console.error(`[check-story-coverage] Missing: ${missing.join(', ')}`);
  process.exitCode = 1;
}
