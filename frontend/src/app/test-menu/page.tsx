'use client';

import { useEffect, useState } from 'react';
import { getPublicMenus } from '@/actions/menu.actions';

export default function TestMenuPage() {
  const [headerMenus, setHeaderMenus] = useState<any[]>([]);
  const [sidebarMenus, setSidebarMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenus() {
      try {
        const [headers, sidebars] = await Promise.all([
          getPublicMenus({ type: 'HEADER', isActive: true }),
          getPublicMenus({ type: 'SIDEBAR', isActive: true }),
        ]);
        
        setHeaderMenus(headers);
        setSidebarMenus(sidebars);
      } catch (error) {
        console.error('Error loading menus:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMenus();
  }, []);

  if (loading) {
    return <div className="p-8">Loading menus...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Menu Test Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Header Menus */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Header Menus ({headerMenus.length})
          </h2>
          <div className="space-y-2">
            {headerMenus.map((menu: any) => (
              <div key={menu.id} className="p-3 bg-gray-50 rounded">
                <div className="font-medium">{menu.title}</div>
                <div className="text-sm text-gray-600">URL: {menu.url}</div>
                <div className="text-sm text-gray-500">Order: {menu.order}</div>
                {menu.children && menu.children.length > 0 && (
                  <div className="mt-2 ml-4 space-y-1">
                    {menu.children.map((child: any) => (
                      <div key={child.id} className="text-sm p-2 bg-white rounded">
                        └─ {child.title} ({child.url})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Menus */}
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">
            Sidebar Menus ({sidebarMenus.length})
          </h2>
          <div className="space-y-2">
            {sidebarMenus.map((menu: any) => (
              <div key={menu.id} className="p-3 bg-gray-50 rounded">
                <div className="font-medium">{menu.title}</div>
                <div className="text-sm text-gray-600">URL: {menu.url}</div>
                <div className="text-sm text-gray-500">Order: {menu.order}</div>
                {menu.children && menu.children.length > 0 && (
                  <div className="mt-2 ml-4 space-y-1">
                    {menu.children.map((child: any) => (
                      <div key={child.id} className="text-sm p-2 bg-white rounded">
                        └─ {child.title} ({child.url})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Debug Info</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify({ headerMenus, sidebarMenus }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
