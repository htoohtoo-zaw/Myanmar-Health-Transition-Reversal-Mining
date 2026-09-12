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
    primary: 'bg-[var(--c-subtle-2)] text-[var(--c-primary)] border border-[var(--c-border-strong)]',
    success: 'bg-[var(--c-success-bg)] text-[var(--c-success)] border border-[var(--c-success-border)]',
    warning: 'bg-[var(--c-warning-bg)] text-[var(--c-warning)] border border-[var(--c-warning-border)]',
    danger: 'bg-[var(--c-danger-bg)] text-[var(--c-danger)] border border-[var(--c-danger-border)]',
    neutral: 'bg-[var(--c-subtle)] text-[var(--c-muted)] border border-[var(--c-border)]',
  }[variant];

  return (
    <span className={`${baseClasses} ${sizeClasses} ${variantClasses}`}>
      {children}
    </span>
  );
};
