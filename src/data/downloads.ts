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

export const DATA_DOWNLOADS: DataDownload[] = [];

export const DATA_PROVENANCE =
  'World Health Organization — Global Health Observatory (GHO), Myanmar country profile. Retrieved via the official GHO OData API and redistributed here unmodified for reproducibility.';
