import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'filled',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full font-medium';

  const variantStyles = {
    filled: 'bg-tertiary text-primary',
    outline: 'border border-subtle text-tertiary',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-caption',
    md: 'px-3 py-1 text-label-small',
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
