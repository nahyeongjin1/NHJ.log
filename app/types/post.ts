export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // 나중에 상세 페이지에서 사용
  date: string; // ISO 8601 format (YYYY-MM-DD)
  tags: string[];
  slug: string; // URL-friendly identifier
  published: boolean;
}
