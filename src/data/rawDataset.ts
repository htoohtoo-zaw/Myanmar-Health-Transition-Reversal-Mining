/**
 * Lazy loader for the raw WHO GHO export served from /data/.
 *
 * The file is ~6.5 MB, so it is fetched only when the raw-data view is first
 * opened, never bundled. The parsed result is memoised at module scope so
 * navigating away and back does not re-download or re-parse it.
 */
import { parseCsv } from '../utils/csv';

export const RAW_DATASET_PATH = '/data/who-gho-myanmar-raw.csv';

export interface RawRow {
  code: string;
  indicator: string;
  url: string;
  year: number;
  startYear: number;
  endYear: number;
  dimensionType: string;
  dimensionName: string;
  numeric: string;
  value: string;
  low: string;
  high: string;
  /** Pre-lowercased concatenation of searchable fields, for fast filtering. */
  haystack: string;
}

const toInt = (raw: string): number => {
  const n = Number.parseInt(raw, 10);
  return Number.isNaN(n) ? 0 : n;
};

export const parseRawDataset = (text: string): RawRow[] => {
  const table = parseCsv(text);
  if (table.length < 2) return [];

  const headers = table[0].map((h) => h.trim());
  const at = (name: string) => headers.indexOf(name);

  const idx = {
    code: at('GHO (CODE)'),
    indicator: at('GHO (DISPLAY)'),
    url: at('GHO (URL)'),
    year: at('YEAR (DISPLAY)'),
    startYear: at('STARTYEAR'),
    endYear: at('ENDYEAR'),
    dimensionType: at('DIMENSION (TYPE)'),
    dimensionName: at('DIMENSION (NAME)'),
    numeric: at('Numeric'),
    value: at('Value'),
    low: at('Low'),
    high: at('High'),
  };

  const missing = Object.entries(idx)
    .filter(([, position]) => position === -1)
    .map(([key]) => key);
  if (missing.length > 0) {
    throw new Error(`Unexpected CSV schema; missing columns: ${missing.join(', ')}`);
  }

  const rows: RawRow[] = [];
  for (let i = 1; i < table.length; i++) {
    const cells = table[i];
    // Skip blank trailing lines.
    if (cells.length === 1 && cells[0].trim() === '') continue;

    const cell = (position: number) => (cells[position] ?? '').trim();
    const code = cell(idx.code);
    const indicator = cell(idx.indicator);
    const dimensionName = cell(idx.dimensionName);
    const value = cell(idx.value);

    rows.push({
      code,
      indicator,
      url: cell(idx.url),
      year: toInt(cell(idx.year)),
      startYear: toInt(cell(idx.startYear)),
      endYear: toInt(cell(idx.endYear)),
      dimensionType: cell(idx.dimensionType),
      dimensionName,
      numeric: cell(idx.numeric),
      value,
      low: cell(idx.low),
      high: cell(idx.high),
      haystack: `${code} ${indicator} ${dimensionName} ${value}`.toLowerCase(),
    });
  }

  return rows;
};

let cache: RawRow[] | null = null;
let inFlight: Promise<RawRow[]> | null = null;

export const loadRawDataset = (): Promise<RawRow[]> => {
  if (cache) return Promise.resolve(cache);
  if (inFlight) return inFlight;

  inFlight = fetch(RAW_DATASET_PATH)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch dataset (HTTP ${res.status})`);
      }
      return res.text();
    })
    .then((text) => {
      const rows = parseRawDataset(text);
      cache = rows;
      inFlight = null;
      return rows;
    })
    .catch((err) => {
      inFlight = null;
      throw err;
    });

  return inFlight;
};
