'use client';

import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';
import { usePageOperations, useBlockOperations, useNestedBlockOperations } from '@/hooks/usePageBuilder';
import { BlockType, PageBlock, CreatePageInput, UpdatePageInput } from '@/types/page-builder';
import { pageBuilderLogger, LOG_OPERATIONS } from '../utils/pageBuilderLogger';
import { usePageState } from './PageStateContext';
import { useTemplate } from './TemplateContext';
import { useUIState } from './UIStateContext';
import { BlockTemplate } from '@/data/blockTemplates';

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
  [BlockType.TEAM]: { title: 'Our Team', members: [], style: {} },
  [BlockType.STATS]: { title: 'Our Stats', stats: [], style: {} },
  [BlockType.CONTACT_INFO]: { email: '', phone: '', address: '', style: {} },
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
  [BlockType.GRID]: { columns: 2, gap: '20px', style: {} },
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
    componentType: 'template',
    templateId: null,
    templateName: 'Dynamic Content',
    template: '<div class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center"><h3 class="text-lg font-semibold mb-2">Dynamic Block</h3><p class="text-gray-600">Select a template from the Templates tab to add dynamic content with database integration.</p></div>',
    dataSource: { type: 'static', data: {} },
    variables: {},
    style: {} 
  },
  [BlockType.PRODUCT_LIST]: {
    title: 'Sản phẩm nổi bật',
    subtitle: 'Khám phá các sản phẩm chất lượng cao',
    limit: 12,
    filters: { isFeatured: true },
    layout: 'grid',
    columns: 3,
    showPrice: true,
    showCategory: true,
    showDescription: false,
    showAddToCart: true,
    cardVariant: 'default',
    style: {}
  },
  [BlockType.PRODUCT_DETAIL]: {
    productSlug: '',
    showGallery: true,
    showDescription: true,
    showSpecs: true,
    showReviews: false,
    showRelated: false,
    layout: 'default',
    style: {}
  },
  [BlockType.VIDEO]: { url: '', title: '', autoplay: false, controls: true, muted: false, loop: false, style: {} },
} as const;

/**
 * Page Actions Context - Manages all CRUD operations
 */
interface PageActionsContextType {
  // Page operations
  handlePageSave: () => Promise<void>;
  handlePageDelete: () => Promise<void>;
  
  // Block operations
  handleAddBlock: (blockType: BlockType) => Promise<void>;
  handleAddTemplateBlock: (templateConfig: {
    templateId: string;
    templateName: string;
    template: string;
    dataSource: any;
    variables: any;
  }) => Promise<void>;
  handleBlockUpdate: (blockId: string, content: any, style?: any) => Promise<void>;
  handleBlockDelete: (blockId: string) => Promise<void>;
  handleBlocksReorder: (newBlocks: PageBlock[]) => Promise<void>;
  handleSelectBlock: (blockId: string | null) => void;
  handleUpdateBlockStyle: (blockId: string, style: any) => Promise<void>;
  
  // Nested block operations
  handleAddChild: (parentId: string) => void;
  handleAddChildBlock: (parentId: string, blockType: BlockType) => Promise<void>;
  handleCloseAddChildDialog: () => void;
  
  // Template operations
  handleApplyTemplate: (template: BlockTemplate) => Promise<void>;
  
  // Drag and drop
  handleDragStart: (event: any) => void;
  handleDragEnd: (event: any) => Promise<void>;
}

const PageActionsContext = createContext<PageActionsContextType | undefined>(undefined);

interface PageActionsProviderProps {
  children: ReactNode;
  pageId?: string;
}

export function PageActionsProvider({ children, pageId }: PageActionsProviderProps) {
  const pageState = usePageState();
  const templateState = useTemplate();
  const uiState = useUIState();
  
  const { createPage, updatePage, deletePage } = usePageOperations();
  const { addBlock, updateBlock, deleteBlock, updateBlocksOrder } = useBlockOperations(pageId || '');
  const nestedOps = useNestedBlockOperations(pageId || '');
  
  // Page operations
  const handlePageSave = useCallback(async () => {
    try {
      const { editingPage, isNewPageMode, blocks, refetch, setEditingPage } = pageState;
      
      if (!editingPage) {
        toast.error('No page to save');
        return;
      }
      
      if (isNewPageMode) {
        const input: CreatePageInput = {
          title: editingPage.title,
          slug: editingPage.slug,
          content: editingPage.content || '',
          status: editingPage.status,
          seoTitle: editingPage.seoTitle,
          seoDescription: editingPage.seoDescription,
          seoKeywords: editingPage.seoKeywords || [],
        };
        
        const result = await createPage(input);
        pageBuilderLogger.success(LOG_OPERATIONS.PAGE_CREATE, 'Page created successfully', result);
        toast.success('Page created successfully!');
        
        if (result?.data?.createPage) {
          setEditingPage(result.data.createPage);
        }
      } else {
        const input: UpdatePageInput = {
          title: editingPage.title,
          slug: editingPage.slug,
          content: editingPage.content || '',
          status: editingPage.status,
          seoTitle: editingPage.seoTitle,
          seoDescription: editingPage.seoDescription,
          seoKeywords: editingPage.seoKeywords || [],
        };
        
        await updatePage(editingPage.id, input);
        pageBuilderLogger.success(LOG_OPERATIONS.PAGE_UPDATE, 'Page updated successfully', { pageId: editingPage.id });
        toast.success('Page saved successfully!');
      }
      
      await refetch();
    } catch (error: any) {
      pageBuilderLogger.error(LOG_OPERATIONS.PAGE_UPDATE, 'Failed to save page', { error });
      toast.error(error?.message || 'Failed to save page');
    }
  }, [pageState, createPage, updatePage]);
  
  const handlePageDelete = useCallback(async () => {
    try {
      const { page } = pageState;
      if (!page?.id) return;
      
      await deletePage(page.id);
      pageBuilderLogger.success(LOG_OPERATIONS.PAGE_DELETE, 'Page deleted', { pageId: page.id });
      toast.success('Page deleted successfully!');
    } catch (error: any) {
      pageBuilderLogger.error(LOG_OPERATIONS.PAGE_DELETE, 'Failed to delete page', { error });
      toast.error(error?.message || 'Failed to delete page');
    }
  }, [pageState, deletePage]);
  
  // Block operations
  const handleAddBlock = useCallback(async (blockType: BlockType) => {
    try {
      const { page, blocks, setBlocks, refetch } = pageState;
      
      if (!page?.id) {
        toast.error('Please create a page first');
        return;
      }
      
      const defaultContent = DEFAULT_BLOCK_CONTENT[blockType as keyof typeof DEFAULT_BLOCK_CONTENT] || {};
      
      const input = {
        type: blockType,
        content: defaultContent,
        order: blocks.length,
      };
      
      await addBlock(input);
      pageBuilderLogger.success(LOG_OPERATIONS.BLOCK_CREATE, 'Block added', { blockType });
      toast.success('Block added successfully!');
      await refetch();
    } catch (error: any) {
      pageBuilderLogger.error(LOG_OPERATIONS.BLOCK_CREATE, 'Failed to add block', { error });
      toast.error(error?.message || 'Failed to add block');
    }
  }, [pageState, addBlock]);
  
  const handleAddTemplateBlock = useCallback(async (templateConfig: any) => {
    try {
      const { page, blocks, refetch } = pageState;
      
      if (!page?.id) {
        toast.error('Please create a page first');
        return;
      }
      
      const input = {
        type: BlockType.DYNAMIC,
        content: {
          ...DEFAULT_BLOCK_CONTENT[BlockType.DYNAMIC],
          ...templateConfig,
        },
        order: blocks.length,
      };
      
      await addBlock(input);
      pageBuilderLogger.success(LOG_OPERATIONS.BLOCK_CREATE, 'Template block added', templateConfig);
      toast.success('Template block added!');
      await refetch();
    } catch (error: any) {
      pageBuilderLogger.error(LOG_OPERATIONS.BLOCK_CREATE, 'Failed to add template block', { error });
      toast.error(error?.message || 'Failed to add template block');
    }
  }, [pageState, addBlock]);
  
  const handleBlockUpdate = useCallback(async (blockId: string, content: any, style?: any) => {
    try {
      const input: any = { content };
      if (style !== undefined) {
        input.style = style;
      }
      await updateBlock(blockId, input);
      pageBuilderLogger.debug(LOG_OPERATIONS.BLOCK_UPDATE, 'Block updated', { blockId, content, style });
      await pageState.refetch();
    } catch (error: any) {
      pageBuilderLogger.error(LOG_OPERATIONS.BLOCK_UPDATE, 'Failed to update block', { error });
      toast.error(error?.message || 'Failed to update block');
    }
  }, [updateBlock, pageState]);
  
  const handleBlockDelete = useCallback(async (blockId: string) => {
    try {
      await deleteBlock(blockId);
      pageBuilderLogger.success(LOG_OPERATIONS.BLOCK_DELETE, 'Block deleted', { blockId });
      toast.success('Block deleted!');
      await pageState.refetch();
    } catch (error: any) {
      pageBuilderLogger.error(LOG_OPERATIONS.BLOCK_DELETE, 'Failed to delete block', { error });
      toast.error(error?.message || 'Failed to delete block');
    }
  }, [deleteBlock, pageState]);
  
  const handleBlocksReorder = useCallback(async (newBlocks: PageBlock[]) => {
    try {
      const { page, setBlocks, refetch } = pageState;
      
      if (!page?.id) return;
      
      setBlocks(newBlocks);
      
      const updates = newBlocks.map((b, index) => ({
        id: b.id,
        order: index,
      }));
      await updateBlocksOrder(updates);
      
      pageBuilderLogger.debug(LOG_OPERATIONS.BLOCK_REORDER, 'Blocks reordered', { count: newBlocks.length });
      await refetch();
    } catch (error: any) {
      pageBuilderLogger.error(LOG_OPERATIONS.BLOCK_REORDER, 'Failed to reorder blocks', { error });
      toast.error('Failed to reorder blocks');
    }
  }, [pageState, updateBlocksOrder]);
  
  const handleSelectBlock = useCallback((blockId: string | null) => {
    pageState.setSelectedBlockId(blockId);
  }, [pageState]);
  
  const handleUpdateBlockStyle = useCallback(async (blockId: string, style: any) => {
    try {
      const { refetch } = pageState;
      
      const input: any = { style };
      await updateBlock(blockId, input);
      pageBuilderLogger.debug(LOG_OPERATIONS.BLOCK_STYLE_UPDATE, 'Block style updated', { blockId, style });
      await refetch();
    } catch (error: any) {
      pageBuilderLogger.error(LOG_OPERATIONS.BLOCK_STYLE_UPDATE, 'Failed to update style', { error });
      toast.error('Failed to update style');
    }
  }, [pageState, updateBlock]);
  
  // Nested block operations
  const handleAddChild = useCallback((parentId: string) => {
    uiState.setAddChildParentId(parentId);
    uiState.setShowAddChildDialog(true);
  }, [uiState]);
  
  const handleAddChildBlock = useCallback(async (parentId: string, blockType: BlockType) => {
    try {
      const { refetch } = pageState;
      
      const defaultContent = DEFAULT_BLOCK_CONTENT[blockType as keyof typeof DEFAULT_BLOCK_CONTENT] || {};
      
      await nestedOps.addChildBlock(
        parentId,
        blockType,
        defaultContent,
        {}
      );
      
      pageBuilderLogger.success(LOG_OPERATIONS.BLOCK_CREATE, 'Child block added', { parentId, blockType });
      toast.success('Child block added!');
      
      uiState.setShowAddChildDialog(false);
      uiState.setAddChildParentId(null);
      
      await refetch();
    } catch (error: any) {
      pageBuilderLogger.error(LOG_OPERATIONS.BLOCK_CREATE, 'Failed to add child block', { error });
      toast.error('Failed to add child block');
    }
  }, [pageState, uiState, nestedOps]);
  
  const handleCloseAddChildDialog = useCallback(() => {
    uiState.setShowAddChildDialog(false);
    uiState.setAddChildParentId(null);
  }, [uiState]);
  
  // Template operations
  const handleApplyTemplate = useCallback(async (template: BlockTemplate) => {
    try {
      const { page, editingPage, isNewPageMode, refetch } = pageState;
      const { setIsApplyingTemplate, setShowPreviewModal } = templateState;
      
      if (!editingPage?.id && !isNewPageMode) {
        toast.error('Please create a page first');
        return;
      }
      
      setIsApplyingTemplate(true);
      
      const currentPageId = page?.id || editingPage?.id;
      if (!currentPageId) {
        toast.error('Page ID not found');
        return;
      }
      
      for (const block of template.blocks) {
        await addBlock({
          type: block.type,
          content: block.content,
          order: block.order,
        });
      }
      
      pageBuilderLogger.success(LOG_OPERATIONS.TEMPLATE_APPLY, 'Template applied', { templateId: template.id });
      toast.success(`Template "${template.name}" applied!`);
      
      setShowPreviewModal(false);
      await refetch();
    } catch (error: any) {
      pageBuilderLogger.error(LOG_OPERATIONS.TEMPLATE_APPLY, 'Failed to apply template', { error });
      toast.error('Failed to apply template');
    } finally {
      templateState.setIsApplyingTemplate(false);
    }
  }, [pageState, templateState, addBlock]);
  
  // Drag and drop
  const handleDragStart = useCallback((event: any) => {
    const { active } = event;
    
    // Debug: Log the entire active object structure
    console.log('[PageBuilder] handleDragStart full active object:', active);
    console.log('[PageBuilder] handleDragStart active.data:', active.data);
    
    const dragType = active.data?.type;
    const blockType = active.data?.blockType;
    
    console.log('[PageBuilder] Drag started:', {
      activeId: active.id,
      activeType: dragType,
      activeBlockType: blockType,
      fullData: active.data,
    });
    
    // Handle existing block drag
    if (dragType !== 'new-block') {
      const draggedBlock = pageState.blocks.find(b => b.id === active.id);
      if (draggedBlock) {
        pageState.setDraggedBlock(draggedBlock);
      }
    }
    // For new blocks from LeftPanel, no need to set draggedBlock
  }, [pageState]);
  
  const handleDragEnd = useCallback(async (event: any) => {
    const { active, over } = event;
    
    // Debug: Log full event structure
    console.log('[PageBuilder] handleDragEnd full event:', event);
    console.log('[PageBuilder] handleDragEnd active:', active);
    console.log('[PageBuilder] handleDragEnd over:', over);
    
    const dragType = active.data?.type;
    const blockType = active.data?.blockType;
    
    console.log('[PageBuilder] Drag ended:', {
      activeId: active.id,
      activeType: dragType,
      activeBlockType: blockType,
      overId: over?.id,
      overType: over?.data?.type,
    });
    
    pageState.setDraggedBlock(null);
    
    if (!over) {
      console.warn('[PageBuilder] No drop target');
      return;
    }
    
    // Handle new block from LeftPanel
    // Check if the draggable ID starts with 'element-' which indicates a library element
    const isLibraryElement = active.id?.toString().startsWith('element-');
    
    if (isLibraryElement || dragType === 'new-block') {
      // Extract BlockType from active.id if data is missing
      // Format: 'element-TEXT', 'element-CAROUSEL', etc.
      let blockTypeValue = blockType;
      
      if (!blockTypeValue && isLibraryElement) {
        const typeStr = active.id.replace('element-', '');
        // Try to find the BlockType enum value by name
        blockTypeValue = (BlockType as any)[typeStr];
        console.log('[PageBuilder] Extracted BlockType from ID:', { typeStr, blockTypeValue });
      }
      
      console.log('[PageBuilder] New block detected:', { blockTypeValue, targetId: over.id, dragType, isLibraryElement });
      
      // Only accept drop on canvas-droppable
      if (blockTypeValue !== undefined && over.id === 'canvas-droppable') {
        console.log('[PageBuilder] Adding new block:', blockTypeValue);
        await handleAddBlock(blockTypeValue);
      } else {
        console.warn('[PageBuilder] New block rejected:', { 
          reason: over.id !== 'canvas-droppable' ? 'wrong-target' : 'no-blocktype',
          targetId: over.id,
          blockTypeValue,
          isDefined: blockTypeValue !== undefined,
        });
      }
      return;
    }
    
    // Handle existing block reorder
    if (active.id === over.id) {
      console.log('[PageBuilder] Same block, no reorder');
      return;
    }
    
    const { blocks } = pageState;
    const oldIndex = blocks.findIndex(b => b.id === active.id);
    const newIndex = blocks.findIndex(b => b.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) {
      console.warn('[PageBuilder] Invalid block indices:', { oldIndex, newIndex });
      return;
    }
    
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(oldIndex, 1);
    newBlocks.splice(newIndex, 0, movedBlock);
    
    handleBlocksReorder(newBlocks);
  }, [pageState, handleBlocksReorder, handleAddBlock]);
  
  const value: PageActionsContextType = {
    handlePageSave,
    handlePageDelete,
    handleAddBlock,
    handleAddTemplateBlock,
    handleBlockUpdate,
    handleBlockDelete,
    handleBlocksReorder,
    handleSelectBlock,
    handleUpdateBlockStyle,
    handleAddChild,
    handleAddChildBlock,
    handleCloseAddChildDialog,
    handleApplyTemplate,
    handleDragStart,
    handleDragEnd,
  };
  
  return (
    <PageActionsContext.Provider value={value}>
      {children}
    </PageActionsContext.Provider>
  );
}

export function usePageActions() {
  const context = useContext(PageActionsContext);
  if (context === undefined) {
    throw new Error('usePageActions must be used within a PageActionsProvider');
  }
  return context;
}
