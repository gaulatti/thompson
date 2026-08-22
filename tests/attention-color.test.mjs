import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { createAttentionColor } from '../dist/utils/attention-color.js';

test('clamps intensity while preserving Bleecker progression values', () => {
  const low = createAttentionColor({ hue: 210, intensity: -4 });
  const high = createAttentionColor({ hue: 210, intensity: 14 });
  assert.equal(low.intensity, 0);
  assert.equal(low.redMix, 0);
  assert.equal(low.coverage, 24);
  assert.equal(high.intensity, 10);
  assert.equal(high.redMix, 100);
  assert.equal(high.coverage, 96);
});

test('normalizes hue and produces deterministic theme-aware surfaces', () => {
  const wrapped = createAttentionColor({ hue: -30, intensity: 6 });
  const normalized = createAttentionColor({ hue: 330, intensity: 6 });
  const dark = createAttentionColor({ colorScheme: 'dark', hue: 330, intensity: 6 });
  assert.deepEqual(wrapped, normalized);
  assert.equal(wrapped.accent, dark.accent);
  assert.notEqual(wrapped.style.backgroundColor, dark.style.backgroundColor);
});

test('build emits every strict-parity leaf module', () => {
  for (const modulePath of [
    'components/attention-surface',
    'components/eyebrow',
    'layout/auth-shell',
    'layout/detail-layout',
    'layout/feed-column',
    'layout/feed-grid',
    'layout/page-frame',
    'utils/attention-color'
  ]) {
    assert.equal(fs.existsSync(new URL(`../dist/${modulePath}.js`, import.meta.url)), true, modulePath);
    assert.equal(fs.existsSync(new URL(`../dist/${modulePath}.d.ts`, import.meta.url)), true, modulePath);
  }
});

test('every emitted relative ESM path resolves to a packed file', () => {
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryUrl = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
      if (entry.isDirectory()) visit(entryUrl);
      else if (entry.name.endsWith('.js')) files.push(entryUrl);
    }
  };
  visit(new URL('../dist/', import.meta.url));

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/(?:from\s+|import\s*)['"](\.\.?\/[^'"]+)['"]/g)) {
      assert.equal(fs.existsSync(new URL(match[1], file)), true, `${file.pathname}: ${match[1]}`);
    }
  }
});
