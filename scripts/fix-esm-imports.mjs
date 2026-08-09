import { promises as fs } from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)))).flat();
}

const files = (await walk(distDir)).filter((file) => file.endsWith('.js'));
const importRegex = /((?:import|export)\s+(?:[^'\"]*?\s+from\s+)?['\"])(\.\.?\/[^'\"]+)(['\"])/g;

for (const file of files) {
  const source = await fs.readFile(file, 'utf8');
  const next = source.replace(importRegex, (match, prefix, specifier, suffix) => path.extname(specifier) ? match : `${prefix}${specifier}.js${suffix}`);
  if (source !== next) await fs.writeFile(file, next);
}
