'use client';

import React from 'react';
import { usePageBuilderContext } from '../PageBuilderProvider';
import { PageBuilderCanvas } from '../PageBuilderCanvas';

interface EditorCanvasProps {
  editorMode: 'visual' | 'code';
  device: 'desktop' | 'tablet' | 'mobile';
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
}

const deviceWidths = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export function EditorCanvas({
  editorMode,
  device,
  selectedBlockId,
  onSelectBlock,
}: EditorCanvasProps) {
  const { blocks } = usePageBuilderContext();

  if (editorMode === 'code') {
    return (
      <div className="h-full bg-gray-900 text-white p-4 overflow-auto">
        <pre className="text-sm font-mono">
          {JSON.stringify(blocks, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-100 overflow-auto">
      <div className="min-h-full flex items-start justify-center p-8">
        {/* Device Frame */}
        <div
          className="bg-white shadow-xl transition-all duration-300 min-h-[600px] rounded-md"
          style={{
            width: deviceWidths[device],
            maxWidth: '100%',
          }}
        >
          {/* Canvas Content */}
          <PageBuilderCanvas />
        </div>
      </div>
    </div>
  );
}
