import { useState } from 'react';
import { Globe } from 'lucide-react';
import { Badge } from './Badge';
import type { Bookmark } from '~/types/post';

interface BookmarkItemProps {
  bookmark: Bookmark;
}

export function BookmarkItem({ bookmark }: BookmarkItemProps) {
  const { title, url, description, category, tags, createdAt } = bookmark;

  // URL에서 도메인 추출 (www. 제거)
  const domain = new URL(url).hostname.replace(/^www\./, '');

  // Favicon URLs
  const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  const duckduckgoUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;

  const [faviconSrc, setFaviconSrc] = useState(googleFaviconUrl);
  const [faviconErrorCount, setFaviconErrorCount] = useState(0);

  const handleFaviconError = () => {
    if (faviconErrorCount === 0) {
      setFaviconSrc(duckduckgoUrl);
      setFaviconErrorCount(1);
    } else {
      setFaviconErrorCount(2);
    }
  };

  // 날짜 포맷: 2025. 12. 14.
  const formattedDate = new Date(createdAt).toLocaleDateString('ko-KR');

  return (
    <div className="flex gap-4 py-4 border-b border-subtle last:border-b-0">
      {/* Favicon */}
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
        {faviconErrorCount < 2 ? (
          <img
            src={faviconSrc}
            alt=""
            width={24}
            height={24}
            className="rounded"
            onError={handleFaviconError}
          />
        ) : (
          <Globe size={24} className="text-tertiary" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* 상단: 제목 + 카테고리 */}
        <div className="flex items-start justify-between gap-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-label text-primary font-medium hover:underline truncate"
          >
            {title}
          </a>
          {category && (
            <Badge variant="filled" size="sm" className="flex-shrink-0">
              {category}
            </Badge>
          )}
        </div>

        {/* 설명 */}
        {description && (
          <p className="text-body-small text-secondary mt-1 line-clamp-2">
            {description}
          </p>
        )}

        {/* 하단: 도메인 + 날짜 + 태그 */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-caption text-tertiary">
            {domain} • {formattedDate}
          </span>
          {tags.length > 0 && (
            <div className="flex gap-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
