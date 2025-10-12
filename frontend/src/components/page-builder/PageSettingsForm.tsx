'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Page, PageStatus } from '@/types/page-builder';

/**
 * Page Settings Form Component
 * 
 * Form for editing page metadata:
 * - General: Title, slug, status, description
 * - SEO: SEO title, description, keywords
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
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Update parent immediately
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
