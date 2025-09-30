import { useMutation, useQuery } from '@apollo/client';
import { 
  GET_PAGES, 
  GET_PAGE_BY_ID, 
  CREATE_PAGE, 
  UPDATE_PAGE, 
  DELETE_PAGE,
  ADD_PAGE_BLOCK,
  UPDATE_PAGE_BLOCK,
  DELETE_PAGE_BLOCK,
  UPDATE_PAGE_BLOCKS_ORDER
} from '@/graphql/queries/pages';
import { 
  Page, 
  PaginatedPages, 
  CreatePageInput, 
  UpdatePageInput,
  CreatePageBlockInput,
  UpdatePageBlockInput,
  BulkUpdateBlockOrderInput,
  PageFiltersInput
} from '@/types/page-builder';
import { PaginationInput } from '@/types/common';
import { toast } from 'react-hot-toast';

// Hook for managing pages
export const usePages = (pagination?: PaginationInput, filters?: PageFiltersInput) => {
  const { data, loading, error, refetch } = useQuery<{ getPages: PaginatedPages }>(GET_PAGES, {
    variables: { pagination, filters },
    errorPolicy: 'all'
  });

  return {
    pages: data?.getPages,
    loading,
    error,
    refetch
  };
};

// Hook for managing a single page
export const usePage = (id: string) => {
  const { data, loading, error, refetch } = useQuery<{ getPageById: Page }>(GET_PAGE_BY_ID, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all'
  });

  return {
    page: data?.getPageById,
    loading,
    error,
    refetch
  };
};

// Hook for page operations
export const usePageOperations = () => {
  const [createPage] = useMutation(CREATE_PAGE);
  const [updatePage] = useMutation(UPDATE_PAGE);
  const [deletePage] = useMutation(DELETE_PAGE);

  const handleCreatePage = async (input: CreatePageInput) => {
    try {
      console.log('Creating new page:', input);
      const { data } = await createPage({
        variables: { input },
        refetchQueries: [GET_PAGES]
      });
      toast.success('Page created successfully!');
      return data?.createPage;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create page');
      throw error;
    }
  };

  const handleUpdatePage = async (id: string, input: UpdatePageInput) => {
    try {
      const { data } = await updatePage({
        variables: { id, input },
        refetchQueries: [GET_PAGES]
      });
      toast.success('Page updated successfully!');
      return data?.updatePage;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update page');
      throw error;
    }
  };

  const handleDeletePage = async (id: string) => {
    try {
      await deletePage({
        variables: { id },
        refetchQueries: [GET_PAGES]
      });
      toast.success('Page deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete page');
      throw error;
    }
  };

  return {
    createPage: handleCreatePage,
    updatePage: handleUpdatePage,
    deletePage: handleDeletePage
  };
};

// Hook for block operations
export const useBlockOperations = (pageId: string) => {
  const [addBlock] = useMutation(ADD_PAGE_BLOCK);
  const [updateBlock] = useMutation(UPDATE_PAGE_BLOCK);
  const [deleteBlock] = useMutation(DELETE_PAGE_BLOCK);
  const [updateBlocksOrder] = useMutation(UPDATE_PAGE_BLOCKS_ORDER);

  const handleAddBlock = async (input: CreatePageBlockInput) => {
    try {
      const { data } = await addBlock({
        variables: { pageId, input },
        refetchQueries: [{ query: GET_PAGE_BY_ID, variables: { id: pageId } }]
      });
      toast.success('Block added successfully!');
      return data?.addPageBlock;
    } catch (error: any) {
      toast.error(error.message || 'Failed to add block');
      throw error;
    }
  };

  const handleUpdateBlock = async (id: string, input: UpdatePageBlockInput) => {
    try {
      const { data } = await updateBlock({
        variables: { id, input },
        refetchQueries: [{ query: GET_PAGE_BY_ID, variables: { id: pageId } }]
      });
      toast.success('Block updated successfully!');
      return data?.updatePageBlock;
    } catch (error: any) {
      toast.error(error.message || 'Failed to update block');
      throw error;
    }
  };

  const handleDeleteBlock = async (id: string) => {
    try {
      await deleteBlock({
        variables: { id },
        refetchQueries: [{ query: GET_PAGE_BY_ID, variables: { id: pageId } }]
      });
      toast.success('Block deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete block');
      throw error;
    }
  };

  const handleUpdateBlocksOrder = async (updates: BulkUpdateBlockOrderInput[]) => {
    try {
      await updateBlocksOrder({
        variables: { pageId, updates },
        refetchQueries: [{ query: GET_PAGE_BY_ID, variables: { id: pageId } }]
      });
      // Don't show toast for drag operations as they happen frequently
    } catch (error: any) {
      toast.error(error.message || 'Failed to reorder blocks');
      throw error;
    }
  };

  return {
    addBlock: handleAddBlock,
    updateBlock: handleUpdateBlock,
    deleteBlock: handleDeleteBlock,
    updateBlocksOrder: handleUpdateBlocksOrder
  };
};