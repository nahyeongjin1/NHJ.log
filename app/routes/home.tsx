import { netlifyRouterContext } from '@netlify/vite-plugin-react-router';
import type { Route } from './+types/home';
import { PageLayout } from '~/components/PageLayout';
import { Hero } from '~/components/Hero';
import { SectionHeader } from '~/components/SectionHeader';
import { PostCard } from '~/components/PostCard';
import { getPublishedPosts } from '~/data/mock-posts';
import { siteConfig } from '~/config/site';

export function meta(_args: Route.MetaArgs) {
  return [
    { title: `${siteConfig.name} - ${siteConfig.description}` },
    { name: 'description', content: siteConfig.description },
  ];
}

// Example middleware that adds a custom header
const customDateHeaderMiddleware: Route.MiddlewareFunction = async (
  _request,
  next
) => {
  const response = await next();
  response.headers.set('X-Current-Date', new Date().toUTCString());
  return response;
};

// Example middleware that uses Netlify context
const logMiddleware: Route.MiddlewareFunction = async ({
  request,
  context,
}) => {
  const country =
    context.get(netlifyRouterContext).geo?.country?.name || 'unknown location';
  // eslint-disable-next-line no-console
  console.log(
    `Handling ${request.method} request to ${request.url} from ${country}`
  );
};

export const middleware: Route.MiddlewareFunction[] = [
  customDateHeaderMiddleware,
  logMiddleware,
];

export default function Home() {
  // 최신 포스트 3개 가져오기
  const featuredPosts = getPublishedPosts().slice(0, 3);

  return (
    <PageLayout header={<Hero />} isHero>
      {/* Featured Posts */}
      <div>
        <SectionHeader
          title="Featured Posts"
          subtitle="최근 작성한 글"
          linkHref="/posts"
        />
        <div className="grid grid-cols-3 gap-6 mt-12">
          {featuredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div className="mt-16">
        <SectionHeader
          title="Portfolio"
          subtitle="선별한 프로젝트"
          linkHref="/projects"
        />
        <div className="grid grid-cols-2 gap-6 mt-12">
          <div className="h-[434px] bg-secondary rounded-2xl border border-default flex items-center justify-center">
            <div className="text-center">
              <p className="text-body text-tertiary">E-Commerce Platform</p>
              <p className="text-label-small text-muted mt-2">Coming Soon</p>
            </div>
          </div>
          <div className="h-[434px] bg-secondary rounded-2xl border border-default flex items-center justify-center">
            <div className="text-center">
              <p className="text-body text-tertiary">Design System</p>
              <p className="text-label-small text-muted mt-2">Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
