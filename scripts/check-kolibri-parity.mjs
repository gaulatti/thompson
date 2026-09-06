import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureFile = path.join(root, 'contracts/kolibri/button-consumer-fixture.json');
const classificationFile = path.join(root, 'contracts/kolibri/button-classification.json');
const snapshotFile = path.join(root, 'contracts/kolibri/button-parity.snapshots.json');

export const KOLIBRI_PIN = Object.freeze({
  repository: 'gaulatti/kolibri',
  visibility: 'private',
  releaseVersion: '0.1.0',
  mergeCommit: 'f14a631a001f867e208be6053ac07df32fda4dca',
  manifestSha256: 'aec1a74fb557ab0a5d254b5ac8d98306e552dc88cdb6ebeeb6f98d1460cfe134',
  representativeArtifactSha256: 'bcfe71af11ba80eb7a7bcf28fd3c1489fe1167bb8451549d5cb3bd74c17c4c6e'
});

const classificationKinds = new Set(['exact', 'adapted', 'platform-exception', 'unsupported']);
const exactKeys = (value, expected, location) => {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${location} must be an object`);
  assert.deepEqual(Object.keys(value).sort(), [...expected].sort(), `${location} has unexplained contract drift`);
};
const unique = (values, location) => assert.equal(new Set(values).size, values.length, `${location} must be unique`);

export const sha256 = (content) => createHash('sha256').update(content).digest('hex');

export function validateFixture(fixture) {
  exactKeys(fixture, ['fixtureFormat', 'provenance', 'component'], '$');
  assert.equal(fixture.fixtureFormat, 'thompson-kolibri-consumer-fixture@1');
  exactKeys(fixture.provenance, ['kind', 'privateMaterialCopied', 'upstream'], '$.provenance');
  assert.equal(fixture.provenance.kind, 'sanitized-consumer-fake');
  assert.equal(fixture.provenance.privateMaterialCopied, false);
  exactKeys(fixture.provenance.upstream, Object.keys(KOLIBRI_PIN), '$.provenance.upstream');
  assert.deepEqual(fixture.provenance.upstream, KOLIBRI_PIN);

  const component = fixture.component;
  exactKeys(component, ['id', 'family', 'kind', 'label', 'parts', 'tokens', 'variants', 'states', 'events', 'actions', 'assets'], '$.component');
  assert.equal(component.id, 'thompson.action');
  assert.equal(component.family, 'Button');
  assert.equal(component.kind, 'atom');
  assert.equal(typeof component.label, 'string');
  assert(component.label.length > 0);
  for (const [key, expectedKeys] of [
    ['parts', ['id', 'semanticRole']],
    ['tokens', ['id', 'role']],
    ['events', ['name', 'actionId']],
    ['actions', ['id', 'type']]
  ]) {
    assert(Array.isArray(component[key]), `$.component.${key} must be an array`);
    component[key].forEach((item, index) => exactKeys(item, expectedKeys, `$.component.${key}[${index}]`));
  }
  assert(Array.isArray(component.variants));
  assert(Array.isArray(component.states));
  assert(Array.isArray(component.assets));
  unique(component.parts.map(({ id }) => id), '$.component.parts');
  unique(component.tokens.map(({ id }) => id), '$.component.tokens');
  unique(component.variants, '$.component.variants');
  unique(component.states, '$.component.states');
  unique(component.events.map(({ name }) => name), '$.component.events');
  unique(component.actions.map(({ id }) => id), '$.component.actions');
  const actionIds = new Set(component.actions.map(({ id }) => id));
  for (const event of component.events) assert(actionIds.has(event.actionId), `missing action ${event.actionId}`);
  assert.deepEqual(component.assets, [], 'the sanitized fixture must not publish private assets');
  return fixture;
}

export function fixtureCoveragePaths(fixture) {
  const component = fixture.component;
  return [
    'component.id',
    'component.family',
    'component.kind',
    'component.label',
    ...component.parts.map(({ id }) => `component.parts.${id}`),
    ...component.tokens.map(({ id }) => `component.tokens.${id}`),
    ...component.variants.map((value) => `component.variants.${value}`),
    ...component.states.map((value) => `component.states.${value}`),
    ...component.events.map(({ name }) => `component.events.${name}`),
    ...component.actions.map(({ id }) => `component.actions.${id}`),
    'component.assets'
  ].sort();
}

export function validateClassification(mapping, fixture, fixtureDigest) {
  exactKeys(mapping, ['schemaVersion', 'fixtureSha256', 'targetPublicApi', 'classifications', 'matrix', 'adapters'], '$mapping');
  assert.equal(mapping.schemaVersion, 1);
  assert.equal(mapping.fixtureSha256, fixtureDigest, 'sanitized fixture checksum drift');
  assert.equal(mapping.targetPublicApi, '@gaulatti/thompson Button');
  assert(Array.isArray(mapping.classifications));
  for (const [index, item] of mapping.classifications.entries()) {
    exactKeys(item, ['source', 'classification', 'target', 'rationale'], `$mapping.classifications[${index}]`);
    assert(classificationKinds.has(item.classification), `unsupported classification: ${item.classification}`);
    assert(item.target.length > 0 && item.rationale.length > 0, `${item.source} must be explained`);
  }
  unique(mapping.classifications.map(({ source }) => source), '$mapping.classifications');
  assert.deepEqual(mapping.classifications.map(({ source }) => source).sort(), fixtureCoveragePaths(fixture));
  assert.deepEqual([...new Set(mapping.classifications.map(({ classification }) => classification))].sort(), [...classificationKinds].sort());
  exactKeys(mapping.matrix, ['platforms', 'themes', 'sizes', 'states'], '$mapping.matrix');
  assert.deepEqual(mapping.matrix.platforms, ['ios', 'android']);
  assert.deepEqual(mapping.matrix.themes, ['light', 'dark']);
  assert.deepEqual(mapping.matrix.sizes, ['compact', 'regular']);
  assert.deepEqual(mapping.matrix.states, ['default', 'pressed', 'disabled', 'loading', 'focused']);
  exactKeys(mapping.adapters, ['sizes', 'foregroundTokens', 'event'], '$mapping.adapters');
  assert.deepEqual(Object.keys(mapping.adapters.sizes), mapping.matrix.sizes);
  assert.deepEqual(Object.keys(mapping.adapters.foregroundTokens), mapping.matrix.themes);
  assert.deepEqual(mapping.adapters.event, { source: 'press', target: 'onPress', actionId: 'activate' });
  return mapping;
}

function stateSnapshot(state) {
  return {
    accessibilityState: {
      busy: state === 'loading',
      disabled: state === 'disabled' || state === 'loading'
    },
    activation: state === 'disabled' || state === 'loading' ? 'blocked' : 'emit:activate',
    visualState: state,
    focusOwner: state === 'focused' ? 'native-os' : null
  };
}

export function buildSnapshots(fixture, mapping) {
  const snapshots = [];
  for (const platform of mapping.matrix.platforms) {
    for (const theme of mapping.matrix.themes) {
      for (const size of mapping.matrix.sizes) {
        snapshots.push({
          target: `${platform}/${theme}/${size}`,
          platform,
          theme,
          density: size,
          component: 'Button',
          props: {
            accessibilityLabel: fixture.component.label,
            accessibilityRole: 'button',
            size: mapping.adapters.sizes[size],
            variant: fixture.component.variants[0]
          },
          tokens: {
            background: 'theme.colors.sea',
            foreground: mapping.adapters.foregroundTokens[theme],
            radius: 'radii.button'
          },
          states: Object.fromEntries(mapping.matrix.states.map((state) => [state, stateSnapshot(state)]))
        });
      }
    }
  }
  return { schemaVersion: 1, snapshots };
}

export function activateSnapshot(snapshot, state, emit) {
  const stateContract = snapshot.states[state];
  assert(stateContract, `unknown snapshot state: ${state}`);
  if (stateContract.activation === 'blocked') return false;
  emit('activate');
  return true;
}

export async function loadParityProof() {
  const [fixtureContent, classificationContent, snapshotContent] = await Promise.all([
    readFile(fixtureFile, 'utf8'),
    readFile(classificationFile, 'utf8'),
    readFile(snapshotFile, 'utf8')
  ]);
  const fixture = validateFixture(JSON.parse(fixtureContent));
  const mapping = validateClassification(JSON.parse(classificationContent), fixture, sha256(fixtureContent));
  const snapshots = JSON.parse(snapshotContent);
  assert.deepEqual(snapshots, buildSnapshots(fixture, mapping), 'committed native snapshots drifted');
  return { fixture, mapping, snapshots };
}

export async function checkButtonOwnership() {
  const [buttonSource, barrelSource] = await Promise.all([
    readFile(path.join(root, 'src/components/button.tsx'), 'utf8'),
    readFile(path.join(root, 'src/index.ts'), 'utf8')
  ]);
  assert.match(buttonSource, /accessibilityRole='button'/);
  assert.match(buttonSource, /accessibilityState=\{\{ busy: loading, disabled: blocked \}\}/);
  assert.match(buttonSource, /disabled=\{blocked\}/);
  assert.match(buttonSource, /onPress=\{onPress\}/);
  assert.match(buttonSource, /state\.pressed && styles\.pressed/);
  assert.match(barrelSource, /export \* from '\.\/components\/button'/);
}

export async function runCheck() {
  const { fixture, mapping, snapshots } = await loadParityProof();
  await checkButtonOwnership();
  console.log(
    `[kolibri-parity] ${fixture.component.family}: ${mapping.classifications.length}/${mapping.classifications.length} fields classified; ` +
      `${snapshots.snapshots.length} deterministic native snapshots; private-material-copied=false`
  );
}

const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedFile === fileURLToPath(import.meta.url)) {
  await runCheck();
}
