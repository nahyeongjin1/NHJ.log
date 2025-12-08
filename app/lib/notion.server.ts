import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import type { Post, Project, Bookmark } from '~/types/post';

// Notion 클라이언트 초기화
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Database IDs
const POSTS_DB_ID = process.env.POSTS_DB_ID!;
const PROJECTS_DB_ID = process.env.PROJECTS_DB_ID!;
const BOOKMARKS_DB_ID = process.env.BOOKMARKS_DB_ID!;

/**
 * Helper Functions
 */

function getTextProperty(
  page: PageObjectResponse,
  propertyName: string
): string {
  const property = page.properties[propertyName];
  if (property?.type === 'title') {
    return property.title.map((t) => t.plain_text).join('') || '';
  }
  if (property?.type === 'rich_text') {
    return property.rich_text.map((t) => t.plain_text).join('') || '';
  }
  return '';
}

function getCheckboxProperty(
  page: PageObjectResponse,
  propertyName: string
): boolean {
  const property = page.properties[propertyName];
  if (property?.type === 'checkbox') {
    return property.checkbox;
  }
  return false;
}

function getMultiSelectProperty(
  page: PageObjectResponse,
  propertyName: string
): string[] {
  const property = page.properties[propertyName];
  if (property?.type === 'multi_select') {
    return property.multi_select.map((item) => item.name);
  }
  return [];
}

function getSelectProperty(
  page: PageObjectResponse,
  propertyName: string
): string | undefined {
  const property = page.properties[propertyName];
  if (property?.type === 'select' && property.select) {
    return property.select.name;
  }
  return undefined;
}

function getUrlProperty(
  page: PageObjectResponse,
  propertyName: string
): string | undefined {
  const property = page.properties[propertyName];
  if (property?.type === 'url') {
    return property.url || undefined;
  }
  return undefined;
}

function getDateProperty(
  page: PageObjectResponse,
  propertyName: string
): { start: string; end?: string } | undefined {
  const property = page.properties[propertyName];
  if (property?.type === 'date' && property.date) {
    return {
      start: property.date.start,
      end: property.date.end || undefined,
    };
  }
  return undefined;
}

function getCreatedTime(page: PageObjectResponse): string {
  return page.created_time;
}

function getUpdatedTime(page: PageObjectResponse): string {
  return page.last_edited_time;
}

function getRelationProperty(
  page: PageObjectResponse,
  propertyName: string
): string[] {
  const property = page.properties[propertyName];
  if (property?.type === 'relation') {
    return property.relation.map((r) => r.id);
  }
  return [];
}

/**
 * Posts APIs
 */

function parsePost(page: PageObjectResponse): Post {
  const relatedProjectIds = getRelationProperty(page, 'relatedProject');

  return {
    id: page.id,
    title: getTextProperty(page, 'Title'),
    slug: getTextProperty(page, 'slug'),
    excerpt: getTextProperty(page, 'excerpt'),
    tags: getMultiSelectProperty(page, 'tags'),
    thumbnail: getUrlProperty(page, 'thumbnail'),
    published: getCheckboxProperty(page, 'published'),
    createdAt: getCreatedTime(page),
    updatedAt: getUpdatedTime(page),
    relatedProject: relatedProjectIds[0], // 하나의 프로젝트만 연결
  };
}

export async function getPosts(options?: { limit?: number }): Promise<Post[]> {
  const response = await notion.dataSources.query({
    data_source_id: POSTS_DB_ID,
    filter: {
      property: 'published',
      checkbox: { equals: true },
    },
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: options?.limit,
  });

  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(parsePost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const response = await notion.dataSources.query({
    data_source_id: POSTS_DB_ID,
    filter: {
      and: [
        { property: 'slug', rich_text: { equals: slug } },
        { property: 'published', checkbox: { equals: true } },
      ],
    },
  });

  const page = response.results[0] as PageObjectResponse;
  if (!page || !('properties' in page)) return null;

  return parsePost(page);
}

/**
 * Projects APIs
 */

function parseProject(page: PageObjectResponse): Project {
  const statusRaw = getSelectProperty(page, 'status');
  let status: Project['status'] = undefined;
  if (statusRaw === '진행중') status = 'in-progress';
  else if (statusRaw === '완료') status = 'completed';
  else if (statusRaw === '유지보수') status = 'maintenance';

  return {
    id: page.id,
    title: getTextProperty(page, 'Title'),
    slug: getTextProperty(page, 'slug'),
    description: getTextProperty(page, 'description'),
    period: getDateProperty(page, 'period'),
    roles: getMultiSelectProperty(page, 'role'),
    status,
    techStack: getMultiSelectProperty(page, 'techStack'),
    github: getUrlProperty(page, 'github'),
    demo: getUrlProperty(page, 'demo'),
    thumbnail: getUrlProperty(page, 'thumbnail'),
    published: getCheckboxProperty(page, 'published'),
    createdAt: getCreatedTime(page),
    updatedAt: getUpdatedTime(page),
    relatedPosts: getRelationProperty(page, 'relatedPosts'),
  };
}

export async function getProjects(options?: {
  limit?: number;
}): Promise<Project[]> {
  const response = await notion.dataSources.query({
    data_source_id: PROJECTS_DB_ID,
    filter: {
      property: 'published',
      checkbox: { equals: true },
    },
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: options?.limit,
  });

  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(parseProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const response = await notion.dataSources.query({
    data_source_id: PROJECTS_DB_ID,
    filter: {
      and: [
        { property: 'slug', rich_text: { equals: slug } },
        { property: 'published', checkbox: { equals: true } },
      ],
    },
  });

  const page = response.results[0] as PageObjectResponse;
  if (!page || !('properties' in page)) return null;

  return parseProject(page);
}

/**
 * Bookmarks APIs
 */

function parseBookmark(page: PageObjectResponse): Bookmark {
  return {
    id: page.id,
    title: getTextProperty(page, 'Title'),
    url: getUrlProperty(page, 'url') || '',
    category: getSelectProperty(page, 'category'),
    tags: getMultiSelectProperty(page, 'tags'),
    description: getTextProperty(page, 'description'),
    published: getCheckboxProperty(page, 'published'),
    createdAt: getCreatedTime(page),
    updatedAt: getUpdatedTime(page),
  };
}

export async function getBookmarks(options?: {
  limit?: number;
}): Promise<Bookmark[]> {
  const response = await notion.dataSources.query({
    data_source_id: BOOKMARKS_DB_ID,
    filter: {
      property: 'published',
      checkbox: { equals: true },
    },
    sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    page_size: options?.limit,
  });

  return response.results
    .filter((page): page is PageObjectResponse => 'properties' in page)
    .map(parseBookmark);
}
