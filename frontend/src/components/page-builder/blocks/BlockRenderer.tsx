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
import { CompletedTasksBlock } from './CompletedTasksBlock';

export interface BlockRendererProps {
  block: PageBlock;
  isEditing?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isEditing = true,
  onUpdate,
  onDelete,
}) => {
  const commonProps = {
    block,
    isEditing,
    onUpdate: (content: any, style?: any) => onUpdate(content, style),
    onDelete,
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
    case BlockType.COMPLETED_TASKS:
      return <CompletedTasksBlock content={block.content} style={block.style} isEditing={isEditing} />;
    default:
      return (
        <div className="p-4 border border-red-300 bg-red-50 text-red-600 rounded">
          Unknown block type: {block.type}
        </div>
      );
  }
};