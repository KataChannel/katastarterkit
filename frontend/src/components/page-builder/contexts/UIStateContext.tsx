'use client';

import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

/**
 * UI State Context - Manages UI state (modals, dialogs, panels)
 */
interface UIStateContextType {
  // UI state
  showPageSettings: boolean;
  showPreview: boolean;
  showAddChildDialog: boolean;
  addChildParentId: string | null;
  
  // State setters
  setShowPageSettings: (show: boolean) => void;
  setShowPreview: (show: boolean) => void;
  setShowAddChildDialog: (show: boolean) => void;
  setAddChildParentId: (id: string | null) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

interface UIStateProviderProps {
  children: ReactNode;
}

export function UIStateProvider({ children }: UIStateProviderProps) {
  const [showPageSettings, setShowPageSettingsState] = useState(false);
  const [showPreview, setShowPreviewState] = useState(false);
  const [showAddChildDialog, setShowAddChildDialogState] = useState(false);
  const [addChildParentId, setAddChildParentIdState] = useState<string | null>(null);
  
  // Memoized setters for stable references - prevents unnecessary re-renders
  const setShowPageSettings = useCallback((show: boolean) => {
    setShowPageSettingsState(show);
  }, []);
  
  const setShowPreview = useCallback((show: boolean) => {
    setShowPreviewState(show);
  }, []);
  
  const setShowAddChildDialog = useCallback((show: boolean) => {
    setShowAddChildDialogState(show);
  }, []);
  
  const setAddChildParentId = useCallback((id: string | null) => {
    setAddChildParentIdState(id);
  }, []);
  
  // Memoize context value to prevent unnecessary re-renders
  const value: UIStateContextType = useMemo(() => ({
    showPageSettings,
    showPreview,
    showAddChildDialog,
    addChildParentId,
    setShowPageSettings,
    setShowPreview,
    setShowAddChildDialog,
    setAddChildParentId,
  }), [
    showPageSettings,
    showPreview,
    showAddChildDialog,
    addChildParentId,
    setShowPageSettings,
    setShowPreview,
    setShowAddChildDialog,
    setAddChildParentId,
  ]);
  
  return (
    <UIStateContext.Provider value={value}>
      {children}
    </UIStateContext.Provider>
  );
}

export function useUIState() {
  const context = useContext(UIStateContext);
  if (context === undefined) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
}
