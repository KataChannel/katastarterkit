'use client';

import React from 'react';
import {
  Type, Image, Layout, Square, Users, TrendingUp, Phone, Minus, Space,
  Box, Columns, Grid3x3, ArrowRightLeft, ArrowUpDown, Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TemplatePreviewModal } from '@/components/page-builder/TemplatePreviewModal';
import { SaveTemplateDialog } from '@/components/page-builder/SaveTemplateDialog';
import { PageBuilderProvider, usePageBuilderContext } from './PageBuilderProvider';
import { PageBuilderHeader } from './PageBuilderHeader';
import { PageBuilderSidebar } from './PageBuilderSidebar';
import { PageBuilderCanvas } from './PageBuilderCanvas';
import { BlockType } from '@/types/page-builder';

/**
 * Block type definitions for the Add Child Dialog
 */
const BLOCK_TYPES = [
  // Content Blocks
  { type: BlockType.TEXT, label: 'Text Block', icon: Type, color: 'bg-blue-100 text-blue-600' },
  { type: BlockType.IMAGE, label: 'Image Block', icon: Image, color: 'bg-green-100 text-green-600' },
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
 * PageBuilder Internal Component
 * 
 * This component uses the PageBuilderContext and renders:
 * - Header (title, status, actions)
 * - Sidebar (block palette, templates)
 * - Canvas (editing area with drag-and-drop)
 * - Modals (template preview, save template, add child)
 */
function PageBuilderInternal() {
  const {
    // Modal state
    showPreviewModal,
    showSaveTemplateDialog,
    showAddChildDialog,
    addChildParentId,
    
    // Template state
    selectedTemplate,
    isApplyingTemplate,
    isSavingTemplate,
    
    // Block state
    blocks,
    
    // Actions
    handleApplyTemplate,
    handleSaveAsTemplate,
    handleAddChildBlock,
    handleClosePreview,
    handleCloseAddChildDialog,
    setShowSaveTemplateDialog,
  } = usePageBuilderContext();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header: Title, status, actions */}
      <PageBuilderHeader />
      
      {/* Main Content: Sidebar + Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Block palette + Templates */}
        <PageBuilderSidebar />
        
        {/* Canvas: Editing area */}
        <PageBuilderCanvas />
      </div>
      
      {/* Add Child Block Dialog */}
      <Dialog open={showAddChildDialog} onOpenChange={(open) => !open && handleCloseAddChildDialog()}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Child Block</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
            {BLOCK_TYPES.map(({ type, label, icon: Icon, color }) => (
              <Button
                key={type}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:border-blue-500"
                onClick={() => addChildParentId && handleAddChildBlock(addChildParentId, type)}
              >
                <div className={`p-3 rounded-lg ${color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-sm font-medium text-center">{label}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Template Preview Modal */}
      <TemplatePreviewModal
        open={showPreviewModal}
        onOpenChange={(open) => !open && handleClosePreview()}
        template={selectedTemplate}
        onApply={() => selectedTemplate && handleApplyTemplate(selectedTemplate)}
        isApplying={isApplyingTemplate}
      />
      
      {/* Save Template Dialog */}
      <SaveTemplateDialog
        open={showSaveTemplateDialog}
        onOpenChange={setShowSaveTemplateDialog}
        blocks={blocks}
        onSave={handleSaveAsTemplate}
        isSaving={isSavingTemplate}
      />
    </div>
  );
}

/**
 * PageBuilder Component
 * 
 * Main entry point for the Page Builder.
 * Wraps the internal component with PageBuilderProvider for state management.
 * 
 * @param pageId - Optional ID of existing page to edit (if omitted, creates new page)
 */
export default function PageBuilder({ pageId }: { pageId?: string }) {
  return (
    <PageBuilderProvider pageId={pageId}>
      <PageBuilderInternal />
    </PageBuilderProvider>
  );
}
