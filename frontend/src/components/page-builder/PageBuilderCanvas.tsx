import React, { useMemo, useCallback } from 'react';
import {
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Layout } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { usePageBuilderContext } from './PageBuilderProvider';
import { BlockRenderer } from './blocks/BlockRenderer';
import { SortableBlockWrapper } from './blocks/SortableBlockWrapper';


/**
 * PageBuilderCanvas Component
 * 
 * The main editing area where blocks are displayed and can be:
 * - Reordered via drag-and-drop
 * - Edited in place
 * - Deleted
 * - Previewed (read-only mode)
 * 
 * Features:
 * - Drag-and-drop with visual feedback
 * - Nested block support
 * - Preview mode toggle
 * - Empty state
 * 
 * Performance optimizations:
 * - Wrapped with React.memo
 * - useMemo for block IDs array
 * - useCallback for update handlers
 */
function PageBuilderCanvasComponent() {
  const {
    // State
    blocks,
    draggedBlock,
    showPreview,
    
    // Block actions
    handleBlockUpdate,
    handleBlockDelete,
    handleAddChild,
  } = usePageBuilderContext();

  // Memoize block IDs array to prevent SortableContext re-renders
  const blockIds = useMemo(() => blocks.map(b => b.id), [blocks]);

  // Memoize empty state check
  const hasBlocks = useMemo(() => blocks.length > 0, [blocks.length]);

  // Droppable zone for empty canvas
  const { setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="max-w-4xl mx-auto">
        {showPreview ? (
          // Preview Mode - Read-only view
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-3xl font-bold mb-6">Preview</h2>
            {blocks.map(block => (
              <BlockRenderer
                key={block.id}
                block={block}
                isEditing={false}
                onUpdate={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        ) : (
          // Edit Mode - Sortable enabled
          <SortableContext 
            items={blockIds}
            strategy={verticalListSortingStrategy}
          >
            <div ref={setNodeRef} className="space-y-4 min-h-[400px]">
              {!hasBlocks ? (
                // Empty State - Droppable
                <Card className="p-8 text-center border-dashed border-2 border-gray-300 hover:border-primary transition-colors">
                  <div className="text-gray-500">
                    <Layout size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No blocks yet</p>
                    <p className="text-sm">Drag and drop blocks from the left panel to start building</p>
                  </div>
                </Card>
              ) : (
                // Block List with Sortable Wrappers
                blocks.map(block => (
                  <SortableBlockWrapper
                    key={block.id}
                    block={block}
                    isEditing={true}
                    onUpdate={(content: any, style: any) => handleBlockUpdate(block.id, content, style)}
                    onDelete={() => handleBlockDelete(block.id)}
                    onAddChild={handleAddChild}
                    onUpdateChild={handleBlockUpdate}
                    onDeleteChild={handleBlockDelete}
                    depth={0}
                  />
                ))
              )}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}

// Export with React.memo to prevent unnecessary re-renders
// Only re-renders when blocks, draggedBlock, or showPreview change
export const PageBuilderCanvas = React.memo(PageBuilderCanvasComponent);
