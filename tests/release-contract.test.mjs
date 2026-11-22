import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
}

test('CI enforces the complete repository and package gates with pinned actions', () => {
  const workflow = read('.github/workflows/ci.yml');
  for (const command of ['npm ci', 'npm run check', 'npm run check:package', 'npm run storybook:export']) {
    assert.ok(workflow.includes(command), `CI is missing ${command}`);
  }
  const actionRefs = [...workflow.matchAll(/uses:\s+[^@\s]+@([^\s]+)/g)].map((match) => match[1]);
  assert.ok(actionRefs.length > 0);
  assert.ok(actionRefs.every((reference) => /^[a-f0-9]{40}$/.test(reference)), 'CI actions must use full commit SHAs');
});

test('publish workflow releases from a v* tag like the other gaulatti packages', () => {
  const workflow = read('.github/workflows/publish.yml');
  assert.match(workflow, /tags:\s*\n\s*- 'v\*'/);
  assert.match(workflow, /environment:\s+thompson/);
  assert.match(workflow, /id-token:\s+write/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run check:package/);
  assert.match(workflow, /npm publish --access public --provenance/);
  assert.equal([...workflow.matchAll(/secrets\./g)].length, 1, 'only the first-publish bootstrap token is allowed');

  const actionRefs = [...workflow.matchAll(/uses:\s+[^@\s]+@([^\s]+)/g)].map((match) => match[1]);
  assert.ok(actionRefs.length > 0);
  assert.ok(actionRefs.every((reference) => /^[a-f0-9]{40}$/.test(reference)), 'publish actions must use full commit SHAs');
});

test('release operations and rollback are documented', () => {
  const guide = read('docs/RELEASING.md');
  for (const boundary of ['Semantic versioning', 'Compatibility', 'Trusted publishing', 'Immutable releases', 'Rollback']) {
    assert.ok(guide.includes(boundary), `release guide is missing ${boundary}`);
  }
  assert.match(guide, /npm deprecate @gaulatti\/thompson@<version>/);
  assert.match(guide, /do not unpublish/);
});

test('package verification includes a literal dry run and deterministic real packs', () => {
  const verifier = read('scripts/verify-package.mjs');
  assert.match(verifier, /--dry-run/);
  assert.match(verifier, /successive package tarballs differ/);
  assert.match(verifier, /export target is missing from package/);
});

test('registry consumer rejects non-registry and mismatched lock resolutions', async () => {
  const { assertRegistryResolution } = await import('../scripts/verify-consumer.mjs');
  const version = '0.1.0';
  const integrity = `sha512-${Buffer.from('expected Thompson artifact').toString('base64')}`;
  const valid = {
    version,
    resolved: `https://registry.npmjs.org/@gaulatti/thompson/-/thompson-${version}.tgz`,
    integrity
  };

  assert.doesNotThrow(() => assertRegistryResolution(valid, version, integrity));
  assert.throws(
    () => assertRegistryResolution({ ...valid, resolved: 'file:../thompson.tgz' }, version, integrity),
    /did not use HTTPS/
  );
  assert.throws(
    () => assertRegistryResolution({ ...valid, resolved: 'https://github.com/gaulatti/thompson/archive/main.tar.gz' }, version, integrity),
    /public npm registry/
  );
  assert.throws(
    () => assertRegistryResolution({ ...valid, version: '0.1.1' }, version, integrity),
    /different Thompson version/
  );
  assert.throws(
    () => assertRegistryResolution({ ...valid, integrity: `sha512-${Buffer.from('other artifact').toString('base64')}` }, version, integrity),
    /different Thompson artifact/
  );
  assert.throws(() => assertRegistryResolution(valid, '^0.1.0', integrity), /exact semver/);
});
