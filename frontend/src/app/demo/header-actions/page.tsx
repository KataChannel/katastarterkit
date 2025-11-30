'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HeaderActions,
  AppModule,
  UserMenuItem,
  DEFAULT_APP_MODULES,
  DEFAULT_USER_MENU_ITEMS,
  DEFAULT_GUEST_MENU_ITEMS,
  ADMIN_APP_MODULES,
  LMS_APP_MODULES,
  INSTRUCTOR_APP_MODULES,
  STUDENT_USER_MENU,
  INSTRUCTOR_USER_MENU,
} from '@/components/layout/HeaderActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Shield,
  GraduationCap,
  ShoppingCart,
  Globe,
  FileText,
  Briefcase,
  LayoutDashboard,
  ArrowLeft,
  Code,
  Eye,
  Copy,
  Check,
} from 'lucide-react';

// Custom modules for E-commerce
const ECOMMERCE_MODULES: AppModule[] = [
  {
    id: 'products',
    name: 'Sản phẩm',
    icon: ShoppingCart,
    href: '/admin/products',
    color: 'bg-pink-500',
    requireAuth: true,
  },
  {
    id: 'orders',
    name: 'Đơn hàng',
    icon: Briefcase,
    href: '/admin/orders',
    color: 'bg-rose-500',
    requireAuth: true,
  },
  {
    id: 'categories',
    name: 'Danh mục',
    icon: FileText,
    href: '/admin/categories',
    color: 'bg-orange-500',
    requireAuth: true,
  },
  {
    id: 'analytics',
    name: 'Thống kê',
    icon: LayoutDashboard,
    href: '/admin/analytics',
    color: 'bg-blue-500',
    requireAuth: true,
  },
];

// Custom modules for Content Editor
const CONTENT_EDITOR_MODULES: AppModule[] = [
  {
    id: 'blog',
    name: 'Blog',
    icon: FileText,
    href: '/admin/blog',
    color: 'bg-orange-500',
    requireAuth: true,
  },
  {
    id: 'pages',
    name: 'Trang',
    icon: Globe,
    href: '/admin/pagebuilder',
    color: 'bg-teal-500',
    requireAuth: true,
  },
  {
    id: 'media',
    name: 'Media',
    icon: '🖼️',
    href: '/admin/filemanager',
    color: 'bg-purple-500',
    requireAuth: true,
  },
];

// Code snippets for examples
const CODE_SNIPPETS = {
  basic: `<HeaderActions
  variant="light"
  showNotifications={true}
  showApps={true}
  showUser={true}
  showChat={true}
/>`,
  dark: `<HeaderActions
  variant="dark"
  showNotifications={true}
  showApps={true}
  showUser={true}
  showChat={true}
/>`,
  admin: `import { ADMIN_APP_MODULES } from '@/components/layout/HeaderActions';

<HeaderActions
  variant="dark"
  appModules={ADMIN_APP_MODULES}
  showNotifications={true}
  showApps={true}
  showUser={true}
  showChat={true}
/>`,
  lms: `import { LMS_APP_MODULES } from '@/components/layout/HeaderActions';

<HeaderActions
  variant="light"
  appModules={LMS_APP_MODULES}
  showNotifications={true}
  showApps={true}
  showUser={true}
  showChat={true}
/>`,
  instructor: `import { 
  INSTRUCTOR_APP_MODULES, 
  INSTRUCTOR_USER_MENU 
} from '@/components/layout/HeaderActions';

<HeaderActions
  variant="dark"
  appModules={INSTRUCTOR_APP_MODULES}
  userMenuItems={INSTRUCTOR_USER_MENU}
  showNotifications={true}
  showApps={true}
  showUser={true}
  showChat={true}
/>`,
  student: `import { 
  LMS_APP_MODULES, 
  STUDENT_USER_MENU 
} from '@/components/layout/HeaderActions';

<HeaderActions
  variant="light"
  appModules={LMS_APP_MODULES}
  userMenuItems={STUDENT_USER_MENU}
  showNotifications={true}
  showApps={true}
  showUser={true}
  showChat={true}
/>`,
  ecommerce: `const ECOMMERCE_MODULES: AppModule[] = [
  {
    id: 'products',
    name: 'Sản phẩm',
    icon: ShoppingCart,
    href: '/admin/products',
    color: 'bg-pink-500',
    requireAuth: true,
  },
  // ... more modules
];

<HeaderActions
  variant="light"
  appModules={ECOMMERCE_MODULES}
/>`,
  customLogout: `const handleCustomLogout = async () => {
  // Custom logout logic
  localStorage.removeItem('custom-data');
  await customLogoutApi();
  window.location.href = '/goodbye';
};

<HeaderActions
  variant="light"
  onLogout={handleCustomLogout}
/>`,
  customChat: `const handleChatClick = () => {
  // Open custom chat widget
  // openCrisp();
  // openIntercom();
  // openTawk();
};

<HeaderActions
  variant="light"
  onChatClick={handleChatClick}
/>`,
};

// Example component wrapper
function ExampleCard({
  title,
  description,
  children,
  code,
  isDark = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  code: string;
  isDark?: boolean;
}) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? <Eye className="h-4 w-4 mr-1" /> : <Code className="h-4 w-4 mr-1" />}
              {showCode ? 'Preview' : 'Code'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showCode ? (
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{code}</code>
          </pre>
        ) : (
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex justify-end">
              {children}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function HeaderActionsDemo() {
  // Interactive playground state
  const [variant, setVariant] = useState<'light' | 'dark'>('light');
  const [showNotifications, setShowNotifications] = useState(true);
  const [showApps, setShowApps] = useState(true);
  const [showUser, setShowUser] = useState(true);
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/demo" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">HeaderActions Demo</h1>
                <p className="text-sm text-gray-500">Component hướng dẫn sử dụng</p>
              </div>
            </div>
            <Badge variant="secondary">v1.0</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Giới thiệu</CardTitle>
            <CardDescription>
              HeaderActions là component cung cấp các action cho header bao gồm: Notifications, Apps Menu, User Menu và Chat Widget.
              Component hỗ trợ dynamic menu và phân quyền theo roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl mb-2">🔔</div>
                <div className="text-sm font-medium">Notifications</div>
                <div className="text-xs text-gray-500">Thông báo realtime</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl mb-2">⊞</div>
                <div className="text-sm font-medium">Apps Menu</div>
                <div className="text-xs text-gray-500">Chuyển đổi ứng dụng</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-2xl mb-2">👤</div>
                <div className="text-sm font-medium">User Menu</div>
                <div className="text-xs text-gray-500">Dynamic avatar & menu</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <div className="text-2xl mb-2">💬</div>
                <div className="text-sm font-medium">Chat Widget</div>
                <div className="text-xs text-gray-500">Hỗ trợ trực tuyến</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Playground */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🎮 Playground</CardTitle>
            <CardDescription>
              Tùy chỉnh các props để xem component thay đổi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Controls */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <Switch
                    id="variant"
                    checked={variant === 'dark'}
                    onCheckedChange={(v) => setVariant(v ? 'dark' : 'light')}
                  />
                  <Label htmlFor="variant">Dark Mode</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="notifications"
                    checked={showNotifications}
                    onCheckedChange={setShowNotifications}
                  />
                  <Label htmlFor="notifications">Notifications</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="apps"
                    checked={showApps}
                    onCheckedChange={setShowApps}
                  />
                  <Label htmlFor="apps">Apps</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="user"
                    checked={showUser}
                    onCheckedChange={setShowUser}
                  />
                  <Label htmlFor="user">User</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="chat"
                    checked={showChat}
                    onCheckedChange={setShowChat}
                  />
                  <Label htmlFor="chat">Chat</Label>
                </div>
              </div>

              {/* Preview */}
              <div className={`p-6 rounded-lg border ${variant === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="flex justify-end">
                  <HeaderActions
                    variant={variant}
                    showNotifications={showNotifications}
                    showApps={showApps}
                    showUser={showUser}
                    showChat={showChat}
                  />
                </div>
              </div>

              {/* Generated Code */}
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`<HeaderActions
  variant="${variant}"
  showNotifications={${showNotifications}}
  showApps={${showApps}}
  showUser={${showUser}}
  showChat={${showChat}}
/>`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>

          {/* Basic Examples */}
          <TabsContent value="basic" className="space-y-6">
            <ExampleCard
              title="Basic Usage"
              description="Sử dụng mặc định với tất cả các tính năng"
              code={CODE_SNIPPETS.basic}
            >
              <HeaderActions
                variant="light"
                showNotifications={true}
                showApps={true}
                showUser={true}
                showChat={true}
              />
            </ExampleCard>
          </TabsContent>

          {/* Theme Examples */}
          <TabsContent value="themes" className="space-y-6">
            <ExampleCard
              title="Light Theme"
              description="Sử dụng cho header sáng"
              code={CODE_SNIPPETS.basic}
            >
              <HeaderActions variant="light" />
            </ExampleCard>

            <ExampleCard
              title="Dark Theme"
              description="Sử dụng cho header tối (Admin, LMS Admin...)"
              code={CODE_SNIPPETS.dark}
              isDark
            >
              <HeaderActions variant="dark" />
            </ExampleCard>
          </TabsContent>

          {/* Preset Examples */}
          <TabsContent value="presets" className="space-y-6">
            <ExampleCard
              title="Admin Panel"
              description="Preset cho trang quản trị"
              code={CODE_SNIPPETS.admin}
              isDark
            >
              <HeaderActions variant="dark" appModules={ADMIN_APP_MODULES} />
            </ExampleCard>

            <ExampleCard
              title="LMS Platform"
              description="Preset cho nền tảng học tập"
              code={CODE_SNIPPETS.lms}
            >
              <HeaderActions variant="light" appModules={LMS_APP_MODULES} />
            </ExampleCard>

            <ExampleCard
              title="Instructor Dashboard"
              description="Preset cho giảng viên"
              code={CODE_SNIPPETS.instructor}
              isDark
            >
              <HeaderActions
                variant="dark"
                appModules={INSTRUCTOR_APP_MODULES}
                userMenuItems={INSTRUCTOR_USER_MENU}
              />
            </ExampleCard>

            <ExampleCard
              title="Student View"
              description="Preset cho học viên"
              code={CODE_SNIPPETS.student}
            >
              <HeaderActions
                variant="light"
                appModules={LMS_APP_MODULES}
                userMenuItems={STUDENT_USER_MENU}
              />
            </ExampleCard>

            <ExampleCard
              title="E-commerce Manager"
              description="Custom modules cho quản lý bán hàng"
              code={CODE_SNIPPETS.ecommerce}
            >
              <HeaderActions variant="light" appModules={ECOMMERCE_MODULES} />
            </ExampleCard>

            <ExampleCard
              title="Content Editor"
              description="Custom modules cho biên tập viên"
              code={CODE_SNIPPETS.ecommerce}
            >
              <HeaderActions variant="light" appModules={CONTENT_EDITOR_MODULES} showChat={false} />
            </ExampleCard>
          </TabsContent>

          {/* Custom Examples */}
          <TabsContent value="custom" className="space-y-6">
            <ExampleCard
              title="Custom Logout Handler"
              description="Xử lý logout tùy chỉnh"
              code={CODE_SNIPPETS.customLogout}
            >
              <HeaderActions
                variant="light"
                onLogout={async () => {
                  alert('Custom logout handler!');
                }}
              />
            </ExampleCard>

            <ExampleCard
              title="Custom Chat Handler"
              description="Xử lý chat tùy chỉnh (Crisp, Intercom, Tawk...)"
              code={CODE_SNIPPETS.customChat}
            >
              <HeaderActions
                variant="light"
                onChatClick={() => {
                  alert('Custom chat handler!');
                }}
              />
            </ExampleCard>
          </TabsContent>

          {/* Roles Documentation */}
          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hệ thống phân quyền</CardTitle>
                <CardDescription>
                  HeaderActions hỗ trợ 2 loại phân quyền: roleType và RBAC roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Role Types */}
                <div>
                  <h4 className="font-semibold mb-3">1. System Role Types</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 border rounded-lg">
                      <Badge className="mb-2">ADMIN</Badge>
                      <p className="text-xs text-gray-500">Quản trị viên hệ thống</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <Badge variant="secondary" className="mb-2">USER</Badge>
                      <p className="text-xs text-gray-500">Người dùng thông thường</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <Badge variant="outline" className="mb-2">GUEST</Badge>
                      <p className="text-xs text-gray-500">Khách (chưa đăng nhập)</p>
                    </div>
                  </div>
                </div>

                {/* RBAC Roles */}
                <div>
                  <h4 className="font-semibold mb-3">2. RBAC Roles (Database)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'giangvien', desc: 'Giảng viên LMS' },
                      { name: 'content_manager', desc: 'Quản lý nội dung' },
                      { name: 'content_editor', desc: 'Biên tập viên' },
                      { name: 'product_manager', desc: 'Quản lý sản phẩm' },
                      { name: 'order_manager', desc: 'Quản lý đơn hàng' },
                      { name: 'blog_manager', desc: 'Quản lý blog' },
                      { name: 'blog_editor', desc: 'Biên tập blog' },
                      { name: 'ecommerce_manager', desc: 'Quản lý E-commerce' },
                      { name: 'page_builder_manager', desc: 'Quản lý Page Builder' },
                      { name: 'hr_manager', desc: 'Quản lý nhân sự' },
                      { name: 'accountant', desc: 'Kế toán' },
                      { name: 'affiliate_manager', desc: 'Quản lý affiliate' },
                    ].map((role) => (
                      <div key={role.name} className="p-3 border rounded-lg">
                        <code className="text-xs bg-gray-100 px-1 rounded">{role.name}</code>
                        <p className="text-xs text-gray-500 mt-1">{role.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Module Access Example */}
                <div>
                  <h4 className="font-semibold mb-3">3. Cách thiết lập phân quyền cho Module</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`const module: AppModule = {
  id: 'admin',
  name: 'Admin Panel',
  href: '/admin',
  icon: Shield,
  color: 'bg-red-500',
  
  // Option 1: Chỉ định roles cụ thể
  roles: ['ADMIN', 'content_manager'],
  
  // Option 2: Public - ai cũng thấy
  isPublic: true,
  
  // Option 3: Hidden - luôn ẩn
  isHidden: true,
  
  // Option 4: Yêu cầu đăng nhập (không cần role cụ thể)
  requireAuth: true,
};`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* API Reference */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📖 API Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Prop</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Default</th>
                    <th className="text-left p-3">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3"><code>variant</code></td>
                    <td className="p-3"><code>'light' | 'dark'</code></td>
                    <td className="p-3"><code>'light'</code></td>
                    <td className="p-3">Theme của component</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3"><code>showNotifications</code></td>
                    <td className="p-3"><code>boolean</code></td>
                    <td className="p-3"><code>true</code></td>
                    <td className="p-3">Hiển thị icon thông báo</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3"><code>showApps</code></td>
                    <td className="p-3"><code>boolean</code></td>
                    <td className="p-3"><code>true</code></td>
                    <td className="p-3">Hiển thị menu ứng dụng</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3"><code>showUser</code></td>
                    <td className="p-3"><code>boolean</code></td>
                    <td className="p-3"><code>true</code></td>
                    <td className="p-3">Hiển thị user menu</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3"><code>showChat</code></td>
                    <td className="p-3"><code>boolean</code></td>
                    <td className="p-3"><code>true</code></td>
                    <td className="p-3">Hiển thị chat widget</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3"><code>appModules</code></td>
                    <td className="p-3"><code>AppModule[]</code></td>
                    <td className="p-3"><code>DEFAULT_APP_MODULES</code></td>
                    <td className="p-3">Danh sách modules trong Apps menu</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3"><code>userMenuItems</code></td>
                    <td className="p-3"><code>UserMenuItem[]</code></td>
                    <td className="p-3"><code>DEFAULT_USER_MENU_ITEMS</code></td>
                    <td className="p-3">Danh sách items trong User menu</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3"><code>guestMenuItems</code></td>
                    <td className="p-3"><code>UserMenuItem[]</code></td>
                    <td className="p-3"><code>DEFAULT_GUEST_MENU_ITEMS</code></td>
                    <td className="p-3">Menu cho khách chưa đăng nhập</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3"><code>onLogout</code></td>
                    <td className="p-3"><code>() =&gt; Promise&lt;void&gt;</code></td>
                    <td className="p-3">-</td>
                    <td className="p-3">Custom logout handler</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3"><code>onChatClick</code></td>
                    <td className="p-3"><code>() =&gt; void</code></td>
                    <td className="p-3">-</td>
                    <td className="p-3">Custom chat click handler</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
