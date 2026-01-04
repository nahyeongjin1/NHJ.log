/* eslint-disable no-console */

import * as fs from 'fs/promises';
import * as path from 'path';
import {
  getPosts,
  getProjects,
  getBookmarks,
  getPageBlocks,
} from '~/lib/notion.server';
import { uploadFromUrl, type ContentType } from '~/lib/r2.server';
import { convertBlocksAsync } from './notion-to-mdx';
import type { Post, Project } from '~/types/post';

// 출력 디렉토리
const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

// 사이트 URL
const SITE_URL = 'https://hyeongjin.me';

// 읽기 시간 계산 (한글 기준 분당 500자)
const CHARS_PER_MINUTE = 500;

function calculateReadingTime(content: string): number {
  // MDX 문법, 코드 블록 등 제거하고 순수 텍스트만 계산
  const textOnly = content
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
    .replace(/`[^`]*`/g, '') // 인라인 코드 제거
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크 텍스트만
    .replace(/[#*_~>\-|]/g, '') // 마크다운 문법 제거
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/\s+/g, ''); // 공백 제거

  const minutes = Math.ceil(textOnly.length / CHARS_PER_MINUTE);
  return Math.max(1, minutes); // 최소 1분
}

/**
 * Thumbnail을 R2에 업로드하고 URL 반환
 */
async function uploadThumbnail(
  thumbnailUrl: string,
  pageId: string,
  contentType: ContentType
): Promise<string> {
  const result = await uploadFromUrl(thumbnailUrl, {
    contentType,
    pageId,
    blockId: 'thumbnail',
    skipIfExists: true,
  });
  return result.url;
}

/**
 * Post 처리: thumbnail 업로드 + MDX 변환
 */
async function processPost(
  post: Post
): Promise<{ metadata: Post; mdx: string }> {
  // 1. Thumbnail 업로드
  let thumbnail = post.thumbnail;
  if (thumbnail) {
    console.log(`     └─ Uploading thumbnail...`);
    thumbnail = await uploadThumbnail(thumbnail, post.id, 'posts');
  }

  // 2. 블록 가져오기 + MDX 변환
  const blocks = await getPageBlocks(post.id);
  console.log(`     └─ Blocks: ${blocks.length}`);

  const mdx = await convertBlocksAsync(blocks, {
    pageId: post.id,
    contentType: 'posts',
  });

  // 3. 읽기 시간 계산
  const readingTime = calculateReadingTime(mdx);
  console.log(`     └─ Reading time: ${readingTime}분`);

  // 4. 메타데이터 업데이트
  const metadata: Post = {
    ...post,
    thumbnail,
    readingTime,
  };

  return { metadata, mdx };
}

/**
 * Project 처리: thumbnail 업로드
 */
async function processProject(project: Project): Promise<Project> {
  let thumbnail = project.thumbnail;
  if (thumbnail) {
    console.log(`     └─ Uploading thumbnail...`);
    thumbnail = await uploadThumbnail(thumbnail, project.id, 'projects');
  }

  return {
    ...project,
    thumbnail,
  };
}

/**
 * JSON 파일 저장
 */
async function saveJson<T>(filename: string, data: T): Promise<void> {
  const filepath = path.join(CONTENT_DIR, filename);
  await fs.writeFile(filepath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(`   ✓ ${filename}`);
}

/**
 * Frontmatter 생성
 */
function generateFrontmatter(post: Post): string {
  const lines = [
    '---',
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `excerpt: "${post.excerpt.replace(/"/g, '\\"')}"`,
    `createdAt: "${post.createdAt}"`,
    `updatedAt: "${post.updatedAt}"`,
    `tags: [${post.tags.map((t) => `"${t}"`).join(', ')}]`,
  ];

  if (post.thumbnail) {
    lines.push(`thumbnail: "${post.thumbnail}"`);
  }

  lines.push('---');
  return lines.join('\n');
}

/**
 * MDX 파일 저장
 */
async function saveMdx(
  contentType: 'posts' | 'projects',
  slug: string,
  content: string,
  post: Post
): Promise<void> {
  const dir = path.join(CONTENT_DIR, contentType);
  await fs.mkdir(dir, { recursive: true });

  const frontmatter = generateFrontmatter(post);
  const filepath = path.join(dir, `${slug}.mdx`);
  const mdxContent = `${frontmatter}\n\n${content}\n`;
  await fs.writeFile(filepath, mdxContent, 'utf-8');
}

/**
 * Sitemap XML 생성
 */
function generateSitemap(posts: Post[]): string {
  const today = new Date().toISOString().split('T')[0];

  // 정적 페이지
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/posts', priority: '0.9', changefreq: 'daily' },
    { loc: '/projects', priority: '0.8', changefreq: 'weekly' },
    { loc: '/bookmarks', priority: '0.7', changefreq: 'weekly' },
    { loc: '/about', priority: '0.6', changefreq: 'monthly' },
  ];

  const staticEntries = staticPages
    .map(
      (page) => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n');

  // 포스트 페이지
  const postEntries = posts
    .map(
      (post) => `  <url>
    <loc>${SITE_URL}/posts/${post.slug}</loc>
    <lastmod>${post.updatedAt.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>
`;
}

/**
 * Sitemap 저장
 */
async function saveSitemap(posts: Post[]): Promise<void> {
  const sitemap = generateSitemap(posts);
  const filepath = path.join(PUBLIC_DIR, 'sitemap.xml');
  await fs.writeFile(filepath, sitemap, 'utf-8');
  console.log(`   ✓ sitemap.xml (${posts.length + 5} URLs)`);
}

async function main() {
  console.log('🚀 Starting Notion sync...\n');

  // content 디렉토리 생성
  await fs.mkdir(CONTENT_DIR, { recursive: true });

  // 1. Notion API 호출
  console.log('📚 Fetching data from Notion...');
  const [posts, projects, bookmarks] = await Promise.all([
    getPosts(),
    getProjects(),
    getBookmarks(),
  ]);

  console.log(`   - Posts: ${posts.length}`);
  console.log(`   - Projects: ${projects.length}`);
  console.log(`   - Bookmarks: ${bookmarks.length}\n`);

  // 2. Posts 처리
  console.log('📝 Processing posts...');
  const processedPosts: Post[] = [];
  for (const post of posts) {
    console.log(`   - ${post.title}`);
    const { metadata, mdx } = await processPost(post);
    processedPosts.push(metadata);
    await saveMdx('posts', post.slug, mdx, metadata);
  }

  // 3. Projects 처리
  console.log('\n🛠️  Processing projects...');
  const processedProjects: Project[] = [];
  for (const project of projects) {
    console.log(`   - ${project.title}`);
    const metadata = await processProject(project);
    processedProjects.push(metadata);
  }

  // 4. 메타데이터 저장
  console.log('\n💾 Saving metadata...');
  await saveJson('posts.json', processedPosts);
  await saveJson('projects.json', processedProjects);
  await saveJson('bookmarks.json', bookmarks);

  // 5. Sitemap 생성
  console.log('\n🗺️  Generating sitemap...');
  await saveSitemap(processedPosts);

  console.log('\n✅ Sync complete!');
  console.log(`   - ${processedPosts.length} posts`);
  console.log(`   - ${processedProjects.length} projects`);
  console.log(`   - ${bookmarks.length} bookmarks`);
}

main().catch((error) => {
  console.error('❌ Sync failed:', error);
  process.exit(1);
});
