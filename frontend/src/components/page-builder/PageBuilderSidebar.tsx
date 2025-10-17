import React, { useMemo, useCallback } from 'react';
import { 
  Type, Image, Layout, Square, Users, TrendingUp, Phone, Minus, Space,
  Box, Columns, Grid3x3, ArrowRightLeft, ArrowUpDown, Code,
  Eye, Plus, Trash2, Presentation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageBuilderContext } from './PageBuilderProvider';
import { BlockType } from '@/types/page-builder';
import { TemplateLibrary } from './templates';

/**
 * Block type definitions with icons and colors
 */
const BLOCK_TYPES = [
  // Content Blocks
  { type: BlockType.TEXT, label: 'Text Block', icon: Type, color: 'bg-blue-100 text-blue-600' },
  { type: BlockType.IMAGE, label: 'Image Block', icon: Image, color: 'bg-green-100 text-green-600' },
  { type: BlockType.CAROUSEL, label: 'Carousel', icon: Presentation, color: 'bg-teal-100 text-teal-600' },
  { type: BlockType.HERO, label: 'Hero Section', icon: Layout, color: 'bg-purple-100 text-purple-600' },
  { type: BlockType.BUTTON, label: 'Button', icon: Square, color: 'bg-orange-100 text-orange-600' },
  { type: BlockType.TEAM, label: 'Team Section', icon: Users, color: 'bg-indigo-100 text-indigo-600' },
  { type: BlockType.STATS, label: 'Stats Section', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600' },
  { type: BlockType.CONTACT_INFO, label: 'Contact Info', icon: Phone, color: 'bg-cyan-100 text-cyan-600' },
  { type: BlockType.DIVIDER, label: 'Divider', icon: Minus, color: 'bg-gray-100 text-gray-600' },
  { type: BlockType.SPACER, label: 'Spacer', icon: Space, color: 'bg-yellow-100 text-yellow-600' },
  
  // Container/Layout Blocks
  { type: BlockType.CONTAINER, label: 'Container', icon: Box, color: 'bg-violet-100 text-violet-600' },
  { type: BlockType.SECTION, label: 'Section', icon: Columns, color: 'bg-fuchsia-100 text-fuchsia-600' },
  { type: BlockType.GRID, label: 'Grid Layout', icon: Grid3x3, color: 'bg-pink-100 text-pink-600' },
  { type: BlockType.FLEX_ROW, label: 'Flex Row', icon: ArrowRightLeft, color: 'bg-rose-100 text-rose-600' },
  { type: BlockType.FLEX_COLUMN, label: 'Flex Column', icon: ArrowUpDown, color: 'bg-amber-100 text-amber-600' },
  
  // Dynamic Block
  { type: BlockType.DYNAMIC, label: 'Dynamic Block', icon: Code, color: 'bg-purple-100 text-purple-600' },
];

/**
 * PageBuilderSidebar Component
 * 
 * Provides:
 * - Block types palette (Blocks tab)
 * - Template browser with search and filter (Templates tab)
 * - Template actions (preview, apply, delete custom)
 * 
 * Performance optimizations:
 * - Wrapped with React.memo to prevent unnecessary re-renders
 * - useMemo for template filtering (expensive operation)
 * - useCallback for event handlers
 */
function PageBuilderSidebarComponent() {
  const {
    // State
    editingPage,
    isNewPageMode,
    
    // Template actions
    handleApplyTemplate,
    setShowSaveTemplateDialog,
    
    // Block actions
    handleAddBlock,
  } = usePageBuilderContext();

  // Handle template selection with type conversion if needed
  const handleTemplateSelect = useCallback(async (template: any) => {
    // Convert PageTemplate to BlockTemplate format if needed
    const blockTemplate = {
      ...template,
      blocks: template.structure || template.blocks || []
    };
    await handleApplyTemplate(blockTemplate);
  }, [handleApplyTemplate]);

  const handleCreateNewTemplate = useCallback(() => {
    setShowSaveTemplateDialog(true);
  }, [setShowSaveTemplateDialog]);

  const handleImportTemplate = useCallback(() => {
    // This could be implemented with an import dialog
    console.log('Import template functionality - could open import dialog');
  }, []);

  return (
    <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
      <Tabs defaultValue="blocks" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="blocks" className="flex-1">Blocks</TabsTrigger>
          <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
        </TabsList>
        
        {/* Blocks Tab - Block Types Palette */}
        <TabsContent value="blocks" className="mt-0">
          <div className="space-y-2">
            {BLOCK_TYPES.map(blockType => (
              <Button
                key={blockType.type}
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={() => handleAddBlock(blockType.type)}
                disabled={isNewPageMode && !editingPage?.id}
              >
                <div className={`p-2 rounded mr-3 ${blockType.color}`}>
                  <blockType.icon size={16} />
                </div>
                <span className="text-sm">{blockType.label}</span>
              </Button>
            ))}
          </div>
        </TabsContent>
        
        {/* Templates Tab - Full Template Library */}
        <TabsContent value="templates" className="mt-0 p-0">
          <TemplateLibrary 
            onTemplateSelect={handleTemplateSelect}
            onCreateNew={handleCreateNewTemplate}
            onImport={handleImportTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Export with React.memo to prevent unnecessary re-renders
// Component only re-renders when context values it uses actually change
export const PageBuilderSidebar = React.memo(PageBuilderSidebarComponent);
