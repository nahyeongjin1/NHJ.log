import { Link } from 'react-router';
import { Image, ArrowUpRight, FileText } from 'lucide-react';
import type { Project, Post } from '~/types/post';

interface PortfolioCardProps {
  project: Project;
  relatedPosts?: Post[]; // relatedPosts ID로 매칭된 Post 목록
}

export function PortfolioCard({
  project,
  relatedPosts = [],
}: PortfolioCardProps) {
  // 기간 포맷팅 (2024-06 → 2024.06)
  const formatPeriod = (period?: { start: string; end?: string }) => {
    if (!period) return '';
    const start = period.start.slice(0, 7).replace('-', '.');
    const end = period.end
      ? period.end.slice(0, 7).replace('-', '.')
      : '진행중';
    return `${start} - ${end}`;
  };

  // 외부 링크 (demo 우선, 없으면 github)
  const externalLink = project.demo || project.github;

  return (
    <div className="bg-secondary rounded-[20px] overflow-hidden flex flex-col w-full">
      {/* 썸네일 이미지 */}
      <div className="w-full h-[200px] border-b-2 border-strong overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-tertiary text-muted">
            <Image size={64} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* 콘텐츠 */}
      <div className="p-6 flex flex-col gap-4 border-t-2 border-strong">
        {/* 제목 + 외부 링크 */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="text-heading-3 text-primary line-clamp-2">
              {project.title}
            </h3>
            <p className="text-label-small text-tertiary">
              {formatPeriod(project.period)}
            </p>
          </div>
          {externalLink && (
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 p-1 hover:bg-tertiary rounded transition-colors text-secondary"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowUpRight size={20} />
            </a>
          )}
        </div>

        {/* 역할 박스 */}
        {project.roles.length > 0 && (
          <div className="bg-tertiary rounded-lg p-4">
            <p className="text-label-small text-primary font-semibold mb-1">
              역할
            </p>
            <p className="text-label-small text-tertiary">
              {project.roles.join(' / ')}
            </p>
          </div>
        )}

        {/* 설명 */}
        <p className="text-body text-secondary line-clamp-4">
          {project.description}
        </p>

        {/* 기술 스택 */}
        {project.techStack.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-label-small text-primary font-semibold">
              기술 스택
            </p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-primary rounded-full text-label-small text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 관련 트러블슈팅 */}
        {relatedPosts.length > 0 && (
          <div className="flex flex-col gap-3 pt-4 border-t border-default">
            <div className="flex items-center gap-2 text-primary">
              <FileText size={16} />
              <p className="text-label-small font-semibold">관련 트러블슈팅</p>
            </div>
            <div className="flex flex-col gap-2">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="text-label-small text-tertiary hover:text-secondary transition-colors px-2 py-1.5 rounded hover:bg-tertiary truncate"
                >
                  → {post.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GitHub/Demo 링크 (둘 다 있을 때) */}
      {project.github && project.demo && (
        <div className="px-6 pb-6 flex gap-3">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-4 border border-strong rounded-lg text-center text-label-small text-secondary bg-tertiary hover:opacity-90 transition-colors"
          >
            GitHub
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-4 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg text-center text-label-small hover:opacity-90 transition-opacity"
          >
            Demo
          </a>
        </div>
      )}
    </div>
  );
}
