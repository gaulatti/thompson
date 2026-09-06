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

test('release workflow preserves one artifact and exact commit across npm and GitHub', () => {
  const workflow = read('.github/workflows/release.yml');
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /environment:\s+npm-release/);
  assert.match(workflow, /id-token:\s+write/);
  assert.match(workflow, /contents:\s+write/);
  assert.match(workflow, /NODE_AUTH_TOKEN:\s+\$\{\{ secrets\.NPM_TOKEN \}\}/);
  assert.equal([...workflow.matchAll(/secrets\./g)].length, 1, 'only the protected bootstrap token is allowed');
  assert.match(workflow, /immutable-releases/);
  assert.match(workflow, /--target "\$GITHUB_SHA"/);
  assert.match(workflow, /npm run check:package/);
  assert.match(workflow, /npm run storybook:export/);

  const draft = workflow.indexOf('gh release create');
  const npmPublish = workflow.indexOf('npm publish');
  const publishRelease = workflow.indexOf('gh release edit');
  assert.ok(draft > -1 && draft < npmPublish && npmPublish < publishRelease, 'release order must be draft, npm, immutable release');

  const actionRefs = [...workflow.matchAll(/uses:\s+[^@\s]+@([^\s]+)/g)].map((match) => match[1]);
  assert.ok(actionRefs.length > 0);
  assert.ok(actionRefs.every((reference) => /^[a-f0-9]{40}$/.test(reference)), 'release actions must use full commit SHAs');
});

test('release operations and rollback are documented', () => {
  const guide = read('docs/RELEASING.md');
  for (const boundary of ['Semantic versioning', 'Compatibility', 'Trusted publishing', 'Immutable releases', 'Rollback']) {
    assert.ok(guide.includes(boundary), `release guide is missing ${boundary}`);
  }
});

test('package verification includes a literal dry run and deterministic real packs', () => {
  const verifier = read('scripts/verify-package.mjs');
  assert.match(verifier, /--dry-run/);
  assert.match(verifier, /successive package tarballs differ/);
  assert.match(verifier, /export target is missing from package/);
});
