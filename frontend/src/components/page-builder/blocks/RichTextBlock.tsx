'use client';

/**
 * Enhanced RichTextBlock with BlockNote-style Editor
 * Mobile-first, PWA-ready, Dynamic GraphQL integrated
 */

import React, { memo } from 'react';
import dynamic from 'next/dynamic';
import { Type, Settings } from 'lucide-react';

// Dynamic import để tối ưu performance
const BlockNoteEditor = dynamic(
  () => import('../editors/BlockNoteEditor'),
  { 
    ssr: false,
    loading: () => (
      <div className="animate-pulse h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <Type className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    ),
  }
);

export interface RichTextBlockData {
  content: string;
  minHeight?: string;
  placeholder?: string;
  // Styling options
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  borderRadius?: string;
  maxWidth?: string;
}

interface RichTextBlockProps {
  data: RichTextBlockData;
  isEditMode: boolean;
  onChange?: (data: RichTextBlockData) => void;
  onSettingsClick?: () => void;
}

const RichTextBlock = memo(({
  data,
  isEditMode,
  onChange,
  onSettingsClick,
}: RichTextBlockProps) => {
  const handleContentChange = (content: string) => {
    onChange?.({ ...data, content });
  };

  // Render view mode
  if (!isEditMode) {
    return (
      <div 
        className="rich-text-block-view"
        style={{
          backgroundColor: data.backgroundColor,
          color: data.textColor,
          padding: data.padding || '1rem',
          borderRadius: data.borderRadius || '0.5rem',
          maxWidth: data.maxWidth || '100%',
        }}
      >
        <div 
          className="prose prose-sm md:prose-base max-w-none"
          dangerouslySetInnerHTML={{ __html: data.content || '<p>No content</p>' }}
        />
      </div>
    );
  }

  // Render edit mode
  return (
    <div className="rich-text-block-edit relative group">
      {/* Settings button - mobile friendly */}
      {onSettingsClick && (
        <button
          onClick={onSettingsClick}
          className="
            absolute -top-2 -right-2 z-20
            min-w-[44px] min-h-[44px]
            flex items-center justify-center
            bg-blue-600 text-white
            rounded-full shadow-lg
            opacity-0 group-hover:opacity-100
            transition-all duration-200
            hover:scale-110 active:scale-95
            touch-manipulation
          "
          aria-label="Rich text settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      )}

      {/* Editor */}
      <BlockNoteEditor
        content={data.content || ''}
        onChange={handleContentChange}
        placeholder={data.placeholder || 'Start typing...'}
        editable={true}
        minHeight={data.minHeight || '200px'}
        className="shadow-sm"
      />
    </div>
  );
});

RichTextBlock.displayName = 'RichTextBlock';

// Default data for new blocks
export const defaultRichTextData: RichTextBlockData = {
  content: '',
  minHeight: '200px',
  placeholder: 'Start typing your content here...',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  padding: '1rem',
  borderRadius: '0.5rem',
  maxWidth: '100%',
};

export default RichTextBlock;
