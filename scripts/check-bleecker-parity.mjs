import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bleeckerRoot = path.resolve(root, '../bleecker');
const bleeckerIndex = fs.readFileSync(path.join(bleeckerRoot, 'src/index.ts'), 'utf8');

const exclusions = new Set(['core', 'tokens', 'utils/cn', 'utils/hooks', 'theme/theme-script']);
const publicModules = [...bleeckerIndex.matchAll(/from '\.\/([^']+)'/g)]
  .map((match) => match[1])
  .filter((value) => !exclusions.has(value));

function sourceFor(repositoryRoot, modulePath) {
  return ['tsx', 'ts']
    .map((extension) => path.join(repositoryRoot, 'src', `${modulePath}.${extension}`))
    .find((candidate) => fs.existsSync(candidate));
}

function publicSymbols(sourcePath) {
  if (!sourcePath) return new Set();
  const source = ts.createSourceFile(
    sourcePath,
    fs.readFileSync(sourcePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  const symbols = new Set();

  for (const statement of source.statements) {
    const exported = statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (exported && statement.name?.text) symbols.add(statement.name.text);
    if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) symbols.add(element.name.text);
    }
  }
  return symbols;
}

const missingModules = [];
const symbolMismatches = [];

for (const modulePath of publicModules) {
  const bleeckerSource = sourceFor(bleeckerRoot, modulePath);
  const thompsonSource = sourceFor(root, modulePath);
  if (!thompsonSource) {
    missingModules.push(modulePath);
    continue;
  }

  const bleeckerSymbols = publicSymbols(bleeckerSource);
  const thompsonSymbols = publicSymbols(thompsonSource);
  const missing = [...bleeckerSymbols].filter((symbol) => !thompsonSymbols.has(symbol));
  const extra = [...thompsonSymbols].filter((symbol) => !bleeckerSymbols.has(symbol));
  if (missing.length) symbolMismatches.push({ modulePath, missing, extra });
}

const pathCoverage = publicModules.length - missingModules.length;
const symbolCoverage = publicModules.length - missingModules.length - symbolMismatches.length;
console.log(`[check-bleecker-parity] Paths: ${pathCoverage}/${publicModules.length}. Public symbol sets: ${symbolCoverage}/${publicModules.length}.`);

if (missingModules.length) console.log(`[check-bleecker-parity] Missing modules: ${missingModules.join(', ')}`);
for (const mismatch of symbolMismatches) {
  console.log(
    `[check-bleecker-parity] ${mismatch.modulePath}: missing [${mismatch.missing.join(', ')}]` +
    `${mismatch.extra.length ? `; native additions [${mismatch.extra.join(', ')}]` : ''}`
  );
}

if (process.argv.includes('--strict') && (missingModules.length || symbolMismatches.length)) process.exitCode = 1;
if (pathCoverage < 30) {
  console.error('[check-bleecker-parity] Coverage regressed below the established native baseline.');
  process.exitCode = 1;
}
