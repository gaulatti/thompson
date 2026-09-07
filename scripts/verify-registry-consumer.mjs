import assert from 'node:assert/strict';

import { verifyRegistryConsumer } from './verify-consumer.mjs';

const [, , version, expectedIntegrity] = process.argv;
assert.ok(version && expectedIntegrity, 'usage: node scripts/verify-registry-consumer.mjs <exact-version> <sha512-integrity>');
verifyRegistryConsumer(version, expectedIntegrity);
