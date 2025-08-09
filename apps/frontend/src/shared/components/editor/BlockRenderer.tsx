import React from 'react';
import type { OutputData } from '../../types/editorTypes';

interface BlockRendererProps {
  data: OutputData;
  className?: string;
}

interface Block {
  type: string;
  data: Record<string, unknown>;
}

const renderBlock = (block: Block, index: number): JSX.Element => {
  switch (block.type) {
    case 'header': {
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
          {block.data.text as string}
        </HeaderTag>
      );
    }

    case 'paragraph':
      return (
        <p
          key={index}
          className="text-primary-800 mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: block.data.text as string }}
        />
      );

    case 'list': {
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
          {(block.data.items as string[]).map(
            (item: string, itemIndex: number) => (
              <li
                key={itemIndex}
                className="mb-1"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ),
          )}
        </ListTag>
      );
    }

    case 'quote':
      return (
        <blockquote
          key={index}
          className="border-l-4 border-primary-300 pl-4 py-2 mb-4 italic text-primary-700 bg-primary-50 rounded-r-md"
        >
          <p
            className="mb-2"
            dangerouslySetInnerHTML={{ __html: block.data.text as string }}
          />
          {block.data.caption && (
            <cite className="text-sm text-primary-600 not-italic">
              — {block.data.caption as string}
            </cite>
          )}
        </blockquote>
      );

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
  if (!data || !data.blocks || data.blocks.length === 0) {
    return (
      <div className={`text-primary-500 italic ${className}`}>
        No content available
      </div>
    );
  }

  return (
    <div className={`block-renderer ${className}`}>
      {data.blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};
