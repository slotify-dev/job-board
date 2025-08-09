import React, { useEffect, useRef, memo } from 'react';
import EditorJS from '@editorjs/editorjs';
import type { OutputData } from '../../types/editorTypes';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import InlineCode from '@editorjs/inline-code';
import Link from '@editorjs/link';
import Embed from '@editorjs/embed';
import Delimiter from '@editorjs/delimiter';
import Quote from '@editorjs/quote';

interface BlockEditorProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
}

export const BlockEditor = memo(
  ({
    data,
    onChange,
    placeholder = 'Write your job description...',
    readOnly = false,
    minHeight = 200,
  }: BlockEditorProps) => {
    const ejInstance = useRef<EditorJS>();
    const editorRef = useRef<globalThis.HTMLDivElement | null>(null);

    useEffect(() => {
      if (editorRef.current && !ejInstance.current) {
        ejInstance.current = new EditorJS({
          holder: editorRef.current,
          data: data || {
            blocks: [
              {
                type: 'paragraph',
                data: { text: '' },
              },
            ],
          },
          readOnly,
          placeholder,
          tools: {
            header: {
              class: Header,
              config: {
                levels: [1, 2, 3],
                defaultLevel: 2,
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered',
              },
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            inlineCode: {
              class: InlineCode,
            },
            link: {
              class: Link,
              config: {
                endpoint: '/api/fetch-url', // This would need to be implemented
              },
            },
            embed: {
              class: Embed,
              config: {
                services: {
                  youtube: true,
                  twitter: true,
                  instagram: true,
                },
              },
            },
            delimiter: Delimiter,
            quote: {
              class: Quote,
              inlineToolbar: true,
              shortcut: 'CMD+SHIFT+O',
              config: {
                quotePlaceholder: 'Enter a quote',
                captionPlaceholder: 'Quote author',
              },
            },
          },
          onChange: async () => {
            if (onChange && ejInstance.current) {
              try {
                const outputData = await ejInstance.current.save();
                // Convert EditorJS OutputData to our OutputData type
                onChange({
                  time: outputData.time,
                  blocks: outputData.blocks,
                  version: outputData.version,
                });
              } catch (error) {
                console.error('Error saving editor data:', error);
              }
            }
          },
        });
      }

      return () => {
        if (ejInstance.current && ejInstance.current.destroy) {
          ejInstance.current.destroy();
          ejInstance.current = undefined;
        }
      };
    }, [data, onChange, placeholder, readOnly]);

    // Update editor data when data prop changes
    useEffect(() => {
      if (ejInstance.current && data && ejInstance.current.render) {
        ejInstance.current.render(data);
      }
    }, [data]);

    return (
      <div className="block-editor-container">
        <div
          ref={editorRef}
          className="block-editor"
          style={{
            minHeight: `${minHeight}px`,
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            padding: '1rem',
            backgroundColor: '#ffffff',
          }}
        />
        <style>{`
          .block-editor-container :global(.codex-editor) {
            font-family: inherit;
          }
          .block-editor-container :global(.codex-editor__redactor) {
            padding: 0 !important;
          }
          .block-editor-container :global(.ce-block__content) {
            max-width: none !important;
            margin: 0 !important;
          }
          .block-editor-container :global(.ce-toolbar__content) {
            max-width: none !important;
          }
          .block-editor-container :global(.ce-paragraph) {
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
          }
          .block-editor-container :global(.ce-header) {
            color: #111827;
            font-weight: 600;
          }
          .block-editor-container :global(.ce-list__item) {
            color: #374151;
            font-size: 14px;
            line-height: 1.6;
          }
          .block-editor-container :global(.ce-quote__text) {
            color: #6b7280;
            font-style: italic;
          }
          .block-editor-container :global(.ce-delimiter) {
            margin: 1.5rem 0;
          }
        `}</style>
      </div>
    );
  },
);

BlockEditor.displayName = 'BlockEditor';
