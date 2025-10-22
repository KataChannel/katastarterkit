'use client';

import React, { ReactNode } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  PageStateProvider,
  UIStateProvider,
  TemplateProvider,
  PageActionsProvider,
  usePageState,
  usePageActions,
} from './contexts';
import ErrorBoundary from './ErrorBoundary';
import PageStateErrorBoundary from './contexts/PageStateErrorBoundary';
import UIStateErrorBoundary from './contexts/UIStateErrorBoundary';
import PageActionsErrorBoundary from './contexts/PageActionsErrorBoundary';

/**
 * PageBuilder Provider Props
 */
interface PageBuilderProviderProps {
  children: ReactNode;
  pageId?: string;
}

/**
 * Refactored PageBuilder Provider Component
 * 
 * Now uses 4 separate contexts for better organization:
 * - PageStateContext: Page and blocks state
 * - UIStateContext: UI state (modals, dialogs)
 * - TemplateContext: Template operations
 * - PageActionsContext: All CRUD operations
 * 
 * Wrapped with Error Boundaries for robust error handling
 */
export function PageBuilderProvider({ children, pageId }: PageBuilderProviderProps) {
  return (
    <ErrorBoundary>
      <PageStateErrorBoundary>
        <PageStateProvider pageId={pageId}>
          <UIStateErrorBoundary>
            <UIStateProvider>
              <TemplateProvider>
                <PageActionsErrorBoundary>
                  <PageActionsProvider pageId={pageId}>
                    <DndContextWrapper>
                      {children}
                    </DndContextWrapper>
                  </PageActionsProvider>
                </PageActionsErrorBoundary>
              </TemplateProvider>
            </UIStateProvider>
          </UIStateErrorBoundary>
        </PageStateProvider>
      </PageStateErrorBoundary>
    </ErrorBoundary>
  );
}

/**
 * DnD Context Wrapper
 * Handles drag and drop functionality
 * 
 * Important: handleDragEnd is async but DndContext onDragEnd doesn't wait for async.
 * We wrap it to ensure proper handling of the async operations.
 */
function DndContextWrapper({ children }: { children: ReactNode }) {
  const { draggedBlock } = usePageState();
  const { handleDragStart, handleDragEnd: handleDragEndAsync } = usePageActions();

  // Wrap async handler since DndContext doesn't wait for async callbacks
  // Fire and forget - let the async operation complete in the background
  const handleDragEnd = React.useCallback((event: any) => {
    handleDragEndAsync(event).catch((error: any) => {
      console.error('Error in handleDragEnd:', error);
    });
  }, [handleDragEndAsync]);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      {children}
      
      {/* Drag Overlay */}
      <DragOverlay>
        {draggedBlock ? (
          <Card className="p-4 bg-white shadow-lg border-2 border-blue-500 opacity-80">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">{draggedBlock.type}</span>
            </div>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/**
 * Combined hook for backward compatibility
 * Returns all context values in a single object
 * 
 * @deprecated Use individual hooks (usePageState, useUIState, etc.) instead
 */
export function usePageBuilderContext() {
  const pageState = usePageState();
  const { useUIState } = require('./contexts');
  const { useTemplate } = require('./contexts');
  const uiState = useUIState();
  const templateState = useTemplate();
  const pageActions = usePageActions();

  // Combine all contexts for backward compatibility
  return {
    // From PageStateContext
    ...pageState,
    
    // From UIStateContext
    ...(uiState || {}),
    
    // From TemplateContext
    ...(templateState || {}),
    
    // From PageActionsContext
    ...pageActions,
  };
}

// Also export individual hooks for better tree-shaking
export { usePageState, useUIState, useTemplate, usePageActions } from './contexts';

// Export PageBuilderContext for backward compatibility
export const PageBuilderContext = React.createContext<ReturnType<typeof usePageBuilderContext> | undefined>(undefined);
