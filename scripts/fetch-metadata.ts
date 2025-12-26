import * as cheerio from 'cheerio';

export interface LinkMetadata {
  url: string;
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
}

export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NHJBot/1.0)',
      },
    });

    if (!response.ok) {
      return { url, title: url };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Title: og:title > twitter:title > title 태그
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      url;

    // Description: og:description > twitter:description > meta description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      undefined;

    // Image: og:image > twitter:image
    const imagePath =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      undefined;

    // Favicon: 여러 형태 시도
    // google이나 duckduckgo API를 쓰는건?
    const faviconPath =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      '/favicon.ico';

    // 상대 경로를 절대 경로로 변환
    const baseUrl = new URL(url);
    const image = imagePath ? new URL(imagePath, baseUrl).href : undefined;
    const favicon = new URL(faviconPath, baseUrl).href;

    return {
      url,
      title: title.trim(),
      description: description?.trim(),
      image,
      favicon,
    };
  } catch (error) {
    console.warn(`Failed to fetch metadata for ${url}:`, error);
    return { url, title: url };
  }
}
