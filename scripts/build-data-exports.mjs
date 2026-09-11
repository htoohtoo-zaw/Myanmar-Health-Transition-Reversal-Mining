/**
 * Generates the downloadable data files in public/data/ from the curated
 * tables in src/data/miningData.ts, so the published files and the figures
 * rendered on the site are guaranteed to come from one source.
 *
 * Run via `npm run build:data`.
 */
import { build } from 'esbuild';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'public', 'data');

// miningData.ts is TypeScript with type-only imports; bundle it to plain JS
// in memory so this script can import the values directly.
const bundled = await build({
  entryPoints: [path.join(root, 'src', 'data', 'miningData.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
  logLevel: 'silent',
});
const mod = await import(
  'data:text/javascript;base64,' +
    Buffer.from(bundled.outputFiles[0].text).toString('base64')
);

const csvCell = (value) => {
  if (value === null || value === undefined) return '';
  const str = Array.isArray(value) ? value.join('; ') : String(value);
  return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const toCsv = (rows) => {
  const headers = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const lines = [headers.join(',')];
  for (const row of rows) lines.push(headers.map((h) => csvCell(row[h])).join(','));
  return lines.join('\r\n') + '\r\n';
};

const TABLES = [
  ['trained-indicators', mod.TRAINED_INDICATORS],
  ['disease-levels', mod.DISEASE_LEVELS_DATA],
  ['reversal-items', mod.REVERSAL_ITEMS],
  ['association-rules', mod.ASSOCIATION_RULES],
  ['model-comparison', mod.MODEL_COMPARISON],
  ['domains', mod.DOMAINS],
  ['unit-summary', mod.UNIT_SUMMARY],
];

await mkdir(outDir, { recursive: true });

const manifest = [];
for (const [name, rows] of TABLES) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error(`Table "${name}" is missing or empty in miningData.ts`);
  }
  const file = path.join(outDir, `${name}.csv`);
  await writeFile(file, toCsv(rows), 'utf8');
  const { size } = await stat(file);
  manifest.push({ name, rows: rows.length, bytes: size });
  console.log(`  ${name}.csv — ${rows.length} rows, ${(size / 1024).toFixed(1)} KB`);
}

// Single combined JSON for programmatic re-analysis.
const combined = {
  provenance: 'WHO Global Health Observatory — Myanmar. Prepared analysis tables.',
  generated: new Date().toISOString().slice(0, 10),
  stats: mod.DATASET_STATS,
  tables: Object.fromEntries(TABLES.map(([name, rows]) => [name, rows])),
};
const jsonFile = path.join(outDir, 'myanmar-health-mining-tables.json');
await writeFile(jsonFile, JSON.stringify(combined, null, 2), 'utf8');
const { size: jsonSize } = await stat(jsonFile);
console.log(`  myanmar-health-mining-tables.json — ${(jsonSize / 1024).toFixed(1)} KB`);

console.log(JSON.stringify({ manifest, jsonBytes: jsonSize }, null, 2));
