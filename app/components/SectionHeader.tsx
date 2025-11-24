import { Link } from 'react-router';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  linkText?: string;
  linkHref?: string;
}

export function SectionHeader({
  title,
  subtitle,
  linkText = '모두 보기 →',
  linkHref,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      {/* 제목 영역 */}
      <div>
        <h2 className="text-heading-2 text-primary">{title}</h2>
        <p className="text-body-small text-tertiary mt-2">{subtitle}</p>
      </div>

      {/* 링크 (선택) */}
      {linkHref && (
        <Link
          to={linkHref}
          className="text-label text-secondary hover:text-primary transition-colors mt-1"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}
