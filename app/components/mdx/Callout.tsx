import type { ReactNode } from 'react';

interface CalloutProps {
  icon?: string;
  children: ReactNode;
}

export function Callout({ icon = '💡', children }: CalloutProps) {
  return (
    <div className="flex gap-3 p-4 rounded-lg bg-secondary">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
