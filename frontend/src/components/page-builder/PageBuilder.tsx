'use client';

import { useState, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Save, 
  Eye, 
  Settings, 
  Trash2,
  GripVertical,
  Layout,
  Type,
  Image,
  Square,
  Minus,
  Space,
  Users,
  TrendingUp,
  Phone,
  Box,
  Columns,
  Grid3x3,
  ArrowRightLeft,
  ArrowUpDown,
  Code
} from 'lucide-react';
import { toast } from 'sonner';

import { SortableBlock } from '@/components/page-builder/SortableBlock';
import { BlockRenderer } from '@/components/page-builder/blocks/BlockRenderer';
import { TemplatePreviewModal } from '@/components/page-builder/TemplatePreviewModal';
import { SaveTemplateDialog } from '@/components/page-builder/SaveTemplateDialog';
import { usePage, usePageOperations, useBlockOperations, useNestedBlockOperations } from '@/hooks/usePageBuilder';
import { BLOCK_TEMPLATES, BlockTemplate } from '@/data/blockTemplates';
import { 
  getCustomTemplates, 
  saveCustomTemplate, 
  deleteCustomTemplate,
  CustomTemplate 
} from '@/utils/customTemplates';
import { 
  BlockType, 
  Page, 
  PageBlock, 
  PageStatus,
  CreatePageInput,
  UpdatePageInput,
  CreatePageBlockInput
} from '@/types/page-builder';

interface PageBuilderProps {
  pageId?: string;
}

const BLOCK_TYPES = [
  // Content Blocks
  { type: BlockType.TEXT, label: 'Text Block', icon: Type, color: 'bg-blue-100 text-blue-600' },
  { type: BlockType.IMAGE, label: 'Image Block', icon: Image, color: 'bg-green-100 text-green-600' },
  { type: BlockType.HERO, label: 'Hero Section', icon: Layout, color: 'bg-purple-100 text-purple-600' },
  { type: BlockType.BUTTON, label: 'Button', icon: Square, color: 'bg-orange-100 text-orange-600' },
  { type: BlockType.TEAM, label: 'Team Section', icon: Users, color: 'bg-indigo-100 text-indigo-600' },
  { type: BlockType.STATS, label: 'Stats Section', icon: TrendingUp, color: 'bg-emerald-100 text-emerald-600' },
  { type: BlockType.CONTACT_INFO, label: 'Contact Info', icon: Phone, color: 'bg-cyan-100 text-cyan-600' },
  { type: BlockType.DIVIDER, label: 'Divider', icon: Minus, color: 'bg-gray-100 text-gray-600' },
  { type: BlockType.SPACER, label: 'Spacer', icon: Space, color: 'bg-yellow-100 text-yellow-600' },
  
  // Container/Layout Blocks
  { type: BlockType.CONTAINER, label: 'Container', icon: Box, color: 'bg-violet-100 text-violet-600' },
  { type: BlockType.SECTION, label: 'Section', icon: Columns, color: 'bg-fuchsia-100 text-fuchsia-600' },
  { type: BlockType.GRID, label: 'Grid Layout', icon: Grid3x3, color: 'bg-pink-100 text-pink-600' },
  { type: BlockType.FLEX_ROW, label: 'Flex Row', icon: ArrowRightLeft, color: 'bg-rose-100 text-rose-600' },
  { type: BlockType.FLEX_COLUMN, label: 'Flex Column', icon: ArrowUpDown, color: 'bg-amber-100 text-amber-600' },
  
  // Dynamic Block
  { type: BlockType.DYNAMIC, label: 'Dynamic Block', icon: Code, color: 'bg-purple-100 text-purple-600' },
];

const DEFAULT_BLOCK_CONTENT = {
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
    href: '#', 
    variant: 'primary', 
    style: {} 
  },
  [BlockType.TEAM]: {
    title: 'Our Team',
    subtitle: 'Meet the amazing people behind our success',
    members: [
      {
        name: 'John Doe',
        position: 'CEO & Founder',
        bio: 'Passionate about creating innovative solutions.',
        image: '',
        social: {}
      }
    ],
    layout: 'grid',
    columns: 3,
    style: {}
  },
  [BlockType.STATS]: {
    title: 'Our Achievements',
    subtitle: 'Numbers that speak for themselves',
    stats: [
      { value: '100+', label: 'Happy Customers', description: '', icon: 'users' },
      { value: '50+', label: 'Projects Completed', description: '', icon: 'target' },
      { value: '5+', label: 'Years Experience', description: '', icon: 'star' }
    ],
    layout: 'grid',
    animated: true,
    style: {}
  },
  [BlockType.CONTACT_INFO]: {
    title: 'Contact Us',
    subtitle: 'Get in touch with us',
    contacts: [
      { type: 'address', label: 'Address', value: '123 Main St, City, Country', icon: 'address' },
      { type: 'phone', label: 'Phone', value: '+1 (555) 123-4567', icon: 'phone' },
      { type: 'email', label: 'Email', value: 'contact@example.com', icon: 'email' }
    ],
    showMap: false,
    mapEmbedUrl: '',
    style: {}
  },
  [BlockType.DIVIDER]: { style: {} },
  [BlockType.SPACER]: { height: 40, style: {} },
  
  // Container/Layout Blocks
  [BlockType.CONTAINER]: {
    layout: 'stack',
    gap: 16,
    padding: 16,
    backgroundColor: 'transparent',
    maxWidth: '100%',
    alignment: 'left',
    style: {}
  },
  [BlockType.SECTION]: {
    fullWidth: false,
    containerWidth: 'lg',
    backgroundColor: 'transparent',
    padding: { top: 60, bottom: 60 },
    style: {}
  },
  [BlockType.GRID]: {
    columns: 3,
    gap: 16,
    responsive: { sm: 1, md: 2, lg: 3 },
    style: {}
  },
  [BlockType.FLEX_ROW]: {
    direction: 'row',
    justifyContent: 'start',
    alignItems: 'start',
    wrap: false,
    gap: 16,
    style: {}
  },
  [BlockType.FLEX_COLUMN]: {
    direction: 'column',
    justifyContent: 'start',
    alignItems: 'start',
    wrap: false,
    gap: 16,
    style: {}
  },
  
  // Dynamic Block
  [BlockType.DYNAMIC]: {
    templateName: 'default',
    dataSource: {
      type: 'static',
      staticData: { message: 'Configure data source in settings' }
    },
    style: {}
  },
};

export default function PageBuilder({ pageId }: PageBuilderProps) {
  const [isNewPageMode, setIsNewPageMode] = useState(!pageId);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<PageBlock | null>(null);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [addChildParentId, setAddChildParentId] = useState<string | null>(null);
  const [showAddChildDialog, setShowAddChildDialog] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<string>('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<BlockTemplate | null>(null);
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [allTemplates, setAllTemplates] = useState<BlockTemplate[]>(BLOCK_TEMPLATES);

  const { page, loading, refetch } = usePage(pageId || '');
  const { createPage, updatePage, deletePage } = usePageOperations();
  const { addBlock, updateBlock, deleteBlock, updateBlocksOrder } = useBlockOperations(pageId || '');
  const nestedOps = useNestedBlockOperations(pageId || '');

  // Load custom templates on mount
  useEffect(() => {
    const loadCustomTemplates = () => {
      const custom = getCustomTemplates();
      setCustomTemplates(custom);
      setAllTemplates([...BLOCK_TEMPLATES, ...custom]);
    };
    
    loadCustomTemplates();
    
    // Listen for storage changes (in case templates are modified in another tab)
    window.addEventListener('storage', loadCustomTemplates);
    return () => window.removeEventListener('storage', loadCustomTemplates);
  }, []);

  // Initialize data
  useEffect(() => {
    if (page) {
      setEditingPage(page);
      // Only show root level blocks (parentId = null or undefined)
      // Children will be rendered recursively by BlockRenderer
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

  const handlePageSave = async () => {
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
        console.log('Created new page:', newPage);
        
        if (newPage) {
          setIsNewPageMode(false);
          window.history.replaceState(null, '', `/admin/pagebuilder?pageId=${newPage.id}`);
          await refetch();
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
      }
    } catch (error) {
      console.error('Failed to save page:', error);
    }
  };

  const handleAddBlock = async (blockType: BlockType) => {
    if (!editingPage?.id && isNewPageMode) {
      toast.error('Please save the page first before adding blocks');
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
  };

  const handleBlockUpdate = async (blockId: string, content: any, style: any = {}) => {
    try {
      await updateBlock(blockId, { content, style });
    } catch (error) {
      console.error('Failed to update block:', error);
    }
  };

  const handleBlockDelete = async (blockId: string) => {
    try {
      await deleteBlock(blockId);
      await refetch();
    } catch (error) {
      console.error('Failed to delete block:', error);
    }
  };

  const handleAddChild = (parentId: string) => {
    if (!editingPage?.id && isNewPageMode) {
      toast.error('Please save the page first before adding blocks');
      return;
    }
    setAddChildParentId(parentId);
    setShowAddChildDialog(true);
  };

  const handleAddChildBlock = async (blockType: BlockType) => {
    if (!addChildParentId) return;

    try {
      const content = (DEFAULT_BLOCK_CONTENT as any)[blockType] || {};
      await nestedOps.addChildBlock(addChildParentId, blockType, content, {});
      setShowAddChildDialog(false);
      setAddChildParentId(null);
      toast.success('Child block added successfully!');
    } catch (error: any) {
      console.error('Failed to add child block:', error);
      toast.error(error.message || 'Failed to add child block');
    }
  };

  const handleApplyTemplate = async (template: BlockTemplate) => {
    if (!editingPage?.id && isNewPageMode) {
      toast.error('Please save the page first before applying templates');
      return;
    }

    setIsApplyingTemplate(true);

    try {
      // Recursively create all blocks from template
      for (const blockDef of template.blocks) {
        await createBlockFromTemplate(blockDef, null, blocks.length);
      }
      
      // Refetch page to get updated blocks
      await refetch();
      
      toast.success(`Template "${template.name}" applied successfully!`);
      
      // Close preview modal if open
      setShowPreviewModal(false);
      setSelectedTemplate(null);
    } catch (error: any) {
      console.error('Failed to apply template:', error);
      toast.error(error?.message || 'Failed to apply template');
    } finally {
      setIsApplyingTemplate(false);
    }
  };

  const handlePreviewTemplate = (template: BlockTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const createBlockFromTemplate = async (
    blockDef: any,
    parentId: string | null,
    currentOrder: number
  ): Promise<PageBlock | null> => {
    try {
      const input: CreatePageBlockInput = {
        type: blockDef.type,
        content: blockDef.content || {},
        style: blockDef.style || {},
        parentId: parentId || undefined,
        depth: blockDef.depth || 0,
        order: currentOrder,
        isVisible: true,
      };
      
      const createdBlock = await addBlock(input);
      
      if (!createdBlock) {
        throw new Error('Failed to create block');
      }
      
      // Recursively create children
      if (blockDef.children && blockDef.children.length > 0) {
        for (let i = 0; i < blockDef.children.length; i++) {
          await createBlockFromTemplate(
            blockDef.children[i],
            createdBlock.id,
            i
          );
        }
      }
      
      return createdBlock;
    } catch (error) {
      console.error('Failed to create block from template:', error);
      throw error;
    }
  };

  // Filter templates based on search and category
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(templateSearchQuery.toLowerCase());
    const matchesCategory = selectedTemplateCategory === 'all' || template.category === selectedTemplateCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const templateCategories = ['all', ...Array.from(new Set(allTemplates.map(t => t.category)))];

  const handleSaveAsTemplate = async (template: Omit<BlockTemplate, 'id' | 'thumbnail'>) => {
    try {
      setIsSavingTemplate(true);
      
      // Save to localStorage
      const savedTemplate = saveCustomTemplate(template);
      
      // Update state
      const updatedCustom = getCustomTemplates();
      setCustomTemplates(updatedCustom);
      setAllTemplates([...BLOCK_TEMPLATES, ...updatedCustom]);
      
      toast.success(`Template "${savedTemplate.name}" saved successfully!`, {
        description: 'You can now use this template on any page.',
      });
      
      setShowSaveTemplateDialog(false);
    } catch (error: any) {
      console.error('Failed to save template:', error);
      toast.error('Failed to save template', {
        description: error?.message || 'An error occurred while saving the template.',
      });
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleDeleteCustomTemplate = async (templateId: string) => {
    try {
      const template = customTemplates.find(t => t.id === templateId);
      if (!template) return;
      
      const confirmed = window.confirm(`Are you sure you want to delete "${template.name}"?`);
      if (!confirmed) return;
      
      deleteCustomTemplate(templateId);
      
      // Update state
      const updatedCustom = getCustomTemplates();
      setCustomTemplates(updatedCustom);
      setAllTemplates([...BLOCK_TEMPLATES, ...updatedCustom]);
      
      toast.success(`Template "${template.name}" deleted successfully!`);
    } catch (error: any) {
      console.error('Failed to delete template:', error);
      toast.error('Failed to delete template', {
        description: error?.message || 'An error occurred while deleting the template.',
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeBlock = blocks.find(block => block.id === event.active.id);
    setDraggedBlock(activeBlock || null);
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedBlock(null);

    if (!over || active.id === over.id) return;

    const oldIndex = blocks.findIndex(block => block.id === active.id);
    const newIndex = blocks.findIndex(block => block.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
    setBlocks(reorderedBlocks);

    // Update order in backend
    const updates = reorderedBlocks.map((block, index) => ({
      id: block.id,
      order: index,
    }));

    try {
      await updateBlocksOrder(updates);
    } catch (error) {
      console.error('Failed to update block order:', error);
      setBlocks(blocks); // Revert on error
    }
  }, [blocks, updateBlocksOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Page Builder</h1>
          {editingPage && (
            <>
              <Badge variant={editingPage.status === PageStatus.PUBLISHED ? 'default' : 'secondary'}>
                {editingPage.status}
              </Badge>
              {editingPage.title && (
                <span className="text-sm text-gray-600">- {editingPage.title}</span>
              )}
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSaveTemplateDialog(true)}
            className="flex items-center space-x-2"
            disabled={blocks.length === 0}
            title={blocks.length === 0 ? 'Add blocks to save as template' : 'Save current blocks as template'}
          >
            <Save size={16} />
            <span>Save as Template</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>Preview</span>
          </Button>
          
          <Dialog open={showPageSettings} onOpenChange={setShowPageSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Settings size={16} />
                <span>Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Page Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {editingPage && <PageSettingsForm page={editingPage} onUpdate={setEditingPage} />}
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={handlePageSave} className="flex items-center space-x-2">
            <Save size={16} />
            <span>{isNewPageMode ? 'Create Page' : 'Save'}</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Block Palette & Templates */}
        <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
          <Tabs defaultValue="blocks" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="blocks" className="flex-1">Blocks</TabsTrigger>
              <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blocks" className="mt-0">
              <div className="space-y-2">
                {BLOCK_TYPES.map(blockType => (
                  <Button
                    key={blockType.type}
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleAddBlock(blockType.type)}
                    disabled={isNewPageMode && !editingPage?.id}
                  >
                    <div className={`p-2 rounded mr-3 ${blockType.color}`}>
                      <blockType.icon size={16} />
                    </div>
                    <span className="text-sm">{blockType.label}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="mt-0">
              {/* Search and Filter */}
              <div className="space-y-3 mb-4">
                <Input
                  type="text"
                  placeholder="Tìm kiếm template..."
                  value={templateSearchQuery}
                  onChange={(e) => setTemplateSearchQuery(e.target.value)}
                  className="w-full"
                />
                <Select value={selectedTemplateCategory} onValueChange={setSelectedTemplateCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {templateCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'Tất cả' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Template Cards */}
              <div className="space-y-3">
                {filteredTemplates.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">Không tìm thấy template phù hợp</p>
                  </Card>
                ) : (
                  filteredTemplates.map(template => {
                    const isCustom = customTemplates.some(t => t.id === template.id);
                    
                    return (
                      <Card
                        key={template.id}
                        className="overflow-hidden hover:border-blue-500 hover:shadow-md transition-all"
                      >
                        {/* Thumbnail */}
                        {template.thumbnail && (
                          <div className="relative w-full h-32 bg-gray-50 border-b overflow-hidden">
                            <img
                              src={template.thumbnail}
                              alt={template.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Badge 
                                variant="secondary" 
                                className="text-xs backdrop-blur-sm bg-white/90"
                              >
                                {template.category}
                              </Badge>
                              {isCustom && (
                                <Badge 
                                  variant="default"
                                  className="text-xs backdrop-blur-sm bg-green-600"
                                >
                                  Custom
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="p-3">
                          <div className="mb-2">
                            <h4 className="font-semibold text-sm">{template.name}</h4>
                            <p className="text-xs text-gray-600 leading-relaxed mt-1">
                              {template.description}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handlePreviewTemplate(template)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleApplyTemplate(template)}
                              disabled={isApplyingTemplate}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Apply
                            </Button>
                            {isCustom && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteCustomTemplate(template.id)}
                                title="Delete custom template"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Editor */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="max-w-4xl mx-auto">
              {showPreview ? (
                <div className="bg-white rounded-lg shadow-sm border p-8">
                  <h2 className="text-3xl font-bold mb-6">Preview</h2>
                  {blocks.map(block => (
                    <BlockRenderer
                      key={block.id}
                      block={block}
                      isEditing={false}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <DndContext
                  collisionDetection={closestCorners}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                >
                  <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                      {blocks.length === 0 ? (
                        <Card className="p-8 text-center border-dashed">
                          <div className="text-gray-500">
                            <Layout size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">No blocks yet</p>
                            <p className="text-sm">Add your first block from the palette on the left</p>
                          </div>
                        </Card>
                      ) : (
                        blocks.map(block => (
                          <BlockRenderer
                            key={block.id}
                            block={block}
                            isEditing={true}
                            onUpdate={(content, style) => handleBlockUpdate(block.id, content, style)}
                            onDelete={() => handleBlockDelete(block.id)}
                            onAddChild={handleAddChild}
                            onUpdateChild={handleBlockUpdate}
                            onDeleteChild={handleBlockDelete}
                            depth={0}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>

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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Child Block Dialog */}
      <Dialog open={showAddChildDialog} onOpenChange={setShowAddChildDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Child Block</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
            {BLOCK_TYPES.map(({ type, label, icon: Icon, color }) => (
              <Button
                key={type}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center justify-center space-y-2 hover:border-blue-500"
                onClick={() => handleAddChildBlock(type)}
              >
                <div className={`p-3 rounded-lg ${color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-sm font-medium text-center">{label}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        template={selectedTemplate}
        onApply={() => selectedTemplate && handleApplyTemplate(selectedTemplate)}
        isApplying={isApplyingTemplate}
      />

      {/* Save Template Dialog */}
      <SaveTemplateDialog
        open={showSaveTemplateDialog}
        onOpenChange={setShowSaveTemplateDialog}
        blocks={blocks}
        onSave={handleSaveAsTemplate}
        isSaving={isSavingTemplate}
      />
    </div>
  );
}

// Page Settings Form Component
function PageSettingsForm({ page, onUpdate }: { page: Page; onUpdate: (page: Page) => void }) {
  const [formData, setFormData] = useState({
    title: page.title || '',
    slug: page.slug || '',
    content: (page.content && typeof page.content === 'string') ? page.content : '',
    status: page.status,
    seoTitle: page.seoTitle || '',
    seoDescription: page.seoDescription || '',
    seoKeywords: (page.seoKeywords || []).join(', '),
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Update parent immediately
    // For content field, if it's empty string, set to undefined to avoid JSONObject validation error
    const updatedPage = {
      ...page,
      ...newFormData,
      content: field === 'content' && !value ? undefined : (field === 'content' ? value : page.content),
      seoKeywords: field === 'seoKeywords' ? value.split(',').map(k => k.trim()).filter(Boolean) : page.seoKeywords,
    };
    onUpdate(updatedPage);
  };

  const generateSlugFromTitle = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    handleInputChange('slug', slug);
  };

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4">
        <div>
          <Label htmlFor="title">Page Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter page title"
          />
        </div>
        
        <div>
          <Label htmlFor="slug">URL Slug</Label>
          <div className="flex space-x-2">
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="page-url-slug"
            />
            <Button type="button" variant="outline" onClick={generateSlugFromTitle}>
              Generate
            </Button>
          </div>
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as PageStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PageStatus.DRAFT}>Draft</SelectItem>
              <SelectItem value={PageStatus.PUBLISHED}>Published</SelectItem>
              <SelectItem value={PageStatus.ARCHIVED}>Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="content">Page Description</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Optional page description"
            rows={3}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="seo" className="space-y-4">
        <div>
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            value={formData.seoTitle}
            onChange={(e) => handleInputChange('seoTitle', e.target.value)}
            placeholder="SEO optimized title"
          />
        </div>
        
        <div>
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Textarea
            id="seoDescription"
            value={formData.seoDescription}
            onChange={(e) => handleInputChange('seoDescription', e.target.value)}
            placeholder="SEO meta description"
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="seoKeywords">SEO Keywords</Label>
          <Input
            id="seoKeywords"
            value={formData.seoKeywords}
            onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
          />
          <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}