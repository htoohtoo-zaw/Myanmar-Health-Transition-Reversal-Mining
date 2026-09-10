import React from 'react';

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
  return (
    <div className="bg-white border border-[#E4E9F2] rounded-[8px] p-5 shadow-[0_1px_2px_rgba(11,15,25,0.06)] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          {kicker ? (
            <span className="text-[11px] font-semibold tracking-wider text-[#60636A] uppercase">
              {kicker}
            </span>
          ) : (
            <span className="text-[13px] font-medium text-[#60636A]">{label}</span>
          )}
          {badge && (
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-[6px] ${
                badge.variant === 'primary'
                  ? 'bg-[#DDE4F5] text-[#1C4BBC]'
                  : badge.variant === 'success'
                  ? 'bg-[#EBF7F0] text-[#2F9E68]'
                  : badge.variant === 'warning'
                  ? 'bg-[#FCF5E8] text-[#C68A1E]'
                  : 'bg-[#FDF0EF] text-[#C4453F]'
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
        {kicker && <div className="text-[14px] font-medium text-[#0B0F19] mb-1">{label}</div>}
      </div>

      <div className="mt-3">
        <div className="text-[32px] md:text-[36px] font-bold text-[#0B0F19] leading-none tabular-nums tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="mt-2 text-[12px] text-[#60636A] leading-relaxed">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
