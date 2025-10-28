'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { Page, PageStatus } from '@/types/page-builder';

/**
 * Vietnamese character transliteration map
 * Converts Vietnamese characters to their ASCII equivalents
 */
const VIETNAMESE_CHAR_MAP: Record<string, string> = {
  // Lowercase
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd',
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  // Uppercase
  'À': 'a', 'Á': 'a', 'Ả': 'a', 'Ã': 'a', 'Ạ': 'a',
  'Ă': 'a', 'Ằ': 'a', 'Ắ': 'a', 'Ẳ': 'a', 'Ẵ': 'a', 'Ặ': 'a',
  'Â': 'a', 'Ầ': 'a', 'Ấ': 'a', 'Ẩ': 'a', 'Ẫ': 'a', 'Ậ': 'a',
  'Đ': 'd',
  'È': 'e', 'É': 'e', 'Ẻ': 'e', 'Ẽ': 'e', 'Ẹ': 'e',
  'Ê': 'e', 'Ề': 'e', 'Ế': 'e', 'Ể': 'e', 'Ễ': 'e', 'Ệ': 'e',
  'Ì': 'i', 'Í': 'i', 'Ỉ': 'i', 'Ĩ': 'i', 'Ị': 'i',
  'Ò': 'o', 'Ó': 'o', 'Ỏ': 'o', 'Õ': 'o', 'Ọ': 'o',
  'Ô': 'o', 'Ồ': 'o', 'Ố': 'o', 'Ổ': 'o', 'Ỗ': 'o', 'Ộ': 'o',
  'Ơ': 'o', 'Ờ': 'o', 'Ớ': 'o', 'Ở': 'o', 'Ỡ': 'o', 'Ợ': 'o',
  'Ù': 'u', 'Ú': 'u', 'Ủ': 'u', 'Ũ': 'u', 'Ụ': 'u',
  'Ư': 'u', 'Ừ': 'u', 'Ứ': 'u', 'Ử': 'u', 'Ữ': 'u', 'Ự': 'u',
  'Ỳ': 'y', 'Ý': 'y', 'Ỷ': 'y', 'Ỹ': 'y', 'Ỵ': 'y',
};

/**
 * Transliterate Vietnamese text to ASCII slug format
 * Example: "Về Chúng Tôi" -> "ve-chung-toi"
 */
function transliterateToSlug(text: string): string {
  if (!text) return '';
  
  // Convert Vietnamese characters to ASCII
  let slug = text
    .split('')
    .map(char => VIETNAMESE_CHAR_MAP[char] || char)
    .join('');
  
  // Convert to lowercase
  slug = slug.toLowerCase();
  
  // Replace spaces and non-alphanumeric characters with hyphens
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/-+/g, '-')            // Replace multiple hyphens with single
    .trim();
  
  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
}

/**
 * Page Settings Form Component
 * 
 * Form for editing page metadata:
 * - General: Title, slug, status, description
 * - SEO: SEO title, description, keywords
 * - Layout: Header/Footer settings
 * 
 * Features:
 * - Status change confirmation with visual feedback
 * - Auto-generate slug from title
 * - Layout settings for header/footer customization
 * - SEO metadata editing
 */
interface PageSettingsFormProps {
  page: Page;
  onUpdate: (page: Page) => void;
}

// Helper function to get status information with icons and descriptions
const getStatusDescription = (status: PageStatus) => {
  switch (status) {
    case PageStatus.DRAFT:
      return {
        title: 'Draft (Bản Nháp)',
        description: 'Trang này đang được soạn thảo. Không hiển thị công khai cho khách truy cập.',
        icon: <AlertCircle className="w-5 h-5" />,
        color: 'text-yellow-600',
      };
    case PageStatus.PUBLISHED:
      return {
        title: 'Published (Xuất Bản)',
        description: 'Trang này đang hiển thị công khai. Tất cả khách truy cập có thể xem.',
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'text-green-600',
      };
    case PageStatus.ARCHIVED:
      return {
        title: 'Archived (Lưu Trữ)',
        description: 'Trang này được lưu trữ. Không hiển thị công khai nhưng vẫn có thể khôi phục.',
        icon: <Lock className="w-5 h-5" />,
        color: 'text-gray-600',
      };
  }
};

export default function PageSettingsForm({ page, onUpdate }: PageSettingsFormProps) {
  const [formData, setFormData] = useState({
    title: page.title || '',
    slug: page.slug || '',
    content: (page.content && typeof page.content === 'string') ? page.content : '',
    status: page.status,
    isHomepage: page.isHomepage ?? false,
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

  const [isSlugAutoGenerated, setIsSlugAutoGenerated] = useState(page.slug === '' || page.slug?.startsWith('untitled'));
  const [showStatusChangeDialog, setShowStatusChangeDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<PageStatus | null>(null);

  const currentStatusInfo = getStatusDescription(formData.status);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    // Special handling for status change - show confirmation dialog
    if (field === 'status' && value !== formData.status) {
      setPendingStatus(value as PageStatus);
      setShowStatusChangeDialog(true);
      return;
    }

    const newFormData = { ...formData, [field]: value };
    
    // Auto-generate slug from title when title changes and slug was auto-generated
    if (field === 'title' && isSlugAutoGenerated) {
      const generatedSlug = transliterateToSlug(value);
      newFormData.slug = generatedSlug;
    }
    
    // Mark slug as manually edited if user changes it directly
    if (field === 'slug') {
      setIsSlugAutoGenerated(false);
    }
    
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

  // Confirm status change
  const handleConfirmStatusChange = () => {
    if (pendingStatus) {
      setFormData({ ...formData, status: pendingStatus });
      const updatedPage = {
        ...page,
        ...formData,
        status: pendingStatus,
        seoKeywords: formData.seoKeywords.split(',').map((k: string) => k.trim()).filter(Boolean),
      };
      onUpdate(updatedPage);
    }
    setShowStatusChangeDialog(false);
    setPendingStatus(null);
  };

  // Cancel status change
  const handleCancelStatusChange = () => {
    setShowStatusChangeDialog(false);
    setPendingStatus(null);
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
    const slug = transliterateToSlug(formData.title);
    handleInputChange('slug', slug);
    setIsSlugAutoGenerated(true);
  };

  return (
    <>
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
            <Label htmlFor="status">Page Status</Label>
            <div className="space-y-3">
              {/* Current Status Display */}
              <div className={`p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-start space-x-3 ${currentStatusInfo.color}`}>
                {currentStatusInfo.icon}
                <div className="flex-1">
                  <p className="font-semibold text-sm">{currentStatusInfo.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{currentStatusInfo.description}</p>
                </div>
              </div>

              {/* Status Selector */}
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value as PageStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PageStatus.DRAFT}>
                    <div className="flex items-center space-x-2">
                      <AlertCircle size={14} />
                      <span>Draft - Đang Soạn Thảo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={PageStatus.PUBLISHED}>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={14} />
                      <span>Published - Xuất Bản</span>
                    </div>
                  </SelectItem>
                  <SelectItem value={PageStatus.ARCHIVED}>
                    <div className="flex items-center space-x-2">
                      <Lock size={14} />
                      <span>Archived - Lưu Trữ</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isHomepage">Set as Homepage</Label>
                <p className="text-xs text-gray-500">Make this page accessible at http://localhost:12000/</p>
              </div>
              <Switch
                id="isHomepage"
                checked={formData.isHomepage}
                onCheckedChange={(checked) => {
                  setFormData({ ...formData, isHomepage: checked });
                  const updatedPage = {
                    ...page,
                    ...formData,
                    isHomepage: checked,
                    seoKeywords: formData.seoKeywords.split(',').map((k: string) => k.trim()).filter(Boolean),
                  };
                  onUpdate(updatedPage);
                }}
              />
            </div>
            {formData.isHomepage && (
              <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-900">
                  ✓ Trang này sẽ được hiển thị là trang chủ (homepage) khi truy cập vào root URL. 
                  Chỉ một trang có thể được đặt làm trang chủ.
                </p>
              </div>
            )}
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

      {/* Status Change Confirmation Dialog */}
      <Dialog open={showStatusChangeDialog} onOpenChange={setShowStatusChangeDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xác Nhận Thay Đổi Trạng Thái</DialogTitle>
            <DialogDescription>
              Bạn đang chuẩn bị thay đổi trạng thái trang. Vui lòng xác nhận hành động này.
            </DialogDescription>
          </DialogHeader>

          {pendingStatus && (
            <div className="space-y-4 py-4">
              {/* Current Status */}
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Trạng Thái Hiện Tại</p>
                <div className={`p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center space-x-2 ${getStatusDescription(formData.status).color}`}>
                  {getStatusDescription(formData.status).icon}
                  <span className="text-sm">{getStatusDescription(formData.status).title}</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-center text-gray-400">↓</div>

              {/* New Status */}
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Trạng Thái Mới</p>
                <div className={`p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center space-x-2 ${getStatusDescription(pendingStatus).color}`}>
                  {getStatusDescription(pendingStatus).icon}
                  <span className="text-sm">{getStatusDescription(pendingStatus).title}</span>
                </div>
              </div>

              {/* Status Info */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-900">{getStatusDescription(pendingStatus).description}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelStatusChange}>
              Hủy Bỏ
            </Button>
            <Button onClick={handleConfirmStatusChange}>
              Xác Nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
