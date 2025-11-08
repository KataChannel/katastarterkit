'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BLOCK_TEMPLATES, BlockTemplate } from '@/data/blockTemplates';

// Types for custom templates (placeholder for future Server Actions)
interface TemplateBlocksData {
  id: string;
  name: string;
  description?: string;
  category: string;
  thumbnail?: string;
}

interface CreateTemplateInput {
  name: string;
  description?: string;
  category: string;
  thumbnail?: string;
}

/**
 * Template Context - Manages template state and operations
 * NOW WITH DATABASE STORAGE - Uses GraphQL for persistence
 */
interface TemplateContextType {
  // Template state
  allTemplates: BlockTemplate[];
  customTemplates: TemplateBlocksData[];
  selectedTemplate: BlockTemplate | null;
  templateSearchQuery: string;
  selectedTemplateCategory: string;
  showPreviewModal: boolean;
  isApplyingTemplate: boolean;
  showSaveTemplateDialog: boolean;
  isSavingTemplate: boolean;
  isLoadingTemplates: boolean;
  
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
  handleSaveAsTemplate: (template: CreateTemplateInput) => Promise<void>;
  handleDeleteCustomTemplate: (id: string) => Promise<void>;
  handleDuplicateTemplate: (id: string, newName?: string) => Promise<void>;
  refreshTemplates: () => Promise<void>;
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
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<TemplateBlocksData[]>([]);
  const [allTemplates, setAllTemplates] = useState<BlockTemplate[]>(BLOCK_TEMPLATES);
  
  // Refresh templates - simplified version without database calls
  // TODO: Implement with Server Actions when needed
  const refreshTemplates = React.useCallback(async () => {
    try {
      setIsLoadingTemplates(true);
      // For now, just use default templates
      // Custom templates will be loaded via Server Actions in future
      setCustomTemplates([]);
      setAllTemplates(BLOCK_TEMPLATES);
    } catch (error) {
      console.warn('Error loading templates:', error);
      setCustomTemplates([]);
      setAllTemplates(BLOCK_TEMPLATES);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, []); // ✅ No dependencies - stable!
  
  // Template operations
  const handlePreviewTemplate = React.useCallback((template: BlockTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  }, []);
  
  const handleClosePreview = React.useCallback(() => {
    setShowPreviewModal(false);
    setSelectedTemplate(null);
  }, []);
  
  // Save new template to database
  // TODO: Implement with Server Actions
  const handleSaveAsTemplate = React.useCallback(async (template: CreateTemplateInput) => {
    try {
      setIsSavingTemplate(true);
      console.log('Template saving not yet implemented with Server Actions:', template);
      alert('Template saving feature is coming soon!');
      setShowSaveTemplateDialog(false);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('An error occurred while saving the template.');
    } finally {
      setIsSavingTemplate(false);
    }
  }, []);
  
  // Delete template from database
  // TODO: Implement with Server Actions
  const handleDeleteCustomTemplate = React.useCallback(async (id: string) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this template?');
      if (!confirmed) return;
      
      console.log('Template deletion not yet implemented with Server Actions:', id);
      alert('Template deletion feature is coming soon!');
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('An error occurred while deleting the template.');
    }
  }, []);
  
  // Duplicate template
  // TODO: Implement with Server Actions
  const handleDuplicateTemplate = React.useCallback(async (id: string, newName?: string) => {
    try {
      console.log('Template duplication not yet implemented with Server Actions:', id, newName);
      alert('Template duplication feature is coming soon!');
    } catch (error) {
      console.error('Error duplicating template:', error);
      alert('An error occurred while duplicating the template.');
    }
  }, []);
  
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
    isLoadingTemplates,
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
    handleDuplicateTemplate,
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
    // Return default values instead of throwing during SSR or initial render
    if (typeof window === 'undefined') {
      return {
        allTemplates: [],
        customTemplates: [],
        selectedTemplate: null,
        templateSearchQuery: '',
        selectedTemplateCategory: 'all',
        showPreviewModal: false,
        isApplyingTemplate: false,
        showSaveTemplateDialog: false,
        isSavingTemplate: false,
        isLoadingTemplates: false,
        setTemplateSearchQuery: () => {},
        setSelectedTemplateCategory: () => {},
        setShowPreviewModal: () => {},
        setSelectedTemplate: () => {},
        setIsApplyingTemplate: () => {},
        setShowSaveTemplateDialog: () => {},
        setIsSavingTemplate: () => {},
        handlePreviewTemplate: () => {},
        handleClosePreview: () => {},
        handleSaveAsTemplate: async () => {},
        handleDeleteCustomTemplate: async () => {},
        handleDuplicateTemplate: async () => {},
        refreshTemplates: async () => {},
      } as TemplateContextType;
    }
    throw new Error(
      'useTemplate must be used within a TemplateProvider. ' +
      'Make sure your component is wrapped with <PageBuilderProvider>'
    );
  }
  return context;
}
