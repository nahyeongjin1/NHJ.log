import { data, isRouteErrorResponse } from 'react-router';
import type { Route } from './+types/portfolio';
import { PortfolioCard } from '~/components/PortfolioCard';
import { getProjects, getPosts } from '~/lib/notion.server';
import { siteConfig } from '~/config/site';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: `Portfolio - ${siteConfig.name}` },
    {
      name: 'description',
      content: '참여했던 프로젝트들과 그 과정에서의 경험을 정리했습니다.',
    },
  ];
}

export async function loader() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  // relatedPosts ID로 Post 객체 매핑
  const projectsWithPosts = projects.map((project) => {
    const relatedPosts = (project.relatedPosts || [])
      .map((postId) => posts.find((post) => post.id === postId))
      .filter((post): post is NonNullable<typeof post> => post !== undefined);
    return { project, relatedPosts };
  });

  return data({ projectsWithPosts });
}

export default function PortfolioPage({ loaderData }: Route.ComponentProps) {
  const { projectsWithPosts } = loaderData;

  return (
    <div className="bg-primary min-h-screen">
      {/* 타이틀 섹션 */}
      <section className="max-w-[1260px] mx-auto px-10 pt-[72px]">
        <div className="flex flex-col gap-6">
          <h1 className="text-heading-2 text-primary">Portfolio</h1>
          <p className="text-body text-secondary">
            참여했던 프로젝트들과 그 과정에서의 경험을 정리했습니다.
          </p>
        </div>
      </section>

      {/* 포트폴리오 카드 그리드 */}
      <section className="mt-12 border-t border-strong">
        <div className="max-w-[1260px] mx-auto px-12 py-12">
          {projectsWithPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
              {projectsWithPosts.map(({ project, relatedPosts }) => (
                <div key={project.id} className="w-full max-w-[550px]">
                  <PortfolioCard
                    project={project}
                    relatedPosts={relatedPosts}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-body text-tertiary">
                아직 등록된 프로젝트가 없습니다.
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
  let details = '포트폴리오를 불러오는 중 문제가 발생했습니다.';

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
          href="/portfolio"
          className="inline-block px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg text-label hover:opacity-90 transition-opacity"
        >
          다시 시도
        </a>
      </div>
    </div>
  );
}
