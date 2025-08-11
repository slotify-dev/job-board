import React from 'react';
import type { OutputData } from '../../types/editorTypes';

interface BlockRendererProps {
  data: OutputData | string | null | undefined;
  className?: string;
}

interface Block {
  type: string;
  data: Record<string, unknown>;
}

const renderBlock = (block: Block, index: number): JSX.Element => {
  // Validate block structure
  if (!block || typeof block.type !== 'string' || !block.data) {
    console.warn('Invalid block structure:', block);
    return (
      <div
        key={index}
        className="mb-4 p-3 border border-yellow-200 bg-yellow-50 rounded-md"
      >
        <p className="text-yellow-800 text-sm">Invalid block structure</p>
      </div>
    );
  }

  switch (block.type) {
    case 'header': {
      const text = block.data.text;
      if (typeof text !== 'string') {
        return (
          <div key={index} className="mb-4 text-red-500">
            Invalid header content
          </div>
        );
      }
      const HeaderTag =
        `h${(block.data.level as number) || 2}` as keyof JSX.IntrinsicElements;
      return (
        <HeaderTag
          key={index}
          className={`font-semibold text-black mb-3 ${
            (block.data.level as number) === 1
              ? 'text-2xl'
              : (block.data.level as number) === 2
                ? 'text-xl'
                : 'text-lg'
          }`}
        >
          {text}
        </HeaderTag>
      );
    }

    case 'paragraph': {
      const text = block.data.text;
      if (typeof text !== 'string') {
        return (
          <div key={index} className="mb-4 text-red-500">
            Invalid paragraph content
          </div>
        );
      }
      return (
        <p
          key={index}
          className="text-primary-800 mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }

    case 'list': {
      const items = block.data.items;
      if (!Array.isArray(items)) {
        return (
          <div key={index} className="mb-4 text-red-500">
            Invalid list content
          </div>
        );
      }
      const ListTag = (block.data.style as string) === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag
          key={index}
          className={`mb-4 text-primary-800 ${
            (block.data.style as string) === 'ordered'
              ? 'list-decimal list-inside'
              : 'list-disc list-inside'
          }`}
        >
          {items.map((item: unknown, itemIndex: number) => {
            let itemText: string = '';

            // Handle different item formats
            if (typeof item === 'string') {
              itemText = item;
            } else if (typeof item === 'object' && item !== null) {
              // Handle EditorJS list item objects
              const itemObj = item as Record<string, unknown>;
              if (typeof itemObj.content === 'string') {
                itemText = itemObj.content;
              } else if (typeof itemObj.text === 'string') {
                itemText = itemObj.text;
              } else {
                // Try to extract any string value from the object
                const stringValues = Object.values(itemObj).filter(
                  (v): v is string => typeof v === 'string',
                );
                if (stringValues.length > 0) {
                  itemText = stringValues[0];
                }
              }
            }

            // If we still don't have text, try to stringify the item safely
            if (!itemText && item !== null && item !== undefined) {
              try {
                itemText = String(item);
                // Avoid displaying [object Object]
                if (itemText === '[object Object]') {
                  itemText = JSON.stringify(item);
                }
              } catch {
                itemText = 'Invalid list item';
              }
            }

            return (
              <li
                key={itemIndex}
                className="mb-1"
                dangerouslySetInnerHTML={{
                  __html: itemText || 'Empty list item',
                }}
              />
            );
          })}
        </ListTag>
      );
    }

    case 'quote': {
      const text = block.data.text;
      if (typeof text !== 'string') {
        return (
          <div key={index} className="mb-4 text-red-500">
            Invalid quote content
          </div>
        );
      }
      return (
        <blockquote
          key={index}
          className="border-l-4 border-primary-300 pl-4 py-2 mb-4 italic text-primary-700 bg-primary-50 rounded-r-md"
        >
          <p className="mb-2" dangerouslySetInnerHTML={{ __html: text }} />
          {block.data.caption && typeof block.data.caption === 'string' && (
            <cite className="text-sm text-primary-600 not-italic">
              — {block.data.caption}
            </cite>
          )}
        </blockquote>
      );
    }

    case 'delimiter':
      return (
        <div key={index} className="text-center my-6">
          <div className="inline-flex items-center justify-center space-x-2 text-primary-400">
            <span className="w-1 h-1 bg-current rounded-full"></span>
            <span className="w-1 h-1 bg-current rounded-full"></span>
            <span className="w-1 h-1 bg-current rounded-full"></span>
          </div>
        </div>
      );

    case 'embed':
      if (block.data.service === 'youtube') {
        return (
          <div key={index} className="mb-4">
            <div className="relative aspect-video">
              <iframe
                src={block.data.embed}
                title={block.data.caption || 'Embedded content'}
                className="absolute inset-0 w-full h-full rounded-md"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {block.data.caption && (
              <p className="text-sm text-primary-600 mt-2 text-center italic">
                {block.data.caption}
              </p>
            )}
          </div>
        );
      }
      return (
        <div
          key={index}
          className="mb-4 p-4 border border-primary-200 rounded-md bg-primary-50"
        >
          <p className="text-primary-600">
            Embedded content: {block.data.service}
          </p>
          {block.data.caption && (
            <p className="text-sm text-primary-500 mt-1">
              {block.data.caption}
            </p>
          )}
        </div>
      );

    case 'linkTool':
      return (
        <div
          key={index}
          className="mb-4 p-4 border border-primary-200 rounded-md hover:bg-primary-50 transition-colors"
        >
          <a
            href={block.data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {block.data.meta.image && (
              <img
                src={block.data.meta.image.url}
                alt={block.data.meta.title}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
            )}
            <h3 className="font-semibold text-black mb-1">
              {block.data.meta.title}
            </h3>
            {block.data.meta.description && (
              <p className="text-primary-600 text-sm mb-2">
                {block.data.meta.description}
              </p>
            )}
            <p className="text-primary-500 text-sm">{block.data.link}</p>
          </a>
        </div>
      );

    default:
      console.warn(`Unknown block type: ${block.type}`);
      return (
        <div
          key={index}
          className="mb-4 p-3 border border-yellow-200 bg-yellow-50 rounded-md"
        >
          <p className="text-yellow-800 text-sm">
            Unknown block type: {block.type}
          </p>
        </div>
      );
  }
};

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  data,
  className = '',
}) => {
  // Handle null/undefined data
  if (!data) {
    return (
      <div className={`text-primary-500 italic ${className}`}>
        No content available
      </div>
    );
  }

  // Handle string data (legacy format)
  if (typeof data === 'string') {
    return (
      <div className={`block-renderer ${className}`}>
        <p className="text-primary-800 mb-4 leading-relaxed">{data}</p>
      </div>
    );
  }

  // Handle malformed data or objects that aren't proper OutputData
  if (!data.blocks || !Array.isArray(data.blocks)) {
    console.warn('Invalid block data structure:', data);
    return (
      <div className={`text-primary-500 italic ${className}`}>
        Invalid content format
      </div>
    );
  }

  // Handle empty blocks array
  if (data.blocks.length === 0) {
    return (
      <div className={`text-primary-500 italic ${className}`}>
        No content available
      </div>
    );
  }

  return (
    <div className={`block-renderer ${className}`}>
      {data.blocks.map((block, index) => {
        try {
          return renderBlock(block, index);
        } catch (error) {
          console.warn(`Error rendering block ${index}:`, error);
          return (
            <div
              key={index}
              className="mb-4 p-3 border border-red-200 bg-red-50 rounded-md"
            >
              <p className="text-red-800 text-sm">
                Error rendering content block
              </p>
            </div>
          );
        }
      })}
    </div>
  );
};
