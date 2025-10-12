import React from 'react';
import { PageBlock, BlockType } from '@/types/page-builder';
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

export interface BlockRendererProps {
  block: PageBlock;
  isEditing?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
  onAddChild?: (parentId: string) => void;
  onUpdateChild?: (blockId: string, content: any, style?: any) => void;
  onDeleteChild?: (blockId: string) => void;
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
  depth = 0,
}) => {
  const commonProps = {
    block,
    isEditable: isEditing,
    onUpdate: (content: any, style?: any) => onUpdate(content, style),
    onDelete,
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
          depth={depth + 1}
        />
      ));
  };

  const containerProps = {
    ...commonProps,
    onAddChild: isContainerBlock ? () => onAddChild?.(block.id) : undefined,
    children: isContainerBlock ? renderChildren() : undefined,
  };

  switch (block.type) {
    case BlockType.TEXT:
      return <TextBlock {...commonProps} />;
    case BlockType.IMAGE:
      return <ImageBlock {...commonProps} />;
    case BlockType.HERO:
      return <HeroBlock {...commonProps} />;
    case BlockType.BUTTON:
      return <ButtonBlock {...commonProps} />;
    case BlockType.DIVIDER:
      return <DividerBlock {...commonProps} />;
    case BlockType.SPACER:
      return <SpacerBlock {...commonProps} />;
    case BlockType.TEAM:
      return <TeamBlock {...commonProps} />;
    case BlockType.STATS:
      return <StatsBlock {...commonProps} />;
    case BlockType.CONTACT_INFO:
      return <ContactInfoBlock {...commonProps} />;
    case BlockType.CONTAINER:
      return <ContainerBlock {...containerProps} />;
    case BlockType.SECTION:
      return <SectionBlock {...containerProps} />;
    case BlockType.GRID:
      return <GridBlock {...containerProps} />;
    case BlockType.FLEX_ROW:
      return <FlexBlock {...containerProps} />;
    case BlockType.FLEX_COLUMN:
      return <FlexBlock {...containerProps} />;
    case BlockType.DYNAMIC:
      return <DynamicBlock {...commonProps} />;
    default:
      return (
        <div className="p-4 border border-red-300 bg-red-50 text-red-600 rounded">
          Unknown block type: {block.type}
        </div>
      );
  }
};
