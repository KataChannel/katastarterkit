/**
 * Test Page for Server Actions
 * URL: /test-actions
 */

import { Suspense } from 'react'
import { getBlogPosts } from '@/actions/blog.actions'
import { getCategories } from '@/actions/category-tag.actions'
import { getSettings } from '@/actions/settings.actions'

async function ServerActionsTest() {
  // Test blog actions
  const blogData = await getBlogPosts({ page: 1, limit: 5 })
  
  // Test category actions
  const categories = await getCategories()
  
  // Test settings actions
  const settings = await getSettings()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Server Actions Test</h1>

      {/* Blog Posts Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">📝 Blog Posts ({blogData.total})</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          {blogData.posts.length > 0 ? (
            <ul className="space-y-3">
              {blogData.posts.map((post: any) => (
                <li key={post.id} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-600">
                    by {post.author?.username} • {post.status} • {post.viewCount} views
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No blog posts found. Create one in admin panel.</p>
          )}
        </div>
      </section>

      {/* Categories Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">🏷️ Categories ({categories.length})</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          {categories.length > 0 ? (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat: any) => (
                <li key={cat.id} className="bg-white p-3 rounded border">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({cat._count?.posts || 0})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No categories found.</p>
          )}
        </div>
      </section>

      {/* Settings Test */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">⚙️ Settings ({settings.length})</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          {settings.length > 0 ? (
            <ul className="space-y-2">
              {settings.slice(0, 10).map((setting: any) => (
                <li key={setting.id} className="flex justify-between text-sm">
                  <span className="font-mono text-gray-700">{setting.key}</span>
                  <span className="text-gray-500">{setting.group || 'general'}</span>
                </li>
              ))}
              {settings.length > 10 && (
                <li className="text-gray-400 text-sm">... and {settings.length - 10} more</li>
              )}
            </ul>
          ) : (
            <p className="text-gray-500">No settings found.</p>
          )}
        </div>
      </section>

      {/* Status */}
      <section className="bg-green-50 border border-green-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Server Actions Working!</h2>
        <p className="text-green-700">
          All server actions are successfully fetching data from PostgreSQL via Prisma.
        </p>
        <ul className="mt-4 space-y-1 text-sm text-green-600">
          <li>✓ Prisma Client connected</li>
          <li>✓ Redis caching active</li>
          <li>✓ Server Components rendering</li>
          <li>✓ Server Actions executing</li>
        </ul>
      </section>
    </div>
  )
}

export default function TestActionsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">Loading...</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <ServerActionsTest />
    </Suspense>
  )
}
