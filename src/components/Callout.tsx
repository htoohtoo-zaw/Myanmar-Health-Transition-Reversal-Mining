import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  children: React.ReactNode;
  kicker?: string;
}

export const Callout: React.FC<CalloutProps> = ({
  type = 'info',
  title,
  children,
  kicker,
}) => {
  const styles = {
    info: {
      bg: 'bg-[var(--c-subtle)]',
      border: 'border-l-4 border-l-[var(--c-primary)] border-[var(--c-border-strong)]',
      title: 'text-[var(--c-primary)]',
      icon: Info,
    },
    warning: {
      bg: 'bg-[var(--c-warning-bg)]',
      border: 'border-l-4 border-l-[var(--c-warning)] border-[var(--c-warning-border)]',
      title: 'text-[var(--c-warning)]',
      icon: AlertTriangle,
    },
    danger: {
      bg: 'bg-[var(--c-danger-bg)]',
      border: 'border-l-4 border-l-[var(--c-danger)] border-[var(--c-danger-border)]',
      title: 'text-[var(--c-danger)]',
      icon: AlertCircle,
    },
    success: {
      bg: 'bg-[var(--c-success-bg)]',
      border: 'border-l-4 border-l-[var(--c-success)] border-[var(--c-success-border)]',
      title: 'text-[var(--c-success)]',
      icon: CheckCircle2,
    },
  }[type];

  const IconComponent = styles.icon;

  return (
    <div
      className={`rounded-[8px] border p-4 ${styles.bg} ${styles.border} shadow-[var(--c-shadow-sm)]`}
    >
      <div className="flex items-start gap-3">
        <IconComponent
          size={18}
          strokeWidth={1.75}
          className={`${styles.title} mt-0.5 shrink-0`}
        />
        <div className="flex-1 min-w-0">
          {kicker && (
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--c-muted)] mb-0.5">
              {kicker}
            </div>
          )}
          <h4 className={`text-[14px] font-semibold ${styles.title} mb-1`}>
            {title}
          </h4>
          <div className="text-[13px] text-[var(--c-ink)] leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
