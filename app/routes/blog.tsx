import { data, isRouteErrorResponse } from 'react-router';
import type { Route } from './+types/blog';
import { BlogCard } from '~/components/BlogCard';
import { getPosts } from '~/lib/notion.server';
import { siteConfig } from '~/config/site';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: `${siteConfig.pages.blog.title} - ${siteConfig.name}` },
    { name: 'description', content: siteConfig.pages.blog.description },
  ];
}

export async function loader() {
  const posts = await getPosts();
  return data({ posts });
}

export default function BlogPage({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <div className="bg-primary min-h-screen">
      {/* 타이틀 섹션 */}
      <section className="max-w-[1260px] mx-auto px-10 pt-[72px]">
        <div className="flex flex-col gap-6">
          <h1 className="text-heading-2 text-primary">
            {siteConfig.pages.blog.title}
          </h1>
          <p className="text-body text-secondary">
            {siteConfig.pages.blog.description}
          </p>

          {/* 검색바 */}
          <div className="relative w-full max-w-[448px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-tertiary"
              >
                <circle cx="9" cy="9" r="6" />
                <path d="M13.5 13.5L17 17" strokeLinecap="round" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="제목, 내용, 카테고리로 검색..."
              className="w-full h-10 pl-10 pr-4 bg-tertiary border border-subtle rounded-lg text-label text-primary placeholder:text-tertiary focus:outline-none focus:border-strong transition-colors"
            />
          </div>
        </div>
      </section>

      {/* 블로그 카드 그리드 */}
      <section className="border-t border-strong mt-[72px]">
        <div className="max-w-[1260px] mx-auto px-12 py-12">
          {posts.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-6">
              {posts.map((post) => (
                <div key={post.id} className="w-[371px]">
                  <BlogCard post={post} thumbnailUrl={post.thumbnail} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-body text-tertiary">
                아직 작성된 글이 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = '오류가 발생했습니다';
  let details = '블로그를 불러오는 중 문제가 발생했습니다.';

  if (isRouteErrorResponse(error)) {
    message = `${error.status} 오류`;
    details = error.statusText || details;
  } else if (error instanceof Error) {
    details = error.message;
  }

  return (
    <div className="bg-primary min-h-screen">
      <div className="max-w-[1260px] mx-auto px-10 py-20 text-center">
        <h1 className="text-heading-2 text-primary mb-4">{message}</h1>
        <p className="text-body text-secondary mb-8">{details}</p>
        <a
          href="/blog"
          className="inline-block px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg text-label hover:opacity-90 transition-opacity"
        >
          다시 시도
        </a>
      </div>
    </div>
  );
}
