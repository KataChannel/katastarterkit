'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BLOCK_TEMPLATES, BlockTemplate } from '@/data/blockTemplates';
import { 
  getCustomTemplates, 
  saveCustomTemplate, 
  deleteCustomTemplate,
  CustomTemplate 
} from '@/utils/customTemplates';
import { initSampleTemplates } from '@/utils/initSampleTemplates';

/**
 * Template Context - Manages template state and operations
 */
interface TemplateContextType {
  // Template state
  allTemplates: BlockTemplate[];
  customTemplates: CustomTemplate[];
  selectedTemplate: BlockTemplate | null;
  templateSearchQuery: string;
  selectedTemplateCategory: string;
  showPreviewModal: boolean;
  isApplyingTemplate: boolean;
  showSaveTemplateDialog: boolean;
  isSavingTemplate: boolean;
  
  // State setters
  setTemplateSearchQuery: (query: string) => void;
  setSelectedTemplateCategory: (category: string) => void;
  setShowPreviewModal: (show: boolean) => void;
  setSelectedTemplate: (template: BlockTemplate | null) => void;
  setIsApplyingTemplate: (applying: boolean) => void;
  setShowSaveTemplateDialog: (show: boolean) => void;
  setIsSavingTemplate: (saving: boolean) => void;
  
  // Template operations
  handlePreviewTemplate: (template: BlockTemplate) => void;
  handleClosePreview: () => void;
  handleSaveAsTemplate: (template: Omit<BlockTemplate, 'id' | 'thumbnail'>) => void;
  handleDeleteCustomTemplate: (id: string) => void;
  refreshTemplates: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

interface TemplateProviderProps {
  children: ReactNode;
}

export function TemplateProvider({ children }: TemplateProviderProps) {
  // Template state
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<BlockTemplate | null>(null);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [allTemplates, setAllTemplates] = useState<BlockTemplate[]>(BLOCK_TEMPLATES);
  
  // Load custom templates
  const refreshTemplates = React.useCallback(() => {
    initSampleTemplates();
    const custom = getCustomTemplates();
    setCustomTemplates(custom);
    setAllTemplates([...BLOCK_TEMPLATES, ...custom]);
  }, []);
  
  useEffect(() => {
    refreshTemplates();
    
    // Listen for storage changes
    window.addEventListener('storage', refreshTemplates);
    return () => window.removeEventListener('storage', refreshTemplates);
  }, [refreshTemplates]);
  
  // Template operations
  const handlePreviewTemplate = React.useCallback((template: BlockTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  }, []);
  
  const handleClosePreview = React.useCallback(() => {
    setShowPreviewModal(false);
    setSelectedTemplate(null);
  }, []);
  
  const handleSaveAsTemplate = React.useCallback((template: Omit<BlockTemplate, 'id' | 'thumbnail'>) => {
    const newTemplate: BlockTemplate = {
      ...template,
      id: `custom-${Date.now()}`,
      thumbnail: '/placeholder-template.png',
    };
    
    saveCustomTemplate(newTemplate);
    refreshTemplates();
  }, [refreshTemplates]);
  
  const handleDeleteCustomTemplate = React.useCallback((id: string) => {
    deleteCustomTemplate(id);
    refreshTemplates();
  }, [refreshTemplates]);
  
  const value: TemplateContextType = {
    allTemplates,
    customTemplates,
    selectedTemplate,
    templateSearchQuery,
    selectedTemplateCategory,
    showPreviewModal,
    isApplyingTemplate,
    showSaveTemplateDialog,
    isSavingTemplate,
    setTemplateSearchQuery,
    setSelectedTemplateCategory,
    setShowPreviewModal,
    setSelectedTemplate,
    setIsApplyingTemplate,
    setShowSaveTemplateDialog,
    setIsSavingTemplate,
    handlePreviewTemplate,
    handleClosePreview,
    handleSaveAsTemplate,
    handleDeleteCustomTemplate,
    refreshTemplates,
  };
  
  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplate() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
}
