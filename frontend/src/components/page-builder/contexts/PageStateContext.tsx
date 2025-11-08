'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { getPageById } from '@/actions/page.actions';
import { Page, PageBlock, PageStatus } from '@/types/page-builder';

/**
 * Page State Context - Manages page and blocks state
 */
interface PageStateContextType {
  // Page state
  page: Page | null;
  editingPage: Page | null;
  isNewPageMode: boolean;
  loading: boolean;
  
  // Blocks state
  blocks: PageBlock[];
  selectedBlockId: string | null;
  selectedBlock: PageBlock | null;
  
  // Drag state
  draggedBlock: PageBlock | null;
  
  // State setters
  setEditingPage: (page: Page | null) => void;
  setBlocks: (blocks: PageBlock[]) => void;
  setSelectedBlockId: (id: string | null) => void;
  setDraggedBlock: (block: PageBlock | null) => void;
  
  // Refetch function
  refetch: () => Promise<any>;
}

const PageStateContext = createContext<PageStateContextType | undefined>(undefined);

// Export the context for direct usage in components that need optional access
export { PageStateContext };

interface PageStateProviderProps {
  children: ReactNode;
  pageId?: string;
}

export function PageStateProvider({ children, pageId }: PageStateProviderProps) {
  // Page state
  const isNewPageModeBool = !pageId;
  const [isNewPageMode, setIsNewPageMode] = useState(isNewPageModeBool);
  
  // Initialize editingPage with default values for new page mode
  const [editingPage, setEditingPageState] = useState<Page | null>(
    isNewPageModeBool ? {
      id: '',
      title: 'Untitled Page',
      slug: 'untitled-page',
      content: {},
      status: PageStatus.DRAFT,
      blocks: [],
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } : null
  );
  
  // Blocks state
  const [blocks, setBlocksState] = useState<PageBlock[]>([]);
  const [selectedBlockId, setSelectedBlockIdState] = useState<string | null>(null);
  const [draggedBlock, setDraggedBlockState] = useState<PageBlock | null>(null);
  
  // Page loading state (for Server Actions)
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Memoized setters for stable references
  const setEditingPage = useCallback((page: Page | null) => {
    setEditingPageState(page);
  }, []);
  
  const setBlocks = useCallback((blocks: PageBlock[]) => {
    setBlocksState(blocks);
  }, []);
  
  const setSelectedBlockId = useCallback((id: string | null) => {
    setSelectedBlockIdState(id);
  }, []);
  
  const setDraggedBlock = useCallback((block: PageBlock | null) => {
    setDraggedBlockState(block);
  }, []);
  
  // Store current pageId in ref for stable refetch
  const pageIdRef = React.useRef(pageId);
  React.useEffect(() => {
    pageIdRef.current = pageId;
  }, [pageId]);
  
  // Fetch page when pageId changes
  useEffect(() => {
    if (pageId) {
      setIsNewPageMode(false);
      setLoading(true);
      
      // Fetch page using Server Action
      getPageById(pageId)
        .then((fetchedPage) => {
          setPage(fetchedPage as Page | null);
        })
        .catch((error) => {
          console.error('[PageStateContext] Error fetching page:', error);
          setPage(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setIsNewPageMode(true);
      setPage(null);
      setLoading(false);
    }
  }, [pageId]); // ✅ Only depend on pageId!
  
  // Stable refetch function using ref
  const stableRefetch = useCallback(async () => {
    const currentPageId = pageIdRef.current;
    if (!currentPageId) return;
    
    try {
      setLoading(true);
      const fetchedPage = await getPageById(currentPageId);
      setPage(fetchedPage as Page | null);
    } catch (error) {
      console.error('[PageStateContext] Error refetching page:', error);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Empty deps - never changes!
  
  // Initialize editing page when page loads (for existing pages)
  useEffect(() => {
    if (page && !isNewPageMode) {
      setEditingPageState(page);
    }
  }, [page, isNewPageMode]);
  
  // Initialize blocks from page
  useEffect(() => {
    if (page?.blocks) {
      setBlocksState(page.blocks as PageBlock[]);
    }
  }, [page?.blocks]);
  
  // Calculate selected block with useMemo for performance
  const selectedBlock = useMemo(() => {
    if (!selectedBlockId) return null;
    
    const findBlock = (blocks: PageBlock[]): PageBlock | null => {
      for (const block of blocks) {
        if (block.id === selectedBlockId) return block;
        if (block.children) {
          const found = findBlock(block.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findBlock(blocks);
  }, [selectedBlockId, blocks]);
  
  // Memoize context value to prevent unnecessary re-renders
  const value: PageStateContextType = useMemo(() => ({
    page: page || null,
    editingPage,
    isNewPageMode,
    loading: isNewPageMode ? false : loading, // Never show loading in new page mode
    blocks,
    selectedBlockId,
    selectedBlock,
    draggedBlock,
    setEditingPage,
    setBlocks,
    setSelectedBlockId,
    setDraggedBlock,
    refetch: stableRefetch, // Use stable version
  }), [
    page,
    editingPage,
    isNewPageMode,
    loading,
    blocks,
    selectedBlockId,
    selectedBlock,
    draggedBlock,
    setEditingPage,
    setBlocks,
    setSelectedBlockId,
    setDraggedBlock,
    stableRefetch, // This never changes!
  ]);
  
  return (
    <PageStateContext.Provider value={value}>
      {children}
    </PageStateContext.Provider>
  );
}

export function usePageState() {
  const context = useContext(PageStateContext);
  if (context === undefined) {
    // Return default values instead of throwing during SSR or initial render
    if (typeof window === 'undefined') {
      return {
        page: null,
        editingPage: null,
        isNewPageMode: true,
        loading: false,
        blocks: [],
        selectedBlockId: null,
        selectedBlock: null,
        draggedBlock: null,
        setEditingPage: () => {},
        setBlocks: () => {},
        setSelectedBlockId: () => {},
        setDraggedBlock: () => {},
        refetch: async () => {},
      } as PageStateContextType;
    }
    throw new Error(
      'usePageState must be used within a PageStateProvider. ' +
      'Make sure your component is wrapped with <PageBuilderProvider>'
    );
  }
  return context;
}
