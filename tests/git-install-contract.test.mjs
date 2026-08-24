import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const manifest = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8')
);
const lockfile = JSON.parse(
  fs.readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8')
);

test('git consumers can prepare Thompson without a sibling Bleecker checkout', () => {
  const bleeckerVersion = manifest.devDependencies['@gaulatti/bleecker'];

  assert.match(bleeckerVersion, /^\d+\.\d+\.\d+$/);
  assert.equal(manifest.scripts.prepare, 'npm run build');
  assert.ok(manifest.files.includes('dist'));
  assert.equal(
    lockfile.packages['node_modules/@gaulatti/bleecker'].version,
    bleeckerVersion
  );
  assert.match(
    lockfile.packages['node_modules/@gaulatti/bleecker'].resolved,
    /^https:\/\/registry\.npmjs\.org\//
  );
});
