import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  KOLIBRI_PIN,
  activateSnapshot,
  buildSnapshots,
  checkButtonOwnership,
  fixtureCoveragePaths,
  loadParityProof,
  validateFixture
} from '../scripts/check-kolibri-parity.mjs';

test('pins a sanitized fixture without copying private Kolibri material', async () => {
  const { fixture } = await loadParityProof();
  assert.equal(fixture.provenance.privateMaterialCopied, false);
  assert.deepEqual(fixture.provenance.upstream, KOLIBRI_PIN);
  assert.deepEqual(fixture.component.assets, []);
});

test('fails closed on fixture shape or immutable provenance drift', async () => {
  const { fixture } = await loadParityProof();
  assert.throws(() => validateFixture({ ...fixture, surprise: true }), /unexplained contract drift/);
  assert.throws(
    () => validateFixture({
      ...fixture,
      provenance: {
        ...fixture.provenance,
        upstream: { ...fixture.provenance.upstream, mergeCommit: '0'.repeat(40) }
      }
    })
  );
});

test('classifies every selected field, part, token, state, event, action, and asset boundary', async () => {
  const { fixture, mapping } = await loadParityProof();
  assert.deepEqual(mapping.classifications.map(({ source }) => source).sort(), fixtureCoveragePaths(fixture));
  assert.deepEqual(
    [...new Set(mapping.classifications.map(({ classification }) => classification))].sort(),
    ['adapted', 'exact', 'platform-exception', 'unsupported']
  );
});

test('keeps iOS and Android snapshots deterministic across themes and sizes', async () => {
  const { fixture, mapping, snapshots } = await loadParityProof();
  assert.deepEqual(buildSnapshots(fixture, mapping), snapshots);
  assert.deepEqual(buildSnapshots(fixture, mapping), buildSnapshots(fixture, mapping));
  assert.equal(snapshots.snapshots.length, 8);
  assert.deepEqual(new Set(snapshots.snapshots.map(({ platform }) => platform)), new Set(['ios', 'android']));
  assert.deepEqual(new Set(snapshots.snapshots.map(({ theme }) => theme)), new Set(['light', 'dark']));
  assert.deepEqual(new Set(snapshots.snapshots.map(({ density }) => density)), new Set(['compact', 'regular']));
});

test('maps activation and accessibility without bypassing disabled or loading state', async () => {
  const { snapshots } = await loadParityProof();
  for (const snapshot of snapshots.snapshots) {
    assert.equal(snapshot.props.accessibilityRole, 'button');
    const emitted = [];
    assert.equal(activateSnapshot(snapshot, 'default', (action) => emitted.push(action)), true);
    assert.equal(activateSnapshot(snapshot, 'pressed', (action) => emitted.push(action)), true);
    assert.equal(activateSnapshot(snapshot, 'focused', (action) => emitted.push(action)), true);
    assert.equal(activateSnapshot(snapshot, 'disabled', (action) => emitted.push(action)), false);
    assert.equal(activateSnapshot(snapshot, 'loading', (action) => emitted.push(action)), false);
    assert.deepEqual(emitted, ['activate', 'activate', 'activate']);
    assert.deepEqual(snapshot.states.disabled.accessibilityState, { busy: false, disabled: true });
    assert.deepEqual(snapshot.states.loading.accessibilityState, { busy: true, disabled: true });
    assert.equal(snapshot.states.focused.focusOwner, 'native-os');
  }
});

test('keeps the existing Thompson Button as public behavior and accessibility owner', async () => {
  await checkButtonOwnership();
  const source = await readFile(new URL('../src/components/button.tsx', import.meta.url), 'utf8');
  assert.match(source, /const blocked = disabled \|\| loading/);
  assert.match(source, /React\.Children\.map\(children/);
});
