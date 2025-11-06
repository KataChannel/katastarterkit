/**
 * API Documentation Page
 * URL: /api-docs
 */

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">🚀 API Documentation</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          RESTful API endpoints for Innerbright CMS. All responses are in JSON format.
        </p>

        {/* Blog API */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">📝 Blog API</h2>
          
          <div className="bg-white border rounded-lg p-6 mb-4">
            <h3 className="text-xl font-semibold mb-2">GET /api/blog</h3>
            <p className="text-gray-600 mb-4">Get list of published blog posts</p>
            
            <h4 className="font-semibold mb-2">Query Parameters:</h4>
            <ul className="list-disc pl-6 mb-4">
              <li><code>page</code> - Page number (default: 1)</li>
              <li><code>limit</code> - Posts per page (default: 10, max: 100)</li>
              <li><code>status</code> - Filter by status (DRAFT, PUBLISHED, ARCHIVED)</li>
              <li><code>authorId</code> - Filter by author ID</li>
            </ul>

            <h4 className="font-semibold mb-2">Example:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
{`GET /api/blog?page=1&limit=10

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Blog Post Title",
      "slug": "blog-post-title",
      "excerpt": "Short description...",
      "thumbnail": "https://...",
      "status": "PUBLISHED",
      "publishedAt": "2025-11-06T...",
      "author": {
        "id": "uuid",
        "username": "admin",
        "email": "admin@example.com"
      }
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}`}</pre>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">GET /api/blog/[slug]</h3>
            <p className="text-gray-600 mb-4">Get single blog post by slug</p>
            
            <h4 className="font-semibold mb-2">Example:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
{`GET /api/blog/my-first-post

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "My First Post",
    "slug": "my-first-post",
    "content": "Full content here...",
    "excerpt": "Short description...",
    "thumbnail": "https://...",
    "status": "PUBLISHED",
    "publishedAt": "2025-11-06T...",
    "createdAt": "2025-11-06T...",
    "author": { ... }
  }
}`}</pre>
          </div>
        </section>

        {/* Categories API */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">🏷️ Categories API</h2>
          
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">GET /api/categories</h3>
            <p className="text-gray-600 mb-4">Get all active categories</p>
            
            <h4 className="font-semibold mb-2">Query Parameters:</h4>
            <ul className="list-disc pl-6 mb-4">
              <li><code>tree=true</code> - Get hierarchical tree structure</li>
            </ul>

            <h4 className="font-semibold mb-2">Example:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
{`GET /api/categories?tree=true

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Technology",
      "slug": "technology",
      "children": [
        {
          "id": "uuid",
          "name": "Web Development",
          "slug": "web-development"
        }
      ],
      "_count": {
        "posts": 15
      }
    }
  ]
}`}</pre>
          </div>
        </section>

        {/* Tags API */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">🔖 Tags API</h2>
          
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">GET /api/tags</h3>
            <p className="text-gray-600 mb-4">Get all tags</p>
            
            <h4 className="font-semibold mb-2">Query Parameters:</h4>
            <ul className="list-disc pl-6 mb-4">
              <li><code>popular=true</code> - Get most used tags</li>
              <li><code>limit</code> - Number of tags (default: 20)</li>
            </ul>

            <h4 className="font-semibold mb-2">Example:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
{`GET /api/tags?popular=true&limit=10

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Next.js",
      "slug": "nextjs",
      "_count": {
        "posts": 25
      }
    }
  ]
}`}</pre>
          </div>
        </section>

        {/* Pages API */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">📄 Pages API</h2>
          
          <div className="bg-white border rounded-lg p-6 mb-4">
            <h3 className="text-xl font-semibold mb-2">GET /api/pages</h3>
            <p className="text-gray-600 mb-4">Get list of published pages</p>
            
            <h4 className="font-semibold mb-2">Query Parameters:</h4>
            <ul className="list-disc pl-6 mb-4">
              <li><code>page</code> - Page number (default: 1)</li>
              <li><code>limit</code> - Pages per page (default: 10)</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">GET /api/pages/[slug]</h3>
            <p className="text-gray-600 mb-4">Get single page with blocks</p>
            
            <h4 className="font-semibold mb-2">Example:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
{`GET /api/pages/about-us

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "About Us",
    "slug": "about-us",
    "blocks": [
      {
        "id": "uuid",
        "type": "hero",
        "name": "Hero Section",
        "content": { ... },
        "order": 0
      }
    ]
  }
}`}</pre>
          </div>
        </section>

        {/* Settings API */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">⚙️ Settings API</h2>
          
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">GET /api/settings</h3>
            <p className="text-gray-600 mb-4">Get public settings</p>
            
            <h4 className="font-semibold mb-2">Query Parameters:</h4>
            <ul className="list-disc pl-6 mb-4">
              <li><code>group</code> - Filter by group (seo, social, general)</li>
              <li><code>metadata=true</code> - Get website metadata</li>
            </ul>

            <h4 className="font-semibold mb-2">Example:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
{`GET /api/settings?metadata=true

Response:
{
  "success": true,
  "data": {
    "title": "Innerbright",
    "description": "Website description",
    "keywords": "keyword1, keyword2",
    "logo": "https://...",
    "favicon": "https://..."
  }
}`}</pre>
          </div>
        </section>

        {/* Error Responses */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">❌ Error Responses</h2>
          
          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold mb-2">404 Not Found:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto mb-4">
{`{
  "error": "Post not found"
}`}</pre>

            <h4 className="font-semibold mb-2">400 Bad Request:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto mb-4">
{`{
  "error": "Invalid pagination parameters"
}`}</pre>

            <h4 className="font-semibold mb-2">500 Internal Server Error:</h4>
            <pre className="bg-gray-50 p-4 rounded overflow-x-auto">
{`{
  "error": "Internal server error"
}`}</pre>
          </div>
        </section>

        {/* Rate Limiting */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">🚦 Rate Limiting</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-yellow-800">
              Currently no rate limiting is implemented. In production, consider adding rate limiting
              to prevent abuse.
            </p>
          </div>
        </section>

        {/* CORS */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">🌐 CORS</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800">
              All API endpoints support CORS. You can make requests from any origin.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
