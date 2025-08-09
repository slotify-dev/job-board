import React from 'react';
import { BlockEditor } from '../../../shared/components/editor';
import type { OutputData } from '../../../shared/types/editorTypes';

interface BlockEditorWrapperProps {
  readOnly?: boolean;
  value: OutputData | null;
  onChange: (data: OutputData) => void;
}

export const BlockEditorWrapper = React.memo(function BlockEditorWrapper({
  value,
  onChange,
  readOnly,
}: BlockEditorWrapperProps) {
  return (
    <BlockEditor
      data={value}
      minHeight={300}
      readOnly={readOnly}
      onChange={onChange}
      placeholder="Describe the role, responsibilities, requirements, and what the candidate will be doing..."
    />
  );
});
