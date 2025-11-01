'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TemplatePreviewModal } from '@/components/page-builder/TemplatePreviewModal';
import { SaveTemplateDialog } from '@/components/page-builder/SaveTemplateDialog';
import { PageBuilderProvider, useUIState, useTemplate, usePageState, usePageActions } from './PageBuilderProvider';
import { PageBuilderTopBar } from './PageBuilderTopBar';
import { PageBuilderSidebar } from './PageBuilderSidebar';
import { PageBuilderCanvas } from './PageBuilderCanvas';
import { BlockType } from '@/types/page-builder';
import { BLOCK_TYPES } from '@/constants/blockTypes';
import ErrorBoundary from './ErrorBoundary';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

/**
 * PageBuilder Internal Component
 * 
 * This component uses the PageBuilderContext and renders:
 * - Header (title, status, actions)
 * - Sidebar (block palette, templates)
 * - Canvas (editing area with drag-and-drop)
 * - Modals (template preview, save template, add child)
 * 
 * NOTE: Must be wrapped with PageBuilderProvider to access context hooks
 */
function PageBuilderInternal() {
  // Use individual hooks for better performance
  // These are safe to call here because PageBuilderInternal is always
  // rendered inside PageBuilderProvider
  const uiState = useUIState();
  const { showAddChildDialog, addChildParentId } = uiState;
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
  const { handleApplyTemplate, handleAddChildBlock, handleCloseAddChildDialog, handlePageSave } = usePageActions();
  
  // Render counter for debugging
  const renderCount = React.useRef(0);
  renderCount.current++;
  
  // Debug logging
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PageBuilder #${renderCount.current}] UI State:`, {
        showAddChildDialog,
        addChildParentId,
        showPreviewModal,
        showSaveTemplateDialog,
      });
      console.log(`[PageBuilder #${renderCount.current}] Dialog should be:`, showAddChildDialog ? '✅ VISIBLE' : '❌ HIDDEN');
    }
  }, [showAddChildDialog, addChildParentId, showPreviewModal, showSaveTemplateDialog]);
  
  // Setup keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
  useKeyboardShortcuts(handlePageSave);

  // Direct render log
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PageBuilder RENDER #${renderCount.current}] Direct values:`, {
      showAddChildDialog,
      addChildParentId,
    });
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Debug Badge */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-2 rounded z-[9999] pointer-events-none space-y-1">
          <div>Render #{renderCount.current}</div>
          <div>Dialog State: {showAddChildDialog ? '✅ OPEN' : '❌ CLOSED'}</div>
          <div>Parent ID: {addChildParentId ? `${addChildParentId.substring(0, 8)}...` : '❌ null'}</div>
          <div>Timestamp: {Date.now()}</div>
        </div>
      )}
      
      {/* Test Button - Direct State Toggle */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => {
            console.log('[TEST BUTTON] Clicked - calling openAddChildDialog');
            uiState.openAddChildDialog('test-parent-12345678');
          }}
          className="fixed top-20 right-4 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded shadow-lg z-[9999] cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          🧪 TEST OPEN DIALOG
        </button>
      )}
      
      {/* Top Bar: Page title, status, actions (simplified for normal mode) */}
      <PageBuilderTopBar
        showEditorControls={false}
        showPageInfo={true}
      />
      
      {/* Main Content: Sidebar + Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Block palette + Templates */}
        <PageBuilderSidebar />
        
        {/* Canvas: Editing area */}
        <PageBuilderCanvas />
      </div>
      
      {/* Add Child Block Dialog */}
      <Dialog 
        open={showAddChildDialog} 
        onOpenChange={(open) => {
          console.log(`[PageBuilder Dialog] onOpenChange:`, open);
          if (!open) handleCloseAddChildDialog();
        }}
      >
        {(() => {
          console.log(`[PageBuilder Dialog] RENDERING with open=${showAddChildDialog}`);
          return null;
        })()}
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Child Block to Container</DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Select a block type to add to the container
              {addChildParentId && ` (Parent: ${addChildParentId.substring(0, 8)}...)`}
            </p>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
            {BLOCK_TYPES.map(({ type, label, icon: Icon, color }) => (
              <Button
                key={type}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:border-blue-500"
                onClick={() => {
                  console.log(`[PageBuilder] Block selected:`, type, 'parentId:', addChildParentId);
                  if (addChildParentId) {
                    handleAddChildBlock(addChildParentId, type);
                  }
                }}
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
 * IMPORTANT: Provider must wrap PageBuilderInternal BEFORE any hooks are called.
 * The error "usePageState must be used within a PageStateProvider" occurs when:
 * 1. Hook is called outside provider scope
 * 2. Provider hasn't initialized before component renders
 * 3. Async/Suspense creates timing issues
 * 
 * @param pageId - Optional ID of existing page to edit (if omitted, creates new page)
 */
export default function PageBuilder({ pageId }: { pageId?: string }) {
  return (
    <ErrorBoundary>
      <PageBuilderProvider pageId={pageId}>
        <PageBuilderInternal />
      </PageBuilderProvider>
    </ErrorBoundary>
  );
}
