import { useMdxComponent, useMdxAttributes } from 'react-router-mdx/client';
import { init, loadMdx } from 'react-router-mdx/server';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import type { Route } from './+types/posts.$slug';
import { PageLayout } from '~/components/PageLayout';
import { siteConfig } from '~/config/site';
import { Callout } from '~/components/mdx/Callout';
import { Toggle } from '~/components/mdx/Toggle';
import { Image } from '~/components/mdx/Image';
import { LinkCard } from '~/components/mdx/LinkCard';
import { Embed } from '~/components/mdx/Embed';
import { Text } from '~/components/mdx/Text';
import { Mermaid } from '~/components/mdx/Mermaid';
import { CodeBlock } from '~/components/mdx/CodeBlock';

const components = {
  Callout,
  Toggle,
  Image,
  LinkCard,
  Embed,
  Text,
  Mermaid,
  pre: CodeBlock,
};

interface PostAttributes {
  title: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  thumbnail?: string;
}

export function meta({ data }: Route.MetaArgs) {
  const attributes = data?.attributes as PostAttributes | undefined;
  if (!attributes) {
    return [{ title: 'Post Not Found' }];
  }
  return [
    { title: `${attributes.title} - ${siteConfig.name}` },
    { name: 'description', content: attributes.excerpt },
    { property: 'og:title', content: attributes.title },
    { property: 'og:description', content: attributes.excerpt },
    ...(attributes.thumbnail
      ? [{ property: 'og:image', content: attributes.thumbnail }]
      : []),
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  // Initialize at runtime (needed for serverless environments like Netlify)
  init({ path: 'content/posts', alias: 'posts' });

  return loadMdx(request, {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: 'plastic',
          keepBackground: true,
        },
      ],
    ],
  });
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PostPage() {
  const MdxContent = useMdxComponent(components);
  const rawAttributes = useMdxAttributes();
  const attributes = rawAttributes as unknown as PostAttributes;

  return (
    <PageLayout
      header={
        <div className="flex flex-col gap-4">
          <h1 className="text-heading-1 text-primary">{attributes.title}</h1>
          <div className="flex items-center gap-4 text-caption text-tertiary">
            <time dateTime={attributes.createdAt}>
              {formatDate(attributes.createdAt)}
            </time>
            {attributes.updatedAt !== attributes.createdAt && (
              <span>(수정: {formatDate(attributes.updatedAt)})</span>
            )}
          </div>
          {attributes.tags && attributes.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attributes.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-tertiary text-secondary text-caption rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      }
    >
      <article className="prose max-w-none">
        {/* eslint-disable-next-line react-hooks/static-components  */}
        <MdxContent />
      </article>
    </PageLayout>
  );
}

export function ErrorBoundary() {
  return (
    <div className="bg-primary min-h-screen">
      <div className="max-w-[1260px] mx-auto px-10 py-20 text-center">
        <h1 className="text-heading-2 text-primary mb-4">
          포스트를 찾을 수 없습니다
        </h1>
        <p className="text-body text-secondary mb-8">
          요청하신 포스트가 존재하지 않거나 삭제되었습니다.
        </p>
        <a
          href="/posts"
          className="inline-block px-6 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg text-label hover:opacity-90 transition-opacity"
        >
          포스트 목록으로
        </a>
      </div>
    </div>
  );
}
