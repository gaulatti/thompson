import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

test('ThompsonProvider owns safe-area context around its theme consumer tree', async () => {
  const providerUrl = new URL('../dist/theme/provider.js', import.meta.url);
  const source = await readFile(fileURLToPath(providerUrl), 'utf8');
  assert.match(source, /import \{ SafeAreaProvider \} from 'react-native-safe-area-context'/);
  assert.match(source, /return _jsx\(SafeAreaProvider, \{ children: _jsx\(ThompsonThemeContext\.Provider/);
});
