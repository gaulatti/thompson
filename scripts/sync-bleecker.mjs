import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bleeckerRoot = path.resolve(root, '../bleecker');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(args, cwd) {
  const result = spawnSync(npm, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(['run', 'build'], bleeckerRoot);
run(['install', '--install-links', '--force', '--no-save', '@gaulatti/bleecker@file:../bleecker'], root);
console.log('[sync-bleecker] Thompson now contains a fresh packed Bleecker build without web node_modules leakage.');
