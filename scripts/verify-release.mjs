import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { verifyConsumer } from './verify-consumer.mjs';
import { verifyPackage } from './verify-package.mjs';

const directory = mkdtempSync(path.join(tmpdir(), 'thompson-release-'));
try {
  const { artifact } = verifyPackage(directory);
  verifyConsumer(artifact);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
