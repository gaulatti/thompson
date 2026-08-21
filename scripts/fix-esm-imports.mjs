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
  const replacements = await Promise.all([...source.matchAll(importRegex)].map(async (match) => {
    const [full, prefix, specifier, suffix] = match;
    if (path.extname(specifier)) return [full, full];
    const directoryIndex = path.resolve(path.dirname(file), specifier, 'index.js');
    try {
      await fs.access(directoryIndex);
      return [full, `${prefix}${specifier}/index.js${suffix}`];
    } catch {
      return [full, `${prefix}${specifier}.js${suffix}`];
    }
  }));
  const replacementMap = new Map(replacements);
  const next = source.replace(importRegex, (match) => replacementMap.get(match) ?? match);
  if (source !== next) await fs.writeFile(file, next);
}
