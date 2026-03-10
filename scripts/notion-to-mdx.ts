import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import type { BlockWithChildren } from '~/lib/notion.server';
import { uploadFromUrl, type ContentType } from '~/lib/r2.server';
import { fetchLinkMetadata, type LinkMetadata } from './fetch-metadata';

// 메타데이터 맵 (URL → 메타데이터)
type MetadataMap = Map<string, LinkMetadata>;

// 이미지 맵 (blockId → { r2Url, caption })
type ImageMap = Map<string, { r2Url: string; caption: string }>;

// 이미지 정보
interface ImageInfo {
  blockId: string;
  url: string;
  caption: string;
}

/**
 * 블록에서 메타데이터가 필요한 URL들 수집
 */
function collectUrls(blocks: BlockWithChildren[]): string[] {
  const urls: string[] = [];

  for (const { block, children } of blocks) {
    if (block.type === 'bookmark') {
      urls.push(block.bookmark.url);
    } else if (block.type === 'link_preview') {
      urls.push(block.link_preview.url);
    }

    // 재귀적으로 children도 수집
    if (children.length > 0) {
      urls.push(...collectUrls(children));
    }
  }

  return urls;
}

/**
 * URL들의 메타데이터를 병렬로 fetch
 */
async function fetchAllMetadata(urls: string[]): Promise<MetadataMap> {
  const uniqueUrls = [...new Set(urls)];
  const metadataList = await Promise.all(
    uniqueUrls.map((url) => fetchLinkMetadata(url))
  );

  const map: MetadataMap = new Map();
  for (const metadata of metadataList) {
    map.set(metadata.url, metadata);
  }
  return map;
}

/**
 * 블록에서 이미지 정보 수집
 */
function collectImages(blocks: BlockWithChildren[]): ImageInfo[] {
  const images: ImageInfo[] = [];

  for (const { block, children } of blocks) {
    if (block.type === 'image') {
      const url =
        block.image.type === 'file'
          ? block.image.file.url
          : block.image.external.url;
      const caption = block.image.caption
        .map((t) => t.plain_text)
        .join('')
        .trim();

      images.push({
        blockId: block.id,
        url,
        caption,
      });
    }

    // 재귀적으로 children도 수집
    if (children.length > 0) {
      images.push(...collectImages(children));
    }
  }

  return images;
}

/**
 * 이미지들을 R2에 업로드
 */
async function uploadAllImages(
  images: ImageInfo[],
  pageId: string,
  contentType: ContentType
): Promise<ImageMap> {
  const results = await Promise.all(
    images.map(async (img) => {
      const result = await uploadFromUrl(img.url, {
        contentType,
        pageId,
        blockId: img.blockId,
        skipIfExists: true,
      });
      return { blockId: img.blockId, r2Url: result.url, caption: img.caption };
    })
  );

  const map: ImageMap = new Map();
  for (const { blockId, r2Url, caption } of results) {
    map.set(blockId, { r2Url, caption });
  }
  return map;
}

/**
 * 문자열 이스케이프 (따옴표 등)
 */
function escapeString(str: string): string {
  return str.replace(/"/g, '\\"').replace(/\n/g, ' ');
}

/**
 * Rich Text 변환
 * Notion rich text → MDX 문자열
 */
function convertRichText(richTexts: RichTextItemResponse[]): string {
  return richTexts.map(convertRichTextItem).join('');
}

function convertRichTextItem(item: RichTextItemResponse): string {
  if (item.type !== 'text') {
    // mention, equation 등은 일단 plain_text로
    return item.plain_text;
  }

  let text = item.plain_text;
  const { annotations, text: textContent } = item;

  // 빈 텍스트는 그대로 반환
  if (!text) return '';

  // 링크 처리
  if (textContent.link) {
    text = `[${text}](${textContent.link.url})`;
  }

  // 코드 (다른 포맷팅보다 먼저)
  if (annotations.code) {
    text = `\`${text}\``;
  }

  // Bold + Italic 조합 (HTML 태그 사용으로 구두점 인접 시에도 정상 렌더링)
  if (annotations.bold && annotations.italic) {
    text = `<strong><em>${text}</em></strong>`;
  } else if (annotations.bold) {
    text = `<strong>${text}</strong>`;
  } else if (annotations.italic) {
    text = `*${text}*`;
  }

  // Strikethrough
  if (annotations.strikethrough) {
    text = `~~${text}~~`;
  }

  // Underline, Background color → Text 컴포넌트 사용
  const needsTextComponent =
    annotations.underline || annotations.color.includes('_background');

  if (needsTextComponent) {
    const props: string[] = [];
    if (annotations.underline) props.push('underline');
    if (annotations.color.includes('_background')) props.push('bg');

    text = `<Text ${props.join(' ')}>${text}</Text>`;
  }

  return text;
}

export interface ConvertOptions {
  pageId: string;
  contentType: ContentType;
}

/**
 * 블록 변환 (메타데이터 fetch + 이미지 업로드 포함, async)
 */
export async function convertBlocksAsync(
  blocks: BlockWithChildren[],
  options: ConvertOptions
): Promise<string> {
  // 1. URL 수집 (bookmark, link_preview)
  const urls = collectUrls(blocks);

  // 2. 이미지 수집
  const images = collectImages(blocks);

  // 3. 병렬 처리: 메타데이터 fetch + 이미지 업로드
  const [metadataMap, imageMap] = await Promise.all([
    urls.length > 0
      ? fetchAllMetadata(urls)
      : Promise.resolve(new Map<string, LinkMetadata>()),
    images.length > 0
      ? uploadAllImages(images, options.pageId, options.contentType)
      : Promise.resolve(new Map<string, { r2Url: string; caption: string }>()),
  ]);

  // 4. 변환
  return convertBlocksWithMaps(blocks, metadataMap, imageMap);
}

/**
 * 블록 변환 (동기, 메타데이터 + 이미지 맵 필요)
 */
function convertBlocksWithMaps(
  blocks: BlockWithChildren[],
  metadataMap: MetadataMap,
  imageMap: ImageMap
): string {
  const lines: string[] = [];

  for (const { block, children } of blocks) {
    const converted = convertBlock(block, children, metadataMap, imageMap);
    if (converted !== null) {
      lines.push(converted);
    }
  }

  // 빈 문자열 제거 후 조인, 연속 빈 줄 정리
  return lines
    .filter((line) => line.trim() !== '')
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n');
}

function convertBlock(
  block: BlockWithChildren['block'],
  children: BlockWithChildren[],
  metadataMap: MetadataMap,
  imageMap: ImageMap
): string | null {
  switch (block.type) {
    case 'paragraph':
      return convertRichText(block.paragraph.rich_text).replace(/\n/g, '  \n');

    case 'heading_1': {
      const text = convertRichText(block.heading_1.rich_text);
      if (block.heading_1.is_toggleable && children.length > 0) {
        const childContent = convertBlocksWithMaps(
          children,
          metadataMap,
          imageMap
        );
        return `<Toggle>\n<summary>\n# ${text}\n</summary>\n\n${childContent}\n</Toggle>`;
      }
      return `# ${text}`;
    }

    case 'heading_2': {
      const text = convertRichText(block.heading_2.rich_text);
      if (block.heading_2.is_toggleable && children.length > 0) {
        const childContent = convertBlocksWithMaps(
          children,
          metadataMap,
          imageMap
        );
        return `<Toggle>\n<summary>\n## ${text}\n</summary>\n\n${childContent}\n</Toggle>`;
      }
      return `## ${text}`;
    }

    case 'heading_3': {
      const text = convertRichText(block.heading_3.rich_text);
      if (block.heading_3.is_toggleable && children.length > 0) {
        const childContent = convertBlocksWithMaps(
          children,
          metadataMap,
          imageMap
        );
        return `<Toggle>\n<summary>\n### ${text}\n</summary>\n\n${childContent}\n</Toggle>`;
      }
      return `### ${text}`;
    }

    case 'bulleted_list_item': {
      const text = convertRichText(block.bulleted_list_item.rich_text);
      const childContent = convertChildrenIndented(
        children,
        '  ',
        metadataMap,
        imageMap
      );
      return childContent ? `- ${text}\n${childContent}` : `- ${text}`;
    }

    case 'numbered_list_item': {
      const text = convertRichText(block.numbered_list_item.rich_text);
      const childContent = convertChildrenIndented(
        children,
        '  ',
        metadataMap,
        imageMap
      );
      return childContent ? `1. ${text}\n${childContent}` : `1. ${text}`;
    }

    case 'quote': {
      const text = convertRichText(block.quote.rich_text);
      const childContent =
        children.length > 0
          ? convertBlocksWithMaps(children, metadataMap, imageMap)
          : '';
      const quoteLines = text.split('\n').map((line) => `> ${line}  `);
      if (childContent) {
        const childQuoteLines = childContent
          .split('\n')
          .map((line) => `> ${line}`);
        quoteLines.push(...childQuoteLines);
      }
      return quoteLines.join('\n');
    }

    case 'divider':
      return '---';

    case 'callout': {
      const icon =
        block.callout.icon?.type === 'emoji' ? block.callout.icon.emoji : '💡';
      const text = convertRichText(block.callout.rich_text);
      const childContent =
        children.length > 0
          ? convertBlocksWithMaps(children, metadataMap, imageMap)
          : '';
      const parts = [text, childContent].filter(Boolean);
      const content = parts.join('\n\n');
      return `<Callout icon="${icon}">\n${content}\n</Callout>`;
    }

    case 'toggle': {
      const title = convertRichText(block.toggle.rich_text);
      const childContent =
        children.length > 0
          ? convertBlocksWithMaps(children, metadataMap, imageMap)
          : '';
      return `<Toggle>\n<summary>\n${title}\n</summary>\n\n${childContent}\n</Toggle>`;
    }

    case 'code': {
      const rawLang = block.code.language || 'text';
      const language = rawLang === 'plain text' ? 'text' : rawLang;
      const code = block.code.rich_text.map((t) => t.plain_text).join('');
      const caption = block.code.caption
        .map((t) => t.plain_text)
        .join('')
        .trim();
      const captionComment = caption ? `{/* ${caption} */}\n` : '';

      // Mermaid는 별도 컴포넌트로 처리
      if (language === 'mermaid') {
        const escapedCode = code.replace(/`/g, '\\`').replace(/\$/g, '\\$');
        return `${captionComment}<Mermaid chart={\`${escapedCode}\`} />`;
      }

      return `${captionComment}\`\`\`${language}\n${code}\n\`\`\``;
    }

    case 'bookmark':
    case 'link_preview': {
      const url =
        block.type === 'bookmark' ? block.bookmark.url : block.link_preview.url;
      const metadata = metadataMap.get(url);

      if (metadata) {
        const props = [
          `url="${metadata.url}"`,
          `title="${escapeString(metadata.title)}"`,
          metadata.description
            ? `description="${escapeString(metadata.description)}"`
            : null,
          metadata.image ? `image="${metadata.image}"` : null,
          metadata.favicon ? `favicon="${metadata.favicon}"` : null,
        ]
          .filter(Boolean)
          .join(' ');
        return `<LinkCard ${props} />`;
      }
      return `<LinkCard url="${url}" title="${url}" />`;
    }

    case 'embed': {
      const url = block.embed.url;
      return `<Embed url="${url}" />`;
    }

    case 'image': {
      const imageData = imageMap.get(block.id);
      if (imageData) {
        const altAttr = imageData.caption
          ? ` alt="${escapeString(imageData.caption)}"`
          : '';
        return `<Image src="${imageData.r2Url}"${altAttr} />`;
      }
      return `{/* Image not found: ${block.id} */}`;
    }

    case 'table': {
      if (children.length === 0) {
        return '{/* Empty table */}';
      }

      const rows: string[][] = [];
      for (const { block: rowBlock } of children) {
        if (rowBlock.type === 'table_row') {
          const cells = rowBlock.table_row.cells.map((cell) =>
            convertRichText(cell).replace(/\|/g, '\\|').replace(/\n/g, ' ')
          );
          rows.push(cells);
        }
      }

      if (rows.length === 0) {
        return '{/* Empty table */}';
      }

      // const hasColumnHeader = block.table.has_column_header;
      const lines: string[] = [];

      // 첫 번째 행 (헤더 또는 일반 행)
      const headerRow = rows[0];
      lines.push(`| ${headerRow.join(' | ')} |`);

      // 구분선
      const separator = headerRow.map(() => '---').join(' | ');
      lines.push(`| ${separator} |`);

      // 나머지 행들
      for (const row of rows.slice(1)) {
        lines.push(`| ${row.join(' | ')} |`);
      }

      return lines.join('\n');
    }

    case 'table_row':
      // table_row는 table 케이스에서 처리됨
      return null;

    default:
      // 지원하지 않는 블록은 주석으로
      return `{/* Unsupported: ${block.type} */}`;
  }
}

function convertChildrenIndented(
  children: BlockWithChildren[],
  indent: string,
  metadataMap: MetadataMap,
  imageMap: ImageMap
): string {
  if (children.length === 0) return '';

  const childLines: string[] = [];
  for (const { block, children: grandChildren } of children) {
    const converted = convertBlock(block, grandChildren, metadataMap, imageMap);
    if (converted !== null) {
      // 각 줄에 indent 추가
      const indented = converted
        .split('\n')
        .map((line) => indent + line)
        .join('\n');
      childLines.push(indented);
    }
  }

  return childLines.join('\n');
}
