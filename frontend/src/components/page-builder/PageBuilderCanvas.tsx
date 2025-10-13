import React, { useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { Layout, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { usePageBuilderContext } from './PageBuilderProvider';
import { BlockRenderer } from './blocks/BlockRenderer';


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
    
    // Drag-and-drop actions
    handleDragStart,
    handleDragEnd,
  } = usePageBuilderContext();

  // Memoize block IDs array to prevent SortableContext re-renders
  const blockIds = useMemo(() => blocks.map(b => b.id), [blocks]);

  // Memoize empty state check
  const hasBlocks = useMemo(() => blocks.length > 0, [blocks.length]);

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
          // Edit Mode - Drag-and-drop enabled
          <DndContext
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext 
              items={blockIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {!hasBlocks ? (
                  // Empty State
                  <Card className="p-8 text-center border-dashed">
                    <div className="text-gray-500">
                      <Layout size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No blocks yet</p>
                      <p className="text-sm">Add your first block from the palette on the left</p>
                    </div>
                  </Card>
                ) : (
                  // Block List
                  blocks.map(block => (
                    <BlockRenderer
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

            {/* Drag Overlay - Visual feedback during drag */}
            <DragOverlay>
              {draggedBlock && (
                <Card className="p-4 opacity-90 transform rotate-2 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <GripVertical size={16} className="text-gray-400" />
                    <span className="font-medium">{draggedBlock.type} Block</span>
                  </div>
                </Card>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}

// Export with React.memo to prevent unnecessary re-renders
// Only re-renders when blocks, draggedBlock, or showPreview change
export const PageBuilderCanvas = React.memo(PageBuilderCanvasComponent);
