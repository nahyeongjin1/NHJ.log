import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  searchPlaceholder,
  onSearch,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-heading-2 text-primary">{title}</h1>
      <p className="text-body text-secondary">{description}</p>

      {searchPlaceholder && (
        <div className="relative w-full max-w-[448px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-tertiary border border-subtle rounded-lg text-label text-primary placeholder:text-tertiary focus:outline-none focus:border-strong transition-colors"
          />
        </div>
      )}

      {children}
    </div>
  );
}
