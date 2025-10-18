import React from 'react';
import { PageBlock, BlockType } from '@/types/page-builder';
import { usePageBuilderContext } from '../PageBuilderProvider';
import { TextBlock } from './TextBlock';
import { ImageBlock } from './ImageBlock';
import { HeroBlock } from './HeroBlock';
import { ButtonBlock } from './ButtonBlock';
import { DividerBlock } from './DividerBlock';
import { SpacerBlock } from './SpacerBlock';
import { TeamBlock } from './TeamBlock';
import { StatsBlock } from './StatsBlock';
import { ContactInfoBlock } from './ContactInfoBlock';
import { ContainerBlock } from './ContainerBlock';
import { SectionBlock } from './SectionBlock';
import { GridBlock } from './GridBlock';
import { FlexBlock } from './FlexBlock';
import { DynamicBlock } from './DynamicBlock';
import CarouselBlock from './CarouselBlock';

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
  // Get selected block ID from context for visual highlighting
  const { selectedBlockId } = usePageBuilderContext();
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
    return [...block.children]
      .sort((a, b) => a.order - b.order)
      .map((childBlock) => (
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
      ));
  };

  const containerProps = {
    ...commonProps,
    onAddChild: isContainerBlock ? () => onAddChild?.(block.id) : undefined,
    children: isContainerBlock ? renderChildren() : undefined,
  };

  // Render block based on type
  let blockContent;
  switch (block.type) {
    case BlockType.TEXT:
      blockContent = <TextBlock {...commonProps} />;
      break;
    case BlockType.IMAGE:
      blockContent = <ImageBlock {...commonProps} />;
      break;
    case BlockType.CAROUSEL:
      blockContent = <CarouselBlock {...commonProps} />;
      break;
    case BlockType.HERO:
      blockContent = <HeroBlock {...commonProps} />;
      break;
    case BlockType.BUTTON:
      blockContent = <ButtonBlock {...commonProps} />;
      break;
    case BlockType.DIVIDER:
      blockContent = <DividerBlock {...commonProps} />;
      break;
    case BlockType.SPACER:
      blockContent = <SpacerBlock {...commonProps} />;
      break;
    case BlockType.TEAM:
      blockContent = <TeamBlock {...commonProps} />;
      break;
    case BlockType.STATS:
      blockContent = <StatsBlock {...commonProps} />;
      break;
    case BlockType.CONTACT_INFO:
      blockContent = <ContactInfoBlock {...commonProps} />;
      break;
    case BlockType.CONTAINER:
      blockContent = <ContainerBlock {...containerProps} />;
      break;
    case BlockType.SECTION:
      blockContent = <SectionBlock {...containerProps} />;
      break;
    case BlockType.GRID:
      blockContent = <GridBlock {...containerProps} />;
      break;
    case BlockType.FLEX_ROW:
      blockContent = <FlexBlock {...containerProps} />;
      break;
    case BlockType.FLEX_COLUMN:
      blockContent = <FlexBlock {...containerProps} />;
      break;
    case BlockType.DYNAMIC:
      blockContent = <DynamicBlock {...commonProps} />;
      break;
    default:
      blockContent = (
        <div className="p-4 border border-red-300 bg-red-50 text-red-600 rounded">
          Unknown block type: {block.type}
        </div>
      );
  }

  // Wrap in clickable div for selection (only in edit mode)
  if (isEditing && onSelect) {
    return (
      <div 
        onClick={handleBlockClick}
        className={`
          cursor-pointer transition-all 
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
