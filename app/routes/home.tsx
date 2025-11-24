import { netlifyRouterContext } from '@netlify/vite-plugin-react-router';
import type { Route } from './+types/home';
import { SectionHeader } from '~/components/SectionHeader';
import { BlogCard } from '~/components/BlogCard';
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
    <div>
      {/* Hero Section */}
      <section className="bg-primary">
        <div className="max-w-[1260px] mx-auto px-10 py-32">
          <h1 className="text-heading-1 text-primary mb-6">
            {siteConfig.hero.title.line1}
            <br />
            {siteConfig.hero.title.line2}
          </h1>
          <p className="text-body text-secondary max-w-3xl">
            {siteConfig.hero.description}
          </p>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="bg-primary py-16">
        <div className="max-w-[1260px] mx-auto px-12">
          <SectionHeader
            title="Featured Posts"
            subtitle="최근 작성한 글"
            linkHref="/blog"
          />

          <div className="grid grid-cols-3 gap-6 mt-12">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section - 자리만 확보 */}
      <section className="bg-primary py-16">
        <div className="max-w-[1260px] mx-auto px-12">
          <SectionHeader
            title="Portfolio"
            subtitle="선별한 프로젝트"
            linkHref="/portfolio"
          />

          <div className="grid grid-cols-2 gap-6 mt-12">
            {/* Placeholder - 나중에 PortfolioCard 컴포넌트로 교체 */}
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
      </section>
    </div>
  );
}
