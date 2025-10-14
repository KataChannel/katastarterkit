import React, { useMemo, useCallback } from 'react';
import { 
  Type, Image, Layout, Square, Users, TrendingUp, Phone, Minus, Space,
  Box, Columns, Grid3x3, ArrowRightLeft, ArrowUpDown, Code,
  Eye, Plus, Trash2, Presentation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageBuilderContext } from './PageBuilderProvider';
import { BlockType } from '@/types/page-builder';

/**
 * Block type definitions with icons and colors
 */
const BLOCK_TYPES = [
  // Content Blocks
  { type: BlockType.TEXT, label: 'Text Block', icon: Type, color: 'bg-blue-100 text-blue-600' },
  { type: BlockType.IMAGE, label: 'Image Block', icon: Image, color: 'bg-green-100 text-green-600' },
  { type: BlockType.CAROUSEL, label: 'Carousel', icon: Presentation, color: 'bg-teal-100 text-teal-600' },
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

/**
 * PageBuilderSidebar Component
 * 
 * Provides:
 * - Block types palette (Blocks tab)
 * - Template browser with search and filter (Templates tab)
 * - Template actions (preview, apply, delete custom)
 * 
 * Performance optimizations:
 * - Wrapped with React.memo to prevent unnecessary re-renders
 * - useMemo for template filtering (expensive operation)
 * - useCallback for event handlers
 */
function PageBuilderSidebarComponent() {
  const {
    // State
    editingPage,
    isNewPageMode,
    allTemplates,
    customTemplates,
    templateSearchQuery,
    selectedTemplateCategory,
    isApplyingTemplate,
    
    // Template actions
    setTemplateSearchQuery,
    setSelectedTemplateCategory,
    handlePreviewTemplate,
    handleApplyTemplate,
    handleDeleteCustomTemplate,
    
    // Block actions
    handleAddBlock,
  } = usePageBuilderContext();

  // Memoize template filtering (expensive operation with large template lists)
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(templateSearchQuery.toLowerCase());
      const matchesCategory = selectedTemplateCategory === 'all' || template.category === selectedTemplateCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allTemplates, templateSearchQuery, selectedTemplateCategory]);

  // Memoize unique categories (only recalculate when templates change)
  const templateCategories = useMemo(() => {
    return ['all', ...Array.from(new Set(allTemplates.map(t => t.category)))];
  }, [allTemplates]);

  return (
    <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
      <Tabs defaultValue="blocks" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="blocks" className="flex-1">Blocks</TabsTrigger>
          <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
        </TabsList>
        
        {/* Blocks Tab - Block Types Palette */}
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
        
        {/* Templates Tab - Template Browser */}
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
  );
}

// Export with React.memo to prevent unnecessary re-renders
// Component only re-renders when context values it uses actually change
export const PageBuilderSidebar = React.memo(PageBuilderSidebarComponent);
