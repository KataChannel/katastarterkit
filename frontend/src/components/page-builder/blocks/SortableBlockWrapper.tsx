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
      <div className="relative group">
        {/* Drag Handle - Only visible in edit mode */}
        {isEditing && (
          <div
            {...listeners}
            className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 z-10"
            title="Drag to reorder"
          >
            <svg
              className="w-4 h-4 text-gray-400"
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

        {/* Block Content */}
        <BlockRenderer
          block={block}
          isEditing={isEditing}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddChild={onAddChild}
          onUpdateChild={onUpdateChild}
          onDeleteChild={onDeleteChild}
          depth={depth}
        />
      </div>
    </div>
  );
}
