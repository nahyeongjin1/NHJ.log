import { getPosts, getProjects, getBookmarks } from '~/lib/notion.server';

async function main() {
  console.log('🚀 Starting Notion sync...\n');

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

  // 2. 포스트 변환 (MDX)
  console.log('📝 Converting posts to MDX...');
  for (const post of posts) {
    console.log(`   - ${post.title}`);
    // TODO: 블록 가져오기 + MDX 변환
  }

  // 3. 메타데이터 저장
  console.log('\n💾 Saving metadata...');
  // TODO: JSON 파일 저장

  console.log('\n✅ Sync complete!');
}

main().catch((error) => {
  console.error('❌ Sync failed:', error);
  process.exit(1);
});
