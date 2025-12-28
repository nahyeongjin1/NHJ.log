import * as fs from 'fs';
import * as path from 'path';
import type { Post, Project, Bookmark } from '~/types/post';

/**
 * Load data from pre-generated JSON files (created by sync-notion script)
 * This avoids Notion API calls at runtime
 */

function getContentPath(filename: string): string {
  // In Netlify serverless, files are at /var/task/content
  // In local dev, files are at ./content
  const possiblePaths = [
    path.join(process.cwd(), 'content', filename),
    path.join('/var/task', 'content', filename),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Fallback to cwd path
  return possiblePaths[0];
}

function loadJson<T>(filename: string): T[] {
  const filePath = getContentPath(filename);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T[];
  } catch (error) {
    console.error(`Failed to load ${filename}:`, error);
    return [];
  }
}

export function getPosts(options?: { limit?: number }): Post[] {
  const posts = loadJson<Post>('posts.json');

  // Sort by createdAt descending (newest first)
  posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (options?.limit) {
    return posts.slice(0, options.limit);
  }

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const posts = loadJson<Post>('posts.json');
  return posts.find((post) => post.slug === slug) ?? null;
}

export function getProjects(options?: { limit?: number }): Project[] {
  const projects = loadJson<Project>('projects.json');

  // Sort by createdAt descending (newest first)
  projects.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (options?.limit) {
    return projects.slice(0, options.limit);
  }

  return projects;
}

export function getProjectBySlug(slug: string): Project | null {
  const projects = loadJson<Project>('projects.json');
  return projects.find((project) => project.slug === slug) ?? null;
}

export function getBookmarks(options?: { limit?: number }): Bookmark[] {
  const bookmarks = loadJson<Bookmark>('bookmarks.json');

  // Sort by createdAt descending (newest first)
  bookmarks.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (options?.limit) {
    return bookmarks.slice(0, options.limit);
  }

  return bookmarks;
}
