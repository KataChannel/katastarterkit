/**
 * PageBuilder Dynamic Template Integration
 * Example showing how to integrate Dynamic Template System with existing PageBuilder
 */

'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Layout, 
  Database, 
  Palette, 
  Zap, 
  Layers,
  FileText,
  Box,
  Grid3x3,
} from 'lucide-react';

// Import our Dynamic Template System
import { TemplateRegistry } from '@/lib/dynamicTemplateSystem';
// import { TemplatePresets } from '@/utils/templateBuilder'; // Temporarily disabled

// ============================================================================
// PageBuilder Integration Component
// ============================================================================

interface PageBuilderWithTemplatesProps {
  onAddElements?: (elements: any[]) => void;
  currentBlocks?: any[];
}

export const PageBuilderWithTemplates: React.FC<PageBuilderWithTemplatesProps> = ({
  onAddElements,
  currentBlocks = [],
}) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [compiledElements, setCompiledElements] = useState<any[]>([]);
  const [templateRegistry] = useState(() => new TemplateRegistry());

  // Handle template application
  const handleApplyTemplate = (elements: any[]) => {
    setCompiledElements(elements);
    if (onAddElements) {
      onAddElements(elements);
    }
  };

  // Handle template saving
  const handleSaveTemplate = (template: any) => {
    console.log('Saving custom template:', template);
    // Here you would save to your backend or localStorage
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">PageBuilder với Dynamic Templates</h1>
            <p className="text-muted-foreground">
              Tạo trang web với template động kết nối dữ liệu database
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {currentBlocks.length} blocks
            </Badge>
            <Badge variant="outline">
              {compiledElements.length} elements ready
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Template System */}
        <div className="w-80 border-r bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-2">
              <TabsTrigger value="templates" className="text-xs">
                <FileText className="h-4 w-4 mr-1" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="builder" className="text-xs">
                <Box className="h-4 w-4 mr-1" />
                Builder
              </TabsTrigger>
              <TabsTrigger value="examples" className="text-xs">
                <Layers className="h-4 w-4 mr-1" />
                Examples
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="templates" className="h-full m-2 mt-0">
                
              </TabsContent>

              <TabsContent value="builder" className="h-full m-2 mt-0">
                <TemplateBuilderInterface />
              </TabsContent>

              <TabsContent value="examples" className="h-full m-2 mt-0">
                <TemplateExamplesPanel onApplyTemplate={handleApplyTemplate} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Content - Canvas/Preview */}
        <div className="flex-1 bg-gray-50">
          <CanvasPreview elements={compiledElements} blocks={currentBlocks} />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Template Builder Interface
// ============================================================================

const TemplateBuilderInterface: React.FC = () => {
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('ecommerce');

  // Temporarily disabled - TemplatePresets not available
  const createQuickTemplate = (type: string) => {
    console.log('Quick template creation temporarily disabled:', type);
    // let template;
    // const id = `quick-${type}-${Date.now()}`;

    // switch (type) {
    //   case 'product-grid':
    //     template = TemplatePresets.createProductGrid(id);
    //     break;
    //   case 'task-dashboard':
    //     template = TemplatePresets.createTaskDashboard(id);
    //     break;
    //   case 'category-showcase':
    //     template = TemplatePresets.createCategoryShowcase(id);
    //     break;
    //   default:
    //     return;
    // }

    // console.log('Created quick template:', template);
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Templates</CardTitle>
          <CardDescription className="text-xs">
            Tạo template nhanh từ preset có sẵn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs"
            onClick={() => createQuickTemplate('product-grid')}
          >
            <Grid3x3 className="h-3 w-3 mr-2" />
            Product Grid
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs"
            onClick={() => createQuickTemplate('task-dashboard')}
          >
            <Layout className="h-3 w-3 mr-2" />
            Task Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-xs"
            onClick={() => createQuickTemplate('category-showcase')}
          >
            <Database className="h-3 w-3 mr-2" />
            Category Showcase
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Custom Template Builder</CardTitle>
          <CardDescription className="text-xs">
            Tạo template tùy chỉnh từ đầu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-medium">Template Name</label>
            <input 
              className="w-full px-2 py-1 border rounded text-xs"
              placeholder="My Custom Template"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium">Category</label>
            <select 
              className="w-full px-2 py-1 border rounded text-xs"
              value={templateCategory}
              onChange={(e) => setTemplateCategory(e.target.value)}
            >
              <option value="ecommerce">E-commerce</option>
              <option value="productivity">Productivity</option>
              <option value="marketing">Marketing</option>
              <option value="portfolio">Portfolio</option>
              <option value="blog">Blog</option>
            </select>
          </div>

          <Button size="sm" className="w-full text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Create Template
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Template Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Database className="h-3 w-3 text-blue-500" />
              <span>Database Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="h-3 w-3 text-purple-500" />
              <span>Customizable Variables</span>
            </div>
            <div className="flex items-center gap-2">
              <Layout className="h-3 w-3 text-green-500" />
              <span>Responsive Layouts</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-orange-500" />
              <span>Real-time Preview</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================================
// Template Examples Panel
// ============================================================================

const TemplateExamplesPanel: React.FC<{
  onApplyTemplate: (elements: any[]) => void;
}> = ({ onApplyTemplate }) => {
  const examples = [
    {
      id: 'ecommerce-hero',
      name: 'E-commerce Hero',
      description: 'Hero section với sản phẩm nổi bật',
      category: 'ecommerce',
      preview: '/templates/ecommerce-hero.jpg',
      dataType: 'Product',
      variables: ['title', 'backgroundColor', 'layout'],
    },
    {
      id: 'project-overview',
      name: 'Project Overview',
      description: 'Tổng quan dự án với task progress',
      category: 'productivity', 
      preview: '/templates/project-overview.jpg',
      dataType: 'Task',
      variables: ['projectName', 'showMetrics', 'teamMembers'],
    },
    {
      id: 'product-catalog',
      name: 'Product Catalog',
      description: 'Catalog sản phẩm với filter',
      category: 'ecommerce',
      preview: '/templates/product-catalog.jpg',
      dataType: 'Product + Category',
      variables: ['columns', 'showFilters', 'priceDisplay'],
    },
  ];

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      <div>
        <h3 className="text-sm font-semibold mb-2">Template Examples</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Các template mẫu để bắt đầu nhanh
        </p>
      </div>

      {examples.map((example) => (
        <Card key={example.id} className="group hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xs font-medium">{example.name}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  {example.description}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {example.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Preview thumbnail */}
            <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center text-muted-foreground">
              <Layout className="h-6 w-6" />
            </div>

            {/* Metadata */}
            <div className="space-y-2 text-xs">
              <div>
                <strong>Data Type:</strong> {example.dataType}
              </div>
              <div>
                <strong>Variables:</strong> {example.variables.join(', ')}
              </div>
            </div>

            <Separator className="my-3" />

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => console.log('Preview:', example.id)}
              >
                Preview
              </Button>
              <Button 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => {
                  // Create mock elements for demo
                  const mockElements = [{
                    id: `${example.id}-element`,
                    type: 'container',
                    content: `Template: ${example.name}`,
                  }];
                  onApplyTemplate(mockElements);
                }}
              >
                Use Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ============================================================================
// Canvas Preview Component
// ============================================================================

const CanvasPreview: React.FC<{
  elements: any[];
  blocks: any[];
}> = ({ elements, blocks }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Canvas Header */}
      <div className="border-b p-4 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Canvas Preview</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {elements.length} template elements
            </Badge>
            <Badge variant="outline">
              {blocks.length} page blocks
            </Badge>
          </div>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-lg border min-h-[600px] shadow-sm">
          {elements.length > 0 ? (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Compiled Template Elements</h3>
              <div className="space-y-4">
                {elements.map((element, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-sm text-muted-foreground mb-2">
                      Element {index + 1}: {element.type}
                    </div>
                    <div className="bg-white rounded border p-3 text-sm font-mono">
                      {typeof element.content === 'string' ? 
                        element.content.substring(0, 200) : 
                        JSON.stringify(element.content).substring(0, 200)
                      }
                      {(element.content?.length > 200) && '...'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chọn template để bắt đầu</h3>
                <p className="text-muted-foreground">
                  Sử dụng Dynamic Template System để tạo nội dung với dữ liệu từ database
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageBuilderWithTemplates;