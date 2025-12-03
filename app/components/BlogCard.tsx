import { Link } from 'react-router';
import type { Post } from '~/types/post';

interface BlogCardProps {
  post: Post;
  thumbnailUrl?: string; // 나중에 실제 이미지 사용 시
}

export function BlogCard({ post, thumbnailUrl }: BlogCardProps) {
  // 날짜 포맷팅 (ISO 8601 → YYYY.MM.DD)
  const formattedDate = new Date(post.createdAt)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '.');

  // 읽기 시간 추정 (간단히 5분으로 고정)
  // TODO: content 기반으로 계산
  const readingTime = '5 min read';

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="bg-secondary border border-default rounded-2xl p-4 flex flex-col gap-4 hover:border-strong transition-colors h-full"
    >
      {/* 썸네일 이미지 */}
      <div className="w-full h-[168px] rounded-lg border border-strong overflow-hidden bg-tertiary">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          // 임시 플레이스홀더
          <div className="w-full h-full flex items-center justify-center text-muted">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col gap-3 h-[168px]">
        {/* 카테고리 태그 (첫 번째 태그만 표시) */}
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-tertiary self-start">
          <span className="text-label-small text-secondary">
            {post.tags[0] || 'General'}
          </span>
        </div>

        {/* 제목 */}
        <h3 className="text-heading-3 text-primary line-clamp-1">
          {post.title}
        </h3>

        {/* 설명 */}
        <p className="text-body text-secondary line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        {/* 메타 정보 (날짜, 읽기 시간) */}
        <div className="flex gap-4 items-center">
          {/* 날짜 */}
          <div className="flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-tertiary"
            >
              <rect x="2" y="3" width="10" height="9" rx="1" />
              <path d="M2 6h10M5 2v2M9 2v2" />
            </svg>
            <span className="text-caption text-tertiary">{formattedDate}</span>
          </div>

          {/* 읽기 시간 */}
          <div className="flex items-center gap-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-tertiary"
            >
              <circle cx="7" cy="7" r="5" />
              <path d="M7 4v3l2 2" />
            </svg>
            <span className="text-caption text-tertiary">{readingTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
