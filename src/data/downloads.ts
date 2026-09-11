/**
 * Manifest of downloadable data files served from `public/data/`.
 *
 * Each `path` is resolved against the site root at runtime, so a file committed
 * to `public/data/who-gho-myanmar-raw.csv` is declared here as
 * `/data/who-gho-myanmar-raw.csv`. Vercel serves matching static assets before
 * applying the SPA rewrite in vercel.json, so these URLs resolve directly.
 */
export interface DataDownload {
  id: string;
  label: string;
  description: string;
  /** Site-root-relative URL of the asset, e.g. '/data/file.csv'. */
  path: string;
  /** Short format tag shown as a badge, e.g. 'CSV', 'XLSX', 'JSON'. */
  format: string;
  /** Human-readable file size, e.g. '4.2 MB'. */
  size: string;
  /** Row count or similar scale hint; omit when not applicable. */
  rows?: string;
  /** Marks the untouched source export as opposed to a derived table. */
  stage: 'raw' | 'prepared';
}

export const DATA_DOWNLOADS: DataDownload[] = [
  {
    id: 'gho-raw',
    label: 'WHO GHO Myanmar export (raw)',
    description:
      'The unmodified source export every figure on this site derives from: all 644 indicators across 1961–2030, one row per indicator-year-dimension observation. Includes the original GHO code, indicator URL, disaggregation dimensions, and the raw Value/Low/High fields prior to any cleansing.',
    path: '/data/who-gho-myanmar-raw.csv',
    format: 'CSV',
    size: '6.5 MB',
    rows: '20,613',
    stage: 'raw',
  },
  {
    id: 'tables-json',
    label: 'All analysis tables (combined)',
    description:
      'Every prepared table behind the site in one JSON document, plus the headline dataset statistics. Best starting point for programmatic re-analysis.',
    path: '/data/myanmar-health-mining-tables.json',
    format: 'JSON',
    size: '45.8 KB',
    stage: 'prepared',
  },
  {
    id: 'trained-indicators',
    label: 'Trained indicator records',
    description:
      'Indicator-level records used to fit the reversal classifier, with domain, unit, and engineered series features.',
    path: '/data/trained-indicators.csv',
    format: 'CSV',
    size: '3.5 KB',
    rows: '14',
    stage: 'prepared',
  },
  {
    id: 'reversal-items',
    label: 'Reversal findings',
    description:
      'Detected health-transition reversals with direction, magnitude, and supporting evidence.',
    path: '/data/reversal-items.csv',
    format: 'CSV',
    size: '4.8 KB',
    rows: '14',
    stage: 'prepared',
  },
  {
    id: 'association-rules',
    label: 'Association rules',
    description:
      'Mined antecedent/consequent rules with support, confidence, and lift.',
    path: '/data/association-rules.csv',
    format: 'CSV',
    size: '2.7 KB',
    rows: '14',
    stage: 'prepared',
  },
  {
    id: 'disease-levels',
    label: 'Disease level heatmap',
    description:
      'Discretised Low/Mid/High disease levels per year underlying the heatmap, with baseline medians and units.',
    path: '/data/disease-levels.csv',
    format: 'CSV',
    size: '1.1 KB',
    rows: '9',
    stage: 'prepared',
  },
  {
    id: 'model-comparison',
    label: 'Model performance comparison',
    description:
      'Per-model PR-AUC, precision, recall, and lift over the base rate.',
    path: '/data/model-comparison.csv',
    format: 'CSV',
    size: '0.3 KB',
    rows: '4',
    stage: 'prepared',
  },
  {
    id: 'domains',
    label: 'Domain profile',
    description:
      'Indicator counts, row volumes, and observation density for each of the 11 health domains.',
    path: '/data/domains.csv',
    format: 'CSV',
    size: '0.6 KB',
    rows: '11',
    stage: 'prepared',
  },
  {
    id: 'unit-summary',
    label: 'Unit-inference taxonomy',
    description:
      'Measurement units resolved by regex inference over raw GHO metadata (Trap 2), with indicator and row counts.',
    path: '/data/unit-summary.csv',
    format: 'CSV',
    size: '0.5 KB',
    rows: '6',
    stage: 'prepared',
  },
];

export const DATA_PROVENANCE =
  'World Health Organization — Global Health Observatory (GHO), Myanmar country profile. The raw export is redistributed unmodified; the prepared tables are generated from it via the cleansing and mining pipeline described on this page, and are rebuilt with `npm run build:data`.';
