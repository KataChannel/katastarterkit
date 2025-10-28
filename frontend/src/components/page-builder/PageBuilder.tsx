'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TemplatePreviewModal } from '@/components/page-builder/TemplatePreviewModal';
import { SaveTemplateDialog } from '@/components/page-builder/SaveTemplateDialog';
import { PageBuilderProvider, useUIState, useTemplate, usePageState, usePageActions } from './PageBuilderProvider';
import { PageBuilderHeader } from './PageBuilderHeader';
import { PageBuilderSidebar } from './PageBuilderSidebar';
import { PageBuilderCanvas } from './PageBuilderCanvas';
import { BlockType } from '@/types/page-builder';
import { BLOCK_TYPES } from '@/constants/blockTypes';

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
  // Use individual hooks for better performance
  const { showAddChildDialog, addChildParentId } = useUIState();
  const { 
    showPreviewModal, 
    selectedTemplate, 
    isApplyingTemplate, 
    isSavingTemplate,
    showSaveTemplateDialog,
    handleSaveAsTemplate,
    handleClosePreview,
    setShowSaveTemplateDialog
  } = useTemplate();
  const { blocks } = usePageState();
  const { handleApplyTemplate, handleAddChildBlock, handleCloseAddChildDialog } = usePageActions();

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
 * Includes Error Boundary for graceful error handling.
 * 
 * @param pageId - Optional ID of existing page to edit (if omitted, creates new page)
 */
export default function PageBuilder({ pageId }: { pageId?: string }) {
  // Lazy import Error Boundary to avoid circular dependencies
  const ErrorBoundary = React.lazy(() => import('./ErrorBoundary'));
  
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <ErrorBoundary>
        <PageBuilderProvider pageId={pageId}>
          <PageBuilderInternal />
        </PageBuilderProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
}
