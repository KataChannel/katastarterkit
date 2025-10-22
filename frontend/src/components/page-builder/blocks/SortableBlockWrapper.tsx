import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageBlock } from '@/types/page-builder';
import { BlockRenderer } from './BlockRenderer';

interface SortableBlockWrapperProps {
  block: PageBlock;
  isEditing: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
  onAddChild?: (parentId: string) => void;
  onUpdateChild?: (blockId: string, content: any, style?: any) => void;
  onDeleteChild?: (blockId: string) => void;
  onSelect?: (blockId: string | null) => void;
  depth?: number;
}

export function SortableBlockWrapper({
  block,
  isEditing,
  onUpdate,
  onDelete,
  onAddChild,
  onUpdateChild,
  onDeleteChild,
  onSelect,
  depth = 0,
}: SortableBlockWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: {
      type: 'existing-block',
      block,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className={`relative group rounded-lg transition-all duration-200 ${
        isDragging 
          ? 'ring-4 ring-blue-400 shadow-2xl scale-102' 
          : 'hover:ring-2 hover:ring-gray-300'
      }`}>
        {/* Drag Handle - Only visible in edit mode */}
        {isEditing && (
          <div
            {...listeners}
            className={`absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center transition-all cursor-grab active:cursor-grabbing rounded shadow-sm z-10 ${
              isDragging
                ? 'opacity-100 bg-blue-500 border border-blue-600'
                : 'opacity-0 group-hover:opacity-100 bg-white border border-gray-300 hover:bg-blue-50'
            }`}
            title="Drag to reorder"
          >
            <svg
              className={`w-4 h-4 transition-colors ${
                isDragging ? 'text-white' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9h8M8 15h8"
              />
            </svg>
          </div>
        )}

        {/* Drag Indicator */}
        {isDragging && (
          <div className="absolute -top-3 -right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce z-20">
            ⬆️ Reordering
          </div>
        )}

        {/* Block Content */}
        <BlockRenderer
          block={block}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddChild={onAddChild}
          onUpdateChild={onUpdateChild}
          onDeleteChild={onDeleteChild}
          onSelect={onSelect}
          depth={depth}
        />
      </div>
    </div>
  );
}
