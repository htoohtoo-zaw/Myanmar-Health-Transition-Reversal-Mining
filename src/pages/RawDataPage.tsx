import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Download,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Badge } from '../components/Badge';
import { loadRawDataset, RawRow, RAW_DATASET_PATH } from '../data/rawDataset';

type SortKey = 'code' | 'indicator' | 'year' | 'dimensionName' | 'value';
type ValueFilter = 'all' | 'numeric' | 'categorical';

const PAGE_SIZE = 50;

export const RawDataPage: React.FC = () => {
  const [rows, setRows] = useState<RawRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [yearFrom, setYearFrom] = useState<number | ''>('');
  const [yearTo, setYearTo] = useState<number | ''>('');
  const [dimensionType, setDimensionType] = useState('');
  const [valueFilter, setValueFilter] = useState<ValueFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('code');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    let active = true;
    loadRawDataset()
      .then((data) => active && setRows(data))
      .catch((err: Error) => active && setError(err.message));
    return () => {
      active = false;
    };
  }, []);

  // Debounce the free-text filter so typing stays responsive across 20k rows.
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 200);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { years, dimensionTypes } = useMemo<{ years: number[]; dimensionTypes: string[] }>(() => {
    if (!rows) return { years: [], dimensionTypes: [] };
    const yearSet = new Set<number>();
    const dimensionSet = new Set<string>();
    for (const r of rows) {
      yearSet.add(r.year);
      if (r.dimensionType) dimensionSet.add(r.dimensionType);
    }
    return {
      years: Array.from(yearSet).sort((a, b) => a - b),
      dimensionTypes: Array.from(dimensionSet).sort(),
    };
  }, [rows]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const needle = debouncedSearch.trim().toLowerCase();

    return rows.filter((r) => {
      if (needle && !r.haystack.includes(needle)) return false;
      if (yearFrom !== '' && r.year < yearFrom) return false;
      if (yearTo !== '' && r.year > yearTo) return false;
      if (dimensionType && r.dimensionType !== dimensionType) return false;
      if (valueFilter === 'numeric' && r.numeric === '') return false;
      if (valueFilter === 'categorical' && r.numeric !== '') return false;
      return true;
    });
  }, [rows, debouncedSearch, yearFrom, yearTo, dimensionType, valueFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp: number;
      if (sortKey === 'year') {
        cmp = a.year - b.year;
      } else if (sortKey === 'value') {
        // Sort numerically where both sides are numeric, else lexically.
        const na = Number.parseFloat(a.numeric);
        const nb = Number.parseFloat(b.numeric);
        const bothNumeric = !Number.isNaN(na) && !Number.isNaN(nb);
        cmp = bothNumeric ? na - nb : a.value.localeCompare(b.value);
      } else {
        cmp = a[sortKey].localeCompare(b[sortKey]);
      }
      return sortAsc ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortAsc]);

  // Keep the viewport valid when filters shrink the result set.
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  useEffect(() => setPage(0), [debouncedSearch, yearFrom, yearTo, dimensionType, valueFilter]);

  const visible = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setYearFrom('');
    setYearTo('');
    setDimensionType('');
    setValueFilter('all');
  };

  const filtersActive =
    search !== '' || yearFrom !== '' || yearTo !== '' || dimensionType !== '' || valueFilter !== 'all';

  const SortHeader: React.FC<{ label: string; sortBy: SortKey; className?: string }> = ({
    label,
    sortBy,
    className = '',
  }) => (
    <th className={`py-2 px-2 font-medium ${className}`}>
      <button
        type="button"
        onClick={() => toggleSort(sortBy)}
        className="inline-flex items-center gap-1 hover:text-[#1C4BBC] cursor-pointer"
        aria-label={`Sort by ${label}`}
      >
        {label}
        <ArrowUpDown
          size={12}
          className={sortKey === sortBy ? 'text-[#1C4BBC]' : 'text-[#919398]'}
        />
      </button>
    </th>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[26px] md:text-[30px] font-bold text-[#0B0F19]">
          Raw Data Explorer
        </h1>
        <p className="text-[14px] text-[#60636A] mt-1 max-w-4xl">
          Browse the complete WHO Global Health Observatory export for Myanmar exactly as retrieved —
          every observation behind the analyses on this site, before any cleansing was applied.
        </p>
      </div>

      {error && (
        <div className="bg-[#FDF0EF] border border-[#F4C5C2] rounded-[8px] p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-[#C4453F] mt-0.5 shrink-0" />
          <div>
            <h4 className="text-[14px] font-semibold text-[#C4453F]">Could not load the dataset</h4>
            <p className="text-[13px] text-[#0B0F19] mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {!rows && !error && (
        <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-10 flex flex-col items-center justify-center gap-3">
          <Loader2 size={22} className="text-[#1C4BBC] animate-spin" />
          <p className="text-[13px] text-[#60636A]">
            Loading 20,613 observations (6.5 MB)…
          </p>
        </div>
      )}

      {rows && (
        <div className="bg-white border border-[#E4E9F2] rounded-[8px] shadow-[0_1px_2px_rgba(11,15,25,0.06)]">
          {/* Controls */}
          <div className="p-4 border-b border-[#E4E9F2] space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="relative flex-1 min-w-0">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#919398] pointer-events-none"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search indicator, GHO code, dimension or value…"
                  className="w-full pl-9 pr-3 py-2 text-[13px] rounded-[6px] border border-[#CAD3E6] bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1C4BBC]"
                  aria-label="Search the dataset"
                />
              </div>

              <a
                href={RAW_DATASET_PATH}
                download
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-[6px] bg-[#1C4BBC] text-white text-[13px] font-medium shrink-0 hover:bg-[#163C96] transition-colors"
              >
                <Download size={15} strokeWidth={2} />
                Download CSV
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value === '' ? '' : Number(e.target.value))}
                className="text-[12px] rounded-[6px] border border-[#CAD3E6] bg-white px-2 py-1.5 cursor-pointer"
                aria-label="Filter from year"
              >
                <option value="">Year from…</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <select
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value === '' ? '' : Number(e.target.value))}
                className="text-[12px] rounded-[6px] border border-[#CAD3E6] bg-white px-2 py-1.5 cursor-pointer"
                aria-label="Filter to year"
              >
                <option value="">Year to…</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <select
                value={dimensionType}
                onChange={(e) => setDimensionType(e.target.value)}
                className="text-[12px] rounded-[6px] border border-[#CAD3E6] bg-white px-2 py-1.5 cursor-pointer max-w-[220px]"
                aria-label="Filter by disaggregation dimension"
              >
                <option value="">All dimensions</option>
                {dimensionTypes.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={valueFilter}
                onChange={(e) => setValueFilter(e.target.value as ValueFilter)}
                className="text-[12px] rounded-[6px] border border-[#CAD3E6] bg-white px-2 py-1.5 cursor-pointer"
                aria-label="Filter by value type"
              >
                <option value="all">All value types</option>
                <option value="numeric">Numeric only</option>
                <option value="categorical">Categorical only</option>
              </select>

              {filtersActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-[12px] text-[#60636A] hover:text-[#C4453F] px-2 py-1.5 cursor-pointer"
                >
                  <X size={13} />
                  Clear
                </button>
              )}

              <span className="text-[12px] text-[#60636A] ml-auto font-mono tabular-nums">
                {sorted.length.toLocaleString()} of {rows.length.toLocaleString()} rows
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-[#E4E9F2] text-[#60636A] bg-[#F6F8FC]">
                  <SortHeader label="GHO Code" sortBy="code" />
                  <SortHeader label="Indicator" sortBy="indicator" className="min-w-[260px]" />
                  <SortHeader label="Year" sortBy="year" />
                  <SortHeader label="Dimension" sortBy="dimensionName" />
                  <SortHeader label="Value" sortBy="value" />
                  <th className="py-2 px-2 font-medium">95% CI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E9F2]">
                {visible.map((r, i) => (
                  <tr key={`${r.code}-${r.year}-${safePage}-${i}`} className="hover:bg-[#EDF1FA]/40 align-top">
                    <td className="py-2 px-2 whitespace-nowrap">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-[11.5px] text-[#1C4BBC] hover:underline"
                      >
                        {r.code}
                        <ExternalLink size={11} className="shrink-0" />
                      </a>
                    </td>
                    <td className="py-2 px-2 text-[#0B0F19] max-w-[420px]">{r.indicator}</td>
                    <td className="py-2 px-2 font-mono tabular-nums text-[#60636A] whitespace-nowrap">
                      {r.startYear !== r.endYear ? `${r.startYear}–${r.endYear}` : r.year}
                    </td>
                    <td className="py-2 px-2 text-[#60636A]">
                      {r.dimensionName ? (
                        <span title={r.dimensionType}>{r.dimensionName}</span>
                      ) : (
                        <span className="text-[#919398]">—</span>
                      )}
                    </td>
                    <td className="py-2 px-2 font-medium text-[#0B0F19]">
                      {r.value || <span className="text-[#919398]">—</span>}
                      {r.numeric === '' && r.value !== '' && (
                        <span className="ml-1.5 align-middle">
                          <Badge variant="neutral" size="sm">cat</Badge>
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 font-mono tabular-nums text-[#60636A] whitespace-nowrap">
                      {r.low !== '' || r.high !== '' ? `${r.low || '?'} – ${r.high || '?'}` : '—'}
                    </td>
                  </tr>
                ))}

                {visible.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-[13px] text-[#60636A]">
                      No observations match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-[#E4E9F2] flex items-center justify-between gap-3">
            <span className="text-[12px] text-[#60636A] font-mono tabular-nums">
              {sorted.length === 0
                ? '0 rows'
                : `${(safePage * PAGE_SIZE + 1).toLocaleString()}–${Math.min(
                    (safePage + 1) * PAGE_SIZE,
                    sorted.length
                  ).toLocaleString()}`}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(0, safePage - 1))}
                disabled={safePage === 0}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[12px] rounded-[6px] border border-[#CAD3E6] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EDF1FA] cursor-pointer"
              >
                <ChevronLeft size={14} />
                Prev
              </button>
              <span className="text-[12px] text-[#60636A] font-mono tabular-nums">
                {safePage + 1} / {pageCount.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setPage(Math.min(pageCount - 1, safePage + 1))}
                disabled={safePage >= pageCount - 1}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[12px] rounded-[6px] border border-[#CAD3E6] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EDF1FA] cursor-pointer"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-[11px] text-[#60636A] leading-relaxed">
        Every row is shown as retrieved, including the malformed and sentinel values documented on the
        Dataset &amp; 4 Traps page. Region and country columns are omitted here because the export is
        filtered to Myanmar (SEAR) throughout.
      </p>
    </div>
  );
};
