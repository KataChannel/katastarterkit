'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Page, PageStatus } from '@/types/page-builder';

/**
 * Page Settings Form Component
 * 
 * Form for editing page metadata:
 * - General: Title, slug, status, description
 * - SEO: SEO title, description, keywords
 * - Layout: Header/Footer settings
 */
interface PageSettingsFormProps {
  page: Page;
  onUpdate: (page: Page) => void;
}

export default function PageSettingsForm({ page, onUpdate }: PageSettingsFormProps) {
  const [formData, setFormData] = useState({
    title: page.title || '',
    slug: page.slug || '',
    content: (page.content && typeof page.content === 'string') ? page.content : '',
    status: page.status,
    seoTitle: page.seoTitle || '',
    seoDescription: page.seoDescription || '',
    seoKeywords: (page.seoKeywords || []).join(', '),
    layoutSettings: {
      hasHeader: page.layoutSettings?.hasHeader ?? true,
      hasFooter: page.layoutSettings?.hasFooter ?? true,
      headerMenuId: page.layoutSettings?.headerMenuId || null,
      footerMenuId: page.layoutSettings?.footerMenuId || null,
      headerStyle: page.layoutSettings?.headerStyle || 'default',
      footerStyle: page.layoutSettings?.footerStyle || 'default',
    },
  });

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Update parent immediately
    const updatedPage = {
      ...page,
      ...newFormData,
      content: field === 'content' && !value ? undefined : (field === 'content' ? value : page.content),
      seoKeywords: field === 'seoKeywords' ? value.split(',').map((k: string) => k.trim()).filter(Boolean) : page.seoKeywords,
    };
    onUpdate(updatedPage);
  };

  const handleLayoutChange = (field: string, value: any) => {
    const newLayoutSettings = { ...formData.layoutSettings, [field]: value };
    setFormData({ ...formData, layoutSettings: newLayoutSettings });
    
    const updatedPage = {
      ...page,
      ...formData,
      layoutSettings: newLayoutSettings,
      seoKeywords: formData.seoKeywords.split(',').map((k: string) => k.trim()).filter(Boolean),
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
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
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
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleInputChange('status', value as PageStatus)}
          >
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
      
      <TabsContent value="layout" className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Header Settings</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hasHeader">Show Header</Label>
              <p className="text-xs text-gray-500">Display website header on this page</p>
            </div>
            <Switch
              id="hasHeader"
              checked={formData.layoutSettings.hasHeader}
              onCheckedChange={(checked) => handleLayoutChange('hasHeader', checked)}
            />
          </div>
          
          {formData.layoutSettings.hasHeader && (
            <>
              <div>
                <Label htmlFor="headerStyle">Header Style</Label>
                <Select 
                  value={formData.layoutSettings.headerStyle} 
                  onValueChange={(value) => handleLayoutChange('headerStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="transparent">Transparent</SelectItem>
                    <SelectItem value="fixed">Fixed Top</SelectItem>
                    <SelectItem value="sticky">Sticky</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Default: Normal header | Transparent: Overlay on hero | Fixed/Sticky: Stay on scroll
                </p>
              </div>
              
              <div>
                <Label htmlFor="headerMenuId">Header Menu (Optional)</Label>
                <Input
                  id="headerMenuId"
                  value={formData.layoutSettings.headerMenuId || ''}
                  onChange={(e) => handleLayoutChange('headerMenuId', e.target.value || null)}
                  placeholder="Leave empty for default menu"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Custom menu ID to use for this page's header
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Footer Settings</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hasFooter">Show Footer</Label>
              <p className="text-xs text-gray-500">Display website footer on this page</p>
            </div>
            <Switch
              id="hasFooter"
              checked={formData.layoutSettings.hasFooter}
              onCheckedChange={(checked) => handleLayoutChange('hasFooter', checked)}
            />
          </div>
          
          {formData.layoutSettings.hasFooter && (
            <>
              <div>
                <Label htmlFor="footerStyle">Footer Style</Label>
                <Select 
                  value={formData.layoutSettings.footerStyle} 
                  onValueChange={(value) => handleLayoutChange('footerStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="extended">Extended</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Default: Standard footer | Minimal: Compact | Extended: Full with columns
                </p>
              </div>
              
              <div>
                <Label htmlFor="footerMenuId">Footer Menu (Optional)</Label>
                <Input
                  id="footerMenuId"
                  value={formData.layoutSettings.footerMenuId || ''}
                  onChange={(e) => handleLayoutChange('footerMenuId', e.target.value || null)}
                  placeholder="Leave empty for default menu"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Custom menu ID to use for this page's footer
                </p>
              </div>
            </>
          )}
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
