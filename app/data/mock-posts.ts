import type { Post } from '~/types/post';

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'React Router v7으로 블로그 만들기',
    excerpt:
      'React Router v7의 새로운 기능들을 활용해서 개인 블로그를 만들어보았습니다. SSR, 파일 기반 라우팅 등 다양한 기능을 소개합니다.',
    createdAt: '2025-11-24T00:00:00.000Z',
    updatedAt: '2025-11-24T00:00:00.000Z',
    tags: ['React', 'React Router', 'Web'],
    slug: 'building-blog-with-react-router-v7',
    published: true,
  },
  {
    id: '2',
    title: 'Tailwind CSS로 디자인 시스템 구축하기',
    excerpt:
      'CSS Variables와 Tailwind CSS를 조합해서 유지보수하기 쉬운 디자인 시스템을 만드는 방법을 공유합니다.',
    createdAt: '2025-11-20T00:00:00.000Z',
    updatedAt: '2025-11-20T00:00:00.000Z',
    tags: ['CSS', 'Tailwind', 'Design System'],
    slug: 'design-system-with-tailwind',
    published: true,
  },
  {
    id: '3',
    title: 'TypeScript 타입 시스템 깊게 이해하기',
    excerpt:
      'TypeScript의 타입 시스템을 제대로 활용하면 더 안전하고 생산적인 코드를 작성할 수 있습니다. 실전 예제와 함께 알아봅니다.',
    createdAt: '2025-11-15T00:00:00.000Z',
    updatedAt: '2025-11-15T00:00:00.000Z',
    tags: ['TypeScript', 'Programming'],
    slug: 'typescript-type-system-deep-dive',
    published: true,
  },
  {
    id: '4',
    title: 'Netlify로 프론트엔드 배포 자동화하기',
    excerpt:
      'GitHub Actions와 Netlify를 연동해서 Push만 하면 자동으로 배포되는 CI/CD 파이프라인을 구축했습니다.',
    createdAt: '2025-11-10T00:00:00.000Z',
    updatedAt: '2025-11-10T00:00:00.000Z',
    tags: ['DevOps', 'Netlify', 'CI/CD'],
    slug: 'frontend-deployment-automation-with-netlify',
    published: true,
  },
];

// 날짜순으로 정렬된 포스트 반환
export function getPublishedPosts(): Post[] {
  return mockPosts
    .filter((post) => post.published)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

// 특정 슬러그의 포스트 찾기
export function getPostBySlug(slug: string): Post | undefined {
  return mockPosts.find((post) => post.slug === slug);
}

// 특정 태그의 포스트 필터링
export function getPostsByTag(tag: string): Post[] {
  return getPublishedPosts().filter((post) => post.tags.includes(tag));
}
