import { netlifyRouterContext } from '@netlify/vite-plugin-react-router';
import { data } from 'react-router';
import type { Route } from './+types/home';
import { PageLayout } from '~/components/PageLayout';
import { Hero } from '~/components/Hero';
import { SectionHeader } from '~/components/SectionHeader';
import { PostCard } from '~/components/PostCard';
import { ProjectCard } from '~/components/ProjectCard';
import { getPosts, getProjects } from '~/lib/content.server';
import { siteConfig } from '~/config/site';
import { generateMeta } from '~/lib/seo';

export function meta(_args: Route.MetaArgs) {
  return generateMeta({
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  });
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

export function loader() {
  const posts = getPosts({ limit: 3 });
  const projects = getProjects({ limit: 2 });
  return data({ posts, projects });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts, projects } = loaderData;

  return (
    <PageLayout header={<Hero />} isHero>
      {/* Featured Posts */}
      <div>
        <SectionHeader
          title="Featured Posts"
          subtitle="최근 작성한 글"
          linkHref="/posts"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} thumbnailUrl={post.thumbnail} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
