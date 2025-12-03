import { data } from 'react-router';
import { getPosts, getProjects, getBookmarks } from '~/lib/notion.server';

export async function loader() {
  try {
    const [posts, projects, bookmarks] = await Promise.all([
      getPosts({ limit: 5 }),
      getProjects({ limit: 5 }),
      getBookmarks({ limit: 5 }),
    ]);

    return data({
      success: true,
      data: {
        posts,
        projects,
        bookmarks,
      },
    });
  } catch (error) {
    console.error('Notion API Error:', error);
    return data(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
