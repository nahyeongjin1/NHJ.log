import { useState } from 'react';
import { data, isRouteErrorResponse } from 'react-router';
import type { Route } from './+types/posts';
import { PageLayout } from '~/components/PageLayout';
import { PageHeader } from '~/components/PageHeader';
import { PostCard } from '~/components/PostCard';
import { getPosts } from '~/lib/content.server';
import { siteConfig } from '~/config/site';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: `${siteConfig.pages.posts.title} - ${siteConfig.name}` },
    { name: 'description', content: siteConfig.pages.posts.description },
  ];
}

export async function loader() {
  const posts = await getPosts();
  return data({ posts });
}

export default function PostsPage({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 필터링 (제목, 태그, excerpt)
  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <PageLayout
      header={
        <PageHeader
          title={siteConfig.pages.posts.title}
          description={siteConfig.pages.posts.description}
          searchPlaceholder="제목, 내용, 태그로 검색..."
          searchValue={searchQuery}
          onSearch={setSearchQuery}
        />
      }
    >
      {filteredPosts.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="w-[371px]">
              <PostCard
                post={post}
                thumbnailUrl={post.thumbnail}
                onTagClick={setSearchQuery}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-body text-tertiary">아직 작성된 글이 없습니다.</p>
        </div>
      )}
    </PageLayout>
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
          href="/posts"
          className="inline-block px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg text-label hover:opacity-90 transition-opacity"
        >
          다시 시도
        </a>
      </div>
    </div>
  );
}
