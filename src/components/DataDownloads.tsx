import React from 'react';
import { Download, FileSpreadsheet, FileJson, FileText, Database } from 'lucide-react';
import { Badge } from './Badge';
import { DATA_DOWNLOADS, DATA_PROVENANCE, DataDownload } from '../data/downloads';

const iconForFormat = (format: string) => {
  const key = format.toLowerCase();
  if (key === 'csv' || key === 'tsv' || key === 'xlsx') return FileSpreadsheet;
  if (key === 'json') return FileJson;
  if (key === 'zip') return Database;
  return FileText;
};

const DownloadRow: React.FC<{ file: DataDownload }> = ({ file }) => {
  const FormatIcon = iconForFormat(file.format);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-3.5">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-[6px] bg-[var(--c-subtle)] border border-[var(--c-border)] flex items-center justify-center shrink-0">
          <FormatIcon size={17} strokeWidth={1.75} className="text-[var(--c-primary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold text-[var(--c-ink)]">{file.label}</span>
            <Badge variant={file.stage === 'raw' ? 'warning' : 'success'} size="sm">
              {file.stage === 'raw' ? 'Raw source' : 'Prepared'}
            </Badge>
          </div>
          <p className="text-[12px] text-[var(--c-muted)] mt-1 leading-relaxed">{file.description}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-[var(--c-muted)] font-mono tabular-nums">
            <span>{file.format}</span>
            <span aria-hidden="true">·</span>
            <span>{file.size}</span>
            {file.rows && (
              <>
                <span aria-hidden="true">·</span>
                <span>{file.rows} rows</span>
              </>
            )}
          </div>
        </div>
      </div>

      <a
        href={file.path}
        download
        className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-[6px] bg-[var(--c-primary)] text-white text-[13px] font-medium shrink-0 hover:bg-[var(--c-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-primary)] transition-colors"
      >
        <Download size={15} strokeWidth={2} />
        Download
      </a>
    </div>
  );
};

export const DataDownloads: React.FC = () => {
  if (DATA_DOWNLOADS.length === 0) return null;

  return (
    <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)]">
      <div className="mb-1">
        <h3 className="text-[16px] font-semibold text-[var(--c-ink)]">Download the Dataset</h3>
        <p className="text-[12px] text-[var(--c-muted)]">
          Source files behind every figure on this site, available for independent verification and re-analysis
        </p>
      </div>

      <div className="divide-y divide-[var(--c-border)]">
        {DATA_DOWNLOADS.map((file) => (
          <DownloadRow key={file.id} file={file} />
        ))}
      </div>

      <p className="text-[11px] text-[var(--c-muted)] leading-relaxed mt-3 pt-3 border-t border-[var(--c-border)]">
        <span className="font-semibold text-[var(--c-ink)]">Provenance: </span>
        {DATA_PROVENANCE}
      </p>
    </div>
  );
};
