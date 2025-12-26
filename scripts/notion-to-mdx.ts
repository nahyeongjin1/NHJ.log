import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import type { BlockWithChildren } from '~/lib/notion.server';
import { fetchLinkMetadata, type LinkMetadata } from './fetch-metadata';

// 메타데이터 맵 (URL → 메타데이터)
type MetadataMap = Map<string, LinkMetadata>;

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

  // Bold + Italic 조합
  if (annotations.bold && annotations.italic) {
    text = `***${text}***`;
  } else if (annotations.bold) {
    text = `**${text}**`;
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

/**
 * 블록 변환 (메타데이터 fetch 포함, async)
 */
export async function convertBlocksAsync(
  blocks: BlockWithChildren[]
): Promise<string> {
  // 1. URL 수집
  const urls = collectUrls(blocks);

  // 2. 메타데이터 병렬 fetch
  const metadataMap =
    urls.length > 0 ? await fetchAllMetadata(urls) : new Map();

  // 3. 변환
  return convertBlocksWithMetadata(blocks, metadataMap);
}

/**
 * 블록 변환 (동기, 메타데이터 맵 필요)
 */
function convertBlocksWithMetadata(
  blocks: BlockWithChildren[],
  metadataMap: MetadataMap
): string {
  const lines: string[] = [];

  for (const { block, children } of blocks) {
    const converted = convertBlock(block, children, metadataMap);
    if (converted !== null) {
      lines.push(converted);
    }
  }

  return lines.join('\n\n');
}

function convertBlock(
  block: BlockWithChildren['block'],
  children: BlockWithChildren[],
  metadataMap: MetadataMap = new Map()
): string | null {
  switch (block.type) {
    case 'paragraph':
      return convertRichText(block.paragraph.rich_text);

    case 'heading_1': {
      const text = convertRichText(block.heading_1.rich_text);
      if (block.heading_1.is_toggleable && children.length > 0) {
        const childContent = convertBlocksWithMetadata(children, metadataMap);
        return `<Toggle>\n<summary>\n# ${text}\n</summary>\n\n${childContent}\n</Toggle>`;
      }
      return `# ${text}`;
    }

    case 'heading_2': {
      const text = convertRichText(block.heading_2.rich_text);
      if (block.heading_2.is_toggleable && children.length > 0) {
        const childContent = convertBlocksWithMetadata(children, metadataMap);
        return `<Toggle>\n<summary>\n## ${text}\n</summary>\n\n${childContent}\n</Toggle>`;
      }
      return `## ${text}`;
    }

    case 'heading_3': {
      const text = convertRichText(block.heading_3.rich_text);
      if (block.heading_3.is_toggleable && children.length > 0) {
        const childContent = convertBlocksWithMetadata(children, metadataMap);
        return `<Toggle>\n<summary>\n### ${text}\n</summary>\n\n${childContent}\n</Toggle>`;
      }
      return `### ${text}`;
    }

    case 'bulleted_list_item': {
      const text = convertRichText(block.bulleted_list_item.rich_text);
      const childContent = convertChildrenIndented(children, '  ', metadataMap);
      return childContent ? `- ${text}\n${childContent}` : `- ${text}`;
    }

    case 'numbered_list_item': {
      const text = convertRichText(block.numbered_list_item.rich_text);
      const childContent = convertChildrenIndented(children, '  ', metadataMap);
      return childContent ? `1. ${text}\n${childContent}` : `1. ${text}`;
    }

    case 'quote': {
      const text = convertRichText(block.quote.rich_text);
      const childContent =
        children.length > 0
          ? convertBlocksWithMetadata(children, metadataMap)
          : '';
      const quoteLines = text.split('\n').map((line) => `> ${line}`);
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
          ? convertBlocksWithMetadata(children, metadataMap)
          : '';
      const parts = [text, childContent].filter(Boolean);
      const content = parts.join('\n\n');
      return `<Callout icon="${icon}">\n${content}\n</Callout>`;
    }

    case 'toggle': {
      const title = convertRichText(block.toggle.rich_text);
      const childContent =
        children.length > 0
          ? convertBlocksWithMetadata(children, metadataMap)
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

    // TODO: 추후 구현
    case 'image':
    case 'table':
    case 'table_row':
      return `{/* TODO: ${block.type} */}`;

    default:
      // 지원하지 않는 블록은 주석으로
      return `{/* Unsupported: ${block.type} */}`;
  }
}

function convertChildrenIndented(
  children: BlockWithChildren[],
  indent: string,
  metadataMap: MetadataMap = new Map()
): string {
  if (children.length === 0) return '';

  const childLines: string[] = [];
  for (const { block, children: grandChildren } of children) {
    const converted = convertBlock(block, grandChildren, metadataMap);
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
