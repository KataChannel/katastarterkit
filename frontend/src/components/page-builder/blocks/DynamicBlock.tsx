import React, { useState, useEffect } from 'react';
import { PageBlock, DynamicBlockConfig } from '@/types/page-builder';
import { Settings, Trash2, RefreshCw, Code, Check, BookOpen, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  getAllSampleTemplates, 
  type SampleTemplate 
} from '@/lib/dynamicBlockSampleTemplates';

interface DynamicBlockProps {
  block: PageBlock;
  isEditable?: boolean;
  onUpdate: (content: any, style?: any) => void;
  onDelete: () => void;
}

export const DynamicBlock: React.FC<DynamicBlockProps> = ({
  block,
  isEditable = true,
  onUpdate,
  onDelete,
}) => {
  const config = block.config as DynamicBlockConfig;
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState<DynamicBlockConfig>(config || {});
  const [templateEdit, setTemplateEdit] = useState<string>(block.content?.template || '');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SampleTemplate | null>(null);
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [apiTestLoading, setApiTestLoading] = useState(false);
  const [apiTestError, setApiTestError] = useState<string | null>(null);
  const sampleTemplates = getAllSampleTemplates();

  // Fetch data based on configuration
  useEffect(() => {
    if (!config?.dataSource) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const dataSource = config.dataSource;
        if (!dataSource) return;

        if (dataSource.type === 'static') {
          setData(dataSource.staticData);
        } else if (dataSource.type === 'api') {
          const response = await fetch(dataSource.endpoint || '', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataSource.variables || {}),
          });
          const result = await response.json();
          setData(result);
        } else if (dataSource.type === 'graphql') {
          const response = await fetch(dataSource.endpoint || '/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: dataSource.query,
              variables: dataSource.variables,
            }),
          });
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [config]);

  // Evaluate conditions
  const evaluateConditions = (item: any): boolean => {
    if (!config?.conditions || config.conditions.length === 0) return true;

    return config.conditions.every((condition, index) => {
      const fieldValue = item[condition.field];
      let result = false;

      switch (condition.operator) {
        case 'equals':
          result = fieldValue === condition.value;
          break;
        case 'notEquals':
          result = fieldValue !== condition.value;
          break;
        case 'contains':
          result = String(fieldValue).includes(String(condition.value));
          break;
        case 'greaterThan':
          result = Number(fieldValue) > Number(condition.value);
          break;
        case 'lessThan':
          result = Number(fieldValue) < Number(condition.value);
          break;
        case 'exists':
          result = fieldValue !== null && fieldValue !== undefined;
          break;
      }

      // Handle logic operators (AND/OR)
      if (index > 0 && config.conditions && config.conditions[index - 1]?.logic === 'OR') {
        return result; // OR logic - any true condition passes
      }
      return result; // Default AND logic
    });
  };

  // Replace template variables
  const replaceVariables = (template: string, item: any): string => {
    let result = template;
    
    // Replace {{variable}} syntax
    const matches = template.match(/\{\{([^}]+)\}\}/g);
    if (matches) {
      matches.forEach((match) => {
        const key = match.replace(/\{\{|\}\}/g, '').trim();
        const value = item[key] || config?.variables?.[key] || '';
        result = result.replace(match, String(value));
      });
    }

    return result;
  };

  // Check if this is a template-based dynamic block
  const isTemplateBlock = block.content?.componentType === 'template';
  const templateContent = block.content?.template;

  // Sample data for different template types
  const getSampleData = (templateId: string) => {
    const sampleData: Record<string, any> = {
      'product-grid': {
        title: 'Featured Products',
        products: [
          {
            id: 1,
            name: 'MacBook Pro M3',
            price: 1999,
            description: 'Powerful laptop for professionals',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=200&fit=crop',
          },
          {
            id: 2,
            name: 'iPhone 15 Pro',
            price: 1099,
            description: 'Latest smartphone technology',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop',
          },
          {
            id: 3,
            name: 'AirPods Pro',
            price: 249,
            description: 'Premium wireless earbuds',
            image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop',
          },
        ],
      },
      'task-dashboard': {
        projectName: 'Website Redesign',
        todoTasks: [
          { title: 'Design mockups', description: 'Create wireframes and prototypes', priority: 'high', dueDate: '2025-10-20' },
          { title: 'Content audit', description: 'Review existing content', priority: 'medium', dueDate: '2025-10-22' },
        ],
        inProgressTasks: [
          { title: 'Frontend development', description: 'Implement React components', priority: 'high', assignee: 'John Doe' },
        ],
        doneTasks: [
          { title: 'Research phase', description: 'Market analysis completed', priority: 'medium' },
        ],
      },
      'category-showcase': {
        title: 'Shop by Category',
        categories: [
          { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop', productCount: 150 },
          { name: 'Fashion', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', productCount: 89 },
          { name: 'Home & Garden', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', productCount: 67 },
        ],
      },
      'hero-section': {
        title: 'Biến Ý Tưởng Thành Hiện Thực',
        subtitle: 'Nền tảng toàn diện giúp bạn xây dựng website chuyên nghiệp với công nghệ tiên tiến nhất',
        ctaText: 'Bắt Đầu Ngay Hôm Nay',
        backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop',
      },
      'contact-form': {
        title: 'Liên Hệ Với Chúng Tôi',
        description: 'Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy để lại thông tin và chúng tôi sẽ phản hồi trong 24h.',
        email: 'hello@katacore.com',
        phone: '+84 (0) 123 456 789',
        address: 'Tầng 10, Tòa nhà ABC, 123 Đường DEF, Quận 1, TP.HCM',
      },
      'testimonials': {
        title: 'Khách Hàng Nói Gì Về Chúng Tôi',
        testimonials: [
          {
            name: 'Nguyễn Văn A',
            position: 'CEO, Tech Startup',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
            content: 'Dịch vụ tuyệt vời! Team rất chuyên nghiệp và hỗ trợ nhiệt tình. Website của chúng tôi đã tăng 300% traffic.',
            rating: 5,
          },
          {
            name: 'Trần Thị B',
            position: 'Marketing Manager, Fashion Brand',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
            content: 'Thiết kế đẹp, tính năng đầy đủ và tốc độ tải nhanh. Đúng là đáng đồng tiền bát gạo!',
            rating: 5,
          },
          {
            name: 'Lê Minh C',
            position: 'Founder, E-commerce Store',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
            content: 'Từ khi dùng platform này, doanh số online của shop tôi tăng gấp đôi. Highly recommended!',
            rating: 5,
          },
        ],
      },
      'faq-section': {
        title: 'Câu Hỏi Thường Gặp',
        faqs: [
          {
            question: 'Tôi có thể tự thiết kế website không cần kiến thức lập trình?',
            answer: 'Hoàn toàn có thể! Platform của chúng tôi được thiết kế drag-and-drop trực quan, bạn chỉ cần kéo thả các component và tùy chỉnh theo ý muốn.',
          },
          {
            question: 'Có bao nhiều template có sẵn để lựa chọn?',
            answer: 'Chúng tôi cung cấp hơn 100+ template chuyên nghiệp cho nhiều lĩnh vực khác nhau: e-commerce, business, portfolio, blog, landing page...',
          },
          {
            question: 'Website có responsive trên mobile không?',
            answer: 'Tất cả template và component đều được tối ưu responsive, hiển thị hoàn hảo trên mọi thiết bị từ desktop, tablet đến mobile.',
          },
          {
            question: 'Có hỗ trợ SEO không?',
            answer: 'Có! Chúng tôi tích hợp đầy đủ các tính năng SEO: meta tags, sitemap, structured data, page speed optimization...',
          },
          {
            question: 'Tôi có thể kết nối domain riêng không?',
            answer: 'Chắc chắn rồi! Bạn có thể kết nối domain riêng và chúng tôi hỗ trợ cấu hình SSL certificate miễn phí.',
          },
        ],
      },
      'newsletter-signup': {
        title: 'Đăng Ký Nhận Tin Tức Mới Nhất',
        description: 'Nhận các tips, tricks và update về web development, design trends và business insights.',
        subscriberCount: '12,500',
        benefits: [
          'Weekly tips về web development',
          'Exclusive templates và resources',
          'Early access cho features mới',
          'Community access với 10k+ developers',
        ],
      },
    };

    return sampleData[templateId] || {};
  };

  // Enhanced template processor with advanced features
  const processTemplate = (template: string, data: any): string => {
    let result = template;

    // Process repeat helper (e.g., {{#repeat rating}}) - FIRST before loops
    const repeatRegex = /{{#repeat\s+(\w+)}}([\s\S]*?){{\/repeat}}/g;
    result = result.replace(repeatRegex, (match: string, countVar: string, repeatTemplate: string) => {
      const count = data[countVar] || 0;
      return Array(count).fill(repeatTemplate).join('');
    });

    // Process conditional blocks ({{#if condition}}) - BEFORE loops to preserve outer scope
    const ifRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
    result = result.replace(ifRegex, (match: string, condition: string, ifTemplate: string) => {
      return data[condition] ? ifTemplate : '';
    });

    // Process simple loops
    const loopRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;
    result = result.replace(loopRegex, (match: string, arrayName: string, loopTemplate: string) => {
      const array = data[arrayName];
      if (Array.isArray(array)) {
        return array.map(item => {
          let itemResult = loopTemplate;
          
          // Replace ONLY item properties (variables that exist in the item)
          Object.entries(item).forEach(([key, value]) => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            itemResult = itemResult.replace(regex, String(value));
          });
          
          // Handle repeat within loops (e.g., for star ratings)
          const itemRepeatRegex = /{{#repeat\s+(\w+)}}([\s\S]*?){{\/repeat}}/g;
          itemResult = itemResult.replace(itemRepeatRegex, (match: string, countVar: string, repeatTemplate: string) => {
            const count = item[countVar] || 0;
            return Array(count).fill(repeatTemplate).join('');
          });
          
          return itemResult;
        }).join('');
      }
      return '';
    });

    // Replace remaining simple variables (outside loops) - LAST
    Object.entries(data).forEach(([key, value]) => {
      // Skip arrays and complex objects
      if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        return;
      }
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    });

    return result;
  };

  // Render dynamic content
  const renderContent = () => {
    // Handle template-based blocks
    if (isTemplateBlock && templateContent) {
      // Use actual fetched data if available, otherwise use sample data
      const renderData = data || getSampleData(block.content?.templateId || '');
      const processedTemplate = processTemplate(templateContent, renderData);
      
      return (
        <div 
          className="template-content"
          dangerouslySetInnerHTML={{ __html: processedTemplate }}
        />
      );
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2">Loading...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
          <strong>Error:</strong> {error}
        </div>
      );
    }

    if (!data) {
      return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded text-gray-500">
          No data available. Configure data source in settings.
        </div>
      );
    }

    // Handle repeater pattern
    if (config?.repeater?.enabled) {
      const dataPath = config.repeater.dataPath || '';
      const items = dataPath ? eval(`data.${dataPath}`) : data;
      
      if (!Array.isArray(items)) {
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
            Data path does not return an array
          </div>
        );
      }

      const filteredItems = items.filter(evaluateConditions);
      const limitedItems = config.repeater?.limit 
        ? filteredItems.slice(0, config.repeater.limit)
        : filteredItems;

      return (
        <div className="grid gap-4">
          {limitedItems.map((item, index) => (
            <Card key={index} className="p-4">
              {config.repeater?.itemTemplate ? (
                <div>
                  <h3 className="font-bold">
                    {replaceVariables(config.repeater.itemTemplate.content?.title || '', item)}
                  </h3>
                  <p className="text-gray-600">
                    {replaceVariables(config.repeater.itemTemplate.content?.description || '', item)}
                  </p>
                </div>
              ) : (
                <pre className="text-sm">{JSON.stringify(item, null, 2)}</pre>
              )}
            </Card>
          ))}
        </div>
      );
    }

    // Single item display
    return (
      <Card className="p-4">
        <pre className="text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
      </Card>
    );
  };

  // Handle template selection
  const handleSelectTemplate = (template: SampleTemplate) => {
    setSelectedTemplate(template);
    setTemplateEdit(template.template);
    setEditConfig({
      ...editConfig,
      templateId: template.id,
      templateName: template.name,
      dataSource: template.dataSource,
      variables: template.variables,
    });
  };

  // Test API or GraphQL endpoint
  const handleTestApi = async () => {
    setApiTestLoading(true);
    setApiTestError(null);
    setApiTestResult(null);

    try {
      if (editConfig.dataSource?.type === 'graphql') {
        const response = await fetch(editConfig.dataSource.endpoint || '', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: editConfig.dataSource.query || '',
            variables: editConfig.dataSource.variables || {},
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.errors) {
          setApiTestError(result.errors[0]?.message || 'GraphQL Error');
        } else {
          setApiTestResult(result.data);
        }
      } else if (editConfig.dataSource?.type === 'api') {
        const response = await fetch(editConfig.dataSource.endpoint || '', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editConfig.dataSource.variables || {}),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setApiTestResult(result);
      }
    } catch (err: any) {
      setApiTestError(err.message || 'Failed to fetch data');
    } finally {
      setApiTestLoading(false);
    }
  };

  const handleSave = () => {
    const updatedContent = {
      ...block.content,
      template: templateEdit,
      config: editConfig, // Save the entire config with template
    };
    
    onUpdate(updatedContent, block.style);
    setIsEditing(false);
  };

  if (!isEditable) {
    return <div className="dynamic-block-content">{renderContent()}</div>;
  }

  return (
    <div className="relative border-2 border-dashed border-purple-300 rounded-lg p-4 group">
      {/* Control Bar */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="bg-white shadow-sm"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          className="shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings Dialog - Professional UI */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-7xl h-[95vh] p-0 flex flex-col">
          {/* Header */}
          <DialogHeader className="px-8 pt-8 pb-6 border-b bg-gradient-to-r from-slate-50 to-slate-100">
            <DialogTitle className="flex items-center text-2xl font-bold">
              <Grid3x3 className="w-6 h-6 mr-3 text-blue-600" />
              Dynamic Block Configuration
            </DialogTitle>
            <DialogDescription className="mt-2 text-base">
              Choose a template, configure data source, and customize your block
            </DialogDescription>
          </DialogHeader>

          {/* Tabbed Content Area */}
          <Tabs defaultValue="templates" className="flex-1 flex flex-col overflow-hidden">
            {/* Tab List */}
            <div className="px-8 pt-6 border-b bg-white">
              <TabsList className="bg-slate-100 p-1">
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Select Template
                </TabsTrigger>
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Template Editor
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configuration
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Templates Tab */}
              <TabsContent value="templates" className="px-8 py-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Choose a Sample Template</h3>
                  <p className="text-gray-600 mb-6">Select from our professional templates or start with blank</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Blank Template */}
                    <button
                      onClick={() => {
                        setSelectedTemplate(null);
                        setTemplateEdit('');
                        setEditConfig({
                          ...editConfig,
                          templateName: 'Custom Template',
                          dataSource: { type: 'static', staticData: {} },
                          variables: {},
                        });
                      }}
                      className={`p-6 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
                        selectedTemplate === null
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-lg mb-2">Blank Template</div>
                      <p className="text-sm text-gray-600">Start with an empty template and write your own HTML</p>
                      {selectedTemplate === null && (
                        <div className="mt-3 flex items-center text-blue-600 text-sm font-semibold">
                          <Check className="w-4 h-4 mr-1" /> Selected
                        </div>
                      )}
                    </button>

                    {/* Sample Templates */}
                    {sampleTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template)}
                        className={`p-6 rounded-lg border-2 transition-all text-left hover:shadow-lg ${
                          selectedTemplate?.id === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold text-lg mb-1">{template.name}</div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                        {selectedTemplate?.id === template.id && (
                          <div className="flex items-center text-blue-600 text-sm font-semibold">
                            <Check className="w-4 h-4 mr-1" /> Selected
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Editor Tab */}
              <TabsContent value="editor" className="px-8 py-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Template HTML</h3>
                    <div className="text-sm text-gray-500">
                      {selectedTemplate ? `Using: ${selectedTemplate.name}` : 'Blank template'}
                    </div>
                  </div>
                  <Textarea
                    placeholder={`<div class="p-6">\n  <h2>{{title}}</h2>\n  {{#each items}}\n    <p>{{this.name}}</p>\n  {{/each}}\n</div>`}
                    value={templateEdit}
                    onChange={(e) => setTemplateEdit(e.target.value)}
                    rows={12}
                    className="font-mono text-sm resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-3">
                    Use <code className="bg-gray-100 px-2 py-1 rounded">{'{{variable}}'}</code> •
                    <code className="bg-gray-100 px-2 py-1 rounded ml-2">{'{{#each array}}...{{/each}}'}</code> •
                    <code className="bg-gray-100 px-2 py-1 rounded ml-2">{'{{#if condition}}...{{/if}}'}</code>
                  </p>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="px-8 py-8 space-y-6 max-w-3xl">
                {/* Template Name */}
                <Card className="p-6 border border-gray-200">
                  <h3 className="text-sm font-bold mb-4 text-gray-900">Template Name</h3>
                  <Input
                    type="text"
                    placeholder="my-dynamic-block"
                    value={editConfig.templateName || ''}
                    onChange={(e) => setEditConfig({ ...editConfig, templateName: e.target.value })}
                    className="bg-white"
                  />
                </Card>

                {/* Data Source */}
                <Card className="p-6 border border-gray-200">
                  <h3 className="text-sm font-bold mb-4 text-gray-900">Data Source</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Type</Label>
                      <Select
                        value={editConfig.dataSource?.type || 'static'}
                        onValueChange={(value) => setEditConfig({
                          ...editConfig,
                          dataSource: { ...editConfig.dataSource, type: value as any }
                        })}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="static">Static Data</SelectItem>
                          <SelectItem value="api">REST API</SelectItem>
                          <SelectItem value="graphql">GraphQL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(editConfig.dataSource?.type === 'api' || editConfig.dataSource?.type === 'graphql') && (
                      <div>
                        <Label className="text-sm font-semibold">Endpoint</Label>
                        <Input
                          type="text"
                          placeholder="/api/data or /graphql"
                          value={editConfig.dataSource?.endpoint || ''}
                          onChange={(e) => setEditConfig({
                            ...editConfig,
                            dataSource: { 
                              type: editConfig.dataSource?.type || 'api',
                              ...editConfig.dataSource, 
                              endpoint: e.target.value 
                            }
                          })}
                        />
                      </div>
                    )}

                    {editConfig.dataSource?.type === 'graphql' && (
                      <div>
                        <Label>GraphQL Query</Label>
                        <Textarea
                          placeholder="query GetData { items { id name } }"
                          value={editConfig.dataSource?.query || ''}
                          onChange={(e) => setEditConfig({
                            ...editConfig,
                            dataSource: { 
                              type: editConfig.dataSource?.type || 'graphql',
                              ...editConfig.dataSource, 
                              query: e.target.value 
                            }
                          })}
                          rows={4}
                          className="font-mono text-sm"
                        />
                      </div>
                    )}

                    {(editConfig.dataSource?.type === 'api' || editConfig.dataSource?.type === 'graphql') && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleTestApi} 
                          disabled={apiTestLoading || !editConfig.dataSource?.endpoint}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {apiTestLoading ? 'Testing...' : 'Test API'}
                        </Button>
                        {apiTestResult && <span className="text-xs text-green-600 flex items-center">✓ Success</span>}
                        {apiTestError && <span className="text-xs text-red-600 flex items-center">✗ Error</span>}
                      </div>
                    )}

                    {apiTestError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs font-semibold text-red-800 mb-1">Error:</p>
                        <pre className="text-xs text-red-700 whitespace-pre-wrap">{apiTestError}</pre>
                      </div>
                    )}

                    {apiTestResult && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs font-semibold text-green-800 mb-2">Response Data:</p>
                        <pre className="text-xs text-green-800 whitespace-pre-wrap overflow-auto max-h-48 bg-white p-2 rounded border border-green-200">{JSON.stringify(apiTestResult, null, 2)}</pre>
                      </div>
                    )}

                    {editConfig.dataSource?.type === 'static' && (
                      <div>
                        <Label className="text-sm font-semibold">Static Data (JSON)</Label>
                        <Textarea
                          placeholder='{"title": "My Data", "items": [{"id": 1, "name": "Item 1"}]}'
                          value={JSON.stringify(editConfig.dataSource?.staticData || {}, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              setEditConfig({
                                ...editConfig,
                                dataSource: { 
                                  type: 'static',
                                  ...editConfig.dataSource, 
                                  staticData: parsed 
                                }
                              });
                            } catch (err) {
                              // Invalid JSON, ignore
                            }
                          }}
                          rows={6}
                          className="font-mono text-sm"
                        />
                      </div>
                    )}
                  </div>
                </Card>

                {/* Repeater Configuration */}
                <Card className="p-6 border border-gray-200">
                  <h3 className="text-sm font-bold mb-4 text-gray-900">Repeater Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold">Enable Repeater</Label>
                        <p className="text-xs text-gray-500 mt-1">Loop through array items in your data</p>
                      </div>
                      <Switch
                        checked={editConfig.repeater?.enabled || false}
                        onCheckedChange={(checked) => setEditConfig({
                          ...editConfig,
                          repeater: { ...editConfig.repeater, enabled: checked }
                        })}
                      />
                    </div>

                    {editConfig.repeater?.enabled && (
                      <>
                        <div>
                          <Label className="text-sm font-semibold">Data Path</Label>
                          <Input
                            type="text"
                            placeholder="products"
                            value={editConfig.repeater?.dataPath || ''}
                            onChange={(e) => setEditConfig({
                              ...editConfig,
                              repeater: { 
                                enabled: editConfig.repeater?.enabled || false,
                                ...editConfig.repeater, 
                                dataPath: e.target.value 
                              }
                            })}
                          />
                          <p className="text-xs text-gray-500 mt-1">Path to array in data (e.g., "products" or "data.items")</p>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold">Limit</Label>
                          <Input
                            type="number"
                            placeholder="10"
                            value={editConfig.repeater?.limit || ''}
                            onChange={(e) => setEditConfig({
                              ...editConfig,
                              repeater: { 
                                enabled: editConfig.repeater?.enabled || false,
                                ...editConfig.repeater, 
                                limit: parseInt(e.target.value) 
                              }
                            })}
                          />
                          <p className="text-xs text-gray-500 mt-1">Maximum items to display (leave empty for no limit)</p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          {/* Footer - Action Buttons */}
          <div className="border-t px-6 py-4 flex gap-2 justify-end bg-white">
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} className="min-w-32">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dynamic Content Display */}
      <div className="mt-8">
        <div className="text-xs text-gray-500 mb-2 flex items-center">
          <Code className="w-3 h-3 mr-1" />
          Dynamic Block
          {config?.templateName && ` - ${config.templateName}`}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};
