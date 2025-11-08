'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApolloClient } from '@/lib/apollo-client-stubs';
import { BLOCK_TEMPLATES, BlockTemplate } from '@/data/blockTemplates';
import { 
  CustomTemplatesService,
  initCustomTemplatesService,
  TemplateBlocksData,
  CreateTemplateInput,
} from '@/utils/customTemplates';

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
  // Get Apollo client for GraphQL operations
  const apolloClient = useApolloClient();
  
  // Initialize service on mount
  useEffect(() => {
    initCustomTemplatesService(apolloClient as any);
  }, [apolloClient]);
  
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
  
  // Load custom templates from database
  const refreshTemplates = React.useCallback(async () => {
    try {
      setIsLoadingTemplates(true);
      
      // Check if Apollo Client is available (not a stub)
      if (!apolloClient || typeof apolloClient.query !== 'function') {
        console.warn('Apollo Client not available. Using default templates only.');
        setCustomTemplates([]);
        setAllTemplates(BLOCK_TEMPLATES);
        return;
      }
      
      // Initialize service
      const service = new CustomTemplatesService(apolloClient as any);
      
      // Note: initSampleTemplates requires client and userId - should be called elsewhere
      // in a hook that has access to current user context
      
      const custom = await service.getMyTemplates();
      
      // Handle null/undefined response from stub client
      if (!custom || !Array.isArray(custom)) {
        console.warn('Could not fetch custom templates. Using default templates only.');
        setCustomTemplates([]);
        setAllTemplates(BLOCK_TEMPLATES);
        return;
      }
      
      setCustomTemplates(custom);
      
      // Merge with default templates
      const merged: BlockTemplate[] = [
        ...BLOCK_TEMPLATES,
        ...custom.map((ct: TemplateBlocksData) => ({
          id: ct.id,
          name: ct.name,
          description: ct.description,
          category: ct.category as any,
          thumbnail: ct.thumbnail || '/placeholder-template.png',
          blocks: [], // Will be loaded on demand
          isCustom: true,
        })),
      ];
      
      setAllTemplates(merged);
    } catch (error) {
      console.warn('Error loading templates from database. Using default templates only.', error);
      // Fallback to default templates on error
      setCustomTemplates([]);
      setAllTemplates(BLOCK_TEMPLATES);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, [apolloClient]);
  
  // Load custom templates on mount
  useEffect(() => {
    refreshTemplates();
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
  
  // Save new template to database
  const handleSaveAsTemplate = React.useCallback(async (template: CreateTemplateInput) => {
    try {
      setIsSavingTemplate(true);
      
      // Check if Apollo Client is available
      if (!apolloClient || typeof apolloClient.mutate !== 'function') {
        console.warn('Apollo Client not available. Cannot save template to database.');
        alert('Template saving is currently unavailable. Please try again later.');
        return;
      }
      
      const service = new CustomTemplatesService(apolloClient as any);
      const result = await service.createTemplate(template);
      
      if (!result) {
        console.warn('Failed to save template to database.');
        alert('Failed to save template. Please try again.');
        return;
      }
      
      console.log(`Template "${template.name}" saved successfully!`);
      
      // Refresh templates list
      await refreshTemplates();
      setShowSaveTemplateDialog(false);
    } catch (error) {
      console.error('Error saving template:', error);
      alert('An error occurred while saving the template. Please try again.');
    } finally {
      setIsSavingTemplate(false);
    }
  }, [apolloClient, refreshTemplates]);
  
  // Delete template from database
  const handleDeleteCustomTemplate = React.useCallback(async (id: string) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this template?');
      if (!confirmed) return;
      
      // Check if Apollo Client is available
      if (!apolloClient || typeof apolloClient.mutate !== 'function') {
        console.warn('Apollo Client not available. Cannot delete template from database.');
        alert('Template deletion is currently unavailable. Please try again later.');
        return;
      }
      
      const service = new CustomTemplatesService(apolloClient as any);
      const success = await service.deleteTemplate(id);
      
      if (!success) {
        console.warn('Failed to delete template from database.');
        alert('Failed to delete template. Please try again.');
        return;
      }
      
      console.log('Template deleted successfully');
      
      // Refresh templates list
      await refreshTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('An error occurred while deleting the template. Please try again.');
    }
  }, [apolloClient, refreshTemplates]);
  
  // Duplicate template
  const handleDuplicateTemplate = React.useCallback(async (id: string, newName?: string) => {
    try {
      // Check if Apollo Client is available
      if (!apolloClient || typeof apolloClient.mutate !== 'function') {
        console.warn('Apollo Client not available. Cannot duplicate template.');
        alert('Template duplication is currently unavailable. Please try again later.');
        return;
      }
      
      const service = new CustomTemplatesService(apolloClient as any);
      const result = await service.duplicateTemplate(id, newName);
      
      if (!result) {
        console.warn('Failed to duplicate template.');
        alert('Failed to duplicate template. Please try again.');
        return;
      }
      
      console.log('Template duplicated successfully');
      
      // Refresh templates list
      await refreshTemplates();
    } catch (error) {
      console.error('Error duplicating template:', error);
      alert('An error occurred while duplicating the template. Please try again.');
    }
  }, [apolloClient, refreshTemplates]);
  
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
