import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function pack(destination) {
  mkdirSync(destination, { recursive: true });
  const output = execFileSync(
    'npm',
    ['pack', '--ignore-scripts', '--json', '--pack-destination', destination],
    { cwd: root, encoding: 'utf8' }
  );
  const [metadata] = JSON.parse(output);
  assert.ok(metadata?.filename, 'npm pack did not return an artifact filename');
  return { artifact: path.join(destination, metadata.filename), metadata };
}

function dryRun() {
  const output = execFileSync(
    'npm',
    ['pack', '--ignore-scripts', '--dry-run', '--json'],
    { cwd: root, encoding: 'utf8' }
  );
  const [metadata] = JSON.parse(output);
  assert.ok(metadata?.filename, 'npm pack --dry-run did not return package metadata');
  return metadata;
}

function assertExportTargets(manifest, files) {
  const packaged = new Set(files.map(({ path: file }) => file));

  function assertTarget(target) {
    const normalized = target.replace(/^\.\//, '');
    if (!normalized.includes('*')) {
      assert.ok(packaged.has(normalized), `export target is missing from package: ${target}`);
      return;
    }

    const [prefix, suffix] = normalized.split('*');
    assert.ok(
      [...packaged].some((file) => file.startsWith(prefix) && file.endsWith(suffix)),
      `wildcard export has no packaged targets: ${target}`
    );
  }

  function visit(value) {
    if (typeof value === 'string') return assertTarget(value);
    for (const nested of Object.values(value)) visit(nested);
  }

  visit(manifest.exports);
}

function assertContents(metadata, manifest) {
  const files = metadata.files ?? [];
  const paths = files.map(({ path: file }) => file);
  const allowed = /^(?:CHANGELOG\.md|README\.md|package\.json|dist\/|src\/)/;
  const forbidden = /^(?:\.agents\/|\.github\/|example\/|scripts\/|tests\/)|(?:^|\/)\.env(?:\.|$)|\.tgz$/;

  assert.ok(paths.length > 0, 'package is empty');
  assert.deepEqual(
    paths.filter((file) => !allowed.test(file)),
    [],
    'package contains files outside the release allowlist'
  );
  assert.deepEqual(
    paths.filter((file) => forbidden.test(file)),
    [],
    'package contains a forbidden development or secret path'
  );
  for (const required of ['CHANGELOG.md', 'README.md', 'package.json', 'dist/index.js', 'dist/index.d.ts']) {
    assert.ok(paths.includes(required), `package is missing ${required}`);
  }
  assertExportTargets(manifest, files);
}

export function verifyPackage(outputDirectory) {
  const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(manifest.name, '@gaulatti/thompson');
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal(manifest.publishConfig?.registry, 'https://registry.npmjs.org/');
  assert.equal(manifest.publishConfig?.access, 'public');

  const temporary = mkdtempSync(path.join(tmpdir(), 'thompson-package-'));
  try {
    const first = pack(path.join(temporary, 'first'));
    const second = pack(path.join(temporary, 'second'));
    const dryRunMetadata = dryRun();
    assertContents(first.metadata, manifest);
    assertContents(dryRunMetadata, manifest);
    assert.deepEqual(
      first.metadata.files.map(({ path: file, size }) => ({ path: file, size })),
      second.metadata.files.map(({ path: file, size }) => ({ path: file, size })),
      'successive packs have different contents'
    );
    assert.equal(sha256(first.artifact), sha256(second.artifact), 'successive package tarballs differ');

    const destination = outputDirectory
      ? path.resolve(root, outputDirectory)
      : path.join(temporary, 'verified');
    mkdirSync(destination, { recursive: true });
    const artifact = path.join(destination, first.metadata.filename);
    copyFileSync(first.artifact, artifact);
    return {
      artifact,
      filename: first.metadata.filename,
      integrity: first.metadata.integrity,
      sha256: sha256(artifact),
      shasum: first.metadata.shasum
    };
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = verifyPackage(process.argv[2]);
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
