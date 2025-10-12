'use client';

import React, { useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, Eye, Settings } from 'lucide-react';
import { usePageBuilderContext } from './PageBuilderProvider';
import { PageStatus } from '@/types/page-builder';
import PageSettingsForm from './PageSettingsForm';

/**
 * PageBuilder Header Component
 * 
 * Displays the page title, status badge, and action buttons:
 * - Save as Template (only enabled when blocks exist)
 * - Preview toggle
 * - Page Settings dialog
 * - Save/Create Page button
 * 
 * Performance optimizations:
 * - Wrapped with React.memo to prevent unnecessary re-renders
 * - useCallback for event handlers to stabilize references
 * - useMemo for computed values to prevent recalculations
 */
function PageBuilderHeaderComponent() {
  const {
    editingPage,
    isNewPageMode,
    blocks,
    showPreview,
    showPageSettings,
    setShowPreview,
    setShowPageSettings,
    setShowSaveTemplateDialog,
    handlePageSave,
    setEditingPage,
  } = usePageBuilderContext();

  // Memoize computed values to prevent unnecessary recalculations
  const hasBlocks = useMemo(() => blocks.length > 0, [blocks.length]);
  const saveButtonText = useMemo(() => 
    isNewPageMode ? 'Create Page' : 'Save', 
    [isNewPageMode]
  );
  const statusBadgeVariant = useMemo(() => {
    if (!editingPage?.status) return 'secondary';
    return editingPage.status === PageStatus.PUBLISHED ? 'default' : 'secondary';
  }, [editingPage?.status]);

  // Memoize event handlers to stabilize function references
  const handleTogglePreview = useCallback(() => {
    setShowPreview(!showPreview);
  }, [showPreview, setShowPreview]);

  const handleOpenSettings = useCallback(() => {
    setShowPageSettings(true);
  }, [setShowPageSettings]);

  const handleCloseSettings = useCallback((open: boolean) => {
    if (!open) setShowPageSettings(false);
  }, [setShowPageSettings]);

  const handleOpenTemplateDialog = useCallback(() => {
    setShowSaveTemplateDialog(true);
  }, [setShowSaveTemplateDialog]);

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      {/* Left Section: Title and Status */}
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-900">Page Builder</h1>
        
        {editingPage && (
          <>
            <Badge variant={statusBadgeVariant}>
              {editingPage.status}
            </Badge>
            
            {editingPage.title && (
              <span className="text-sm text-gray-600">- {editingPage.title}</span>
            )}
          </>
        )}
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Save as Template Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenTemplateDialog}
          disabled={!hasBlocks}
          title={hasBlocks ? 'Save current blocks as template' : 'Add blocks to save as template'}
          className="flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save as Template</span>
        </Button>

        {/* Preview Toggle Button */}
        <Button
          variant={showPreview ? 'default' : 'outline'}
          size="sm"
          onClick={handleTogglePreview}
          className="flex items-center space-x-2"
        >
          <Eye size={16} />
          <span>{showPreview ? 'Edit' : 'Preview'}</span>
        </Button>

        {/* Page Settings Dialog */}
        <Dialog open={showPageSettings} onOpenChange={handleCloseSettings}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-2"
              onClick={handleOpenSettings}
            >
              <Settings size={16} />
              <span>Settings</span>
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Page Settings</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {editingPage && (
                <PageSettingsForm 
                  page={editingPage} 
                  onUpdate={setEditingPage} 
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Save/Create Page Button */}
        <Button 
          onClick={handlePageSave} 
          className="flex items-center space-x-2"
        >
          <Save size={16} />
          <span>{saveButtonText}</span>
        </Button>
      </div>
    </div>
  );
}

// Export with React.memo to prevent unnecessary re-renders
export const PageBuilderHeader = React.memo(PageBuilderHeaderComponent);
