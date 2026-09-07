import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageName = '@gaulatti/thompson';
const npmRegistry = 'https://registry.npmjs.org/';
const exactVersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

export function assertRegistryResolution(lockEntry, expectedVersion, expectedIntegrity) {
  assert.ok(exactVersionPattern.test(expectedVersion), `expected an exact semver version, received ${expectedVersion}`);
  assert.match(expectedIntegrity, /^sha512-[A-Za-z0-9+/]+={0,2}$/, 'expected npm sha512 integrity');
  assert.ok(lockEntry && typeof lockEntry === 'object', 'package lock is missing Thompson');
  assert.equal(lockEntry.version, expectedVersion, 'consumer resolved a different Thompson version');
  assert.equal(lockEntry.integrity, expectedIntegrity, 'consumer resolved a different Thompson artifact');

  const resolved = new URL(lockEntry.resolved);
  assert.equal(resolved.protocol, 'https:', 'consumer did not use HTTPS');
  assert.equal(resolved.origin, new URL(npmRegistry).origin, 'consumer did not use the public npm registry');
  assert.equal(
    resolved.pathname,
    `/@gaulatti/thompson/-/thompson-${expectedVersion}.tgz`,
    'consumer did not resolve the exact registry tarball'
  );
}

function verifyConsumerInstall(packageSpec, expectedVersion, registryIntegrity) {
  const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  const directory = mkdtempSync(path.join(tmpdir(), 'thompson-consumer-'));

  try {
    writeFileSync(path.join(directory, 'package.json'), `${JSON.stringify({
      name: 'thompson-release-consumer',
      private: true,
      type: 'module',
      main: 'index.tsx',
      dependencies: {
        '@gaulatti/bleecker': manifest.devDependencies['@gaulatti/bleecker'],
        [packageName]: packageSpec,
        '@react-native-community/datetimepicker': '9.1.0',
        '@react-native-community/slider': '5.2.0',
        '@types/react': '19.2.18',
        expo: '57.0.11',
        react: '19.2.3',
        'react-dom': '19.2.3',
        'react-native': '0.86.2',
        'react-native-safe-area-context': '5.7.0',
        'react-native-svg': '15.15.4',
        'react-native-webview': '13.16.1',
        typescript: '6.0.3'
      }
    }, null, 2)}\n`);
    writeFileSync(path.join(directory, '.npmrc'), `registry=${npmRegistry}\ninstall-links=true\n`);
    writeFileSync(path.join(directory, 'app.json'), `${JSON.stringify({
      expo: {
        name: 'Thompson release consumer',
        slug: 'thompson-release-consumer'
      }
    }, null, 2)}\n`);
    writeFileSync(path.join(directory, 'index.tsx'), `
import { registerRootComponent } from 'expo';
import { ReleaseConsumerScreen } from './screen';

registerRootComponent(ReleaseConsumerScreen);
`);

    writeFileSync(path.join(directory, 'screen.tsx'), `
import React from 'react';
import { Button, Card, Stack, ThompsonProvider } from '@gaulatti/thompson';

export function ReleaseConsumerScreen() {
  return (
    <ThompsonProvider>
      <Card>
        <Stack>
          <Button onPress={() => undefined}>Verified release</Button>
        </Stack>
      </Card>
    </ThompsonProvider>
  );
}

export const rendered = <ReleaseConsumerScreen />;
`);
    writeFileSync(path.join(directory, 'runtime.mjs'), `
import assert from 'node:assert/strict';
import { createAttentionColor } from '@gaulatti/thompson/utils/attention-color';

const treatment = createAttentionColor({ hue: 210, intensity: 7 });
assert.equal(treatment.intensity, 7);
assert.match(treatment.accent, /^#[0-9a-f]{6}$/);
`);

    run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], directory);
    const lock = JSON.parse(readFileSync(path.join(directory, 'package-lock.json'), 'utf8'));
    if (registryIntegrity) {
      assertRegistryResolution(lock.packages?.[`node_modules/${packageName}`], expectedVersion, registryIntegrity);
    }
    const installed = JSON.parse(
      readFileSync(path.join(directory, `node_modules/${packageName}/package.json`), 'utf8')
    );
    assert.equal(installed.version, expectedVersion);
    assert.equal(installed.name, manifest.name);
    run(process.execPath, [path.join(directory, 'node_modules/typescript/bin/tsc'), '--noEmit', '--strict', '--skipLibCheck', '--jsx', 'react-jsx', '--target', 'ES2022', '--module', 'ESNext', '--moduleResolution', 'Bundler', 'screen.tsx'], directory);
    run(process.execPath, ['runtime.mjs'], directory);
    run(process.execPath, [path.join(directory, 'node_modules/expo/bin/cli'), 'export', '--platform', 'ios', '--output-dir', '.expo-export'], directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

export function verifyConsumer(artifact) {
  const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  verifyConsumerInstall(`file:${path.resolve(artifact)}`, manifest.version);
}

export function verifyRegistryConsumer(version, expectedIntegrity) {
  assert.ok(exactVersionPattern.test(version), `expected an exact semver version, received ${version}`);
  verifyConsumerInstall(version, version, expectedIntegrity);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.ok(process.argv[2], 'usage: node scripts/verify-consumer.mjs <package.tgz>');
  verifyConsumer(process.argv[2]);
}
