/**
 * API Test Page
 * URL: /test-api
 * Test all REST API endpoints
 */

export default function ApiTestPage() {
  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">🧪 API Endpoints Test</h1>

      <div className="space-y-6">
        {/* Blog API */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">📝 Blog API</h2>
          <div className="space-y-2">
            <TestEndpoint
              method="GET"
              endpoint="/api/blog"
              description="Get all published blog posts"
            />
            <TestEndpoint
              method="GET"
              endpoint="/api/blog?page=1&limit=5"
              description="Get blog posts with pagination"
            />
            <TestEndpoint
              method="GET"
              endpoint="/api/blog/test-post"
              description="Get single blog post by slug (replace 'test-post' with actual slug)"
            />
          </div>
        </section>

        {/* Categories API */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">🏷️ Categories API</h2>
          <div className="space-y-2">
            <TestEndpoint
              method="GET"
              endpoint="/api/categories"
              description="Get all categories"
            />
            <TestEndpoint
              method="GET"
              endpoint="/api/categories?tree=true"
              description="Get categories tree structure"
            />
          </div>
        </section>

        {/* Tags API */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">🔖 Tags API</h2>
          <div className="space-y-2">
            <TestEndpoint
              method="GET"
              endpoint="/api/tags"
              description="Get all tags"
            />
            <TestEndpoint
              method="GET"
              endpoint="/api/tags?popular=true&limit=10"
              description="Get popular tags"
            />
          </div>
        </section>

        {/* Pages API */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">📄 Pages API</h2>
          <div className="space-y-2">
            <TestEndpoint
              method="GET"
              endpoint="/api/pages"
              description="Get all published pages"
            />
            <TestEndpoint
              method="GET"
              endpoint="/api/pages/about"
              description="Get single page by slug (replace 'about' with actual slug)"
            />
          </div>
        </section>

        {/* Settings API */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">⚙️ Settings API</h2>
          <div className="space-y-2">
            <TestEndpoint
              method="GET"
              endpoint="/api/settings"
              description="Get all public settings"
            />
            <TestEndpoint
              method="GET"
              endpoint="/api/settings?group=seo"
              description="Get SEO settings"
            />
            <TestEndpoint
              method="GET"
              endpoint="/api/settings?metadata=true"
              description="Get website metadata"
            />
          </div>
        </section>

        {/* Documentation */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📚 Full API Documentation</h3>
          <p className="text-blue-700 mb-4">
            For complete API documentation with examples and response formats, visit:
          </p>
          <a
            href="/api-docs"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View API Docs
          </a>
        </section>
      </div>
    </div>
  )
}

function TestEndpoint({ method, endpoint, description }: {
  method: string
  endpoint: string
  description: string
}) {
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${endpoint}`
    : endpoint

  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded border">
      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-mono rounded">
        {method}
      </span>
      <div className="flex-1">
        <div className="font-mono text-sm text-gray-900 mb-1">{endpoint}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <a
        href={endpoint}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
      >
        Test
      </a>
    </div>
  )
}
