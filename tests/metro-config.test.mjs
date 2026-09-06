import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const metroWatchFolders = require('../example/metro-watch-folders.cjs');

test('Metro does not require a sibling Bleecker checkout', () => {
  assert.deepEqual(metroWatchFolders('/workspace/thompson', () => false), ['/workspace/thompson']);
});

test('Metro watches a sibling Bleecker checkout when local parity work provides it', () => {
  assert.deepEqual(metroWatchFolders('/workspace/thompson', () => true), [
    '/workspace/thompson',
    '/workspace/bleecker'
  ]);
});
