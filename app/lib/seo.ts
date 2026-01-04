import { siteConfig } from '~/config/site';

interface SEOConfig {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

const DEFAULT_OG_IMAGE = `${siteConfig.url}/og-image.png`;

/**
 * SEO 메타 태그 생성
 */
export function generateMeta(config: SEOConfig) {
  const {
    title,
    description,
    url,
    type = 'website',
    image = DEFAULT_OG_IMAGE,
    publishedTime,
    modifiedTime,
    tags,
  } = config;

  const fullTitle =
    title === siteConfig.name ? title : `${title} - ${siteConfig.name}`;

  const meta = [
    // 기본 메타
    { title: fullTitle },
    { name: 'description', content: description },

    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: type },
    { property: 'og:image', content: image },
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:locale', content: 'ko_KR' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ];

  // Article 타입 추가 메타
  if (type === 'article') {
    if (publishedTime) {
      meta.push({ property: 'article:published_time', content: publishedTime });
    }
    if (modifiedTime) {
      meta.push({ property: 'article:modified_time', content: modifiedTime });
    }
    if (tags?.length) {
      tags.forEach((tag) => {
        meta.push({ property: 'article:tag', content: tag });
      });
    }
  }

  return meta;
}
