import type { MetaDescriptor } from 'react-router';
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
  /** JSON-LD 구조화 데이터. 단일 객체 또는 배열 모두 허용 */
  jsonLd?: object | object[];
}

const DEFAULT_OG_IMAGE = `${siteConfig.url}/og-image.png`;

/**
 * URL 끝에 슬래시 하나를 보장한다.
 * Netlify가 trailing slash 를 추가하고 sitemap.xml 도 슬래시를 포함하므로,
 * canonical / og:url / JSON-LD @id 를 실제 서빙되는 URL 과 일치시켜
 * 불필요한 301 redirect 와 크롤 낭비를 막는다.
 */
export function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

/**
 * SEO 메타 태그 생성
 */
export function generateMeta(config: SEOConfig): MetaDescriptor[] {
  const {
    title,
    description,
    url,
    type = 'website',
    image = DEFAULT_OG_IMAGE,
    publishedTime,
    modifiedTime,
    tags,
    jsonLd,
  } = config;

  const canonicalUrl = withTrailingSlash(url);
  const fullTitle =
    title === siteConfig.name ? title : `${title} - ${siteConfig.name}`;

  const meta: MetaDescriptor[] = [
    // 기본 메타
    { title: fullTitle },
    { name: 'description', content: description },

    // Canonical URL (trailing slash 정규화)
    { tagName: 'link', rel: 'canonical', href: canonicalUrl },

    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
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

  // JSON-LD 구조화 데이터 주입
  if (jsonLd) {
    const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    items.forEach((item) => {
      meta.push({ 'script:ld+json': item });
    });
  }

  return meta;
}

/** 블로그 작성자(Person) 노드. 다른 스키마에 중첩해서 재사용한다. */
function authorNode() {
  return {
    '@type': 'Person',
    name: siteConfig.author.name,
    url: withTrailingSlash(siteConfig.url),
    sameAs: [
      siteConfig.social.github.url,
      siteConfig.social.linkedin.url,
      siteConfig.social.instagram.url,
    ],
  };
}

/**
 * WebSite + 저자 정보 JSON-LD (홈 페이지용)
 */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: withTrailingSlash(siteConfig.url),
    description: siteConfig.description,
    inLanguage: 'ko-KR',
    author: authorNode(),
  };
}

interface ArticleJsonLdInput {
  title: string;
  description: string;
  /** 정규화 전 canonical URL (내부에서 trailing slash 처리) */
  url: string;
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

/**
 * BlogPosting JSON-LD (포스트 상세 페이지용)
 */
export function articleJsonLd(input: ArticleJsonLdInput) {
  const url = withTrailingSlash(input.url);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    headline: input.title,
    description: input.description,
    image: input.image ?? DEFAULT_OG_IMAGE,
    datePublished: input.publishedTime,
    dateModified: input.modifiedTime ?? input.publishedTime,
    inLanguage: 'ko-KR',
    keywords: input.tags?.length ? input.tags.join(', ') : undefined,
    author: authorNode(),
    publisher: authorNode(),
  };
}

/**
 * BreadcrumbList JSON-LD
 */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: withTrailingSlash(item.url),
    })),
  };
}
