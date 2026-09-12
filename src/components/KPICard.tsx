import React from 'react';
import { useI18n } from '../i18n/LocaleContext';

interface KPICardProps {
  label: string;
  value: string | number;
  subtext?: string;
  kicker?: string;
  badge?: {
    text: string;
    variant: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  };
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subtext,
  kicker,
  badge,
}) => {
  const { t } = useI18n();

  return (
    <div className="bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[8px] p-5 shadow-[var(--c-shadow-sm)] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          {kicker ? (
            <span className="text-[11px] font-semibold tracking-wider text-[var(--c-muted)] uppercase">
              {t(kicker)}
            </span>
          ) : (
            <span className="text-[13px] font-medium text-[var(--c-muted)]">{t(label)}</span>
          )}
          {badge && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-[6px] ${
                badge.variant === 'primary'
                  ? 'bg-[var(--c-subtle-2)] text-[var(--c-primary)]'
                  : badge.variant === 'success'
                  ? 'bg-[var(--c-success-bg)] text-[var(--c-success)]'
                  : badge.variant === 'warning'
                  ? 'bg-[var(--c-warning-bg)] text-[var(--c-warning)]'
                  : 'bg-[var(--c-danger-bg)] text-[var(--c-danger)]'
              }`}
            >
              {t(badge.text)}
            </span>
          )}
        </div>
        {kicker && <div className="text-[14px] font-medium text-[var(--c-ink)] mb-1">{label}</div>}
      </div>

      <div className="mt-3">
        <div className="text-[32px] md:text-[36px] font-bold text-[var(--c-ink)] leading-none tabular-nums tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="mt-2 text-[12px] text-[var(--c-muted)] leading-relaxed">
            {t(subtext)}
          </p>
        )}
      </div>
    </div>
  );
};
