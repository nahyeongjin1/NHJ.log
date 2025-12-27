import type { ReactNode } from 'react';

interface TextProps {
  children: ReactNode;
  bg?: boolean;
  underline?: boolean;
}

export function Text({ children, bg, underline }: TextProps) {
  const hasStyle = bg || underline;

  if (!hasStyle) {
    return <>{children}</>;
  }

  const className = [
    bg && 'bg-[var(--bg-secondary)] px-1 rounded',
    underline && 'underline',
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={className}>{children}</span>;
}
