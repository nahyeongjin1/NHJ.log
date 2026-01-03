import { Link } from 'react-router';
import { Image, Calendar, Clock } from 'lucide-react';
import type { Post } from '~/types/post';

interface PostCardProps {
  post: Post;
  thumbnailUrl?: string;
  onTagClick?: (tag: string) => void;
}

export function PostCard({ post, thumbnailUrl, onTagClick }: PostCardProps) {
  // 날짜 포맷팅 (ISO 8601 → YYYY.MM.DD)
  const formattedDate = new Date(post.createdAt)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '.');

  // 읽기 시간 (sync-notion에서 계산됨)
  const readingTime = post.readingTime
    ? `${post.readingTime} min read`
    : '1 min read';

  return (
    <Link
      to={`/posts/${post.slug}`}
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
            <Image size={48} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col gap-3">
        {/* 태그 (최대 2개 + 나머지 +N) */}
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 2).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onTagClick?.(tag);
              }}
              className="px-2 py-0.5 rounded-full bg-tertiary text-label-small text-secondary hover:bg-strong transition-colors"
            >
              {tag}
            </button>
          ))}
          {post.tags.length > 2 && (
            <span className="px-2 py-0.5 text-label-small text-tertiary">
              +{post.tags.length - 2}
            </span>
          )}
        </div>

        {/* 제목 */}
        <h3 className="text-heading-3 text-primary line-clamp-2">
          {post.title}
        </h3>

        {/* 설명 */}
        <p className="text-body text-secondary line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {/* 메타 정보 (날짜, 읽기 시간) */}
        <div className="flex gap-4 items-center text-tertiary">
          {/* 날짜 */}
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span className="text-caption">{formattedDate}</span>
          </div>

          {/* 읽기 시간 */}
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span className="text-caption">{readingTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
