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

  // 3. 메타데이터 업데이트
  const metadata: Post = {
    ...post,
    thumbnail,
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
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`   ✓ ${filename}`);
}

/**
 * MDX 파일 저장
 */
async function saveMdx(
  contentType: 'posts' | 'projects',
  slug: string,
  content: string
): Promise<void> {
  const dir = path.join(CONTENT_DIR, contentType);
  await fs.mkdir(dir, { recursive: true });

  const filepath = path.join(dir, `${slug}.mdx`);
  await fs.writeFile(filepath, content, 'utf-8');
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
    await saveMdx('posts', post.slug, mdx);
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

  console.log('\n✅ Sync complete!');
  console.log(`   - ${processedPosts.length} posts`);
  console.log(`   - ${processedProjects.length} projects`);
  console.log(`   - ${bookmarks.length} bookmarks`);
}

main().catch((error) => {
  console.error('❌ Sync failed:', error);
  process.exit(1);
});
