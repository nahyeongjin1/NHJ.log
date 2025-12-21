import { useState } from 'react';
import { data, isRouteErrorResponse, useSearchParams } from 'react-router';
import type { Route } from './+types/bookmarks';
import { PageLayout } from '~/components/PageLayout';
import { PageHeader } from '~/components/PageHeader';
import { CategoryFilter } from '~/components/CategoryFilter';
import { BookmarkList } from '~/components/BookmarkList';
import { getBookmarks } from '~/lib/notion.server';
import { siteConfig } from '~/config/site';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: `${siteConfig.pages.bookmarks.title} - ${siteConfig.name}` },
    { name: 'description', content: siteConfig.pages.bookmarks.description },
  ];
}

export async function loader() {
  const bookmarks = await getBookmarks();

  // 카테고리 목록 추출 (중복 제거, 정렬)
  const categories = [
    ...new Set(bookmarks.map((b) => b.category).filter(Boolean)),
  ].sort() as string[];

  return data({ bookmarks, categories });
}

export default function BookmarksPage({ loaderData }: Route.ComponentProps) {
  const { bookmarks, categories } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // URL에서 카테고리 읽기
  const selectedCategory = searchParams.get('category');

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string | null) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  // 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 필터링된 북마크
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    // 카테고리 필터
    if (selectedCategory && bookmark.category !== selectedCategory) {
      return false;
    }

    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.description?.toLowerCase().includes(query) ||
        bookmark.category?.toLowerCase().includes(query) ||
        bookmark.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  return (
    <PageLayout
      header={
        <PageHeader
          title={siteConfig.pages.bookmarks.title}
          description={siteConfig.pages.bookmarks.description}
          searchPlaceholder="제목, 설명, 태그로 검색..."
          onSearch={handleSearch}
        />
      }
    >
      <div className="space-y-6">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onChange={handleCategoryChange}
        />
        <BookmarkList bookmarks={filteredBookmarks} />
      </div>
    </PageLayout>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = '오류가 발생했습니다';
  let details = '북마크를 불러오는 중 문제가 발생했습니다.';

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
          href="/bookmarks"
          className="inline-block px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg text-label hover:opacity-90 transition-opacity"
        >
          다시 시도
        </a>
      </div>
    </div>
  );
}
