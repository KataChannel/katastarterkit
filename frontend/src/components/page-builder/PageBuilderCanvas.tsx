import React, { useMemo, useCallback, useState } from 'react';
import {
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { 
  Layout, 
  Plus,
  Type,
  Image,
  Video,
  Zap,
  Layers,
  Grid3x3,
  Share2,
  Users,
  BarChart3,
  HelpCircle,
  Mail,
  Phone,
  Minus,
  Box,
  Square,
  ShoppingCart,
  MessageSquare,
  LayoutGrid,
  ArrowRightLeft,
  ArrowUpDown,
  Star,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { usePageState, useUIState, usePageActions } from './contexts';
import { BlockRenderer } from './blocks/BlockRenderer';
import { SortableBlockWrapper } from './blocks/SortableBlockWrapper';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockType } from '@/types/page-builder';


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
const PageBuilderCanvasComponent = React.memo(function PageBuilderCanvasComponent() {
  // Use individual hooks for better performance
  const { blocks, draggedBlock } = usePageState();
  const { showPreview } = useUIState();
  const { handleBlockUpdate, handleBlockDelete, handleAddChild, handleSelectBlock, handleAddBlock } = usePageActions();
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedBlocks, setBookmarkedBlocks] = useState<BlockType[]>([]);

  // Memoize block IDs array to prevent SortableContext re-renders
  const blockIds = useMemo(() => blocks.map(b => b.id), [blocks]);

  // Memoize empty state check
  const hasBlocks = useMemo(() => blocks.length > 0, [blocks.length]);

  // Main droppable zone for canvas - accepts both existing blocks and new blocks from LeftPanel
  // IMPORTANT: This droppable is OUTSIDE the SortableContext to properly receive new-block drops
  const { setNodeRef: setCanvasRef, isOver: isCanvasOver, node: canvasNode } = useDroppable({
    id: 'canvas-droppable',
    data: {
      type: 'canvas',
      accepts: ['existing-block', 'new-block'],
    },
  });
  
  // Log droppable setup (dev only to prevent performance overhead)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[PageBuilder] Canvas droppable setup:', {
        hasRef: !!setCanvasRef,
        isOver: isCanvasOver,
      });
    }
  }, [setCanvasRef, isCanvasOver]);

  // Block types grouped by category with lucide icons
  const blockTypeGroups = [
    {
      category: 'Content Blocks',
      blocks: [
        { type: BlockType.TEXT, label: 'Text', Icon: Type },
        { type: BlockType.IMAGE, label: 'Image', Icon: Image },
        { type: BlockType.VIDEO, label: 'Video', Icon: Video },
        { type: BlockType.BUTTON, label: 'Button', Icon: Square },
        { type: BlockType.HERO, label: 'Hero', Icon: Layers },
        { type: BlockType.CAROUSEL, label: 'Carousel', Icon: Share2 },
        { type: BlockType.GALLERY, label: 'Gallery', Icon: LayoutGrid },
        { type: BlockType.CARD, label: 'Card', Icon: Box },
        { type: BlockType.TESTIMONIAL, label: 'Testimonial', Icon: MessageSquare },
        { type: BlockType.TEAM, label: 'Team', Icon: Users },
        { type: BlockType.STATS, label: 'Stats', Icon: BarChart3 },
        { type: BlockType.FAQ, label: 'FAQ', Icon: HelpCircle },
        { type: BlockType.CONTACT_FORM, label: 'Contact Form', Icon: Mail },
        { type: BlockType.CONTACT_INFO, label: 'Contact Info', Icon: Phone },
      ]
    },
    {
      category: 'Container & Layout',
      blocks: [
        { type: BlockType.SECTION, label: 'Section', Icon: Box },
        { type: BlockType.CONTAINER, label: 'Container', Icon: Layers },
        { type: BlockType.GRID, label: 'Grid', Icon: Grid3x3 },
        { type: BlockType.FLEX_ROW, label: 'Flex Row', Icon: ArrowRightLeft },
        { type: BlockType.FLEX_COLUMN, label: 'Flex Column', Icon: ArrowUpDown },
      ]
    },
    {
      category: 'Utility Blocks',
      blocks: [
        { type: BlockType.DIVIDER, label: 'Divider', Icon: Minus },
        { type: BlockType.SPACER, label: 'Spacer', Icon: Square },
      ]
    },
    {
      category: 'Dynamic & E-commerce',
      blocks: [
        { type: BlockType.DYNAMIC, label: 'Dynamic Block', Icon: Zap },
        { type: BlockType.PRODUCT_LIST, label: 'Product List', Icon: ShoppingCart },
      ]
    },
  ];

  // Flatten for dropdown rendering
  const commonBlockTypes = blockTypeGroups.flatMap(group => group.blocks);

  // Get bookmarked blocks
  const bookmarkedBlocksData = useMemo(() => {
    return bookmarkedBlocks
      .map(blockType => commonBlockTypes.find(b => b.type === blockType))
      .filter(Boolean) as typeof commonBlockTypes;
  }, [bookmarkedBlocks, commonBlockTypes]);

  // Filter block types based on search query
  const filteredBlockTypeGroups = useMemo(() => {
    if (!searchQuery.trim()) return blockTypeGroups;
    
    const query = searchQuery.toLowerCase();
    return blockTypeGroups
      .map(group => ({
        ...group,
        blocks: group.blocks.filter(
          block => 
            block.label.toLowerCase().includes(query) ||
            block.type.toLowerCase().includes(query)
        ),
      }))
      .filter(group => group.blocks.length > 0);
  }, [searchQuery, blockTypeGroups]);

  // Toggle bookmark
  const toggleBookmark = useCallback((blockType: BlockType) => {
    setBookmarkedBlocks(prev => 
      prev.includes(blockType)
        ? prev.filter(b => b !== blockType)
        : [...prev, blockType]
    );
  }, []);

  // Handle add block with feedback
  const handleAddBlockClick = useCallback(async (blockType: BlockType) => {
    try {
      await handleAddBlock(blockType);
      setIsAddingBlock(false);
    } catch (error) {
      console.error('Failed to add block:', error);
    }
  }, [handleAddBlock]);

  // Render block item with bookmark button
  const renderBlockItem = (block: typeof commonBlockTypes[0]) => {
    const isBookmarked = bookmarkedBlocks.includes(block.type);
    return (
      <div key={block.type} className="flex items-center justify-between group">
        <DropdownMenuItem 
          onClick={() => handleAddBlockClick(block.type)}
          className="cursor-pointer gap-2 flex-1"
        >
          <block.Icon size={16} className="text-gray-600" />
          <span>{block.label}</span>
        </DropdownMenuItem>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(block.type);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100"
        >
          <Star
            size={16}
            className={isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
          />
        </button>
      </div>
    );
  };

  // Render dropdown menu content with grouped items and search
  const renderDropdownItems = () => {
    if (filteredBlockTypeGroups.length === 0) {
      return (
        <div className="px-2 py-4 text-center text-sm text-gray-500">
          No blocks found matching "{searchQuery}"
        </div>
      );
    }

    return filteredBlockTypeGroups.map((group, groupIndex) => (
      <div key={group.category}>
        {groupIndex > 0 && <div className="my-1 mx-0 h-px bg-gray-200" />}
        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
          {group.category}
        </div>
        {group.blocks.map((block) => renderBlockItem(block))}
      </div>
    ));
  };

  // Render bookmarked blocks
  const renderBookmarkedItems = () => {
    if (bookmarkedBlocksData.length === 0) {
      return (
        <div className="px-2 py-8 text-center text-sm text-gray-500">
          <Star size={32} className="mx-auto mb-2 opacity-30" />
          <p>No bookmarked blocks yet</p>
          <p className="text-xs mt-1">Star your favorite blocks to see them here</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {bookmarkedBlocksData.map((block) => renderBlockItem(block))}
      </div>
    );
  };

  return (
    <div className="flex-1 p-12 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
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
            <div 
              ref={setCanvasRef} 
              className={`space-y-4 min-h-[400px] p-6 rounded-lg transition-all duration-200 ${
                isCanvasOver 
                  ? 'bg-blue-50 border-2 border-blue-400 border-dashed shadow-lg shadow-blue-200' 
                  : 'bg-white border-2 border-dashed border-gray-200'
              }`}
            >
              {/* Drop zone hint - optimized for performance */}
              <div className={cn(
                "absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-200",
                isCanvasOver ? "opacity-100" : "opacity-0"
              )}>
                <div className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg animate-bounce">
                  📍 Drop here to add block
                </div>
              </div>
              
              {!hasBlocks ? (
                // Empty State - Droppable
                <Card className={`p-8 text-center border-2 transition-all duration-200 ${
                  isCanvasOver
                    ? 'border-blue-400 border-solid bg-blue-50 scale-105'
                    : 'border-gray-300 border-dashed hover:border-primary hover:bg-primary/5'
                }`}>
                  <div className="text-gray-500">
                    <Layout size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No blocks yet</p>
                    <p className="text-sm mb-6">Drag and drop blocks from the left panel to start building</p>
                    {isCanvasOver && (
                      <p className="text-sm text-blue-600 font-semibold mb-4">🎯 Ready to drop!</p>
                    )}
                    
                    {/* Add Block Dropdown Button */}
                    <DropdownMenu open={isAddingBlock} onOpenChange={setIsAddingBlock}>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          size="sm" 
                          className="gap-2"
                          variant="default"
                        >
                          <Plus size={16} />
                          Add Block
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-72">
                        {/* Tabs for All Blocks and Bookmarked */}
                        <Tabs defaultValue="all" className="w-full">
                          <TabsList className="w-full grid grid-cols-2 mb-2 border-b">
                            <TabsTrigger value="all" className="text-xs">
                              All Blocks
                            </TabsTrigger>
                            <TabsTrigger value="bookmarked" className="text-xs">
                              <Star size={14} className="mr-1" />
                              Bookmarked
                            </TabsTrigger>
                          </TabsList>

                          {/* Search Input */}
                          <div className="p-2 border-b border-gray-200 sticky top-14 bg-white z-10">
                            <Input
                              placeholder="Search blocks..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="h-8 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>

                          {/* All Blocks Tab */}
                          <TabsContent value="all" className="max-h-80 overflow-y-auto p-0 m-0">
                            {renderDropdownItems()}
                          </TabsContent>

                          {/* Bookmarked Tab */}
                          <TabsContent value="bookmarked" className="max-h-80 overflow-y-auto p-0 m-0">
                            <div className="p-2">
                              {renderBookmarkedItems()}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ) : (
                // Block List with Sortable Wrappers
                <>
                  {/* Blocks List */}
                  <div className="space-y-4">
                    {blocks.map(block => (
                      <SortableBlockWrapper
                        key={block.id}
                        block={block}
                        isEditing={true}
                        onUpdate={(content: any, style: any) => handleBlockUpdate(block.id, content, style)}
                        onDelete={() => handleBlockDelete(block.id)}
                        onAddChild={handleAddChild}
                        onUpdateChild={handleBlockUpdate}
                        onDeleteChild={handleBlockDelete}
                        onSelect={handleSelectBlock}
                        depth={0}
                      />
                    ))}
                    
                    {/* Add Block Button at Bottom */}
                    <div className="pt-4 border-t border-gray-200 mt-6">
                      <DropdownMenu open={isAddingBlock} onOpenChange={setIsAddingBlock}>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            size="sm" 
                            className="w-full gap-2"
                            variant="secondary"
                          >
                            <Plus size={16} />
                            Add New Block
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" className="w-72">
                          {/* Tabs for All Blocks and Bookmarked */}
                          <Tabs defaultValue="all" className="w-full">
                            <TabsList className="w-full grid grid-cols-2 mb-2 border-b">
                              <TabsTrigger value="all" className="text-xs">
                                All Blocks
                              </TabsTrigger>
                              <TabsTrigger value="bookmarked" className="text-xs">
                                <Star size={14} className="mr-1" />
                                Bookmarked
                              </TabsTrigger>
                            </TabsList>

                            {/* Search Input */}
                            <div className="p-2 border-b border-gray-200 sticky top-14 bg-white z-10">
                              <Input
                                placeholder="Search blocks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-8 text-sm"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            {/* All Blocks Tab */}
                            <TabsContent value="all" className="max-h-80 overflow-y-auto p-0 m-0">
                              {renderDropdownItems()}
                            </TabsContent>

                            {/* Bookmarked Tab */}
                            <TabsContent value="bookmarked" className="max-h-80 overflow-y-auto p-0 m-0">
                              <div className="p-2">
                                {renderBookmarkedItems()}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </>
              )}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
});

// Export with React.memo to prevent unnecessary re-renders
// Only re-renders when blocks, draggedBlock, or showPreview change
export const PageBuilderCanvas = PageBuilderCanvasComponent;
