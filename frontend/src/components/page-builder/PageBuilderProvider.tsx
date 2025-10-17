'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { DndContext, DragStartEvent, DragEndEvent, DragOverlay, closestCorners } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { usePage, usePageOperations, useBlockOperations, useNestedBlockOperations } from '@/hooks/usePageBuilder';
import { BLOCK_TEMPLATES, BlockTemplate } from '@/data/blockTemplates';
import { 
  getCustomTemplates, 
  saveCustomTemplate, 
  deleteCustomTemplate,
  CustomTemplate 
} from '@/utils/customTemplates';
import { initSampleTemplates } from '@/utils/initSampleTemplates';
import { 
  BlockType, 
  Page, 
  PageBlock, 
  PageStatus,
  CreatePageInput,
  UpdatePageInput,
  CreatePageBlockInput
} from '@/types/page-builder';

/**
 * Default content for each block type
 */
export const DEFAULT_BLOCK_CONTENT = {
  [BlockType.TEXT]: { content: 'Enter your text here...', style: {} },
  [BlockType.IMAGE]: { src: '', alt: '', style: {} },
  [BlockType.HERO]: { 
    title: 'Hero Title', 
    subtitle: 'Hero subtitle text', 
    backgroundImage: '', 
    style: {} 
  },
  [BlockType.BUTTON]: { 
    text: 'Click me', 
    link: '#', 
    variant: 'primary', 
    style: {} 
  },
  [BlockType.CAROUSEL]: {
    slides: [
      {
        id: '1',
        title: 'Slide 1',
        subtitle: 'Welcome to our carousel',
        description: 'This is the first slide',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=400&fit=crop',
        cta: { text: 'Learn More', link: '#' },
        badge: 'NEW',
        bgColor: 'bg-gradient-to-r from-blue-500 to-purple-600'
      }
    ],
    autoPlay: true,
    autoPlayInterval: 5000,
    showIndicators: true,
    showArrows: true,
    loop: true,
    style: {}
  },
  [BlockType.TEAM]: { 
    title: 'Our Team',
    members: [],
    style: {} 
  },
  [BlockType.STATS]: { 
    title: 'Our Stats',
    stats: [],
    style: {} 
  },
  [BlockType.CONTACT_INFO]: { 
    email: '',
    phone: '',
    address: '',
    style: {} 
  },
  [BlockType.DIVIDER]: { thickness: 1, color: '#e5e7eb', style: {} },
  [BlockType.SPACER]: { height: 40, style: {} },
  [BlockType.CONTAINER]: { 
    maxWidth: '1200px',
    padding: '20px',
    backgroundColor: 'transparent',
    style: {} 
  },
  [BlockType.SECTION]: { 
    backgroundColor: '#ffffff',
    padding: '40px 20px',
    style: {} 
  },
  [BlockType.GRID]: { 
    columns: 2,
    gap: '20px',
    style: {} 
  },
  [BlockType.FLEX_ROW]: { 
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '10px',
    style: {} 
  },
  [BlockType.FLEX_COLUMN]: { 
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: '10px',
    style: {} 
  },
  [BlockType.DYNAMIC]: { 
    componentType: 'custom',
    props: {},
    style: {} 
  },
};

/**
 * PageBuilder Context Type
 */
interface PageBuilderContextType {
  // Page state
  page: Page | null;
  editingPage: Page | null;
  isNewPageMode: boolean;
  loading: boolean;
  
  // Blocks state
  blocks: PageBlock[];
  draggedBlock: PageBlock | null;
  
  // UI state
  showPageSettings: boolean;
  showPreview: boolean;
  showAddChildDialog: boolean;
  addChildParentId: string | null;
  
  // Templates state
  allTemplates: BlockTemplate[];
  customTemplates: CustomTemplate[];
  selectedTemplate: BlockTemplate | null;
  templateSearchQuery: string;
  selectedTemplateCategory: string;
  showPreviewModal: boolean;
  isApplyingTemplate: boolean;
  showSaveTemplateDialog: boolean;
  isSavingTemplate: boolean;
  
  // Page operations
  setEditingPage: (page: Page | null) => void;
  handlePageSave: () => Promise<void>;
  handlePageDelete: () => Promise<void>;
  refetch: () => Promise<any>;
  
  // Block operations
  handleAddBlock: (blockType: BlockType) => Promise<void>;
  handleBlockUpdate: (blockId: string, content: any, style?: any) => Promise<void>;
  handleBlockDelete: (blockId: string) => Promise<void>;
  handleBlocksReorder: (newBlocks: PageBlock[]) => Promise<void>;
  
  // Nested block operations
  handleAddChild: (parentId: string) => void;
  handleAddChildBlock: (parentId: string, blockType: BlockType) => Promise<void>;
  handleCloseAddChildDialog: () => void;
  
  // Drag and drop
  handleDragStart: (event: any) => void;
  handleDragEnd: (event: any) => void;
  
  // UI state setters
  setShowPageSettings: (show: boolean) => void;
  setShowPreview: (show: boolean) => void;
  setDraggedBlock: (block: PageBlock | null) => void;
  
  // Template operations
  setTemplateSearchQuery: (query: string) => void;
  setSelectedTemplateCategory: (category: string) => void;
  handlePreviewTemplate: (template: BlockTemplate) => void;
  handleClosePreview: () => void;
  handleApplyTemplate: (template: BlockTemplate) => Promise<void>;
  handleSaveAsTemplate: (template: Omit<BlockTemplate, 'id' | 'thumbnail'>) => void;
  handleDeleteCustomTemplate: (id: string) => void;
  setShowSaveTemplateDialog: (show: boolean) => void;
}

/**
 * PageBuilder Context
 */
const PageBuilderContext = createContext<PageBuilderContextType | undefined>(undefined);

/**
 * PageBuilder Provider Props
 */
interface PageBuilderProviderProps {
  children: ReactNode;
  pageId?: string;
}

/**
 * PageBuilder Provider Component
 * 
 * Centralizes all PageBuilder state and logic
 */
export function PageBuilderProvider({ children, pageId }: PageBuilderProviderProps) {
  // Page state
  const [isNewPageMode, setIsNewPageMode] = useState(!pageId);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  
  // Blocks state
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<PageBlock | null>(null);
  
  // UI state
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddChildDialog, setShowAddChildDialog] = useState(false);
  const [addChildParentId, setAddChildParentId] = useState<string | null>(null);
  
  // Templates state
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<BlockTemplate | null>(null);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [allTemplates, setAllTemplates] = useState<BlockTemplate[]>(BLOCK_TEMPLATES);

  // Hooks
  const { page, loading, refetch } = usePage(pageId || '');
  const { createPage, updatePage, deletePage } = usePageOperations();
  const { addBlock, updateBlock, deleteBlock, updateBlocksOrder } = useBlockOperations(pageId || '');
  const nestedOps = useNestedBlockOperations(pageId || '');

  // Load custom templates on mount
  useEffect(() => {
    const loadCustomTemplates = () => {
      // Initialize sample templates if they don't exist
      initSampleTemplates();
      
      const custom = getCustomTemplates();
      setCustomTemplates(custom);
      setAllTemplates([...BLOCK_TEMPLATES, ...custom]);
    };
    
    loadCustomTemplates();
    
    // Listen for storage changes
    window.addEventListener('storage', loadCustomTemplates);
    return () => window.removeEventListener('storage', loadCustomTemplates);
  }, []);

  // Initialize page data
  useEffect(() => {
    if (page) {
      setEditingPage(page);
      const rootBlocks = (page.blocks || []).filter(block => !block.parentId);
      setBlocks(rootBlocks);
      setIsNewPageMode(false);
    } else if (!pageId) {
      setIsNewPageMode(true);
      setEditingPage({
        id: '',
        title: '',
        slug: '',
        content: undefined,
        status: PageStatus.DRAFT,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: [],
        blocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setBlocks([]);
    }
  }, [page, pageId]);

  // Page operations
  const handlePageSave = useCallback(async () => {
    if (!editingPage) return;

    try {
      if (isNewPageMode) {
        const input: CreatePageInput = {
          title: editingPage.title,
          slug: editingPage.slug,
          content: editingPage.content || null,
          status: editingPage.status,
          seoTitle: editingPage.seoTitle,
          seoDescription: editingPage.seoDescription,
          seoKeywords: editingPage.seoKeywords || [],
        };
        const newPage = await createPage(input);
        
        if (newPage) {
          setIsNewPageMode(false);
          window.history.replaceState(null, '', `/admin/pagebuilder?pageId=${newPage.id}`);
          await refetch();
          toast.success('Page created successfully!');
        }
      } else {
        const input: UpdatePageInput = {
          title: editingPage.title,
          slug: editingPage.slug,
          content: editingPage.content && typeof editingPage.content === 'object' ? editingPage.content : undefined,
          status: editingPage.status,
          seoTitle: editingPage.seoTitle,
          seoDescription: editingPage.seoDescription,
          seoKeywords: editingPage.seoKeywords,
        };
        await updatePage(editingPage.id, input);
        await refetch();
        toast.success('Page updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save page:', error);
      toast.error('Failed to save page');
    }
  }, [editingPage, isNewPageMode, createPage, updatePage, refetch]);

  const handlePageDelete = useCallback(async () => {
    if (!editingPage?.id) return;
    
    try {
      await deletePage(editingPage.id);
      toast.success('Page deleted successfully!');
      window.location.href = '/admin/pagebuilder';
    } catch (error) {
      console.error('Failed to delete page:', error);
      toast.error('Failed to delete page');
    }
  }, [editingPage, deletePage]);

  // Block operations
  const handleAddBlock = useCallback(async (blockType: BlockType) => {
    // For new pages, we need to save the page first if no pageId provided
    if (isNewPageMode && !pageId) {
      toast.error('Please save the page first before adding blocks');
      return;
    }

    // For existing pages or when pageId is provided, allow adding blocks
    const targetPageId = pageId || editingPage?.id;
    if (!targetPageId) {
      toast.error('Page ID required to add blocks');
      return;
    }

    const input: CreatePageBlockInput = {
      type: blockType,
      content: (DEFAULT_BLOCK_CONTENT as any)[blockType] || {},
      style: {},
      order: blocks.length,
      isVisible: true,
    };

    try {
      const newBlock = await addBlock(input);
      if (newBlock) {
        await refetch();
        toast.success('Block added successfully!');
      }
    } catch (error: any) {
      console.error('Failed to add block:', error);
      toast.error(error.message || 'Failed to add block');
    }
  }, [editingPage, isNewPageMode, blocks.length, addBlock, refetch]);

  const handleBlockUpdate = useCallback(async (blockId: string, content: any, style: any = {}) => {
    try {
      await updateBlock(blockId, { content, style });
    } catch (error) {
      console.error('Failed to update block:', error);
      toast.error('Failed to update block');
    }
  }, [updateBlock]);

  const handleBlockDelete = useCallback(async (blockId: string) => {
    try {
      await deleteBlock(blockId);
      await refetch();
      toast.success('Block deleted successfully!');
    } catch (error) {
      console.error('Failed to delete block:', error);
      toast.error('Failed to delete block');
    }
  }, [deleteBlock, refetch]);

  const handleBlocksReorder = useCallback(async (newBlocks: PageBlock[]) => {
    const blockOrderInputs = newBlocks.map((block, index) => ({
      id: block.id,
      order: index,
    }));
    try {
      await updateBlocksOrder(blockOrderInputs);
      await refetch();
    } catch (error) {
      console.error('Failed to reorder blocks:', error);
      toast.error('Failed to reorder blocks');
    }
  }, [updateBlocksOrder, refetch]);

  // Nested block operations
  const handleAddChild = useCallback((parentId: string) => {
    setAddChildParentId(parentId);
    setShowAddChildDialog(true);
  }, []);

  const handleAddChildBlock = useCallback(async (parentId: string, blockType: BlockType) => {
    try {
      // Validation logic consistent with other block addition methods
      if (isNewPageMode && !pageId) {
        toast.error('Please save the page first before adding blocks');
        return;
      }

      const targetPageId = pageId || editingPage?.id;
      if (!targetPageId) {
        toast.error('Page ID required to add blocks');
        return;
      }

      const parentBlock = page?.blocks?.find(b => b.id === parentId);
      const childrenCount = page?.blocks?.filter(b => b.parentId === parentId).length || 0;

      const input: CreatePageBlockInput = {
        type: blockType,
        content: (DEFAULT_BLOCK_CONTENT as any)[blockType] || {},
        style: {},
        order: childrenCount,
        isVisible: true,
        parentId: parentId,
        depth: (parentBlock?.depth || 0) + 1,
      };

      await addBlock(input);
      await refetch();
      setShowAddChildDialog(false);
      setAddChildParentId(null);
      toast.success('Child block added successfully!');
    } catch (error: any) {
      console.error('Failed to add child block:', error);
      toast.error(error.message || 'Failed to add child block');
    }
  }, [page, addBlock, refetch, isNewPageMode, pageId, editingPage]);

  const handleCloseAddChildDialog = useCallback(() => {
    setShowAddChildDialog(false);
    setAddChildParentId(null);
  }, []);

  // Drag and drop handlers
  const handleDragStart = useCallback((event: any) => {
    const { active } = event;
    const draggedBlock = blocks.find(block => block.id === active.id);
    setDraggedBlock(draggedBlock || null);
  }, [blocks]);

  const handleDragEnd = useCallback(async (event: any) => {
    const { active, over } = event;
    
    if (!over) {
      setDraggedBlock(null);
      return;
    }

    // Check if dragging a new block from ElementsLibrary
    if (active.data?.current?.type === 'new-block') {
      const blockType = active.data.current.blockType as BlockType;
      
      // For new pages, we need to save the page first if no pageId provided
      if (isNewPageMode && !pageId) {
        toast.error('Please save the page first before adding blocks');
        setDraggedBlock(null);
        return;
      }

      // For existing pages or when pageId is provided, allow adding blocks
      const targetPageId = pageId || editingPage?.id;
      if (!targetPageId) {
        toast.error('Page ID required to add blocks');
        setDraggedBlock(null);
        return;
      }

      // Add new block
      const input: CreatePageBlockInput = {
        type: blockType,
        content: (DEFAULT_BLOCK_CONTENT as any)[blockType] || {},
        style: {},
        order: blocks.length,
        isVisible: true,
      };

      try {
        const newBlock = await addBlock(input);
        if (newBlock) {
          await refetch();
          toast.success('Block added successfully!');
        }
      } catch (error: any) {
        console.error('Failed to add block:', error);
        toast.error(error.message || 'Failed to add block');
      }

      setDraggedBlock(null);
      return;
    }

    // Reordering existing blocks
    if (active.id === over.id) {
      setDraggedBlock(null);
      return;
    }

    const oldIndex = blocks.findIndex(block => block.id === active.id);
    const newIndex = blocks.findIndex(block => block.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      setBlocks(newBlocks);
      await handleBlocksReorder(newBlocks);
    }

    setDraggedBlock(null);
  }, [blocks, handleBlocksReorder, editingPage, isNewPageMode, addBlock, refetch]);

  // Template operations
  const handlePreviewTemplate = useCallback((template: BlockTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreviewModal(false);
    setSelectedTemplate(null);
  }, []);

  const handleApplyTemplate = useCallback(async (template: BlockTemplate) => {
    if (!editingPage?.id && isNewPageMode) {
      toast.error('Please save the page first before applying templates');
      return;
    }

    setIsApplyingTemplate(true);

    try {
      for (let i = 0; i < template.blocks.length; i++) {
        const blockData = template.blocks[i];
        const input: CreatePageBlockInput = {
          type: blockData.type,
          content: blockData.content,
          style: blockData.style || {},
          order: blocks.length + i,
          isVisible: true,
        };
        await addBlock(input);
      }

      await refetch();
      setShowPreviewModal(false);
      setSelectedTemplate(null);
      toast.success(`Template "${template.name}" applied successfully!`);
    } catch (error) {
      console.error('Failed to apply template:', error);
      toast.error('Failed to apply template');
    } finally {
      setIsApplyingTemplate(false);
    }
  }, [editingPage, isNewPageMode, blocks.length, addBlock, refetch]);

  const handleSaveAsTemplate = useCallback((template: Omit<BlockTemplate, 'id' | 'thumbnail'>) => {
    setIsSavingTemplate(true);
    
    try {
      const savedTemplate = saveCustomTemplate(template);
      
      // Reload templates
      const custom = getCustomTemplates();
      setCustomTemplates(custom);
      setAllTemplates([...BLOCK_TEMPLATES, ...custom]);
      
      setShowSaveTemplateDialog(false);
      toast.success(`Template "${savedTemplate.name}" saved successfully!`);
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('Failed to save template');
    } finally {
      setIsSavingTemplate(false);
    }
  }, []);

  const handleDeleteCustomTemplate = useCallback((id: string) => {
    try {
      deleteCustomTemplate(id);
      
      // Reload templates
      const custom = getCustomTemplates();
      setCustomTemplates(custom);
      setAllTemplates([...BLOCK_TEMPLATES, ...custom]);
      
      toast.success('Template deleted successfully!');
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast.error('Failed to delete template');
    }
  }, []);

  const value: PageBuilderContextType = {
    // Page state
    page: page || null,
    editingPage,
    isNewPageMode,
    loading,
    
    // Blocks state
    blocks,
    draggedBlock,
    
    // UI state
    showPageSettings,
    showPreview,
    showAddChildDialog,
    addChildParentId,
    
    // Templates state
    allTemplates,
    customTemplates,
    selectedTemplate,
    templateSearchQuery,
    selectedTemplateCategory,
    showPreviewModal,
    isApplyingTemplate,
    showSaveTemplateDialog,
    isSavingTemplate,
    
    // Page operations
    setEditingPage,
    handlePageSave,
    handlePageDelete,
    refetch,
    
    // Block operations
    handleAddBlock,
    handleBlockUpdate,
    handleBlockDelete,
    handleBlocksReorder,
    
    // Nested block operations
    handleAddChild,
    handleAddChildBlock,
    handleCloseAddChildDialog,
    
    // Drag and drop
    handleDragStart,
    handleDragEnd,
    
    // UI state setters
    setShowPageSettings,
    setShowPreview,
    setDraggedBlock,
    
    // Template operations
    setTemplateSearchQuery,
    setSelectedTemplateCategory,
    handlePreviewTemplate,
    handleClosePreview,
    handleApplyTemplate,
    handleSaveAsTemplate,
    handleDeleteCustomTemplate,
    setShowSaveTemplateDialog,
  };

  return (
    <PageBuilderContext.Provider value={value}>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {children}
        
        {/* Drag Overlay - Visual feedback during drag */}
        <DragOverlay>
          {draggedBlock && (
            <Card className="p-4 opacity-90 transform rotate-2 shadow-lg">
              <div className="flex items-center space-x-2">
                <GripVertical size={16} className="text-gray-400" />
                <span className="font-medium">{draggedBlock.type} Block</span>
              </div>
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </PageBuilderContext.Provider>
  );
}

/**
 * Hook to use PageBuilder context
 */
export function usePageBuilderContext() {
  const context = useContext(PageBuilderContext);
  if (!context) {
    throw new Error('usePageBuilderContext must be used within PageBuilderProvider');
  }
  return context;
}
