import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

export function verifyConsumer(artifact) {
  const manifest = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  const directory = mkdtempSync(path.join(tmpdir(), 'thompson-consumer-'));
  const absoluteArtifact = path.resolve(artifact);

  try {
    writeFileSync(path.join(directory, 'package.json'), `${JSON.stringify({
      name: 'thompson-release-consumer',
      private: true,
      type: 'module',
      dependencies: {
        '@gaulatti/bleecker': manifest.devDependencies['@gaulatti/bleecker'],
        '@gaulatti/thompson': `file:${absoluteArtifact}`,
        '@react-native-community/datetimepicker': '9.1.0',
        '@react-native-community/slider': '5.2.0',
        '@types/react': '19.2.18',
        react: '19.2.3',
        'react-dom': '19.2.3',
        'react-native': '0.86.2',
        'react-native-safe-area-context': '5.7.0',
        'react-native-svg': '15.15.4',
        'react-native-webview': '13.16.1'
      }
    }, null, 2)}\n`);

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
    const installed = JSON.parse(
      readFileSync(path.join(directory, 'node_modules/@gaulatti/thompson/package.json'), 'utf8')
    );
    assert.equal(installed.version, manifest.version);
    assert.equal(installed.name, manifest.name);
    run(process.execPath, [path.join(root, 'node_modules/typescript/bin/tsc'), '--noEmit', '--strict', '--skipLibCheck', '--jsx', 'react-jsx', '--target', 'ES2022', '--module', 'ESNext', '--moduleResolution', 'Bundler', 'screen.tsx'], directory);
    run(process.execPath, ['runtime.mjs'], directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.ok(process.argv[2], 'usage: node scripts/verify-consumer.mjs <package.tgz>');
  verifyConsumer(process.argv[2]);
}
