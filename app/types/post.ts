export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  thumbnail?: string;
  published: boolean;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  relatedProject?: string; // Project ID (Relation)
  readingTime?: number; // 예상 읽기 시간 (분)
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  period?: {
    start: string;
    end?: string;
  };
  roles: string[]; // Frontend, Backend, Infra 등
  status?: 'in-progress' | 'completed' | 'maintenance';
  techStack: string[];
  github?: string;
  demo?: string;
  thumbnail?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  relatedPosts?: string[]; // Post IDs (Relation)
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category?: string;
  tags: string[];
  description?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
