import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  size = 'md',
}) => {
  const baseClasses =
    'inline-flex items-center font-medium rounded-[6px] whitespace-nowrap leading-none';
  const sizeClasses =
    size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-2.5 py-1.5 text-[12px]';

  const variantClasses = {
    primary: 'bg-[#DDE4F5] text-[#1C4BBC] border border-[#CAD3E6]',
    success: 'bg-[#EBF7F0] text-[#2F9E68] border border-[#BBE5D0]',
    warning: 'bg-[#FCF5E8] text-[#C68A1E] border border-[#F2DEB0]',
    danger: 'bg-[#FDF0EF] text-[#C4453F] border border-[#F4C5C2]',
    neutral: 'bg-[#EDF1FA] text-[#60636A] border border-[#E4E9F2]',
  }[variant];

  return (
    <span className={`${baseClasses} ${sizeClasses} ${variantClasses}`}>
      {children}
    </span>
  );
};
