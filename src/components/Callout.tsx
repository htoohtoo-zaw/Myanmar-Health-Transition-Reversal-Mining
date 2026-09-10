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
      bg: 'bg-[#EDF1FA]',
      border: 'border-l-4 border-l-[#1C4BBC] border-[#CAD3E6]',
      title: 'text-[#1C4BBC]',
      icon: Info,
    },
    warning: {
      bg: 'bg-[#FCF5E8]',
      border: 'border-l-4 border-l-[#C68A1E] border-[#F2DEB0]',
      title: 'text-[#C68A1E]',
      icon: AlertTriangle,
    },
    danger: {
      bg: 'bg-[#FDF0EF]',
      border: 'border-l-4 border-l-[#C4453F] border-[#F4C5C2]',
      title: 'text-[#C4453F]',
      icon: AlertCircle,
    },
    success: {
      bg: 'bg-[#EBF7F0]',
      border: 'border-l-4 border-l-[#2F9E68] border-[#BBE5D0]',
      title: 'text-[#2F9E68]',
      icon: CheckCircle2,
    },
  }[type];

  const IconComponent = styles.icon;

  return (
    <div
      className={`rounded-[8px] border p-4 ${styles.bg} ${styles.border} shadow-[0_1px_2px_rgba(11,15,25,0.06)]`}
    >
      <div className="flex items-start gap-3">
        <IconComponent
          size={18}
          strokeWidth={1.75}
          className={`${styles.title} mt-0.5 shrink-0`}
        />
        <div className="flex-1 min-w-0">
          {kicker && (
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#60636A] mb-0.5">
              {kicker}
            </div>
          )}
          <h4 className={`text-[14px] font-semibold ${styles.title} mb-1`}>
            {title}
          </h4>
          <div className="text-[13px] text-[#0B0F19] leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
