import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function javascriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? javascriptFiles(path.join(directory, entry.name)) : entry.name.endsWith('.js') ? [path.join(directory, entry.name)] : []));
  return nested.flat();
}

test('generated ESM relative imports are explicit and resolve to files or directory indexes', async () => {
  const files = await javascriptFiles(path.join(root, 'dist'));
  const importPattern = /(?:import|export)\s+(?:[^'\"]*?\s+from\s+)?['\"](\.\.?\/[^'\"]+)['\"]/g;
  let sawDirectoryIndex = false;
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(importPattern)) {
      const specifier = match[1];
      assert.equal(path.extname(specifier), '.js', `${file} contains extensionless import ${specifier}`);
      const target = path.resolve(path.dirname(file), specifier);
      await assert.doesNotReject(() => readFile(target));
      if (specifier.endsWith('/index.js')) sawDirectoryIndex = true;
    }
  }
  assert.equal(sawDirectoryIndex, true, 'expected at least one repaired directory index import');
});
