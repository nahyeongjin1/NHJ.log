import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import type { BlockWithChildren } from '~/lib/notion.server';

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
 * 블록 변환
 */
export function convertBlocks(blocks: BlockWithChildren[]): string {
  const lines: string[] = [];

  for (const { block, children } of blocks) {
    const converted = convertBlock(block, children);
    if (converted !== null) {
      lines.push(converted);
    }
  }

  return lines.join('\n\n');
}

function convertBlock(
  block: BlockWithChildren['block'],
  children: BlockWithChildren[]
): string | null {
  switch (block.type) {
    case 'paragraph':
      return convertRichText(block.paragraph.rich_text);

    case 'heading_1':
      return `# ${convertRichText(block.heading_1.rich_text)}`;

    case 'heading_2':
      return `## ${convertRichText(block.heading_2.rich_text)}`;

    case 'heading_3':
      return `### ${convertRichText(block.heading_3.rich_text)}`;

    case 'bulleted_list_item': {
      const text = convertRichText(block.bulleted_list_item.rich_text);
      const childContent = convertChildrenIndented(children, '  ');
      return childContent ? `- ${text}\n${childContent}` : `- ${text}`;
    }

    case 'numbered_list_item': {
      const text = convertRichText(block.numbered_list_item.rich_text);
      const childContent = convertChildrenIndented(children, '  ');
      return childContent ? `1. ${text}\n${childContent}` : `1. ${text}`;
    }

    case 'quote': {
      const text = convertRichText(block.quote.rich_text);
      const childContent = children.length > 0 ? convertBlocks(children) : '';
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

    // TODO: 추후 구현
    case 'callout':
    case 'toggle':
    case 'code':
    case 'image':
    case 'bookmark':
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
  indent: string
): string {
  if (children.length === 0) return '';

  const childLines: string[] = [];
  for (const { block, children: grandChildren } of children) {
    const converted = convertBlock(block, grandChildren);
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
