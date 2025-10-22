import React, { useContext } from 'react';
import { PageBlock, BlockType } from '@/types/page-builder';
import { PageBuilderContext } from '../PageBuilderProvider';
import { BlockLoader } from './BlockLoader';
import BlockErrorBoundary from '../BlockErrorBoundary';

export interface BlockRendererProps {
  block: PageBlock;
  isEditing?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
  onAddChild?: (parentId: string) => void;
  onUpdateChild?: (blockId: string, content: any, style?: any) => void;
  onDeleteChild?: (blockId: string) => void;
  onSelect?: (blockId: string | null) => void;
  depth?: number;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isEditing = true,
  onUpdate,
  onDelete,
  onAddChild,
  onUpdateChild,
  onDeleteChild,
  onSelect,
  depth = 0,
}) => {
  // Get selected block ID from context for visual highlighting (optional - for editor only)
  const context = useContext(PageBuilderContext);
  const selectedBlockId = context?.selectedBlockId;
  const isSelected = selectedBlockId === block.id;

  const commonProps = {
    block,
    isEditable: isEditing,
    onUpdate: (content: any, style?: any) => onUpdate(content, style),
    onDelete,
  };

  // Handle block selection
  const handleBlockClick = (e: React.MouseEvent) => {
    if (isEditing && onSelect) {
      e.stopPropagation(); // Prevent parent blocks from being selected
      onSelect(block.id);
    }
  };

  const isContainerBlock = [
    BlockType.CONTAINER,
    BlockType.SECTION,
    BlockType.GRID,
    BlockType.FLEX_ROW,
    BlockType.FLEX_COLUMN,
  ].includes(block.type);

  const renderChildren = () => {
    if (!block.children || block.children.length === 0) return null;

    // Create a copy of children array before sorting (GraphQL returns read-only array)
    // Just render children directly - parent container will handle layout
    return (
      <>
        {[...block.children]
          .sort((a, b) => a.order - b.order)
          .map((childBlock) => {
            return (
              <BlockRenderer
                key={childBlock.id}
                block={childBlock}
                isEditing={isEditing}
                onUpdate={(content, style) => onUpdateChild?.(childBlock.id, content, style)}
                onDelete={() => onDeleteChild?.(childBlock.id)}
                onAddChild={onAddChild}
                onUpdateChild={onUpdateChild}
                onDeleteChild={onDeleteChild}
                onSelect={onSelect}
                depth={depth + 1}
              />
            );
          })}
      </>
    );
  };

  const containerProps = {
    ...commonProps,
    onAddChild: isContainerBlock ? () => onAddChild?.(block.id) : undefined,
    children: isContainerBlock ? renderChildren() : undefined,
  };

  // Render block based on type using lazy loading
  const renderBlockContent = () => {
    // Use BlockLoader for all blocks (handles lazy loading and error boundaries)
    const isContainerType = [
      BlockType.CONTAINER,
      BlockType.SECTION,
      BlockType.GRID,
      BlockType.FLEX_ROW,
      BlockType.FLEX_COLUMN,
    ].includes(block.type);

    const props = isContainerType ? containerProps : commonProps;

    return (
      <BlockLoader
        blockType={block.type}
        blockId={block.id}
        props={props}
        skeletonHeight="200px"
      />
    );
  };

  let blockContent = renderBlockContent();

  // Wrap in clickable div for selection (only in edit mode)
  if (isEditing && onSelect) {
    return (
      <div 
        onClick={handleBlockClick}
        className={`
          w-full cursor-pointer transition-all 
          ${isSelected 
            ? 'ring-2 ring-blue-500 ring-opacity-100 shadow-lg' 
            : 'hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50'
          }
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(block.id);
          }
        }}
      >
        {blockContent}
      </div>
    );
  }

  return blockContent;
};
