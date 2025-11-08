'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Palette,
  Globe,
  MessageSquare,
  BarChart,
  Layout,
  Mail,
  MessageCircle,
  Shield
} from 'lucide-react';
import { getSettings, upsertSetting } from '@/actions/settings.actions';
import type { WebsiteSetting } from '@/hooks/useWebsiteSettings';

const CATEGORIES = [
  { value: 'GENERAL', label: 'Chung', icon: Globe },
  { value: 'HEADER', label: 'Header', icon: Layout },
  { value: 'FOOTER', label: 'Footer', icon: Layout },
  { value: 'CONTACT', label: 'Liên hệ', icon: Mail },
  { value: 'SOCIAL', label: 'Mạng xã hội', icon: MessageSquare },
  { value: 'SEO', label: 'SEO', icon: BarChart },
  { value: 'SUPPORT_CHAT', label: 'Support Chat', icon: MessageCircle },
  { value: 'AUTH', label: 'Xác thực', icon: Shield },
];

export default function WebsiteSettingsPage() {
  const [selectedCategory, setSelectedCategory] = useState('GENERAL');
  const [editedSettings, setEditedSettings] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch settings from server
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      
      // Map database fields to expected format
      const mappedData = (data || []).map((setting: any) => {
        // Determine category based on key prefix
        let category = 'GENERAL';
        const key = setting.key;
        
        // Handle keys with underscore (auth_login_redirect)
        if (key.startsWith('auth_')) {
          category = 'AUTH';
        }
        // Handle keys with dot notation (header.logo)
        else {
          const keyPrefix = key.split('.')[0];
          
          switch (keyPrefix) {
            case 'header':
              category = 'HEADER';
              break;
            case 'footer':
              category = 'FOOTER';
              break;
            case 'contact':
              category = 'CONTACT';
              break;
            case 'social':
              category = 'SOCIAL';
              break;
            case 'seo':
              category = 'SEO';
              break;
            case 'support_chat':
              category = 'SUPPORT_CHAT';
              break;
            case 'site':
            case 'appearance':
              category = 'GENERAL';
              break;
            default:
              category = 'GENERAL';
          }
        }
        
        return {
          ...setting,
          category,
          label: setting.key.split('.').pop()?.replace(/_/g, ' ') || setting.key,
          description: null,
          order: 0,
          isActive: true,
          isPublic: true,
          type: (setting.type || 'string').toUpperCase(),
        };
      });
      
      setSettings(mappedData);
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings([]);
    } finally {
      setLoading(false);
    }
  };

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Initialize sample settings if database is empty
  const initializeSampleSettings = async () => {
    try {
      setUpdating(true);
      
      const sampleSettings = [
        { key: 'site_name', value: 'My Website', type: 'string', group: 'general' },
        { key: 'site_tagline', value: 'Welcome to our website', type: 'string', group: 'general' },
        { key: 'site_description', value: 'Website description', type: 'string', group: 'general' },
        { key: 'contact_email', value: 'info@example.com', type: 'string', group: 'contact' },
        { key: 'contact_phone', value: '+1234567890', type: 'string', group: 'contact' },
        { key: 'facebook_url', value: '', type: 'string', group: 'social' },
        { key: 'twitter_url', value: '', type: 'string', group: 'social' },
        { key: 'instagram_url', value: '', type: 'string', group: 'social' },
      ];

      for (const setting of sampleSettings) {
        await upsertSetting(setting);
      }

      alert('✅ Đã khởi tạo cài đặt mẫu thành công!');
      await fetchSettings();
    } catch (error) {
      console.error('Error initializing settings:', error);
      alert('❌ Có lỗi khi khởi tạo cài đặt. Vui lòng kiểm tra console.');
    } finally {
      setUpdating(false);
    }
  };

  // Filter settings by category and sort by order
  const categorySettings = (settings && Array.isArray(settings) ? settings as any[] : [])
    .filter((s: any) => s.category === selectedCategory)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  // Group settings by their group
  const groupedSettings = categorySettings.reduce((acc: any, setting: any) => {
    const group = setting.group || 'other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(setting);
    return acc;
  }, {} as Record<string, WebsiteSetting[]>);

  // Handle setting value change
  const handleChange = (key: string, value: any, type: string) => {
    let processedValue = value;

    // Convert value based on type
    if (type === 'BOOLEAN') {
      processedValue = value ? 'true' : 'false';
    } else if (type === 'NUMBER') {
      processedValue = String(value);
    } else if (type === 'JSON') {
      try {
        processedValue = JSON.stringify(value);
      } catch (e) {
        processedValue = value;
      }
    }

    setEditedSettings(prev => ({
      ...prev,
      [key]: processedValue,
    }));
    setHasChanges(true);
  };

  // Get current value (edited or original)
  const getValue = (setting: WebsiteSetting) => {
    if (editedSettings[setting.key] !== undefined) {
      return editedSettings[setting.key];
    }
    return setting.value;
  };

  // Parse value based on type
  const parseValue = (value: any, type: string) => {
    if (!value) return type === 'BOOLEAN' ? false : '';

    switch (type) {
      case 'BOOLEAN':
        return value === 'true';
      case 'NUMBER':
        return parseFloat(value) || 0;
      case 'JSON':
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      default:
        return value;
    }
  };

  // Save all changes
  const handleSave = async () => {
    try {
      setUpdating(true);
      
      const updatePromises = Object.entries(editedSettings).map(async ([key, value]) => {
        // Find setting to get type and group
        const setting = (settings && Array.isArray(settings) ? settings as any[] : [])?.find((s: any) => s.key === key);
        if (!setting) {
          console.warn(`Setting not found for key: ${key}`);
          return;
        }

        // Use Server Action to update
        await upsertSetting({
          key,
          value,
          type: setting.type,
          group: setting.group,
        });
      });

      await Promise.all(updatePromises);

      console.log('✅ Đã lưu settings');

      setEditedSettings({});
      setHasChanges(false);
      
      // Reload settings
      await fetchSettings();
    } catch (error: any) {
      console.error('❌ Lỗi:', error.message || 'Không thể lưu settings');
      alert('Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại.');
    } finally {
      setUpdating(false);
    }
  };

  // Reset changes
  const handleReset = () => {
    setEditedSettings({});
    setHasChanges(false);
  };

  // Render input based on type
  const renderInput = (setting: WebsiteSetting) => {
    const value = getValue(setting);
    const parsedValue = parseValue(value, setting.type);

    switch (setting.type) {
      case 'BOOLEAN':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={setting.key}
              checked={parsedValue}
              onCheckedChange={(checked) => handleChange(setting.key, checked, setting.type)}
            />
            <Label htmlFor={setting.key} className="cursor-pointer">
              {parsedValue ? 'Bật' : 'Tắt'}
            </Label>
          </div>
        );

      case 'TEXTAREA':
        return (
          <Textarea
            id={setting.key}
            value={parsedValue}
            onChange={(e) => handleChange(setting.key, e.target.value, setting.type)}
            rows={3}
            className="w-full"
          />
        );

      case 'NUMBER':
        return (
          <Input
            id={setting.key}
            type="number"
            value={parsedValue}
            onChange={(e) => handleChange(setting.key, e.target.value, setting.type)}
            className="w-full"
          />
        );

      case 'COLOR':
        return (
          <div className="flex items-center space-x-2">
            <Input
              id={setting.key}
              type="color"
              value={parsedValue || '#000000'}
              onChange={(e) => handleChange(setting.key, e.target.value, setting.type)}
              className="w-20 h-10"
            />
            <Input
              type="text"
              value={parsedValue || ''}
              onChange={(e) => handleChange(setting.key, e.target.value, setting.type)}
              className="flex-1"
              placeholder="#000000"
            />
          </div>
        );

      case 'IMAGE':
      case 'URL':
        return (
          <div className="space-y-2">
            <Input
              id={setting.key}
              type="text"
              value={parsedValue}
              onChange={(e) => handleChange(setting.key, e.target.value, setting.type)}
              className="w-full"
              placeholder={setting.type === 'IMAGE' ? '/path/to/image.jpg' : 'https://example.com'}
            />
            {setting.type === 'IMAGE' && parsedValue && (
              <img src={parsedValue} alt="Preview" className="max-w-xs max-h-32 object-contain border rounded" />
            )}
          </div>
        );

      case 'SELECT':
        // Parse options - có thể là JSON string hoặc array
        let options: string[] = [];
        try {
          if (typeof setting.options === 'string') {
            options = JSON.parse(setting.options);
          } else if (Array.isArray(setting.options)) {
            options = setting.options;
          } else if (setting.options && typeof setting.options === 'object') {
            // Nếu là object, lấy values hoặc convert thành array
            options = Object.values(setting.options as Record<string, any>);
          }
        } catch (e) {
          console.error('Error parsing options for', setting.key, e);
          options = [];
        }
        
        return (
          <Select
            value={parsedValue}
            onValueChange={(val) => handleChange(setting.key, val, setting.type)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn..." />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt: string) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default: // TEXT
        return (
          <Input
            id={setting.key}
            type="text"
            value={parsedValue}
            onChange={(e) => handleChange(setting.key, e.target.value, setting.type)}
            className="w-full"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show initialization prompt if no settings
  if (!settings || settings.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Chưa có cài đặt
            </CardTitle>
            <CardDescription>
              Database chưa có dữ liệu cài đặt. Bạn có muốn khởi tạo các cài đặt mẫu không?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={initializeSampleSettings} disabled={updating}>
              {updating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Đang khởi tạo...
                </>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-2" />
                  Khởi tạo cài đặt mẫu
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Hoặc bạn có thể chạy lệnh: <code className="bg-muted px-2 py-1 rounded">npm run db:seed</code>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Cài đặt Website
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý tất cả các cài đặt của website
          </p>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={updating}>
              <Save className="w-4 h-4 mr-2" />
              {updating ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        )}
      </div>

      {/* Categories Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className={`grid grid-cols-${CATEGORIES.length} w-full`}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <TabsTrigger key={cat.value} value={cat.value} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {cat.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {CATEGORIES.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="space-y-6 mt-6">
            {Object.entries(groupedSettings).map(([group, groupSettings]) => (
              <Card key={group}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {group === 'other' ? 'Khác' : group.replace(/_/g, ' ')}
                  </CardTitle>
                  <CardDescription>
                    {(groupSettings as any[]).length} cài đặt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(groupSettings as any[]).map((setting: any) => (
                    <div key={setting.id} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Label htmlFor={setting.key} className="text-base font-semibold">
                            {setting.label}
                          </Label>
                          {setting.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {setting.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {setting.type}
                          </Badge>
                          {setting.isPublic ? (
                            <span title="Public"><Eye className="w-4 h-4 text-green-500" /></span>
                          ) : (
                            <span title="Private"><EyeOff className="w-4 h-4 text-gray-400" /></span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        {renderInput(setting)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Key: <code className="bg-muted px-1 py-0.5 rounded">{setting.key}</code>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}

            {Object.keys(groupedSettings).length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Chưa có cài đặt nào trong danh mục này
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
