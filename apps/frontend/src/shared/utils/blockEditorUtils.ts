import type { OutputData } from '../types/editorTypes';

/**
 * Extracts plain text from Editor.js block data for preview purposes
 */
export function extractPlainText(data: OutputData | string): string {
  // Handle legacy string descriptions
  if (typeof data === 'string') {
    return data;
  }

  // Handle null/undefined
  if (!data || !data.blocks) {
    return '';
  }

  const textBlocks: string[] = [];

  data.blocks.forEach((block) => {
    const blockData = block.data as Record<string, unknown>;
    switch (block.type) {
      case 'paragraph':
        if (blockData && typeof blockData.text === 'string') {
          // Remove HTML tags for plain text
          const text = blockData.text.replace(/<[^>]*>/g, '');
          if (text.trim()) {
            textBlocks.push(text.trim());
          }
        }
        break;

      case 'header':
        if (blockData && typeof blockData.text === 'string') {
          textBlocks.push(blockData.text.trim());
        }
        break;

      case 'list':
        if (blockData && Array.isArray(blockData.items)) {
          blockData.items.forEach((item: unknown) => {
            if (typeof item === 'string') {
              const text = item.replace(/<[^>]*>/g, '');
              if (text.trim()) {
                textBlocks.push(`• ${text.trim()}`);
              }
            }
          });
        }
        break;

      case 'quote':
        if (blockData && typeof blockData.text === 'string') {
          const text = blockData.text.replace(/<[^>]*>/g, '');
          if (text.trim()) {
            textBlocks.push(`"${text.trim()}"`);
          }
        }
        break;

      default:
        // For other block types, try to extract any text content
        if (blockData && typeof blockData.text === 'string') {
          const text = blockData.text.replace(/<[^>]*>/g, '');
          if (text.trim()) {
            textBlocks.push(text.trim());
          }
        }
        break;
    }
  });

  return textBlocks.join(' ');
}

/**
 * Truncates text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength).trim() + '...';
}
